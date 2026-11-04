import { useEffect, useRef, useState, type RefObject } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDocumentAsync } from 'expo-document-picker';
import { RecruitmentPreviewFrame } from './RecruitmentPreviewFrame';
import { useRecruitmentEditor, type RecruitmentEditorHandle } from './useRecruitmentEditor';
import type { ArticleBlockHtml } from './recruitmentBlockHtml';
import { AppInput, AppTextArea } from '@/components/form';

export type { RecruitmentEditorHandle } from './useRecruitmentEditor';

type LegacyBlock = { kind: string; text: string; url: string; bold: boolean };
export const MAX_ARTICLE_HTML = 200_000;

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function webUrl(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function articleHtml(saved: { articleHtml?: string; blocks?: LegacyBlock[]; description?: string }) {
  if (saved.articleHtml) return saved.articleHtml;
  if (!saved.blocks?.length) {
    return saved.description ? `<p>${escapeHtml(saved.description).replace(/\r?\n/g, '<br>')}</p>` : '';
  }
  return saved.blocks.map(block => {
    const text = escapeHtml(block.text).replace(/\r?\n/g, '<br>');
    const content = block.bold ? `<strong>${text}</strong>` : text;
    const url = webUrl(block.url);
    switch (block.kind) {
      case 'heading': return `<h2>${text}</h2>`;
      case 'bullet': return `<ul><li><p>${content}</p></li></ul>`;
      case 'quote': return `<blockquote><p>${content}</p></blockquote>`;
      case 'image': return url ? `<p><img src="${escapeHtml(url)}" width="320" height="180" alt="${escapeHtml(block.text)}"></p>${text ? `<p>${text}</p>` : ''}` : `<p>${text}</p>`;
      case 'link': return url ? `<p><a href="${escapeHtml(url)}">${text || escapeHtml(url)}</a></p>` : `<p>${text}</p>`;
      default: return `<p>${content}</p>`;
    }
  }).join('');
}

function scriptValue(value: string) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function documentHtml(html: string, commonCss: string, articleCss: string) {
  return `<!doctype html><html lang="ja"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-article'; style-src 'unsafe-inline'; img-src https: http:; base-uri 'none'; form-action 'none'">
<style>
body{margin:0;padding:10px;color:#18334f;font:16px/1.6 system-ui,sans-serif;overflow-wrap:anywhere}
img{max-width:100%;height:auto}#body{min-height:200px;padding:8px;border-radius:8px}
[contenteditable]{border:1px solid #cad8e9}#toolbar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
button{font:inherit;background:#eef5ff;border:1px solid #cad8e9;border-radius:6px;color:#18334f;padding:4px 8px}
</style>
<div id="body"></div>
<script nonce="article">
const editor=document.getElementById('body');
const tags=new Set('P DIV BR STRONG B EM I U S STRIKE DEL BLOCKQUOTE H1 H2 H3 H4 H5 H6 UL OL LI A IMG PRE CODE'.split(' '));
function url(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)&&!u.username&&!u.password?u.href:''}catch{return ''}}
function sanitize(value){
 const template=document.createElement('template');template.innerHTML=value;
 for(const el of template.content.querySelectorAll('*')){
  if(!tags.has(el.tagName)){if(['SCRIPT','STYLE','SVG','MATH','IFRAME','OBJECT'].includes(el.tagName))el.remove();else el.replaceWith(...el.childNodes);continue}
  for(const attr of [...el.attributes]){
   const key=attr.name;
   if((el.tagName==='IMG'&&key==='src')||(el.tagName==='A'&&key==='href')){
    const clean=url(attr.value);if(clean)el.setAttribute(key,clean);else el.removeAttribute(key);
   }else if(!(el.tagName==='IMG'&&['alt','width','height'].includes(key))&&!(el.tagName==='OL'&&key==='start'))el.removeAttribute(key);
  }
 }
 return template.innerHTML;
}
editor.innerHTML=sanitize(${scriptValue(html)});

function applyCss(source) {
 if (!source || typeof CSSStyleSheet === 'undefined' || typeof CSSStyleSheet.prototype.replaceSync !== 'function') return;
 const sheet = new CSSStyleSheet();
 sheet.replaceSync(source);
 const formatting = /^(color|background-color|font(-[a-z-]+)?|line-height|letter-spacing|word-spacing|white-space|overflow-wrap|word-break|text-(align|indent|transform|decoration(-[a-z-]+)?|shadow)|margin(-[a-z-]+)?|padding(-[a-z-]+)?|border(-[a-z-]+)?|box-shadow|list-style-(type|position)|(?:min-|max-)?(?:width|height)|object-fit|vertical-align)$/;
 function clean(rules) {
  return Array.from(rules, rule => {
   if (rule.type === CSSRule.MEDIA_RULE) {
    return '@media ' + rule.conditionText + '{' + clean(rule.cssRules) + '}';
   }
   if (rule.type !== CSSRule.STYLE_RULE) return '';
   for (const name of Array.from(rule.style)) {
    const value = rule.style.getPropertyValue(name);
    if (!formatting.test(name) || name.startsWith('border-image') || value.includes(String.fromCharCode(92)) ||
        /(?:url|src|image|paint|var|attr|expression)\\s*\\(/i.test(value)) {
     rule.style.removeProperty(name);
    }
   }
   return rule.selectorText + '{' + rule.style.cssText + '}';
  }).join('');
 }
 const style = document.createElement('style');
 style.textContent = clean(sheet.cssRules);
 document.head.appendChild(style);
}
applyCss(${scriptValue(commonCss)});
applyCss(${scriptValue(articleCss)});
document.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault()});
</script></html>`;
}

export function RecruitmentArticle({ html, commonCss = '', articleCss = '' }: {
  html: string; commonCss?: string; articleCss?: string;
}) {
  const [preview, setPreview] = useState(html);
  useEffect(() => {
    const timer = setTimeout(() => setPreview(html), 180);
    return () => clearTimeout(timer);
  }, [html]);
  return <RecruitmentPreviewFrame html={documentHtml(preview, commonCss, articleCss)} />;
}

export function RecruitmentArticleEditor({ initialHtml, disabled, onChange, editorRef, uploadImage }: {
  initialHtml: string; disabled: boolean; onChange: (html: string) => void;
  editorRef: RefObject<RecruitmentEditorHandle | null>;
  uploadImage: (data: FormData) => Promise<string>;
}) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const { editor, surface } = useRecruitmentEditor(initialHtml, disabled, onChangeRef);
  const [insert, setInsert] = useState<'image' | 'link' | null>(null);
  const [blocksOpen, setBlocksOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [linkText, setLinkText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [htmlBlock, setHtmlBlock] = useState<ArticleBlockHtml | null>(null);
  const [htmlSource, setHtmlSource] = useState('');

  async function openBlockHtml() {
    if (!editor) return;
    await applyInsert(async () => {
      const block = await editor.editBlock();
      setHtmlSource(block.original);
      setHtmlBlock(block);
    });
  }

  async function applyBlockHtml() {
    if (!editor || !htmlBlock) return;
    await applyInsert(async () => {
      if (htmlSource !== htmlBlock.original) {
        await editor.editBlock(htmlBlock, htmlSource);
        onChangeRef.current(await editor.getHTML());
      }
      setHtmlBlock(null);
    });
  }

  function changeInsert(mode: typeof insert) {
    setInsert(mode);
    setUrl('');
    setLinkText('');
    setError('');
  }


  useEffect(() => {
    editorRef.current = editor && { getHTML: async () => {
      if (htmlBlock || submittingRef.current) throw new Error('ブロックの編集を確定してから保存してください。');
      return editor.getHTML();
    } };
    return () => { editorRef.current = null; };
  }, [editor, editorRef, htmlBlock]);

  const tools = [
    ['太字', 'format-bold', () => editor?.toggleBold()],
    ['斜体', 'format-italic', () => editor?.toggleItalic()],
    ['下線', 'format-underline', () => editor?.toggleUnderline()],
    ['リンク', 'link-variant', () => changeInsert('link')],
    ['元に戻す', 'undo', () => editor?.undo()],
    ['やり直す', 'redo', () => editor?.redo()],
  ] as const;

  const blocks = [
    ['段落を追加', 'format-paragraph', '<p></p>'],
    ['見出しを追加', 'format-header-2', '<h2></h2>'],
    ['箇条書きを追加', 'format-list-bulleted', '<ul><li><p></p></li></ul>'],
    ['番号付きリストを追加', 'format-list-numbered', '<ol><li><p></p></li></ol>'],
    ['引用を追加', 'format-quote-close', '<blockquote><p></p></blockquote>'],
  ] as const;

  async function applyInsert(action: () => Promise<void>) {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError('');
    try {
      await action();
      changeInsert(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '挿入できませんでした。');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  async function insertUrl() {
    if (!editor) return;
    await applyInsert(async () => {
      const safe = webUrl(url.trim());
      if (!safe) throw new Error('HTTPまたはHTTPSのURLを入力してください。');
      if (insert === 'image') {
        editor.setImage(safe);
      } else if (linkText.trim()) {
        editor.insertContent(`<a href="${escapeHtml(safe)}">${escapeHtml(linkText.trim())}</a>`);
      } else {
        if (!(await editor.getSelectedText()).trim()) {
          throw new Error('表示名を入力するか、本文のリンクにしたい文字を選択してください。');
        }
        editor.setLink(safe);
      }
    });
  }

  async function chooseImage() {
    if (!editor) return;
    await applyInsert(async () => {
      const result = await getDocumentAsync({
        type: ['image/jpeg', 'image/png'], copyToCacheDirectory: true, base64: false,
      });
      const file = result.assets?.[0];
      if (!file) return;
      try {
        if (file.size !== undefined && file.size > 5 * 1024 * 1024) {
          throw new Error('画像は5MB以内にしてください。');
        }
        const form = new FormData();
        if (file.file) {
          form.append('image', file.file);
        } else {
          form.append('image', {
            uri: file.uri, name: file.name, type: file.mimeType || 'application/octet-stream',
          } as unknown as Blob);
        }
        editor.setImage(await uploadImage(form));
      } finally {
        if (file.file && file.uri.startsWith('blob:')) URL.revokeObjectURL(file.uri);
      }
    });
  }

  const inactive = disabled || !editor || submitting || !!htmlBlock;
  return <View style={styles.panel}>
    <View style={styles.toolbar}>
      <EditorIcon label={blocksOpen ? 'ブロック一覧を閉じる' : 'ブロックを追加'}
        icon={blocksOpen ? 'close' : 'plus'} disabled={inactive} active={blocksOpen}
        onPress={() => setBlocksOpen(open => !open)} />
      <EditorIcon label="選択したブロックをHTMLで編集" icon="code-tags" disabled={inactive}
        onPress={() => void openBlockHtml()} />
      <View style={styles.divider} />
      {tools.map(([label, icon, action]) => <EditorIcon key={label}
        label={label} icon={icon} disabled={inactive} onPress={action} />)}
    </View>
    {blocksOpen && <View style={styles.blockPicker}>
      {blocks.map(([label, icon, html]) => <EditorIcon key={label}
        label={label} icon={icon} disabled={inactive} onPress={() => {
          editor?.insertContent(html);
          setBlocksOpen(false);
        }} />)}
      <EditorIcon label="画像を追加" icon="image-outline" disabled={inactive} onPress={() => {
        changeInsert('image');
        setBlocksOpen(false);
      }} />
    </View>}
    {insert && <View style={styles.urlForm}>
      {insert === 'image' && <Pressable accessibilityRole="button" disabled={inactive}
        style={[styles.uploadButton, inactive && styles.disabledIcon]} onPress={() => void chooseImage()}>
        <MaterialCommunityIcons name="upload" size={20} color="#18334F" />
        <Text style={styles.uploadText}>端末から画像を選ぶ（JPEG・PNG、5MBまで）</Text>
      </Pressable>}
      {insert === 'link' && <AppInput label="リンクの表示名（任意）" value={linkText} onChangeText={setLinkText}
        placeholder="空欄なら選択中の文字を使う" maxLength={240} editable={!inactive} />}
      <AppInput label={insert === 'image' ? '画像の公開URL' : 'リンクURL'} value={url} onChangeText={setUrl}
        editable={!inactive} maxLength={2048} autoCapitalize="none" keyboardType="url" />
      {!!error && <Text accessibilityRole="alert">{error}</Text>}
      <View style={styles.urlActions}>
        <EditorIcon label="挿入" icon="check" disabled={inactive} onPress={insertUrl} />
        <EditorIcon label="キャンセル" icon="close" disabled={submitting} onPress={() => changeInsert(null)} />
      </View>
    </View>}
    {htmlBlock && <View style={styles.urlForm}>
      <AppTextArea label="選択したブロックのHTML" value={htmlSource} onChangeText={setHtmlSource}
        editable={!disabled && !submitting} maxLength={MAX_ARTICLE_HTML} autoCapitalize="none" autoCorrect={false} />
      <View style={styles.urlActions}>
        <EditorIcon label="HTMLを反映してビジュアルに戻る" icon="check"
          disabled={disabled || submitting} onPress={() => void applyBlockHtml()} />
        <EditorIcon label="HTML編集を取り消す" icon="close" disabled={submitting}
          onPress={() => { setHtmlBlock(null); setError(''); }} />
      </View>
    </View>}
    {!insert && !!error && <Text accessibilityRole="alert">{error}</Text>}
    <View style={[styles.surface, htmlBlock && { display: 'none' }]}>{surface}</View>
  </View>;
}

function EditorIcon({ label, icon, onPress, disabled, active }: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const showLabel = !disabled && (hovered || focused);

  return <View style={showLabel && styles.tooltipAnchor}>
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ disabled, expanded: active }} disabled={disabled}
      onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onPress={onPress} style={({ pressed }) => [
        styles.icon, (active || pressed || showLabel) && styles.activeIcon, disabled && styles.disabledIcon,
      ]}>
      <MaterialCommunityIcons name={icon} size={21} color="#18334F" />
    </Pressable>
    {showLabel && <View pointerEvents="none" accessible={false} style={styles.tooltip}>
      <Text numberOfLines={1} style={styles.tooltipText}>{label}</Text>
    </View>}
  </View>;
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderColor: '#CAD8E9', borderRadius: 10, backgroundColor: '#FFF' },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 6, zIndex: 3,
    borderBottomWidth: 1, borderBottomColor: '#E0E8F3' },
  divider: { width: 1, backgroundColor: '#CAD8E9', marginHorizontal: 5, marginVertical: 8 },
  blockPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 6, zIndex: 2,
    backgroundColor: '#F1F6FD', borderBottomWidth: 1, borderBottomColor: '#E0E8F3' },
  icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  activeIcon: { backgroundColor: '#DFECFC' },
  disabledIcon: { opacity: 0.45 },
  tooltipAnchor: { zIndex: 1 },
  tooltip: { position: 'absolute', top: 46, left: 0, width: 164, alignItems: 'flex-start' },
  tooltipText: { color: '#FFF', backgroundColor: '#18334F', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 4, fontSize: 12 },
  urlForm: { padding: 10, gap: 6, zIndex: 1 },
  uploadButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 9, backgroundColor: '#E9F2FE', borderRadius: 6 },
  uploadText: { flex: 1, color: '#18334F', fontWeight: '600' },
  urlActions: { flexDirection: 'row', gap: 4 },
  surface: { height: 390, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, overflow: 'hidden' },
});

import { createElement, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

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

export type RecruitmentEditorHandle = { getHTML: () => Promise<string> };

function documentHtml(html: string, edit: boolean) {
  const initial = JSON.stringify(html).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `<!doctype html><html lang="ja"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-article'; style-src 'unsafe-inline'; img-src https: http:; base-uri 'none'; form-action 'none'">
<style>
body{margin:0;padding:10px;color:#18334f;font:16px/1.6 system-ui,sans-serif;overflow-wrap:anywhere}
img{max-width:100%;height:auto}#body{min-height:200px;padding:8px;border-radius:8px}
[contenteditable]{border:1px solid #cad8e9}#toolbar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
button{font:inherit;background:#eef5ff;border:1px solid #cad8e9;border-radius:6px;color:#18334f;padding:4px 8px}
</style>
<div id="toolbar" ${edit ? '' : 'hidden style="display:none"'}>
<button data-command="bold">太字</button><button data-command="italic">斜体</button>
<button data-command="underline">下線</button><button data-command="heading">見出し</button>
<button data-command="insertUnorderedList">箇条書き</button><button data-command="insertOrderedList">番号付き</button>
<button data-command="image">画像URL</button></div>
<div id="body" ${edit ? 'contenteditable="true" role="textbox" aria-multiline="true" aria-label="募集内容"' : ''}></div>
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
editor.innerHTML=sanitize(${initial});
function send(){
 const value=JSON.stringify({type:'recruitment-html',html:sanitize(editor.innerHTML)});
 if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(value);else parent.postMessage(value,'*');
}
editor.addEventListener('input',send);
editor.addEventListener('paste',event=>{
 event.preventDefault();
 document.execCommand('insertText',false,event.clipboardData?.getData('text/plain')||'');send();
});
document.addEventListener('click',event=>{if(event.target.closest('a'))event.preventDefault()});
editor.addEventListener('drop',event=>event.preventDefault());
document.querySelectorAll('[data-command]').forEach(button=>{
 button.onmousedown=event=>event.preventDefault();
 button.onclick=()=>{
  const cmd=button.dataset.command;
  if(cmd==='image'){
   const src=url(prompt('画像の公開URL')||'');
   if(src){editor.focus();document.execCommand('insertImage',false,src)}
  }else{
   editor.focus();
   if(cmd==='heading')document.execCommand('formatBlock',false,'h2');else document.execCommand(cmd,false,null);
  }
  send();
 };
});
</script></html>`;
}

function ArticleFrame({ html, editable = false, onChange }: {
  html: string; editable?: boolean; onChange?: (html: string) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const source = useMemo(() => ({ html: documentHtml(html, editable) }), [html, editable]);
  function receive(raw: unknown) {
    if (typeof raw !== 'string' || !onChange) return;
    try {
      const message = JSON.parse(raw);
      if (message.type === 'recruitment-html' && typeof message.html === 'string') onChange(message.html);
    } catch { /* Ignore unrelated bridge messages. */ }
  }
  useEffect(() => {
    if (Platform.OS !== 'web' || !editable) return;
    const listener = (event: MessageEvent) => {
      if (event.source === frame.current?.contentWindow) receive(event.data);
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [editable, onChange]);
  if (Platform.OS === 'web') return createElement('iframe', {
    ref: frame, title: editable ? '募集内容エディタ' : '募集内容プレビュー', srcDoc: source.html,
    sandbox: editable ? 'allow-scripts allow-modals' : 'allow-scripts',
    style: { width: '100%', height: editable ? 350 : 280, border: 0 },
  });
  return <View style={{ height: editable ? 350 : 280 }}>
    <WebView source={source} originWhitelist={['*']} onMessage={event => receive(event.nativeEvent.data)}
      onShouldStartLoadWithRequest={request => request.url === 'about:blank'}
      allowFileAccess={false} mixedContentMode="never" />
  </View>;
}

export function RecruitmentArticle({ html }: { html: string }) {
  const [preview, setPreview] = useState(html);
  useEffect(() => {
    const timer = setTimeout(() => setPreview(html), 180);
    return () => clearTimeout(timer);
  }, [html]);
  return <ArticleFrame html={preview} />;
}

export function RecruitmentArticleEditor({ initialHtml, disabled, onChange, editorRef }: {
  initialHtml: string; disabled: boolean; onChange: (html: string) => void;
  editorRef: RefObject<RecruitmentEditorHandle | null>;
}) {
  const latest = useRef(initialHtml);
  useEffect(() => {
    editorRef.current = { getHTML: async () => latest.current };
    return () => { editorRef.current = null; };
  }, [editorRef]);
  return <View pointerEvents={disabled ? 'none' : 'auto'}>
    <ArticleFrame html={initialHtml} editable onChange={html => {
      latest.current = html;
      onChange(html);
    }} />
  </View>;
}

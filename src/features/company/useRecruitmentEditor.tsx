import { useEffect, useRef, type RefObject } from 'react';
import { PlaceholderBridge, TenTapStartKit, RichText, useEditorBridge, useEditorContent } from '@10play/tentap-editor';

import type { ArticleBlockHtml } from './recruitmentBlockHtml';
import { editArticleBlockScript } from './recruitmentBlockHtmlScript';
import { recruitmentEditorCss, recruitmentPlaceholder } from './recruitmentEditorStyle';

const bridges = TenTapStartKit.map(bridge => bridge === PlaceholderBridge
  ? bridge.configureExtension({ placeholder: recruitmentPlaceholder })
  : bridge);

export type RecruitmentEditorHandle = { getHTML: () => Promise<string> };

export function useRecruitmentEditor(
  initialHtml: string,
  disabled: boolean,
  onChange: RefObject<(html: string) => void>,
) {
  const editor = useEditorBridge({ initialContent: initialHtml, bridgeExtensions: bridges, autofocus: false, avoidIosKeyboard: false });
  const html = useEditorContent(editor, { type: 'html', debounceInterval: 80 });

  useEffect(() => {
    if (html !== undefined) onChange.current(html);
  }, [html, onChange]);
  useEffect(() => { editor.setEditable(!disabled); }, [disabled, editor]);

  useEffect(() => {
    editor.injectCSS(recruitmentEditorCss, 'recruitment-visual');
  }, [editor]);

  const pending = useRef<((result: { value?: ArticleBlockHtml; error?: string }) => void) | null>(null);
  function editBlock(block?: ArticleBlockHtml, source?: string) {
    return new Promise<ArticleBlockHtml>((resolve, reject) => {
      const webview = editor.webviewRef.current;
      if (!webview || pending.current) {
        reject(new Error('エディタの読み込み完了後に再試行してください。'));
        return;
      }
      const timer = setTimeout(() => {
        pending.current = null;
        reject(new Error('エディタから応答がありませんでした。'));
      }, 3000);
      pending.current = result => {
        clearTimeout(timer);
        pending.current = null;
        if (result.value) resolve(result.value);
        else reject(new Error(result.error || 'ブロックを編集できませんでした。'));
      };
      webview.injectJavaScript(`
        (() => {
          let result;
          try {
            const editor = document.querySelector('.tiptap')?.editor;
            ${editArticleBlockScript}
            result = { value: editArticleBlock(editor, ${JSON.stringify(block)}, ${JSON.stringify(source)}) };
          } catch (error) { result = { error: error.message }; }
          window.ReactNativeWebView.postMessage(JSON.stringify({ recruitmentBlock: result }));
        })(); true;
      `);
    });
  }

  return {
    editor: { ...editor, editBlock },
    surface: <RichText editor={editor} exclusivelyUseCustomOnMessage={false} onMessage={event => {
      try {
        const message = JSON.parse(event.nativeEvent.data);
        if (message.recruitmentBlock) pending.current?.(message.recruitmentBlock);
      } catch { /* TenTap handles its own messages. */ }
    }} />,
  };
}

import { useEffect, type RefObject } from 'react';
import { PlaceholderBridge, TenTapStartKit, RichText, useEditorBridge, useEditorContent } from '@10play/tentap-editor';

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

  return { editor, surface: <RichText editor={editor} /> };
}

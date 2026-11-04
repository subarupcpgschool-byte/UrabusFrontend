import type {} from '@tiptap/starter-kit';
import type {} from '@tiptap/extension-image';
import { useEffect, useMemo, type RefObject } from 'react';
import { EditorContent, PlaceholderBridge, TenTapStartKit, useEditor } from '@10play/tentap-editor/web';

import { editArticleBlock, type ArticleBlockHtml } from './recruitmentBlockHtml';
import { recruitmentEditorCss, recruitmentPlaceholder } from './recruitmentEditorStyle';

export type RecruitmentEditorHandle = { getHTML: () => Promise<string> };

const extensions = TenTapStartKit.flatMap(bridge => bridge.configureTiptapExtensionsOnRunTime(
  bridge === PlaceholderBridge ? { placeholder: recruitmentPlaceholder } : undefined,
))
  .filter(extension => extension !== undefined);

export function useRecruitmentEditor(
  initialHtml: string,
  disabled: boolean,
  onChange: RefObject<(html: string) => void>,
) {
  const webEditor = useEditor({
    extensions,
    content: initialHtml,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: { attributes: { 'aria-label': '募集内容', role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor }) => onChange.current(editor.getHTML()),
  });

  useEffect(() => { webEditor?.setEditable(!disabled, false); }, [disabled, webEditor]);

  const editor = useMemo(() => webEditor && ({
    editBlock: async (block?: ArticleBlockHtml, source?: string) => editArticleBlock(webEditor, block, source),
    getHTML: async () => webEditor.getHTML(),
    toggleBold: () => webEditor.chain().focus().toggleBold().run(),
    toggleItalic: () => webEditor.chain().focus().toggleItalic().run(),
    toggleUnderline: () => webEditor.chain().focus().toggleUnderline().run(),
    insertContent: (html: string) => webEditor.chain().focus().insertContent(html).run(),
    undo: () => webEditor.chain().focus().undo().run(),
    redo: () => webEditor.chain().focus().redo().run(),
    setImage: (src: string) => webEditor.chain().focus().setImage({ src }).run(),
    getSelectedText: async () => {
      const { from, to } = webEditor.state.selection;
      return webEditor.state.doc.textBetween(from, to, '\n');
    },
    setLink: (href: string) => webEditor.chain().focus().extendMarkRange('link').setLink({ href }).run(),
  }), [webEditor]);

  return {
    editor,
    surface: <div className="recruitment-editor-web" style={{ height: '100%', overflow: 'auto' }}>
      <style>{`
        ${recruitmentEditorCss}
        .recruitment-editor-web .tiptap { min-height: 390px; padding: 20px; outline: none; }
      `}</style>
      <EditorContent editor={webEditor} />
    </div>,
  };
}

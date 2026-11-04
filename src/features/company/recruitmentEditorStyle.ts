export const recruitmentPlaceholder = '募集内容を入力するか、「＋」からブロックを追加';

export const recruitmentEditorCss = `
  .tiptap { color: #18334f; font: 16px/1.7 system-ui, sans-serif; overflow-wrap: anywhere; }
  .tiptap > * { margin: 0 0 16px; }
  .tiptap h2 { font-size: 1.55em; line-height: 1.35; }
  .tiptap ul, .tiptap ol { padding-inline-start: 1.65em; }
  .tiptap li p, .tiptap blockquote p { margin: 0; }
  .tiptap blockquote { border-inline-start: 3px solid #88a9d5; padding-inline-start: 14px; }
  .tiptap img { display: block; max-width: 100%; height: auto; border-radius: 6px; }
  .tiptap .is-editor-empty:first-child::before {
    color: #596d83;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

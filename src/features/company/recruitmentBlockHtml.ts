import type { Editor } from '@10play/tentap-editor/web';

export type ArticleBlockHtml = { index: number; original: string };

// Also runs inside the native editor WebView. Keep this function self-contained.
export function editArticleBlock(editor: Editor, block?: ArticleBlockHtml, source?: string): ArticleBlockHtml {
  const { doc, selection } = editor.state;
  const index = block?.index ?? selection.$from.index(0);
  const template = document.createElement('template');
  template.innerHTML = editor.getHTML();
  const original = template.content.children[index]?.outerHTML;
  if (!original || index >= doc.childCount) throw new Error('本文で編集したいブロックを選んでください。');
  if (!block) return { index, original };
  if (original !== block.original) throw new Error('ブロックが変更されました。選び直してください。');

  template.innerHTML = (source ?? '').trim();
  const root = template.content.firstElementChild;
  const blocks = /^(P|H[1-6]|UL|OL|BLOCKQUOTE|IMG|PRE)$/;
  const tags = /^(P|H[1-6]|UL|OL|LI|BLOCKQUOTE|IMG|PRE|CODE|BR|STRONG|B|EM|I|U|S|STRIKE|DEL|A)$/;
  if (!root || !blocks.test(root.tagName) || template.content.childNodes.length !== 1) {
    throw new Error('段落や見出しなど、HTMLのブロックを1つ入力してください。');
  }
  for (const element of Array.from(template.content.querySelectorAll('*'))) {
    if (!tags.test(element.tagName)) throw new Error('対応していないHTMLタグが含まれています。');
    for (const attribute of Array.from(element.attributes)) {
      const { name, value } = attribute;
      if ((element.tagName === 'A' && name === 'href') || (element.tagName === 'IMG' && name === 'src')) {
        let url: URL;
        try { url = new URL(value); } catch { throw new Error('リンクと画像にはHTTPまたはHTTPSのURLを指定してください。'); }
        if (!/^https?:$/.test(url.protocol) || url.username || url.password) {
          throw new Error('リンクと画像にはHTTPまたはHTTPSのURLを指定してください。');
        }
      } else if (element.tagName === 'A' && (name === 'target' || name === 'rel')) {
        element.removeAttribute(name);
      } else if (!(element.tagName === 'IMG' && /^(alt|width|height)$/.test(name)) &&
                 !(element.tagName === 'OL' && name === 'start')) {
        throw new Error('対応していないHTML属性が含まれています。');
      }
    }
  }

  let from = 0;
  for (let i = 0; i < index; i++) from += doc.child(i).nodeSize;
  if (!editor.commands.insertContentAt({ from, to: from + doc.child(index).nodeSize }, root.outerHTML)) {
    throw new Error('HTMLをブロックに反映できませんでした。');
  }
  return { index, original };
}

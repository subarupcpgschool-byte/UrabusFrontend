import { getDocumentAsync } from 'expo-document-picker';
import { File } from 'expo-file-system';

const MAX_CSS_BYTES = 32 * 1024;

export async function pickArticleCss() {
  const result = await getDocumentAsync({ type: ['text/css', 'application/octet-stream'], base64: false });
  const asset = result.assets?.[0];
  if (!asset) return null;

  try {
    if (!asset.name.toLowerCase().endsWith('.css')) {
      throw new Error('拡張子が .css のファイルを選択してください。');
    }
    const file = asset.file ?? new File(asset.uri);
    if (file.size > MAX_CSS_BYTES) throw new Error('CSSファイルは32KB以内にしてください。');
    const css = (await file.text()).trim();
    if (!css || css.includes('\u0000') || css.includes('\uFFFD')) {
      throw new Error('UTF-8の空でないCSSファイルを選択してください。');
    }
    return css;
  } finally {
    if (asset.file && asset.uri.startsWith('blob:')) URL.revokeObjectURL(asset.uri);
  }
}

import { sourceText } from "@/i18n/source";
import { getDocumentAsync } from "expo-document-picker";
import { File } from "expo-file-system";

const MAX_CSS_BYTES = 32 * 1024;

export async function pickArticleCss() {
  const result = await getDocumentAsync({
    type: ["text/css", "application/octet-stream"],
    base64: false,
  });
  const asset = result.assets?.[0];
  if (!asset) return null;

  try {
    if (!asset.name.toLowerCase().endsWith(".css")) {
      throw new Error(sourceText("selectAFileWithTheCssExtension"));
    }
    const file = asset.file ?? new File(asset.uri);
    if (file.size > MAX_CSS_BYTES)
      throw new Error(sourceText("cssFilesMustBeNoLargerThan"));
    const css = (await file.text()).trim();
    if (!css || css.includes("\u0000") || css.includes("\uFFFD")) {
      throw new Error(sourceText("selectANonEmptyUtf8Css"));
    }
    return css;
  } finally {
    if (asset.file && asset.uri.startsWith("blob:"))
      URL.revokeObjectURL(asset.uri);
  }
}

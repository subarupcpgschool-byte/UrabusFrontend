import { getDocumentAsync } from "expo-document-picker";
import { API_BASE } from "@/auth/api";
import { dataRequest } from "@/api/platform";
import { tText } from "@/i18n/display";
export async function uploadPdf(
  path: string,
  token: string,
  fields: Record<string, string> = {},
) {
  const result = await getDocumentAsync({
    type: "application/pdf",
    multiple: false,
  });
  const a = result.assets?.[0];
  if (!a) return false;
  if (a.size && a.size > 10485760) throw Error(tText("hrPdfLimit"));
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  const blob = a.file || (await (await fetch(a.uri)).blob());
  form.append("file", blob, a.name);
  try {
    await dataRequest(path, token, form);
    return true;
  } finally {
    if (a.uri.startsWith("blob:")) URL.revokeObjectURL(a.uri);
  }
}
export async function downloadPrivate(
  path: string,
  token: string,
  name: string,
) {
  const response = await fetch(`${API_BASE}/api/platform-data${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw Error(tText("hrDownloadFailed"));
  const url = URL.createObjectURL(await response.blob());
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

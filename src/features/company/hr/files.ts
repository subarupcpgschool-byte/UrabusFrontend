import { Platform, Share } from "react-native";
import { getDocumentAsync } from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { API_BASE } from "@/auth/api";
import { dataRequest } from "@/api/platform";
import { tText } from "@/i18n/display";
export async function uploadPdf(
  path: string,
  token: string,
  fields: Record<string, string> = {},
) {
  const r = await getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });
  const a = r.assets?.[0];
  if (!a) return false;
  if (a.size && a.size > 10485760) throw Error(tText("hrPdfLimit"));
  const f = new FormData();
  Object.entries(fields).forEach(([k, v]) => f.append(k, v));
  f.append("file", {
    uri: a.uri,
    name: a.name,
    type: "application/pdf",
  } as unknown as Blob);
  await dataRequest(path, token, f);
  return true;
}
export async function downloadPrivate(
  path: string,
  token: string,
  name: string,
) {
  if (!FileSystem.cacheDirectory) throw Error(tText("hrDownloadFailed"));
  const uri =
    FileSystem.cacheDirectory +
    "hr-" +
    Date.now() +
    "-" +
    encodeURIComponent(name);
  try {
    const r = await FileSystem.downloadAsync(
      `${API_BASE}/api/platform-data${path}`,
      uri,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (r.status !== 200) throw Error(tText("hrDownloadFailed"));
    if (Platform.OS === "android") {
      const permission =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permission.granted) return;
      const mime = name.endsWith(".json")
        ? "application/json"
        : "application/pdf";
      const dest = await FileSystem.StorageAccessFramework.createFileAsync(
        permission.directoryUri,
        name,
        mime,
      );
      await FileSystem.writeAsStringAsync(
        dest,
        await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        }),
        { encoding: FileSystem.EncodingType.Base64 },
      );
    } else await Share.share({ url: uri });
  } finally {
    await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
  }
}

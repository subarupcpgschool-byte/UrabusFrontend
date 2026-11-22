import { sourceText } from "@/i18n/source";
import * as FileSystem from "expo-file-system/legacy";
import { API_BASE } from "@/auth/api";
import { dataRequest } from "@/api/platform";
import type { DocumentPickerAsset } from "expo-document-picker";
import type { Attachment } from "./WorkspaceProvider";
export async function saveAttachment(
  asset: DocumentPickerAsset,
  roomId: string,
  token: string,
): Promise<Attachment> {
  const form = new FormData();
  form.append("file", {
    uri: asset.uri,
    name: asset.name,
    type: asset.mimeType || "application/octet-stream",
  } as unknown as Blob);
  return dataRequest<Attachment>(`/rooms/${roomId}/attachments`, token, form);
}
export async function resolveAttachment(attachment: Attachment, token: string) {
  if (!FileSystem.cacheDirectory)
    throw new Error(sourceText("temporaryStorageIsUnavailable"));
  const path =
    FileSystem.cacheDirectory +
    `gw-attachment-${attachment.id}-${Date.now()}-` +
    encodeURIComponent(attachment.name);
  const result = await FileSystem.downloadAsync(
    `${API_BASE}/api/platform-data/attachments/${attachment.id}`,
    path,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (result.status !== 200) {
    await FileSystem.deleteAsync(path, { idempotent: true });
    throw new Error(sourceText("unableToRetrieveTheAttachment"));
  }
  return result.uri;
}
export function releaseAttachment(uri: string) {
  if (uri.startsWith(FileSystem.cacheDirectory + "gw-attachment-"))
    void FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
}

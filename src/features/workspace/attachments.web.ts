import { sourceText } from "@/i18n/source";
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
  const blob = asset.file || (await (await fetch(asset.uri)).blob());
  form.append("file", blob, asset.name);
  return dataRequest<Attachment>(`/rooms/${roomId}/attachments`, token, form);
}
export async function resolveAttachment(
  attachment: Attachment,
  token: string,
): Promise<string> {
  const response = await fetch(
    `${API_BASE}/api/platform-data/attachments/${attachment.id}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok)
    throw new Error(sourceText("unableToRetrieveTheAttachment"));
  return URL.createObjectURL(await response.blob());
}
export function releaseAttachment(uri: string) {
  if (uri.startsWith("blob:")) URL.revokeObjectURL(uri);
}

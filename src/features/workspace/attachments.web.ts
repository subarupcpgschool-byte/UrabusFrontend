import type { DocumentPickerAsset } from 'expo-document-picker';
import type { Attachment } from './WorkspaceProvider';
function database(): Promise<IDBDatabase> { return new Promise((resolve,reject)=>{const request=indexedDB.open('globalworkers-message-files',1);request.onupgradeneeded=()=>request.result.createObjectStore('files');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(new Error('添付ファイルを保存できません。'));}); }
export async function saveAttachment(asset: DocumentPickerAsset): Promise<Attachment> {
 const db=await database(); const id=`${Date.now()}-${Math.random().toString(36).slice(2)}`;
 const blob=asset.file || await (await fetch(asset.uri)).blob();
 await new Promise<void>((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(blob,id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(new Error('添付ファイルを保存できません。端末の空き容量を確認してください。'));tx.onabort=()=>reject(new Error('添付ファイルの保存が中断されました。'));}).finally(()=>db.close());
 return {id,name:asset.name,uri:`indexeddb:${id}`,mime:asset.mimeType||blob.type||'application/octet-stream',size:asset.size||blob.size};
}
export async function resolveAttachment(attachment: Attachment): Promise<string> {
 if(!attachment.uri.startsWith('indexeddb:')) return attachment.uri;
 const db=await database();const blob=await new Promise<Blob>((resolve,reject)=>{const tx=db.transaction('files','readonly');const req=tx.objectStore('files').get(attachment.uri.slice(10));req.onsuccess=()=>req.result?resolve(req.result):reject(new Error('ファイルが見つかりません。'));req.onerror=()=>reject(new Error('ファイルを読み込めません。'));}).finally(()=>db.close());return URL.createObjectURL(blob);
}
export function releaseAttachment(uri:string){if(uri.startsWith('blob:'))URL.revokeObjectURL(uri);}

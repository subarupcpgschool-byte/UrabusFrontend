import { resolveMockAsset } from './mockAssets';
import { MOCK_CSV } from './mockData';
import type { DocumentPickerAsset } from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import type { Attachment } from './WorkspaceProvider';
export async function saveAttachment(asset: DocumentPickerAsset): Promise<Attachment> {
 if(!FileSystem.documentDirectory)throw new Error('ファイルを保存できません。');
 const folder=FileSystem.documentDirectory+'message-attachments/';await FileSystem.makeDirectoryAsync(folder,{intermediates:true});
 const id=`${Date.now()}-${Math.random().toString(36).slice(2)}`;const uri=folder+id+'-'+encodeURIComponent(asset.name);await FileSystem.copyAsync({from:asset.uri,to:uri});
 return {id,name:asset.name,uri,mime:asset.mimeType||'application/octet-stream',size:asset.size||0};
}
export async function resolveAttachment(attachment:Attachment){if(attachment.uri==='mock:csv'){if(!FileSystem.documentDirectory)throw new Error('ファイルを開けません');const path=FileSystem.documentDirectory+'mock-interview.csv';await FileSystem.writeAsStringAsync(path,MOCK_CSV);return path;}if(attachment.uri.startsWith('mock:'))return resolveMockAsset(attachment.uri);return attachment.uri;}
export function releaseAttachment(_uri:string){}

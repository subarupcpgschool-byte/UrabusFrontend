import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import type { Attachment } from './WorkspaceProvider';
import { resolveAttachment, releaseAttachment } from './attachments';
function Video({uri}:{uri:string}){const player=useVideoPlayer(uri);return <VideoView player={player} nativeControls allowsFullscreen contentFit="contain" style={{width:240,maxWidth:'100%',height:160,borderRadius:9}}/>;}
export function AttachmentView({attachment}:{attachment:Attachment}){
 const [uri,setUri]=useState(''),[error,setError]=useState('');
 useEffect(()=>{let active=true;let current='';resolveAttachment(attachment).then(value=>{current=value;if(active)setUri(value);else releaseAttachment(value);}).catch(()=>{if(active)setError('ファイルを読み込めません');});return()=>{active=false;if(current)releaseAttachment(current);};},[attachment.uri]);
 return <View style={{gap:6,maxWidth:'100%'}}>{error?<Text>{error}</Text>:!uri?<Text>読み込み中…</Text>:<>{attachment.mime.startsWith('image/')?<Image source={{uri}} resizeMode="contain" style={{width:240,maxWidth:'100%',height:160,borderRadius:9}}/>:attachment.mime.startsWith('video/')?<Video uri={uri}/>:null}<Pressable accessibilityRole="button" onPress={()=>{void Linking.openURL(uri).catch(()=>setError('この端末ではファイルを開けません'));}}><Text style={{color:'#1748b8',textDecorationLine:'underline'}} numberOfLines={2}>📎 {attachment.name}（{attachment.size<1024*1024 ? `${Math.max(1,Math.ceil(attachment.size/1024))} KB` : `${(attachment.size/1024/1024).toFixed(1)} MB`}）</Text></Pressable></>}</View>;
}

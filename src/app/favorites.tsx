import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import AppPage from '@/components/layout/AppPage';
import { AppButton } from '@/components/ui/AppUI';
import CompanySearchCard from '@/components/search/CompanySearchCard';
import JobSearchCard from '@/components/search/JobSearchCard';
import type { CompanySearchItem, JobSearchItem } from '@/components/search/types';
import { useAuth } from '@/auth/AuthProvider';
import { useWorkspace, type Favorite } from '@/features/workspace/WorkspaceProvider';
export default function FavoritesPage() {
 const [tab, setTab] = useState<Favorite['kind']>('company');
 const { user } = useAuth(); const { favorites, ready, error, openRoom } = useWorkspace();
 return <AppPage title="お気に入り" subtitle="気になる企業や案件を、まとめて確認できます。">
  {!user ? <AppButton label="ログインしてお気に入りを見る" onPress={() => router.push('/auth')} /> : <>
  <View style={s.tabs}>{(['company','job'] as const).map(kind => <Pressable accessibilityRole="tab" accessibilityState={{ selected: tab === kind }} key={kind} onPress={() => setTab(kind)} style={[s.tab,tab===kind && s.active]}><Text style={[s.tabText,tab===kind && {color:'#fff'}]}>{kind==='company'?'企業':'案件'}（{favorites.filter(f=>f.kind===kind).length}）</Text></Pressable>)}</View>
  {!!error && <Text accessibilityRole="alert">{error}</Text>}
  {!ready ? <Text>読み込み中…</Text> : favorites.filter(f=>f.kind===tab).length===0 ? <View style={s.empty}><Text style={s.heading}>お気に入りの{tab==='company'?'企業':'案件'}はまだありません</Text><Text>検索結果のハート・ブックマークから登録できます。</Text><AppButton label={tab==='company'?'企業を探す':'求人を探す'} onPress={()=>router.push(tab==='company'?'/companies':'/jobs')}/></View> : <View style={{gap:16}}>{favorites.filter(f=>f.kind===tab).map(f => <View key={f.key} style={{gap:8}}>{f.kind==='company' ? <View style={s.company}><CompanySearchCard item={f.item as CompanySearchItem} onPressDetail={()=>Alert.alert(f.item.companyName, `${(f.item as CompanySearchItem).industry}\n${f.item.location}\n\n${f.item.description}`)} onPressJobs={()=>router.push('/jobs')}/></View> : <JobSearchCard item={f.item as JobSearchItem} onPressDetail={id=>router.push(`/jobs/${id}` as never)} onPressApply={id=>router.push(`/jobs/${id}/apply` as never)}/>}<View style={{alignItems:'flex-end'}}><AppButton label="メッセージを開く" outline onPress={()=>{const company=f.item.companyName;const id=openRoom(f.kind,String(f.item.id),company,f.kind==='job'?(f.item as JobSearchItem).title:company);router.push({pathname:'/messages',params:{room:id}});}}/></View></View>)}</View>}
  </>}
 </AppPage>;
}
const s=StyleSheet.create({tabs:{flexDirection:'row',gap:8,marginBottom:8},tab:{minWidth:130,padding:14,borderRadius:10,backgroundColor:'#eaf2ff',alignItems:'center'},active:{backgroundColor:'#2563eb'},tabText:{fontWeight:'800',color:'#10284b'},company:{flexDirection:'row'},empty:{padding:28,backgroundColor:'#fff',borderRadius:14,gap:18},heading:{fontSize:18,fontWeight:'800',color:'#10284b'}});

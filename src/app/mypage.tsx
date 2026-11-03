import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { AppButton } from '@/components/ui/AppUI';
import { useAuth } from '@/auth/AuthProvider';
import { useAccount } from '@/features/account/AccountProvider';
import ProfilePanel from '@/features/account/ProfilePanel';
import { ReceivedReviews } from '@/features/account/ReviewPanels';
import { Tabs } from '@/features/account/Tabs';
import MessageWorkspace from '@/features/workspace/MessageWorkspace';

const options=[{value:'profile',label:'プロフィール'},{value:'messages',label:'メッセージ'},{value:'received',label:'受けた評価'}];
export default function MyPage(){
  const {tab}=useLocalSearchParams<{tab?:string}>();
  const current=options.some(o=>o.value===tab)?tab!:'profile';
  const {user}=useAuth();const {ready,error,data,mockMode}=useAccount();
  return <AppPage title="マイページ" subtitle="プロフィール、契約先とのやり取り、評価をまとめて管理します。" role="user" activeMenu="マイページ">
    {mockMode&&<View style={s.banner}><Text style={s.bannerTitle}>サンプルデータで表示中</Text><Text style={s.hint}>契約・評価は架空のサンプルです。プロフィールと記入した評価はこの端末に保存します。</Text></View>}
    {!user&&!mockMode?<AppButton label="ログインしてマイページを開く" onPress={()=>router.push('/auth')}/>:!ready?<Text accessibilityRole={error?'alert':undefined}>{error||'読み込み中…'}</Text>:<>
      <View style={s.identity}><View style={s.avatar}><Text style={s.initial}>{Array.from(data?.profile.familyName||user?.displayName||'U')[0]}</Text></View><View style={{flex:1}}><Text style={s.name}>{[data?.profile.familyName,data?.profile.givenName].filter(Boolean).join(' ')||user?.displayName||'プロフィール未設定'}</Text><Text style={s.hint}>{user?.email || 'サンプルプロフィール'}</Text></View><AppButton label="アカウント設定" outline onPress={()=>router.push('/auth')}/></View>
      <Tabs options={options} value={current} onChange={value=>router.setParams({tab:value})} label="マイページの表示切り替え"/>
      <View style={current==='profile'?undefined:{display:'none'}}><ProfilePanel/></View>
      {current==='messages'&&<MessageWorkspace/>}
      {current==='received'&&<ReceivedReviews/>}
    </>}
  </AppPage>;
}
const s=StyleSheet.create({banner:{padding:16,gap:6,borderRadius:12,backgroundColor:'#EAF2FF'},bannerTitle:{color:'#1748B8',fontWeight:'800'},hint:{color:'#64748B',fontSize:12,lineHeight:20},identity:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:14,backgroundColor:'#FFF',padding:20,borderRadius:14},avatar:{width:58,height:58,borderRadius:29,backgroundColor:'#E5F1FF',alignItems:'center',justifyContent:'center'},initial:{color:'#2563EB',fontSize:24,fontWeight:'800'},name:{fontSize:20,fontWeight:'800',color:'#183455'}});

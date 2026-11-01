import PublishedCompanyEvaluations from '@/features/evaluations/PublishedCompanyEvaluations';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { AppButton, BodyText, Panel, SectionTitle, StatusBadge, TwoColumn } from '@/components/ui/AppUI';
import FavoriteButton from '@/components/search/FavoriteButton';
import { COMPANY_SEARCH_ITEMS, JOB_SEARCH_ITEMS } from '@/components/search/searchData';
import { useWorkspace } from '@/features/workspace/WorkspaceProvider';
import { useAuth } from '@/auth/AuthProvider';

export default function JobDetailPage(){
  const { id = '' }=useLocalSearchParams<{id:string}>();
  const {favorites,openRoom,ready,mockMode}=useWorkspace();const {user}=useAuth();
  const saved=favorites.find(f=>f.kind==='job'&&String(f.item.id)===id);
  const job=JOB_SEARCH_ITEMS.find(j=>String(j.id)===id)??(saved&&'title' in saved.item?saved.item:undefined);
  if(!job)return <AppPage title="求人詳細" subtitle="求人内容を確認できます。"><Panel><BodyText>求人情報が見つかりませんでした。</BodyText><AppButton label="求人検索へ" onPress={()=>router.push('/jobs')}/></Panel></AppPage>;
  const company=COMPANY_SEARCH_ITEMS.find(c=>c.companyName===job.companyName);
  return <AppPage title="求人詳細" subtitle="仕事内容・条件・企業情報を確認できます。"><TwoColumn><View style={s.main}>
    <Panel><View style={s.head}><View style={[s.mark,{backgroundColor:job.markColor}]}><Text style={s.markText}>{job.mark}</Text></View><View style={{flex:1}}><Text style={s.title}>{job.title}</Text>{company?<Pressable accessibilityRole="link" onPress={()=>router.push(`/companies/${company.id}` as never)}><Text style={s.link}>{job.companyName}　› 企業詳細</Text></Pressable>:<Text style={s.sub}>{job.companyName}</Text>}</View></View><View style={s.tags}>{[job.location,job.workStyle,job.employmentType,...job.tags].filter((v,i,a)=>v&&a.indexOf(v)===i).map(label=><StatusBadge key={label} label={label}/>)}</View><Text style={s.salary}>{job.salary}</Text></Panel>
    <Panel><SectionTitle>仕事内容</SectionTitle><BodyText>{job.description}</BodyText></Panel>
    <Panel><SectionTitle>勤務地・働き方</SectionTitle><BodyText>{job.location}　／　{job.workStyle||'要相談'}</BodyText><BodyText>詳しい勤務条件は、応募・面談時に企業へご確認ください。</BodyText></Panel>
  <PublishedCompanyEvaluations company={job.companyName}/></View><View style={s.aside}><Panel><SectionTitle>この求人に応募する</SectionTitle><Text style={s.salary}>{job.salary}</Text><AppButton label="応募する" onPress={()=>router.push(`/jobs/${job.id}/apply` as never)}/><View style={s.head}><FavoriteButton label={job.title} item={job} kind="job"/><Text style={s.sub}>お気に入りに保存</Text></View><AppButton label="この案件について相談" outline onPress={()=>{if(!user&&!mockMode){router.push('/auth');return;}if(ready){const room=openRoom('job',String(job.id),job.companyName,job.title);router.push({pathname:'/mypage',params:{tab:'messages',room}});}}}/>{company&&<AppButton label="企業詳細を見る" outline onPress={()=>router.push(`/companies/${company.id}` as never)}/>}</Panel></View></TwoColumn></AppPage>;
}
const s=StyleSheet.create({main:{flex:2,minWidth:260,gap:13},aside:{flex:1,minWidth:240,gap:13},head:{flexDirection:'row',alignItems:'center',gap:13},mark:{width:58,height:58,borderRadius:10,alignItems:'center',justifyContent:'center'},markText:{color:'#FFF',fontSize:22,fontWeight:'900'},title:{color:'#162033',fontSize:19,fontWeight:'900'},sub:{color:'#64748B',fontSize:12},link:{marginTop:8,color:'#2563EB',fontSize:13},tags:{flexDirection:'row',flexWrap:'wrap',gap:7},salary:{color:'#162033',fontSize:18,fontWeight:'900'}});

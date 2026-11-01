import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { AppButton, BodyText, Panel, SectionTitle, StatCard } from '@/components/ui/AppUI';
import { AppTag } from '@/components/form';
import FavoriteButton from '@/components/search/FavoriteButton';
import JobSearchCard from '@/components/search/JobSearchCard';
import { COMPANY_SEARCH_ITEMS, JOB_SEARCH_ITEMS } from '@/components/search/searchData';
import { useWorkspace } from '@/features/workspace/WorkspaceProvider';
import { useAuth } from '@/auth/AuthProvider';
import { Tabs } from '@/features/account/Tabs';
import { Stars } from '@/features/account/ReviewPanels';
import { parseCompanySnapshot } from '@/features/account/companyNavigation';

const reviewExamples=[{rating:5,date:'2026/10/12',role:'契約終了・エンジニア',comment:'業務内容と期待する成果が明確で、安心して仕事に取り組めました。質問にも丁寧に対応していただきました。'},{rating:4,date:'2026/09/20',role:'契約中・業務委託',comment:'働く時間について相談しやすく、定期的にフィードバックをいただける点が良かったです。'}];
export default function CompanyDetailPage(){
  const {id='',snapshot}=useLocalSearchParams<{id:string;snapshot?:string}>();
  const {favorites,ready,mockMode,openRoom}=useWorkspace();const {user}=useAuth();
  const fixture=COMPANY_SEARCH_ITEMS.find(c=>String(c.id)===id);
  const favorite=favorites.find(f=>f.kind==='company'&&String(f.item.id)===id);
  const company=fixture ?? (favorite?.kind==='company' && 'industry' in favorite.item?favorite.item:undefined) ?? parseCompanySnapshot(snapshot,id);
  const [tab,setTab]=useState('overview');
  if(!company)return <AppPage title="企業詳細" subtitle="企業情報を確認できます。"><Panel><BodyText>企業情報が見つかりませんでした。検索結果からもう一度開いてください。</BodyText><AppButton label="企業検索へ" onPress={()=>router.push('/companies')}/></Panel></AppPage>;
  const jobs=fixture?JOB_SEARCH_ITEMS.filter(j=>j.companyName===company.companyName):[];
  function contact(){if(!user&&!mockMode){router.push('/auth');return;}if(!ready)return;const room=openRoom('company',String(company!.id),company!.companyName,'企業へのお問い合わせ');router.push({pathname:'/mypage',params:{tab:'messages',room}});}
  return <AppPage title="企業詳細" subtitle="企業情報、募集している求人、契約者からの評価を確認できます。">
    {!!fixture&&<View style={s.banner}><Text style={s.bannerText}>企業・求人・評価は画面確認用のサンプルです。</Text></View>}
    <Pressable accessibilityRole="link" onPress={()=>router.push('/companies')}><Text style={s.link}>‹ 企業検索に戻る</Text></Pressable>
    <Panel><View style={s.hero}><View style={[s.mark,{backgroundColor:company.markColor}]}><Text style={s.markText}>{company.mark}</Text></View><View style={s.heading}><Text style={s.title}>{company.companyName}</Text><Text style={s.meta}>{company.industry||'業種未登録'}　／　{company.location||'所在地未登録'}</Text>{!!fixture&&<Stars value={company.rating}/>}</View><FavoriteButton type="heart" label={company.companyName} kind="company" item={company}/></View><BodyText>{company.description||'企業紹介はまだ登録されていません。'}</BodyText>
      <View style={s.actions}><AppButton label="募集求人を見る" onPress={()=>setTab('jobs')}/><AppButton label="企業へメッセージ" outline onPress={contact}/></View>
    </Panel>
    {!!fixture&&<View style={s.stats}><StatCard label="企業評価" value={`${company.rating.toFixed(1)} / 5`}/><StatCard label="公開求人数" value={`${company.openJobCount}件`}/><StatCard label="評価協力率" value={`${company.reviewParticipationRate}%`}/></View>}
    <Tabs label="企業詳細の表示切り替え" value={tab} onChange={setTab} options={[{value:'overview',label:'企業情報'},{value:'jobs',label:'募集求人',count:jobs.length},{value:'reviews',label:'評価・口コミ'}]}/>
    {tab==='overview'&&<View style={s.columns}><View style={s.main}><Panel><SectionTitle>私たちについて</SectionTitle><BodyText>{company.description||'紹介文は未登録です。'}</BodyText>{!!fixture&&<><SectionTitle>大切にしていること</SectionTitle><BodyText>一人ひとりの経験を尊重し、対話を通じて働きやすい環境をつくります。挑戦を支えるチームで、長く安心して働ける関係を目指しています。</BodyText><View style={s.tags}>{['柔軟な働き方','成長をサポート','チームワーク'].map(x=><AppTag key={x} label={x}/>)}</View></>}</Panel>{!!fixture&&<Panel><SectionTitle>働く環境・サポート</SectionTitle><BodyText>入社時のオンボーディング、定期的な面談、スキルアップのための学習支援を用意しています。実際の勤務条件は、各求人をご確認ください。</BodyText></Panel>}</View><View style={s.aside}><Panel><SectionTitle>企業概要</SectionTitle>{[['企業名',company.companyName],['業種',company.industry||'未登録'],['所在地',company.location||'未登録'],['従業員数',company.employeeRange||'未登録']].map(([label,value])=><View key={label} style={s.fact}><Text style={s.meta}>{label}</Text><Text style={s.factValue}>{value}</Text></View>)}</Panel></View></View>}
    {tab==='jobs'&&<View style={{gap:14}}>{!!fixture&&<Text style={s.meta}>公開求人のうち、画面確認用の{jobs.length}件を表示しています。</Text>}{jobs.map(item=><JobSearchCard key={item.id} item={item} onPressDetail={jobId=>router.push(`/jobs/${jobId}` as never)} onPressApply={jobId=>router.push(`/jobs/${jobId}/apply` as never)}/>)}{!jobs.length&&<Panel><BodyText>{fixture?'現在表示できる募集求人はありません。':'この企業の求人情報はまだ取得されていません。'}</BodyText></Panel>}</View>}
    {tab==='reviews'&&<View style={{gap:14}}>{fixture?<><Panel><SectionTitle>契約者からの企業評価</SectionTitle><Stars value={company.rating}/><Text style={s.meta}>集計値・評価例はいずれもサンプルです。</Text>{company.scores.map(score=><View style={s.scoreRow} key={score.label}><Text style={s.metric}>{score.label}</Text><View style={s.bar}><View style={[s.fill,{width:`${score.value*20}%`}]}/></View><Text style={s.meta}>{score.value.toFixed(1)}</Text></View>)}</Panel>{reviewExamples.map((review,i)=><Panel key={i}><Stars value={review.rating}/><Text style={s.meta}>{review.role}　／　{review.date}</Text><BodyText>{review.comment}</BodyText></Panel>)}</>:<Panel><BodyText>この企業の評価情報はまだ取得されていません。</BodyText></Panel>}<AppButton label="契約した企業・案件を評価する" outline onPress={()=>router.push({pathname:'/mypage',params:{tab:'reviews'}})}/></View>}
  </AppPage>;
}
const s=StyleSheet.create({banner:{padding:12,borderRadius:10,backgroundColor:'#EAF2FF'},bannerText:{color:'#1748B8',fontSize:12},link:{color:'#2563EB',fontSize:13},hero:{flexDirection:'row',alignItems:'center',gap:14},mark:{width:62,height:62,borderRadius:16,alignItems:'center',justifyContent:'center'},markText:{color:'#FFF',fontWeight:'800',fontSize:28},heading:{flex:1,minWidth:0,gap:6},title:{fontSize:24,fontWeight:'800',color:'#183455'},meta:{color:'#64748B',fontSize:12,lineHeight:20},actions:{flexDirection:'row',flexWrap:'wrap',gap:10},stats:{flexDirection:'row',flexWrap:'wrap',gap:12},columns:{flexDirection:'row',flexWrap:'wrap',gap:16},main:{flex:2,minWidth:260,gap:16},aside:{flex:1,minWidth:240},tags:{flexDirection:'row',flexWrap:'wrap',gap:8},fact:{gap:4,paddingVertical:8,borderBottomWidth:1,borderColor:'#EAF2FF'},factValue:{color:'#183455',fontSize:14,lineHeight:22},scoreRow:{flexDirection:'row',alignItems:'center',gap:10},metric:{width:135,fontSize:12,color:'#475569'},bar:{flex:1,height:8,backgroundColor:'#EAF2FF',borderRadius:8,overflow:'hidden'},fill:{height:8,backgroundColor:'#3B82F6'}});

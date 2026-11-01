import { View,Text } from 'react-native';
import { Panel,BodyText,SectionTitle } from '@/components/ui/AppUI';
import { useEvaluations } from './EvaluationProvider';
import { ratingLabel } from './model';

/** Counterparty-facing projection: no pending content, reviewer ID or submission dates. */
export default function PublishedCompanyEvaluations({company}:{company:string}){
 const {records,ready,now}=useEvaluations();
 const published=records.filter(r=>r.company===company&&Date.parse(r.publishAt)<=now);
 if(!ready||!published.length)return null;
 const avg=Math.round(published.reduce((n,r)=>n+r.total,0)/published.length*10)/10;
 return <Panel><SectionTitle>選考・オファーを通じた企業評価</SectionTitle><Text style={{fontSize:22,color:'#2563EB',fontWeight:'800'}}>{avg.toFixed(1)} / 5.0　{ratingLabel(avg)}</Text><BodyText>反映済み {published.length}件 ／ 自動評価 {published.filter(r=>r.mode==='automatic').length}件</BodyText>
  {published.map((record,i)=><View key={i} style={{gap:8,borderTopWidth:1,borderColor:'#DDE6F1',paddingTop:12}}><Text style={{fontWeight:'700',color:'#183455'}}>{record.total.toFixed(1)} / 5.0　{record.mode==='automatic'?'自動評価':'アンケート評価'}</Text>{record.answers&&(['response','description','work'] as const).map((key,index)=><View key={key} style={{gap:4}}><Text style={{fontSize:12,color:'#61708A'}}>{['対応','案件説明','仕事内容'][index]}：{record.answers![key].score.toFixed(1)}</Text>{record.answers![key].choices.map(c=><BodyText key={c}>{c}</BodyText>)}{!!record.answers![key].comment&&<BodyText>{record.answers![key].comment}</BodyText>}</View>)}</View>)}
 </Panel>;
}

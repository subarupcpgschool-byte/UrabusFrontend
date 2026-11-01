import { useEffect, useState } from 'react';
import { Modal, ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppInput, AppSelect, AppTextArea, AppTag } from '@/components/form';
import { AppButton, BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';
import { useAccount } from './AccountProvider';
import { reviewError, type Contract } from './data';

export function Stars({ value, onChange, label = '総合評価', disabled = false }: { value: number; onChange?: (value: number) => void; label?: string; disabled?: boolean }) {
  if (!onChange) return <Text accessibilityLabel={`${label} ${value}点 / 5点`} style={s.stars}>{'★'.repeat(Math.round(value))}{'☆'.repeat(5-Math.round(value))} <Text style={s.score}>{value.toFixed(1)}</Text></Text>;
  return <View accessibilityRole="radiogroup" accessibilityLabel={label} style={s.starRow}>{[1,2,3,4,5].map(n => <Pressable key={n} accessibilityRole="radio" accessibilityLabel={`${n}点`} accessibilityState={{ checked: value === n, disabled }} disabled={disabled} onPress={() => onChange(n)} style={s.starButton}><Text style={[s.star, n <= value && { color: '#D99516' }]}>{n <= value ? '★' : '☆'}</Text></Pressable>)}</View>;
}
function ContractHeading({ contract }: { contract: Contract }) {
  return <View style={{ gap: 8 }}><View style={s.row}><AppTag label={contract.kind === 'company' ? '企業との契約' : '案件契約'}/><Text style={s.meta}>{contract.status}</Text></View>
    <Pressable accessibilityRole="link" onPress={() => router.push(`/companies/${contract.companyId}` as never)}><Text style={s.company}>{contract.company}</Text></Pressable><Text style={s.title}>{contract.title}</Text><Text style={s.meta}>契約期間：{contract.period}</Text>
  </View>;
}
export function ReceivedReviews() {
  const { contracts, received } = useAccount();
  const [kind,setKind]=useState('all'),[query,setQuery]=useState('');
  const list=received.filter(r => { const c=contracts.find(c=>c.id===r.contractId); return c && (kind==='all'||c.kind===kind) && `${c.company} ${c.title} ${r.comment}`.includes(query.trim()); });
  const average=received.length ? received.reduce((n,r)=>n+r.rating,0)/received.length : 0;
  return <View style={s.stack}>
    <Panel><SectionTitle>企業・案件から受けた評価</SectionTitle><View style={s.row}><Text style={s.average}>{received.length ? average.toFixed(1) : '—'}<Text style={s.meta}> / 5</Text></Text><Text style={s.meta}>{received.length}件の評価</Text></View><BodyText>契約先があなたに記入した評価内容を確認できます。</BodyText></Panel>
    <View style={s.filters}><AppInput accessibilityLabel="受けた評価を検索" placeholder="企業名・案件名・評価内容で検索" value={query} onChangeText={setQuery} style={{flex:1,minWidth:180}}/><AppSelect accessibilityLabel="受けた評価の契約区分" value={kind} onValueChange={setKind} options={[{label:'すべての契約',value:'all'},{label:'企業との契約',value:'company'},{label:'案件契約',value:'job'}]}/></View>
    {list.map(review => {const c=contracts.find(c=>c.id===review.contractId)!;return <Panel key={review.id}><ContractHeading contract={c}/><View style={s.row}><Stars value={review.rating}/><Text style={s.meta}>{review.date}</Text></View><View style={s.breakdown}>{review.scores.map(score=><View key={score.label} style={s.scoreRow}><Text style={s.metric}>{score.label}</Text><View style={s.bar}><View style={[s.fill,{width:`${score.value*20}%`}]}/></View><Text style={s.meta}>{score.value.toFixed(1)}</Text></View>)}</View><BodyText>{review.comment}</BodyText></Panel>;})}
    {!list.length&&<Panel><BodyText>{received.length?'条件に一致する評価はありません。':'受けた評価はまだありません。'}</BodyText></Panel>}
  </View>;
}
export function WriteReviews() {
  const { contracts, data, saveReview }=useAccount();
  const [filter,setFilter]=useState('all'),[kind,setKind]=useState('all'),[selected,setSelected]=useState<string|null>(null);
  const [rating,setRating]=useState(0),[comment,setComment]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const contract=contracts.find(c=>c.id===selected);
  useEffect(()=>{const review=data?.written.find(r=>r.contractId===selected);setRating(review?.rating??0);setComment(review?.comment??'');setError('');setNotice('');},[selected]);
  const list=contracts.filter(c=>(kind==='all'||kind===c.kind)&&(filter==='all'||(filter==='reviewed')===!!data?.written.some(r=>r.contractId===c.id)));
  async function save(){if(!contract||busy)return;const error=reviewError(rating,comment);if(error){setError(error);return;}setBusy(true);setError('');setNotice('');try{await saveReview(contract.id,rating,comment);setNotice('評価をこの端末に保存しました。');}catch(e){setError(e instanceof Error?e.message:'保存できませんでした。');}finally{setBusy(false);}}
  return <View style={s.stack}><Panel><SectionTitle>契約した企業・案件を評価</SectionTitle><BodyText>実際の契約先ごとに、仕事の経験を評価できます。評価点と評価内容の両方を入力してください。</BodyText></Panel>
    <View style={s.filters}><AppSelect accessibilityLabel="評価記入状況" value={filter} onValueChange={setFilter} options={[{value:'all',label:'すべての記入状況'},{value:'pending',label:'未評価'},{value:'reviewed',label:'評価済み'}]}/><AppSelect accessibilityLabel="評価する契約区分" value={kind} onValueChange={setKind} options={[{value:'all',label:'すべての契約'},{value:'company',label:'企業との契約'},{value:'job',label:'案件契約'}]}/></View>
    {list.map(c=>{const review=data?.written.find(r=>r.contractId===c.id);return <Panel key={c.id}><ContractHeading contract={c}/>{review?<><Stars value={review.rating}/><BodyText>{review.comment}</BodyText><Text style={s.meta}>保存日：{review.updatedAt.slice(0,10)}</Text></>:<Text style={s.pending}>未評価</Text>}<AppButton label={review?'評価内容を編集':'この契約を評価する'} outline onPress={()=>{if(!busy)setSelected(c.id);}}/></Panel>;})}
    {!list.length&&<Panel><BodyText>{contracts.length?'条件に一致する契約はありません。':'評価できる契約はまだありません。'}</BodyText></Panel>}
    {contract&&<Modal transparent visible onRequestClose={()=>{if(!busy)setSelected(null);}} animationType="fade"><View style={s.overlay}><ScrollView keyboardShouldPersistTaps="handled" style={s.editor} contentContainerStyle={{padding:2}}><Panel><SectionTitle>{contract.company}への評価</SectionTitle><Text style={s.meta}>{contract.title}</Text><Text style={s.title}>総合評価 *</Text><Stars value={rating} onChange={v=>{setRating(v);setNotice('');}} disabled={busy}/><AppTextArea label="評価内容" required value={comment} onChangeText={v=>{setComment(v);setNotice('');}} maxLength={2000} disabled={busy} placeholder="仕事内容や対応について、具体的な感想を入力してください" hint={`${comment.length} / 2,000文字`}/>
      {!!error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}{!!notice&&<Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>}
      <View style={s.row}><AppButton label="編集を閉じる" outline onPress={()=>{if(!busy)setSelected(null);}}/><AppButton label={busy?'保存中…':'評価を保存'} onPress={()=>void save()}/></View>
    </Panel></ScrollView></View></Modal>}
  </View>;
}
const s=StyleSheet.create({overlay:{flex:1,justifyContent:'center',alignItems:'center',padding:18,backgroundColor:'rgba(15,23,42,.4)'},editor:{width:'100%',maxWidth:640,maxHeight:'90%',flexGrow:0},stack:{gap:16},row:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:12},filters:{flexDirection:'row',flexWrap:'wrap',gap:12,alignItems:'center'},company:{fontSize:16,fontWeight:'800',color:'#2563EB'},title:{fontSize:14,fontWeight:'700',color:'#162033'},meta:{fontSize:12,color:'#64748B'},average:{fontSize:36,fontWeight:'800',color:'#183455'},stars:{fontSize:19,color:'#D99516'},score:{fontSize:16,color:'#183455'},starRow:{flexDirection:'row',gap:3},starButton:{width:42,minHeight:44,alignItems:'center',justifyContent:'center'},star:{fontSize:32,color:'#94A3B8'},breakdown:{gap:8},scoreRow:{flexDirection:'row',gap:10,alignItems:'center'},metric:{width:130,fontSize:12,color:'#475569'},bar:{height:7,backgroundColor:'#EAF2FF',flex:1,borderRadius:8,overflow:'hidden'},fill:{height:7,backgroundColor:'#3B82F6'},pending:{fontSize:12,color:'#9A6800'},error:{color:'#B42318'},notice:{color:'#13794E'}});

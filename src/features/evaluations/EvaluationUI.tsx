import { useState } from 'react';
import { Modal,Pressable,ScrollView,StyleSheet,Text,View } from 'react-native';
import { router } from 'expo-router';
import { AppSelect,AppTextArea } from '@/components/form';
import { AppButton,BodyText,Panel,SectionTitle } from '@/components/ui/AppUI';
import type { Application } from '@/features/applications/data';
import { useEvaluations } from './EvaluationProvider';
import { canEvaluate,calculateTotal,deadlineFor,emptyDraft,ratingLabel,validateDraft,type EvaluationDraft } from './model';

const groups=[
 {key:'response' as const,label:'対応',prompt:'言葉遣いや態度はいかがでしたか？',options:['丁寧な言葉で優しい口調','普通の対応だった','言葉遣いが悪く威圧的だった','その他']},
 {key:'description' as const,label:'案件説明',prompt:'説明や企業名に相違はありませんでしたか？',options:['説明・企業名に相違はなかった','仕事内容や条件に一部相違があった','説明と案件企業名が違っていた','その他']},
 {key:'work' as const,label:'仕事内容（任意）',prompt:'勤務後の仕事内容・対応速度・休暇連絡への対応はいかがでしたか？',options:['説明どおりで対応も適切だった','一部相違があった','業務や休暇連絡への対応に問題があった','まだ勤務していない','その他']},
];
const scores=[{label:'未選択',value:'0'},...Array.from({length:9},(_,i)=>{const n=1+i*.5;return{label:`${n.toFixed(1)} / 5.0`,value:String(n)};})];
const date=(iso:string)=>new Date(iso).toLocaleDateString('ja-JP',{timeZone:'Asia/Tokyo'});
export function EvaluationModal({application,visible,onClose}:{application:Application;visible:boolean;onClose:()=>void}){
 const {submit,records,now,ready}=useEvaluations();const [draft,setDraft]=useState(emptyDraft),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const existing=records.find(r=>r.applicationId===application.id);const available=ready&&canEvaluate(application,existing,now);
 function change(key:keyof EvaluationDraft,field:'score'|'choices'|'comment',value:number|string[]|string){setDraft(old=>({...old,[key]:{...old[key],[field]:value}}));setError('');}
 async function send(){if(busy||!available)return;const problem=validateDraft(draft);if(problem){setError(problem);return;}setBusy(true);setError('');try{await submit(application.id,draft);onClose();}catch(e){setError(e instanceof Error?e.message:'評価を保存できませんでした。');}finally{setBusy(false);}}
 const deadline=deadlineFor(application);
 return <Modal transparent visible={visible} onRequestClose={()=>{if(!busy)onClose();}} animationType="fade"><View style={s.overlay}><ScrollView style={s.modal} keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:2}}><Panel>
  <View style={s.row}><View style={{flex:1}}><SectionTitle>企業・案件への評価</SectionTitle><Text style={s.meta}>{application.company} ／ {application.title}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="評価を閉じる" disabled={busy} onPress={onClose} style={s.close}><Text>×</Text></Pressable></View>
  <Text style={s.meta}>5.0 最優良企業 ／ 4.0以上 優良企業 ／ 3.0以上 通常企業 ／ 2.0以下 注意企業</Text>
  {deadline&&<Text style={s.meta}>評価期限：{date(deadline)}（内定から3か月）</Text>}
  <Text style={s.info}>対応・案件説明は点数とアンケートまたはコメントを回答してください。仕事内容が未回答なら5.0で計算します。</Text>
  {groups.map(g=><View key={g.key} style={s.group}><Text style={s.label}>{g.label}</Text><Text style={s.meta}>{g.prompt}</Text><AppSelect label={`${g.label}の点数`} value={String(draft[g.key].score)} onValueChange={v=>change(g.key,'score',Number(v))} options={scores} disabled={busy||!available}/><AppSelect label={`${g.label}のアンケート`} value={draft[g.key].choices[0]??''} onValueChange={v=>change(g.key,'choices',v?[v]:[])} options={[{label:'選択してください',value:''},...g.options.map(value=>({value,label:value}))]} disabled={busy||!available}/><AppTextArea label={`${g.label}のコメント（任意）`} value={draft[g.key].comment} onChangeText={v=>change(g.key,'comment',v)} maxLength={2000} disabled={busy||!available}/></View>)}
  {draft.response.score>0&&draft.description.score>0&&<Text style={s.total}>総合評価：{calculateTotal(draft).toFixed(1)} / 5.0</Text>}
  <Text style={s.meta}>画面確認用の評価として端末内に保存します。保存後は変更できません。相手側への反映待ちは15〜30日です。</Text>
  {!available&&<Text style={s.error}>評価済み、評価対象外、または評価期限が終了しています。</Text>}{!!error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  <View style={s.row}><AppButton label="閉じる" outline onPress={()=>{if(!busy)onClose();}}/><AppButton label={busy?'保存中…':'評価を送信'} onPress={()=>void send()}/></View>
 </Panel></ScrollView></View></Modal>;
}

export function EvaluationDetail({application}:{application:Application|undefined}){
 const {records,ready,error,now}=useEvaluations();const [open,setOpen]=useState(false);
 if(!application)return <Panel><View style={s.empty}><SectionTitle>評価内容が表示されます</SectionTitle><BodyText>左の一覧からやり取りを選択してください。</BodyText></View></Panel>;
 const record=records.find(r=>r.applicationId===application.id),deadline=deadlineFor(application);
 return <View style={{gap:14}}><Panel><SectionTitle>{application.company}</SectionTitle><BodyText>{application.title}</BodyText>
  {!ready?<BodyText>{error||'評価を読み込み中…'}</BodyText>:record?<>
   <Text style={s.total}>{record.total.toFixed(1)} / 5.0　{ratingLabel(record.total)}</Text><Text style={s.info}>{record.mode==='automatic'?'期限終了による自動評価（4.5）':'あなたが記入した評価'}</Text>
   <Text style={s.meta}>{now>=Date.parse(record.publishAt)?'相手側への反映期間に到達しました。':'相手側への反映待ち（評価から15〜30日）'}</Text><Text style={s.meta}>評価日：{date(record.submittedAt)}</Text>
   {record.answers&&groups.map(g=><View key={g.key} style={s.group}><Text style={s.label}>{g.label}：{record.answers![g.key].score.toFixed(1)}</Text>{record.answers![g.key].choices.map(c=><Text key={c} style={s.meta}>{c}</Text>)}<BodyText>{record.answers![g.key].comment||'コメントなし'}</BodyText></View>)}
  </>:canEvaluate(application,undefined,now)?<><Text style={s.meta}>評価期限：{deadline?date(deadline):'—'}</Text><AppButton label="この企業・案件を評価する" onPress={()=>setOpen(true)}/></>:<BodyText>{deadline&&now>=Date.parse(deadline)?'評価期限が終了しました。対象の未評価は自動評価になります。':'内定・内定辞退の状態になった場合に評価できます。'}</BodyText>}
 </Panel><Text style={s.meta}>5.0 最優良企業／4.0〜4.9 優良企業／3.0〜3.9 通常企業／2.1〜2.9 要確認／2.0以下 注意企業</Text>
 <EvaluationModal key={application.id} application={application} visible={open} onClose={()=>setOpen(false)}/></View>;
}
export function EvaluationButton({application,onPress}:{application:Application;onPress:()=>void}){
 const {records,ready,now}=useEvaluations();if(!ready||!canEvaluate(application,records.find(r=>r.applicationId===application.id),now))return null;
 return <Pressable accessibilityRole="button" accessibilityLabel="企業・案件を評価する" onPress={onPress} style={s.button}><Text style={s.buttonText}>☆ 評価する</Text></Pressable>;
}
const s=StyleSheet.create({overlay:{flex:1,alignItems:'center',justifyContent:'center',padding:18,backgroundColor:'rgba(15,23,42,.4)'},modal:{width:'100%',maxWidth:700,maxHeight:'92%',flexGrow:0},row:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:10},close:{padding:12},meta:{fontSize:12,lineHeight:20,color:'#64748B'},info:{fontSize:12,lineHeight:20,color:'#1748B8',backgroundColor:'#EAF2FF',padding:10,borderRadius:8},group:{gap:10,paddingVertical:12,borderTopWidth:1,borderColor:'#DDE6F1'},label:{fontSize:14,fontWeight:'800',color:'#183455'},total:{fontSize:21,fontWeight:'800',color:'#2563EB'},error:{color:'#B42318',fontSize:12},empty:{minHeight:300,alignItems:'center',justifyContent:'center',gap:15},button:{minHeight:38,paddingHorizontal:14,justifyContent:'center',borderRadius:8,backgroundColor:'#2563EB'},buttonText:{color:'#FFF',fontSize:12,fontWeight:'700'}});

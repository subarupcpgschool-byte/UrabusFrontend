import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { createContext,useContext,useEffect,useRef,useState,type ReactNode } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { WORKSPACE_MOCK_ENABLED } from '@/features/workspace/mockData';
import { createApplications } from '@/features/applications/data';
import { automaticEvaluations,canEvaluate,calculateTotal,publicationDate,validateDraft,isEvaluation,type Evaluation,type EvaluationDraft } from './model';

type Context={records:Evaluation[];ready:boolean;error:string;now:number;submit:(id:string,draft:EvaluationDraft)=>Promise<void>};
const C=createContext<Context|null>(null);
export function EvaluationProvider({children}:{children:ReactNode}){
 const {user,ready:authReady}=useAuth();const key=authReady&&(user||WORKSPACE_MOCK_ENABLED)?`globalworkers.evaluations.v1.${WORKSPACE_MOCK_ENABLED?'mock':'live'}.${user?.id??'guest'}`:null;
 const [items]=useState(()=>WORKSPACE_MOCK_ENABLED?createApplications():[]);
 const [loaded,setLoaded]=useState<string|null>(null),[records,setRecords]=useState<Evaluation[]>([]),[error,setError]=useState(''),[now,setNow]=useState(Date.now);
 const keyRef=useRef(key);keyRef.current=key;const data=useRef<Evaluation[]>([]),queue=useRef(Promise.resolve());
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),30000);const sub=AppState.addEventListener('change',state=>{if(state==='active')setNow(Date.now());});return()=>{clearInterval(timer);sub.remove();};},[]);
 useEffect(()=>{let active=true;setLoaded(null);setRecords([]);data.current=[];setError('');if(!key)return;
  queue.current.then(()=>AsyncStorage.getItem(key)).then(raw=>{if(!active)return;const value=raw?JSON.parse(raw):[];if(!Array.isArray(value)||!value.every(isEvaluation))throw new Error('Invalid saved evaluations');data.current=value;setRecords(value);setLoaded(key);}).catch(()=>{if(active)setError('評価データを読み込めませんでした。再読み込みしてください。');});return()=>{active=false;};
 },[key]);
 const ready=!!key&&loaded===key;
 function commit(make:(old:Evaluation[])=>Evaluation[]){const owner=key;if(!ready||!owner)return Promise.reject(new Error('評価データの読み込み完了をお待ちください。'));
  const operation=queue.current.then(async()=>{if(keyRef.current!==owner)throw new Error('アカウントが変更されました。');const next=make(data.current);await AsyncStorage.setItem(owner,JSON.stringify(next));if(keyRef.current===owner){data.current=next;setRecords(next);}});queue.current=operation.catch(()=>{});return operation;
 }
 useEffect(()=>{if(!ready)return;const expired=automaticEvaluations(items,records,now);if(!expired.length)return;
  void commit(old=>[...old,...automaticEvaluations(items,old,Date.now())]).catch(()=>setError('自動評価を保存できませんでした。再読み込みしてください。'));
 },[ready,now]);
 async function submit(id:string,draft:EvaluationDraft){
  const item=items.find(a=>a.id===id);if(!item)throw new Error('評価対象が見つかりません。');const problem=validateDraft(draft);if(problem)throw new Error(problem);
  const snapshot=JSON.parse(JSON.stringify(draft)) as EvaluationDraft;
  await commit(old=>{const current=Date.now();if(!canEvaluate(item,old.find(r=>r.applicationId===id),current))throw new Error('評価済み、期限切れ、または評価対象外です。');const answers={...snapshot,work:{...snapshot.work,score:snapshot.work.score||5}};return[...old,{applicationId:id,company:item.company,mode:'manual',total:calculateTotal(answers),answers,submittedAt:new Date(current).toISOString(),publishAt:publicationDate(current)}];});setNow(Date.now());
 }
 return <C.Provider value={{records:ready?records:[],ready,error,now,submit}}>{children}</C.Provider>;
}
export function useEvaluations(){const v=useContext(C);if(!v)throw new Error('EvaluationProviderが必要です');return v;}

import { useEffect, useState } from 'react';
import type { SearchConditions, JobSearchItem, CompanySearchItem } from './types';
type Row={id:string;title:string;companyName:string;location:string;description:string;minPrice:number|null;maxPrice:number|null;latitude:number;longitude:number;distanceKm:number};
export function useMapResults(kind:'jobs'|'companies',conditions:SearchConditions|null){
 const [rows,setRows]=useState<Row[]>([]);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{if(!conditions?.area){setRows([]);setError('');setBusy(false);return;}
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);setBusy(true);setError('');setRows([]);
 const area=conditions.area;const q=new URLSearchParams({latitude:String(area.latitude),longitude:String(area.longitude),radiusKm:String(area.radiusKm),keyword:conditions.keyword,location:conditions.location});
 const base=(process.env.EXPO_PUBLIC_API_BASE_URL||process.env.EXPO_PUBLIC_API_URL||'http://localhost:8080').replace(/\/$/,'');
 fetch(`${base}/api/platform-search/${kind}?${q}`,{signal:controller.signal}).then(async r=>{if(!r.ok)throw new Error('検索に失敗しました。DBの座標項目とサーバー設定を確認してください。');return r.json() as Promise<Row[]>;}).then(data=>{if(!controller.signal.aborted)setRows(data);}).catch(e=>{if(!cancelled)setError(e.name==='AbortError'?'検索がタイムアウトしました。再試行してください。':e.message||'検索できませんでした。');}).finally(()=>{clearTimeout(timer);if(!cancelled)setBusy(false);});
 let cancelled=false;return()=>{cancelled=true;clearTimeout(timer);controller.abort();};
 },[kind,conditions]);
 const jobs:JobSearchItem[]=rows.map(r=>({id:r.id,mark:r.companyName.slice(0,1),markColor:'#159A69',title:r.title,companyName:r.companyName,location:r.location,description:r.description,workStyle:'',employmentType:'',rating:0,reviewCount:0,salary:r.minPrice==null?'要相談':`${r.minPrice.toLocaleString()}円${r.maxPrice==null?'〜':`〜${r.maxPrice.toLocaleString()}円`}`,tags:[`中心から${r.distanceKm.toFixed(2)}km`]}));
 const companies:CompanySearchItem[]=rows.map(r=>({id:r.id,mark:r.companyName.slice(0,1),markColor:'#159A69',companyName:r.companyName,industry:'',location:r.location,rating:0,reviewCount:0,description:`中心から${r.distanceKm.toFixed(2)}km`,openJobCount:0,reviewParticipationRate:0,employeeRange:'',scores:[]}));
 return {jobs,companies,busy,error};
}

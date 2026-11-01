import { COMPANY_SEARCH_ITEMS, JOB_SEARCH_ITEMS } from '@/components/search/searchData';
export const INTERACTION_KINDS=[{value:'application',label:'応募'},{value:'scout',label:'スカウト'},{value:'offer',label:'オファーレター'}] as const;
export type InteractionKind=typeof INTERACTION_KINDS[number]['value'];
export type ApplicationStatus='未返信'|'選考中'|'面談'|'オファー検討中'|'内定'|'不採用'|'見送り'|'内定辞退'|'内定取り消し';
export type CompanyResult='内定'|'不採用'|'見送り';
export type AfterResult='内定辞退'|'内定取り消し';
export const APPLICATION_TYPES=['正社員','契約社員','業務委託','アルバイト・パート','ボランティア'] as const;
export type Application={id:string;kind:InteractionKind;company:string;title:string;status:ApplicationStatus;decisionAt:string|null;companyResult:CompanyResult|null;afterResult:AfterResult|null;appliedAt:string;updatedAt:string;location:string;salary:string;salaryUnit:string;workStyle:string;employmentType:string};
export const PAGE_SIZE=20;
export const FILTERS=['すべて','未返信','選考中','面談','オファー検討中','内定','不採用','見送り','内定辞退','内定取り消し'] as const;
export type ApplicationFilter=typeof FILTERS[number];
export type SortKey='updatedAt'|'status';
export type SortDirection='asc'|'desc';
export type ListOptions={kind?:InteractionKind|'';employmentType?:string;sortKey?:SortKey;direction?:SortDirection};
export function createApplications():Application[]{return Array.from({length:48},(_,i)=>{const job=JOB_SEARCH_ITEMS[i%3];const type=APPLICATION_TYPES[i%APPLICATION_TYPES.length];const kind=INTERACTION_KINDS[i%3].value;const stage=Math.floor(i/3)%8;const companyResult:CompanyResult|null=stage===3||stage===5||stage===6?'内定':stage===4?(kind==='application'?'不採用':'見送り'):null;const afterResult:AfterResult|null=stage===5?'内定辞退':stage===6?'内定取り消し':null;const status:ApplicationStatus=afterResult??companyResult??(stage===2||stage===7?'面談':stage===0&&kind==='scout'?'未返信':kind==='offer'?'オファー検討中':'選考中');return{id:String(i+1),kind,company:COMPANY_SEARCH_ITEMS[i%3].companyName,title:job.title,status,decisionAt:companyResult==='内定'?(i===9?'2026-07-01T00:00:00.000Z':'2026-10-28T00:00:00.000Z'):null,companyResult,afterResult,appliedAt:i===9?'2026/06/25':`2026/10/${String(28-(i%28)).padStart(2,'0')}`,updatedAt:i===9?'2026-07-01T00:00:00.000Z':new Date(Date.UTC(2026,9,29+(i%3),9+(i%8),i%60)).toISOString(),location:job.location,salary:type==='ボランティア'?'無償':type==='アルバイト・パート'?'1,200円〜1,800円':type==='業務委託'?'30万円〜60万円':job.salary,salaryUnit:type==='ボランティア'?'':type==='アルバイト・パート'?'時給':type==='業務委託'?'報酬':'月給',workStyle:job.workStyle,employmentType:type};});}
export function applicationPay(item:Application){return [item.salaryUnit,item.salary].filter(Boolean).join(' ');}
export function formatUpdatedAt(iso:string){return new Date(iso).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});}
const rank:Record<ApplicationStatus,number>={'未返信':0,'選考中':1,'面談':2,'オファー検討中':3,'内定':4,'不採用':5,'見送り':6,'内定辞退':7,'内定取り消し':8};
export function pageApplications(items:Application[],filter:ApplicationFilter,page:number,options:ListOptions={}){
 const {kind='',employmentType='',sortKey='updatedAt',direction='desc'}=options;
 const sign=direction==='asc'?1:-1;
 const filtered=items.filter(a=>(!kind||a.kind===kind)&&(filter==='すべて'||a.status===filter)&&(!employmentType||a.employmentType===employmentType)).sort((a,b)=>{
  const time=Date.parse(a.updatedAt)-Date.parse(b.updatedAt);
  const primary=sortKey==='status'?rank[a.status]-rank[b.status]:time;
  return primary*sign||(sortKey==='status'?-time:0)||a.id.localeCompare(b.id,'ja',{numeric:true});
 });
 const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));const current=Math.min(Math.max(1,page),pages);
 return{filtered,pages,current,items:filtered.slice((current-1)*PAGE_SIZE,current*PAGE_SIZE),start:filtered.length?(current-1)*PAGE_SIZE+1:0,end:Math.min(current*PAGE_SIZE,filtered.length)};
}

export function kindLabel(kind:InteractionKind){return INTERACTION_KINDS.find(k=>k.value===kind)!.label;}
export function eventDateLabel(kind:InteractionKind){return kind==='application'?'応募日':'受信日';}
/** Company decision and subsequent action remain separate to preserve the offer history. */
export function outcomeLabel(item:Application){return item.companyResult?`${item.companyResult}${item.afterResult?` → ${item.afterResult}`:''}`:item.status;}
export function progressSteps(item:Application){
 const result=item.companyResult??'結果';
 const steps=item.kind==='application'?['応募','書類選考','面談',result]:[item.kind==='scout'?'スカウト受信':'オファー受信','条件確認','面談',result];
 if(item.companyResult==='内定'&&item.afterResult)steps.push(item.afterResult);
 const current=item.companyResult?steps.length-1:item.status==='未返信'?0:item.status==='面談'?2:1;
 return{steps,current};
}

export function isNegativeStep(step:string){return ['内定辞退','内定取り消し','見送り','不採用'].includes(step);}

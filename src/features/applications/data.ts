import { COMPANY_SEARCH_ITEMS, JOB_SEARCH_ITEMS } from '@/components/search/searchData';
export type ApplicationStatus='選考中'|'面接'|'内定';
export const APPLICATION_TYPES=['正社員','契約社員','業務委託','アルバイト・パート','ボランティア'] as const;
export type Application={id:string;company:string;title:string;status:ApplicationStatus;appliedAt:string;updatedAt:string;location:string;salary:string;salaryUnit:string;workStyle:string;employmentType:string};
export const PAGE_SIZE=20;
export const FILTERS=['すべて','選考中','面接','内定'] as const;
export type ApplicationFilter=typeof FILTERS[number];
export type SortKey='updatedAt'|'status';
export type SortDirection='asc'|'desc';
export type ListOptions={employmentType?:string;sortKey?:SortKey;direction?:SortDirection};
export function createApplications():Application[]{return Array.from({length:48},(_,i)=>{const job=JOB_SEARCH_ITEMS[i%3];const type=APPLICATION_TYPES[i%APPLICATION_TYPES.length];return{id:String(i+1),company:COMPANY_SEARCH_ITEMS[i%3].companyName,title:job.title,status:i<24?'選考中':i<40?'面接':'内定',appliedAt:`2026/10/${String(28-(i%28)).padStart(2,'0')}`,updatedAt:new Date(Date.UTC(2026,9,29+(i%3),9+(i%8),i%60)).toISOString(),location:job.location,salary:type==='ボランティア'?'無償':type==='アルバイト・パート'?'1,200円〜1,800円':type==='業務委託'?'30万円〜60万円':job.salary,salaryUnit:type==='ボランティア'?'':type==='アルバイト・パート'?'時給':type==='業務委託'?'報酬':'月給',workStyle:job.workStyle,employmentType:type};});}
export function applicationPay(item:Application){return [item.salaryUnit,item.salary].filter(Boolean).join(' ');}
export function formatUpdatedAt(iso:string){return new Date(iso).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false});}
const rank:Record<ApplicationStatus,number>={'選考中':0,'面接':1,'内定':2};
export function pageApplications(items:Application[],filter:ApplicationFilter,page:number,options:ListOptions={}){
 const {employmentType='',sortKey='updatedAt',direction='desc'}=options;
 const sign=direction==='asc'?1:-1;
 const filtered=items.filter(a=>(filter==='すべて'||a.status===filter)&&(!employmentType||a.employmentType===employmentType)).sort((a,b)=>{
  const time=Date.parse(a.updatedAt)-Date.parse(b.updatedAt);
  const primary=sortKey==='status'?rank[a.status]-rank[b.status]:time;
  return primary*sign||(sortKey==='status'?-time:0)||a.id.localeCompare(b.id,'ja',{numeric:true});
 });
 const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));const current=Math.min(Math.max(1,page),pages);
 return{filtered,pages,current,items:filtered.slice((current-1)*PAGE_SIZE,current*PAGE_SIZE),start:filtered.length?(current-1)*PAGE_SIZE+1:0,end:Math.min(current*PAGE_SIZE,filtered.length)};
}

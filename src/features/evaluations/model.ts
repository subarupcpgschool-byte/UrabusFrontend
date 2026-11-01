import type { Application } from '@/features/applications/data';
export type Answer={score:number;choices:string[];comment:string};
export type EvaluationDraft={response:Answer;description:Answer;work:Answer};
export type Evaluation={applicationId:string;company:string;mode:'manual'|'automatic';total:number;answers:EvaluationDraft|null;submittedAt:string;publishAt:string};
export const emptyDraft=():EvaluationDraft=>({response:{score:0,choices:[],comment:''},description:{score:0,choices:[],comment:''},work:{score:0,choices:[],comment:''}});
export function deadlineFor(item:Application){
 if(!item.decisionAt)return null;
 const start=new Date(item.decisionAt);if(!Number.isFinite(start.getTime()))return null;
 const date=new Date(start);const day=date.getUTCDate();date.setUTCDate(1);date.setUTCMonth(date.getUTCMonth()+3);
 const last=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();date.setUTCDate(Math.min(day,last));return date.toISOString();
}
export function eligibleStatus(item:Application){return item.companyResult==='内定'&&(item.status==='内定'||item.status==='内定辞退')&&item.afterResult!=='内定取り消し';}
export function canEvaluate(item:Application,existing:Evaluation|undefined,now:number){const deadline=deadlineFor(item);return eligibleStatus(item)&&!existing&&!!deadline&&now>=Date.parse(item.decisionAt!)&&now<Date.parse(deadline);}
const validScore=(score:number)=>Number.isFinite(score)&&score>=1&&score<=5&&Number.isInteger(score*2);
const answered=(a:Answer)=>a.choices.length>0||!!a.comment.trim();
export function validateDraft(d:EvaluationDraft){
 if(!validScore(d.response.score)||!validScore(d.description.score))return '対応と案件説明の点数を選択してください。';
 if(!answered(d.response)||!answered(d.description))return '対応と案件説明は、アンケートの選択かコメントを入力してください。';
 const workUsed=d.work.score!==0||answered(d.work);if(workUsed&&!validScore(d.work.score))return '仕事内容を回答する場合は点数も選択してください。';
 if([d.response,d.description,d.work].some(a=>a.comment.length>2000))return 'コメントは各2,000文字以内で入力してください。';
 return '';
}
export function calculateTotal(d:EvaluationDraft){return Math.round((d.response.score+d.description.score+(d.work.score||5))/3*10)/10;}
export function ratingLabel(score:number){return score===5?'最優良企業':score>=4?'優良企業':score>=3?'通常企業':score<=2?'注意企業':'要確認';}
export function publicationDate(base:number,random=Math.random){const days=15+Math.min(15,Math.max(0,Math.floor(random()*16)));return new Date(base+days*86400000).toISOString();}
export function automaticEvaluations(items:Application[],existing:Evaluation[],now:number,random=Math.random){
 const known=new Set(existing.map(r=>r.applicationId));const added:Evaluation[]=[];
 for(const item of items){const deadline=deadlineFor(item);if(!known.has(item.id)&&eligibleStatus(item)&&deadline&&now>=Date.parse(deadline)){added.push({applicationId:item.id,company:item.company,mode:'automatic',total:4.5,answers:null,submittedAt:deadline,publishAt:publicationDate(Date.parse(deadline),random)});known.add(item.id);}}
 return added;
}
export function isEvaluation(value:unknown):value is Evaluation{
 if(!value||typeof value!=='object')return false;const r=value as Evaluation;
 return typeof r.applicationId==='string'&&typeof r.company==='string'&&['manual','automatic'].includes(r.mode)&&Number.isFinite(r.total)&&r.total>=1&&r.total<=5&&Number.isFinite(Date.parse(r.submittedAt))&&Number.isFinite(Date.parse(r.publishAt))&&(r.mode==='automatic'?r.answers===null:!!r.answers&&['response','description','work'].every(key=>{const a=r.answers![key as keyof EvaluationDraft];return a&&typeof a.score==='number'&&typeof a.comment==='string'&&Array.isArray(a.choices)&&a.choices.every(c=>typeof c==='string');}));
}

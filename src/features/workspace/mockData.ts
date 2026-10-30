import { COMPANY_SEARCH_ITEMS, JOB_SEARCH_ITEMS } from '@/components/search/searchData';
import type { Attachment, Favorite, Room, WorkspaceState } from './WorkspaceProvider';
export const WORKSPACE_MOCK_ENABLED = process.env.EXPO_PUBLIC_WORKSPACE_MOCK !== 'false';
/** Pure fixture factory: detached copies and relative timestamps on first load/reset only. */
export function createMockWorkspace(now = Date.now()): WorkspaceState {
 const hour = 3600000;
 const image: Attachment = { id:'demo-image',name:'オフィス紹介.png',uri:'mock:image',mime:'image/png',size:16083 };
 const video: Attachment = { id:'demo-video',name:'職場紹介動画',uri:'mock:video',mime:'video/mp4',size:14175 };
 const file: Attachment = { id:'demo-file',name:'面談候補日.csv',uri:'mock:csv',mime:'text/csv',size:180 };
 const companies = COMPANY_SEARCH_ITEMS.slice(0,3).map(item => ({ key:`company:${item.id}`,kind:'company' as const,item:JSON.parse(JSON.stringify(item)),savedAt:now-hour*Number(item.id) }));
 const jobs = JOB_SEARCH_ITEMS.map(item => ({ key:`job:${item.id}`,kind:'job' as const,item:JSON.parse(JSON.stringify(item)),savedAt:now-hour*(Number(item.id)+3) }));
 const favorites: Favorite[] = [...companies,...jobs];
 const rooms: Room[] = [
  {id:'company:1',kind:'company',company:COMPANY_SEARCH_ITEMS[0].companyName,title:'企業へのお問い合わせ',unread:2,archived:false,createdAt:now-96*hour,messages:[
   {id:'demo-c1-1',text:'働き方やオフィスについて、お伺いできますか？',at:now-48*hour,mine:true,attachments:[]},
   {id:'demo-c1-2',text:'お問い合わせありがとうございます。オフィスのイメージをお送りします。こちらは画面確認用のサンプルです。',at:now-3*hour,mine:false,attachments:[image]},
   {id:'demo-c1-3',text:'勤務時間はご相談いただけます。ご希望をお聞かせください。',at:now-hour,mine:false,attachments:[]}]},
  {id:'job:1',kind:'job',company:JOB_SEARCH_ITEMS[0].companyName,title:JOB_SEARCH_ITEMS[0].title,unread:1,archived:false,createdAt:now-120*hour,messages:[
   {id:'demo-j1-1',text:'求人を拝見しました。オンライン面談を希望しています。',at:now-24*hour,mine:true,attachments:[]},
   {id:'demo-j1-2',text:'ありがとうございます。面談の候補日を添付しました。ご都合はいかがでしょうか？',at:now-2*hour,mine:false,attachments:[file]}]},
  {id:'job:2',kind:'job',company:JOB_SEARCH_ITEMS[1].companyName,title:JOB_SEARCH_ITEMS[1].title,unread:0,archived:false,createdAt:now-144*hour,messages:[
   {id:'demo-j2-1',text:'ポートフォリオについて確認しました。職場紹介のサンプル動画をご覧ください。',at:now-30*hour,mine:false,attachments:[video]},
   {id:'demo-j2-2',text:'ありがとうございます。チームの雰囲気が分かりました。',at:now-27*hour,mine:true,attachments:[]}]},
  {id:'company:2',kind:'company',company:COMPANY_SEARCH_ITEMS[1].companyName,title:'勤務条件のご相談',unread:0,archived:false,createdAt:now-160*hour,messages:[
   {id:'demo-c2-1',text:'リモート勤務の頻度について相談できますか？',at:now-40*hour,mine:true,attachments:[]},
   {id:'demo-c2-2',text:'担当業務に応じてご相談いただけます。詳しい条件を面談でご案内します。',at:now-36*hour,mine:false,attachments:[]}]},
  {id:'job:3',kind:'job',company:JOB_SEARCH_ITEMS[2].companyName,title:JOB_SEARCH_ITEMS[2].title,unread:0,archived:true,createdAt:now-240*hour,messages:[
   {id:'demo-j3-1',text:'今回は応募を見送ります。また機会がありましたらお願いいたします。',at:now-168*hour,mine:true,attachments:[]},
   {id:'demo-j3-2',text:'承知しました。ご検討いただきありがとうございました。',at:now-165*hour,mine:false,attachments:[]}]},
  {id:'company:3',kind:'company',company:COMPANY_SEARCH_ITEMS[2].companyName,title:'募集内容のお問い合わせ',unread:1,archived:false,createdAt:now-72*hour,messages:[
   {id:'demo-c3-1',text:'研修制度について教えてください。',at:now-10*hour,mine:true,attachments:[]},
   {id:'demo-c3-2',text:'入社後は先輩社員がサポートします。未経験の方もご相談ください。',at:now-4*hour,mine:false,attachments:[]}]},
 ];
 return {favorites,rooms};
}
export const MOCK_CSV = '\ufeff候補日,開始時刻,形式\r\nサンプル候補1,10:00,オンライン\r\nサンプル候補2,14:00,オンライン\r\n';

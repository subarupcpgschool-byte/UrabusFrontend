import { COMPANY_SEARCH_ITEMS, JOB_SEARCH_ITEMS } from '@/components/search/searchData';

export type Profile = {
  familyName: string; givenName: string; familyKana: string; givenKana: string;
  birthDate: string; city: string; phone: string; businessName: string;
  transport: string; bio: string; hobbies: string; skills: string[];
};
export type Contract = {
  id: string; kind: 'company' | 'job'; companyId: string; company: string;
  jobId?: string; title: string; period: string; status: '契約中' | '契約終了';
};
export type ReceivedReview = {
  id: string; contractId: string; date: string; rating: number; comment: string;
  scores: { label: string; value: number }[];
};
export type WrittenReview = { contractId: string; rating: number; comment: string; updatedAt: string };
export type AccountData = { profile: Profile; written: WrittenReview[] };

export function isAccountData(value: unknown): value is AccountData {
  if (!value || typeof value !== 'object') return false;
  const item = value as AccountData;
  const fields: (keyof Omit<Profile, 'skills'>)[] = ['familyName','givenName','familyKana','givenKana','birthDate','city','phone','businessName','transport','bio','hobbies'];
  return !!item.profile && fields.every(key => typeof item.profile[key] === 'string')
    && Array.isArray(item.profile.skills) && item.profile.skills.every(v => typeof v === 'string')
    && Array.isArray(item.written) && item.written.every(r => r && typeof r.contractId === 'string' && typeof r.comment === 'string' && typeof r.updatedAt === 'string' && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5);
}

export const CONTRACTS: Contract[] = [
  { id: 'sample-contract-1', kind: 'job', companyId: '1', company: COMPANY_SEARCH_ITEMS[0].companyName, jobId: '1', title: JOB_SEARCH_ITEMS[0].title, period: '2026/07/01〜2026/09/30', status: '契約終了' },
  { id: 'sample-contract-2', kind: 'company', companyId: '2', company: COMPANY_SEARCH_ITEMS[1].companyName, title: 'デザイン業務の継続契約', period: '2026/10/01〜', status: '契約中' },
  { id: 'sample-contract-3', kind: 'job', companyId: '3', company: COMPANY_SEARCH_ITEMS[2].companyName, jobId: '3', title: JOB_SEARCH_ITEMS[2].title, period: '2026/04/01〜2026/06/30', status: '契約終了' },
];
export const RECEIVED: ReceivedReview[] = [
  { id: 'sample-review-1', contractId: CONTRACTS[0].id, date: '2026/10/05', rating: 5, comment: '要件を丁寧に整理し、安定した品質で納品いただきました。進捗の共有も分かりやすく、安心して依頼できました。', scores: [{label:'仕事の品質',value:5},{label:'コミュニケーション',value:5},{label:'納期・責任感',value:5}] },
  { id: 'sample-review-2', contractId: CONTRACTS[1].id, date: '2026/10/25', rating: 4, comment: '利用者の視点から改善案を提案していただきました。チームとの連携も円滑でした。', scores: [{label:'仕事の品質',value:4},{label:'コミュニケーション',value:5},{label:'納期・責任感',value:4}] },
];
export function createAccountData(name: string, mock: boolean): AccountData {
  const parts = name.trim().split(/[\s　]+/);
  return { profile: {
    familyName: parts[0] || (mock ? '山田' : ''), givenName: parts.slice(1).join(' ') || (mock && !name ? '太郎' : ''),
    familyKana: '', givenKana: '', birthDate: '', city: mock ? '大阪府大阪市' : '', phone: '', businessName: '',
    transport: '', bio: mock ? 'Webサービスの開発とUI改善を中心に活動しています。丁寧なコミュニケーションを大切にしています。' : '',
    hobbies: '', skills: mock ? ['TypeScript','React','Java'] : [],
  }, written: mock ? [{ contractId: CONTRACTS[2].id, rating: 4, comment: '業務の説明が分かりやすく、困ったときも相談しやすい環境でした。', updatedAt: '2026-07-03T03:00:00.000Z' }] : [] };
}

export function profileError(profile: Profile): string {
  if (!profile.familyName.trim() || !profile.givenName.trim()) return '姓と名を入力してください。';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.birthDate)) return '生年月日を YYYY-MM-DD 形式で入力してください。';
  const [y,m,d] = profile.birthDate.split('-').map(Number);
  const date = new Date(Date.UTC(y,m-1,d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m-1 || date.getUTCDate() !== d || date > new Date()) return '有効な生年月日を入力してください。';
  if (profile.phone && !/^[\d+()\-\s]{6,25}$/.test(profile.phone)) return '電話番号の形式を確認してください。';
  return '';
}
export function reviewError(rating: number, comment: string): string {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return '評価を1〜5から選択してください。';
  if (!comment.trim()) return '評価内容を入力してください。';
  if (comment.trim().length > 2000) return '評価内容は2,000文字以内で入力してください。';
  return '';
}

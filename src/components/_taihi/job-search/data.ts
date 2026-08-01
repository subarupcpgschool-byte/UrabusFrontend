import type { Coordinate, Job } from './types';

export const DEFAULT_CENTER: Coordinate = {
  latitude: 34.6937,
  longitude: 135.5023,
};

export const DEFAULT_RADIUS_KM = 5;

export const PREFECTURES = [
  { label: '指定なし', value: '' },
  { label: '東京都', value: 'tokyo' },
  { label: '大阪府', value: 'osaka' },
  { label: '愛知県', value: 'aichi' },
  { label: '福岡県', value: 'fukuoka' },
  { label: 'フルリモート', value: 'remote' },
] as const;

export const INDUSTRIES = [
  { label: '指定なし', value: '' },
  { label: 'IT・通信', value: 'it' },
  { label: '製造・エンジニアリング', value: 'manufacturing' },
  { label: '商社・流通', value: 'retail' },
  { label: 'クリエイティブ・広告', value: 'creative' },
] as const;

export const EMPLOYMENT_FILTERS = [
  'すべて',
  '正社員',
  '契約社員',
  '業務委託',
  'アルバイト・パート',
] as const;

export const JOBS: Job[] = [
  {
    id: 'frontend-engineer',
    logoText: 'S',
    title: 'フロントエンドエンジニア',
    company: '株式会社サンプルテック',
    location: '大阪府・リモート可',
    employmentType: '正社員',
    salary: '年収450万〜750万円',
    tags: ['リモート可', '未経験歓迎'],
    industry: 'IT・通信',
    coordinate: { latitude: 34.6937, longitude: 135.5023 },
  },
  {
    id: 'backend-engineer',
    logoText: 'M',
    title: 'バックエンドエンジニア(Java)',
    company: '株式会社マニュファクチャリングDX',
    location: '愛知県・名古屋市',
    employmentType: '正社員',
    salary: '年収500万〜850万円',
    tags: ['フレックス', '副業OK'],
    industry: '製造・エンジニアリング',
    coordinate: { latitude: 35.1815, longitude: 136.9066 },
  },
  {
    id: 'pr-director',
    logoText: 'K',
    title: '採用広報・PRディレクター',
    company: '株式会社クリエイティブワークス',
    location: 'フルリモート',
    employmentType: '業務委託',
    salary: '月額40万〜70万円',
    tags: ['週2日〜OK', '経験者優遇'],
    industry: 'クリエイティブ・広告',
    coordinate: { latitude: 35.6812, longitude: 139.7671 },
  },
];

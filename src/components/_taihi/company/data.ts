import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';

export type FeatherName = ComponentProps<typeof Feather>['name'];

export type DashboardMetric = {
  label: string;
  value: string;
  comparison: string;
  trend: 'up' | 'neutral';
  icon: FeatherName;
};

export type DashboardJob = {
  id: string;
  title: string;
  employmentType: string;
  status: '公開中' | '下書き' | '募集終了';
  applicants: number;
  views: number;
  deadline: string;
  updatedAt: string;
};

export type DashboardApplicant = {
  id: string;
  name: string;
  initials: string;
  jobTitle: string;
  stage: '新着' | '書類選考' | '面接予定' | '内定';
  appliedAt: string;
};

export type DashboardTask = {
  id: string;
  title: string;
  description: string;
  dueLabel: string;
  priority: 'high' | 'normal';
  icon: FeatherName;
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: '公開中の求人',
    value: '8',
    comparison: '先月から2件増加',
    trend: 'up',
    icon: 'briefcase',
  },
  {
    label: '新着応募',
    value: '14',
    comparison: '過去7日間',
    trend: 'up',
    icon: 'user-plus',
  },
  {
    label: '未読メッセージ',
    value: '5',
    comparison: '3名から届いています',
    trend: 'neutral',
    icon: 'message-square',
  },
  {
    label: '求人閲覧数',
    value: '1,248',
    comparison: '前月比 +18.4%',
    trend: 'up',
    icon: 'eye',
  },
];

export const dashboardJobs: DashboardJob[] = [
  {
    id: 'job-001',
    title: 'フロントエンドエンジニア',
    employmentType: '正社員',
    status: '公開中',
    applicants: 24,
    views: 612,
    deadline: '2026/08/31',
    updatedAt: '今日 10:30',
  },
  {
    id: 'job-002',
    title: 'バックエンドエンジニア（Java）',
    employmentType: '正社員',
    status: '公開中',
    applicants: 18,
    views: 406,
    deadline: '2026/09/15',
    updatedAt: '昨日 18:20',
  },
  {
    id: 'job-003',
    title: '採用広報・PRディレクター',
    employmentType: '業務委託',
    status: '公開中',
    applicants: 7,
    views: 230,
    deadline: '2026/08/20',
    updatedAt: '7月17日',
  },
];

export const dashboardApplicants: DashboardApplicant[] = [
  {
    id: 'applicant-001',
    name: '佐藤 美咲',
    initials: 'SM',
    jobTitle: 'フロントエンドエンジニア',
    stage: '新着',
    appliedAt: '10分前',
  },
  {
    id: 'applicant-002',
    name: '田中 悠斗',
    initials: 'TY',
    jobTitle: 'バックエンドエンジニア（Java）',
    stage: '書類選考',
    appliedAt: '2時間前',
  },
  {
    id: 'applicant-003',
    name: '鈴木 彩花',
    initials: 'SA',
    jobTitle: '採用広報・PRディレクター',
    stage: '面接予定',
    appliedAt: '昨日',
  },
];

export const dashboardTasks: DashboardTask[] = [
  {
    id: 'task-001',
    title: '応募者3名の書類を確認',
    description: 'フロントエンドエンジニア',
    dueLabel: '本日中',
    priority: 'high',
    icon: 'file-text',
  },
  {
    id: 'task-002',
    title: '面接日程を確定',
    description: '鈴木 彩花さんとの一次面接',
    dueLabel: '明日まで',
    priority: 'normal',
    icon: 'calendar',
  },
  {
    id: 'task-003',
    title: '求人票の公開期限を確認',
    description: '採用広報・PRディレクター',
    dueLabel: '残り32日',
    priority: 'normal',
    icon: 'clock',
  },
];

export const funnelData = [
  { label: '応募', value: 49, percent: 100 },
  { label: '書類選考', value: 31, percent: 63 },
  { label: '面接', value: 12, percent: 24 },
  { label: '内定', value: 4, percent: 8 },
] as const;

export type Recruitment = { id: string; title: string; deleted: boolean };
export type Dashboard = {
  canViewApplicants: boolean;
  from: string;
  to: string;
  bucket: string;
  earliestDate: string | null;
  billing: null | {
    month: string;
    plan: {
      code: string;
      name: string;
      jobLimit: number;
      companyLimit: number;
    };
    amount: number | null;
    pending: number;
    overdue: number;
    upgradeUrl: string | null;
    reviewAffectsAmount: boolean;
  };
  series: Recruitment[];
  points: { date: string; recruitmentId: string; count: number }[];
  staff: { id: string; name: string; accepted: number; rejected: number }[];
};
export type Article = {
  kind?: string;
  workStyle?: string;
  startDate?: string;
  endDate?: string;
  publishTime?: string;
  hidden?: boolean;
  title?: string;
  description?: string;
  articleHtml?: string;
  articleCss?: string;
  location?: string;
  compensation?: string;
  salary?: string;
  employment?: string;
  employmentType?: string;
  requirements?: string;
};
export type Snapshot = Article & {
  document?: Article;
  resumeSnapshot?: { title?: string; body?: Record<string, unknown> };
};
export type PeriodDetail = {
  title: string;
  from: string;
  to: string;
  total: number;
  page: number;
  pageSize: number;
  items: {
    id: string;
    createdAt: string;
    userName: string;
    status: string;
    initialMessage: string;
    snapshot: Snapshot;
  }[];
  versions: {
    id: number;
    action: string;
    changedAt: string;
    actorName: string;
    before: Article | null;
    after: Article | null;
  }[];
  versionTotal: number;
  versionPage: number;
  baseline: null | { document: Article | null; at: string | null };
};
export const EMPTY: Dashboard = {
  canViewApplicants: false,
  from: "",
  to: "",
  bucket: "day",
  earliestDate: null,
  billing: null,
  series: [],
  points: [],
  staff: [],
};
export const PALETTE = [
  "#2563EB",
  "#0D9488",
  "#9333EA",
  "#EA580C",
  "#DB2777",
  "#4F46E5",
  "#65A30D",
  "#0891B2",
  "#A16207",
  "#475569",
];
export function today() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo" }).format(
    new Date(),
  );
}
export function shift(value: string, days: number) {
  const date = new Date(value + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function bucketStart(value: string, bucket: string) {
  if (bucket === "month") return value.slice(0, 7) + "-01";
  if (bucket === "week")
    return shift(
      value,
      -((new Date(value + "T00:00:00Z").getUTCDay() + 6) % 7),
    );
  return value;
}
export function nextBucket(value: string, bucket: string) {
  if (bucket !== "month") return shift(value, bucket === "week" ? 7 : 1);
  const date = new Date(value + "T00:00:00Z");
  date.setUTCMonth(date.getUTCMonth() + 1);
  return date.toISOString().slice(0, 10);
}
export function dates(from: string, to: string, bucket: string) {
  const result: string[] = [];
  for (
    let at = bucketStart(from, bucket);
    at <= to && result.length < 1300;
    at = nextBucket(at, bucket)
  )
    result.push(at);
  return result;
}
export function validRange(from: string, to: string, bucket: string) {
  const days =
    (Date.parse(to + "T00:00:00Z") - Date.parse(from + "T00:00:00Z")) /
    86400000;
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(from) &&
    /^\d{4}-\d{2}-\d{2}$/.test(to) &&
    Number.isFinite(days) &&
    days >= 0 &&
    days <= (bucket === "day" ? 365 : bucket === "week" ? 3650 : 36524)
  );
}

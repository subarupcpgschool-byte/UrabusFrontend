import { sourceText } from "@/i18n/source";
import { localeTag } from "@/i18n/display";
export const INTERACTION_KINDS = [
  { value: "application", label: sourceText("application") },
  { value: "scout", label: sourceText("scout") },
  { value: "offer", label: sourceText("offerLetter") },
] as const;
export type InteractionKind = (typeof INTERACTION_KINDS)[number]["value"];
export type ApplicationStatus =
  | "未返信"
  | "選考中"
  | "面談"
  | "オファー検討中"
  | "内定"
  | "不採用"
  | "見送り"
  | "内定辞退"
  | "内定取り消し";
export type CompanyResult = "内定" | "不採用" | "見送り";
export type AfterResult = "内定辞退" | "内定取り消し";
export const APPLICATION_TYPES = [
  sourceText("fullTimeEmployee"),
  sourceText("fixedTermEmployee"),
  sourceText("freelanceContractWork"),
  sourceText("partTimeEmployee"),
  sourceText("volunteer"),
] as const;
export type Application = {
  canEvaluate?: boolean;
  id: string;
  kind: InteractionKind;
  company: string;
  title: string;
  status: ApplicationStatus;
  decisionAt: string | null;
  companyResult: CompanyResult | null;
  afterResult: AfterResult | null;
  appliedAt: string;
  updatedAt: string;
  location: string;
  salary: string;
  salaryUnit: string;
  workStyle: string;
  employmentType: string;
};
export const PAGE_SIZE = 20;
export const FILTERS = [
  sourceText("all"),
  sourceText("unanswered"),
  sourceText("inSelection"),
  sourceText("meeting"),
  sourceText("consideringOffer"),
  sourceText("jobOffer"),
  sourceText("notSelected"),
  sourceText("notProceeding"),
  sourceText("offerDeclined"),
  sourceText("offerWithdrawn"),
] as const;
export type ApplicationFilter = (typeof FILTERS)[number];
export type SortKey = "updatedAt" | "status";
export type SortDirection = "asc" | "desc";
export type ListOptions = {
  kind?: InteractionKind | "";
  employmentType?: string;
  sortKey?: SortKey;
  direction?: SortDirection;
};
export function applicationPay(item: Application) {
  return [item.salaryUnit, item.salary].filter(Boolean).join(" ");
}
export function formatUpdatedAt(iso: string) {
  return new Date(iso).toLocaleString(localeTag(), {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
const rank: Record<ApplicationStatus, number> = {
  未返信: 0,
  選考中: 1,
  面談: 2,
  オファー検討中: 3,
  内定: 4,
  不採用: 5,
  見送り: 6,
  内定辞退: 7,
  内定取り消し: 8,
};
export function pageApplications(
  items: Application[],
  filter: ApplicationFilter,
  page: number,
  options: ListOptions = {},
) {
  const {
    kind = "",
    employmentType = "",
    sortKey = "updatedAt",
    direction = "desc",
  } = options;
  const sign = direction === "asc" ? 1 : -1;
  const filtered = items
    .filter(
      (a) =>
        (!kind || a.kind === kind) &&
        (filter === sourceText("all") || a.status === filter) &&
        (!employmentType || a.employmentType === employmentType),
    )
    .sort((a, b) => {
      const time = Date.parse(a.updatedAt) - Date.parse(b.updatedAt);
      const primary =
        sortKey === "status" ? rank[a.status] - rank[b.status] : time;
      return (
        primary * sign ||
        (sortKey === "status" ? -time : 0) ||
        a.id.localeCompare(b.id, "ja", { numeric: true })
      );
    });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  return {
    filtered,
    pages,
    current,
    items: filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    start: filtered.length ? (current - 1) * PAGE_SIZE + 1 : 0,
    end: Math.min(current * PAGE_SIZE, filtered.length),
  };
}

export function kindLabel(kind: InteractionKind) {
  return INTERACTION_KINDS.find((k) => k.value === kind)!.label;
}
export function eventDateLabel(kind: InteractionKind) {
  return kind === "application"
    ? sourceText("applicationDate")
    : sourceText("receivedOn");
}
/** Company decision and subsequent action remain separate to preserve the offer history. */
export function outcomeLabel(item: Application) {
  return item.companyResult
    ? `${item.companyResult}${item.afterResult ? ` → ${item.afterResult}` : ""}`
    : item.status;
}
export function progressSteps(item: Application) {
  const result = item.companyResult ?? sourceText("result");
  const steps: string[] =
    item.kind === "application"
      ? [
          sourceText("application"),
          sourceText("applicationScreening"),
          sourceText("meeting"),
          result,
        ]
      : [
          item.kind === "scout"
            ? sourceText("scoutReceived")
            : sourceText("offerReceived"),
          sourceText("reviewTerms"),
          sourceText("meeting"),
          result,
        ];
  if (item.companyResult === sourceText("jobOffer") && item.afterResult)
    steps.push(item.afterResult);
  const current = item.companyResult
    ? steps.length - 1
    : item.status === sourceText("unanswered")
      ? 0
      : item.status === sourceText("meeting")
        ? 2
        : 1;
  return { steps, current };
}

export function isNegativeStep(step: string) {
  return (
    [
      sourceText("offerDeclined"),
      sourceText("offerWithdrawn"),
      sourceText("notProceeding"),
      sourceText("notSelected"),
    ] as string[]
  ).includes(step);
}

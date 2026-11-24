import type { MessageKey } from "@/i18n/source";
export const CRITERIA = [
  ["response", "Comm"],
  ["explanation", "Comm"],
  ["listening", "Comm"],
  ["experience", "Skills"],
  ["knowledge", "Skills"],
  ["problemSolving", "Skills"],
  ["initiative", "Fit"],
  ["teamwork", "Fit"],
  ["adaptability", "Fit"],
  ["learning", "Fit"],
  ["motivation", "MotivationGroup"],
  ["understanding", "MotivationGroup"],
  ["availability", "Conditions"],
  ["compensation", "Conditions"],
  ["startTiming", "Conditions"],
].map(([id, category]) => ({
  id,
  category: `companyReview${category}` as MessageKey,
  label: `companyReview${id[0].toUpperCase()}${id.slice(1)}` as MessageKey,
  description:
    `companyReview${id[0].toUpperCase()}${id.slice(1)}Description` as MessageKey,
}));
export const SCALE = [5, 4, 3, 2, 1].map((score) => ({
  score,
  label: `companyReviewScale${score}` as MessageKey,
  description: `companyReviewScale${score}Description` as MessageKey,
}));
export type CompanyReview = {
  id: string;
  userId: string;
  recruitmentId: string | null;
  applicationName: string;
  userName: string;
  selectionStatus: string;
  kind: "application" | "scout" | "offer";
  statusChangedAt: string;
  reviewDeadline: string;
  overdue: boolean;
  evaluationId: string | null;
  evaluationVersion: number | null;
  rating: number | null;
  scores: { label: string; value: number }[] | null;
  reviewComment: string | null;
  reviewedAt: string | null;
  reviewedUpdatedAt: string | null;
  evaluatorName: string | null;
  canEdit: boolean;
  canDelete: boolean;
  publishAt: string | null;
};

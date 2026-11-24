import { sourceText } from "@/i18n/source";
import type {
  JobSearchItem,
  CompanySearchItem,
} from "@/components/search/types";
import type { Application } from "@/features/applications/data";
export type Document = {
  title?: string;
  kind?: string;
  employment?: string;
  location?: string;
  compensation?: string;
  description?: string;
  requirements?: string;
  articleHtml?: string;
  articleCss?: string;
  startDate?: string;
  endDate?: string;
  hidden?: boolean;
};
export type JobRow = {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  location: string;
  employmentType: string;
  salary: string;
  description: string | null;
  workStyle: string | null;
  rating: number;
  reviewCount: number;
  mark: string;
  markColor: string;
  tags: string[];
  document: Document;
  commonCss?: string;
  latitude?: number;
  longitude?: number;
};
export type CompanyRow = Omit<CompanySearchItem, "id"> & {
  id: string;
  website?: string;
  logoUrl?: string;
  latitude?: number;
  longitude?: number;
};
export const jobItem = (r: JobRow): JobSearchItem => ({
  ...r,
  mark: r.mark || r.companyName?.slice(0, 1) || sourceText("co"),
  description: r.description || "",
  workStyle: r.workStyle || "",
  tags: r.tags || [],
  rating: Number(r.rating) || 0,
  reviewCount: Number(r.reviewCount) || 0,
});
export const companyItem = (r: CompanyRow): CompanySearchItem => ({
  ...r,
  mark: r.mark || r.companyName?.slice(0, 1) || sourceText("co"),
  industry: r.industry || "",
  location: r.location || "",
  employeeRange: r.employeeRange || "",
  description: r.description || "",
  rating: Number(r.rating) || 0,
  reviewCount: Number(r.reviewCount) || 0,
  openJobCount: Number(r.openJobCount) || 0,
  reviewParticipationRate: Number(r.reviewParticipationRate) || 0,
  scores: r.scores || [],
});
export type InteractionRow = Application & {
  userId: string;
  ownerId: string;
  recruitmentId: string | null;
  roomId: string;
  stage: number;
  version: number;
  name: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canEvaluate: boolean;
  evaluationDeadline: string | null;
  snapshot: { document?: Document };
};
export type EvaluationRow = {
  applicationName?: string;
  recruitmentId?: string | null;
  id: string;
  interactionId: string;
  contractId: string | null;
  userId: string;
  ownerId: string;
  direction: "USER_TO_COMPANY" | "COMPANY_TO_USER";
  company: string;
  mode: "manual" | "automatic";
  total: number;
  answers: import("@/features/evaluations/model").EvaluationDraft | null;
  scores: { label: string; value: number }[];
  comment: string;
  submittedAt: string;
  publishAt: string;
  version: number;
};
export type ContractRow = {
  id: string;
  interactionId: string;
  userId: string;
  ownerId: string;
  recruitmentId: string | null;
  title: string;
  company: string;
  startDate: string | null;
  endDate: string | null;
  status: "契約中" | "契約終了";
  version: number;
};
export type ResumeRow = {
  id: string;
  title: string;
  body: {
    summary?: string;
    skills?: string[];
    employmentHistory?: {
      company: string;
      position: string;
      startDate: string;
      endDate: string | null;
      description: string;
    }[];
    education?: { school: string; department: string; graduatedAt: string }[];
  };
  publicResume: boolean;
  updatedAt: string;
  version: number;
};

import { sourceText } from "@/i18n/source";
export type Profile = {
  familyName: string;
  givenName: string;
  familyKana: string;
  givenKana: string;
  birthDate: string;
  city: string;
  phone: string;
  businessName: string;
  transport: string;
  bio: string;
  hobbies: string;
  skills: string[];
  occupation?: string;
  publicProfile?: boolean;
  allowScout?: boolean;
};
export type Contract = {
  id: string;
  kind: "company" | "job";
  companyId: string;
  company: string;
  jobId?: string;
  title: string;
  period: string;
  status: "契約中" | "契約終了";
};
export type ReceivedReview = {
  id: string;
  contractId: string | null;
  subject?: { kind: "company" | "job"; company: string; title: string };
  date: string;
  rating: number;
  comment: string;
  scores: { label: string; value: number }[];
};
export type WrittenReview = {
  mode?: "manual" | "automatic";
  contractId: string;
  rating: number;
  comment: string;
  updatedAt: string;
};
export type AccountData = { profile: Profile; written: WrittenReview[] };

export function isAccountData(value: unknown): value is AccountData {
  if (!value || typeof value !== "object") return false;
  const item = value as AccountData;
  const fields: (keyof Omit<Profile, "skills">)[] = [
    "familyName",
    "givenName",
    "familyKana",
    "givenKana",
    "birthDate",
    "city",
    "phone",
    "businessName",
    "transport",
    "bio",
    "hobbies",
  ];
  return (
    !!item.profile &&
    fields.every((key) => typeof item.profile[key] === "string") &&
    Array.isArray(item.profile.skills) &&
    item.profile.skills.every((v) => typeof v === "string") &&
    Array.isArray(item.written) &&
    item.written.every(
      (r) =>
        r &&
        typeof r.contractId === "string" &&
        typeof r.comment === "string" &&
        typeof r.updatedAt === "string" &&
        Number.isInteger(r.rating) &&
        r.rating >= 1 &&
        r.rating <= 5,
    )
  );
}

export function createAccountData(name: string, _mock = false): AccountData {
  const parts = name.trim().split(/[\s　]+/);
  return {
    profile: {
      familyName: parts[0] || "",
      givenName: parts.slice(1).join(" "),
      familyKana: "",
      givenKana: "",
      birthDate: "",
      city: "",
      phone: "",
      businessName: "",
      transport: "",
      bio: "",
      hobbies: "",
      skills: [],
      occupation: "",
      publicProfile: false,
      allowScout: false,
    },
    written: [],
  };
}
export function profileError(profile: Profile): string {
  if (!profile.familyName.trim() || !profile.givenName.trim())
    return sourceText("enterYourFamilyAndGivenNames");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(profile.birthDate))
    return sourceText("enterYourDateOfBirthInYyyy");
  const [y, m, d] = profile.birthDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== m - 1 ||
    date.getUTCDate() !== d ||
    date > new Date()
  )
    return sourceText("enterAValidDateOfBirth");
  if (profile.phone && !/^[\d+()\-\s]{6,25}$/.test(profile.phone))
    return sourceText("checkThePhoneNumberFormat");
  return "";
}
export function reviewError(rating: number, comment: string): string {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return sourceText("chooseARatingFrom1To5");
  if (!comment.trim()) return sourceText("enterReviewContent");
  if (comment.trim().length > 2000)
    return sourceText("reviewContentMustBeNoMoreThan");
  return "";
}

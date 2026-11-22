import { sourceText } from "@/i18n/source";
import type { SearchFilterConfig } from "./types";

export const JOB_FILTER_CONFIG: SearchFilterConfig = {
  keywordLabel: sourceText("keyword"),
  keywordPlaceholder: sourceText("jobTitleSkillsOrCompany"),
  locationLabel: sourceText("workLocation"),
  locationPlaceholder: sourceText("selectAPrefecture"),
  firstGroupLabel: sourceText("employmentType"),
  firstGroupOptions: [
    sourceText("fullTimeEmployee"),
    sourceText("fixedTermEmployee"),
    sourceText("freelanceContractWork"),
    sourceText("partTimeEmployee"),
  ].map((label) => ({ label, value: label })),
  secondGroupLabel: sourceText("workArrangements"),
  secondGroupOptions: [
    sourceText("fullyRemote"),
    sourceText("partlyRemote"),
    sourceText("sideJobsAllowed"),
    sourceText("noExperienceRequired"),
  ].map((label) => ({ label, value: label })),
  showSalary: true,
};

export const COMPANY_FILTER_CONFIG: SearchFilterConfig = {
  keywordLabel: sourceText("keyword"),
  keywordPlaceholder: sourceText("companyNameOrBusiness"),
  locationLabel: sourceText("headOfficeLocation"),
  locationPlaceholder: sourceText("selectAPrefecture"),
  firstGroupLabel: sourceText("industry"),
  firstGroupOptions: [
    sourceText("itAndTelecommunications"),
    sourceText("manufacturing"),
    sourceText("services"),
    sourceText("constructionAndRealEstate"),
  ].map((label) => ({ label, value: label })),
  secondGroupLabel: sourceText("companyReviews"),
  secondGroupOptions: [
    sourceText("45OrHigher"),
    sourceText("40OrHigher"),
    sourceText("35OrHigher"),
    sourceText("hasReviews"),
  ].map((label) => ({ label, value: label })),
};

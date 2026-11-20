import type { SearchFilterConfig } from "./types";

export const JOB_FILTER_CONFIG: SearchFilterConfig = {
  keywordLabel: "キーワード",
  keywordPlaceholder: "職種・スキル・企業名",
  locationLabel: "勤務地",
  locationPlaceholder: "都道府県を選択",
  firstGroupLabel: "雇用形態",
  firstGroupOptions: [
    "正社員",
    "契約社員",
    "業務委託",
    "アルバイト・パート",
  ].map((label) => ({ label, value: label })),
  secondGroupLabel: "働き方",
  secondGroupOptions: [
    "フルリモート",
    "一部リモート",
    "副業可",
    "未経験OK",
  ].map((label) => ({ label, value: label })),
  showSalary: true,
};

export const COMPANY_FILTER_CONFIG: SearchFilterConfig = {
  keywordLabel: "キーワード",
  keywordPlaceholder: "企業名・事業内容",
  locationLabel: "本社所在地",
  locationPlaceholder: "都道府県を選択",
  firstGroupLabel: "業種",
  firstGroupOptions: ["IT・通信", "メーカー", "サービス", "建設・不動産"].map(
    (label) => ({ label, value: label }),
  ),
  secondGroupLabel: "企業評価",
  secondGroupOptions: ["4.5以上", "4.0以上", "3.5以上", "評価あり"].map(
    (label) => ({ label, value: label }),
  ),
};

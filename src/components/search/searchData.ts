import type { CompanySearchItem, JobSearchItem, SearchFilterConfig } from "./types";

export const JOB_FILTER_CONFIG: SearchFilterConfig = {
  keywordLabel: "キーワード",
  keywordPlaceholder: "職種・スキル・企業名",
  locationLabel: "勤務地",
  locationPlaceholder: "都道府県を選択",
  firstGroupLabel: "雇用形態",
  firstGroupOptions: ["正社員", "契約社員", "業務委託", "アルバイト・パート"].map((label) => ({ label, value: label })),
  secondGroupLabel: "働き方",
  secondGroupOptions: ["フルリモート", "一部リモート", "副業可", "未経験OK"].map((label) => ({ label, value: label })),
  showSalary: true,
};

export const COMPANY_FILTER_CONFIG: SearchFilterConfig = {
  keywordLabel: "キーワード",
  keywordPlaceholder: "企業名・事業内容",
  locationLabel: "本社所在地",
  locationPlaceholder: "都道府県を選択",
  firstGroupLabel: "業種",
  firstGroupOptions: ["IT・通信", "メーカー", "サービス", "建設・不動産"].map((label) => ({ label, value: label })),
  secondGroupLabel: "企業評価",
  secondGroupOptions: ["4.5以上", "4.0以上", "3.5以上", "評価あり"].map((label) => ({ label, value: label })),
};

export const JOB_SEARCH_ITEMS: JobSearchItem[] = [
  { id: 1, mark: "T", markColor: "#159A69", title: "バックエンドエンジニア（TypeScript / AWS）", companyName: "TechVision株式会社", location: "東京都渋谷区", workStyle: "フルリモート", employmentType: "正社員", rating: 4.8, reviewCount: 186, salary: "45万円〜65万円", tags: ["TypeScript", "AWS", "フルリモート", "裁量労働制"], description: "自社サービスのバックエンド開発を担当します。柔軟な働き方と挑戦できる環境を用意しています。" },
  { id: 2, mark: "D", markColor: "#2563EB", title: "Webデザイナー（UI/UXデザイン）", companyName: "株式会社イノート", location: "大阪府大阪市", workStyle: "週3リモート可", employmentType: "正社員", rating: 4.6, reviewCount: 142, salary: "28万円〜45万円", tags: ["Figma", "UI/UX", "服装自由", "未経験OK"], description: "ユーザー体験を重視したデザインを通じ、プロダクトの価値向上に貢献していただきます。" },
  { id: 3, mark: "店", markColor: "#E9A525", title: "店舗運営スタッフ（店長候補）", companyName: "グリーンリーフ株式会社", location: "兵庫県神戸市", workStyle: "シフト制", employmentType: "正社員", rating: 4.4, reviewCount: 98, salary: "28万円〜35万円", tags: ["店舗運営", "接客", "未経験OK", "交通費支給"], description: "店舗運営やスタッフ育成、売上管理を担当し、地域に愛される店舗づくりを進めます。" },
];

export const COMPANY_SEARCH_ITEMS: CompanySearchItem[] = [
  { id: 1, mark: "T", markColor: "#159A69", companyName: "TechVision株式会社", industry: "IT・通信", location: "東京都渋谷区", rating: 4.8, reviewCount: 1186, description: "テクノロジーの力で社会課題の解決に挑戦する自社サービス開発企業です。", openJobCount: 42, reviewParticipationRate: 94, employeeRange: "101〜300名", scores: [{ label: "働きやすさ", value: 4.8 }, { label: "仕事内容", value: 4.7 }, { label: "コミュニケーション", value: 4.6 }] },
  { id: 2, mark: "I", markColor: "#2563EB", companyName: "株式会社イノート", industry: "メーカー", location: "愛知県名古屋市", rating: 4.6, reviewCount: 892, description: "イノベーションを追求する製造業メーカー。社員の成長と働きやすさを大切にしています。", openJobCount: 28, reviewParticipationRate: 92, employeeRange: "301〜500名", scores: [{ label: "働きやすさ", value: 4.6 }, { label: "仕事内容", value: 4.5 }, { label: "コミュニケーション", value: 4.4 }] },
  { id: 3, mark: "葉", markColor: "#23A879", companyName: "グリーンリーフ株式会社", industry: "サービス", location: "大阪府大阪市", rating: 4.4, reviewCount: 654, description: "環境・エネルギー分野で持続可能な社会の実現に貢献するサービス企業です。", openJobCount: 16, reviewParticipationRate: 90, employeeRange: "101〜300名", scores: [{ label: "働きやすさ", value: 4.4 }, { label: "仕事内容", value: 4.3 }, { label: "コミュニケーション", value: 4.2 }] },
  { id: 4, mark: "C", markColor: "#7357C8", companyName: "株式会社クラウドリンク", industry: "IT・通信", location: "福岡県福岡市", rating: 4.7, reviewCount: 543, description: "クラウド技術で企業のDXを支援し、若手が活躍できる環境を整えています。", openJobCount: 21, reviewParticipationRate: 91, employeeRange: "51〜100名", scores: [{ label: "働きやすさ", value: 4.7 }, { label: "仕事内容", value: 4.6 }, { label: "コミュニケーション", value: 4.5 }] },
];

export type FilterOption = {
  label: string;
  value: string;
};

export type SearchFilterConfig = {
  keywordLabel: string;
  keywordPlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  firstGroupLabel: string;
  firstGroupOptions: FilterOption[];
  secondGroupLabel: string;
  secondGroupOptions: FilterOption[];
  showSalary?: boolean;
};

export type SearchConditions = {
  keyword: string;
  location: string;
  selectedValues: string[];
  salaryMin?: string;
  salaryMax?: string;
};

export type JobSearchItem = {
  id: number;
  mark: string;
  markColor: string;
  title: string;
  companyName: string;
  location: string;
  workStyle: string;
  employmentType: string;
  rating: number;
  reviewCount: number;
  salary: string;
  tags: string[];
  description: string;
};

export type CompanySearchItem = {
  id: number;
  mark: string;
  markColor: string;
  companyName: string;
  industry: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  openJobCount: number;
  reviewParticipationRate: number;
  employeeRange: string;
  scores: { label: string; value: number }[];
};

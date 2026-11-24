export type Option = { id: string; name: string; version: number };
export type HrSettings = {
  departments: Option[];
  roles: Option[];
  positions: Option[];
  employees: { id: string; name: string; email: string }[];
  settings: { version: number; defaultRoleId: string };
  canWrite: boolean;
  canDelete: boolean;
  canSetDefaults: boolean;
};
export type Employment = {
  id: string;
  joinDate: string;
  departmentId: string | null;
  positionId: string | null;
  roleId: string;
  employeeId: string;
  status: string;
  version: number;
};
export type HrDetail = {
  linkedEmployee?: {
    id: string;
    name: string;
    email: string;
    employeeNumber: string | null;
  } | null;
  interaction: { id: string; name: string; title: string };
  employment: Employment | null;
  documents: {
    id: string;
    kind: string;
    fileName: string;
    taxYear: number | null;
  }[];
  latestCareer: { id: string; title: string; body: unknown } | null;
  received: { id: string; kind: string; fileName: string }[];
  canWrite: boolean;
};
export const emptySettings: HrSettings = {
  departments: [],
  roles: [],
  positions: [],
  employees: [],
  settings: { version: 0, defaultRoleId: "" },
  canWrite: false,
  canDelete: false,
  canSetDefaults: false,
};
export type MailTemplate = {
  id?: string;
  version: number;
  name: string;
  result: string;
  recruitmentId: string | null;
  recruitmentKind: string;
  employmentType: string;
  subject: string;
  body: string;
  enabled: boolean;
};
export type MailLog = {
  id: string;
  recipientKind: string;
  subject: string;
  body: string;
  state: "PENDING" | "PROCESSING" | "SENT" | "FAILED" | "UNCERTAIN";
  attempts: number;
  sentAt: string | null;
  lastError: string | null;
};

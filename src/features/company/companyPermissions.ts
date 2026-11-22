import { sourceText } from "@/i18n/source";
export const permissionColumns = [
  ["recruitmentAll", sourceText("jobManagementAllPostings")],
  ["recruitmentAssigned", sourceText("jobManagementAssignedPostings")],
  ["applicantsAll", sourceText("applicantManagementAllPostings")],
  ["applicantsAssigned", sourceText("applicantManagementAssignedPostings")],
  ["employees", sourceText("employeeManagement_1075")],
  ["roles", sourceText("permissionManagement")],
] as const;

export type LevelKey = (typeof permissionColumns)[number][0];
export type PermissionLevel = 0 | 1 | 2 | 3;
export type Flags = Record<LevelKey, PermissionLevel> & { scout: boolean };
export const noPermissions: Flags = {
  recruitmentAll: 0,
  recruitmentAssigned: 0,
  applicantsAll: 0,
  applicantsAssigned: 0,
  employees: 0,
  roles: 0,
  scout: false,
};
export const permissionOptions = [
  { value: "3", label: sourceText("fullAccessViewCreateUpdateDelete") },
  { value: "1", label: sourceText("readOnly") },
  { value: "2", label: sourceText("viewCreateUpdate") },
  { value: "0", label: sourceText("noAccess") },
];
export const levelLabel = (level: PermissionLevel) =>
  permissionOptions.find((option) => Number(option.value) === level)?.label ||
  sourceText("noAccess");

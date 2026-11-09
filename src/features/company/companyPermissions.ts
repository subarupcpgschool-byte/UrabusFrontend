export const permissionColumns = [
  ['recruitmentAll', '求人管理（すべて）'],
  ['recruitmentAssigned', '求人管理（対象案件）'],
  ['applicantsAll', '応募者管理（すべて）'],
  ['applicantsAssigned', '応募者管理（対象案件）'],
  ['employees', '社員管理'],
  ['roles', '権限管理'],
] as const;

export type LevelKey = typeof permissionColumns[number][0];
export type PermissionLevel = 0 | 1 | 2 | 3;
export type Flags = Record<LevelKey, PermissionLevel> & { scout: boolean };
export const noPermissions: Flags = {
  recruitmentAll: 0, recruitmentAssigned: 0, applicantsAll: 0, applicantsAssigned: 0,
  employees: 0, roles: 0, scout: false,
};
export const permissionOptions = [
  { value: '3', label: 'すべて（閲覧・作成・更新・削除）' },
  { value: '1', label: '閲覧のみ' },
  { value: '2', label: '閲覧・作成・更新' },
  { value: '0', label: 'アクセス不可' },
];
export const levelLabel = (level: PermissionLevel) => permissionOptions.find(option => Number(option.value) === level)?.label || 'アクセス不可';

import { useEffect, useState, type ReactNode } from 'react';
import AppPage from '@/components/layout/AppPage';
import { BodyText, Panel } from '@/components/ui/AppUI';
import { useAuth } from '@/auth/AuthProvider';
import { authRequest } from '@/auth/api';
import type { Flags, PermissionLevel } from './companyPermissions';

type PermissionKey = 'employees' | 'applicants' | 'scout';

export function useCompanyPermission(permission: PermissionKey) {
  const { user, token, ready } = useAuth();
  const [result, setResult] = useState<{ token: string; flags?: Flags; error: string } | null>(null);
  useEffect(() => {
    let active = true;
    if (user?.accountType !== 'EMPLOYEE' || !token) return;
    authRequest<Flags>('/company-management/permissions', undefined, token)
      .then(flags => { if (active) setResult({ token, flags, error: '' }); })
      .catch(e => { if (active) setResult({ token, error: e instanceof Error ? e.message : '権限を確認できませんでした。' }); });
    return () => { active = false; };
  }, [token, user?.accountType]);
  if (!ready) return { ready: false, level: 0, allowed: false, assignedOnly: false, error: '' };
  if (user?.accountType === 'COMPANY') return { ready: true, level: 3, allowed: true, assignedOnly: false, error: '' };
  if (user?.accountType !== 'EMPLOYEE' || !token) return { ready: true, level: 0, allowed: false, assignedOnly: false, error: '' };
  const flags = result?.token === token ? result.flags : undefined;
  let level: PermissionLevel = 0;
  let assignedOnly = false;
  if (flags) {
    if (permission === 'employees') level = flags.employees;
    if (permission === 'scout') level = flags.scout ? 3 : 0;
    if (permission === 'applicants') {
      level = flags.applicantsAll || flags.applicantsAssigned;
      assignedOnly = !flags.applicantsAll && flags.applicantsAssigned > 0;
    }
  }
  return { ready: result?.token === token, allowed: level > 0, level, assignedOnly, error: result?.error || '' };
}
export function CompanyPermissionBoundary({ permission, title, children }: { permission: PermissionKey; title: string; children: ReactNode }) {
  const check = useCompanyPermission(permission);
  if (check.ready && check.allowed && !check.assignedOnly) return <>{children}</>;
  const text = !check.ready ? '権限を確認中…' : check.assignedOnly ? '対象案件の応募者はまだ表示できるデータがありません。' :
    check.error || 'この画面を利用する権限がありません。企業オーナーに確認してください。';
  return <AppPage title={title} subtitle="" role="company" activeMenu={title}><Panel><BodyText>{text}</BodyText></Panel></AppPage>;
}

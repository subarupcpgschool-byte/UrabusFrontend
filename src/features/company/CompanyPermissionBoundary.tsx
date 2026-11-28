import { translateText } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import { useLocaleVersion } from "@/i18n/display";
import { useEffect, useState, type ReactNode } from "react";
import AppPage from "@/components/layout/AppPage";
import { BodyText, Panel } from "@/components/ui/AppUI";
import { useAuth } from "@/auth/AuthProvider";
import { authRequest } from "@/auth/api";
import type { Flags, PermissionLevel } from "./companyPermissions";

type PermissionKey = "employees" | "applicants" | "scout";

export function useCompanyPermission(permission: PermissionKey) {
  const { user, token, ready } = useAuth();
  const [result, setResult] = useState<{
    token: string;
    flags?: Flags;
    error: string;
  } | null>(null);
  useEffect(() => {
    let active = true;
    if (user?.accountType !== "EMPLOYEE" || !token) return;
    authRequest<Flags>("/company-management/permissions", undefined, token)
      .then((flags) => {
        if (active) setResult({ token, flags, error: "" });
      })
      .catch((e) => {
        if (active)
          setResult({
            token,
            error:
              e instanceof Error
                ? e.message
                : sourceText("unableToCheckPermissions"),
          });
      });
    return () => {
      active = false;
    };
  }, [token, user?.accountType]);
  if (!ready)
    return {
      allLevel: 0,
      ready: false,
      level: 0,
      allowed: false,
      assignedOnly: false,
      error: "",
    };
  if (user?.accountType === "COMPANY")
    return {
      allLevel: 3,
      ready: true,
      level: 3,
      allowed: true,
      assignedOnly: false,
      error: "",
    };
  if (user?.accountType !== "EMPLOYEE" || !token)
    return {
      allLevel: 0,
      ready: true,
      level: 0,
      allowed: false,
      assignedOnly: false,
      error: "",
    };
  const flags = result?.token === token ? result.flags : undefined;
  let level: PermissionLevel = 0;
  let assignedOnly = false;
  if (flags) {
    if (permission === "employees") level = flags.employees;
    if (permission === "scout") level = flags.scout ? 3 : 0;
    if (permission === "applicants") {
      level = Math.max(
        flags.applicantsAll,
        flags.applicantsAssigned,
      ) as PermissionLevel;
      assignedOnly = !flags.applicantsAll && flags.applicantsAssigned > 0;
    }
  }
  return {
    allLevel: flags
      ? permission === "applicants"
        ? flags.applicantsAll
        : level
      : 0,
    ready: result?.token === token,
    allowed: level > 0,
    level,
    assignedOnly,
    error: result?.error || "",
  };
}
export function CompanyPermissionBoundary({
  permission,
  title,
  children,
}: {
  permission: PermissionKey;
  title: string;
  children: ReactNode;
}) {
  "use no memo";
  useLocaleVersion();
  const check = useCompanyPermission(permission);
  if (check.ready && check.allowed) return <>{children}</>;
  const text = !check.ready
    ? sourceText("checkingPermissions")
    : check.assignedOnly
      ? sourceText("thereIsNoApplicantDataAvailableFor")
      : check.error || sourceText("youDoNotHaveAccessToThis");
  return (
    <AppPage
      title={translateText(title)}
      subtitle=""
      role="company"
      activeMenu={title}
    >
      <Panel>
        <BodyText>{text}</BodyText>
      </Panel>
    </AppPage>
  );
}

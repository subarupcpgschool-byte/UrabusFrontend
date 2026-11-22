import { useLocaleVersion } from "@/i18n/display";
import ApplicationsWorkspace from "@/features/applications/ApplicationsWorkspace";
export default function ApplicationsPage() {
  "use no memo";
  useLocaleVersion();
  return <ApplicationsWorkspace />;
}

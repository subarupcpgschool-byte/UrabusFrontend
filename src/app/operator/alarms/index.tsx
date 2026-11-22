import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import AppPage from "@/components/layout/AppPage";
import {
  ResourceEditor,
  ruleFields,
  alarmFields,
} from "@/features/operator/ResourceEditor";
export default function AlarmsPage() {
  "use no memo";
  useLocaleVersion();
  return (
    <AppPage
      title={tText("alerts")}
      subtitle=""
      role="operator"
      activeMenu={sourceText("alerts")}
    >
      <ResourceEditor
        path="/operator/rules"
        title={tText("alertRules")}
        fields={ruleFields}
      />
      <ResourceEditor
        path="/operator/alarms"
        title={tText("alertAndResponseHistory")}
        fields={alarmFields}
      />
    </AppPage>
  );
}

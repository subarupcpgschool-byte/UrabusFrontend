import AppPage from "@/components/layout/AppPage";
import {
  ResourceEditor,
  ruleFields,
  alarmFields,
} from "@/features/operator/ResourceEditor";
export default function AlarmsPage() {
  return (
    <AppPage title="アラーム" subtitle="" role="operator" activeMenu="アラーム">
      <ResourceEditor
        path="/operator/rules"
        title="アラームルール"
        fields={ruleFields}
      />
      <ResourceEditor
        path="/operator/alarms"
        title="発報・対応履歴"
        fields={alarmFields}
      />
    </AppPage>
  );
}

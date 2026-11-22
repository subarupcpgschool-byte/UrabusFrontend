import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion, localeTag } from "@/i18n/display";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import AppPage from "@/components/layout/AppPage";
import {
  BodyText,
  Panel,
  SectionTitle,
  DataTable,
} from "@/components/ui/AppUI";
import {
  ResourceEditor,
  metricFields,
} from "@/features/operator/ResourceEditor";
export default function MonitorPage() {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const r = useResource<{
    metrics: {
      service: string;
      metric: string;
      sum: number;
      average: number;
      samples: number;
    }[];
    alarms: { status: string; count: number }[];
    recentEvents: {
      service: string;
      message: string;
      severity: string;
      occurredAt: string;
    }[];
  }>(
    token ? "/operator/monitor" : null,
    { metrics: [], alarms: [], recentEvents: [] },
    true,
  );
  return (
    <AppPage
      title={tText("monitoring")}
      subtitle=""
      role="operator"
      activeMenu={sourceText("monitoring")}
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      <Panel>
        <SectionTitle>{tText("measurementsFromThePast24Hours")}</SectionTitle>
        {r.data.metrics.length ? (
          <DataTable
            headers={[
              sourceText("services"),
              sourceText("metric"),
              sourceText("total_447"),
              sourceText("average"),
              sourceText("count"),
            ]}
            rows={r.data.metrics.map((m) => [
              m.service,
              m.metric,
              String(m.sum),
              String(m.average),
              String(m.samples),
            ])}
          />
        ) : (
          <BodyText>{tText("noMeasurementsHaveBeenRecorded")}</BodyText>
        )}
      </Panel>
      <Panel>
        <SectionTitle>{tText("alertResponseStatus")}</SectionTitle>
        {r.data.alarms.map((a) => (
          <BodyText key={a.status}>
            {a.status}：{a.count}
            {tText("total_199")}
          </BodyText>
        ))}
      </Panel>
      <Panel>
        <SectionTitle>{tText("recentEvents")}</SectionTitle>
        <DataTable
          headers={[
            sourceText("dateAndTime"),
            sourceText("services"),
            sourceText("content"),
            sourceText("severity"),
          ]}
          rows={r.data.recentEvents.map((e) => [
            new Date(e.occurredAt).toLocaleString(localeTag()),
            e.service,
            e.message,
            e.severity,
          ])}
        />
      </Panel>
      {!r.error && (
        <ResourceEditor
          path="/operator/metrics"
          title={tText("measuredValue")}
          fields={metricFields}
        />
      )}
    </AppPage>
  );
}

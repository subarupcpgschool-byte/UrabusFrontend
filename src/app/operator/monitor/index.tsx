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
    <AppPage title="モニター" subtitle="" role="operator" activeMenu="モニター">
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      <Panel>
        <SectionTitle>過去24時間の計測結果</SectionTitle>
        {r.data.metrics.length ? (
          <DataTable
            headers={["サービス", "計測項目", "合計", "平均", "件数"]}
            rows={r.data.metrics.map((m) => [
              m.service,
              m.metric,
              String(m.sum),
              String(m.average),
              String(m.samples),
            ])}
          />
        ) : (
          <BodyText>計測データはまだありません。</BodyText>
        )}
      </Panel>
      <Panel>
        <SectionTitle>アラーム対応状況</SectionTitle>
        {r.data.alarms.map((a) => (
          <BodyText key={a.status}>
            {a.status}：{a.count}件
          </BodyText>
        ))}
      </Panel>
      <Panel>
        <SectionTitle>直近のイベント</SectionTitle>
        <DataTable
          headers={["日時", "サービス", "内容", "重要度"]}
          rows={r.data.recentEvents.map((e) => [
            new Date(e.occurredAt).toLocaleString("ja-JP"),
            e.service,
            e.message,
            e.severity,
          ])}
        />
      </Panel>
      {!r.error && (
        <ResourceEditor
          path="/operator/metrics"
          title="計測値"
          fields={metricFields}
        />
      )}
    </AppPage>
  );
}

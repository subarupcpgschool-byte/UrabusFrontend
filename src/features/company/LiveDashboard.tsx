import { Link } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import AppPage from "@/components/layout/AppPage";
import {
  Panel,
  SectionTitle,
  BodyText,
  StatCard,
  KpiRow,
} from "@/components/ui/AppUI";
export default function LiveDashboard() {
  const { token } = useAuth();
  const r = useResource<{
    interactions: {
      kind: string;
      count: number;
      inProgress: number;
      accepted: number;
    }[];
    contracts: unknown[];
  }>(token ? "/dashboard" : null, { interactions: [], contracts: [] }, true);
  return (
    <AppPage
      title="ダッシュボード"
      subtitle=""
      role="company"
      activeMenu="ダッシュボード"
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      <KpiRow>
        {r.data.interactions.map((i) => (
          <StatCard
            key={i.kind}
            label={
              i.kind === "application"
                ? "応募"
                : i.kind === "scout"
                  ? "スカウト"
                  : "オファー"
            }
            value={`${i.count}件`}
            change={`進行中 ${i.inProgress} ／ 内定 ${i.accepted}`}
          />
        ))}
      </KpiRow>
      <Panel>
        <SectionTitle>採用メニュー</SectionTitle>
        {[
          ["/company/applications", "応募・選考管理"],
          ["/company/jobs", "求人管理"],
          ["/company/talent", "人材検索"],
          ["/company/employees", "社員一覧"],
          ["/company/settings", "企業・権限"],
        ].map(([href, title]) => (
          <Link key={href} href={href as never}>
            <BodyText>{title}　›</BodyText>
          </Link>
        ))}
      </Panel>
    </AppPage>
  );
}

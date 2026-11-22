import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
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
  "use no memo";
  useLocaleVersion();
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
      title={tText("dashboard")}
      subtitle=""
      role="company"
      activeMenu={sourceText("dashboard")}
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
                ? sourceText("application")
                : i.kind === "scout"
                  ? sourceText("scout")
                  : sourceText("offer")
            }
            value={sourceFormat("total_654", { v0: i.count }, [])}
            change={sourceFormat(
              "inProgressJobOffers",
              { v0: i.inProgress, v1: i.accepted },
              [],
            )}
          />
        ))}
      </KpiRow>
      <Panel>
        <SectionTitle>{tText("hiringMenu")}</SectionTitle>
        {[
          ["/company/applications", sourceText("applicationsAndSelection")],
          ["/company/jobs", sourceText("jobManagement")],
          ["/company/talent", sourceText("talentSearch")],
          ["/company/employees", sourceText("employeeList_932")],
          ["/company/settings", sourceText("companyAndPermissions")],
        ].map(([href, title]) => (
          <Link key={href} href={href as never}>
            <BodyText>{title}　›</BodyText>
          </Link>
        ))}
      </Panel>
    </AppPage>
  );
}

import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import {
  companyItem,
  jobItem,
  type CompanyRow,
  type JobRow,
} from "@/api/models";
import type { Page } from "@/api/platform";
import AppPage from "@/components/layout/AppPage";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
  StatCard,
} from "@/components/ui/AppUI";
import { Tabs } from "@/features/account/Tabs";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import FavoriteButton from "@/components/search/FavoriteButton";
import JobSearchCard from "@/components/search/JobSearchCard";
import PublishedCompanyEvaluations from "@/features/evaluations/PublishedCompanyEvaluations";
export default function CompanyDetailPage() {
  "use no memo";
  useLocaleVersion();
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const r = useResource<CompanyRow | null>(
    id ? `/companies/${id}` : null,
    null,
  );
  const jobs = useResource<Page<JobRow>>(
    id ? `/jobs?companyId=${id}&pageSize=20` : null,
    { items: [], total: 0, page: 1, pageSize: 20 },
  );
  const { user } = useAuth();
  const { openRoom } = useWorkspace();
  const [tab, setTab] = useState("overview"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const company = r.data ? companyItem(r.data) : null;
  async function contact() {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (!company || busy) return;
    setBusy(true);
    try {
      const room = await openRoom(
        "company",
        id,
        company.companyName,
        sourceText("contactTheCompany"),
      );
      router.push({ pathname: "/messages", params: { room } });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage title={tText("companyDetails")} subtitle="">
      <ResourceStatus loading={r.loading} error={r.error} onRetry={r.refresh} />
      {company && (
        <>
          <Panel>
            <Text localize={false} style={{ fontSize: 22, fontWeight: "700" }}>
              {company.companyName}
            </Text>
            <BodyText>
              {company.industry} ／ {company.location}
            </BodyText>
            <FavoriteButton
              label={company.companyName}
              kind="company"
              item={company}
            />
            <BodyText localize={false}>
              {company.description || tText("noIntroductionHasBeenAdded")}
            </BodyText>
            <AppButton
              label={
                busy ? sourceText("processing") : sourceText("messageCompany")
              }
              onPress={() => void contact()}
            />
            {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
          </Panel>
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <StatCard
              label={tText("companyReviews")}
              value={
                company.reviewCount
                  ? Number(company.rating).toFixed(1)
                  : sourceText("notReviewed")
              }
            />
            <StatCard
              label={tText("openJobs_133")}
              value={String(company.openJobCount)}
            />
            <StatCard
              label={tText("reviewParticipationRate")}
              value={`${company.reviewParticipationRate}%`}
            />
          </View>
          <Tabs
            label={tText("companyDetails")}
            value={tab}
            onChange={setTab}
            options={[
              {
                value: "overview",
                label: sourceText("companyInformation_135"),
              },
              {
                value: "jobs",
                label: sourceText("jobOpenings"),
                count: jobs.data.total,
              },
              { value: "reviews", label: sourceText("reviews") },
            ]}
          />
          {tab === "overview" && (
            <Panel>
              <SectionTitle>{tText("companyOverview")}</SectionTitle>
              {[
                [sourceText("companyName"), company.companyName],
                [sourceText("industry"), company.industry],
                [sourceText("location"), company.location],
                [sourceText("numberOfEmployees"), company.employeeRange],
              ].map(([label, value]) => (
                <BodyText key={label}>
                  {label}：{value || sourceText("notRegistered")}
                </BodyText>
              ))}
            </Panel>
          )}
          {tab === "jobs" && (
            <>
              <ResourceStatus
                loading={jobs.loading}
                error={jobs.error}
                onRetry={jobs.refresh}
              />
              {jobs.data.items.map((j) => (
                <JobSearchCard
                  key={j.id}
                  item={jobItem(j)}
                  onPressDetail={(i) => router.push(`/jobs/${i}` as never)}
                  onPressApply={(i) => router.push(`/jobs/${i}/apply` as never)}
                />
              ))}
              {!jobs.loading && !jobs.error && !jobs.data.total && (
                <BodyText>{tText("thereAreNoOpenJobs")}</BodyText>
              )}
              {jobs.data.total > 20 && (
                <AppButton
                  label={tText("seeAllJobOpenings")}
                  outline
                  onPress={() =>
                    router.push({
                      pathname: "/jobs",
                      params: { companyId: id },
                    })
                  }
                />
              )}
            </>
          )}
          {tab === "reviews" && <PublishedCompanyEvaluations companyId={id} />}
        </>
      )}
    </AppPage>
  );
}

import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
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
        "企業へのお問い合わせ",
      );
      router.push({ pathname: "/messages", params: { room } });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage title="企業詳細" subtitle="">
      <ResourceStatus loading={r.loading} error={r.error} onRetry={r.refresh} />
      {company && (
        <>
          <Panel>
            <Text style={{ fontSize: 22, fontWeight: "700" }}>
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
            <BodyText>{company.description || "紹介文は未登録です。"}</BodyText>
            <AppButton
              label={busy ? "処理中…" : "企業へメッセージ"}
              onPress={() => void contact()}
            />
            {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
          </Panel>
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <StatCard
              label="企業評価"
              value={
                company.reviewCount
                  ? Number(company.rating).toFixed(1)
                  : "未評価"
              }
            />
            <StatCard label="公開求人数" value={String(company.openJobCount)} />
            <StatCard
              label="評価協力率"
              value={`${company.reviewParticipationRate}%`}
            />
          </View>
          <Tabs
            label="企業詳細"
            value={tab}
            onChange={setTab}
            options={[
              { value: "overview", label: "企業情報" },
              { value: "jobs", label: "募集求人", count: jobs.data.total },
              { value: "reviews", label: "評価" },
            ]}
          />
          {tab === "overview" && (
            <Panel>
              <SectionTitle>企業概要</SectionTitle>
              {[
                ["企業名", company.companyName],
                ["業種", company.industry],
                ["所在地", company.location],
                ["従業員数", company.employeeRange],
              ].map(([label, value]) => (
                <BodyText key={label}>
                  {label}：{value || "未登録"}
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
                <BodyText>公開中の求人はありません。</BodyText>
              )}
              {jobs.data.total > 20 && (
                <AppButton
                  label="すべての募集求人を見る"
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

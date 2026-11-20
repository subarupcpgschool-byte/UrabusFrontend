import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import { jobItem, type JobRow } from "@/api/models";
import AppPage from "@/components/layout/AppPage";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
  StatusBadge,
  TwoColumn,
} from "@/components/ui/AppUI";
import FavoriteButton from "@/components/search/FavoriteButton";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
import {
  RecruitmentArticle,
  articleHtml,
} from "@/features/company/RecruitmentArticle";
import PublishedCompanyEvaluations from "@/features/evaluations/PublishedCompanyEvaluations";
export default function JobDetailPage() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const resource = useResource<JobRow | null>(id ? `/jobs/${id}` : null, null);
  const { user, token } = useAuth();
  const { openRoom } = useWorkspace();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const row = resource.data;
  const job = row ? jobItem(row) : null;
  async function contact() {
    if (!user) {
      router.push("/auth");
      return;
    }
    if (busy || !job) return;
    setBusy(true);
    try {
      const room = await openRoom("job", id, job.companyName, job.title);
      router.push({ pathname: "/messages", params: { room } });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage title="求人詳細" subtitle="">
      <ResourceStatus
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.refresh}
      />
      {row && job && (
        <TwoColumn>
          <View style={{ flex: 2, minWidth: 260, gap: 14 }}>
            <Panel>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                {job.title}
              </Text>
              <AppButton
                label={job.companyName + "の企業情報"}
                outline
                onPress={() =>
                  router.push(`/companies/${row.companyId}` as never)
                }
              />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {[job.location, job.employmentType, job.workStyle, ...job.tags]
                  .filter(Boolean)
                  .map((tag, i) => (
                    <StatusBadge key={i} label={tag} />
                  ))}
              </View>
              <Text>{job.salary}</Text>
            </Panel>
            <Panel>
              <SectionTitle>募集内容</SectionTitle>
              <RecruitmentArticle
                html={articleHtml(row.document)}
                articleCss={row.document.articleCss || ""}
                commonCss={row.commonCss || ""}
              />
            </Panel>
            <Panel>
              <SectionTitle>応募条件・募集期間</SectionTitle>
              <BodyText>{row.document.requirements || "未登録"}</BodyText>
              <BodyText>
                {row.document.startDate || "開始制限なし"} 〜{" "}
                {row.document.endDate || "無期限"}
              </BodyText>
            </Panel>
            <PublishedCompanyEvaluations companyId={row.companyId} />
          </View>
          <View style={{ flex: 1, minWidth: 240, gap: 14 }}>
            <Panel>
              <SectionTitle>応募・お問い合わせ</SectionTitle>
              <Text>{job.salary}</Text>
              <AppButton
                label="応募する"
                onPress={() => router.push(`/jobs/${id}/apply` as never)}
              />
              <FavoriteButton label={job.title} item={job} kind="job" />
              <AppButton
                label={busy ? "処理中…" : "メッセージを開く"}
                outline
                onPress={() => void contact()}
              />
              {!!token && (
                <AppButton
                  label="求人比較に追加"
                  outline
                  onPress={() => {
                    if (busy) return;
                    setBusy(true);
                    void dataRequest(
                      `/comparisons/${id}`,
                      token,
                      undefined,
                      "PUT",
                    )
                      .then(() => router.push("/company/compare"))
                      .catch((e) => setError(e.message))
                      .finally(() => setBusy(false));
                  }}
                />
              )}
              {!!error && (
                <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                  {error}
                </Text>
              )}
            </Panel>
          </View>
        </TwoColumn>
      )}
    </AppPage>
  );
}

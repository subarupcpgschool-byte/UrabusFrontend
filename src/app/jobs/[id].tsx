import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
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
  "use no memo";
  useLocaleVersion();
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
    <AppPage title={tText("jobDetails")} subtitle="">
      <ResourceStatus
        loading={resource.loading}
        error={resource.error}
        onRetry={resource.refresh}
      />
      {row && job && (
        <TwoColumn>
          <View style={{ flex: 2, minWidth: 260, gap: 14 }}>
            <Panel>
              <Text
                localize={false}
                style={{ fontSize: 20, fontWeight: "700" }}
              >
                {job.title}
              </Text>
              <AppButton
                label={job.companyName + sourceText("companyInformation_424")}
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
              <SectionTitle>{tText("postingContent")}</SectionTitle>
              <RecruitmentArticle
                html={articleHtml(row.document)}
                articleCss={row.document.articleCss || ""}
                commonCss={row.commonCss || ""}
              />
            </Panel>
            <Panel>
              <SectionTitle>
                {tText("requirementsAndPostingPeriod")}
              </SectionTitle>
              <BodyText>
                {row.document.requirements || sourceText("notRegistered")}
              </BodyText>
              <BodyText>
                {row.document.startDate || sourceText("noStartRestriction")} 〜{" "}
                {row.document.endDate || sourceText("noEndDate")}
              </BodyText>
            </Panel>
            <PublishedCompanyEvaluations companyId={row.companyId} />
          </View>
          <View style={{ flex: 1, minWidth: 240, gap: 14 }}>
            <Panel>
              <SectionTitle>{tText("applyOrContact")}</SectionTitle>
              <Text>{job.salary}</Text>
              <AppButton
                label={tText("apply")}
                onPress={() => router.push(`/jobs/${id}/apply` as never)}
              />
              <FavoriteButton label={job.title} item={job} kind="job" />
              <AppButton
                label={
                  busy ? sourceText("processing") : sourceText("openMessages")
                }
                outline
                onPress={() => void contact()}
              />
              {!!token && (
                <AppButton
                  label={tText("addToJobComparison")}
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

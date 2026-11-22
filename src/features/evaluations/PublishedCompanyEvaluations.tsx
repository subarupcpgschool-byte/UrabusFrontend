import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { View } from "react-native";
import { useResource, ResourceStatus } from "@/api/useResource";
import type { EvaluationRow } from "@/api/models";
import { Panel, BodyText, SectionTitle } from "@/components/ui/AppUI";
export default function PublishedCompanyEvaluations({
  companyId,
}: {
  companyId: string;
}) {
  "use no memo";
  useLocaleVersion();
  const r = useResource<EvaluationRow[]>(
    `/companies/${companyId}/evaluations`,
    [],
  );
  return (
    <Panel>
      <SectionTitle>{tText("companyReviews")}</SectionTitle>
      <ResourceStatus loading={r.loading} error={r.error} onRetry={r.refresh} />
      {!r.loading && !r.error && !r.data.length && (
        <BodyText>{tText("noReviewsHaveBeenPublishedYet")}</BodyText>
      )}
      {r.data.map((e) => (
        <View
          key={e.id}
          style={{
            gap: 8,
            borderTopWidth: 1,
            borderColor: "#DDE6F1",
            paddingTop: 12,
          }}
        >
          <Text>
            {Number(e.total).toFixed(1)} / 5.0　
            {e.mode === "automatic"
              ? sourceText("automaticReview")
              : sourceText("userReview")}
          </Text>
          {!!e.comment && <BodyText localize={false}>{e.comment}</BodyText>}
          {e.answers &&
            "response" in e.answers &&
            (["response", "description", "work"] as const).map((k, i) => (
              <View key={k}>
                <Text>
                  {
                    [
                      sourceText("communication_1168"),
                      sourceText("jobExplanation"),
                      sourceText("jobDescription"),
                    ][i]
                  }
                  ：{e.answers![k].score || 5}
                </Text>
                <BodyText localize={false}>
                  {[...e.answers![k].choices, e.answers![k].comment]
                    .filter(Boolean)
                    .join(" ／ ")}
                </BodyText>
              </View>
            ))}
        </View>
      ))}
    </Panel>
  );
}

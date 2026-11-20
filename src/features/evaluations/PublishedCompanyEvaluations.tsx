import { View, Text } from "react-native";
import { useResource, ResourceStatus } from "@/api/useResource";
import type { EvaluationRow } from "@/api/models";
import { Panel, BodyText, SectionTitle } from "@/components/ui/AppUI";
export default function PublishedCompanyEvaluations({
  companyId,
}: {
  companyId: string;
}) {
  const r = useResource<EvaluationRow[]>(
    `/companies/${companyId}/evaluations`,
    [],
  );
  return (
    <Panel>
      <SectionTitle>企業評価</SectionTitle>
      <ResourceStatus loading={r.loading} error={r.error} onRetry={r.refresh} />
      {!r.loading && !r.error && !r.data.length && (
        <BodyText>公開されている評価はまだありません。</BodyText>
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
            {e.mode === "automatic" ? "自動評価" : "利用者の評価"}
          </Text>
          {!!e.comment && <BodyText>{e.comment}</BodyText>}
          {e.answers &&
            "response" in e.answers &&
            (["response", "description", "work"] as const).map((k, i) => (
              <View key={k}>
                <Text>
                  {["対応", "案件説明", "仕事内容"][i]}：
                  {e.answers![k].score || 5}
                </Text>
                <BodyText>
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

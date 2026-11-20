import { View, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { Document } from "@/api/models";
import AppPage from "@/components/layout/AppPage";
import { AppButton, Panel, BodyText } from "@/components/ui/AppUI";
import { ConfirmAction } from "@/api/ApiUI";
export default function ComparePage() {
  const { token, user } = useAuth();
  const r = useResource<
    { recruitmentId: string; document: Document; companyName: string }[]
  >(token ? "/comparisons" : null, [], true);
  return (
    <AppPage
      title="求人比較"
      subtitle=""
      role={user?.accountType === "GENERAL" ? "user" : "company"}
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        {r.data.map((j) => (
          <Panel key={j.recruitmentId} style={{ flex: 1, minWidth: 260 }}>
            <Text style={{ fontSize: 17, fontWeight: "700" }}>
              {j.document.title}
            </Text>
            <BodyText>{j.companyName}</BodyText>
            <BodyText>
              {j.document.location} ／ {j.document.employment}
            </BodyText>
            <BodyText>{j.document.compensation}</BodyText>
            <BodyText>{j.document.requirements}</BodyText>
            <AppButton
              label="詳細を見る"
              onPress={() => router.push(`/jobs/${j.recruitmentId}` as never)}
            />
            <ConfirmAction
              label="比較から外す"
              message="この求人を比較一覧から外しますか？"
              onConfirm={() =>
                dataRequest(
                  `/comparisons/${j.recruitmentId}`,
                  token,
                  undefined,
                  "DELETE",
                )
              }
            />
          </Panel>
        ))}
      </View>
      {!r.loading && !r.error && !r.data.length && (
        <BodyText>
          求人詳細から比較する求人を追加してください。最大5件まで比較できます。
        </BodyText>
      )}
    </AppPage>
  );
}

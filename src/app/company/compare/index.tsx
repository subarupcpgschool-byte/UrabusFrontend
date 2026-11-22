import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { Document } from "@/api/models";
import AppPage from "@/components/layout/AppPage";
import { AppButton, Panel, BodyText } from "@/components/ui/AppUI";
import { ConfirmAction } from "@/api/ApiUI";
export default function ComparePage() {
  "use no memo";
  useLocaleVersion();
  const { token, user } = useAuth();
  const r = useResource<
    { recruitmentId: string; document: Document; companyName: string }[]
  >(token ? "/comparisons" : null, [], true);
  return (
    <AppPage
      title={tText("compareJobs")}
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
            <BodyText localize={false}>{j.companyName}</BodyText>
            <BodyText>
              {j.document.location} ／ {j.document.employment}
            </BodyText>
            <BodyText>{j.document.compensation}</BodyText>
            <BodyText>{j.document.requirements}</BodyText>
            <AppButton
              label={tText("viewDetails")}
              onPress={() => router.push(`/jobs/${j.recruitmentId}` as never)}
            />
            <ConfirmAction
              label={tText("removeFromComparison")}
              message={tText("removeThisJobFromYourComparison")}
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
        <BodyText>{tText("addJobsFromAJobDetailsPage")}</BodyText>
      )}
    </AppPage>
  );
}

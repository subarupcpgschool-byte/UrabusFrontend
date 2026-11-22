import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import AppPage from "@/components/layout/AppPage";
import { AppButton } from "@/components/ui/AppUI";
import { useAuth } from "@/auth/AuthProvider";
import { useAccount } from "@/features/account/AccountProvider";
import ProfilePanel from "@/features/account/ProfilePanel";
import { ReceivedReviews } from "@/features/account/ReviewPanels";
import { Tabs } from "@/features/account/Tabs";
import MessageWorkspace from "@/features/workspace/MessageWorkspace";

const options = [
  { value: "profile", label: sourceText("profile") },
  { value: "messages", label: sourceText("messages") },
  { value: "received", label: sourceText("reviewsReceived") },
];
export default function MyPage() {
  "use no memo";
  useLocaleVersion();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const current = options.some((o) => o.value === tab) ? tab! : "profile";
  const { user } = useAuth();
  const { ready, error, data, mockMode, refresh } = useAccount();
  return (
    <AppPage
      title={tText("myPage")}
      subtitle={tText("manageYourProfileContractsMessagesAndReviews")}
      role="user"
      activeMenu={sourceText("myPage")}
    >
      {mockMode && (
        <View style={s.banner}>
          <Text style={s.bannerTitle}>{tText("showingSampleData")}</Text>
          <Text style={s.hint}>
            {tText("contractsAndReviewsAreFictionalSamplesProfile")}
          </Text>
        </View>
      )}
      {!user && !mockMode ? (
        <AppButton
          label={tText("logInToOpenMyPage")}
          onPress={() => router.push("/auth")}
        />
      ) : !ready || error ? (
        <View>
          <Text accessibilityRole={error ? "alert" : undefined}>
            {error || sourceText("loading")}
          </Text>
          {!!error && <AppButton label={tText("reload")} onPress={refresh} />}
        </View>
      ) : (
        <>
          <View style={s.identity}>
            <View style={s.avatar}>
              <Text localize={false} style={s.initial}>
                {
                  Array.from(
                    data?.profile.familyName || user?.displayName || "U",
                  )[0]
                }
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text localize={false} style={s.name}>
                {[data?.profile.familyName, data?.profile.givenName]
                  .filter(Boolean)
                  .join(" ") ||
                  user?.displayName ||
                  tText("profileNotConfigured")}
              </Text>
              <Text localize={false} style={s.hint}>
                {user?.email || tText("sampleProfile")}
              </Text>
            </View>
            <AppButton
              label={tText("accountSettings")}
              outline
              onPress={() => router.push("/auth")}
            />
          </View>
          <Tabs
            options={options}
            value={current}
            onChange={(value) => router.setParams({ tab: value })}
            label={tText("switchMyPageView")}
          />
          <View style={current === "profile" ? undefined : { display: "none" }}>
            <ProfilePanel />
          </View>
          {current === "messages" && <MessageWorkspace />}
          {current === "received" && <ReceivedReviews />}
        </>
      )}
    </AppPage>
  );
}
const s = StyleSheet.create({
  banner: { padding: 16, gap: 6, borderRadius: 12, backgroundColor: "#EAF2FF" },
  bannerTitle: { color: "#1748B8", fontWeight: "800" },
  hint: { color: "#64748B", fontSize: 12, lineHeight: 20 },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#E5F1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: "#2563EB", fontSize: 24, fontWeight: "800" },
  name: { fontSize: 20, fontWeight: "800", color: "#183455" },
});

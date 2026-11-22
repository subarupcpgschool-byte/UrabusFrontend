import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Alert, Pressable, Text } from "@/i18n/native";
import { companyHref } from "@/features/account/companyNavigation";
import { MockBanner } from "@/features/workspace/MockBanner";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import AppPage from "@/components/layout/AppPage";
import { AppButton } from "@/components/ui/AppUI";
import CompanySearchCard from "@/components/search/CompanySearchCard";
import JobSearchCard from "@/components/search/JobSearchCard";
import type {
  CompanySearchItem,
  JobSearchItem,
} from "@/components/search/types";
import { useAuth } from "@/auth/AuthProvider";
import {
  useWorkspace,
  type Favorite,
} from "@/features/workspace/WorkspaceProvider";
export default function FavoritesPage() {
  "use no memo";
  useLocaleVersion();
  const [tab, setTab] = useState<Favorite["kind"]>("company");
  const { user } = useAuth();
  const { favorites, ready, error, openRoom, mockMode } = useWorkspace();
  return (
    <AppPage
      title={tText("favorites")}
      subtitle={tText("keepYourFavoriteCompaniesAndJobsIn")}
    >
      {!user && !mockMode ? (
        <AppButton
          label={tText("logInToSeeFavorites")}
          onPress={() => router.push("/auth")}
        />
      ) : (
        <>
          <MockBanner />
          <View style={s.tabs}>
            {(["company", "job"] as const).map((kind) => (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === kind }}
                key={kind}
                onPress={() => setTab(kind)}
                style={[s.tab, tab === kind && s.active]}
              >
                <Text style={[s.tabText, tab === kind && { color: "#fff" }]}>
                  {kind === "company"
                    ? sourceText("company")
                    : sourceText("opportunities")}
                  （{favorites.filter((f) => f.kind === kind).length}）
                </Text>
              </Pressable>
            ))}
          </View>
          {!!error && <Text accessibilityRole="alert">{error}</Text>}
          {!ready ? (
            <Text>{tText("loading")}</Text>
          ) : favorites.filter((f) => f.kind === tab).length === 0 ? (
            <View style={s.empty}>
              <Text style={s.heading}>
                {tText("favorite")}
                {tab === "company"
                  ? sourceText("company")
                  : sourceText("opportunities")}
                {tText("haveNotBeenAddedYet")}
              </Text>
              <Text>{tText("useTheHeartOrBookmarkIconsIn")}</Text>
              <AppButton
                label={
                  tab === "company"
                    ? sourceText("findCompanies")
                    : sourceText("findJobs")
                }
                onPress={() =>
                  router.push(tab === "company" ? "/companies" : "/jobs")
                }
              />
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {favorites
                .filter((f) => f.kind === tab)
                .map((f) => (
                  <View key={f.key} style={{ gap: 8 }}>
                    {f.kind === "company" ? (
                      <View style={s.company}>
                        <CompanySearchCard
                          item={f.item as CompanySearchItem}
                          onPressDetail={() =>
                            router.push(
                              companyHref(f.item as CompanySearchItem),
                            )
                          }
                          onPressJobs={() => router.push("/jobs")}
                        />
                      </View>
                    ) : (
                      <JobSearchCard
                        item={f.item as JobSearchItem}
                        onPressDetail={(id) =>
                          router.push(`/jobs/${id}` as never)
                        }
                        onPressApply={(id) =>
                          router.push(`/jobs/${id}/apply` as never)
                        }
                      />
                    )}
                    <View style={{ alignItems: "flex-end" }}>
                      <AppButton
                        label={tText("openMessages")}
                        outline
                        onPress={() =>
                          void (async () => {
                            const company = f.item.companyName;
                            const id = await openRoom(
                              f.kind,
                              String(f.item.id),
                              company,
                              f.kind === "job"
                                ? (f.item as JobSearchItem).title
                                : company,
                            );
                            router.push({
                              pathname: "/messages",
                              params: { room: id },
                            });
                          })().catch((e) =>
                            Alert.alert(sourceText("messages"), e.message),
                          )
                        }
                      />
                    </View>
                  </View>
                ))}
            </View>
          )}
        </>
      )}
    </AppPage>
  );
}
const s = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 8, marginBottom: 8 },
  tab: {
    minWidth: 130,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#eaf2ff",
    alignItems: "center",
  },
  active: { backgroundColor: "#2563eb" },
  tabText: { fontWeight: "800", color: "#10284b" },
  company: { flexDirection: "row" },
  empty: { padding: 28, backgroundColor: "#fff", borderRadius: 14, gap: 18 },
  heading: { fontSize: 18, fontWeight: "800", color: "#10284b" },
});

import { SEARCH_COLORS as C } from "@/components/search/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { PropsWithChildren } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export type AppRole = "public" | "user" | "company" | "operator";
type Props = PropsWithChildren<{
  title: string;
  subtitle: string;
  role?: AppRole;
  activeMenu?: string;
}>;

const menus = {
  user: [
    ["grid-outline", "ダッシュボード", "/"],
    ["document-text-outline", "応募履歴", "/user/applications"],
    ["chatbubbles-outline", "メッセージ", "/chat/job/1"],
    ["person-outline", "経歴書", "/user/resume"],
  ],
  company: [
    ["grid-outline", "ダッシュボード", "/"],
    ["briefcase-outline", "求人管理", "/company/jobs"],
    ["search-outline", "人材検索", "/company/talent"],
    ["business-outline", "企業・権限", "/company/settings"],
  ],
  operator: [
    ["grid-outline", "ダッシュボード", "/"],
    ["pulse-outline", "モニター", "/operator/monitor"],
    ["notifications-outline", "アラーム", "/operator/alarms"],
  ],
} as const;

export default function AppPage({
  title,
  subtitle,
  role = "public",
  activeMenu = "",
  children,
}: Props) {
  const { width } = useWindowDimensions();
  const showSidebar = role !== "public" && width >= 1024;
  return (
    <SafeAreaView style={s.safe}>
      <Header compact={width < 760} />
      <View style={s.shell}>
        {showSidebar && (
          <Sidebar
            role={role as Exclude<AppRole, "public">}
            active={activeMenu}
          />
        )}
        <ScrollView style={s.page} contentContainerStyle={s.content}>
          <View style={s.titleRow}>
            <View>
              <Text style={s.title}>{title}</Text>
              <Text style={s.subtitle}>{subtitle}</Text>
            </View>
            {role !== "public" && (
              <View style={s.roleBadge}>
                <Text style={s.roleText}>
                  {role === "user"
                    ? "一般ユーザー"
                    : role === "company"
                      ? "企業ユーザー"
                      : "運営ユーザー"}
                </Text>
              </View>
            )}
          </View>
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Header({ compact }: { compact: boolean }) {
  return (
    <View style={s.header}>
      <View style={s.headerInner}>
        <Pressable onPress={() => router.push("/" as never)} style={s.brand}>
          <View style={s.logo}>
            <Text style={s.logoText}>GW</Text>
          </View>
          <Text style={s.brandText}>GlobalWorkers</Text>
        </Pressable>
        {!compact && (
          <View style={s.nav}>
            <Nav label="求人を探す" path="/jobs" />
            <Nav label="企業を探す" path="/companies" />
            <Nav label="評価について" />
            <Nav label="料金" />
          </View>
        )}
        <View style={s.actions}>
          <Ionicons name="notifications-outline" size={22} color={C.textSub} />
          <Ionicons name="heart-outline" size={22} color={C.textSub} />
          <View style={s.avatar}>
            <Text style={s.avatarText}>山</Text>
          </View>
          {!compact && <Text style={s.user}>山田 太郎</Text>}
        </View>
      </View>
    </View>
  );
}
function Nav({ label, path }: { label: string; path?: string }) {
  return (
    <Pressable onPress={() => path && router.push(path as never)}>
      <Text style={s.navText}>{label}</Text>
    </Pressable>
  );
}
function Sidebar({
  role,
  active,
}: {
  role: "user" | "company" | "operator";
  active: string;
}) {
  return (
    <View style={s.sidebar}>
      <Text style={s.sideTitle}>
        {role === "user"
          ? "マイページ"
          : role === "company"
            ? "企業管理"
            : "運営管理"}
      </Text>
      {menus[role].map(([icon, label, path]) => (
        <Pressable
          key={label}
          onPress={() => router.push(path as never)}
          style={[s.sideItem, active === label && s.sideActive]}
        >
          <Ionicons
            name={icon}
            size={19}
            color={active === label ? C.primary : C.textSub}
          />
          <Text style={[s.sideText, active === label && { color: C.primary }]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerInner: {
    width: "100%",
    maxWidth: 1400,
    minHeight: 68,
    alignSelf: "center",
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  logo: {
    width: 37,
    height: 37,
    borderRadius: 9,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { color: C.white, fontSize: 12, fontWeight: "900" },
  brandText: { color: C.text, fontSize: 18, fontWeight: "800" },
  nav: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 30 },
  navText: { color: C.text, fontSize: 13, fontWeight: "700" },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: C.primaryDark, fontWeight: "900" },
  user: { color: C.text, fontSize: 12, fontWeight: "700" },
  shell: { flex: 1, flexDirection: "row", backgroundColor: C.background },
  sidebar: {
    width: 220,
    backgroundColor: C.white,
    borderRightWidth: 1,
    borderRightColor: C.border,
    padding: 14,
    gap: 5,
  },
  sideTitle: { color: C.navy, fontSize: 16, fontWeight: "900", padding: 10 },
  sideItem: {
    minHeight: 44,
    borderRadius: 8,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sideActive: { backgroundColor: C.primarySoft },
  sideText: { color: C.textSub, fontSize: 12, fontWeight: "700" },
  page: { flex: 1 },
  content: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
    padding: 22,
    paddingBottom: 60,
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 4,
  },
  title: { color: C.text, fontSize: 27, fontWeight: "900" },
  subtitle: { marginTop: 4, color: C.textSub, fontSize: 12.5 },
  roleBadge: {
    borderRadius: 99,
    backgroundColor: C.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  roleText: { color: C.success, fontSize: 10, fontWeight: "900" },
});

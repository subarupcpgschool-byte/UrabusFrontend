import { translateText } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";

import { Header } from "@/components/common/Header";
import { SEARCH_COLORS as C } from "@/components/search/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useState, type PropsWithChildren } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

export type AppRole = "public" | "user" | "company" | "operator";
type Props = PropsWithChildren<{
  title: string;
  subtitle: string;
  role?: AppRole;
  activeMenu?: string;
  onNavigate?: (path: Href) => void;
}>;

const menus = {
  user: [
    ["person-circle-outline", sourceText("myPage"), "/mypage"],
    ["grid-outline", sourceText("dashboard"), "/"],
    [
      "document-text-outline",
      sourceText("applicationsAndOffers_641"),
      "/user/applications",
    ],
    ["star-outline", sourceText("reviews"), "/user/evaluations"],
    ["chatbubbles-outline", sourceText("messages"), "/messages"],
    ["person-outline", sourceText("resume"), "/user/resume"],
    [
      "folder-open-outline",
      sourceText("hrPersonalDocuments"),
      "/user/documents",
    ],
  ],
  company: [
    ["grid-outline", sourceText("dashboard"), "/company"],
    [
      "people-outline",
      sourceText("applicationsAndSelection"),
      "/company/applications",
    ],
    ["star-outline", sourceText("reviews"), "/company/evaluations"],
    ["person-add-outline", sourceText("hrEmployment"), "/company/employment"],
    ["mail-outline", sourceText("hrMailTemplates"), "/company/mail-templates"],
    ["briefcase-outline", sourceText("jobManagement"), "/company/jobs"],
    ["search-outline", sourceText("talentSearch"), "/company/talent"],
    [
      "business-outline",
      sourceText("companyAndPermissions"),
      "/company/settings",
    ],
    [
      "people-circle-outline",
      sourceText("employeeManagement"),
      "/company/employees",
    ],
  ],
  operator: [
    ["grid-outline", sourceText("dashboard"), "/"],
    ["pulse-outline", sourceText("monitoring"), "/operator/monitor"],
    ["notifications-outline", sourceText("alerts"), "/operator/alarms"],
  ],
} as const;

export default function AppPage({
  title,
  subtitle,
  role = "public",
  activeMenu = "",
  children,
  onNavigate = (path) => router.push(path),
}: Props) {
  "use no memo";
  useLocaleVersion();
  const { width } = useWindowDimensions();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const showSidebar = role !== "public" && width >= 1024;
  return (
    <SafeAreaView style={s.safe}>
      <Header onNavigate={onNavigate} />
      <View
        style={[
          s.shell,
          role === "company" &&
            activeMenu === sourceText("dashboard") && {
              backgroundColor: C.background,
            },
        ]}
      >
        {showSidebar && (
          <Sidebar
            role={role as Exclude<AppRole, "public">}
            active={activeMenu}
            collapsed={collapsed}
            onNavigate={onNavigate}
            onToggle={() => setCollapsed((v) => !v)}
          />
        )}
        <ScrollView
          style={s.page}
          contentContainerStyle={[
            s.content,
            (activeMenu === sourceText("applicationsAndOffers_641") ||
              activeMenu === sourceText("reviews")) && { maxWidth: 1760 },
            role === "company" &&
              activeMenu === sourceText("dashboard") && {
                maxWidth: 1600,
                padding: 14,
                paddingBottom: 14,
              },
            width < 600 && { padding: 12 },
          ]}
        >
          {role !== "public" && !showSidebar && (
            <View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={tText("myPageMenu")}
                accessibilityState={{ expanded: mobileMenu }}
                onPress={() => setMobileMenu((v) => !v)}
                style={s.sideItem}
              >
                <Ionicons name="menu-outline" size={22} color={C.primary} />
                <Text style={s.sideText}>{tText("menu")}</Text>
              </Pressable>
              {mobileMenu &&
                menus[role].map(([icon, label, path]) => (
                  <Pressable
                    key={label}
                    accessibilityRole="button"
                    onPress={() => {
                      setMobileMenu(false);
                      onNavigate(path);
                    }}
                    style={[s.sideItem, activeMenu === label && s.sideActive]}
                  >
                    <Ionicons name={icon} size={19} color={C.primary} />
                    <Text style={s.sideText}>{label}</Text>
                  </Pressable>
                ))}
            </View>
          )}

          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Sidebar({
  role,
  active,
  collapsed,
  onToggle,
  onNavigate,
}: {
  role: "user" | "company" | "operator";
  active: string;
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: (path: Href) => void;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <View style={[s.sidebar, collapsed && { width: 68, padding: 8 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={translateText(
          collapsed ? sourceText("expandMenu") : sourceText("collapseMenu"),
        )}
        accessibilityState={{ expanded: !collapsed }}
        onPress={onToggle}
        style={s.sideItem}
      >
        <Ionicons
          name={collapsed ? "chevron-forward-outline" : "chevron-back-outline"}
          size={20}
          color={C.primary}
        />
        {!collapsed && <Text style={s.sideText}>{tText("collapse")}</Text>}
      </Pressable>
      {!collapsed && (
        <Text style={s.sideTitle}>
          {role === "user"
            ? sourceText("myPage")
            : role === "company"
              ? sourceText("companyManagement")
              : sourceText("operatorConsole")}
        </Text>
      )}
      {menus[role].map(([icon, label, path]) => (
        <Pressable
          key={label}
          accessibilityRole="button"
          accessibilityLabel={translateText(label)}
          accessibilityState={{ selected: active === label }}
          onPress={() => onNavigate(path)}
          style={[s.sideItem, active === label && s.sideActive]}
        >
          <Ionicons
            name={icon}
            size={19}
            color={active === label ? C.primary : C.textSub}
          />
          {!collapsed && (
            <Text
              style={[
                s.sideText,
                active === label && {
                  color: C.primary,
                },
              ]}
            >
              {label}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
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

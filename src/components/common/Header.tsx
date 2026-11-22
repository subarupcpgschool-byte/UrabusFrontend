import { translateText } from "@/i18n/display";
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";
import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { useAuth } from "@/auth/AuthProvider";
import { C } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname, type Href } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Logo } from "./Logo";
import { useWorkspace } from "@/features/workspace/WorkspaceProvider";
const WORKSPACE_MOCK_ENABLED = false;

type Panel = "通知" | "お気に入り" | "メッセージ";
type Item = { label: string; path?: Href; panel?: Panel };
const companyPreview: Item[] = WORKSPACE_MOCK_ENABLED
  ? [{ label: sourceText("companyManagement"), path: "/company" }]
  : [];
const publicItems: Item[] = [
  { label: sourceText("findJobs"), path: "/jobs" },
  { label: sourceText("findCompanies"), path: "/companies" },
  { label: sourceText("aboutReviews"), path: "/reviews" },
  { label: sourceText("pricing_579"), path: "/price" },
  { label: sourceText("userGuide"), path: "/guide" },
  ...(WORKSPACE_MOCK_ENABLED
    ? [{ label: sourceText("myPage"), path: "/mypage" as Href }]
    : []),
];
const memberItems: Item[] = [
  { label: sourceText("findJobs"), path: "/jobs" },
  { label: sourceText("findCompanies"), path: "/companies" },
  { label: sourceText("favorites"), path: "/favorites" },
  { label: sourceText("messages"), path: "/messages" },
];

/** All public/search/management screens share authentication and navigation here. */
export function Header({
  desktop,
  onNavigate = (path) => router.push(path),
}: {
  desktop?: boolean;
  onNavigate?: (path: Href) => void;
}) {
  "use no memo";
  useLocaleVersion();
  const { user, ready } = useAuth();
  const workspace = useWorkspace();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const displayWidth = width;
  const wide = displayWidth >= 1200 && desktop !== false;
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  useEffect(() => {
    setOpen(false);
    setPanel(null);
  }, [pathname, user?.id]);
  const items = [
    ...(user ? memberItems : publicItems),
    ...(user?.accountType === "COMPANY" || user?.accountType === "EMPLOYEE"
      ? [{ label: sourceText("companyManagement"), path: "/company" as Href }]
      : companyPreview),
  ];
  const navigate = (path: Href) => {
    setOpen(false);
    setPanel(null);
    onNavigate(path);
  };
  const select = (item: Item) => {
    setOpen(false);
    if (item.path) navigate(item.path);
    else if (item.panel) setPanel(item.panel);
  };
  const icon = (name: keyof typeof Ionicons.glyphMap, label: Panel) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={translateText(label)}
      onPress={() => {
        setOpen(false);
        if (label === sourceText("favorites")) navigate("/favorites");
        else if (label === sourceText("messages")) navigate("/messages");
        else setPanel(label);
      }}
      style={({
        hovered,
        pressed,
      }: {
        pressed: boolean;
        hovered?: boolean;
      }) => [s.icon, (hovered || pressed) && s.soft]}
    >
      <Ionicons name={name} size={23} color={C.navy} />
    </Pressable>
  );
  const links = (mobile: boolean) =>
    items.map((item) => {
      const active =
        !!item.path &&
        (pathname === item.path || pathname.startsWith(`${item.path}/`));
      return (
        <Pressable
          key={item.label}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
          onPress={() => select(item)}
          style={({
            hovered,
            pressed,
          }: {
            pressed: boolean;
            hovered?: boolean;
          }) => [
            mobile ? s.mobileItem : s.navItem,
            active && s.active,
            (hovered || pressed) && s.soft,
          ]}
        >
          <Text style={[s.navText, active && { color: C.blue }]}>
            {item.label}
          </Text>
          {mobile && (
            <Ionicons name="chevron-forward" size={17} color={C.muted} />
          )}
        </Pressable>
      );
    });
  return (
    <View style={s.header}>
      <View style={[s.inner, displayWidth < 480 && { paddingHorizontal: 12 }]}>
        <Logo
          onHome={() => navigate("/")}
          width={displayWidth < 360 ? 110 : displayWidth < 480 ? 135 : 200}
        />
        {wide && <View style={s.nav}>{links(false)}</View>}
        <View style={s.actions}>
          <LanguageSwitcher compact={displayWidth < 600} />
          {!ready ? (
            <View
              accessibilityLabel={tText("checkingLoginStatus")}
              style={s.loading}
            >
              <ActivityIndicator color={C.blue} />
            </View>
          ) : user ? (
            <>
              {icon("notifications-outline", sourceText("notifications"))}
              {wide && icon("heart-outline", sourceText("favorites"))}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={translateText(
                  sourceFormat("sAccount", { v0: user.displayName }, ["v0"]),
                )}
                onPress={() => navigate("/mypage")}
                style={({
                  hovered,
                  pressed,
                }: {
                  pressed: boolean;
                  hovered?: boolean;
                }) => [s.account, (hovered || pressed) && s.soft]}
              >
                <View style={s.avatar}>
                  <Text localize={false} style={s.initial}>
                    {Array.from(user.displayName.trim())[0] || "U"}
                  </Text>
                </View>
                {(wide || displayWidth >= 600) && (
                  <Text localize={false} numberOfLines={1} style={s.name}>
                    {user.displayName}
                  </Text>
                )}
              </Pressable>
            </>
          ) : wide ? (
            <>
              <Pressable
                accessibilityRole="button"
                onPress={() => navigate("/auth")}
                style={s.iconText}
              >
                <Text style={s.login}>{tText("logIn")}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  navigate({ pathname: "/auth", params: { mode: "register" } })
                }
                style={({
                  hovered,
                  pressed,
                }: {
                  pressed: boolean;
                  hovered?: boolean;
                }) => [s.register, (hovered || pressed) && { opacity: 0.8 }]}
              >
                <Text style={s.registerText}>{tText("signUp_582")}</Text>
              </Pressable>
            </>
          ) : null}
          {!wide && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={translateText(
                open ? sourceText("closeMenu") : sourceText("openMenu"),
              )}
              accessibilityState={{ expanded: open }}
              onPress={() => setOpen((v) => !v)}
              style={s.icon}
            >
              <Ionicons
                name={open ? "close" : "menu"}
                size={28}
                color={C.navy}
              />
            </Pressable>
          )}
        </View>
      </View>
      {!wide && ready && !user && (
        <View style={s.mobileAuth}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigate("/auth")}
            style={s.iconText}
          >
            <Text style={s.login}>{tText("logIn")}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigate({ pathname: "/auth", params: { mode: "register" } })
            }
            style={s.register}
          >
            <Text style={s.registerText}>{tText("signUp_582")}</Text>
          </Pressable>
        </View>
      )}
      {!wide && open && (
        <View style={s.mobileMenu}>
          {links(true)}
          {user && (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigate("/mypage")}
              style={s.mobileItem}
            >
              <Text localize={false} style={s.navText} numberOfLines={1}>
                {user.displayName} {tText("myPage_585")}
              </Text>
            </Pressable>
          )}
        </View>
      )}
      <Modal
        visible={panel !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPanel(null)}
      >
        <View style={s.overlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tText("close")}
            style={StyleSheet.absoluteFill}
            onPress={() => setPanel(null)}
          />
          <View accessibilityViewIsModal style={s.dialog}>
            <View style={s.dialogHeading}>
              <Text accessibilityRole="header" style={s.dialogTitle}>
                {panel}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={tText("close")}
                onPress={() => setPanel(null)}
                style={s.icon}
              >
                <Ionicons name="close" size={24} color={C.navy} />
              </Pressable>
            </View>
            {workspace.rooms
              .filter((r) => r.unread > 0)
              .map((r) => (
                <Pressable
                  key={r.id}
                  accessibilityRole="button"
                  onPress={() =>
                    navigate({ pathname: "/messages", params: { room: r.id } })
                  }
                >
                  <Text localize={false} style={s.description}>
                    {r.company} ／ {r.title}
                    {tText("unread")}
                    {r.unread}
                    {tText("total")}
                  </Text>
                </Pressable>
              ))}
            {workspace.error ? (
              <Text style={s.description}>{workspace.error}</Text>
            ) : (
              !workspace.rooms.some((r) => r.unread > 0) && (
                <Text style={s.description}>
                  {tText("thereAreNoUnreadMessages")}
                </Text>
              )
            )}
            <Pressable
              accessibilityRole="button"
              onPress={() => setPanel(null)}
              style={s.register}
            >
              <Text style={s.registerText}>{tText("close")}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    zIndex: 5,
  },
  inner: {
    width: "100%",
    maxWidth: 1320,
    minHeight: 72,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nav: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "stretch",
    gap: 10,
  },
  navItem: {
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  active: { borderBottomColor: C.blue },
  navText: { color: C.text, fontSize: 14, fontWeight: "700" },
  actions: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  icon: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  soft: { backgroundColor: "#EFF6FF" },
  iconText: { minHeight: 44, paddingHorizontal: 12, justifyContent: "center" },
  login: { color: C.blue, fontWeight: "800", fontSize: 14 },
  register: {
    backgroundColor: C.blue,
    minHeight: 42,
    paddingHorizontal: 20,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  registerText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  account: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 5,
    borderRadius: 9,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5F1FF",
    justifyContent: "center",
    alignItems: "center",
  },
  initial: { color: C.blue, fontSize: 16, fontWeight: "800" },
  name: { maxWidth: 120, color: C.text, fontSize: 14, fontWeight: "700" },
  mobileAuth: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  loading: { width: 64, alignItems: "center" },
  mobileMenu: { borderTopWidth: 1, borderColor: C.border, padding: 14, gap: 4 },
  mobileItem: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(8,27,80,.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    gap: 20,
  },
  dialogHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dialogTitle: { color: C.navy, fontWeight: "800", fontSize: 21 },
  description: { color: C.text, lineHeight: 24 },
});

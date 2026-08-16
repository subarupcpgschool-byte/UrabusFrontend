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
import { SEARCH_COLORS as C } from "./theme";

type Props = PropsWithChildren<{
  title: string;
  subtitle: string;
  activeNav: "jobs" | "companies";
}>;

export default function SearchPageShell({
  title,
  subtitle,
  activeNav,
  children,
}: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  return (
    <SafeAreaView style={s.safe}>
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
              <Nav
                label="求人を探す"
                active={activeNav === "jobs"}
                onPress={() => router.push("/jobs" as never)}
              />
              <Nav
                label="企業を探す"
                active={activeNav === "companies"}
                onPress={() => router.push("/companies" as never)}
              />
              <Nav label="評価について" />
              <Nav label="料金" />
              <Nav label="ご利用ガイド" />
            </View>
          )}
          <View style={s.headerActions}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={C.textSub}
            />
            <Ionicons name="heart-outline" size={22} color={C.textSub} />
            <View style={s.avatar}>
              <Text style={s.avatarText}>山</Text>
            </View>
            {!compact && <Text style={s.userName}>山田 太郎</Text>}
          </View>
        </View>
      </View>
      <ScrollView
        style={s.page}
        contentContainerStyle={s.pageContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.titleArea}>
          <Text style={s.title}>{title}</Text>
          <Text style={s.subtitle}>{subtitle}</Text>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

function Nav({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.navItem, active && s.navActive]}>
      <Text style={[s.navText, active && s.navTextActive]}>{label}</Text>
    </Pressable>
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
    maxWidth: 1450,
    minHeight: 70,
    alignSelf: "center",
    paddingHorizontal: 24,
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
  nav: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
  },
  navItem: {
    height: "100%",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    paddingHorizontal: 5,
  },
  navActive: { borderBottomColor: C.primary },
  navText: { color: C.text, fontSize: 13, fontWeight: "700" },
  navTextActive: { color: C.primary },
  headerActions: {
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
  userName: { color: C.text, fontSize: 12, fontWeight: "700" },
  page: { flex: 1, backgroundColor: C.background },
  pageContent: {
    width: "100%",
    maxWidth: 1450,
    alignSelf: "center",
    padding: 24,
    paddingBottom: 60,
  },
  titleArea: { marginBottom: 20 },
  title: { color: C.navy, fontSize: 28, fontWeight: "900" },
  subtitle: { marginTop: 5, color: C.textSub, fontSize: 13 },
});

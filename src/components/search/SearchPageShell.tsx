import { useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";

import { Header } from "@/components/common/Header";
import type { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
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
  "use no memo";
  useLocaleVersion();
  return (
    <SafeAreaView style={s.safe}>
      <Header />
      <ScrollView
        style={s.page}
        contentContainerStyle={s.pageContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
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

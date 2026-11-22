import { useLocaleVersion } from "@/i18n/display";
import { COLORS } from "@/theme/colors";
import { PropsWithChildren } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export function Screen({ children }: PropsWithChildren) {
  "use no memo";
  useLocaleVersion();
  return <SafeAreaView style={styles.safe}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

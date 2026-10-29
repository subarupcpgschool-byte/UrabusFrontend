import { COLORS } from "@/theme/colors";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

export function Logo({
  backgroundColor = "transparent",
  width = 200,
}: {
  backgroundColor?: string;
  width?: number;
}) {
  return (
    <View style={s.logo}>
      <Pressable key="logo" accessibilityRole="button" accessibilityLabel="GlobalWorkers ホーム" onPress={() => router.push("/")} style={[s.logoMark, { width }]}>
        <Image
          source={require("@/assets/images/logo.svg")}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 0,
            backgroundColor: backgroundColor,
          }}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  logo: { flexDirection: "row", alignItems: "center", gap: 10, height: 58 },
  logoMark: {
    width: 200,
    height: 58,
    borderRadius: 11,
    borderColor: "transparent",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoLetters: { color: COLORS.white, fontWeight: "900", fontSize: 14 },
  logoName: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 19,
    letterSpacing: -0.4,
  },
});

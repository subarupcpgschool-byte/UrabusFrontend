import { COLORS } from "@/theme/colors";
import { notify } from "@/utils/pathUtils";
import { Image, Pressable, StyleSheet, View } from "react-native";

export function Logo({
  backgroundColor = "transparent",
}: {
  backgroundColor?: string;
}) {
  return (
    <View style={s.logo}>
      <Pressable key="logo" onPress={() => notify("top")} style={s.logoMark}>
        <Image
          source={require("@/assets/images/logo.svg")}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: 0,
            backgroundColor: backgroundColor,
          }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  logo: { flexDirection: "row", alignItems: "center", gap: 10, height: "100%" },
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

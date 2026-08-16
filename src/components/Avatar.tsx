import { COLORS } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  size?: number;
};

export function Avatar({ name, size = 52 }: Props) {
  const chars = name.replace(/\s/g, "").slice(0, 2);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.text, { fontSize: Math.max(12, size * 0.28) }]}>
        {chars}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.primarySoftStrong,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: COLORS.primaryDark,
    fontWeight: "900",
  },
});

import { COLORS } from "@/theme/colors";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        selected ? styles.selected : styles.normal,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 40,
    minWidth: 72,
    borderRadius: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  normal: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  selected: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  text: { color: COLORS.text, fontSize: 12, fontWeight: "800" },
  selectedText: { color: COLORS.white },
  pressed: { opacity: 0.7 },
});

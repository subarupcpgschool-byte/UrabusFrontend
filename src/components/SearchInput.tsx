import { INPUT_THEME } from "@/theme/inputTheme";
import { AppInput } from "@/components/form";
import { COLORS } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export function SearchInput({ value, onChangeText, placeholder }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search-outline" size={22} color={COLORS.textMuted} />
      <AppInput variant="plain"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 27,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: INPUT_THEME.borderColor,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {outlineWidth: 0,flex: 1},
});

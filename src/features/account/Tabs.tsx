import { translateText } from "@/i18n/display";
import { useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SEARCH_COLORS as C } from "@/components/search/theme";

export function Tabs({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
      style={{ flexGrow: 0 }}
    >
      <View
        accessibilityRole="tablist"
        accessibilityLabel={translateText(label)}
        style={s.row}
      >
        {options.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={translateText(option.label)}
            accessibilityState={{ selected: value === option.value }}
            onPress={() => onChange(option.value)}
            style={[s.tab, value === option.value && s.active]}
          >
            <Text style={[s.label, value === option.value && s.selected]}>
              {option.label}
              {option.count !== undefined
                ? `（${translateText(option.count)}）`
                : ""}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  tab: {
    minHeight: 46,
    paddingHorizontal: 18,
    justifyContent: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
  },
  active: { backgroundColor: C.primary, borderColor: C.primary },
  label: { color: C.textSub, fontSize: 13, fontWeight: "700" },
  selected: { color: "#FFF" },
});

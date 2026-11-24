import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "@/i18n/native";
export function DashboardButton({
  label,
  onPress,
  active = false,
  disabled = false,
  icon,
  iconOnly = false,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconOnly?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: active }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        active && s.active,
        disabled && { opacity: 0.45 },
        pressed && { opacity: 0.7 },
      ]}
    >
      {icon && (
        <Ionicons name={icon} size={17} color={active ? "white" : "#52647C"} />
      )}{" "}
      {!iconOnly && (
        <Text style={[s.label, active && { color: "white" }]}>{label}</Text>
      )}
    </Pressable>
  );
}
export function DashboardMetric({
  label,
  value,
  icon,
  style,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[s.metric, style]}>
      <Ionicons name={icon} size={24} color="#657997" />
      <View style={{ gap: 6 }}>
        <Text style={s.metricLabel}>{label}</Text>
        <Text style={s.value}>{value}</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  button: {
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#CDD8E8",
    backgroundColor: "white",
    borderRadius: 12,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  active: { backgroundColor: "#0866FF", borderColor: "#0866FF" },
  label: { fontSize: 12, fontWeight: "600", color: "#334A69" },
  metric: {
    flex: 1,
    minWidth: 135,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    padding: 13,
    backgroundColor: "white",
    borderWidth: 0,
    borderColor: "#CDD8E8",
    borderRadius: 22,
    shadowColor: "#30517A",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  metricLabel: { fontSize: 14, fontWeight: "600", color: "#233550" },
  value: { fontSize: 24, fontWeight: "800", color: "#132840" },
});

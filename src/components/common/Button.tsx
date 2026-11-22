import { useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { C } from "@/theme/colors";
import { notify } from "@/utils/pathUtils";
import { StyleSheet } from "react-native";

export function Button({
  label,
  outline = false,
  onPress,
}: {
  label: string;
  outline?: boolean;
  onPress?: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <Pressable
      onPress={onPress ?? (() => notify(label))}
      style={({ pressed }) => [
        s.button,
        outline && s.buttonOutline,
        pressed && s.pressed,
      ]}
    >
      <Text style={[s.buttonText, outline && s.buttonTextOutline]}>
        {label}
      </Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  button: {
    minHeight: 44,
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.blue,
    borderWidth: 1,
    borderColor: C.blue,
  },
  buttonOutline: { backgroundColor: C.white },
  buttonText: { color: C.white, fontSize: 14, fontWeight: "800" },
  buttonTextOutline: { color: C.blue },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
});

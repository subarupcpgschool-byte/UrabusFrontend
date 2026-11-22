import { sourceText } from "./source";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "./native";
import { tText, useLocaleVersion } from "./display";
import { setLanguage } from "./LanguageProvider";
import type { AppLanguage } from "./index";
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  "use no memo";
  const current = useLocaleVersion();
  return (
    <View
      style={styles.group}
      accessibilityRole="radiogroup"
      accessibilityLabel={tText("language")}
    >
      {(
        [
          ["ja", sourceText("japanese")],
          ["en", "English"],
        ] as const
      ).map(([language, label]) => (
        <Pressable
          key={language}
          accessibilityRole="radio"
          accessibilityLabel={label}
          accessibilityState={{ checked: current === language }}
          onPress={() => {
            void setLanguage(language as AppLanguage);
          }}
          style={[styles.button, current === language && styles.active]}
        >
          <Text
            localize={false}
            style={[styles.text, current === language && styles.selected]}
          >
            {compact ? language.toUpperCase() : label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D9E3EE",
    borderRadius: 8,
    padding: 2,
    flexShrink: 0,
  },
  button: {
    minHeight: 36,
    paddingHorizontal: 7,
    justifyContent: "center",
    borderRadius: 5,
  },
  active: { backgroundColor: "#E8F2FC" },
  text: { fontSize: 11, color: "#52677D" },
  selected: { color: "#1466A9", fontWeight: "700" },
});

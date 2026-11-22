import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, translateText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text, TextInput } from "@/i18n/native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { INPUT_THEME as T } from "@/theme/inputTheme";
import { AppFormField, type FieldProps } from "./AppFormField";
import { AppInput } from "./AppInput";
import type { ChoiceOption } from "./AppChoice";

export type AppSearchableDropdownProps = FieldProps & {
  options: ChoiceOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  allowCreate?: boolean;
  onCreate?: (value: string) => Promise<void>;
  maxOptionLength?: number;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function AppSearchableDropdown({
  options,
  value,
  onValueChange,
  allowCreate = false,
  maxOptionLength = 120,
  onCreate,
  multiple = false,
  placeholder = sourceText("typeToSearch"),
  disabled = false,
  accessibilityLabel,
  ...field
}: AppSearchableDropdownProps) {
  "use no memo";
  useLocaleVersion();
  const [active, setActive] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [query, setQuery] = useState("");
  const [created, setCreated] = useState<string[]>([]);
  const input = useRef<TextInput>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function keepOpen() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setActive(true);
  }
  function closeAfterBlur() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    blurTimer.current = setTimeout(() => setActive(false), 200);
  }
  useEffect(
    () => () => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (disabled) {
      setActive(false);
      setQuery("");
    }
  }, [disabled]);

  const normalize = (text: string) =>
    text.normalize("NFKC").toLocaleLowerCase().trim();
  const allOptions: ChoiceOption[] = [
    ...options,
    ...[...new Set([...created, ...value])]
      .filter((v) => !options.some((o) => o.value === v))
      .map((v) => ({ label: v, value: v })),
  ];
  const candidate = query.trim().replace(/\s+/g, " ");
  const searching = active && !disabled && candidate.length > 0;
  const filtered = allOptions.filter(
    (o) =>
      normalize(o.label).includes(normalize(candidate)) ||
      normalize(translateText(o.label)).includes(normalize(candidate)),
  );
  const canCreate =
    allowCreate &&
    candidate.length > 0 &&
    candidate.length <= maxOptionLength &&
    !allOptions.some(
      (o) =>
        normalize(o.label) === normalize(candidate) ||
        normalize(o.value) === normalize(candidate),
    );
  const name = accessibilityLabel ?? field.label ?? sourceText("options");

  function select(option: ChoiceOption) {
    if (disabled || option.disabled) return;
    onValueChange(
      multiple
        ? value.includes(option.value)
          ? value.filter((v) => v !== option.value)
          : [...value, option.value]
        : [option.value],
    );
    setQuery("");
    input.current?.focus();
  }

  async function addOption() {
    if (disabled || !canCreate || creating) return;
    const saved = candidate;
    setCreating(true);
    setCreateError("");
    try {
      await onCreate?.(saved);
      setCreated((previous) => [...new Set([...previous, saved])]);
      select({ value: saved, label: saved });
    } catch (e) {
      setCreateError(
        e instanceof Error ? e.message : sourceText("unableToAddTheItem"),
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppFormField {...field}>
      {!!createError && (
        <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
          {createError}
        </Text>
      )}
      {!!value.length && (
        <View style={s.tags}>
          {value.map((v) => (
            <View key={v} style={s.tag}>
              <Text style={s.text}>
                {allOptions.find((o) => o.value === v)?.label ?? v}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={translateText(
                  sourceFormat("removeFrom", { v0: name, v1: v }, []),
                )}
                disabled={disabled}
                onPress={() =>
                  onValueChange(value.filter((item) => item !== v))
                }
                style={s.remove}
              >
                <Ionicons name="close" size={20} color={T.textColor} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      <AppInput
        ref={input}
        accessibilityLabel={translateText(name)}
        placeholder={translateText(placeholder)}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          keepOpen();
        }}
        onFocus={keepOpen}
        onBlur={closeAfterBlur}
        disabled={disabled}
        maxLength={maxOptionLength}
        autoCapitalize="none"
        autoCorrect={false}
        onKeyPress={(event) => {
          if (event.nativeEvent.key === "Escape") setActive(false);
        }}
      />
      {searching && (
        <View style={s.dropdown}>
          <ScrollView
            style={s.list}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {filtered.map((option) => (
              <Pressable
                key={option.value}
                accessibilityRole={multiple ? "checkbox" : "radio"}
                accessibilityLabel={translateText(option.label)}
                aria-checked={value.includes(option.value)}
                accessibilityState={{
                  checked: value.includes(option.value),
                  disabled: !!option.disabled,
                }}
                disabled={option.disabled}
                onFocus={keepOpen}
                onBlur={closeAfterBlur}
                onPress={() => select(option)}
                style={[
                  s.option,
                  value.includes(option.value) && s.selected,
                  option.disabled && s.disabled,
                ]}
              >
                <Text style={s.text}>{option.label}</Text>
                {value.includes(option.value) && (
                  <Ionicons name="checkmark" size={22} color={T.primaryColor} />
                )}
              </Pressable>
            ))}
            {canCreate && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={translateText(
                  sourceFormat("addAsANewOption", { v0: candidate }, ["v0"]),
                )}
                onFocus={keepOpen}
                onBlur={closeAfterBlur}
                disabled={creating}
                onPress={() => void addOption()}
                style={s.option}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color={T.primaryColor}
                />
                <Text style={s.text}>
                  「{candidate}
                  {tText("asANewOption")}
                </Text>
              </Pressable>
            )}
            {!filtered.length && !canCreate && (
              <Text style={[s.text, s.empty]}>
                {tText("noMatchingOptions")}
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </AppFormField>
  );
}

const s = StyleSheet.create({
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: T.selectedBackground,
    maxWidth: "100%",
  },
  remove: {
    minWidth: 36,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: T.borderColor,
    borderRadius: T.borderRadius,
    backgroundColor: T.backgroundColor,
    overflow: "hidden",
  },
  list: { maxHeight: 220 },
  option: {
    minHeight: 44,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  text: { color: T.textColor, fontSize: T.fontSize, flexShrink: 1 },
  selected: { backgroundColor: T.selectedBackground },
  disabled: { opacity: T.disabledOpacity },
  empty: { padding: 12 },
});

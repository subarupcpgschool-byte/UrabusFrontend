import { translateText } from "@/i18n/display";
import { sourceFormat } from "@/i18n/source";
import { useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { INPUT_THEME as T } from "@/theme/inputTheme";
import { AppFormField, type FieldProps } from "./AppFormField";

export type ChoiceOption = { label: string; value: string; disabled?: boolean };
export type CheckProps = {
  label: string;
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  disabled?: boolean;
};

function Choice({
  label,
  checked,
  onValueChange,
  disabled,
  radio = false,
}: CheckProps & { radio?: boolean }) {
  "use no memo";
  useLocaleVersion();
  return (
    <Pressable
      accessibilityRole={radio ? "radio" : "checkbox"}
      accessibilityLabel={translateText(label)}
      accessibilityState={{ checked, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!checked)}
      style={({ pressed }) => [
        s.row,
        disabled && s.disabled,
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[s.box, radio && s.circle, checked && s.checked]}>
        {checked &&
          (radio ? <View style={s.dot} /> : <Text style={s.tick}>✓</Text>)}
      </View>
      <Text style={s.label}>{label}</Text>
    </Pressable>
  );
}
export function AppCheckbox(props: CheckProps) {
  "use no memo";
  useLocaleVersion();
  return <Choice {...props} />;
}

export function AppTag({
  label,
  selected = false,
  onPress,
  onRemove,
  disabled = false,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  "use no memo";
  useLocaleVersion();
  const content = (
    <Text style={[s.tagText, selected && s.selectedText]}>{label}</Text>
  );
  return (
    <View
      style={[s.tag, selected && s.selected, disabled && s.disabled, style]}
    >
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={translateText(label)}
          accessibilityState={{ selected, disabled }}
          disabled={disabled}
          onPress={onPress}
          style={s.tagAction}
        >
          {content}
        </Pressable>
      ) : (
        <View style={s.tagAction}>{content}</View>
      )}
      {!!onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={translateText(
            sourceFormat("delete_591", { v0: label }, []),
          )}
          disabled={disabled}
          onPress={onRemove}
          style={s.remove}
        >
          <Text style={[s.tagText, selected && s.selectedText]}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

type GroupProps = FieldProps & { options: ChoiceOption[]; disabled?: boolean };
export function AppMultiSelect({
  options,
  value,
  onValueChange,
  disabled,
  ...field
}: GroupProps & { value: string[]; onValueChange: (value: string[]) => void }) {
  "use no memo";
  useLocaleVersion();
  return (
    <AppFormField {...field}>
      <View style={s.group}>
        {options.map((o) => (
          <AppCheckbox
            key={o.value}
            label={o.label}
            checked={value.includes(o.value)}
            disabled={disabled || o.disabled}
            onValueChange={(checked) =>
              onValueChange(
                checked
                  ? [...new Set([...value, o.value])]
                  : value.filter((v) => v !== o.value),
              )
            }
          />
        ))}
      </View>
    </AppFormField>
  );
}
export function AppRadioGroup({
  options,
  value,
  onValueChange,
  disabled,
  ...field
}: GroupProps & { value: string; onValueChange: (value: string) => void }) {
  "use no memo";
  useLocaleVersion();
  return (
    <AppFormField {...field}>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={translateText(field.label)}
        style={s.group}
      >
        {options.map((o) => (
          <Choice
            radio
            key={o.value}
            label={o.label}
            checked={value === o.value}
            disabled={disabled || o.disabled}
            onValueChange={() => onValueChange(o.value)}
          />
        ))}
      </View>
    </AppFormField>
  );
}
const s = StyleSheet.create({
  row: { minHeight: 36, flexDirection: "row", alignItems: "center", gap: 8 },
  group: { gap: 4 },
  box: {
    width: 19,
    height: 19,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: T.borderColor,
    backgroundColor: T.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: { borderRadius: 99 },
  checked: { borderColor: T.primaryColor, backgroundColor: T.primaryColor },
  tick: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  dot: { width: 7, height: 7, borderRadius: 5, backgroundColor: "#FFF" },
  label: { color: T.textColor, fontSize: T.fontSize, flexShrink: 1 },
  disabled: { opacity: T.disabledOpacity },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: T.borderColor,
    borderRadius: 20,
    backgroundColor: T.selectedBackground,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  tagAction: { paddingHorizontal: 12, paddingVertical: 8 },
  remove: { padding: 8, paddingLeft: 4 },
  tagText: { color: T.textColor, fontSize: 12, fontWeight: "700" },
  selected: { backgroundColor: T.primaryColor, borderColor: T.primaryColor },
  selectedText: { color: "#FFF" },
});

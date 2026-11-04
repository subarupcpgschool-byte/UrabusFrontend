import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { INPUT_THEME as T } from '@/theme/inputTheme';
import { AppFormField, type FieldProps } from './AppFormField';
import type { ChoiceOption } from './AppChoice';

export type AppSelectProps = FieldProps & {
  options: ChoiceOption[]; value: string; onValueChange: (value: string) => void;
  placeholder?: string; disabled?: boolean; accessibilityLabel?: string;
};

/** A modal choice list shared by Web, iOS and Android. */
export function AppSelect({ options, value, onValueChange, placeholder = '選択してください', disabled = false, accessibilityLabel, ...field }: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const close = () => { setOpen(false); };
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const selected = options.find(o => o.value === value);
  const name = accessibilityLabel ?? field.label ?? placeholder;
  return <AppFormField {...field}>
    <Pressable accessibilityRole="button" accessibilityLabel={name} accessibilityValue={{ text: selected?.label ?? placeholder }} accessibilityState={{ expanded: open, disabled }}
      disabled={disabled} onPress={() => setOpen(true)} style={[s.control, Platform.OS === 'web' && { outlineWidth: 0 }, !!field.error && { borderColor: T.errorColor }, disabled && { opacity: T.disabledOpacity }]}>
      <Text style={[s.value, !selected && { color: T.placeholderColor }]}>{selected?.label ?? placeholder}</Text><Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color={T.textColor} style={s.arrow} />
    </Pressable>
    <Modal transparent visible={open && !disabled} animationType="fade" onRequestClose={close}>
      <View style={s.backdrop}>
        <Pressable accessibilityLabel="選択をキャンセル" accessibilityRole="button" onPress={close} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={s.dialog}>
          <View style={s.heading}><Text accessibilityRole="header" style={s.title}>{name}</Text><Pressable accessibilityRole="button" accessibilityLabel="閉じる" onPress={close} style={s.close}><Ionicons name="close" size={28} color={T.textColor} /></Pressable></View>
          <ScrollView style={s.list} keyboardShouldPersistTaps="handled"><View accessibilityRole="radiogroup" accessibilityLabel={name}>
            {options.length === 0 && <Text style={s.empty}>選択肢がありません</Text>}
            {options.map(o => <Pressable key={o.value} accessibilityRole="radio" accessibilityLabel={o.label} accessibilityState={{ checked: value === o.value, disabled: !!o.disabled }} disabled={o.disabled}
              onPress={() => { onValueChange(o.value); close(); }} style={[s.option, o.value === value && s.active, o.disabled && { opacity: T.disabledOpacity }]}>
              <Text style={s.value}>{o.label}</Text>{value === o.value && <Ionicons name="checkmark" size={22} color={T.primaryColor} />}
            </Pressable>)}
          </View></ScrollView>
        </View>
      </View>
    </Modal>
  </AppFormField>;
}
const s = StyleSheet.create({
  control: { minHeight: T.minHeight, borderRadius: T.borderRadius, borderWidth: 1, borderColor: T.borderColor, backgroundColor: T.backgroundColor, paddingHorizontal: T.paddingHorizontal, flexDirection: 'row', alignItems: 'center', gap: 10 },
  value: { color: T.textColor, fontSize: T.fontSize, flexShrink: 1 }, arrow: { marginLeft: 'auto' },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,.35)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  dialog: { width: '100%', maxWidth: 460, maxHeight: '80%', borderRadius: 14, backgroundColor: T.backgroundColor, padding: 16 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }, title: { color: T.textColor, fontSize: 16, fontWeight: '700', flex: 1 }, close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  list: { flexGrow: 0 }, option: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, gap: 10 }, active: { backgroundColor: T.selectedBackground }, empty: { padding: 12, color: T.placeholderColor },
});

import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { INPUT_THEME as T } from '@/theme/inputTheme';
import { AppFormField, type FieldProps } from './AppFormField';
import { AppInput } from './AppInput';
import type { ChoiceOption } from './AppChoice';

export type AppSearchableDropdownProps = FieldProps & {
  options: ChoiceOption[]; value: string[]; onValueChange: (value: string[]) => void;
  multiple?: boolean; placeholder?: string; disabled?: boolean; accessibilityLabel?: string;
};

/** A modal choice list shared by Web, iOS and Android. */
export function AppSearchableDropdown({ options, value, onValueChange, multiple = false, placeholder = '選択してください', disabled = false, accessibilityLabel, ...field }: AppSearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const close = () => { setOpen(false); };
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  const selected = options.filter(o => value.includes(o.value)).map(o => o.label).join('、');
  const normalize = (text: string) => text.normalize('NFKC').toLocaleLowerCase().trim();
  const filtered = options.filter(o => normalize(o.label).includes(normalize(query)));
  const name = accessibilityLabel ?? field.label ?? placeholder;
  return <AppFormField {...field}>
    <Pressable accessibilityRole="button" accessibilityLabel={name} accessibilityValue={{ text: selected || placeholder }} accessibilityState={{ expanded: open, disabled }}
      disabled={disabled} onPress={() => { setQuery(''); setOpen(true); }} style={[s.control, Platform.OS === 'web' && { outlineWidth: 0 }, !!field.error && { borderColor: T.errorColor }, disabled && { opacity: T.disabledOpacity }]}>
      <Text style={[s.value, !selected && { color: T.placeholderColor }]}>{selected || placeholder}</Text><Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color={T.textColor} style={s.arrow} />
    </Pressable>
    <Modal transparent visible={open && !disabled} animationType="fade" onRequestClose={close}>
      <View style={s.backdrop}>
        <Pressable accessibilityLabel="選択をキャンセル" accessibilityRole="button" onPress={close} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={s.dialog}>
          <View style={s.heading}><Text accessibilityRole="header" style={s.title}>{name}</Text><Pressable accessibilityRole="button" accessibilityLabel="閉じる" onPress={close} style={s.close}><Ionicons name="close" size={28} color={T.textColor} /></Pressable></View>
          <AppInput accessibilityLabel="選択肢を検索" placeholder="キーワードで検索" value={query} onChangeText={setQuery} autoFocus />
          <ScrollView style={s.list} keyboardShouldPersistTaps="handled"><View accessibilityRole={multiple ? undefined : "radiogroup"} accessibilityLabel={name}>
            {filtered.length === 0 && <Text style={s.empty}>選択肢がありません</Text>}
            {filtered.map(o => <Pressable key={o.value} accessibilityRole={multiple ? "checkbox" : "radio"} accessibilityLabel={o.label} aria-checked={value.includes(o.value)} accessibilityState={{ checked: value.includes(o.value), disabled: !!o.disabled }} disabled={o.disabled}
              onPress={() => { if (multiple) onValueChange(value.includes(o.value) ? value.filter(v => v !== o.value) : [...value, o.value]);
                else { onValueChange([o.value]); close(); } }} style={[s.option, value.includes(o.value) && s.active, o.disabled && { opacity: T.disabledOpacity }]}>
              <Text style={s.value}>{o.label}</Text>{value.includes(o.value) && <Ionicons name="checkmark" size={22} color={T.primaryColor} />}
            </Pressable>)}
          </View></ScrollView>
          {multiple && <Pressable accessibilityRole="button" accessibilityLabel="選択を完了" style={s.close} onPress={close}><Ionicons name="checkmark" size={28} color={T.primaryColor} /></Pressable>}
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

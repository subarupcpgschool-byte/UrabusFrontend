import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { INPUT_THEME as T } from '@/theme/inputTheme';
import { AppFormField, type FieldProps } from './AppFormField';
import { AppInput } from './AppInput';
import { AppTag } from './AppChoice';

export type AppTagInputProps = FieldProps & {
  value: string[]; onValueChange: (value: string[]) => void; placeholder?: string;
  disabled?: boolean; maxTags?: number; maxTagLength?: number; suggestions?: string[];
};
export function AppTagInput({ value, onValueChange, placeholder = 'タグを入力', disabled = false, maxTags = 20, maxTagLength = 40, suggestions = [], ...field }: AppTagInputProps) {
  const [draft, setDraft] = useState('');
  const full = value.length >= maxTags;
  const add = (raw: string) => {
    const tag = raw.trim();
    if (disabled || full || !tag || tag.length > maxTagLength || value.includes(tag)) return;
    onValueChange([...value, tag]); setDraft('');
  };
  return <AppFormField {...field}><View style={s.wrap}>
    {!!value.length && <View style={s.tags}>{value.map(tag => <AppTag key={tag} label={tag} disabled={disabled} onRemove={() => onValueChange(value.filter(v => v !== tag))} />)}</View>}
    <View style={s.row}><AppInput accessibilityLabel={field.label ? `${field.label}を入力` : placeholder} value={draft} onChangeText={setDraft} maxLength={maxTagLength} disabled={disabled || full} placeholder={full ? `最大${maxTags}件です` : placeholder} returnKeyType="done" onSubmitEditing={() => add(draft)} style={s.input} />
      <Pressable accessibilityRole="button" accessibilityLabel="タグを追加" disabled={disabled || full || !draft.trim() || value.includes(draft.trim())} onPress={() => add(draft)} style={({ pressed }) => [s.add, (disabled || full || !draft.trim() || value.includes(draft.trim()) || pressed) && { opacity: T.disabledOpacity }]}><Text style={s.addText}>追加</Text></Pressable>
    </View>
    {!!suggestions.length && <View style={s.tags}>{suggestions.filter(tag => !value.includes(tag)).map(tag => <AppTag key={tag} label={tag} disabled={disabled || full} onPress={() => add(tag)} />)}</View>}
  </View></AppFormField>;
}
const s = StyleSheet.create({ wrap: { gap: 8 }, tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, row: { flexDirection: 'row', gap: 8 }, input: { flex: 1 }, add: { justifyContent: 'center', paddingHorizontal: 14, backgroundColor: T.primaryColor, borderRadius: T.borderRadius }, addText: { color: '#FFF', fontWeight: '700' } });

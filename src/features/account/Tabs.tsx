import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SEARCH_COLORS as C } from '@/components/search/theme';

export function Tabs({ options, value, onChange, label }: { options: { value: string; label: string; count?: number }[]; value: string; onChange: (value: string) => void; label: string }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.row} style={{ flexGrow: 0 }}>
    <View accessibilityRole="tablist" accessibilityLabel={label} style={s.row}>{options.map(option => <Pressable key={option.value} accessibilityRole="tab" accessibilityLabel={option.label} accessibilityState={{ selected: value === option.value }} onPress={() => onChange(option.value)} style={[s.tab, value === option.value && s.active]}>
      <Text style={[s.label, value === option.value && s.selected]}>{option.label}{option.count !== undefined ? `（${option.count}）` : ''}</Text>
    </Pressable>)}</View>
  </ScrollView>;
}
const s = StyleSheet.create({ row: { flexDirection: 'row', gap: 8 }, tab: { minHeight: 46, paddingHorizontal: 18, justifyContent: 'center', backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 10 }, active: { backgroundColor: C.primary, borderColor: C.primary }, label: { color: C.textSub, fontSize: 13, fontWeight: '700' }, selected: { color: '#FFF' } });

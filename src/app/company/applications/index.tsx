import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { AppSelect } from '@/components/form';
import { BodyText, Panel, SectionTitle, StatusBadge, TwoColumn } from '@/components/ui/AppUI';
import { companyApplications } from '@/features/company/demoApplications';

const statusOptions = ['すべて', '未確認', '選考中', '面談', '内定'].map(value => ({ value, label: value }));

export default function CompanyApplicationsPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selection, setSelection] = useState<string | undefined>(id);
  const [status, setStatus] = useState('すべて');
  const items = companyApplications.filter(item => status === 'すべて' || item.status === status);
  const selected = items.find(item => item.id === selection);

  return (
    <AppPage title="応募・選考管理" subtitle="" role="company" activeMenu="応募・選考管理">
      <BodyText>企業管理のサンプルデータを表示しています。</BodyText>
      <TwoColumn>
        <Panel style={styles.list}>
          <SectionTitle>応募者一覧</SectionTitle>
          <AppSelect label="選考状況" value={status} options={statusOptions} onValueChange={setStatus} />
          {items.map(item => (
            <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: selected?.id === item.id }}
              onPress={() => setSelection(item.id)} style={[styles.card, selected?.id === item.id && styles.selected]}>
              <Text style={styles.name}>{item.name}</Text>
              <BodyText>{item.job}</BodyText>
              <StatusBadge label={item.status} />
            </Pressable>
          ))}
        </Panel>
        <Panel style={styles.detail}>
          {selected ? <>
            <SectionTitle>{selected.name}</SectionTitle>
            <StatusBadge label={selected.status} />
            <BodyText>応募求人　{selected.job}</BodyText>
            <BodyText>応募日　{selected.received}</BodyText>
            <BodyText>スキル　{selected.skills}</BodyText>
          </> : <BodyText>一覧から応募者を選択してください。</BodyText>}
        </Panel>
      </TwoColumn>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, minWidth: 245 },
  detail: { flex: 2, minWidth: 245 },
  card: { padding: 12, gap: 6, borderRadius: 8, borderWidth: 1, borderColor: '#DDE6F1' },
  selected: { backgroundColor: '#F2F7FF', borderColor: '#2563EB' },
  name: { color: '#183455', fontSize: 14, fontWeight: '800' },
});

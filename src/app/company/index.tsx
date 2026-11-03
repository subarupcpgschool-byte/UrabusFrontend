import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { BodyText, KpiRow, Panel, SectionTitle, StatCard } from '@/components/ui/AppUI';
import { companyApplications } from '@/features/company/demoApplications';

const tasks = [
  { path: '/company/applications', title: '応募・選考管理', detail: '求人ごとの応募者と選考状況を確認します。' },
  { path: '/company/jobs', title: '求人管理', detail: '掲載中の求人を確認し、求人を作成します。' },
  { path: '/company/talent', title: '人材検索', detail: '募集に合う人材を探します。' },
  { path: '/company/settings', title: '企業・権限', detail: '企業情報とメンバー権限を確認します。' },
] as const;

export default function CompanyDashboard() {
  return (
    <AppPage title="ダッシュボード" subtitle="" role="company" activeMenu="ダッシュボード">
      <BodyText>企業管理のサンプルデータを表示しています。</BodyText>
      <KpiRow>
        {['未確認', '選考中', '面談', '内定'].map(status => (
          <StatCard key={status} label={status} value={String(companyApplications.filter(item => item.status === status).length)} />
        ))}
      </KpiRow>
      <Panel>
        <SectionTitle>採用メニュー</SectionTitle>
        <View style={styles.menu}>
          {tasks.map(task => (
            <View key={task.path} style={styles.tile}>
              <Link href={task.path} style={styles.link}>{task.title} ›</Link>
              <BodyText>{task.detail}</BodyText>
            </View>
          ))}
        </View>
      </Panel>
      <Panel>
        <SectionTitle>最近の応募</SectionTitle>
        {companyApplications.slice(0, 3).map(item => (
          <Link key={item.id} href={{ pathname: '/company/applications', params: { id: item.id } }} style={styles.link}>
            {item.name} ／ {item.job} ／ {item.status}
          </Link>
        ))}
      </Panel>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  menu: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { flex: 1, minWidth: 180, padding: 14, gap: 6, borderRadius: 10, backgroundColor: '#F1F6FE' },
  link: { color: '#1857B4', fontSize: 14, fontWeight: '700', paddingVertical: 8 },
});

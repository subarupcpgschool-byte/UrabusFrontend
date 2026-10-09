import { Header } from '@/components/common/Header';
import { Logo } from '@/components/common/Logo';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const navy = '#081b50', blue = '#006eff', green = '#18833c';
const questions = [
  ['有料になるのは何件目からですか？', '3件目から有料掲載となり、基本料金は8,000円です。'],
  ['割引を受けるために必要なことは？', '応募後の交渉終了と、試用期間中の評価記入が条件です。締切を過ぎると割引対象外となります。'],
];
const comparison = [
  ['求人掲載数', '2件まで', '3件以上'], ['基本料金', '0円', '8,000円'],
  ['条件達成による割引', '—', '最大3,000円'], ['採用成功による追加料金', '0円', '0円'],
];
function Action({ label, color = blue }: { label: string; color?: string }) {
  return <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/auth', params: { mode: 'register' } })} style={({ pressed, hovered }) => [s.action, { backgroundColor: color, opacity: pressed ? .75 : hovered ? .88 : 1 }]}><Text style={s.actionText}>{label}</Text><Ionicons name="chevron-forward" size={22} color="white" /></Pressable>;
}
function Feature({ children, color }: { children: string; color: string }) {
  return <View style={s.feature}><Ionicons name="checkmark-circle" color={color} size={27} /><Text style={s.body}>{children}</Text></View>;
}
export default function PriceScreen() {
  const { width } = useWindowDimensions();
  const desktop = width >= 1000, columns = width >= 760;
  const [opened, setOpened] = useState([true, true]);
  return <ScrollView style={s.page} contentContainerStyle={{ flexGrow: 1 }}>
    <Header desktop={desktop} />
    <View style={s.main}>
      <View style={s.breadcrumb}><Pressable onPress={() => router.push('/')}><Text style={s.small}>ホーム</Text></Pressable><Ionicons name="chevron-forward" size={13} color={navy} /><Text style={s.small}>料金体系</Text></View>
      <View style={s.hero}><Text style={s.tag}>企業向け掲載プラン</Text><Text style={s.title}>料金体系</Text><Text style={[s.body, { textAlign: 'center', fontSize: 19 }]}>中小企業の採用を、もっとシンプルに。</Text></View>
      <View style={[s.row, !columns && s.vertical]}>
        <View style={[s.plan, { backgroundColor: '#f0fcf4', borderColor: '#a0e5bd' }]}>
          <Text style={[s.pill, { backgroundColor: green }]}>無料プラン</Text>
          <Text style={[s.price, { color: green }]}>0<Text style={s.unit}>円</Text></Text>
          <Text style={[s.body, s.center]}>まずは無料で求人掲載を始めたい企業さまへ</Text>
          <View style={s.features}>{['求人掲載 2件まで', '求人管理', '応募者とのチャット', '採用成功による追加料金なし'].map(x => <Feature key={x} color={green}>{x}</Feature>)}</View>
          <View style={s.space} /><Action label="無料で掲載を始める" color={green} />
        </View>
        <View style={[s.plan, { backgroundColor: '#eef8ff', borderColor: '#9ed4ff' }]}>
          <Text style={[s.pill, { backgroundColor: blue }]}>有料掲載プラン</Text>
          <Text style={[s.body, s.center]}>求人掲載 3件以上</Text><Text style={[s.body, s.center, { marginTop: 12 }]}>基本料金</Text>
          <Text style={[s.price, { color: blue, fontSize: 52 }]}>8,000<Text style={s.unit}>円</Text></Text>
          <Text style={s.discount}>◆ 最大3,000円割引</Text>
          <Ionicons name="chevron-down" size={21} color={navy} style={{ alignSelf: 'center', marginTop: 7 }} />
          <Text style={[s.body, s.center]}>割引適用で</Text><Text style={[s.price, { color: blue, fontSize: 52 }]}>5,000<Text style={s.unit}>円〜</Text></Text>
          <Text style={s.note}>割引額は条件の達成状況により決定</Text>
          <View style={s.features}>{['求人管理', '応募者とのチャット', '採用成功による追加料金は 0円'].map(x => <Feature key={x} color={blue}>{x}</Feature>)}</View>
          <View style={s.space} /><Action label="求人掲載を始める" />
        </View>
      </View>
      <Text style={s.heading}>割引の適用条件</Text><Text style={[s.body, { marginBottom: 18 }]}>応募への対応と、採用後の評価が割引の条件です。</Text>
      <View style={[s.row, !columns && s.vertical]}>
        {[
          { title: '応募後の募集状況を「交渉終了」にする', limit: '応募から30日以内', body: '応募のあった案件は、募集状況を「交渉終了」まで進めてください。', warnings: ['応募から30日を超えた場合は割引対象外となり、「交渉終了」にするまで割引対象になりません。'] },
          { title: '採用したユーザーを試用期間中に評価する', limit: '試用期間内', body: '採用後は、試用期間中にユーザーの評価結果と評価内容を記載してください。', warnings: ['評価内容が未記入の場合、評価を完了できません。', '試用期間を超えた場合は割引対象外となります。'] },
        ].map((x, i) => <View key={x.title} style={s.condition}><View style={s.conditionHeader}><Text style={s.number}>0{i + 1}</Text><Text style={[s.body, { flex: 1, fontWeight: '800' }]}>{x.title}</Text></View><Text style={s.limit}>{x.limit}</Text><Text style={[s.body, { lineHeight: 25, marginVertical: 14 }]}>{x.body}</Text><View style={s.warning}>{x.warnings.map(w => <View key={w} style={s.warningRow}><Ionicons name="alert-circle" size={21} color="#ea6c00" /><Text style={s.warningText}>{w}</Text></View>)}</View></View>)}
      </View>
      <Text style={s.heading}>プラン比較</Text>
      <View style={s.table}><View style={s.tableRow}>{['機能', '無料プラン', '有料掲載プラン'].map((x,i) => <View key={x} style={[s.cell, { backgroundColor: i === 1 ? '#e8f8ed' : i === 2 ? '#e5f3ff' : '#f3f5f8' }]}><Text style={[s.cellText, { fontWeight: '800', color: i === 1 ? green : i === 2 ? blue : navy }]}>{x}</Text></View>)}</View>{comparison.map(row => <View style={s.tableRow} key={row[0]}>{row.map((x,i) => <View key={i} style={s.cell}><Text style={[s.cellText, i === 0 && { textAlign: 'left' }]}>{x}</Text></View>)}</View>)}</View>
      <Text style={s.heading}>よくあるご質問</Text>
      {questions.map(([q,a],i) => <View key={q} style={s.faq}><Pressable accessibilityRole="button" accessibilityState={{ expanded: opened[i] }} onPress={() => setOpened(v => v.map((x,j) => j === i ? !x : x))} style={s.question}><Text style={[s.body, { flex: 1, fontWeight: '800' }]}>{q}</Text><Ionicons name={opened[i] ? 'chevron-up' : 'chevron-down'} size={19} color={navy} /></Pressable>{opened[i] && <Text style={[s.body, { lineHeight: 25, marginTop: 8 }]}>{a}</Text>}</View>)}
      <View style={[s.banner, !columns && s.vertical]}><Text style={[s.body, { fontSize: 22, fontWeight: '900', textAlign: 'center' }]}>採用の第一歩を、ここから。</Text><Action label="無料で求人を掲載する" /></View>
      <View style={s.footer}><View style={{ height: 58 }}><Logo /></View><Text style={s.small}>© GlobalWorkers</Text></View>
    </View>
  </ScrollView>;
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' }, main: { width: '100%', maxWidth: 1120, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 24 },
  breadcrumb: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 }, small: { fontSize: 12, color: '#647494' },
  hero: { alignItems: 'center', paddingVertical: 30, gap: 12 }, tag: { color: blue, backgroundColor: '#e5f4ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 22, fontWeight: '700' }, title: { fontSize: 38, color: navy, fontWeight: '900' },
  body: { color: navy, fontSize: 16 }, center: { textAlign: 'center', fontWeight: '600' }, row: { flexDirection: 'row', gap: 18, alignItems: 'stretch' }, vertical: { flexDirection: 'column' },
  plan: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 24, minHeight: 570 }, pill: { alignSelf: 'center', color: 'white', fontSize: 19, fontWeight: '800', paddingHorizontal: 30, paddingVertical: 7, borderRadius: 30, marginBottom: 10 },
  price: { fontSize: 76, fontWeight: '900', textAlign: 'center', marginVertical: 5 }, unit: { fontSize: 29 }, discount: { color: '#eb6900', backgroundColor: '#fff5cc', textAlign: 'center', padding: 9, fontWeight: '800', fontSize: 18, borderRadius: 10 }, note: { color: navy, backgroundColor: '#dfebf6', fontSize: 13, textAlign: 'center', padding: 8, borderRadius: 9 },
  features: { borderTopWidth: 1, borderColor: '#d6e3df', marginTop: 18, paddingTop: 15, gap: 10 }, feature: { flexDirection: 'row', alignItems: 'center', gap: 12 }, space: { flex: 1, minHeight: 18 }, action: { minHeight: 52, paddingHorizontal: 22, borderRadius: 13, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 }, actionText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  heading: { color: navy, fontSize: 27, fontWeight: '900', marginTop: 28, marginBottom: 10 }, condition: { flex: 1, borderWidth: 1, borderColor: '#c8dfff', borderRadius: 9, padding: 18 }, conditionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 }, number: { backgroundColor: blue, color: '#fff', borderRadius: 25, width: 46, height: 46, textAlign: 'center', lineHeight: 46, fontSize: 19, fontWeight: '800' }, limit: { alignSelf: 'flex-start', marginTop: 10, borderWidth: 1, borderColor: '#89caff', borderRadius: 25, paddingHorizontal: 12, paddingVertical: 5, color: blue, backgroundColor: '#eef9ff', fontWeight: '700' }, warning: { backgroundColor: '#fff5e7', padding: 14, borderRadius: 10, gap: 9 }, warningRow: { flexDirection: 'row', gap: 8 }, warningText: { flex: 1, color: '#de6000', fontSize: 14, lineHeight: 23 },
  table: { borderWidth: 1, borderColor: '#dbe3ef', borderRadius: 8, overflow: 'hidden' }, tableRow: { flexDirection: 'row' }, cell: { flex: 1, paddingHorizontal: 10, paddingVertical: 11, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#dbe3ef', justifyContent: 'center' }, cellText: { color: navy, textAlign: 'center', fontSize: 14 }, faq: { borderWidth: 1, borderColor: '#dbe3ef', borderRadius: 9, padding: 18, marginBottom: 12 }, question: { flexDirection: 'row', alignItems: 'center', gap: 12 }, banner: { backgroundColor: '#eaf5ff', padding: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 18, marginTop: 6 }, footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 },
});

import { StyleSheet, Text, View } from 'react-native';
import { BodyText, Panel, SectionTitle, StatusBadge } from '@/components/ui/AppUI';
import { RecruitmentArticle } from './RecruitmentArticle';

type DraftPreview = {
  kind: string;
  title: string;
  employment: string;
  location: string;
  compensation: string;
  requirements: string;
  startDate: string;
  endDate: string;
  articleHtml: string;
  articleCss: string;
};

export function RecruitmentDetailPreview({ draft, companyName, commonCss, visibility }: {
  draft: DraftPreview;
  companyName?: string | null;
  commonCss?: string;
  visibility: string;
}) {
  const company = draft.kind === 'COMPANY_RECRUITMENT';
  const title = draft.title.trim() || '募集タイトル';
  const name = companyName?.trim() || '企業名';
  const location = draft.location.trim() || '未入力';
  const pay = draft.compensation.trim() || '未入力';

  return <View style={s.stack}>
    <SectionTitle>ページ全体のプレビュー</SectionTitle>
    <BodyText>{visibility} ／ 編集中の内容を表示しています。</BodyText>
    <View style={s.page}>
      <Text accessibilityRole="header" style={s.pageTitle}>{company ? '企業詳細' : '求人詳細'}</Text>
      <Panel>
        <View style={s.hero}>
          <View style={s.mark}><Text style={s.initial}>{name.slice(0, 1)}</Text></View>
          <View style={s.identity}>
            <Text accessibilityRole="header" style={s.title}>{company ? name : title}</Text>
            <BodyText>{company ? draft.location.trim() || '募集地域は未入力' : name}</BodyText>
          </View>
        </View>
        <View style={s.tags}>
          {!!draft.location.trim() && <StatusBadge label={draft.location.trim()} />}
          {!!draft.employment && <StatusBadge label={draft.employment} />}
        </View>
        {!company && <Text style={s.pay}>{pay}</Text>}
      </Panel>
      <Panel>
        <SectionTitle>{company ? '企業募集' : '仕事内容'}</SectionTitle>
        {company && <Text accessibilityRole="header" style={s.title}>{title}</Text>}
        {draft.articleHtml ? <RecruitmentArticle html={draft.articleHtml} commonCss={commonCss} articleCss={draft.articleCss} /> :
          <BodyText>本文を入力するとここに表示されます。</BodyText>}
      </Panel>
      <Panel>
        <SectionTitle>{company ? '募集概要' : '勤務地・働き方'}</SectionTitle>
        <BodyText>勤務地・募集地域　{location}</BodyText>
        <BodyText>雇用形態　{draft.employment || '未入力'}</BodyText>
        <BodyText>給与・報酬　{pay}</BodyText>
        <BodyText>募集期間　{draft.startDate || '開始制限なし'} 〜 {draft.endDate || '無期限'}</BodyText>
      </Panel>
      <Panel>
        <SectionTitle>応募条件</SectionTitle>
        <BodyText>{draft.requirements.trim() || '未入力'}</BodyText>
      </Panel>
      <Panel>
        <SectionTitle>{company ? 'この募集に応募する' : 'この求人に応募する'}</SectionTitle>
        <Text style={s.pay}>{pay}</Text>
        <View accessibilityRole="button" accessibilityState={{ disabled: true }} style={s.action}>
          <Text style={s.actionText}>応募する</Text>
        </View>
        <BodyText>プレビューからは応募できません。</BodyText>
      </Panel>
    </View>
  </View>;
}

const s = StyleSheet.create({
  stack: { gap: 8 },
  page: { gap: 12, padding: 10, borderRadius: 12, backgroundColor: '#F1F6FD' },
  pageTitle: { color: '#183455', fontWeight: '700', fontSize: 17 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mark: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#315B8A', alignItems: 'center', justifyContent: 'center' },
  initial: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  identity: { flex: 1, minWidth: 0, gap: 4 },
  title: { color: '#183455', fontSize: 20, fontWeight: '800' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pay: { color: '#183455', fontSize: 17, fontWeight: '800' },
  action: { alignItems: 'center', padding: 10, borderRadius: 8, backgroundColor: '#DCE8F7' },
  actionText: { color: '#315275', fontWeight: '700' },
});

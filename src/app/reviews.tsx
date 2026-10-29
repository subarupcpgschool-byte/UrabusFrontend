import AppPage from '@/components/layout/AppPage';
import { BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';

export default function ReviewsPage() {
  return <AppPage title="評価について" subtitle="企業とユーザーが、お互いを知るための評価です。">
    <Panel><SectionTitle>企業とユーザーの相互評価</SectionTitle><BodyText>ユーザーは企業を、企業は採用したユーザーを、5段階の評価と評価内容で評価します。</BodyText></Panel>
    <Panel><SectionTitle>採用後の評価</SectionTitle><BodyText>企業は採用したユーザーについて、試用期間中に評価結果と評価内容を記入してください。評価内容が未記入の場合は、評価を完了できません。</BodyText></Panel>
    <Panel><SectionTitle>料金の割引条件</SectionTitle><BodyText>応募後の交渉終了と、試用期間中の評価が企業の掲載料金の割引条件です。詳しい条件は料金ページでご確認ください。</BodyText></Panel>
  </AppPage>;
}

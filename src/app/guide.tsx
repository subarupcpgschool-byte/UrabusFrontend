import AppPage from '@/components/layout/AppPage';
import { AppButton, BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';
import { router } from 'expo-router';

export default function GuidePage() {
  return <AppPage title="ご利用ガイド" subtitle="GlobalWorkersの基本的な使い方をご案内します。">
    <Panel><SectionTitle>1. 求人・企業を探す</SectionTitle><BodyText>「求人を探す」「企業を探す」から、希望の条件に合わせて検索できます。</BodyText><AppButton label="求人を探す" onPress={() => router.push('/jobs')} /></Panel>
    <Panel><SectionTitle>2. アカウントを登録する</SectionTitle><BodyText>ログイン、または新規登録をしてご利用ください。ユーザーの利用料金は0円です。</BodyText><AppButton label="アカウント" onPress={() => router.push('/auth')} /></Panel>
    <Panel><SectionTitle>3. 応募・採用後の対応</SectionTitle><BodyText>求人詳細から応募し、企業とやり取りします。企業は応募から30日以内の交渉終了と、採用後の試用期間中の評価をお願いします。</BodyText></Panel>
    <Panel><SectionTitle>料金を確認する</SectionTitle><BodyText>企業は求人掲載2件まで無料です。3件以上の掲載料金と割引条件は、料金ページでご確認ください。</BodyText><AppButton label="料金を見る" onPress={() => router.push('/price')} /></Panel>
  </AppPage>;
}

import ChatPanel from "@/components/chat/ChatPanel";
import AppPage from "@/components/layout/AppPage";

export default function CompanyChatScreen() {
  return <AppPage title="企業連絡" subtitle="雇用中の企業からのお知らせと連絡" role="user" activeMenu="メッセージ"><ChatPanel partner="TechVision株式会社 人事部" roomLabel="雇用中・企業連絡" firstMessage="今月の勤務予定についてご確認をお願いします。" /></AppPage>;
}

import ChatPanel from "@/components/chat/ChatPanel";
import AppPage from "@/components/layout/AppPage";

export default function ScoutChatScreen() {
  return (
    <AppPage
      title="スカウトチャット"
      subtitle="スカウト企業へ質問・返信できます"
      role="user"
      activeMenu="メッセージ"
    >
      <ChatPanel
        partner="株式会社イノート 採用担当"
        roomLabel="スカウト：Webデザイナー"
        firstMessage="プロフィールを拝見し、ぜひ一度お話ししたいと思いご連絡しました。"
      />
    </AppPage>
  );
}

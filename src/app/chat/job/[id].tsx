import ChatPanel from "@/components/chat/ChatPanel";
import AppPage from "@/components/layout/AppPage";

export default function JobChatScreen() {
  return (
    <AppPage
      title="求人個別チャット"
      subtitle="応募先企業と直接やり取りできます"
      role="user"
      activeMenu="メッセージ"
    >
      <ChatPanel
        partner="TechVision株式会社 採用担当"
        roomLabel="応募：バックエンドエンジニア"
        firstMessage="ご応募ありがとうございます。経歴書を確認いたしました。"
      />
    </AppPage>
  );
}

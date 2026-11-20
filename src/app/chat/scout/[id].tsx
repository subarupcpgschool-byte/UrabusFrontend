import ChatPanel from "@/components/chat/ChatPanel";
import AppPage from "@/components/layout/AppPage";
export default function ChatScreen() {
  return (
    <AppPage title="スカウトメッセージ" subtitle="" role="user" activeMenu="メッセージ">
      <ChatPanel />
    </AppPage>
  );
}

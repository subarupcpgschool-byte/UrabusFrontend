import ChatPanel from "@/components/chat/ChatPanel";
import AppPage from "@/components/layout/AppPage";
export default function ChatScreen() {
  return (
    <AppPage title="企業メッセージ" subtitle="" role="user" activeMenu="メッセージ">
      <ChatPanel />
    </AppPage>
  );
}

import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import ChatPanel from "@/components/chat/ChatPanel";
import AppPage from "@/components/layout/AppPage";
export default function ChatScreen() {
  "use no memo";
  useLocaleVersion();
  return (
    <AppPage
      title={tText("jobMessages")}
      subtitle=""
      role="user"
      activeMenu={sourceText("messages")}
    >
      <ChatPanel />
    </AppPage>
  );
}

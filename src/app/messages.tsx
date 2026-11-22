import { tText, useLocaleVersion } from "@/i18n/display";
import AppPage from "@/components/layout/AppPage";
import MessageWorkspace from "@/features/workspace/MessageWorkspace";
export default function MessagesPage() {
  "use no memo";
  useLocaleVersion();
  return (
    <AppPage
      title={tText("messages")}
      subtitle={tText("manageInteractionsSeparatelyForEachCompanyOr")}
    >
      <MessageWorkspace />
    </AppPage>
  );
}

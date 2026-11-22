import { useLocaleVersion } from "@/i18n/display";
import { useLocalSearchParams } from "expo-router";
import MessageWorkspace from "@/features/workspace/MessageWorkspace";
export default function ChatPanel() {
  "use no memo";
  useLocaleVersion();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <MessageWorkspace
      initialRoom={{
        kind: "job",
        id: id || "",
        roomId: id,
        title: "",
        company: "",
      }}
    />
  );
}

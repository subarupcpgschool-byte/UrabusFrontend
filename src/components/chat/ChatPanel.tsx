import { useLocalSearchParams } from "expo-router";
import MessageWorkspace from "@/features/workspace/MessageWorkspace";
export default function ChatPanel() {
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

import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { View } from "react-native";
import { useWorkspace } from "./WorkspaceProvider";
export function MockBanner() {
  "use no memo";
  useLocaleVersion();
  const { mockMode, ready, resetMock } = useWorkspace();
  if (!mockMode || !ready) return null;
  return (
    <View
      style={{
        backgroundColor: "#eaf2ff",
        borderRadius: 10,
        padding: 14,
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <View style={{ flex: 1, minWidth: 170 }}>
        <Text style={{ color: "#1748b8", fontWeight: "800" }}>
          {tText("showingSampleData")}
        </Text>
        <Text style={{ color: "#475569", fontSize: 12, marginTop: 5 }}>
          {tText("thisIsFictionalSampleDataYouCan")}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={resetMock}
        style={{ padding: 11, borderRadius: 8, backgroundColor: "#fff" }}
      >
        <Text style={{ color: "#2563eb", fontWeight: "700" }}>
          {tText("resetSampleData")}
        </Text>
      </Pressable>
    </View>
  );
}

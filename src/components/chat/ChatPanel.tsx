import { SEARCH_COLORS as C } from "@/components/search/theme";
import { Panel, StatusBadge } from "@/components/ui/AppUI";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ChatPanel({
  partner,
  roomLabel,
  firstMessage,
}: {
  partner: string;
  roomLabel: string;
  firstMessage: string;
}) {
  const [message, setMessage] = useState("");
  return (
    <View style={s.layout}>
      <Panel style={s.list}>
        <Text style={s.heading}>メッセージ</Text>
        {[partner, "グリーンリーフ株式会社", "株式会社サンプル"].map(
          (name, index) => (
            <View key={name} style={[s.partner, index === 0 && s.active]}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.partnerName}>{name}</Text>
                <Text numberOfLines={1} style={s.preview}>
                  メッセージがあります
                </Text>
              </View>
            </View>
          ),
        )}
      </Panel>
      <Panel style={s.main}>
        <View style={s.chatHead}>
          <View>
            <Text style={s.heading}>{partner}</Text>
            <Text style={s.roomLabel}>{roomLabel}</Text>
          </View>
          <StatusBadge label="参加中" tone="green" />
        </View>
        <ScrollView style={s.messages}>
          <Bubble text={firstMessage} />
          <Bubble
            mine
            text="ありがとうございます。詳細をお伺いしてもよろしいでしょうか？"
          />
          <Bubble text="もちろんです。オンライン面談の日程候補をお送りします。" />
        </ScrollView>
        <View style={s.composer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="メッセージを入力"
            placeholderTextColor={C.textMuted}
            style={s.input}
          />
          <Pressable
            onPress={() => setMessage("")}
            style={({ pressed }) => [s.send, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="send" size={20} color={C.white} />
          </Pressable>
        </View>
      </Panel>
    </View>
  );
}
function Bubble({ text, mine = false }: { text: string; mine?: boolean }) {
  return (
    <View style={[s.bubble, mine && s.mine]}>
      <Text style={[s.bubbleText, mine && { color: C.white }]}>{text}</Text>
      <Text style={[s.time, mine && { color: "#D7E5FF" }]}>10:24</Text>
    </View>
  );
}
const s = StyleSheet.create({
  layout: { minHeight: 600, flexDirection: "row", gap: 13 },
  list: { width: 280 },
  main: { flex: 1, padding: 0, overflow: "hidden" },
  heading: { color: C.text, fontSize: 15, fontWeight: "900" },
  partner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 9,
    borderRadius: 8,
  },
  active: { backgroundColor: C.primarySoft },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: C.white, fontWeight: "900" },
  partnerName: { color: C.text, fontSize: 11.5, fontWeight: "800" },
  preview: { color: C.textSub, fontSize: 10 },
  chatHead: {
    minHeight: 68,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roomLabel: { marginTop: 4, color: C.textSub, fontSize: 10 },
  messages: { flex: 1, padding: 16 },
  bubble: {
    maxWidth: "72%",
    alignSelf: "flex-start",
    backgroundColor: C.background,
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
  },
  mine: { alignSelf: "flex-end", backgroundColor: C.primary },
  bubbleText: { color: C.text, fontSize: 12, lineHeight: 18 },
  time: { marginTop: 4, color: C.textMuted, fontSize: 8, textAlign: "right" },
  composer: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 11,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  input: {
    flex: 1,
    minHeight: 43,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    color: C.text,
  },
  send: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

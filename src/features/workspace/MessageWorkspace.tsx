import { ConfirmAction } from "@/api/ApiUI";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest, type Page } from "@/api/platform";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { AppInput, AppTextArea, AppTag, AppSelect } from "@/components/form";
import { AppButton } from "@/components/ui/AppUI";
import { useAuth } from "@/auth/AuthProvider";
import { useWorkspace, type Attachment, type Room } from "./WorkspaceProvider";
import { saveAttachment } from "./attachments";
import { AttachmentView } from "./AttachmentView";
const format = (at: number) =>
  new Date(at).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
export default function MessageWorkspace({
  initialRoom,
  conversationOnly = false,
}: {
  conversationOnly?: boolean;
  initialRoom?: {
    kind: Room["kind"];
    id: string;
    company: string;
    title: string;
    roomId?: string;
  };
}) {
  const { width } = useWindowDimensions(),
    compact = width < 900;
  const { room: requested } = useLocalSearchParams<{ room?: string }>();
  const { user, token } = useAuth();
  const { rooms, ready, error, send, read, archive, openRoom, mockMode } =
    useWorkspace();
  const [kind, setKind] = useState<"all" | "company" | "job">("all"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("active"),
    [sort, setSort] = useState("new");
  const [selected, setSelected] = useState<string | null>(requested || null),
    [text, setText] = useState(""),
    [attachments, setAttachments] = useState<Attachment[]>([]),
    [busy, setBusy] = useState(false),
    [problem, setProblem] = useState("");
  const [editing, setEditing] = useState<{
    id: string;
    version: number;
  } | null>(null);
  const ownerRef = useRef(user?.id);
  ownerRef.current = user?.id;
  useEffect(() => {
    setText("");
    setAttachments([]);
    setProblem("");
    setSelected(requested || null);
    setEditing(null);
  }, [user?.id]);
  const [messagePage, setMessagePage] = useState(1);
  const messageData = useResource<
    Page<{
      id: string;
      text: string;
      attachments: Attachment[];
      createdAt: string;
      mine: boolean;
      version: number;
    }>
  >(
    selected
      ? `/rooms/${selected}/messages?page=${messagePage}&pageSize=20`
      : null,
    { items: [], total: 0, page: messagePage, pageSize: 20 },
    true,
  );
  useEffect(() => {
    setMessagePage(1);
  }, [selected]);
  useEffect(() => {
    if (!selected) return;
    const timer = setInterval(messageData.refresh, 10000);
    return () => clearInterval(timer);
  }, [selected, messageData.refresh]);
  const scroll = useRef<ScrollView>(null);
  const baseRoom = rooms.find((r) => r.id === selected);
  const room = baseRoom
    ? {
        ...baseRoom,
        messages: [...messageData.data.items]
          .reverse()
          .map((m) => ({
            ...m,
            at: Date.parse(m.createdAt),
            attachments: m.attachments.map((a) => ({
              ...a,
              uri: `/api/platform-data/attachments/${a.id}`,
            })),
          })),
      }
    : undefined;
  const change = (id: string | null) => {
    if (busy) return;
    setSelected(id);
    setText("");
    setAttachments([]);
    setProblem("");
    setEditing(null);
  };
  useEffect(() => {
    if (requested) change(requested);
  }, [requested]);
  useEffect(() => {
    let active = true;
    if (initialRoom?.roomId) {
      setSelected(initialRoom.roomId);
      return;
    }
    if (initialRoom && ready && token) {
      openRoom(
        initialRoom.kind,
        initialRoom.id,
        initialRoom.company,
        initialRoom.title,
      )
        .then((id) => {
          if (active) setSelected(id);
        })
        .catch((e) => {
          if (active) setProblem(e.message);
        });
    }
    return () => {
      active = false;
    };
  }, [initialRoom?.id, initialRoom?.roomId, token, ready]);
  useEffect(() => {
    if (selected && ready && room?.unread)
      void read(selected).catch((e) => setProblem(e.message));
  }, [selected, ready, room?.unread]);
  const latest = (r: Room) => r.messages.at(-1)?.at || r.createdAt;
  const visible = rooms
    .filter(
      (r) =>
        (kind === "all" || r.kind === kind) &&
        (filter === "all" || filter === "unread"
          ? filter !== "unread" || r.unread > 0
          : filter === "archived"
            ? r.archived
            : !r.archived) &&
        `${r.company} ${r.title}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.company.localeCompare(b.company, "ja")
        : sort === "old"
          ? latest(a) - latest(b)
          : latest(b) - latest(a),
    );
  async function attach() {
    if (busy || !room) return;
    const owner = user?.id;
    setBusy(true);
    setProblem("");
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        multiple: true,
        copyToCacheDirectory: true,
      });
      if (picked.canceled) return;
      const bytes =
        attachments.reduce((n, a) => n + a.size, 0) +
        picked.assets.reduce((n, a) => n + (a.size || 0), 0);
      if (
        attachments.length + picked.assets.length > 10 ||
        bytes > 200 * 1024 * 1024 ||
        picked.assets.some((a) => (a.size || 0) > 20 * 1024 * 1024)
      )
        throw new Error("添付は10件まで、1件20MBまでです。");
      const saved: Attachment[] = [];
      for (const asset of picked.assets)
        saved.push(await saveAttachment(asset, room.id, token!));
      if (ownerRef.current === owner)
        setAttachments((current) => [...current, ...saved]);
    } catch (e) {
      setProblem(
        e instanceof Error ? e.message : "ファイルを添付できませんでした。",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!user && !mockMode)
    return (
      <AppButton
        label="ログインしてメッセージを見る"
        onPress={() => router.push("/auth")}
      />
    );
  if (!ready) return <Text>{error || "読み込み中…"}</Text>;
  const chip = (label: string, active: boolean, onPress: () => void) => (
    <AppTag key={label} label={label} selected={active} onPress={onPress} />
  );
  return (
    <View style={{ gap: 10 }}>
      <Text style={s.notice}>
        メッセージはサーバーに保存されます。会話は10秒ごとに更新されます。
      </Text>
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <View
        style={[
          s.workspace,
          compact && { height: 660 },
          conversationOnly && { height: 510 },
        ]}
      >
        {!conversationOnly && (!compact || !room) && (
          <View style={[s.sidebar, compact && { width: "100%" }]}>
            <Text style={s.heading}>メッセージ一覧</Text>
            <View style={s.chips}>
              {chip("すべて", kind === "all", () => setKind("all"))}
              {chip("企業", kind === "company", () => setKind("company"))}
              {chip("案件", kind === "job", () => setKind("job"))}
            </View>
            <AppInput
              accessibilityLabel="企業名・案件名で検索"
              placeholder="企業名・案件名で検索"
              value={query}
              onChangeText={setQuery}
              style={s.input}
            />
            <View style={s.chips}>
              {(["active", "unread", "archived", "all"] as const).map(
                (value, i) =>
                  chip(
                    ["進行中", "未読", "アーカイブ", "全件"][i],
                    filter === value,
                    () => setFilter(value),
                  ),
              )}
            </View>
            <AppSelect
              accessibilityLabel="メッセージの並び替え"
              value={sort}
              onValueChange={setSort}
              options={[
                { value: "new", label: "更新が新しい順" },
                { value: "old", label: "古い順" },
                { value: "name", label: "企業名順" },
              ]}
            />
            <Text style={s.meta}>{visible.length}件</Text>
            <ScrollView>
              {visible.map((r) => (
                <Pressable
                  accessibilityRole="button"
                  key={r.id}
                  onPress={() => change(r.id)}
                  style={[
                    s.room,
                    selected === r.id && { backgroundColor: "#eaf2ff" },
                  ]}
                >
                  <View style={s.chips}>
                    <Text style={s.kind}>
                      {r.kind === "company" ? "企業" : "案件"}
                    </Text>
                    {r.unread > 0 && <Text style={s.unread}>{r.unread}</Text>}
                  </View>
                  <Text style={s.roomTitle}>{r.company}</Text>
                  <Text style={s.meta} numberOfLines={1}>
                    {r.title}
                  </Text>
                  <Text style={s.preview} numberOfLines={1}>
                    {r.messages.at(-1)?.text ||
                      r.messages.at(-1)?.attachments[0]?.name ||
                      "選択して会話を表示"}
                  </Text>
                  <Text style={s.meta}>{format(latest(r))}</Text>
                </Pressable>
              ))}
              {!visible.length && (
                <View style={s.empty}>
                  <Text>該当するメッセージはありません。</Text>
                  <Text style={s.meta}>
                    お気に入りの企業・案件から会話を開けます。
                  </Text>
                  <AppButton
                    label="お気に入りを開く"
                    outline
                    onPress={() => router.push("/favorites")}
                  />
                </View>
              )}
            </ScrollView>
          </View>
        )}
        {(conversationOnly || !compact || room) && (
          <View style={s.chat}>
            {!room ? (
              <View style={s.empty}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={44}
                  color="#2563eb"
                />
                <Text style={s.heading}>会話を選択してください</Text>
                <Text style={s.meta}>
                  左の一覧から選ぶと、ここにメッセージが表示されます。
                </Text>
              </View>
            ) : (
              <>
                <View style={s.chatHead}>
                  {compact && !conversationOnly && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="一覧に戻る"
                      onPress={() => change(null)}
                    >
                      <Ionicons name="arrow-back" size={24} />
                    </Pressable>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={s.roomTitle}>{room.company}</Text>
                    <Text style={s.meta}>{room.title}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      void archive(room.id).catch((e) => setProblem(e.message))
                    }
                  >
                    <Text style={s.link}>
                      {room.archived ? "再開する" : "アーカイブ"}
                    </Text>
                  </Pressable>
                </View>
                <ResourceStatus
                  loading={messageData.loading}
                  error={messageData.error}
                  onRetry={messageData.refresh}
                />
                <View style={{ flexDirection: "row", gap: 8, padding: 8 }}>
                  {messagePage > 1 && (
                    <AppButton
                      label="新しい20件"
                      outline
                      onPress={() => setMessagePage((p) => p - 1)}
                    />
                  )}
                  <Text>{messageData.data.total}件</Text>
                  {messagePage * 20 < messageData.data.total && (
                    <AppButton
                      label="以前の20件"
                      outline
                      onPress={() => setMessagePage((p) => p + 1)}
                    />
                  )}
                </View>
                <ScrollView
                  ref={scroll}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: 18, gap: 12 }}
                  onContentSizeChange={() =>
                    scroll.current?.scrollToEnd({ animated: true })
                  }
                >
                  {!room.messages.length && (
                    <Text style={s.meta}>
                      最初のメッセージを作成してください。
                    </Text>
                  )}
                  {room.messages.map((m) => (
                    <View key={m.id} style={[s.bubble, m.mine && s.mine]}>
                      {!!m.text && <Text style={s.message}>{m.text}</Text>}
                      {m.attachments.map((a) => (
                        <AttachmentView key={a.id} attachment={a} />
                      ))}
                      <Text style={s.meta}>{format(m.at)}</Text>
                      {m.mine && (
                        <View
                          style={{ flexDirection: "row", gap: 8, marginTop: 6 }}
                        >
                          <AppButton
                            label="編集"
                            outline
                            onPress={() => {
                              if (busy) return;
                              setEditing({ id: m.id, version: m.version });
                              setText(m.text);
                              setAttachments(m.attachments);
                              setProblem("");
                            }}
                          />
                          <ConfirmAction
                            label="削除"
                            danger
                            message="このメッセージを削除しますか？"
                            onConfirm={async () => {
                              await dataRequest(
                                `/rooms/${room.id}/messages/${m.id}?version=${m.version}`,
                                token,
                                undefined,
                                "DELETE",
                              );
                              if (editing?.id === m.id) {
                                setEditing(null);
                                setText("");
                                setAttachments([]);
                              }
                            }}
                          />
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
                <View style={s.composer}>
                  {editing && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text>メッセージを編集中</Text>
                      <AppButton
                        label="編集をやめる"
                        outline
                        onPress={() => {
                          if (!busy) {
                            setEditing(null);
                            setText("");
                            setAttachments([]);
                          }
                        }}
                      />
                    </View>
                  )}
                  {!!problem && (
                    <Text accessibilityRole="alert" style={s.error}>
                      {problem}
                    </Text>
                  )}
                  {attachments.length > 0 && (
                    <ScrollView
                      horizontal
                      contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
                    >
                      {attachments.map((a) => (
                        <View key={a.id} style={s.attachment}>
                          <Text numberOfLines={1} style={{ maxWidth: 160 }}>
                            {a.name}
                          </Text>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`${a.name}の添付を取り消す`}
                            onPress={() =>
                              setAttachments((v) =>
                                v.filter((x) => x.id !== a.id),
                              )
                            }
                          >
                            <Ionicons
                              name="close-circle"
                              size={22}
                              color="#64748b"
                            />
                          </Pressable>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                  <View style={s.composeRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="画像・動画・ファイルを添付"
                      disabled={busy}
                      onPress={() => void attach()}
                      style={s.icon}
                    >
                      {busy ? (
                        <ActivityIndicator />
                      ) : (
                        <Ionicons name="attach" size={26} color="#2563eb" />
                      )}
                    </Pressable>
                    <AppTextArea
                      accessibilityLabel="メッセージを入力"
                      placeholder="メッセージを入力"
                      value={text}
                      maxLength={8000}
                      onChangeText={setText}
                      style={[
                        s.input,
                        { flex: 1, minHeight: 44, maxHeight: 110 },
                      ]}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="メッセージを送信"
                      disabled={busy || (!text.trim() && !attachments.length)}
                      onPress={() => {
                        if (busy) return;
                        setBusy(true);
                        setProblem("");
                        const session = user?.id;
                        void (
                          editing
                            ? dataRequest(
                                `/rooms/${room.id}/messages/${editing.id}`,
                                token,
                                {
                                  text,
                                  attachmentIds: attachments.map((a) => a.id),
                                  version: editing.version,
                                },
                                "PUT",
                              )
                            : send(room.id, text, attachments)
                        )
                          .then(() => {
                            if (ownerRef.current === session) {
                              setText("");
                              setAttachments([]);
                              setEditing(null);
                              setMessagePage(1);
                            }
                          })
                          .catch((e) => setProblem(e.message))
                          .finally(() => setBusy(false));
                      }}
                      style={[
                        s.send,
                        (busy || (!text.trim() && !attachments.length)) && {
                          opacity: 0.4,
                        },
                      ]}
                    >
                      <Ionicons name="send" size={22} color="#fff" />
                    </Pressable>
                  </View>
                  <Text style={s.meta}>
                    画像・動画・PDF・CSVなど／10件まで・1件20MBまで
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  workspace: {
    height: 710,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#dde6f1",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  sidebar: {
    width: 330,
    padding: 16,
    gap: 12,
    borderRightWidth: 1,
    borderColor: "#dde6f1",
  },
  heading: { fontSize: 20, fontWeight: "800", color: "#10284b" },
  chips: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  chip: {
    backgroundColor: "#f0f4f8",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chipActive: { backgroundColor: "#2563eb" },
  input: { minHeight: 44 },
  meta: { fontSize: 11, color: "#64748b", lineHeight: 18 },
  room: {
    padding: 13,
    gap: 5,
    borderBottomWidth: 1,
    borderColor: "#e7edf4",
    borderRadius: 8,
  },
  roomTitle: { fontWeight: "800", fontSize: 14, color: "#10284b" },
  preview: { fontSize: 12, color: "#475569" },
  kind: {
    fontSize: 10,
    color: "#2563eb",
    backgroundColor: "#eaf2ff",
    padding: 3,
    borderRadius: 4,
  },
  unread: {
    color: "#fff",
    backgroundColor: "#2563eb",
    borderRadius: 20,
    paddingHorizontal: 6,
    fontSize: 11,
  },
  chat: { flex: 1, minWidth: 0 },
  empty: {
    padding: 25,
    gap: 18,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  chatHead: {
    minHeight: 78,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#dde6f1",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  link: { color: "#2563eb", fontSize: 12, fontWeight: "700" },
  bubble: {
    maxWidth: "88%",
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    gap: 8,
    alignSelf: "flex-start",
  },
  mine: { alignSelf: "flex-end", backgroundColor: "#eaf2ff" },
  message: { fontSize: 14, lineHeight: 22, color: "#162033" },
  composer: { borderTopWidth: 1, borderColor: "#dde6f1", padding: 12, gap: 6 },
  composeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: {
    width: 36,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  notice: {
    fontSize: 12,
    color: "#946200",
    backgroundColor: "#fff7df",
    padding: 12,
    borderRadius: 9,
    lineHeight: 20,
  },
  error: { color: "#b42318", fontSize: 12 },
});

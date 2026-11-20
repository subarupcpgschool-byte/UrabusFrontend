import { useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest, type Page } from "@/api/platform";
import { ConfirmAction, Pager } from "@/api/ApiUI";
import { AppInput, AppSelect, AppSwitch, AppTextArea } from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
export type Field = {
  key: string;
  label: string;
  kind?: "number" | "boolean" | "long" | "select";
  choices?: string[];
  optional?: boolean;
  initial?: string | number | boolean;
  max?: number;
};
type Row = { id: string; version: number; [key: string]: unknown };
export function ResourceEditor({
  path,
  readPath = path,
  title,
  fields,
}: {
  path: string;
  readPath?: string;
  title: string;
  fields: Field[];
}) {
  const { token } = useAuth();
  const [page, setPage] = useState(1),
    [draft, setDraft] = useState<Record<string, string | boolean> | null>(null),
    [editing, setEditing] = useState<Row | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const r = useResource<Page<Row> | Row[]>(
    token
      ? readPath +
          (readPath.includes("?") ? "&" : "?") +
          `page=${page}&pageSize=20`
      : null,
    [],
    true,
  );
  const rows = Array.isArray(r.data) ? r.data : r.data.items,
    total = Array.isArray(r.data) ? r.data.length : r.data.total;
  function edit(row: Row | null) {
    setEditing(row);
    setError("");
    setDraft(
      Object.fromEntries(
        fields.map((f) => [
          f.key,
          f.kind === "boolean"
            ? Boolean(row?.[f.key] ?? f.initial ?? false)
            : String(row?.[f.key] ?? f.initial ?? ""),
        ]),
      ),
    );
  }
  async function save() {
    if (!draft || busy) return;
    const body: Record<string, unknown> = { version: editing?.version ?? 0 };
    for (const f of fields) {
      const value = draft[f.key];
      if (f.kind === "number") {
        if (String(value).trim() === "" || !Number.isFinite(Number(value))) {
          setError(`${f.label}は数値で入力してください。`);
          return;
        }
        body[f.key] = Number(value);
      } else body[f.key] = value;
    }
    setBusy(true);
    setError("");
    try {
      await dataRequest(
        editing ? `${path}/${editing.id}` : path,
        token,
        body,
        editing ? "PUT" : "POST",
      );
      setDraft(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel>
      <SectionTitle>{title}</SectionTitle>
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      {token && !r.error && (
        <AppButton label="作成＋" onPress={() => edit(null)} />
      )}
      <Pager page={page} total={total} onChange={setPage} />
      {rows.map((row) => (
        <Panel key={row.id}>
          <SectionTitle>
            {String(row.name || row.label || row.service || title)}
          </SectionTitle>
          {fields
            .filter((f) => f.kind !== "long")
            .map((f) => (
              <BodyText key={f.key}>
                {f.label}：
                {f.kind === "boolean"
                  ? row[f.key]
                    ? "有効"
                    : "無効"
                  : String(row[f.key] ?? "未設定")}
              </BodyText>
            ))}
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <AppButton label="編集" outline onPress={() => edit(row)} />
            <ConfirmAction
              label="削除"
              danger
              message="このデータを削除しますか？"
              onConfirm={() =>
                dataRequest(
                  `${path}/${row.id}?version=${row.version}`,
                  token,
                  undefined,
                  "DELETE",
                )
              }
            />
          </View>
        </Panel>
      ))}
      {!r.loading && !r.error && !rows.length && (
        <BodyText>登録データはありません。</BodyText>
      )}
      <Modal
        transparent
        visible={!!draft}
        onRequestClose={() => {
          if (!busy) setDraft(null);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <ScrollView
            style={{
              width: "100%",
              maxWidth: 660,
              maxHeight: "90%",
              flexGrow: 0,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {draft && (
              <Panel>
                <SectionTitle>
                  {title}を{editing ? "編集" : "作成"}
                </SectionTitle>
                {fields.map((f) =>
                  f.kind === "boolean" ? (
                    <View key={f.key}>
                      <Text>{f.label}</Text>
                      <AppSwitch
                        accessibilityLabel={f.label}
                        value={Boolean(draft[f.key])}
                        disabled={busy}
                        onValueChange={(v) =>
                          setDraft((s) => (s ? { ...s, [f.key]: v } : s))
                        }
                      />
                    </View>
                  ) : f.kind === "select" ? (
                    <AppSelect
                      key={f.key}
                      label={f.label}
                      value={String(draft[f.key])}
                      onValueChange={(v) =>
                        setDraft((s) => (s ? { ...s, [f.key]: v } : s))
                      }
                      options={(f.choices || []).map((v) => ({
                        value: v,
                        label: v,
                      }))}
                      disabled={busy}
                    />
                  ) : f.kind === "long" ? (
                    <AppTextArea
                      key={f.key}
                      label={f.label}
                      value={String(draft[f.key])}
                      onChangeText={(v) =>
                        setDraft((s) => (s ? { ...s, [f.key]: v } : s))
                      }
                      maxLength={f.max || 2000}
                      disabled={busy}
                    />
                  ) : (
                    <AppInput
                      key={f.key}
                      label={f.label}
                      value={String(draft[f.key])}
                      onChangeText={(v) =>
                        setDraft((s) => (s ? { ...s, [f.key]: v } : s))
                      }
                      keyboardType={
                        f.kind === "number" ? "decimal-pad" : "default"
                      }
                      maxLength={f.max || 120}
                      disabled={busy}
                    />
                  ),
                )}
                {!!error && (
                  <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                    {error}
                  </Text>
                )}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <AppButton
                    label="キャンセル"
                    outline
                    onPress={() => {
                      if (!busy) setDraft(null);
                    }}
                  />
                  <AppButton
                    label={busy ? "保存中…" : "保存"}
                    onPress={() => void save()}
                  />
                </View>
              </Panel>
            )}
          </ScrollView>
        </View>
      </Modal>
    </Panel>
  );
}
export const ruleFields: Field[] = [
  { key: "name", label: "ルール名" },
  { key: "metric", label: "監視項目" },
  { key: "windowMinutes", label: "集計期間（分）", kind: "number", initial: 5 },
  { key: "threshold", label: "しきい値", kind: "number", initial: 5 },
  { key: "unit", label: "単位", initial: "件" },
  {
    key: "severity",
    label: "重要度",
    kind: "select",
    choices: ["高", "中", "低"],
    initial: "中",
  },
  { key: "enabled", label: "有効", kind: "boolean", initial: true },
];
export const alarmFields: Field[] = [
  { key: "service", label: "サービス" },
  { key: "message", label: "内容", kind: "long" },
  {
    key: "severity",
    label: "重要度",
    kind: "select",
    choices: ["高", "中", "低"],
    initial: "中",
  },
  {
    key: "status",
    label: "対応状況",
    kind: "select",
    choices: ["未対応", "対応中", "解決済み"],
    initial: "未対応",
  },
];
export const metricFields: Field[] = [
  { key: "service", label: "サービス" },
  { key: "metric", label: "計測項目" },
  { key: "value", label: "計測値", kind: "number", initial: 0 },
];

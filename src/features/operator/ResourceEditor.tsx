import { translateText } from "@/i18n/display";
import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState } from "react";
import { Modal, ScrollView, View } from "react-native";
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
  "use no memo";
  useLocaleVersion();
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
          setError(sourceFormat("enterAsANumber", { v0: f.label }, []));
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
        <AppButton label={tText("create")} onPress={() => edit(null)} />
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
                    ? sourceText("enabled")
                    : sourceText("disabled")
                  : String(row[f.key] ?? sourceText("notConfigured"))}
              </BodyText>
            ))}
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <AppButton
              label={tText("edit")}
              outline
              onPress={() => edit(row)}
            />
            <ConfirmAction
              label={tText("delete")}
              danger
              message={tText("deleteThisData")}
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
        <BodyText>{tText("noDataHasBeenRegistered")}</BodyText>
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
                  {title}
                  {tText("honorific_1227")}
                  {editing ? sourceText("edit") : sourceText("create_354")}
                </SectionTitle>
                {fields.map((f) =>
                  f.kind === "boolean" ? (
                    <View key={f.key}>
                      <Text>{f.label}</Text>
                      <AppSwitch
                        accessibilityLabel={translateText(f.label)}
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
                    label={tText("cancel")}
                    outline
                    onPress={() => {
                      if (!busy) setDraft(null);
                    }}
                  />
                  <AppButton
                    label={busy ? sourceText("saving") : sourceText("save_384")}
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
  { key: "name", label: sourceText("ruleName") },
  { key: "metric", label: sourceText("metric_1229") },
  {
    key: "windowMinutes",
    label: sourceText("windowMinutes"),
    kind: "number",
    initial: 5,
  },
  {
    key: "threshold",
    label: sourceText("threshold"),
    kind: "number",
    initial: 5,
  },
  { key: "unit", label: sourceText("unit"), initial: sourceText("total_199") },
  {
    key: "severity",
    label: sourceText("severity"),
    kind: "select",
    choices: [sourceText("high"), sourceText("medium"), sourceText("low")],
    initial: sourceText("medium"),
  },
  {
    key: "enabled",
    label: sourceText("enabled"),
    kind: "boolean",
    initial: true,
  },
];
export const alarmFields: Field[] = [
  { key: "service", label: sourceText("services") },
  { key: "message", label: sourceText("content"), kind: "long" },
  {
    key: "severity",
    label: sourceText("severity"),
    kind: "select",
    choices: [sourceText("high"), sourceText("medium"), sourceText("low")],
    initial: sourceText("medium"),
  },
  {
    key: "status",
    label: sourceText("responseStatus"),
    kind: "select",
    choices: [
      sourceText("unhandled"),
      sourceText("inProgress"),
      sourceText("resolved"),
    ],
    initial: sourceText("unhandled"),
  },
];
export const metricFields: Field[] = [
  { key: "service", label: sourceText("services") },
  { key: "metric", label: sourceText("metric") },
  {
    key: "value",
    label: sourceText("measuredValue"),
    kind: "number",
    initial: 0,
  },
];

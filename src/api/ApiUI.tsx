import { useState, type ReactNode } from "react";
import { Modal, View, Text } from "react-native";
import { AppButton, Panel } from "@/components/ui/AppUI";
export function ConfirmAction({
  label,
  message,
  onConfirm,
  danger = false,
}: {
  label: string;
  message: string;
  onConfirm: () => Promise<unknown>;
  danger?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <>
      <AppButton
        label={label}
        danger={danger}
        outline={!danger}
        onPress={() => {
          setError("");
          setOpen(true);
        }}
      />
      <Modal
        transparent
        visible={open}
        onRequestClose={() => {
          if (!busy) setOpen(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,.4)",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Panel style={{ width: "100%", maxWidth: 480 }}>
            <Text>{message}</Text>
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
                  if (!busy) setOpen(false);
                }}
              />
              <AppButton
                label={busy ? "処理中…" : "実行する"}
                danger={danger}
                onPress={() => {
                  if (busy) return;
                  setBusy(true);
                  void onConfirm()
                    .then(() => setOpen(false))
                    .catch((e) =>
                      setError(
                        e instanceof Error
                          ? e.message
                          : "処理できませんでした。",
                      ),
                    )
                    .finally(() => setBusy(false));
                }}
              />
            </View>
          </Panel>
        </View>
      </Modal>
    </>
  );
}
export function Pager({
  page,
  total,
  pageSize = 20,
  onChange,
}: {
  page: number;
  total: number;
  pageSize?: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
      }}
    >
      {page > 1 && (
        <AppButton label="前へ" outline onPress={() => onChange(page - 1)} />
      )}
      <Text>
        {page} / {pages}ページ（{total}件）
      </Text>
      {page < pages && (
        <AppButton label="次へ" outline onPress={() => onChange(page + 1)} />
      )}
    </View>
  );
}

import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState, type ReactNode } from "react";
import { Modal, View } from "react-native";
import { AppButton, Panel } from "@/components/ui/AppUI";
export function ConfirmAction({
  label,
  message,
  onConfirm,
  danger = false,
  ButtonComponent = AppButton,
}: {
  label: string;
  message: string;
  onConfirm: () => Promise<unknown>;
  danger?: boolean;
  ButtonComponent?: typeof AppButton;
}) {
  "use no memo";
  useLocaleVersion();
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <>
      <ButtonComponent
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
              <ButtonComponent
                label={tText("cancel")}
                outline
                onPress={() => {
                  if (!busy) setOpen(false);
                }}
              />
              <ButtonComponent
                label={busy ? sourceText("processing") : sourceText("confirm")}
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
                          : sourceText("unableToCompleteTheAction"),
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
  "use no memo";
  useLocaleVersion();
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
        <AppButton
          label={tText("previous")}
          outline
          onPress={() => onChange(page - 1)}
        />
      )}
      <Text>
        {page} / {pages}
        {tText("pageS")}
        {total}
        {tText("total")}
      </Text>
      {page < pages && (
        <AppButton
          label={tText("next")}
          outline
          onPress={() => onChange(page + 1)}
        />
      )}
    </View>
  );
}

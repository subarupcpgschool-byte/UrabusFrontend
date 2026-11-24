import { useState, type ReactNode } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { Text, Pressable } from "@/i18n/native";
import { tText } from "@/i18n/display";
import { SectionTitle } from "@/components/ui/AppUI";
export const hs = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  split: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  left: { width: 310, gap: 10 },
  right: { flex: 1, minWidth: 0, gap: 14 },
  card: { padding: 18, gap: 14 },
  notice: { color: "#166534", fontSize: 13 },
  error: { color: "#B42318", fontSize: 13 },
  muted: { color: "#64748B", fontSize: 12, lineHeight: 20 },
  item: {
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "#DBE5F2",
    borderRadius: 12,
    backgroundColor: "white",
  },
  selected: { backgroundColor: "#EAF2FF", borderColor: "#72A7F8" },
  field: { minWidth: 150, flex: 1 },
  preview: {
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: "#DBE5F2",
    borderRadius: 12,
    backgroundColor: "#F8FAFD",
  },
});
export function useHrAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const run = async (fn: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      setNotice(tText("hrDone"));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : tText("unableToCompleteTheAction"),
      );
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, notice, run };
}
export function ActionStatus({
  error,
  notice,
}: {
  error: string;
  notice: string;
}) {
  return (
    <>
      {!!error && (
        <Text accessibilityRole="alert" style={hs.error}>
          {error}
        </Text>
      )}
      {!!notice && (
        <Text accessibilityLiveRegion="polite" style={hs.notice}>
          {notice}
        </Text>
      )}
    </>
  );
}
export function HrModal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
          backgroundColor: "rgba(19,40,64,.35)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 780,
            maxHeight: "90%",
            padding: 20,
            borderRadius: 18,
            gap: 16,
            backgroundColor: "white",
          }}
        >
          <View style={hs.row}>
            <SectionTitle>{title}</SectionTitle>
            <View style={{ flex: 1 }} />
            <AppButton outline label={tText("close")} onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
export const kindLabel = (kind: string) =>
  tText(
    kind === "RESUME"
      ? "hrResume"
      : kind === "CAREER"
        ? "hrCareer"
        : kind === "WITHHOLDING"
          ? "hrTax"
          : "hrContract",
  );

export function HrButton({
  label,
  onPress,
  disabled = false,
  outline = false,
  danger = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        alignSelf: "flex-start",
        flexGrow: 0,
        minHeight: 36,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: danger ? "#D9384F" : "#2563EB",
        backgroundColor: danger ? "#D9384F" : outline ? "white" : "#2563EB",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: outline && !danger ? "#2563EB" : "white",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
const AppButton = HrButton;

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Modal,
  ScrollView,
  View,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Text, Pressable } from "@/i18n/native";
import { tText, useLocaleVersion } from "@/i18n/display";
import { useAuth } from "@/auth/AuthProvider";
import { API_BASE } from "@/auth/api";
import { dataRequest } from "@/api/platform";
import { AppInput, AppTextArea, AppSelect, AppSwitch } from "@/components/form";
import { SectionTitle, BodyText } from "@/components/ui/AppUI";
import { HrButton, hs } from "./shared";
import { MAIL_RESULTS, type MailResult, type MailSetDraft } from "./models";
export const freshMailSet = (): MailSetDraft => ({
  version: 0,
  name: "",
  recruitmentId: null,
  recruitmentKind: "*",
  employmentType: "*",
  enabled: true,
  entries: MAIL_RESULTS.map((result) => ({
    result,
    version: 0,
    subject: "",
    body: "",
  })),
});
export const completeMailSet = (s: MailSetDraft): MailSetDraft => ({
  ...s,
  entries: MAIL_RESULTS.map(
    (result) =>
      s.entries.find((e) => e.result === result) || {
        result,
        version: 0,
        subject: "",
        body: "",
      },
  ),
});
const variableNames = [
  "company.name",
  "company.email",
  "company.address",
  "user.name",
  "user.email",
  "job.title",
  "job.salary",
  "job.location",
  "job.employment",
  "job.kind",
  "result",
];
export const mailResultLabel = (value: MailResult) =>
  tText(
    value === "内定"
      ? "jobOffer"
      : value === "不採用"
        ? "notSelected"
        : value === "見送り"
          ? "notProceeding"
          : value === "内定辞退"
            ? "offerDeclined"
            : "offerWithdrawn",
  );
export function MailTemplateEditor({
  initial,
  jobs,
  employment,
  canWrite,
  canDelete,
  applicants,
  initialApplicant,
  onClose,
  onSaved,
}: {
  initial: MailSetDraft;
  jobs: { id: string; title: string }[];
  employment: { value: string; label: string }[];
  canWrite: boolean;
  canDelete: boolean;
  applicants: { id: string; name: string; title: string }[];
  initialApplicant: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const { width, height } = useWindowDimensions();
  const [form, setForm] = useState(() => completeMailSet(initial)),
    [tab, setTab] = useState<MailResult>(MAIL_RESULTS[0]),
    [applicant, setApplicant] = useState(initialApplicant),
    [preview, setPreview] = useState<{ subject: string; body: string } | null>(
      null,
    ),
    [previewError, setPreviewError] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [discard, setDiscard] = useState(false),
    [confirm, setConfirm] = useState(false);
  const busyRef = useRef(false),
    baseline = useRef(JSON.stringify(completeMailSet(initial)));
  const entry = form.entries.find((e) => e.result === tab)!;
  const currentValid = !!entry.subject.trim() && !!entry.body.trim();
  const dirty = JSON.stringify(form) !== baseline.current;
  const field = (key: keyof MailSetDraft, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));
  const text = (key: "subject" | "body", value: string) =>
    setForm((f) => ({
      ...f,
      entries: f.entries.map((e) =>
        e.result === tab ? { ...e, [key]: value } : e,
      ),
    }));
  const requestClose = () => {
    if (busyRef.current) return;
    if (discard) {
      setDiscard(false);
      return;
    }
    if (confirm) {
      setConfirm(false);
      return;
    }
    if (dirty) setDiscard(true);
    else onClose();
  };
  useEffect(() => {
    if (!currentValid) {
      setPreview(null);
      setPreviewError("");
      return;
    }
    const controller = new AbortController();
    let active = true;
    setPreview(null);
    setPreviewError("");
    const timer = setTimeout(() => {
      fetch(`${API_BASE}/api/platform-data/company-mail/preview`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: entry.subject,
          body: entry.body,
          result: tab,
          interactionId: applicant,
        }),
        signal: controller.signal,
      })
        .then(async (r) => {
          const v = await r.json();
          if (!r.ok) throw Error(v.message || tText("unableToLoad"));
          if (active) setPreview(v);
        })
        .catch((e) => {
          if (active && e.name !== "AbortError") setPreviewError(e.message);
        });
    }, 300);
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [entry.subject, entry.body, tab, token, currentValid, applicant]);
  const prepareSave = () => {
    setError("");
    if (!form.name.trim()) {
      setError(tText("mtNameRequired"));
      return;
    }
    const partial = form.entries.find(
      (e) => !!e.subject.trim() !== !!e.body.trim(),
    );
    if (partial) {
      setTab(partial.result);
      setError(tText("mtPartial", { result: mailResultLabel(partial.result) }));
      return;
    }
    const removed = form.entries.filter(
      (e) => e.id && !e.subject.trim() && !e.body.trim(),
    ).length;
    if (removed && !canDelete) {
      setError(tText("mtDeletePermission"));
      return;
    }
    if (
      !form.id &&
      !form.entries.some((e) => e.subject.trim() && e.body.trim())
    ) {
      setError(tText("mtOneRequired"));
      return;
    }
    setConfirm(true);
  };
  const save = async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      await dataRequest(
        "/company-mail/sets" + (form.id ? "/" + form.id : ""),
        token,
        form,
        form.id ? "PUT" : "POST",
      );
      onSaved();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : tText("unableToCompleteTheAction"),
      );
      setConfirm(false);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  const choiceStyle = { minWidth: 170, flex: 1 };
  const removed = form.entries.filter(
    (e) => e.id && !e.subject.trim() && !e.body.trim(),
  ).length;
  return (
    <>
      <Modal
        visible
        transparent
        animationType="fade"
        onRequestClose={requestClose}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(19,40,64,.4)",
            padding: width < 600 ? 8 : 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            accessibilityViewIsModal
            accessibilityElementsHidden={discard || confirm}
            importantForAccessibility={
              discard || confirm ? "no-hide-descendants" : "auto"
            }
            pointerEvents={discard || confirm ? "none" : "auto"}
            style={{
              width: "100%",
              maxWidth: 1400,
              maxHeight: height - (width < 600 ? 16 : 40),
              backgroundColor: "white",
              borderRadius: 18,
              overflow: "hidden",
            }}
          >
            <View
              style={[
                hs.row,
                { padding: 16, borderBottomWidth: 1, borderColor: "#E2E8F0" },
              ]}
            >
              <SectionTitle>
                {tText(initial.id ? "mtEdit" : "mtCreate")}
              </SectionTitle>
              <View style={{ flex: 1 }} />
              {canWrite && (
                <HrButton
                  label={tText("hrSave")}
                  disabled={busy}
                  onPress={prepareSave}
                />
              )}
              <HrButton
                outline
                label={tText("close")}
                disabled={busy}
                onPress={requestClose}
              />
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 18, gap: 16 }}
            >
              <View style={hs.row}>
                <View style={choiceStyle}>
                  <AppInput
                    editable={canWrite && !busy}
                    label={tText("hrTemplateName")}
                    value={form.name}
                    onChangeText={(v) => field("name", v)}
                  />
                </View>
                <View style={choiceStyle}>
                  <AppSelect
                    disabled={!canWrite || busy}
                    label={tText("hrTargetJob")}
                    value={form.recruitmentId || ""}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        recruitmentId: v || null,
                        ...(v
                          ? { recruitmentKind: "*", employmentType: "*" }
                          : {}),
                      }))
                    }
                    options={[
                      { value: "", label: tText("hrNoJobScope") },
                      ...jobs.map((j) => ({ value: j.id, label: j.title })),
                    ]}
                  />
                </View>
                <View style={choiceStyle}>
                  <AppSelect
                    disabled={!canWrite || busy || !!form.recruitmentId}
                    label={tText("hrRecruitmentKind")}
                    value={form.recruitmentKind}
                    onValueChange={(v) => field("recruitmentKind", v)}
                    options={[
                      { value: "*", label: tText("hrAll") },
                      { value: "JOB", label: tText("hrJob") },
                      {
                        value: "COMPANY_RECRUITMENT",
                        label: tText("hrCompanyRecruitment"),
                      },
                    ]}
                  />
                </View>
                <View style={choiceStyle}>
                  <AppSelect
                    disabled={!canWrite || busy || !!form.recruitmentId}
                    label={tText("hrEmploymentType")}
                    value={form.employmentType}
                    onValueChange={(v) => field("employmentType", v)}
                    options={[
                      { value: "*", label: tText("hrAll") },
                      ...employment,
                    ]}
                  />
                </View>
                <View style={{ gap: 8, alignItems: "center" }}>
                  <Text>{tText("hrEnabled")}</Text>
                  <AppSwitch
                    disabled={!canWrite || busy}
                    accessibilityLabel={tText("hrEnabled")}
                    value={form.enabled}
                    onValueChange={(v) => field("enabled", v)}
                  />
                </View>
              </View>
              {!!error && (
                <Text accessibilityRole="alert" style={hs.error}>
                  {error}
                </Text>
              )}
              <BodyText>{tText("mtBlankNote")}</BodyText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {MAIL_RESULTS.map((result) => {
                  const e = form.entries.find((e) => e.result === result)!;
                  return (
                    <Pressable
                      key={result}
                      accessibilityRole="tab"
                      accessibilityLabel={mailResultLabel(result)}
                      accessibilityState={{ selected: result === tab }}
                      onPress={() => {
                        setTab(result);
                        setError("");
                      }}
                      style={{
                        padding: 12,
                        gap: 4,
                        borderRadius: 9,
                        backgroundColor: result === tab ? "#EAF2FF" : "#F8FAFC",
                        borderWidth: 1,
                        borderColor: result === tab ? "#2563EB" : "#E2E8F0",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "700",
                          color: result === tab ? "#2563EB" : "#334155",
                        }}
                      >
                        {mailResultLabel(result)}
                      </Text>
                      <Text style={hs.muted}>
                        {tText(
                          e.subject.trim() && e.body.trim()
                            ? "mtConfigured"
                            : "mtNotConfigured",
                        )}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View
                style={
                  width >= 1000
                    ? {
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 20,
                      }
                    : { gap: 20 }
                }
              >
                <View style={{ flex: 1, minWidth: 0, gap: 12 }}>
                  <SectionTitle>
                    {mailResultLabel(tab)} ／ {tText("hrEdit")}
                  </SectionTitle>
                  <AppInput
                    editable={canWrite && !busy}
                    label={tText("hrSubject")}
                    value={entry.subject}
                    onChangeText={(v) => text("subject", v)}
                    maxLength={200}
                  />
                  <AppTextArea
                    editable={canWrite && !busy}
                    label={tText("hrBody")}
                    value={entry.body}
                    onChangeText={(v) => text("body", v)}
                    numberOfLines={10}
                    maxLength={30000}
                  />
                  <BodyText>{tText("hrTemplateFormat")}</BodyText>
                  <Text selectable localize={false} style={hs.muted}>
                    {variableNames.map((v) => `{{${v}}}`).join("　")}
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 12 }}>
                  <SectionTitle>{tText("hrPreview")}</SectionTitle>
                  <AppSelect
                    label={tText("hrPreviewApplicant")}
                    value={applicant}
                    onValueChange={setApplicant}
                    options={[
                      { value: "", label: tText("hrSample") },
                      ...applicants.map((i) => ({
                        value: i.id,
                        label: i.name + " / " + i.title,
                      })),
                    ]}
                  />
                  {!!previewError && (
                    <Text accessibilityRole="alert" style={hs.error}>
                      {previewError}
                    </Text>
                  )}
                  {preview ? (
                    <View style={hs.preview}>
                      <Text localize={false} style={{ fontWeight: "700" }}>
                        {preview.subject}
                      </Text>
                      <Text localize={false} style={{ lineHeight: 23 }}>
                        {preview.body}
                      </Text>
                    </View>
                  ) : (
                    <View style={hs.preview}>
                      <BodyText>
                        {tText(currentValid ? "loading" : "mtPreviewEmpty")}
                      </BodyText>
                    </View>
                  )}
                  <BodyText>{tText("hrForwardNote")}</BodyText>
                </View>
              </View>
            </ScrollView>
          </View>
          {discard && (
            <EditorPrompt title={tText("mtDiscardTitle")}>
              <View style={{ gap: 16 }}>
                <BodyText>{tText("mtDiscardMessage")}</BodyText>
                <View style={hs.row}>
                  <HrButton
                    outline
                    label={tText("cancel")}
                    onPress={() => setDiscard(false)}
                  />
                  <HrButton
                    danger
                    label={tText("mtDiscard")}
                    onPress={onClose}
                  />
                </View>
              </View>
            </EditorPrompt>
          )}
          {confirm && (
            <EditorPrompt title={tText("hrSave")}>
              <View style={{ gap: 16 }}>
                <BodyText>
                  {tText("mtSaveConfirm", {
                    count: form.entries.filter(
                      (e) => e.subject.trim() && e.body.trim(),
                    ).length,
                    removed,
                  })}
                </BodyText>
                <View style={hs.row}>
                  <HrButton
                    outline
                    label={tText("cancel")}
                    disabled={busy}
                    onPress={() => setConfirm(false)}
                  />
                  <HrButton
                    label={tText(busy ? "processing" : "confirm")}
                    disabled={busy}
                    onPress={() => void save()}
                  />
                </View>
              </View>
            </EditorPrompt>
          )}
        </View>
      </Modal>
    </>
  );
}

function EditorPrompt({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = document.querySelector('[data-testid="mail-editor-prompt"]');
    const buttons = () =>
      Array.from(
        node?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ||
          [],
      );
    buttons()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const list = buttons();
      if (!list.length) return;
      const first = list[0],
        last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    node?.addEventListener("keydown", trap as EventListener);
    return () => node?.removeEventListener("keydown", trap as EventListener);
  }, []);
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "rgba(19,40,64,.4)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
      }}
    >
      <View
        testID="mail-editor-prompt"
        accessibilityViewIsModal
        style={{
          width: "100%",
          maxWidth: 520,
          padding: 20,
          gap: 16,
          borderRadius: 16,
          backgroundColor: "white",
        }}
      >
        <SectionTitle>{title}</SectionTitle>
        {children}
      </View>
    </View>
  );
}

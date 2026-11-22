import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion, localeTag } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { ConfirmAction } from "@/api/ApiUI";
import { useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { AppSelect, AppTextArea } from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
import type { Application } from "@/features/applications/data";
import { useEvaluations } from "./EvaluationProvider";
import {
  canEvaluate,
  calculateTotal,
  eligibleStatus,
  deadlineFor,
  emptyDraft,
  ratingLabel,
  validateDraft,
  type EvaluationDraft,
} from "./model";

const groups = [
  {
    key: "response" as const,
    label: sourceText("communication_1168"),
    prompt: sourceText("howWereTheLanguageAndAttitude"),
    options: [
      sourceText("politeLanguageAndAKindTone"),
      sourceText("standardCommunication"),
      sourceText("rudeOrIntimidatingLanguage"),
      sourceText("other"),
    ],
  },
  {
    key: "description" as const,
    label: sourceText("jobExplanation"),
    prompt: sourceText("wereTheExplanationAndCompanyNameAccurate"),
    options: [
      sourceText("theExplanationAndCompanyNameWereAccurate"),
      sourceText("someDutiesOrTermsDiffered"),
      sourceText("theClientCompanyDifferedFromTheExplanation"),
      sourceText("other"),
    ],
  },
  {
    key: "work" as const,
    label: sourceText("workExperienceOptional"),
    prompt: sourceText("howWereTheActualWorkResponseSpeed"),
    options: [
      sourceText("theWorkMatchedTheExplanationAndResponses"),
      sourceText("someDifferencesExisted"),
      sourceText("thereWereIssuesWithTheWorkOr"),
      sourceText("iHaveNotStartedWorkingYet"),
      sourceText("other"),
    ],
  },
];
const scores = [
  { label: sourceText("notSelected_600"), value: "0" },
  ...Array.from({ length: 9 }, (_, i) => {
    const n = 1 + i * 0.5;
    return { label: `${n.toFixed(1)} / 5.0`, value: String(n) };
  }),
];
const date = (iso: string) =>
  new Date(iso).toLocaleDateString(localeTag(), { timeZone: "Asia/Tokyo" });
export function EvaluationForm({
  application,
  onComplete,
  onCancel,
  editing = false,
}: {
  editing?: boolean;
  application: Application;
  onComplete?: () => void;
  onCancel?: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  const { submit, records, now, ready } = useEvaluations();
  const [draft, setDraft] = useState(
      () =>
        records.find((r) => r.applicationId === application.id)?.answers ??
        emptyDraft(),
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const existing = records.find((r) => r.applicationId === application.id);
  const available =
    ready &&
    (editing
      ? eligibleStatus(application) &&
        !!deadlineFor(application) &&
        now < Date.parse(deadlineFor(application)!)
      : canEvaluate(application, existing, now));
  function change(
    key: keyof EvaluationDraft,
    field: "score" | "choices" | "comment",
    value: number | string[] | string,
  ) {
    setDraft((old) => ({ ...old, [key]: { ...old[key], [field]: value } }));
    setError("");
  }
  async function send() {
    if (busy || !available) return;
    const problem = validateDraft(draft);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await submit(application.id, draft);
      onComplete?.();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : sourceText("unableToSaveTheReview"),
      );
    } finally {
      setBusy(false);
    }
  }
  const deadline = deadlineFor(application);
  return (
    <Panel>
      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <SectionTitle>{tText("reviewACompanyOrOpportunity")}</SectionTitle>
          <Text localize={false} style={s.meta}>
            {application.company} ／ {application.title}
          </Text>
        </View>
        {onCancel && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={tText("closeReview")}
            disabled={busy}
            onPress={onCancel}
            style={s.close}
          >
            <Text>×</Text>
          </Pressable>
        )}
      </View>
      <Text style={s.meta}>{tText("50Outstanding40Excellent3")}</Text>
      {deadline && (
        <Text style={s.meta}>
          {tText("reviewDeadline")}
          {date(deadline)}
          {tText("3MonthsAfterTheJobOffer")}
        </Text>
      )}
      <Text style={s.info}>
        {tText("provideScoresAndEitherAQuestionnaireAnswer")}
      </Text>
      {groups.map((g) => (
        <View key={g.key} style={s.group}>
          <Text style={s.label}>{g.label}</Text>
          <Text style={s.meta}>{g.prompt}</Text>
          <AppSelect
            label={sourceFormat("score", { v0: g.label }, [])}
            value={String(draft[g.key].score)}
            onValueChange={(v) => change(g.key, "score", Number(v))}
            options={scores}
            disabled={busy || !available}
          />
          <AppSelect
            label={sourceFormat("questionnaire", { v0: g.label }, [])}
            value={draft[g.key].choices[0] ?? ""}
            onValueChange={(v) => change(g.key, "choices", v ? [v] : [])}
            options={[
              { label: sourceText("selectAnOption"), value: "" },
              ...g.options.map((value) => ({ value, label: value })),
            ]}
            disabled={busy || !available}
          />
          <AppTextArea
            label={sourceFormat("commentOptional", { v0: g.label }, [])}
            value={draft[g.key].comment}
            onChangeText={(v) => change(g.key, "comment", v)}
            maxLength={2000}
            disabled={busy || !available}
          />
        </View>
      ))}
      {draft.response.score > 0 && draft.description.score > 0 && (
        <Text style={s.total}>
          {tText("overallRating_1194")}
          {calculateTotal(draft).toFixed(1)} / 5.0
        </Text>
      )}
      <Text style={s.meta}>{tText("theReviewIsSentToTheServer")}</Text>
      {!available && (
        <Text style={s.error}>{tText("thisItemHasAlreadyBeenReviewedIs")}</Text>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <View style={s.row}>
        {onCancel && (
          <AppButton
            label={tText("close")}
            outline
            onPress={() => {
              if (!busy) onCancel();
            }}
          />
        )}
        <AppButton
          label={busy ? sourceText("saving") : sourceText("submitReview")}
          onPress={() => void send()}
        />
      </View>
    </Panel>
  );
}

export function EvaluationModal({
  application,
  visible,
  onClose,
}: {
  application: Application;
  visible: boolean;
  onClose: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={s.overlay}>
        <ScrollView
          style={s.modal}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 2 }}
        >
          <EvaluationForm
            application={application}
            onComplete={onClose}
            onCancel={onClose}
          />
        </ScrollView>
      </View>
    </Modal>
  );
}

export function EvaluationDetail({
  application,
}: {
  application: Application | undefined;
}) {
  "use no memo";
  useLocaleVersion();
  const { records, ready, error, now, remove } = useEvaluations();
  const [editing, setEditing] = useState(false);
  if (!application)
    return (
      <Panel>
        <View style={s.empty}>
          <SectionTitle>{tText("reviewContentAppearsHere")}</SectionTitle>
          <BodyText>{tText("selectAnInteractionFromTheListOn")}</BodyText>
        </View>
      </Panel>
    );
  const record = records.find((r) => r.applicationId === application.id),
    deadline = deadlineFor(application);
  if (editing)
    return (
      <EvaluationForm
        key={application.id}
        application={application}
        editing
        onCancel={() => setEditing(false)}
        onComplete={() => setEditing(false)}
      />
    );
  if (ready && canEvaluate(application, record, now))
    return <EvaluationForm key={application.id} application={application} />;
  return (
    <View style={{ gap: 14 }}>
      <Panel>
        <SectionTitle localize={false}>{application.company}</SectionTitle>
        <BodyText localize={false}>{application.title}</BodyText>
        {!ready ? (
          <BodyText>{error || sourceText("loadingReview")}</BodyText>
        ) : record ? (
          <>
            <Text style={s.total}>
              {record.total.toFixed(1)} / 5.0　{ratingLabel(record.total)}
            </Text>
            <Text style={s.info}>
              {record.mode === "automatic"
                ? sourceText("automaticReviewAfterTheDeadline45")
                : sourceText("yourReview")}
            </Text>
            <Text style={s.meta}>
              {now >= Date.parse(record.publishAt)
                ? sourceText("thePublicationWaitingPeriodHasEnded")
                : sourceText("waitingForPublication1530DaysAfter")}
            </Text>
            {record.mode === "manual" && (
              <View style={s.row}>
                {eligibleStatus(application) &&
                  deadline &&
                  now < Date.parse(deadline) && (
                    <AppButton
                      label={tText("editReview_1203")}
                      outline
                      onPress={() => setEditing(true)}
                    />
                  )}
                <ConfirmAction
                  label={tText("deleteReview")}
                  danger
                  message={tText("deleteThisReviewYouCannotSubmitAnother")}
                  onConfirm={() => remove(application.id)}
                />
              </View>
            )}
            <Text style={s.meta}>
              {tText("reviewDate")}
              {date(record.submittedAt)}
            </Text>
            {record.answers &&
              groups.map((g) => (
                <View key={g.key} style={s.group}>
                  <Text style={s.label}>
                    {g.label}：{(record.answers![g.key].score || 5).toFixed(1)}
                  </Text>
                  {record.answers![g.key].choices.map((c) => (
                    <Text key={c} style={s.meta}>
                      {c}
                    </Text>
                  ))}
                  <BodyText localize={false}>
                    {record.answers![g.key].comment || tText("noComment")}
                  </BodyText>
                </View>
              ))}
          </>
        ) : canEvaluate(application, undefined, now) ? (
          <>
            <Text style={s.meta}>
              {tText("reviewDeadline")}
              {deadline ? date(deadline) : "—"}
            </Text>
          </>
        ) : (
          <BodyText>
            {deadline && now >= Date.parse(deadline)
              ? sourceText("theReviewPeriodHasEndedEligibleUnreviewed")
              : sourceText("reviewsAreAvailableAfterAJobOffer")}
          </BodyText>
        )}
      </Panel>
      <Text style={s.meta}>{tText("50Outstanding4049")}</Text>
    </View>
  );
}
export function EvaluationButton({
  application,
  onPress,
}: {
  application: Application;
  onPress: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  const { records, ready, now } = useEvaluations();
  if (
    !ready ||
    !canEvaluate(
      application,
      records.find((r) => r.applicationId === application.id),
      now,
    )
  )
    return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tText("reviewCompanyOrOpportunity")}
      onPress={onPress}
      style={s.button}
    >
      <Text style={s.buttonText}>{tText("writeAReview")}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    backgroundColor: "rgba(15,23,42,.4)",
  },
  modal: { width: "100%", maxWidth: 700, maxHeight: "92%", flexGrow: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  close: { padding: 12 },
  meta: { fontSize: 12, lineHeight: 20, color: "#64748B" },
  info: {
    fontSize: 12,
    lineHeight: 20,
    color: "#1748B8",
    backgroundColor: "#EAF2FF",
    padding: 10,
    borderRadius: 8,
  },
  group: {
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#DDE6F1",
  },
  label: { fontSize: 14, fontWeight: "800", color: "#183455" },
  total: { fontSize: 21, fontWeight: "800", color: "#2563EB" },
  error: { color: "#B42318", fontSize: 12 },
  empty: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  button: {
    minHeight: 38,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#2563EB",
  },
  buttonText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
});

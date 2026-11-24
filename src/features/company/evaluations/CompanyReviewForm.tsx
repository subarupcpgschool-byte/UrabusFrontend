import { ConfirmAction } from "@/api/ApiUI";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Pressable } from "@/i18n/native";
import {
  tText,
  translateText,
  localeTag,
  useLocaleVersion,
} from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import { AppTextArea } from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
  StatusBadge,
} from "@/components/ui/AppUI";
import { dataRequest } from "@/api/platform";
import { useAuth } from "@/auth/AuthProvider";
import { CRITERIA, SCALE, type CompanyReview } from "./model";

function initialScores(item: CompanyReview) {
  return Object.fromEntries(
    CRITERIA.map((c) => [
      c.id,
      item.scores?.find((s) => s.label === sourceText(c.label))?.value || 0,
    ]),
  );
}
const snapshot = (scores: Record<string, number>, comment: string) =>
  JSON.stringify([scores, comment]);
export function CompanyReviewForm({
  item,
  onDirtyChange,
  onBusyChange,
  onSaved,
}: {
  item: CompanyReview;
  onDirtyChange: (dirty: boolean) => void;
  onBusyChange: (busy: boolean) => void;
  onSaved: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const [scores, setScores] = useState(() => initialScores(item));
  const [comment, setComment] = useState(item.reviewComment || "");
  const [evaluationId, setEvaluationId] = useState(item.evaluationId);
  const [version, setVersion] = useState(item.evaluationVersion || 0);
  const [baseline, setBaseline] = useState(() =>
    snapshot(initialScores(item), item.reviewComment || ""),
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [evaluator, setEvaluator] = useState(item.evaluatorName);
  const [updated, setUpdated] = useState(item.reviewedUpdatedAt);
  useEffect(() => onBusyChange(busy), [busy, onBusyChange]);
  const dirty = snapshot(scores, comment) !== baseline;
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);
  const complete = CRITERIA.filter(
    (c) => scores[c.id] >= 1 && scores[c.id] <= 5,
  ).length;
  const total =
    complete === 15
      ? Math.round(
          (CRITERIA.reduce((sum, c) => sum + scores[c.id], 0) / 15) * 10,
        ) / 10
      : null;
  const judgement =
    total === null ? null : SCALE.find((s) => s.score === Math.round(total));
  const date = (value: string | null) =>
    value ? new Date(value).toLocaleString(localeTag()) : "—";
  async function save() {
    if (busy || !item.canEdit) return;
    if (complete !== 15) {
      setError(sourceText("companyReviewIncomplete"));
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const saved = await dataRequest<CompanyReview>(
        `/company-evaluations/${item.id}`,
        token,
        {
          scores: CRITERIA.map((c) => ({
            label: sourceText(c.label),
            value: scores[c.id],
          })),
          comment,
          version,
          evaluationId,
        },
        "PUT",
      );
      setEvaluationId(saved.evaluationId);
      setVersion(saved.evaluationVersion || 0);
      setBaseline(snapshot(scores, comment));
      setEvaluator(saved.evaluatorName);
      setUpdated(saved.reviewedUpdatedAt);
      setNotice(sourceText("companyReviewSaved"));
      onDirtyChange(false);
      onSaved();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : sourceText("unableToCompleteTheAction"),
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!evaluationId || !item.canDelete || busy) return;
    setBusy(true);
    try {
      await dataRequest(
        `/evaluations/${evaluationId}?version=${version}`,
        token,
        undefined,
        "DELETE",
      );
      const empty = Object.fromEntries(CRITERIA.map((c) => [c.id, 0]));
      setEvaluationId(null);
      setVersion(0);
      setScores(empty);
      setComment("");
      setBaseline(snapshot(empty, ""));
      setEvaluator(null);
      setUpdated(null);
      setNotice("");
      setError("");
      onDirtyChange(false);
      onSaved();
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={s.stack}>
      <Panel>
        <SectionTitle localize={false}>{item.applicationName}</SectionTitle>
        <Text localize={false} style={s.name}>
          {item.userName}
        </Text>
        <View style={s.tags}>
          <StatusBadge label={item.selectionStatus} />
          <StatusBadge
            label={
              item.evaluationId
                ? tText("companyReviewEvaluated")
                : tText("companyReviewPending")
            }
            tone={item.evaluationId ? "green" : "yellow"}
          />
          {item.overdue && (
            <StatusBadge label={tText("companyReviewOverdue")} tone="red" />
          )}
        </View>
        <BodyText>
          {tText("companyReviewStatusChanged")}: {date(item.statusChangedAt)}
        </BodyText>
        <BodyText>
          {tText("companyReviewDeadline")}: {date(item.reviewDeadline)}
        </BodyText>
        <Text style={s.hint}>{tText("companyReviewDeadlineHint")}</Text>
        {!!evaluator && (
          <Text localize={false}>
            {tText("companyReviewReviewer")}: {evaluator}
          </Text>
        )}
        {!!updated && (
          <BodyText>
            {tText("companyReviewUpdated")}: {date(updated)}
          </BodyText>
        )}
        {!item.canEdit && (
          <Text style={s.warning}>{tText("companyReviewReadOnly")}</Text>
        )}
        {!!item.evaluationId && item.scores?.length !== 15 && (
          <Text style={s.warning}>{tText("companyReviewLegacy")}</Text>
        )}
      </Panel>
      <Panel>
        <SectionTitle>{tText("companyReviewScale")}</SectionTitle>
        <View style={s.scale}>
          {SCALE.map((scale) => (
            <View key={scale.score} style={s.scaleItem}>
              <Text style={s.bold}>
                {scale.score} — {tText(scale.label)}
              </Text>
              <Text style={s.hint}>{tText(scale.description)}</Text>
            </View>
          ))}
        </View>
      </Panel>
      <Panel>
        <View style={s.summary}>
          <Text style={s.bold}>
            {tText("companyReviewComplete", { count: complete })}
          </Text>
          <Text style={s.bold}>
            {tText("companyReviewRating")}:{" "}
            {total === null ? "—" : `${total.toFixed(1)} / 5.0`}{" "}
            {judgement ? tText(judgement.label) : ""}
          </Text>
        </View>
        {[...new Set(CRITERIA.map((c) => c.category))].map((category) => (
          <View key={category} style={s.category}>
            <Text accessibilityRole="header" style={s.categoryTitle}>
              {tText(category)}
            </Text>
            {CRITERIA.filter((c) => c.category === category).map((c) => (
              <View key={c.id} style={s.criterion}>
                <View style={s.description}>
                  <Text style={s.bold}>{tText(c.label)}</Text>
                  <Text style={s.hint}>{tText(c.description)}</Text>
                </View>
                <View
                  accessibilityRole="radiogroup"
                  accessibilityLabel={tText(c.label)}
                  style={s.rating}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Pressable
                      key={value}
                      accessibilityRole="radio"
                      aria-checked={scores[c.id] === value}
                      accessibilityLabel={tText("companyReviewScoreLabel", {
                        item: tText(c.label),
                        score: value,
                        judgement: tText(
                          SCALE.find((s) => s.score === value)!.label,
                        ),
                      })}
                      accessibilityState={{
                        checked: scores[c.id] === value,
                        disabled: !item.canEdit || busy,
                      }}
                      disabled={!item.canEdit || busy}
                      onPress={() => {
                        setScores((old) => ({ ...old, [c.id]: value }));
                        setNotice("");
                        setError("");
                      }}
                      style={[
                        s.scoreButton,
                        scores[c.id] === value && s.chosen,
                        (!item.canEdit || busy) && s.disabled,
                      ]}
                    >
                      <Text
                        style={[
                          s.scoreText,
                          scores[c.id] === value && s.chosenText,
                        ]}
                      >
                        {value}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
        <AppTextArea
          label={tText("companyReviewNotes")}
          placeholder={tText("companyReviewNotesPlaceholder")}
          value={comment}
          onChangeText={(value) => {
            setComment(value);
            setNotice("");
          }}
          maxLength={2000}
          editable={item.canEdit && !busy}
        />
        <Text style={s.hint}>{tText("companyReviewPublication")}</Text>
        {!!error && (
          <Text accessibilityRole="alert" style={s.error}>
            {translateText(error)}
          </Text>
        )}
        {!!notice && (
          <Text accessibilityRole="alert" style={s.success}>
            {translateText(notice)}
          </Text>
        )}
        {item.canEdit && (
          <View style={{ alignSelf: "flex-start" }}>
            <AppButton
              label={busy ? tText("saving") : tText("companyReviewSave")}
              disabled={busy}
              onPress={() => void save()}
            />
          </View>
        )}
        {!!evaluationId && item.canDelete && (
          <View style={{ alignSelf: "flex-start" }}>
            <ConfirmAction
              label={tText("deleteReview")}
              message={tText("companyReviewDeleteMessage")}
              danger
              onConfirm={remove}
            />
          </View>
        )}
      </Panel>
    </View>
  );
}
const s = StyleSheet.create({
  stack: { gap: 14 },
  name: { fontSize: 18, fontWeight: "700", color: "#17334F" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  hint: { fontSize: 12, color: "#587086", lineHeight: 19 },
  bold: { fontWeight: "700", color: "#17334F", fontSize: 14 },
  warning: { color: "#946200", fontSize: 13, lineHeight: 21 },
  scale: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  scaleItem: {
    flexBasis: 170,
    flexGrow: 1,
    gap: 3,
    padding: 8,
    backgroundColor: "#F4F8FC",
    borderRadius: 8,
  },
  summary: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  category: { gap: 4, marginTop: 14 },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 10,
    color: "#196FB0",
    borderBottomWidth: 1,
    borderBottomColor: "#D8E5F0",
  },
  criterion: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF1F6",
  },
  description: { flexGrow: 1, flexBasis: 220, gap: 4 },
  rating: { flexDirection: "row", gap: 6, paddingVertical: 2 },
  scoreButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BDCDDC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  scoreText: { fontWeight: "700", color: "#355670" },
  chosen: { backgroundColor: "#1979C3", borderColor: "#1979C3" },
  chosenText: { color: "#FFF" },
  disabled: { opacity: 0.6 },
  error: { color: "#B42318", lineHeight: 21 },
  success: { color: "#14734E", lineHeight: 21 },
});

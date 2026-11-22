import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { ContractRow, EvaluationRow, InteractionRow } from "@/api/models";
import { ConfirmAction } from "@/api/ApiUI";
import {
  Panel,
  BodyText,
  AppButton,
  SectionTitle,
} from "@/components/ui/AppUI";
import {
  AppInput,
  AppSelect,
  AppDatePicker,
  AppTextArea,
} from "@/components/form";
export default function CompanyContractPanel({
  item,
}: {
  item: InteractionRow;
}) {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const r = useResource<ContractRow[]>(token ? "/contracts" : null, [], true),
    reviews = useResource<EvaluationRow[]>(
      token ? "/evaluations" : null,
      [],
      true,
    );
  const contract = r.data.find((c) => c.interactionId === item.id);
  const previous = reviews.data.find(
    (e) => e.contractId === contract?.id && e.direction === "COMPANY_TO_USER",
  );
  const [title, setTitle] = useState(item.title),
    [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [status, setStatus] = useState<string>(sourceText("activeContract")),
    [rating, setRating] = useState("0"),
    [comment, setComment] = useState(""),
    [scores, setScores] = useState(["5", "5", "5"]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    setTitle(contract?.title || item.title);
    setStart(contract?.startDate || "");
    setEnd(contract?.endDate || "");
    setStatus(contract?.status || sourceText("activeContract"));
  }, [contract?.id, contract?.version, item.id]);
  useEffect(() => {
    setRating(previous ? String(previous.total) : "0");
    setComment(previous?.comment || "");
    setScores(
      [
        sourceText("workQuality"),
        sourceText("communication"),
        sourceText("timelinessAndResponsibility"),
      ].map((label) =>
        String(previous?.scores.find((s) => s.label === label)?.value || 5),
      ),
    );
  }, [previous?.id, previous?.version]);
  async function run(operation: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await operation();
      setNotice(sourceText("saved"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 14 }}>
      <ResourceStatus
        loading={r.loading || reviews.loading}
        error={r.error || reviews.error}
        onRetry={() => {
          r.refresh();
          reviews.refresh();
        }}
      />
      {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
      {!!notice && <Text>{notice}</Text>}
      <Panel>
        <SectionTitle>{tText("contractInformation")}</SectionTitle>
        {item.companyResult !== sourceText("jobOffer") ? (
          <BodyText>{tText("contractsCanBeRegisteredAfterAJob")}</BodyText>
        ) : (
          <>
            <AppInput
              label={tText("contractName")}
              value={title}
              onChangeText={setTitle}
              editable={item.canEdit !== false && !busy}
            />
            <AppDatePicker
              label={tText("contractStartDate")}
              value={start}
              onValueChange={setStart}
              disabled={item.canEdit === false || busy}
            />
            <AppDatePicker
              label={tText("contractEndDate")}
              value={end}
              onValueChange={setEnd}
              disabled={item.canEdit === false || busy}
            />
            <AppSelect
              label={tText("contractStatus")}
              value={status}
              onValueChange={setStatus}
              options={[
                sourceText("activeContract"),
                sourceText("contractEnded"),
              ].map((value) => ({
                value,
                label: value,
              }))}
              disabled={item.canEdit === false || busy}
            />
            {item.canEdit !== false && (
              <AppButton
                label={
                  busy
                    ? sourceText("processing")
                    : contract
                      ? sourceText("updateContract")
                      : sourceText("registerContract")
                }
                onPress={() =>
                  void run(() =>
                    dataRequest(
                      contract ? `/contracts/${contract.id}` : "/contracts",
                      token,
                      {
                        interactionId: item.id,
                        title,
                        startDate: start || null,
                        endDate: end || null,
                        status,
                        version: contract?.version ?? 0,
                      },
                      contract ? "PUT" : "POST",
                    ),
                  )
                }
              />
            )}{" "}
            {contract && item.canDelete && (
              <ConfirmAction
                label={tText("deleteContract")}
                danger
                message={tText("deleteThisContract")}
                onConfirm={() =>
                  dataRequest(
                    `/contracts/${contract.id}?version=${contract.version}`,
                    token,
                    undefined,
                    "DELETE",
                  )
                }
              />
            )}
          </>
        )}
      </Panel>
      {contract && (
        <Panel>
          <SectionTitle>{tText("reviewAContractedUser")}</SectionTitle>
          <BodyText>{tText("sentFromTheCompanyToTheUser")}</BodyText>
          <AppSelect
            label={tText("overallRating")}
            value={rating}
            onValueChange={setRating}
            options={[
              { value: "0", label: sourceText("selectAnOption") },
              ...[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => ({
                value: String(v),
                label: `${v} / 5`,
              })),
            ]}
            disabled={item.canEdit === false || busy}
          />
          {[
            sourceText("workQuality"),
            sourceText("communication"),
            sourceText("timelinessAndResponsibility"),
          ].map((label, index) => (
            <AppSelect
              key={label}
              label={label}
              value={scores[index]}
              onValueChange={(value) =>
                setScores((s) => s.map((v, i) => (i === index ? value : v)))
              }
              options={[1, 2, 3, 4, 5].map((v) => ({
                value: String(v),
                label: String(v),
              }))}
              disabled={item.canEdit === false || busy}
            />
          ))}
          <AppTextArea
            label={tText("reviewComment")}
            value={comment}
            onChangeText={setComment}
            maxLength={2000}
            disabled={item.canEdit === false || busy}
          />
          {item.canEdit !== false && (
            <AppButton
              label={
                busy
                  ? sourceText("processing")
                  : previous
                    ? sourceText("updateReview")
                    : sourceText("submitReview")
              }
              onPress={() =>
                void run(() =>
                  dataRequest(
                    previous ? `/evaluations/${previous.id}` : "/evaluations",
                    token,
                    {
                      contractId: contract.id,
                      rating: Number(rating),
                      comment,
                      scores: [
                        sourceText("workQuality"),
                        sourceText("communication"),
                        sourceText("timelinessAndResponsibility"),
                      ].map((label, i) => ({
                        label,
                        value: Number(scores[i]),
                      })),
                      version: previous?.version ?? 0,
                    },
                    previous ? "PUT" : "POST",
                  ),
                )
              }
            />
          )}{" "}
          {previous && item.canDelete && (
            <ConfirmAction
              label={tText("deleteReview")}
              danger
              message={tText("deleteThisReviewItCannotBeRegistered")}
              onConfirm={() =>
                dataRequest(
                  `/evaluations/${previous.id}?version=${previous.version}`,
                  token,
                  undefined,
                  "DELETE",
                )
              }
            />
          )}
        </Panel>
      )}
    </View>
  );
}

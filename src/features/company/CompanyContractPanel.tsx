import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
    [status, setStatus] = useState("契約中"),
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
    setStatus(contract?.status || "契約中");
  }, [contract?.id, contract?.version, item.id]);
  useEffect(() => {
    setRating(previous ? String(previous.total) : "0");
    setComment(previous?.comment || "");
    setScores(
      ["仕事の品質", "コミュニケーション", "納期・責任感"].map((label) =>
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
      setNotice("保存しました。");
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
        <SectionTitle>契約情報</SectionTitle>
        {item.companyResult !== "内定" ? (
          <BodyText>内定確定後に契約を登録できます。</BodyText>
        ) : (
          <>
            <AppInput
              label="契約名"
              value={title}
              onChangeText={setTitle}
              editable={item.canEdit !== false && !busy}
            />
            <AppDatePicker
              label="契約開始日"
              value={start}
              onValueChange={setStart}
              disabled={item.canEdit === false || busy}
            />
            <AppDatePicker
              label="契約終了日"
              value={end}
              onValueChange={setEnd}
              disabled={item.canEdit === false || busy}
            />
            <AppSelect
              label="契約状態"
              value={status}
              onValueChange={setStatus}
              options={["契約中", "契約終了"].map((value) => ({
                value,
                label: value,
              }))}
              disabled={item.canEdit === false || busy}
            />
            {item.canEdit !== false && (
              <AppButton
                label={
                  busy ? "処理中…" : contract ? "契約を更新" : "契約を登録"
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
                label="契約を削除"
                danger
                message="契約を削除しますか？"
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
          <SectionTitle>契約したユーザーへの評価</SectionTitle>
          <BodyText>
            企業からユーザーへ送信します。公開は15〜30日後です。
          </BodyText>
          <AppSelect
            label="総合評価"
            value={rating}
            onValueChange={setRating}
            options={[
              { value: "0", label: "選択してください" },
              ...[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => ({
                value: String(v),
                label: `${v} / 5`,
              })),
            ]}
            disabled={item.canEdit === false || busy}
          />
          {["仕事の品質", "コミュニケーション", "納期・責任感"].map(
            (label, index) => (
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
            ),
          )}
          <AppTextArea
            label="評価コメント"
            value={comment}
            onChangeText={setComment}
            maxLength={2000}
            disabled={item.canEdit === false || busy}
          />
          {item.canEdit !== false && (
            <AppButton
              label={busy ? "処理中…" : previous ? "評価を更新" : "評価を送信"}
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
                        "仕事の品質",
                        "コミュニケーション",
                        "納期・責任感",
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
              label="評価を削除"
              danger
              message="この評価を削除しますか？ 削除後の再登録はできません。"
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

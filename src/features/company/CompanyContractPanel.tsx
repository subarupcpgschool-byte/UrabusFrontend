import { router } from "expo-router";
import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { ContractRow, InteractionRow } from "@/api/models";
import { ConfirmAction } from "@/api/ApiUI";
import {
  Panel,
  BodyText,
  AppButton,
  SectionTitle,
} from "@/components/ui/AppUI";
import { AppInput, AppSelect, AppDatePicker } from "@/components/form";
export default function CompanyContractPanel({
  item,
}: {
  item: InteractionRow;
}) {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const r = useResource<ContractRow[]>(token ? "/contracts" : null, [], true);
  const contract = r.data.find((c) => c.interactionId === item.id);
  const [title, setTitle] = useState(item.title),
    [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [status, setStatus] = useState<string>(sourceText("activeContract")),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    setTitle(contract?.title || item.title);
    setStart(contract?.startDate || "");
    setEnd(contract?.endDate || "");
    setStatus(contract?.status || sourceText("activeContract"));
  }, [contract?.id, contract?.version, item.id]);
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
        loading={r.loading}
        error={r.error}
        onRetry={() => {
          r.refresh();
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
      <Panel>
        <SectionTitle>{tText("companyReviewList")}</SectionTitle>
        <AppButton
          label={tText("companyReviewOpen")}
          onPress={() =>
            router.push({
              pathname: "/company/evaluations",
              params: { interactionId: item.id },
            } as never)
          }
        />
      </Panel>
    </View>
  );
}

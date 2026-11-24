import { SharedDocumentsPanel } from "@/features/company/hr/SharedDocumentsPanel";
import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text, Pressable } from "@/i18n/native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest, query, type Page } from "@/api/platform";
import type { InteractionRow } from "@/api/models";
import { ConfirmAction, Pager } from "@/api/ApiUI";
import AppPage from "@/components/layout/AppPage";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
  StatusBadge,
} from "@/components/ui/AppUI";
import { AppSelect } from "@/components/form";
import { CompanyPermissionBoundary } from "@/features/company/CompanyPermissionBoundary";
import CompanyContractPanel from "@/features/company/CompanyContractPanel";
import { ResumeDetails } from "@/features/account/ResumeDetails";
import type { ResumeRow } from "@/api/models";
import { Tabs } from "@/features/account/Tabs";
import MessageWorkspace from "@/features/workspace/MessageWorkspace";
import {
  FILTERS,
  INTERACTION_KINDS,
  kindLabel,
  outcomeLabel,
} from "@/features/applications/data";
function Content() {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const params = useLocalSearchParams<{ interactionId?: string }>();
  const [status, setStatus] = useState(""),
    [kind, setKind] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<string | null>(
      params.interactionId || null,
    ),
    [tab, setTab] = useState("messages"),
    [stage, setStage] = useState("0"),
    [result, setResult] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const r = useResource<Page<InteractionRow>>(
    token
      ? "/interactions?" +
          query({
            status,
            kind,
            page,
            pageSize: 20,
            sort: "updatedAt",
            direction: "desc",
          })
      : null,
    { items: [], total: 0, page, pageSize: 20 },
    true,
  );
  useEffect(() => {
    setSelected(params.interactionId || null);
  }, [params.interactionId]);
  const picked = useResource<InteractionRow | null>(
    token && selected ? `/interactions/${selected}` : null,
    null,
    true,
  );
  const item = picked.data || r.data.items.find((i) => i.id === selected);
  const resume = useResource<{ title: string; body: ResumeRow["body"] }[]>(
    item ? `/interactions/${item.id}/resume` : null,
    [],
    true,
  );
  useEffect(() => {
    setStage(String(item?.stage ?? 0));
    setResult(item?.companyResult || "");
    setError("");
  }, [item?.id, item?.version]);
  async function save() {
    if (!item || busy) return;
    setBusy(true);
    setError("");
    try {
      await dataRequest(
        `/interactions/${item.id}`,
        token,
        {
          stage: Number(stage),
          companyResult: result || null,
          afterResult: null,
          version: item.version,
        },
        "PUT",
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage
      title={tText("applicationsAndSelection")}
      subtitle=""
      role="company"
      activeMenu={sourceText("applicationsAndSelection")}
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      <ResourceStatus
        loading={picked.loading}
        error={picked.error}
        onRetry={picked.refresh}
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        <Panel style={{ flex: 3, minWidth: 260 }}>
          <SectionTitle>{tText("applicationsAndOffers")}</SectionTitle>
          <AppSelect
            label={tText("type")}
            value={kind}
            onValueChange={(v) => {
              setKind(v);
              setPage(1);
            }}
            options={[
              { value: "", label: sourceText("all") },
              ...INTERACTION_KINDS,
            ]}
          />
          <AppSelect
            label={tText("status")}
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={FILTERS.map((v) => ({
              value: v === sourceText("all") ? "" : v,
              label: v,
            }))}
          />
          <Pager page={page} total={r.data.total} onChange={setPage} />
          {r.data.items.map((i) => (
            <Pressable
              key={i.id}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === i.id }}
              onPress={() => setSelected(i.id)}
              style={{
                gap: 8,
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: selected === i.id ? "#2563EB" : "#DDE6F1",
                backgroundColor: selected === i.id ? "#F2F7FF" : "#FFF",
              }}
            >
              <Text style={{ fontWeight: "700" }}>{i.name}</Text>
              <BodyText>
                {i.title} ／ {kindLabel(i.kind)}
              </BodyText>
              <StatusBadge label={outcomeLabel(i)} />
            </Pressable>
          ))}
          {!r.loading && !r.error && !r.data.total && (
            <BodyText>{tText("noMatchingInteractions")}</BodyText>
          )}
          <Pager page={page} total={r.data.total} onChange={setPage} />
        </Panel>
        <View style={{ flex: 7, minWidth: 280, gap: 14 }}>
          {item ? (
            <>
              <Panel>
                <SectionTitle>{item.name}</SectionTitle>
                <BodyText localize={false}>
                  {item.title} ／ {item.location} ／ {item.salary}
                </BodyText>
                <StatusBadge label={outcomeLabel(item)} />
                <AppSelect
                  label={tText("selectionStage")}
                  value={stage}
                  onValueChange={setStage}
                  disabled={
                    item.canEdit === false || !!item.companyResult || busy
                  }
                  options={[
                    {
                      value: "0",
                      label:
                        item.kind === "application"
                          ? sourceText("application")
                          : sourceText("received"),
                    },
                    {
                      value: "1",
                      label:
                        item.kind === "application"
                          ? sourceText("applicationScreening")
                          : sourceText("reviewTerms"),
                    },
                    { value: "2", label: sourceText("meeting") },
                  ]}
                />
                <AppSelect
                  label={tText("companyDecision")}
                  value={result}
                  onValueChange={(v) => {
                    setResult(v);
                    if (v) setStage("2");
                  }}
                  disabled={
                    item.canEdit === false || !!item.companyResult || busy
                  }
                  options={[
                    { value: "", label: sourceText("pending") },
                    {
                      value: sourceText("jobOffer"),
                      label: sourceText("jobOffer"),
                    },
                    {
                      value:
                        item.kind === "application"
                          ? sourceText("notSelected")
                          : sourceText("notProceeding"),
                      label:
                        item.kind === "application"
                          ? sourceText("notSelected")
                          : sourceText("notProceeding"),
                    },
                  ]}
                />
                {!item.companyResult && item.canEdit !== false && (
                  <AppButton
                    label={
                      busy
                        ? sourceText("processing")
                        : sourceText("updateSelectionStatus")
                    }
                    onPress={() => void save()}
                  />
                )}{" "}
                {item.companyResult === sourceText("jobOffer") &&
                  !item.afterResult &&
                  item.canEdit !== false && (
                    <ConfirmAction
                      label={tText("withdrawTheJobOffer")}
                      danger
                      message={tText("withdrawThisJobOfferThisCannotBe")}
                      onConfirm={() =>
                        dataRequest(
                          `/interactions/${item.id}`,
                          token,
                          {
                            stage: item.stage,
                            companyResult: sourceText("jobOffer"),
                            afterResult: sourceText("offerWithdrawn"),
                            version: item.version,
                          },
                          "PUT",
                        )
                      }
                    />
                  )}{" "}
                {item.canDelete && (
                  <ConfirmAction
                    label={tText("removeFromList")}
                    danger
                    message={tText("deleteThisInteraction")}
                    onConfirm={() =>
                      dataRequest(
                        `/interactions/${item.id}?version=${item.version}`,
                        token,
                        undefined,
                        "DELETE",
                      )
                    }
                  />
                )}{" "}
                {!!error && (
                  <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                    {error}
                  </Text>
                )}
              </Panel>
              <Panel>
                <BodyText>{tText("hrResultMailNotice")}</BodyText>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
                >
                  <AppButton
                    outline
                    label={tText("hrMailHistory")}
                    onPress={() =>
                      router.push({
                        pathname: "/company/mail-templates" as never,
                        params: { interactionId: item.id },
                      })
                    }
                  />
                  {item.companyResult === sourceText("jobOffer") &&
                    !item.afterResult && (
                      <AppButton
                        outline
                        label={tText("hrEmployment")}
                        onPress={() =>
                          router.push({
                            pathname: "/company/employment" as never,
                            params: { interactionId: item.id },
                          })
                        }
                      />
                    )}
                </View>
              </Panel>
              {!item.afterResult &&
                (!item.companyResult ||
                  item.companyResult === sourceText("jobOffer")) && (
                  <SharedDocumentsPanel interaction={item.id} />
                )}
              <Tabs
                label={tText("applicantDetails")}
                value={tab}
                onChange={setTab}
                options={[
                  { value: "messages", label: sourceText("messages") },
                  { value: "resume", label: sourceText("submittedResume") },
                  {
                    value: "contract",
                    label: sourceText("contractsAndReviews"),
                  },
                ]}
              />
              {tab === "messages" && (
                <MessageWorkspace
                  key={item.id}
                  conversationOnly
                  initialRoom={{
                    kind: item.recruitmentId ? "job" : "company",
                    id: item.id,
                    roomId: item.roomId,
                    company: item.company,
                    title: item.title,
                  }}
                />
              )}
              {tab === "resume" && (
                <Panel>
                  <ResourceStatus
                    loading={resume.loading}
                    error={resume.error}
                    onRetry={resume.refresh}
                  />
                  {resume.data.map((v, i) => (
                    <View key={i}>
                      <SectionTitle localize={false}>{v.title}</SectionTitle>
                      <ResumeDetails body={v.body} />
                    </View>
                  ))}
                  {!resume.loading && !resume.data.length && (
                    <BodyText>{tText("noResumeWasSubmitted")}</BodyText>
                  )}
                </Panel>
              )}
              {tab === "contract" && (
                <CompanyContractPanel key={item.id} item={item} />
              )}
            </>
          ) : (
            <Panel>
              <BodyText>{tText("selectAnItemFromTheList")}</BodyText>
            </Panel>
          )}
        </View>
      </View>
    </AppPage>
  );
}
export default function CompanyApplications() {
  "use no memo";
  useLocaleVersion();
  return (
    <CompanyPermissionBoundary
      permission="applicants"
      title={tText("applicationsAndSelection")}
    >
      <Content />
    </CompanyPermissionBoundary>
  );
}

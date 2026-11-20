import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
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
  const { token } = useAuth();
  const [status, setStatus] = useState(""),
    [kind, setKind] = useState(""),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<string | null>(null),
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
  const item = r.data.items.find((i) => i.id === selected);
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
      title="応募・選考管理"
      subtitle=""
      role="company"
      activeMenu="応募・選考管理"
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
        <Panel style={{ flex: 3, minWidth: 260 }}>
          <SectionTitle>選考・オファー一覧</SectionTitle>
          <AppSelect
            label="種類"
            value={kind}
            onValueChange={(v) => {
              setKind(v);
              setPage(1);
            }}
            options={[{ value: "", label: "すべて" }, ...INTERACTION_KINDS]}
          />
          <AppSelect
            label="状況"
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={FILTERS.map((v) => ({
              value: v === "すべて" ? "" : v,
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
            <BodyText>該当するやり取りはありません。</BodyText>
          )}
          <Pager page={page} total={r.data.total} onChange={setPage} />
        </Panel>
        <View style={{ flex: 7, minWidth: 280, gap: 14 }}>
          {item ? (
            <>
              <Panel>
                <SectionTitle>{item.name}</SectionTitle>
                <BodyText>
                  {item.title} ／ {item.location} ／ {item.salary}
                </BodyText>
                <StatusBadge label={outcomeLabel(item)} />
                <AppSelect
                  label="選考段階"
                  value={stage}
                  onValueChange={setStage}
                  disabled={
                    item.canEdit === false || !!item.companyResult || busy
                  }
                  options={[
                    {
                      value: "0",
                      label: item.kind === "application" ? "応募" : "受信",
                    },
                    {
                      value: "1",
                      label:
                        item.kind === "application" ? "書類選考" : "条件確認",
                    },
                    { value: "2", label: "面談" },
                  ]}
                />
                <AppSelect
                  label="企業の結果"
                  value={result}
                  onValueChange={(v) => {
                    setResult(v);
                    if (v) setStage("2");
                  }}
                  disabled={
                    item.canEdit === false || !!item.companyResult || busy
                  }
                  options={[
                    { value: "", label: "未確定" },
                    { value: "内定", label: "内定" },
                    {
                      value: item.kind === "application" ? "不採用" : "見送り",
                      label: item.kind === "application" ? "不採用" : "見送り",
                    },
                  ]}
                />
                {!item.companyResult && item.canEdit !== false && (
                  <AppButton
                    label={busy ? "処理中…" : "選考状況を更新"}
                    onPress={() => void save()}
                  />
                )}{" "}
                {item.companyResult === "内定" &&
                  !item.afterResult &&
                  item.canEdit !== false && (
                    <ConfirmAction
                      label="内定を取り消す"
                      danger
                      message="内定を取り消します。この操作は取り消せません。"
                      onConfirm={() =>
                        dataRequest(
                          `/interactions/${item.id}`,
                          token,
                          {
                            stage: item.stage,
                            companyResult: "内定",
                            afterResult: "内定取り消し",
                            version: item.version,
                          },
                          "PUT",
                        )
                      }
                    />
                  )}{" "}
                {item.canDelete && (
                  <ConfirmAction
                    label="一覧から削除"
                    danger
                    message="このやり取りを削除しますか？"
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
              <Tabs
                label="応募者の詳細"
                value={tab}
                onChange={setTab}
                options={[
                  { value: "messages", label: "メッセージ" },
                  { value: "resume", label: "提出された経歴書" },
                  { value: "contract", label: "契約・評価" },
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
                      <SectionTitle>{v.title}</SectionTitle>
                      <ResumeDetails body={v.body} />
                    </View>
                  ))}
                  {!resume.loading && !resume.data.length && (
                    <BodyText>提出された経歴書はありません。</BodyText>
                  )}
                </Panel>
              )}
              {tab === "contract" && (
                <CompanyContractPanel key={item.id} item={item} />
              )}
            </>
          ) : (
            <Panel>
              <BodyText>一覧から選択してください。</BodyText>
            </Panel>
          )}
        </View>
      </View>
    </AppPage>
  );
}
export default function CompanyApplications() {
  return (
    <CompanyPermissionBoundary permission="applicants" title="応募・選考管理">
      <Content />
    </CompanyPermissionBoundary>
  );
}

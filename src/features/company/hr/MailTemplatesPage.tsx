import { useEffect, useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, Pressable } from "@/i18n/native";
import { tText, useLocaleVersion, localeTag } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import AppPage from "@/components/layout/AppPage";
import { useAuth } from "@/auth/AuthProvider";
import { dataRequest, query, type Page } from "@/api/platform";
import { useResource, ResourceStatus } from "@/api/useResource";
import { ConfirmAction, Pager } from "@/api/ApiUI";
import { AppInput, AppSelect } from "@/components/form";
import { Panel, SectionTitle, BodyText } from "@/components/ui/AppUI";
import {
  CompanyPermissionBoundary,
  useCompanyPermission,
} from "../CompanyPermissionBoundary";
import { HrButton, hs } from "./shared";
import {
  MAIL_RESULTS,
  type MailSet,
  type MailSetDraft,
  type MailLog,
} from "./models";
import {
  MailTemplateEditor,
  freshMailSet,
  mailResultLabel,
} from "./MailTemplateEditor";
function Content() {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth(),
    permission = useCompanyPermission("applicants");
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ interactionId?: string }>();
  const [tab, setTab] = useState<"templates" | "history">(
    params.interactionId ? "history" : "templates",
  );
  const [editor, setEditor] = useState<MailSetDraft | null>(null),
    [opening, setOpening] = useState(false),
    [error, setError] = useState(""),
    [selected, setSelected] = useState(params.interactionId || ""),
    [search, setSearch] = useState(""),
    [q, setQ] = useState(""),
    [page, setPage] = useState(1),
    [filter, setFilter] = useState({
      job: "",
      result: "",
      enabled: "",
      kind: "",
      employment: "",
      sort: "updatedAt",
      direction: "desc",
    });
  const canManage = permission.ready && permission.allLevel >= 1;
  const writable = canManage && permission.allLevel >= 2;
  useEffect(() => {
    if (search === q) return;
    const timer = setTimeout(() => {
      setQ(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
  const sets = useResource<Page<MailSet>>(
      canManage
        ? "/company-mail/sets?" + query({ q, ...filter, page, pageSize: 20 })
        : null,
      { items: [], total: 0, page: 1, pageSize: 20 },
      true,
    ),
    jobs = useResource<{ id: string; title: string }[]>(
      canManage ? "/company-mail/jobs" : null,
      [],
      true,
    ),
    employment = useResource<{ value: string; label: string }[]>(
      "/options?category=employment",
      [],
    ),
    interactions = useResource<
      Page<{ id: string; name: string; title: string }>
    >(
      "/interactions?sort=updatedAt&direction=desc&page=1&pageSize=100",
      { items: [], total: 0, page: 1, pageSize: 100 },
      true,
    ),
    logs = useResource<MailLog[]>(
      selected ? `/company-mail/history/${selected}` : null,
      [],
      true,
    );
  const change = (key: keyof typeof filter, v: string) => {
    setFilter((f) => ({ ...f, [key]: v }));
    setPage(1);
  };
  const open = async (id: string) => {
    if (opening) return;
    setOpening(true);
    setError("");
    try {
      setEditor(
        await dataRequest<MailSetDraft>(`/company-mail/sets/${id}`, token),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : tText("unableToLoad"));
    } finally {
      setOpening(false);
    }
  };
  const all = { value: "", label: tText("mtNoFilter") };
  return (
    <AppPage
      title={tText("hrMailTemplates")}
      subtitle=""
      role="company"
      activeMenu={sourceText("hrMailTemplates")}
    >
      <View style={hs.row}>
        <SectionTitle>{tText("hrMailTemplates")}</SectionTitle>
        <View style={{ flex: 1 }} />
        <HrButton
          disabled={!writable}
          label={tText("hrCreate")}
          onPress={() => setEditor(freshMailSet())}
        />
      </View>
      <View style={hs.row} accessibilityRole="tablist">
        {(["templates", "history"] as const).map((value) => (
          <Pressable
            key={value}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === value }}
            onPress={() => setTab(value)}
            style={[hs.item, tab === value && hs.selected]}
          >
            <Text>
              {tText(value === "templates" ? "mtListTab" : "hrMailHistory")}
            </Text>
          </Pressable>
        ))}
      </View>
      {!writable && (
        <BodyText>
          {!permission.ready
            ? tText("checkingPermissions")
            : permission.error || tText("mtManagePermission")}
        </BodyText>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={hs.error}>
          {error}
        </Text>
      )}
      {tab === "templates" && (
        <>
          <Panel style={hs.card}>
            <View style={hs.row}>
              <View style={{ width: 240, maxWidth: "100%" }}>
                <AppInput
                  maxLength={200}
                  label={tText("mtSearch")}
                  value={search}
                  onChangeText={setSearch}
                  placeholder={tText("mtSearchHint")}
                />
              </View>
              <View style={{ width: 220, maxWidth: "100%" }}>
                <AppSelect
                  label={tText("hrTargetJob")}
                  value={filter.job}
                  onValueChange={(v) => change("job", v)}
                  options={[
                    all,
                    { value: "*", label: tText("hrNoJobScope") },
                    ...jobs.data.map((j) => ({ value: j.id, label: j.title })),
                  ]}
                />
              </View>
              <View style={{ width: 160, maxWidth: "100%" }}>
                <AppSelect
                  label={tText("hrResult")}
                  value={filter.result}
                  onValueChange={(v) => change("result", v)}
                  options={[
                    all,
                    ...MAIL_RESULTS.map((r) => ({
                      value: r,
                      label: mailResultLabel(r),
                    })),
                  ]}
                />
              </View>
              <View style={{ width: 160, maxWidth: "100%" }}>
                <AppSelect
                  label={tText("mtEnabledFilter")}
                  value={filter.enabled}
                  onValueChange={(v) => change("enabled", v)}
                  options={[
                    all,
                    { value: "true", label: tText("hrEnabled") },
                    { value: "false", label: tText("hrDisabled") },
                  ]}
                />
              </View>
            </View>
            <View style={hs.row}>
              <View style={{ width: 170, maxWidth: "100%" }}>
                <AppSelect
                  label={tText("hrRecruitmentKind")}
                  value={filter.kind}
                  onValueChange={(v) => change("kind", v)}
                  options={[
                    all,
                    { value: "*", label: tText("mtScopeAll") },
                    { value: "JOB", label: tText("hrJob") },
                    {
                      value: "COMPANY_RECRUITMENT",
                      label: tText("hrCompanyRecruitment"),
                    },
                  ]}
                />
              </View>
              <View style={{ width: 170, maxWidth: "100%" }}>
                <AppSelect
                  label={tText("hrEmploymentType")}
                  value={filter.employment}
                  onValueChange={(v) => change("employment", v)}
                  options={[
                    all,
                    { value: "*", label: tText("mtScopeAll") },
                    ...employment.data,
                  ]}
                />
              </View>
              <View style={{ width: 170, maxWidth: "100%" }}>
                <AppSelect
                  label={tText("mtSort")}
                  value={filter.sort}
                  onValueChange={(v) => change("sort", v)}
                  options={[
                    { value: "updatedAt", label: tText("mtUpdatedAt") },
                    { value: "name", label: tText("hrTemplateName") },
                    { value: "count", label: tText("mtCount") },
                  ]}
                />
              </View>
              <View style={{ width: 160, maxWidth: "100%" }}>
                <AppSelect
                  label={tText("mtDirection")}
                  value={filter.direction}
                  onValueChange={(v) => change("direction", v)}
                  options={[
                    { value: "asc", label: tText("mtAscending") },
                    { value: "desc", label: tText("mtDescending") },
                  ]}
                />
              </View>
              <HrButton
                outline
                label={tText("mtReset")}
                onPress={() => {
                  setSearch("");
                  setQ("");
                  setFilter({
                    job: "",
                    result: "",
                    enabled: "",
                    kind: "",
                    employment: "",
                    sort: "updatedAt",
                    direction: "desc",
                  });
                  setPage(1);
                }}
              />
            </View>
          </Panel>
          <BodyText>{tText("hrTemplatePriority")}</BodyText>
          {!canManage && <BodyText>{tText("mtGlobalPermission")}</BodyText>}
          <ResourceStatus
            loading={sets.loading || jobs.loading}
            error={sets.error || jobs.error}
            onRetry={() => {
              sets.refresh();
              jobs.refresh();
            }}
            privateData
          />
          <Pager page={page} total={sets.data.total} onChange={setPage} />
          {canManage &&
            !sets.loading &&
            !sets.error &&
            !sets.data.items.length && (
              <Panel>
                <BodyText>{tText("mtNoMatches")}</BodyText>
              </Panel>
            )}
          <View style={[hs.row, { alignItems: "stretch" }]}>
            {sets.data.items.map((row) => (
              <View
                key={row.id}
                style={[
                  hs.item,
                  {
                    width:
                      width >= 1350 ? "31.8%" : width >= 850 ? "48%" : "100%",
                    gap: 12,
                  },
                ]}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={row.name}
                  disabled={opening}
                  onPress={() => void open(row.id)}
                >
                  <Text
                    localize={false}
                    style={{ fontWeight: "700", fontSize: 15 }}
                  >
                    {row.name}
                  </Text>
                </Pressable>
                <Text localize={false} style={hs.muted}>
                  {row.jobTitle || tText("hrNoJobScope")} ／{" "}
                  {row.recruitmentKind === "*"
                    ? tText("hrAll")
                    : row.recruitmentKind === "JOB"
                      ? tText("hrJob")
                      : tText("hrCompanyRecruitment")}{" "}
                  ／{" "}
                  {row.employmentType === "*"
                    ? tText("hrAll")
                    : row.employmentType}
                </Text>
                <Text>
                  {tText(row.enabled ? "hrEnabled" : "hrDisabled")} ／{" "}
                  {tText("mtConfiguredCount", { count: row.notificationCount })}
                </Text>
                <Text>{row.results.map(mailResultLabel).join("・")}</Text>
                <Text style={hs.muted}>
                  {tText("mtUpdatedAt")}:{" "}
                  {new Date(row.updatedAt).toLocaleString(localeTag())}
                </Text>
                <View style={hs.row}>
                  <HrButton
                    outline
                    label={tText(writable ? "hrEdit" : "mtView")}
                    disabled={opening}
                    onPress={() => void open(row.id)}
                  />
                  {permission.allLevel >= 3 && (
                    <ConfirmAction
                      ButtonComponent={HrButton}
                      danger
                      label={tText("hrDelete")}
                      message={tText("mtDeleteSet")}
                      onConfirm={() =>
                        dataRequest(
                          `/company-mail/sets/${row.id}?version=${row.version}`,
                          token,
                          undefined,
                          "DELETE",
                        )
                      }
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
          <Pager page={page} total={sets.data.total} onChange={setPage} />
        </>
      )}
      {tab === "history" && (
        <Panel style={hs.card}>
          <SectionTitle>{tText("hrMailHistory")}</SectionTitle>
          <BodyText>{tText("mtHistoryHelp")}</BodyText>
          <AppSelect
            label={tText("mtHistoryApplicant")}
            value={selected}
            onValueChange={setSelected}
            options={[
              { value: "", label: tText("mtSelectHistory") },
              ...interactions.data.items.map((i) => ({
                value: i.id,
                label: i.name + " / " + i.title,
              })),
            ]}
          />
          {selected && (
            <>
              <ResourceStatus
                loading={logs.loading}
                error={logs.error}
                onRetry={logs.refresh}
              />
              {!logs.loading && !logs.error && !logs.data.length && (
                <BodyText>{tText("hrNoMail")}</BodyText>
              )}
              {logs.data.map((log) => (
                <View key={log.id} style={hs.item}>
                  <Text localize={false} style={{ fontWeight: "700" }}>
                    {log.subject}
                  </Text>
                  <Text>
                    {tText(
                      log.recipientKind === "USER"
                        ? "hrToApplicant"
                        : "hrToCompany",
                    )}{" "}
                    ／ {tText(`hrMail${log.state}`)}
                  </Text>
                  <Text localize={false}>{log.body}</Text>
                  {!!log.lastError && (
                    <Text style={hs.error}>{log.lastError}</Text>
                  )}
                  {["FAILED", "UNCERTAIN"].includes(log.state) &&
                    permission.level >= 2 && (
                      <ConfirmAction
                        ButtonComponent={HrButton}
                        label={tText("hrRetry")}
                        message={tText("hrRetryNote")}
                        onConfirm={() =>
                          dataRequest(
                            `/company-mail/retry/${log.id}`,
                            token,
                            {},
                          )
                        }
                      />
                    )}
                </View>
              ))}
            </>
          )}
        </Panel>
      )}
      {editor && (
        <MailTemplateEditor
          initial={editor}
          jobs={jobs.data}
          employment={employment.data}
          canWrite={writable}
          canDelete={permission.allLevel >= 3}
          applicants={interactions.data.items}
          initialApplicant={selected}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            sets.refresh();
          }}
        />
      )}
    </AppPage>
  );
}
export default function MailTemplatesPage() {
  return (
    <CompanyPermissionBoundary
      permission="applicants"
      title={sourceText("hrMailTemplates")}
    >
      <Content />
    </CompanyPermissionBoundary>
  );
}

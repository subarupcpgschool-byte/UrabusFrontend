import { translateText } from "@/i18n/display";
import { sourceText, sourceFormat } from "@/i18n/source";
import { tText, useLocaleVersion, localeTag } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import { useEffect, useRef, useState } from "react";
import { Modal, Platform, View } from "react-native";
import AppPage from "@/components/layout/AppPage";
import {
  AppCheckbox,
  AppDatePicker,
  AppSearchableDropdown,
  AppInput,
  AppSelect,
} from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
import { API_BASE, authRequest } from "@/auth/api";
import { useAuth } from "@/auth/AuthProvider";
import {
  RecruitmentArticle,
  RecruitmentArticleEditor,
  articleHtml,
  MAX_ARTICLE_HTML,
  type RecruitmentEditorHandle,
} from "@/features/company/RecruitmentArticle";

import { RecruitmentDetailPreview } from "@/features/company/RecruitmentDetailPreview";
import { pickArticleCss } from "@/features/company/pickArticleCss";

import { CompensationInput } from "@/features/company/CompensationInput";
import { choices } from "@/features/company/recruitmentOptions";

const path = "/company-recruitments";
const labels = {
  title: sourceText("postingTitle"),
  kind: sourceText("postingType"),
  employment: sourceText("employmentType"),
  location: sourceText("workLocation"),
  compensation: sourceText("pay"),
  description: sourceText("jobDescriptionLegacyFormat"),
  requirements: sourceText("requirements"),
  startDate: sourceText("startDate"),
  endDate: sourceText("endDate"),
  publishTime: sourceText("publicationTime"),
  hidden: sourceText("hidden"),
  blocks: sourceText("postingContentLegacyFormat"),
  articleHtml: sourceText("postingContent"),
  articleCss: sourceText("postingSpecificCss"),
  publicationStatus: sourceText("publicationStatus"),
};
const emptyDraft = {
  title: "",
  kind: "JOB",
  employment: sourceText("fullTimeEmployee"),
  location: "",
  compensation: "",
  description: "",
  requirements: "",
  startDate: "",
  endDate: "",
  hidden: false,
  publishTime: "",
  articleHtml: "",
  articleCss: "",
};
type Draft = typeof emptyDraft;
type TextField = Exclude<keyof Draft, "hidden" | "blocks">;
function readDraft(document: string): Draft {
  const saved = JSON.parse(document) as Partial<Draft> &
    Parameters<typeof articleHtml>[0];
  const { blocks, ...fields } = saved;
  return {
    ...emptyDraft,
    ...fields,
    startDate: saved.startDate ?? "",
    endDate: saved.endDate ?? "",
    hidden: saved.hidden ?? false,
    publishTime: saved.publishTime ?? "",
    articleCss: saved.articleCss ?? "",
    articleHtml: articleHtml({ ...fields, blocks }),
  };
}
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000"))
    return false;
  const date = new Date(value + "T00:00:00Z");
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
function visibility(draft: Draft) {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  if (draft.hidden) return sourceText("hidden");
  if (validDate(draft.startDate) && draft.startDate > today)
    return sourceText("notStarted");
  if (validDate(draft.endDate) && draft.endDate < today)
    return sourceText("ended");
  return sourceText("withinPostingPeriod");
}
type Job = {
  id: string;
  document: string;
  deleted_at: string | null;
  can_edit: boolean;
  can_delete?: boolean;
  publication_status?: string;
  publish_at?: string | null;
  publication_blocked_at?: string | null;
};
function publicationLabel(item: Job) {
  const states: Record<string, string> = {
    DRAFT: sourceText("private"),
    PUBLISHED: sourceText("published"),
    SCHEDULED: sourceText("scheduled"),
    BLOCKED: sourceText("publicationStopped"),
    EXPIRED: sourceText("postingEnded"),
  };
  return (
    states[item.publication_status ?? ""] ??
    visibility(readDraft(item.document))
  );
}
type Employee = {
  id: string;
  display_name: string;
  can_create: boolean;
  edit_all: boolean;
  role_managed?: boolean;
};
type Overview = {
  jobs: Job[];
  employees: Employee[];
  canCreate: boolean;
  owner: boolean;
  commonCss?: string;
  publicationPlan?: {
    code: string;
    name: string;
    jobLimit: number;
    companyLimit: number;
    jobsPublished: number;
    companiesPublished: number;
  };
};
type Grant = { employeeId: string; canView: boolean; canEdit: boolean };
type History = {
  actor_name: string;
  action: string;
  before_value: string | null;
  after_value: string | null;
  changed_at: string;
};

export default function CompanyJobsPage() {
  "use no memo";
  useLocaleVersion();
  const { token, user, ready } = useAuth();
  const allowed =
    user?.accountType === "COMPANY" || user?.accountType === "EMPLOYEE";
  return (
    <AppPage
      title={tText("createAndManagePostings")}
      subtitle=""
      role="company"
      activeMenu={sourceText("jobManagement")}
    >
      {!ready ? (
        <BodyText>{tText("loading")}</BodyText>
      ) : token && allowed ? (
        <RecruitmentManager
          key={token}
          token={token}
          companyName={
            user.businessName ||
            (user.accountType === "COMPANY" ? user.displayName : null)
          }
        />
      ) : (
        <Panel>
          <BodyText>{tText("logInWithACompanyAccountOr")}</BodyText>
        </Panel>
      )}
    </AppPage>
  );
}

function RecruitmentManager({
  token,
  companyName,
}: {
  token: string;
  companyName?: string | null;
}) {
  "use no memo";
  useLocaleVersion();
  const locations = useResource<{ value: string; label: string }[]>(
    "/options?category=prefecture",
    [],
  );
  const requirements = useResource<{ value: string; label: string }[]>(
    "/options?category=requirement",
    [],
  );
  const employments = useResource<{ value: string; label: string }[]>(
    "/options?category=employment",
    [],
  );
  const [data, setData] = useState<Overview | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [formWidth, setFormWidth] = useState(0);
  const desktop = Platform.OS === "web" && formWidth >= 840;
  const compact = Platform.OS === "web" && formWidth >= 460;
  const fieldRow = {
    flexDirection: compact ? "row" : "column",
    flexWrap: "wrap",
    gap: 10,
  } as const;
  const fieldCell = compact
    ? { flexGrow: 1, flexBasis: 170, minWidth: 0 }
    : undefined;
  const [initialArticle, setInitialArticle] = useState("");
  const editorRef = useRef<RecruitmentEditorHandle>(null);
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [history, setHistory] = useState<History[] | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [working, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const busy = working || uploading;
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const job = data?.jobs.find((row) => row.id === selected);
  const saved = job ? readDraft(job.document) : null;
  const request = <T,>(route = "", body?: unknown) =>
    authRequest<T>(path + route, body, token);

  async function refresh() {
    setData(await request<Overview>());
  }

  useEffect(() => {
    let active = true;
    authRequest<Overview>(path, undefined, token)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    let active = true;
    const timer = setInterval(() => {
      if (busy) return;
      authRequest<Overview>(path, undefined, token)
        .then((value) => {
          if (active) setData(value);
        })
        .catch((e) => {
          if (active) setError(e.message);
        });
    }, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [token, busy]);

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
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

  function open(id: string | null) {
    if (busy) return;
    setSelected(id);
    setDraft(null);
    setGrants(null);
    setHistory(null);
    setDeleteConfirm(false);
  }

  async function uploadImage(data: FormData) {
    setUploading(true);
    try {
      if (job) data.append("jobId", job.id);
      const result = await request<{ path: string }>("/images", data);
      return API_BASE + result.path;
    } finally {
      setUploading(false);
    }
  }

  async function saveCommonCss(css: string) {
    const result = await request<{ css: string }>("/article-style", { css });
    setData((previous) =>
      previous ? { ...previous, commonCss: result.css } : previous,
    );
    setNotice(
      css ? sourceText("sharedCssUpdated") : sourceText("sharedCssRemoved"),
    );
  }

  const [publicationConfirm, setPublicationConfirm] = useState<{
    input: Draft;
    check: PublicationCheck;
  } | null>(null);
  type PublicationCheck = {
    kindLabel: string;
    decision: string;
    publishedOthers: number;
    limit: number;
    plan: string;
    scheduledAt: string;
  };
  async function checkPublication(input: Draft) {
    return request<PublicationCheck>(
      `/publication-check${job ? `?jobId=${job.id}` : ""}`,
      input,
    );
  }
  async function submitPublication(input: Draft, mode = "AUTO") {
    let result: { id: string };
    try {
      result = await request<{ id: string }>(
        `${job ? `/${job.id}/edit` : ""}?publicationMode=${mode}`,
        input,
      );
    } catch (e) {
      if (mode !== "PRIVATE") {
        const check = await checkPublication(input);
        if (check.decision === "LIMIT" || check.decision === "SCHEDULED") {
          setPublicationConfirm({ input, check });
          return;
        }
      }
      throw e;
    }
    setDraft(null);
    setHistory(null);
    setSelected(result.id);
    setPublicationConfirm(null);
    setNotice(
      mode === "PRIVATE"
        ? sourceText("savedPrivately")
        : mode === "SCHEDULE"
          ? sourceText("publicationScheduledAvailableSlotsWillBeChecked")
          : job
            ? sourceText("postingUpdated")
            : sourceText("postingCreated"),
    );
    await refresh();
  }

  async function save() {
    if (!draft) return;
    if (!editorRef.current)
      throw new Error(sourceText("waitForTheEditorToFinishLoading"));
    const html = await editorRef.current.getHTML();
    const input = {
      ...draft,
      title: draft.title.trim(),
      location: draft.location.trim(),
      compensation: draft.compensation.trim(),
      requirements: draft.requirements.trim(),
      startDate: draft.startDate.trim(),
      endDate: draft.endDate.trim(),
      articleHtml: html,
      description: "",
    };
    if (!input.title || !input.location || !input.compensation) {
      throw new Error(sourceText("enterAPostingTitleLocationAndPay"));
    }
    if (
      /^(年収|月給|時給) /.test(input.compensation) &&
      (!/^(年収|月給|時給) [0-9]+(?:\.[0-9]{1,2})?(万円|円)$/.test(
        input.compensation,
      ) ||
        Number(input.compensation.replace(/[^0-9.]/g, "")) <= 0)
    ) {
      throw new Error(sourceText("enterAnAmountGreaterThanZero"));
    }
    if (input.requirements.length > 4000)
      throw new Error(sourceText("requirementsAreTooLongSelectFewerItems"));
    if (html.length > MAX_ARTICLE_HTML)
      throw new Error(sourceText("thePostingContentIsTooLongShorten"));
    if (
      [input.startDate, input.endDate].some((date) => date && !validDate(date))
    ) {
      throw new Error(sourceText("enterValidStartAndEndDatesIn"));
    }
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new Error(sourceText("theEndDateMustBeOnOr"));
    }
    if (
      input.publishTime &&
      (!input.startDate ||
        !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(input.publishTime))
    )
      throw new Error(sourceText("specifyAStartDateAndAPublication"));
    const check = await checkPublication(input);
    if (check.decision === "LIMIT" || check.decision === "SCHEDULED") {
      setPublicationConfirm({ input, check });
      return;
    }
    await submitPublication(input);
  }

  async function saveRole(
    employee: Employee,
    canCreate: boolean,
    editAll: boolean,
  ) {
    await request(`/employees/${employee.id}/role`, {
      canCreate,
      editAll: canCreate && editAll,
    });
    await refresh();
  }

  const setField = (key: TextField, value: string) =>
    setDraft((previous) =>
      previous ? { ...previous, [key]: value } : previous,
    );

  return (
    <>
      <Modal
        transparent
        visible={!!publicationConfirm}
        onRequestClose={() => {
          if (!busy) setPublicationConfirm(null);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Panel style={{ width: "100%", maxWidth: 560 }}>
            <SectionTitle>
              {publicationConfirm?.check.decision === "LIMIT"
                ? sourceText("publicationLimitReached")
                : sourceText("confirmScheduledPublication")}
            </SectionTitle>
            <BodyText>
              {publicationConfirm?.check.decision === "LIMIT"
                ? sourceFormat(
                    "theLimitForIsThereAreAlready",
                    {
                      v0: publicationConfirm.check.plan,
                      v1: publicationConfirm.check.kindLabel,
                      v2: publicationConfirm.check.limit,
                      v3: publicationConfirm.check.publishedOthers,
                    },
                    [],
                  )
                : sourceText("publicationIsScheduledForTheStartTime")}
            </BodyText>
            {!!error && (
              <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                {error}
              </Text>
            )}
            {publicationConfirm?.check.decision === "SCHEDULED" && (
              <AppButton
                label={tText("schedulePublication")}
                disabled={busy}
                onPress={() => {
                  if (publicationConfirm)
                    void run(() =>
                      submitPublication(publicationConfirm.input, "SCHEDULE"),
                    );
                }}
              />
            )}
            <AppButton
              label={tText("savePrivately")}
              disabled={busy}
              onPress={() => {
                if (publicationConfirm)
                  void run(() =>
                    submitPublication(publicationConfirm.input, "PRIVATE"),
                  );
              }}
            />
            {publicationConfirm?.check.decision === "LIMIT" && (
              <AppButton
                label={tText("exitWithoutSaving")}
                outline
                disabled={busy}
                onPress={() => {
                  setPublicationConfirm(null);
                  setDraft(null);
                }}
              />
            )}
            <AppButton
              label={tText("backToEditing")}
              outline
              disabled={busy}
              onPress={() => setPublicationConfirm(null)}
            />
          </Panel>
        </View>
      </Modal>
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
          {error}
        </Text>
      )}
      {!!notice && <Text accessibilityLiveRegion="polite">{notice}</Text>}
      {!data ? (
        <Panel>
          <BodyText>
            {error ? sourceText("unableToLoadPostings") : sourceText("loading")}
          </BodyText>
          {error && (
            <AppButton
              label={tText("reload")}
              onPress={() => void run(refresh)}
            />
          )}
        </Panel>
      ) : (
        <>
          {data.owner && (
            <Panel>
              <SectionTitle>{tText("sharedCssForAllPostings")}</SectionTitle>
              <BodyText>{tText("appliesToThisCompanySJobAnd")}</BodyText>
              <BodyText>
                {data.commonCss
                  ? sourceText("applied")
                  : sourceText("notConfigured")}
              </BodyText>
              <AppButton
                label={
                  data.commonCss
                    ? sourceText("replaceSharedCss")
                    : sourceText("uploadSharedCss")
                }
                outline
                onPress={() =>
                  void run(async () => {
                    const css = await pickArticleCss();
                    if (css !== null) await saveCommonCss(css);
                  })
                }
              />
              {!!data.commonCss && (
                <AppButton
                  label={tText("removeSharedCss")}
                  outline
                  onPress={() => void run(() => saveCommonCss(""))}
                />
              )}
            </Panel>
          )}
          <Panel>
            <SectionTitle>
              {tText("jobAndCompanyRecruitmentPostings")}
            </SectionTitle>
            {data.publicationPlan && (
              <BodyText>
                {data.publicationPlan.name} {tText("jobPostings")}
                {data.publicationPlan.jobsPublished} /{" "}
                {data.publicationPlan.jobLimit}
                {tText("companyRecruitment")}
                {data.publicationPlan.companiesPublished} /{" "}
                {data.publicationPlan.companyLimit}
                {tText("total_199")}
              </BodyText>
            )}
            <AppButton
              label={tText("refreshPublicationStatus")}
              outline
              disabled={busy}
              onPress={() => void run(refresh)}
            />

            {data.canCreate && (
              <AppButton
                label={tText("createPosting")}
                onPress={() => {
                  if (busy) return;
                  open(null);
                  setInitialArticle("");
                  setDraft({ ...emptyDraft });
                }}
              />
            )}
            {data.jobs.length === 0 && (
              <BodyText>{tText("thereAreNoPostingsYouCanView")}</BodyText>
            )}
            {data.jobs.map((item) => (
              <View key={item.id} style={{ gap: 6 }}>
                <AppButton
                  outline={item.id !== selected}
                  label={`${translateText(item.deleted_at ? sourceText("deleted") : "")}${readDraft(item.document).title}［${translateText(publicationLabel(item))}］`}
                  onPress={() => open(item.id)}
                />
                {!item.deleted_at && item.publication_status === "BLOCKED" && (
                  <View
                    accessibilityRole="alert"
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "#FEF2F2",
                      borderColor: "#FCA5A5",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <Text style={{ color: "#B91C1C", fontWeight: "700" }}>
                      ⚠{" "}
                      {readDraft(item.document).kind === "COMPANY_RECRUITMENT"
                        ? sourceText("companyRecruitment_309")
                        : sourceText("jobPostings_310")}
                      {tText("cannotBePublishedBecauseItsLimitHas")}
                    </Text>
                    <BodyText>
                      {tText("freeAPublicationSlotThenEditAnd")}
                    </BodyText>
                  </View>
                )}
              </View>
            ))}
          </Panel>
          {draft ? (
            <Panel>
              <SectionTitle>
                {job
                  ? sourceText("editPosting")
                  : sourceText("createAJobOrCompanyRecruitmentPosting")}
              </SectionTitle>
              <View
                onLayout={(event) =>
                  setFormWidth(event.nativeEvent.layout.width)
                }
                style={{ flexDirection: desktop ? "row" : "column", gap: 16 }}
              >
                <View
                  style={[{ minWidth: 0, gap: 10 }, desktop && { flex: 3 }]}
                >
                  <View style={fieldRow}>
                    <AppSelect
                      containerStyle={fieldCell}
                      label={labels.kind}
                      value={draft.kind}
                      disabled={busy}
                      onValueChange={(value) => setField("kind", value)}
                      options={[
                        { label: sourceText("job"), value: "JOB" },
                        {
                          label: sourceText("companyRecruitment_316"),
                          value: "COMPANY_RECRUITMENT",
                        },
                      ]}
                    />
                    <AppSelect
                      containerStyle={fieldCell}
                      label={labels.employment}
                      value={draft.employment}
                      disabled={busy}
                      onValueChange={(value) => setField("employment", value)}
                      options={employments.data}
                    />
                  </View>
                  <AppInput
                    label={labels.title}
                    value={draft.title}
                    editable={!busy}
                    required
                    maxLength={120}
                    onChangeText={(value) => setField("title", value)}
                  />
                  <AppSearchableDropdown
                    label={labels.location}
                    allowCreate
                    maxOptionLength={120}
                    required
                    disabled={busy}
                    value={draft.location ? [draft.location] : []}
                    options={choices([
                      ...new Set([
                        ...locations.data.map((v) => v.value),
                        ...(draft.location ? [draft.location] : []),
                      ]),
                    ])}
                    onValueChange={(values) =>
                      setField("location", values[0] || "")
                    }
                  />
                  <SectionTitle>{tText("pay")}</SectionTitle>
                  <CompensationInput
                    value={draft.compensation}
                    disabled={busy}
                    onChange={(value) => setField("compensation", value)}
                  />
                  <SectionTitle>
                    {tText("postingPeriodAndVisibility")}
                  </SectionTitle>
                  <BodyText>{tText("datesUseJapanTimeLeaveTheStart")}</BodyText>
                  <View style={fieldRow}>
                    <AppDatePicker
                      containerStyle={fieldCell}
                      label={tText("startDateOptional")}
                      value={draft.startDate}
                      disabled={busy}
                      onValueChange={(value) => setField("startDate", value)}
                    />
                    <AppDatePicker
                      containerStyle={fieldCell}
                      label={tText("endDateOptional")}
                      value={draft.endDate}
                      disabled={busy}
                      onValueChange={(value) => setField("endDate", value)}
                    />
                  </View>
                  <AppInput
                    label={tText("publicationTimeJapanTimeOptional")}
                    placeholder="00:00"
                    value={draft.publishTime}
                    maxLength={5}
                    editable={!busy}
                    onChangeText={(value) => setField("publishTime", value)}
                  />
                  <BodyText>{tText("usedWhenAStartDateIsSpecified")}</BodyText>
                  <AppCheckbox
                    label={tText("hideThisPosting")}
                    checked={draft.hidden}
                    disabled={busy}
                    onValueChange={(hidden) =>
                      setDraft((previous) =>
                        previous ? { ...previous, hidden } : previous,
                      )
                    }
                  />
                  <SectionTitle>{tText("cssForThisPosting")}</SectionTitle>
                  <BodyText>
                    {draft.articleCss
                      ? sourceText("configured")
                      : sourceText("notConfigured")}{" "}
                    {tText("appliedWhenThePostingIsSavedPosting")}
                  </BodyText>
                  <AppButton
                    label={
                      draft.articleCss
                        ? sourceText("replacePostingCss")
                        : sourceText("uploadPostingCss")
                    }
                    outline
                    onPress={() =>
                      void run(async () => {
                        const css = await pickArticleCss();
                        if (css !== null) setField("articleCss", css);
                      })
                    }
                  />
                  {!!draft.articleCss && (
                    <AppButton
                      label={tText("removePostingCss")}
                      outline
                      onPress={() => {
                        if (!busy) setField("articleCss", "");
                      }}
                    />
                  )}
                  <SectionTitle>{tText("postingContent")}</SectionTitle>
                  <AppButton
                    label={
                      previewOpen
                        ? sourceText("hidePreview")
                        : sourceText("showPreview")
                    }
                    outline
                    onPress={() => setPreviewOpen((open) => !open)}
                  />
                  <RecruitmentArticleEditor
                    initialHtml={initialArticle}
                    disabled={working}
                    editorRef={editorRef}
                    uploadImage={uploadImage}
                    onChange={(html) =>
                      setDraft((previous) =>
                        previous
                          ? { ...previous, articleHtml: html }
                          : previous,
                      )
                    }
                  />
                  <AppSearchableDropdown
                    label={labels.requirements}
                    onCreate={async (value) => {
                      await dataRequest("/options", token, {
                        category: "requirement",
                        value,
                        label: value,
                        active: true,
                        sortOrder: 0,
                        version: 0,
                      });
                    }}
                    allowCreate
                    maxOptionLength={120}
                    multiple
                    disabled={busy}
                    value={draft.requirements.split("\n").filter(Boolean)}
                    options={choices([
                      ...new Set([
                        ...requirements.data.map((v) => v.value),
                        ...draft.requirements.split("\n").filter(Boolean),
                      ]),
                    ])}
                    onValueChange={(values) =>
                      setField("requirements", values.join("\n"))
                    }
                  />
                  <AppButton
                    label={
                      uploading
                        ? sourceText("uploadingImage")
                        : working
                          ? sourceText("saving")
                          : sourceText("save")
                    }
                    onPress={() => void run(save)}
                  />
                  <AppButton
                    label={tText("cancel")}
                    outline
                    onPress={() => {
                      if (!busy) setDraft(null);
                    }}
                  />
                </View>
                {previewOpen && (
                  <View style={[{ minWidth: 0 }, desktop && { flex: 2 }]}>
                    <RecruitmentDetailPreview
                      draft={draft}
                      companyName={companyName}
                      commonCss={data.commonCss}
                      visibility={visibility(draft)}
                    />
                  </View>
                )}
              </View>
            </Panel>
          ) : (
            job &&
            saved && (
              <Panel>
                <SectionTitle localize={false}>{saved.title}</SectionTitle>
                <BodyText>
                  {publicationLabel(job)} ／{" "}
                  {saved.startDate || sourceText("noStartRestriction")} 〜{" "}
                  {saved.endDate || sourceText("noEndDate")}
                </BodyText>
                <RecruitmentArticle
                  html={saved.articleHtml}
                  commonCss={data.commonCss}
                  articleCss={saved.articleCss}
                />
                {(
                  [
                    "kind",
                    "employment",
                    "location",
                    "compensation",
                    "requirements",
                  ] as const
                ).map((key) => (
                  <BodyText key={key}>
                    {labels[key]}　
                    {key === "kind"
                      ? saved.kind === "JOB"
                        ? sourceText("job")
                        : sourceText("companyRecruitment_316")
                      : saved[key] || "—"}
                  </BodyText>
                ))}
                {!job.deleted_at && job.can_edit && (
                  <AppButton
                    label={tText("edit")}
                    onPress={() => {
                      if (!busy) {
                        setInitialArticle(saved.articleHtml);
                        setDraft(saved);
                      }
                    }}
                  />
                )}
                {!job.deleted_at && data.owner && (
                  <AppButton
                    label={tText("employeeViewingAndEditingAccess")}
                    outline
                    onPress={() =>
                      void run(async () =>
                        setGrants(await request<Grant[]>(`/${job.id}/access`)),
                      )
                    }
                  />
                )}
                {!job.deleted_at && (job.can_delete ?? data.owner) && (
                  <>
                    <AppButton
                      label={
                        deleteConfirm
                          ? sourceText("confirmDeletion_338")
                          : sourceText("delete")
                      }
                      danger
                      onPress={() => {
                        if (busy) return;
                        if (!deleteConfirm) {
                          setDeleteConfirm(true);
                          return;
                        }
                        void run(async () => {
                          await request(`/${job.id}/delete`, {});
                          setDeleteConfirm(false);
                          setGrants(null);
                          setHistory(null);
                          setNotice(sourceText("postingDeleted"));
                          await refresh();
                        });
                      }}
                    />
                    {deleteConfirm && (
                      <AppButton
                        label={tText("cancelDeletion")}
                        outline
                        onPress={() => setDeleteConfirm(false)}
                      />
                    )}
                  </>
                )}
                <AppButton
                  label={tText("viewChangeHistory")}
                  outline
                  onPress={() =>
                    void run(async () =>
                      setHistory(
                        await request<History[]>(`/${job.id}/history`),
                      ),
                    )
                  }
                />
              </Panel>
            )
          )}
          {job && !job.deleted_at && grants && (
            <Panel>
              <SectionTitle>{tText("postingSpecificPermissions")}</SectionTitle>
              <BodyText>{tText("employeesAllowedToEditCanAlsoView")}</BodyText>
              {data.employees.length === 0 && (
                <BodyText>
                  {tText("noEmployeesHaveBeenRegistered_343")}
                </BodyText>
              )}
              {data.employees.map((employee) => {
                const grant = grants.find(
                  (value) => value.employeeId === employee.id,
                ) ?? {
                  employeeId: employee.id,
                  canView: false,
                  canEdit: false,
                };
                function change(next: Grant) {
                  setGrants((old) => [
                    ...(old ?? []).filter(
                      (value) => value.employeeId !== employee.id,
                    ),
                    next,
                  ]);
                }
                return (
                  <View key={employee.id} style={{ gap: 8 }}>
                    <BodyText localize={false}>
                      {employee.display_name}
                    </BodyText>
                    <AppCheckbox
                      label={tText("view")}
                      checked={grant.canView}
                      disabled={busy}
                      onValueChange={(canView) => change({ ...grant, canView })}
                    />
                    <AppCheckbox
                      label={tText("edit")}
                      checked={grant.canEdit}
                      disabled={busy}
                      onValueChange={(canEdit) => change({ ...grant, canEdit })}
                    />
                  </View>
                );
              })}
              <AppButton
                label={tText("savePermissions")}
                onPress={() =>
                  void run(async () => {
                    await request(`/${job.id}/access`, grants);
                    setHistory(null);
                    setNotice(sourceText("permissionsSaved"));
                  })
                }
              />
            </Panel>
          )}
          {history && (
            <Panel>
              <SectionTitle>{tText("changeHistoryLatest100")}</SectionTitle>
              {history.length === 0 && (
                <BodyText>{tText("thereIsNoChangeHistory")}</BodyText>
              )}
              {history.map((row, index) => (
                <HistoryEntry key={index} row={row} />
              ))}
            </Panel>
          )}
          {data.owner && (
            <Panel>
              <SectionTitle>
                {tText("employeeCreationAndEditingPermissions")}
              </SectionTitle>
              {data.employees.map((employee) => (
                <View key={employee.id} style={{ gap: 8 }}>
                  <BodyText localize={false}>{employee.display_name}</BodyText>
                  {employee.role_managed ? (
                    <BodyText>
                      {tText("changeThisEmployeeSPermissionsInThe")}
                    </BodyText>
                  ) : (
                    <>
                      <AppCheckbox
                        label={tText("createJobAndCompanyRecruitmentPostings")}
                        checked={employee.can_create}
                        disabled={busy}
                        onValueChange={(value) =>
                          void run(() =>
                            saveRole(employee, value, employee.edit_all),
                          )
                        }
                      />
                      <AppCheckbox
                        label={tText("editAllCompanyPostings")}
                        checked={employee.edit_all}
                        disabled={busy || !employee.can_create}
                        onValueChange={(value) =>
                          void run(() =>
                            saveRole(employee, employee.can_create, value),
                          )
                        }
                      />
                    </>
                  )}
                </View>
              ))}
              {data.employees.length === 0 && (
                <BodyText>
                  {tText("addEmployeesInEmployeeManagementFirst")}
                </BodyText>
              )}
            </Panel>
          )}
        </>
      )}
    </>
  );
}

function HistoryEntry({ row }: { row: History }) {
  "use no memo";
  useLocaleVersion();
  const actionLabel = {
    CREATE: sourceText("create_354"),
    EDIT: sourceText("edit"),
    DELETE: sourceText("delete"),
    ACCESS: sourceText("postingPermissionChanges"),
  };
  const before = row.before_value ? JSON.parse(row.before_value) : {};
  const after = row.after_value ? JSON.parse(row.after_value) : {};
  const keys = Object.keys(labels) as (keyof typeof labels)[];
  const label =
    actionLabel[row.action as keyof typeof actionLabel] ?? row.action;
  return (
    <View style={{ gap: 4, paddingVertical: 8 }}>
      <Text>
        {label} ／ {row.actor_name} ／{" "}
        {new Date(row.changed_at).toLocaleString(localeTag())}
      </Text>
      {row.action === "ACCESS" ? (
        <BodyText>
          {row.before_value} → {row.after_value}
        </BodyText>
      ) : (
        keys
          .filter(
            (key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]),
          )
          .map((key) =>
            key === "articleHtml" ? (
              <View key={key} style={{ gap: 8 }}>
                <BodyText>{tText("postingContentBefore")}</BodyText>
                <RecruitmentArticle html={historyValue(before[key])} />
                <BodyText>{tText("postingContentAfter")}</BodyText>
                <RecruitmentArticle html={historyValue(after[key])} />
              </View>
            ) : (
              <BodyText key={key}>
                {labels[key]}　{historyValue(before[key])} →{" "}
                {historyValue(after[key])}
              </BodyText>
            ),
          )
      )}
    </View>
  );
}

function historyValue(value: unknown): string {
  if (Array.isArray(value)) {
    return (
      value
        .map(
          (block: { kind: string; bold: boolean; text: string; url: string }) =>
            [
              block.kind,
              block.bold ? sourceText("bold") : "",
              block.text,
              block.url,
            ]
              .filter(Boolean)
              .join(" / "),
        )
        .join(" | ") || "—"
    );
  }
  if (typeof value === "boolean")
    return value ? sourceText("yes") : sourceText("no");
  return typeof value === "string" && value ? value : "—";
}

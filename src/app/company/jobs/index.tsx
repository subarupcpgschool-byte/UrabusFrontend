import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import { useEffect, useRef, useState } from "react";
import { Modal, Platform, Text, View } from "react-native";
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
  title: "募集タイトル",
  kind: "募集区分",
  employment: "雇用形態",
  location: "勤務地",
  compensation: "給与・報酬",
  description: "旧形式の仕事内容",
  requirements: "応募条件",
  startDate: "開始日",
  endDate: "終了日",
  publishTime: "公開時刻",
  hidden: "非表示",
  blocks: "旧形式の募集内容",
  articleHtml: "募集内容",
  articleCss: "記事個別CSS",
  publicationStatus: "掲載状態",
};
const emptyDraft = {
  title: "",
  kind: "JOB",
  employment: "正社員",
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
  if (draft.hidden) return "非表示";
  if (validDate(draft.startDate) && draft.startDate > today) return "開始前";
  if (validDate(draft.endDate) && draft.endDate < today) return "終了";
  return "期間内";
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
    DRAFT: "非公開",
    PUBLISHED: "公開中",
    SCHEDULED: "予約公開",
    BLOCKED: "公開停止",
    EXPIRED: "募集終了",
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
  const { token, user, ready } = useAuth();
  const allowed =
    user?.accountType === "COMPANY" || user?.accountType === "EMPLOYEE";
  return (
    <AppPage
      title="求人作成・管理"
      subtitle=""
      role="company"
      activeMenu="求人管理"
    >
      {!ready ? (
        <BodyText>読み込み中…</BodyText>
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
          <BodyText>
            企業アカウントまたは所属企業の従業員アカウントでログインしてください。
          </BodyText>
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
      setError(e instanceof Error ? e.message : "処理できませんでした。");
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
    setNotice(css ? "共通CSSを更新しました。" : "共通CSSを解除しました。");
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
        ? "非公開で保存しました。"
        : mode === "SCHEDULE"
          ? "予約公開を設定しました。開始日時に掲載枠を再確認します。"
          : job
            ? "募集を更新しました。"
            : "募集を作成しました。",
    );
    await refresh();
  }

  async function save() {
    if (!draft) return;
    if (!editorRef.current)
      throw new Error("エディタの読み込みが完了してから保存してください。");
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
      throw new Error("募集タイトル、勤務地、給与・報酬を入力してください。");
    }
    if (
      /^(年収|月給|時給) /.test(input.compensation) &&
      (!/^(年収|月給|時給) [0-9]+(?:\.[0-9]{1,2})?(万円|円)$/.test(
        input.compensation,
      ) ||
        Number(input.compensation.replace(/[^0-9.]/g, "")) <= 0)
    ) {
      throw new Error("金額には0より大きい数値を入力してください。");
    }
    if (input.requirements.length > 4000)
      throw new Error("応募条件が長すぎます。選択数を減らしてください。");
    if (html.length > MAX_ARTICLE_HTML)
      throw new Error("募集内容が長すぎます。内容を短くしてください。");
    if (
      [input.startDate, input.endDate].some((date) => date && !validDate(date))
    ) {
      throw new Error(
        "開始日と終了日は YYYY-MM-DD 形式で正しい日付を入力してください。",
      );
    }
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new Error("終了日は開始日以降にしてください。");
    }
    if (
      input.publishTime &&
      (!input.startDate ||
        !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(input.publishTime))
    )
      throw new Error(
        "公開時刻は開始日と00:00〜23:59の形式で入力してください。",
      );
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
                ? "掲載上限に達しています"
                : "予約公開の確認"}
            </SectionTitle>
            <BodyText>
              {publicationConfirm?.check.decision === "LIMIT"
                ? `${publicationConfirm.check.plan}の${publicationConfirm.check.kindLabel}の上限は${publicationConfirm.check.limit}件です。この募集以外に同じ区分で${publicationConfirm.check.publishedOthers}件公開中のため、公開できません。非公開で保存するか、保存せず編集を終了してください。`
                : `開始日時（日本時間）に予約公開します。開始時点で同じ募集区分の掲載上限に達している場合は非公開のまま停止し、求人管理にアラートを表示します。`}
            </BodyText>
            {!!error && (
              <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                {error}
              </Text>
            )}
            {publicationConfirm?.check.decision === "SCHEDULED" && (
              <AppButton
                label="予約公開する"
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
              label="非公開で保存する"
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
                label="保存せず編集を終了"
                outline
                disabled={busy}
                onPress={() => {
                  setPublicationConfirm(null);
                  setDraft(null);
                }}
              />
            )}
            <AppButton
              label="編集に戻る"
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
            {error ? "募集を取得できませんでした。" : "読み込み中…"}
          </BodyText>
          {error && (
            <AppButton label="再読み込み" onPress={() => void run(refresh)} />
          )}
        </Panel>
      ) : (
        <>
          {data.owner && (
            <Panel>
              <SectionTitle>全記事の共通CSS</SectionTitle>
              <BodyText>
                この企業の求人・企業募集記事の本文に適用します。UTF-8の .css
                ファイル（32KBまで）を選択してください。
              </BodyText>
              <BodyText>{data.commonCss ? "適用中" : "未設定"}</BodyText>
              <AppButton
                label={
                  data.commonCss ? "共通CSSを差し替え" : "共通CSSをアップロード"
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
                  label="共通CSSを解除"
                  outline
                  onPress={() => void run(() => saveCommonCss(""))}
                />
              )}
            </Panel>
          )}
          <Panel>
            <SectionTitle>求人・企業募集一覧</SectionTitle>
            {data.publicationPlan && (
              <BodyText>
                {data.publicationPlan.name} ／ 求人募集：
                {data.publicationPlan.jobsPublished} /{" "}
                {data.publicationPlan.jobLimit}件 ／ 企業募集：
                {data.publicationPlan.companiesPublished} /{" "}
                {data.publicationPlan.companyLimit}件
              </BodyText>
            )}
            <AppButton
              label="掲載状態を更新"
              outline
              disabled={busy}
              onPress={() => void run(refresh)}
            />

            {data.canCreate && (
              <AppButton
                label="募集を作成"
                onPress={() => {
                  if (busy) return;
                  open(null);
                  setInitialArticle("");
                  setDraft({ ...emptyDraft });
                }}
              />
            )}
            {data.jobs.length === 0 && (
              <BodyText>閲覧できる募集はありません。</BodyText>
            )}
            {data.jobs.map((item) => (
              <View key={item.id} style={{ gap: 6 }}>
                <AppButton
                  outline={item.id !== selected}
                  label={`${item.deleted_at ? "［削除済み］" : ""}${readDraft(item.document).title}［${publicationLabel(item)}］`}
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
                        ? "企業募集"
                        : "求人募集"}
                      の掲載上限により公開できません
                    </Text>
                    <BodyText>
                      公開枠を空けて編集・保存すると、再度公開を確認できます。
                    </BodyText>
                  </View>
                )}
              </View>
            ))}
          </Panel>
          {draft ? (
            <Panel>
              <SectionTitle>
                {job ? "募集を編集" : "求人・企業募集を作成"}
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
                        { label: "求人", value: "JOB" },
                        { label: "企業の募集", value: "COMPANY_RECRUITMENT" },
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
                  <SectionTitle>給与・報酬</SectionTitle>
                  <CompensationInput
                    value={draft.compensation}
                    disabled={busy}
                    onChange={(value) => setField("compensation", value)}
                  />
                  <SectionTitle>募集期間と表示設定</SectionTitle>
                  <BodyText>
                    日付は日本時間です。開始日が空欄なら開始制限なし、終了日が空欄なら無期限です。
                  </BodyText>
                  <View style={fieldRow}>
                    <AppDatePicker
                      containerStyle={fieldCell}
                      label="開始日（任意）"
                      value={draft.startDate}
                      disabled={busy}
                      onValueChange={(value) => setField("startDate", value)}
                    />
                    <AppDatePicker
                      containerStyle={fieldCell}
                      label="終了日（任意）"
                      value={draft.endDate}
                      disabled={busy}
                      onValueChange={(value) => setField("endDate", value)}
                    />
                  </View>
                  <AppInput
                    label="公開時刻（日本時間・任意）"
                    placeholder="00:00"
                    value={draft.publishTime}
                    maxLength={5}
                    editable={!busy}
                    onChangeText={(value) => setField("publishTime", value)}
                  />
                  <BodyText>
                    開始日を指定した場合に使用します。空欄は00:00です。予約時点では掲載枠を確保せず、開始日時に判定します。
                  </BodyText>
                  <AppCheckbox
                    label="非表示にする"
                    checked={draft.hidden}
                    disabled={busy}
                    onValueChange={(hidden) =>
                      setDraft((previous) =>
                        previous ? { ...previous, hidden } : previous,
                      )
                    }
                  />
                  <SectionTitle>この記事の個別CSS</SectionTitle>
                  <BodyText>
                    {draft.articleCss ? "設定済み" : "未設定"} ／
                    記事の保存時に確定します。同じ優先度では個別CSSが共通CSSに優先します。
                  </BodyText>
                  <AppButton
                    label={
                      draft.articleCss
                        ? "個別CSSを差し替え"
                        : "個別CSSをアップロード"
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
                      label="個別CSSを解除"
                      outline
                      onPress={() => {
                        if (!busy) setField("articleCss", "");
                      }}
                    />
                  )}
                  <SectionTitle>募集内容</SectionTitle>
                  <AppButton
                    label={
                      previewOpen ? "プレビューを非表示" : "プレビューを表示"
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
                        ? "画像をアップロード中…"
                        : working
                          ? "保存中…"
                          : "保存する"
                    }
                    onPress={() => void run(save)}
                  />
                  <AppButton
                    label="キャンセル"
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
                <SectionTitle>{saved.title}</SectionTitle>
                <BodyText>
                  {publicationLabel(job)} ／ {saved.startDate || "開始制限なし"}{" "}
                  〜 {saved.endDate || "無期限"}
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
                        ? "求人"
                        : "企業の募集"
                      : saved[key] || "—"}
                  </BodyText>
                ))}
                {!job.deleted_at && job.can_edit && (
                  <AppButton
                    label="編集"
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
                    label="従業員の閲覧・編集権限"
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
                      label={deleteConfirm ? "削除を確定する" : "削除"}
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
                          setNotice("募集を削除しました。");
                          await refresh();
                        });
                      }}
                    />
                    {deleteConfirm && (
                      <AppButton
                        label="削除をキャンセル"
                        outline
                        onPress={() => setDeleteConfirm(false)}
                      />
                    )}
                  </>
                )}
                <AppButton
                  label="変更履歴を表示"
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
              <SectionTitle>求人別の権限</SectionTitle>
              <BodyText>
                編集を許可した従業員は、編集に必要な募集内容も表示できます。
              </BodyText>
              {data.employees.length === 0 && (
                <BodyText>登録済みの従業員がいません。</BodyText>
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
                    <BodyText>{employee.display_name}</BodyText>
                    <AppCheckbox
                      label="閲覧"
                      checked={grant.canView}
                      disabled={busy}
                      onValueChange={(canView) => change({ ...grant, canView })}
                    />
                    <AppCheckbox
                      label="編集"
                      checked={grant.canEdit}
                      disabled={busy}
                      onValueChange={(canEdit) => change({ ...grant, canEdit })}
                    />
                  </View>
                );
              })}
              <AppButton
                label="権限を保存"
                onPress={() =>
                  void run(async () => {
                    await request(`/${job.id}/access`, grants);
                    setHistory(null);
                    setNotice("権限を保存しました。");
                  })
                }
              />
            </Panel>
          )}
          {history && (
            <Panel>
              <SectionTitle>変更履歴（最新100件）</SectionTitle>
              {history.length === 0 && (
                <BodyText>変更履歴はありません。</BodyText>
              )}
              {history.map((row, index) => (
                <HistoryEntry key={index} row={row} />
              ))}
            </Panel>
          )}
          {data.owner && (
            <Panel>
              <SectionTitle>従業員の作成・全件編集権限</SectionTitle>
              {data.employees.map((employee) => (
                <View key={employee.id} style={{ gap: 8 }}>
                  <BodyText>{employee.display_name}</BodyText>
                  {employee.role_managed ? (
                    <BodyText>
                      この従業員の権限は「企業・権限」の役割一覧で変更できます。
                    </BodyText>
                  ) : (
                    <>
                      <AppCheckbox
                        label="求人・企業募集の作成"
                        checked={employee.can_create}
                        disabled={busy}
                        onValueChange={(value) =>
                          void run(() =>
                            saveRole(employee, value, employee.edit_all),
                          )
                        }
                      />
                      <AppCheckbox
                        label="自社の全求人・募集の編集"
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
                <BodyText>従業員管理から従業員を登録してください。</BodyText>
              )}
            </Panel>
          )}
        </>
      )}
    </>
  );
}

function HistoryEntry({ row }: { row: History }) {
  const actionLabel = {
    CREATE: "作成",
    EDIT: "編集",
    DELETE: "削除",
    ACCESS: "求人別権限の変更",
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
        {new Date(row.changed_at).toLocaleString("ja-JP")}
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
                <BodyText>募集内容（変更前）</BodyText>
                <RecruitmentArticle html={historyValue(before[key])} />
                <BodyText>募集内容（変更後）</BodyText>
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
            [block.kind, block.bold ? "太字" : "", block.text, block.url]
              .filter(Boolean)
              .join(" / "),
        )
        .join(" | ") || "—"
    );
  }
  if (typeof value === "boolean") return value ? "はい" : "いいえ";
  return typeof value === "string" && value ? value : "—";
}

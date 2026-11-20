import { useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest, query, type Page } from "@/api/platform";
import type { EvaluationRow, JobRow, ResumeRow } from "@/api/models";
import { ConfirmAction, Pager } from "@/api/ApiUI";
import { AppInput, AppTextArea, AppSelect } from "@/components/form";
import {
  AppButton,
  Panel,
  SectionTitle,
  BodyText,
} from "@/components/ui/AppUI";
import AppPage from "@/components/layout/AppPage";
import { Tabs } from "@/features/account/Tabs";
import { ResumeDetails } from "@/features/account/ResumeDetails";
import { CompanyPermissionBoundary } from "./CompanyPermissionBoundary";
type Person = {
  id: string;
  displayName: string;
  city: string;
  bio: string;
  skills: string[];
  occupation: string;
  rating: number | null;
  resumes: ResumeRow[];
};
type Candidate = {
  id: string;
  userId: string;
  displayName: string;
  note: string;
  status: string;
  version: number;
};
function ScoutModal({
  person,
  onClose,
}: {
  person: Pick<Person, "id" | "displayName"> | null;
  onClose: () => void;
}) {
  const { user, token } = useAuth();
  const owner = user?.companyOwnerId || user?.id;
  const jobs = useResource<Page<JobRow>>(
    token ? `/jobs?companyId=${owner}&pageSize=100` : null,
    { items: [], total: 0, page: 1, pageSize: 100 },
    true,
  );
  const [kind, setKind] = useState("scout"),
    [job, setJob] = useState(""),
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  return (
    <Modal
      transparent
      visible={!!person}
      onRequestClose={() => {
        if (!busy) onClose();
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15,23,42,.4)",
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Panel style={{ width: "100%", maxWidth: 600 }}>
          <SectionTitle>{person?.displayName}さんへ連絡</SectionTitle>
          {done ? (
            <BodyText>
              送信しました。応募・選考管理で状況を確認できます。
            </BodyText>
          ) : (
            <>
              <AppSelect
                label="送信する種類"
                value={kind}
                onValueChange={setKind}
                options={[
                  { value: "scout", label: "スカウト" },
                  { value: "offer", label: "オファーレター" },
                ]}
              />
              <ResourceStatus
                loading={jobs.loading}
                error={jobs.error}
                onRetry={jobs.refresh}
              />
              <AppSelect
                label="対象の募集"
                value={job}
                onValueChange={setJob}
                options={[
                  { value: "", label: "企業として連絡する" },
                  ...jobs.data.items.map((j) => ({
                    value: j.id,
                    label: j.title,
                  })),
                ]}
              />
              <AppTextArea
                label="メッセージ・提案条件"
                value={text}
                onChangeText={setText}
                maxLength={8000}
              />
              {!!error && (
                <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                  {error}
                </Text>
              )}
              <AppButton
                label={busy ? "送信中…" : "送信"}
                onPress={() => {
                  if (busy || !person) return;
                  setBusy(true);
                  setError("");
                  void dataRequest("/interactions", token, {
                    kind,
                    userId: person.id,
                    recruitmentId: job || null,
                    message: text,
                  })
                    .then(() => setDone(true))
                    .catch((e) => setError(e.message))
                    .finally(() => setBusy(false));
                }}
              />
            </>
          )}
          <AppButton
            label="閉じる"
            outline
            onPress={() => {
              if (!busy) onClose();
            }}
          />
        </Panel>
      </View>
    </Modal>
  );
}
function TalentContent() {
  const { token } = useAuth();
  const [q, setQ] = useState(""),
    [search, setSearch] = useState(""),
    [page, setPage] = useState(1),
    [tab, setTab] = useState("search"),
    [person, setPerson] = useState<Pick<Person, "id" | "displayName"> | null>(
      null,
    ),
    [candidate, setCandidate] = useState<Candidate | null>(null),
    [note, setNote] = useState(""),
    [status, setStatus] = useState("候補"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const people = useResource<Page<Person>>(
    token ? "/talent?" + query({ q: search, page, pageSize: 20 }) : null,
    { items: [], total: 0, page, pageSize: 20 },
    true,
  );
  const candidates = useResource<Candidate[]>(
    token ? "/candidates" : null,
    [],
    true,
  );
  return (
    <AppPage title="人材検索" subtitle="" role="company" activeMenu="人材検索">
      <Tabs
        label="人材一覧の表示"
        value={tab}
        onChange={setTab}
        options={[
          { value: "search", label: "公開プロフィール検索" },
          {
            value: "candidates",
            label: "候補者リスト",
            count: candidates.data.length,
          },
        ]}
      />
      {tab === "search" ? (
        <>
          <Panel>
            <AppInput
              label="職種・スキル・氏名"
              value={q}
              onChangeText={setQ}
            />
            <AppButton
              label="検索"
              onPress={() => {
                setSearch(q);
                setPage(1);
              }}
            />
          </Panel>
          <ResourceStatus
            loading={people.loading}
            error={people.error}
            onRetry={people.refresh}
          />
          <Pager page={page} total={people.data.total} onChange={setPage} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
            {people.data.items.map((p) => (
              <Panel key={p.id} style={{ flex: 1, minWidth: 250 }}>
                <SectionTitle>{p.displayName}</SectionTitle>
                <BodyText>
                  {p.occupation} ／ {p.city}
                </BodyText>
                <BodyText>
                  {p.rating == null
                    ? "未評価"
                    : `★ ${Number(p.rating).toFixed(1)}`}
                </BodyText>
                <BodyText>{p.skills.join(" ／ ")}</BodyText>
                <AppButton
                  label="詳細を見る"
                  outline
                  onPress={() => router.push(`/users/${p.id}` as never)}
                />
                <AppButton
                  label="スカウト・オファー"
                  onPress={() => setPerson(p)}
                />
              </Panel>
            ))}
          </View>
          {!people.loading && !people.error && !people.data.total && (
            <BodyText>該当する公開プロフィールはありません。</BodyText>
          )}
        </>
      ) : (
        <>
          <ResourceStatus
            loading={candidates.loading}
            error={candidates.error}
            onRetry={candidates.refresh}
          />
          {candidates.data.map((c) => (
            <Panel key={c.id}>
              <SectionTitle>{c.displayName}</SectionTitle>
              <BodyText>
                {c.status} ／ {c.note}
              </BodyText>
              <AppButton
                label="プロフィール"
                outline
                onPress={() => router.push(`/users/${c.userId}` as never)}
              />
              <AppButton
                label="メモ・状態を編集"
                outline
                onPress={() => {
                  setCandidate(c);
                  setNote(c.note);
                  setStatus(c.status);
                  setError("");
                }}
              />
              <ConfirmAction
                label="候補から削除"
                danger
                message="候補者リストから削除しますか？"
                onConfirm={() =>
                  dataRequest(
                    `/candidates/${c.id}?version=${c.version}`,
                    token,
                    undefined,
                    "DELETE",
                  )
                }
              />
            </Panel>
          ))}
          {!candidates.loading && !candidates.data.length && (
            <BodyText>候補者はまだ登録されていません。</BodyText>
          )}
        </>
      )}
      {person && (
        <ScoutModal
          key={person.id}
          person={person}
          onClose={() => setPerson(null)}
        />
      )}
      <Modal
        transparent
        visible={!!candidate}
        onRequestClose={() => {
          if (!busy) setCandidate(null);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,.4)",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Panel style={{ width: "100%", maxWidth: 560 }}>
            <SectionTitle>{candidate?.displayName}</SectionTitle>
            <AppInput
              label="状態"
              value={status}
              onChangeText={setStatus}
              maxLength={30}
            />
            <AppTextArea
              label="メモ"
              value={note}
              onChangeText={setNote}
              maxLength={2000}
            />
            {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
            <AppButton
              label={busy ? "保存中…" : "保存"}
              onPress={() => {
                if (!candidate || busy) return;
                setBusy(true);
                void dataRequest(
                  `/candidates/${candidate.id}`,
                  token,
                  {
                    userId: candidate.userId,
                    note,
                    status,
                    version: candidate.version,
                  },
                  "PUT",
                )
                  .then(() => setCandidate(null))
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            />
            <AppButton
              label="閉じる"
              outline
              onPress={() => {
                if (!busy) setCandidate(null);
              }}
            />
          </Panel>
        </View>
      </Modal>
    </AppPage>
  );
}
export function TalentPage() {
  return (
    <CompanyPermissionBoundary permission="scout" title="人材検索">
      <TalentContent />
    </CompanyPermissionBoundary>
  );
}
function UserDetailContent() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const p = useResource<Person | null>(
      token && id ? `/talent/${id}` : null,
      null,
      true,
    ),
    evaluations = useResource<EvaluationRow[]>(
      token && id ? `/talent/${id}/evaluations` : null,
      [],
      true,
    );
  const [scout, setScout] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  return (
    <AppPage title="ユーザー詳細" subtitle="" role="company">
      <ResourceStatus loading={p.loading} error={p.error} onRetry={p.refresh} />
      {p.data && (
        <>
          <Panel>
            <SectionTitle>{p.data.displayName}</SectionTitle>
            <BodyText>
              {p.data.occupation} ／ {p.data.city}
            </BodyText>
            <BodyText>{p.data.bio}</BodyText>
            <BodyText>{p.data.skills.join(" ／ ")}</BodyText>
            <AppButton
              label="スカウト・オファーを送る"
              onPress={() => setScout(true)}
            />
            <AppButton
              label={busy ? "処理中…" : "候補者に追加"}
              outline
              onPress={() => {
                if (busy) return;
                setBusy(true);
                setError("");
                setNotice("");
                void dataRequest("/candidates", token, {
                  userId: id,
                  note: "",
                  status: "候補",
                  version: 0,
                })
                  .then(() => setNotice("候補者リストに追加しました。"))
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            />
            {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
            {!!notice && <Text>{notice}</Text>}
          </Panel>
          {p.data.resumes.map((r) => (
            <Panel key={r.id}>
              <SectionTitle>{r.title}</SectionTitle>
              <ResumeDetails body={r.body} />
            </Panel>
          ))}
          <Panel>
            <SectionTitle>企業からの評価</SectionTitle>
            <ResourceStatus
              loading={evaluations.loading}
              error={evaluations.error}
              onRetry={evaluations.refresh}
            />
            {evaluations.data.map((e) => (
              <View key={e.id}>
                <Text>{Number(e.total).toFixed(1)} / 5.0</Text>
                <BodyText>{e.comment}</BodyText>
                {e.scores.map((s) => (
                  <BodyText key={s.label}>
                    {s.label}：{s.value}
                  </BodyText>
                ))}
              </View>
            ))}
            {!evaluations.loading && !evaluations.data.length && (
              <BodyText>公開されている評価はまだありません。</BodyText>
            )}
          </Panel>
          {scout && (
            <ScoutModal person={p.data} onClose={() => setScout(false)} />
          )}
        </>
      )}
    </AppPage>
  );
}
export function UserDetailPage() {
  return (
    <CompanyPermissionBoundary permission="scout" title="ユーザー詳細">
      <UserDetailContent />
    </CompanyPermissionBoundary>
  );
}

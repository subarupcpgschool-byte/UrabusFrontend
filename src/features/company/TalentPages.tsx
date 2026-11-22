import { translateText } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState } from "react";
import { Modal, ScrollView, View } from "react-native";
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
  "use no memo";
  useLocaleVersion();
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
          <SectionTitle localize={false}>
            {person?.displayName}
            {tText("contact")}
          </SectionTitle>
          {done ? (
            <BodyText>{tText("sentCheckTheStatusInApplicationsAnd")}</BodyText>
          ) : (
            <>
              <AppSelect
                label={tText("messageType")}
                value={kind}
                onValueChange={setKind}
                options={[
                  { value: "scout", label: sourceText("scout") },
                  { value: "offer", label: sourceText("offerLetter") },
                ]}
              />
              <ResourceStatus
                loading={jobs.loading}
                error={jobs.error}
                onRetry={jobs.refresh}
              />
              <AppSelect
                label={tText("relatedPosting")}
                value={job}
                onValueChange={setJob}
                options={[
                  { value: "", label: sourceText("contactAsACompany") },
                  ...jobs.data.items.map((j) => ({
                    value: j.id,
                    label: j.title,
                  })),
                ]}
              />
              <AppTextArea
                label={tText("messageAndProposedTerms")}
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
                label={busy ? sourceText("sending") : sourceText("send")}
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
            label={tText("close")}
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
  "use no memo";
  useLocaleVersion();
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
    [status, setStatus] = useState<string>(sourceText("candidate")),
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
    <AppPage
      title={tText("talentSearch")}
      subtitle=""
      role="company"
      activeMenu={sourceText("talentSearch")}
    >
      <Tabs
        label={tText("talentListView")}
        value={tab}
        onChange={setTab}
        options={[
          { value: "search", label: sourceText("searchPublicProfiles") },
          {
            value: "candidates",
            label: sourceText("candidateList"),
            count: candidates.data.length,
          },
        ]}
      />
      {tab === "search" ? (
        <>
          <Panel>
            <AppInput
              label={tText("occupationSkillsOrName")}
              value={q}
              onChangeText={setQ}
            />
            <AppButton
              label={tText("search")}
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
                <SectionTitle localize={false}>{p.displayName}</SectionTitle>
                <BodyText>
                  {p.occupation} ／ {p.city}
                </BodyText>
                <BodyText>
                  {p.rating == null
                    ? sourceText("notReviewed")
                    : `★ ${translateText(Number(p.rating).toFixed(1))}`}
                </BodyText>
                <BodyText>{p.skills.join(" ／ ")}</BodyText>
                <AppButton
                  label={tText("viewDetails")}
                  outline
                  onPress={() => router.push(`/users/${p.id}` as never)}
                />
                <AppButton
                  label={tText("scoutsAndOffers")}
                  onPress={() => setPerson(p)}
                />
              </Panel>
            ))}
          </View>
          {!people.loading && !people.error && !people.data.total && (
            <BodyText>{tText("noMatchingPublicProfiles")}</BodyText>
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
              <SectionTitle localize={false}>{c.displayName}</SectionTitle>
              <BodyText>
                {c.status} ／ {c.note}
              </BodyText>
              <AppButton
                label={tText("profile")}
                outline
                onPress={() => router.push(`/users/${c.userId}` as never)}
              />
              <AppButton
                label={tText("editNoteAndStatus")}
                outline
                onPress={() => {
                  setCandidate(c);
                  setNote(c.note);
                  setStatus(c.status);
                  setError("");
                }}
              />
              <ConfirmAction
                label={tText("removeCandidate")}
                danger
                message={tText("removeThisUserFromYourCandidateList")}
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
            <BodyText>{tText("noCandidatesHaveBeenAdded")}</BodyText>
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
            <SectionTitle localize={false}>
              {candidate?.displayName}
            </SectionTitle>
            <AppInput
              label={tText("status_1063")}
              value={status}
              onChangeText={setStatus}
              maxLength={30}
            />
            <AppTextArea
              label={tText("note")}
              value={note}
              onChangeText={setNote}
              maxLength={2000}
            />
            {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
            <AppButton
              label={busy ? sourceText("saving") : sourceText("save_384")}
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
              label={tText("close")}
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
  "use no memo";
  useLocaleVersion();
  return (
    <CompanyPermissionBoundary permission="scout" title={tText("talentSearch")}>
      <TalentContent />
    </CompanyPermissionBoundary>
  );
}
function UserDetailContent() {
  "use no memo";
  useLocaleVersion();
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
    <AppPage title={tText("userDetails")} subtitle="" role="company">
      <ResourceStatus loading={p.loading} error={p.error} onRetry={p.refresh} />
      {p.data && (
        <>
          <Panel>
            <SectionTitle localize={false}>{p.data.displayName}</SectionTitle>
            <BodyText>
              {p.data.occupation} ／ {p.data.city}
            </BodyText>
            <BodyText localize={false}>{p.data.bio}</BodyText>
            <BodyText>{p.data.skills.join(" ／ ")}</BodyText>
            <AppButton
              label={tText("sendScoutOrOffer")}
              onPress={() => setScout(true)}
            />
            <AppButton
              label={
                busy ? sourceText("processing") : sourceText("addCandidate")
              }
              outline
              onPress={() => {
                if (busy) return;
                setBusy(true);
                setError("");
                setNotice("");
                void dataRequest("/candidates", token, {
                  userId: id,
                  note: "",
                  status: sourceText("candidate"),
                  version: 0,
                })
                  .then(() => setNotice(sourceText("addedToCandidateList")))
                  .catch((e) => setError(e.message))
                  .finally(() => setBusy(false));
              }}
            />
            {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
            {!!notice && <Text>{notice}</Text>}
          </Panel>
          {p.data.resumes.map((r) => (
            <Panel key={r.id}>
              <SectionTitle localize={false}>{r.title}</SectionTitle>
              <ResumeDetails body={r.body} />
            </Panel>
          ))}
          <Panel>
            <SectionTitle>{tText("companyReviews_1069")}</SectionTitle>
            <ResourceStatus
              loading={evaluations.loading}
              error={evaluations.error}
              onRetry={evaluations.refresh}
            />
            {evaluations.data.map((e) => (
              <View key={e.id}>
                <Text>{Number(e.total).toFixed(1)} / 5.0</Text>
                <BodyText localize={false}>{e.comment}</BodyText>
                {e.scores.map((s) => (
                  <BodyText key={s.label}>
                    {s.label}：{s.value}
                  </BodyText>
                ))}
              </View>
            ))}
            {!evaluations.loading && !evaluations.data.length && (
              <BodyText>{tText("noReviewsHaveBeenPublishedYet")}</BodyText>
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
  "use no memo";
  useLocaleVersion();
  return (
    <CompanyPermissionBoundary permission="scout" title={tText("userDetails")}>
      <UserDetailContent />
    </CompanyPermissionBoundary>
  );
}

import { useState } from "react";
import { View, Text, Modal, ScrollView } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { ResumeRow } from "@/api/models";
import { ConfirmAction } from "@/api/ApiUI";
import AppPage from "@/components/layout/AppPage";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
import {
  AppInput,
  AppTextArea,
  AppTagInput,
  AppDatePicker,
  AppSwitch,
} from "@/components/form";
const empty = (): ResumeRow => ({
  id: "",
  title: "",
  body: { summary: "", skills: [], employmentHistory: [], education: [] },
  publicResume: false,
  updatedAt: "",
  version: 0,
});
export default function ResumePage() {
  const { token } = useAuth();
  const r = useResource<ResumeRow[]>(token ? "/me/resumes" : null, [], true);
  const [draft, setDraft] = useState<ResumeRow | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  function field<K extends keyof ResumeRow>(key: K, value: ResumeRow[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }
  async function save() {
    if (!draft || busy) return;
    if (!draft.title.trim()) {
      setError("タイトルを入力してください。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await dataRequest(
        draft.id ? `/me/resumes/${draft.id}` : "/me/resumes",
        token,
        {
          title: draft.title.trim(),
          body: draft.body,
          publicResume: draft.publicResume,
          version: draft.version,
        },
        draft.id ? "PUT" : "POST",
      );
      setDraft(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage title="経歴書" subtitle="" role="user" activeMenu="経歴書">
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      {token && (
        <AppButton
          label="経歴書を作成＋"
          onPress={() => {
            setError("");
            setDraft(empty());
          }}
        />
      )}
      {r.data.map((row) => (
        <Panel key={row.id}>
          <SectionTitle>{row.title}</SectionTitle>
          <BodyText>{row.body.summary || "自己PRは未記入です。"}</BodyText>
          <BodyText>
            {row.publicResume ? "公開中" : "非公開"} ／ 更新日{" "}
            {row.updatedAt.slice(0, 10)}
          </BodyText>
          <AppButton
            label="編集・詳細"
            outline
            onPress={() => {
              setError("");
              setDraft(JSON.parse(JSON.stringify(row)));
            }}
          />
          <ConfirmAction
            label="削除"
            danger
            message="この経歴書を削除しますか？ 提出済みの内容は応募時の履歴に残ります。"
            onConfirm={() =>
              dataRequest(
                `/me/resumes/${row.id}?version=${row.version}`,
                token,
                undefined,
                "DELETE",
              )
            }
          />
        </Panel>
      ))}
      {token && !r.loading && !r.error && !r.data.length && (
        <BodyText>経歴書はまだ登録されていません。</BodyText>
      )}
      <Modal
        transparent
        visible={!!draft}
        onRequestClose={() => {
          if (!busy) setDraft(null);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(15,23,42,.4)",
            padding: 16,
          }}
        >
          <ScrollView
            style={{
              width: "100%",
              maxWidth: 780,
              maxHeight: "92%",
              flexGrow: 0,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {draft && (
              <Panel>
                <SectionTitle>
                  {draft.id ? "経歴書を編集" : "経歴書を作成"}
                </SectionTitle>
                <AppInput
                  label="タイトル"
                  required
                  value={draft.title}
                  onChangeText={(v) => field("title", v)}
                  maxLength={120}
                />
                <AppTextArea
                  label="自己PR"
                  value={draft.body.summary || ""}
                  onChangeText={(v) =>
                    field("body", { ...draft.body, summary: v })
                  }
                />
                <AppTagInput
                  label="スキル"
                  value={draft.body.skills || []}
                  onValueChange={(v) =>
                    field("body", { ...draft.body, skills: v })
                  }
                />
                <Text>企業の人材検索に公開する</Text>
                <AppSwitch
                  accessibilityLabel="経歴書を公開する"
                  value={draft.publicResume}
                  onValueChange={(v) => field("publicResume", v)}
                />
                <SectionTitle>職務経歴</SectionTitle>
                {draft.body.employmentHistory?.map((job, index) => (
                  <Panel key={index}>
                    <AppInput
                      label="勤務先"
                      value={job.company}
                      onChangeText={(v) =>
                        field("body", {
                          ...draft.body,
                          employmentHistory: draft.body.employmentHistory!.map(
                            (j, i) => (i === index ? { ...j, company: v } : j),
                          ),
                        })
                      }
                    />
                    <AppInput
                      label="職種・役職"
                      value={job.position}
                      onChangeText={(v) =>
                        field("body", {
                          ...draft.body,
                          employmentHistory: draft.body.employmentHistory!.map(
                            (j, i) => (i === index ? { ...j, position: v } : j),
                          ),
                        })
                      }
                    />
                    <AppDatePicker
                      label="開始日"
                      value={job.startDate}
                      onValueChange={(v) =>
                        field("body", {
                          ...draft.body,
                          employmentHistory: draft.body.employmentHistory!.map(
                            (j, i) =>
                              i === index ? { ...j, startDate: v } : j,
                          ),
                        })
                      }
                    />
                    <AppDatePicker
                      label="終了日（未入力は在職中）"
                      value={job.endDate || ""}
                      onValueChange={(v) =>
                        field("body", {
                          ...draft.body,
                          employmentHistory: draft.body.employmentHistory!.map(
                            (j, i) =>
                              i === index ? { ...j, endDate: v || null } : j,
                          ),
                        })
                      }
                    />
                    <AppTextArea
                      label="仕事内容"
                      value={job.description}
                      onChangeText={(v) =>
                        field("body", {
                          ...draft.body,
                          employmentHistory: draft.body.employmentHistory!.map(
                            (j, i) =>
                              i === index ? { ...j, description: v } : j,
                          ),
                        })
                      }
                    />
                    <AppButton
                      label="この職歴を削除"
                      outline
                      onPress={() =>
                        field("body", {
                          ...draft.body,
                          employmentHistory:
                            draft.body.employmentHistory!.filter(
                              (_, i) => i !== index,
                            ),
                        })
                      }
                    />
                  </Panel>
                ))}
                <AppButton
                  label="職務経歴を追加＋"
                  outline
                  onPress={() =>
                    field("body", {
                      ...draft.body,
                      employmentHistory: [
                        ...(draft.body.employmentHistory || []),
                        {
                          company: "",
                          position: "",
                          startDate: "",
                          endDate: null,
                          description: "",
                        },
                      ],
                    })
                  }
                />
                <SectionTitle>学歴</SectionTitle>
                {draft.body.education?.map((school, index) => (
                  <Panel key={index}>
                    <AppInput
                      label="学校名"
                      value={school.school}
                      onChangeText={(v) =>
                        field("body", {
                          ...draft.body,
                          education: draft.body.education!.map((s, i) =>
                            i === index ? { ...s, school: v } : s,
                          ),
                        })
                      }
                    />
                    <AppInput
                      label="学部・学科"
                      value={school.department}
                      onChangeText={(v) =>
                        field("body", {
                          ...draft.body,
                          education: draft.body.education!.map((s, i) =>
                            i === index ? { ...s, department: v } : s,
                          ),
                        })
                      }
                    />
                    <AppDatePicker
                      label="卒業日"
                      value={school.graduatedAt}
                      onValueChange={(v) =>
                        field("body", {
                          ...draft.body,
                          education: draft.body.education!.map((s, i) =>
                            i === index ? { ...s, graduatedAt: v } : s,
                          ),
                        })
                      }
                    />
                    <AppButton
                      label="この学歴を削除"
                      outline
                      onPress={() =>
                        field("body", {
                          ...draft.body,
                          education: draft.body.education!.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                    />
                  </Panel>
                ))}
                <AppButton
                  label="学歴を追加＋"
                  outline
                  onPress={() =>
                    field("body", {
                      ...draft.body,
                      education: [
                        ...(draft.body.education || []),
                        { school: "", department: "", graduatedAt: "" },
                      ],
                    })
                  }
                />
                {!!error && (
                  <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                    {error}
                  </Text>
                )}
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <AppButton
                    label="閉じる"
                    outline
                    onPress={() => {
                      if (!busy) setDraft(null);
                    }}
                  />
                  <AppButton
                    label={busy ? "保存中…" : "保存"}
                    onPress={() => void save()}
                  />
                </View>
              </Panel>
            )}
          </ScrollView>
        </View>
      </Modal>
    </AppPage>
  );
}

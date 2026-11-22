import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState } from "react";
import { View, Modal, ScrollView } from "react-native";
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
  "use no memo";
  useLocaleVersion();
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
      setError(sourceText("enterATitle"));
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
    <AppPage
      title={tText("resume")}
      subtitle=""
      role="user"
      activeMenu={sourceText("resume")}
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      {token && (
        <AppButton
          label={tText("createResume")}
          onPress={() => {
            setError("");
            setDraft(empty());
          }}
        />
      )}
      {r.data.map((row) => (
        <Panel key={row.id}>
          <SectionTitle localize={false}>{row.title}</SectionTitle>
          <BodyText localize={false}>
            {row.body.summary || tText("noPersonalSummaryHasBeenEntered")}
          </BodyText>
          <BodyText>
            {row.publicResume ? sourceText("published") : sourceText("private")}{" "}
            {tText("updated")} {row.updatedAt.slice(0, 10)}
          </BodyText>
          <AppButton
            label={tText("editOrView")}
            outline
            onPress={() => {
              setError("");
              setDraft(JSON.parse(JSON.stringify(row)));
            }}
          />
          <ConfirmAction
            label={tText("delete")}
            danger
            message={tText("deleteThisResumePreviouslySubmittedContentWill")}
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
        <BodyText>{tText("noResumesHaveBeenRegistered")}</BodyText>
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
                  {draft.id
                    ? sourceText("editResume")
                    : sourceText("createResume_555")}
                </SectionTitle>
                <AppInput
                  label={tText("title")}
                  required
                  value={draft.title}
                  onChangeText={(v) => field("title", v)}
                  maxLength={120}
                />
                <AppTextArea
                  label={tText("personalSummary")}
                  value={draft.body.summary || ""}
                  onChangeText={(v) =>
                    field("body", { ...draft.body, summary: v })
                  }
                />
                <AppTagInput
                  label={tText("skills")}
                  value={draft.body.skills || []}
                  onValueChange={(v) =>
                    field("body", { ...draft.body, skills: v })
                  }
                />
                <Text>{tText("makeAvailableInCompanyTalentSearch")}</Text>
                <AppSwitch
                  accessibilityLabel={tText("publishResume")}
                  value={draft.publicResume}
                  onValueChange={(v) => field("publicResume", v)}
                />
                <SectionTitle>{tText("workExperience")}</SectionTitle>
                {draft.body.employmentHistory?.map((job, index) => (
                  <Panel key={index}>
                    <AppInput
                      label={tText("employer")}
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
                      label={tText("jobTitleOrPosition")}
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
                      label={tText("startDate")}
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
                      label={tText("endDateBlankIfStillEmployed")}
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
                      label={tText("jobDescription")}
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
                      label={tText("removeWorkExperience")}
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
                  label={tText("addWorkExperience")}
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
                <SectionTitle>{tText("education")}</SectionTitle>
                {draft.body.education?.map((school, index) => (
                  <Panel key={index}>
                    <AppInput
                      label={tText("schoolName")}
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
                      label={tText("departmentOrMajor")}
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
                      label={tText("graduationDate")}
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
                      label={tText("removeEducation")}
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
                  label={tText("addEducation")}
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
                    label={tText("close")}
                    outline
                    onPress={() => {
                      if (!busy) setDraft(null);
                    }}
                  />
                  <AppButton
                    label={busy ? sourceText("saving") : sourceText("save_384")}
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

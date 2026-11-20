import { useState } from "react";
import { Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppPage from "@/components/layout/AppPage";
import {
  AppButton,
  Panel,
  BodyText,
  SectionTitle,
} from "@/components/ui/AppUI";
import { AppSelect, AppTextArea } from "@/components/form";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { JobRow, ResumeRow } from "@/api/models";
export default function ApplyPage() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const { user, token } = useAuth();
  const job = useResource<JobRow | null>(id ? `/jobs/${id}` : null, null);
  const resumes = useResource<ResumeRow[]>(
    token ? "/me/resumes" : null,
    [],
    true,
  );
  const [resumeId, setResumeId] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  async function apply() {
    if (!token || !job.data || busy || done) return;
    if (user?.accountType !== "GENERAL") {
      setError("一般ユーザーのみ応募できます。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await dataRequest("/interactions", token, {
        kind: "application",
        recruitmentId: id,
        resumeId: resumeId || null,
        message,
      });
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage title="求人応募" role="user" subtitle="">
      <ResourceStatus
        loading={job.loading || resumes.loading}
        error={job.error || resumes.error}
        onRetry={() => {
          job.refresh();
          resumes.refresh();
        }}
        privateData
      />
      {job.data && token && (
        <Panel>
          <SectionTitle>{job.data.title}</SectionTitle>
          <BodyText>
            {job.data.companyName} ／ {job.data.location}
          </BodyText>
          {done ? (
            <>
              <BodyText>応募を送信しました。</BodyText>
              <AppButton
                label="選考・オファー状況を開く"
                onPress={() => router.push("/user/applications")}
              />
            </>
          ) : (
            <>
              <AppSelect
                label="提出する経歴書"
                value={resumeId}
                onValueChange={setResumeId}
                options={[
                  { value: "", label: "経歴書を提出しない" },
                  ...resumes.data.map((r) => ({ value: r.id, label: r.title })),
                ]}
                disabled={busy}
              />
              <AppTextArea
                label="企業へのメッセージ"
                value={message}
                onChangeText={setMessage}
                maxLength={8000}
                disabled={busy}
              />
              {!!error && (
                <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                  {error}
                </Text>
              )}
              <AppButton
                label={busy ? "送信中…" : "この内容で応募する"}
                onPress={() => void apply()}
              />
            </>
          )}
        </Panel>
      )}
    </AppPage>
  );
}

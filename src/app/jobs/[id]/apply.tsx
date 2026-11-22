import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useState } from "react";

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
  "use no memo";
  useLocaleVersion();
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
      setError(sourceText("onlyIndividualUsersCanApply"));
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
    <AppPage title={tText("jobApplication")} role="user" subtitle="">
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
          <SectionTitle localize={false}>{job.data.title}</SectionTitle>
          <BodyText localize={false}>
            {job.data.companyName} ／ {job.data.location}
          </BodyText>
          {done ? (
            <>
              <BodyText>{tText("applicationSent")}</BodyText>
              <AppButton
                label={tText("openApplicationsAndOffers")}
                onPress={() => router.push("/user/applications")}
              />
            </>
          ) : (
            <>
              <AppSelect
                label={tText("resumeToSubmit")}
                value={resumeId}
                onValueChange={setResumeId}
                options={[
                  { value: "", label: sourceText("doNotSubmitAResume") },
                  ...resumes.data.map((r) => ({ value: r.id, label: r.title })),
                ]}
                disabled={busy}
              />
              <AppTextArea
                label={tText("messageToTheCompany")}
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
                label={
                  busy ? sourceText("sending") : sourceText("submitApplication")
                }
                onPress={() => void apply()}
              />
            </>
          )}
        </Panel>
      )}
    </AppPage>
  );
}

import { HrButton as AppButton } from "./shared";
import { useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, Pressable } from "@/i18n/native";
import { tText, useLocaleVersion } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import AppPage from "@/components/layout/AppPage";
import { useAuth } from "@/auth/AuthProvider";
import { API_BASE } from "@/auth/api";
import { dataRequest, type Page } from "@/api/platform";
import { useResource, ResourceStatus } from "@/api/useResource";
import { ConfirmAction } from "@/api/ApiUI";
import { AppInput, AppSelect, AppTextArea, AppSwitch } from "@/components/form";
import { Panel, SectionTitle, BodyText } from "@/components/ui/AppUI";
import {
  CompanyPermissionBoundary,
  useCompanyPermission,
} from "../CompanyPermissionBoundary";
import { hs, ActionStatus, useHrAction } from "./shared";
import type { MailTemplate, MailLog } from "./models";
const fresh = (): MailTemplate => ({
  version: 0,
  name: "",
  result: "内定",
  recruitmentId: null,
  recruitmentKind: "*",
  employmentType: "*",
  subject: "【{{company.name}}】{{job.title}}：{{result}}",
  body: "{{user.name}} 様\n\n{{company.name}}です。\n{{job.title}}について、結果は「{{result}}」となりました。\nサービス内のメッセージをご確認ください。\n\n{{company.name}}\n{{company.email}}",
  enabled: true,
});
function Content() {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const permission = useCompanyPermission("applicants");
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ interactionId?: string }>();
  const [form, setForm] = useState<MailTemplate>(fresh),
    [selected, setSelected] = useState(params.interactionId || ""),
    [preview, setPreview] = useState<{
      subject: string;
      body: string;
      variables: string[];
    } | null>(null),
    [previewError, setPreviewError] = useState("");
  const action = useHrAction();
  const templates = useResource<MailTemplate[]>(
      "/company-mail/templates",
      [],
      true,
    ),
    jobs = useResource<{ id: string; title: string }[]>(
      "/company-mail/jobs",
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
  const writable = permission.level >= 2 && !permission.assignedOnly;
  const editable = (key: keyof MailTemplate, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setPreview(null);
    setPreviewError("");
    const timer = setTimeout(() => {
      fetch(`${API_BASE}/api/platform-data/company-mail/preview`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, interactionId: selected }),
        signal: controller.signal,
      })
        .then(async (r) => {
          const value = await r.json();
          if (!r.ok) throw Error(value.message || tText("unableToLoad"));
          if (active) setPreview(value);
        })
        .catch((e) => {
          if (active && e.name !== "AbortError") setPreviewError(e.message);
        });
    }, 350);
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [form.subject, form.body, form.result, selected, token]);
  const all = { value: "*", label: tText("hrAll") };
  return (
    <AppPage
      title={tText("hrMailTemplates")}
      subtitle=""
      role="company"
      activeMenu={sourceText("hrMailTemplates")}
    >
      <ActionStatus {...action} />
      <ResourceStatus
        loading={templates.loading}
        error={templates.error || jobs.error}
        onRetry={() => {
          templates.refresh();
          jobs.refresh();
        }}
        privateData
      />
      <View style={hs.row}>
        <SectionTitle>{tText("hrMailTemplates")}</SectionTitle>
        {writable && (
          <AppButton
            label={tText("hrCreate")}
            onPress={() => setForm(fresh())}
          />
        )}
      </View>
      <BodyText>{tText("hrTemplatePriority")}</BodyText>
      <View style={width >= 1100 ? hs.split : { gap: 16 }}>
        <View style={width >= 1100 ? hs.left : { gap: 10 }}>
          {templates.data.map((row) => (
            <Pressable
              key={row.id}
              accessibilityRole="button"
              accessibilityState={{ selected: form.id === row.id }}
              style={[hs.item, form.id === row.id && hs.selected]}
              onPress={() => setForm({ ...row })}
            >
              <Text localize={false} style={{ fontWeight: "700" }}>
                {row.name}
              </Text>
              <Text>
                {row.result} ／{" "}
                {row.enabled ? tText("hrEnabled") : tText("hrDisabled")}
              </Text>
            </Pressable>
          ))}
          {!templates.data.length && !templates.loading && (
            <BodyText>{tText("hrNoTemplates")}</BodyText>
          )}
        </View>
        <View style={width >= 1100 ? hs.right : { gap: 14 }}>
          <Panel style={hs.card}>
            <AppInput
              label={tText("hrTemplateName")}
              value={form.name}
              onChangeText={(v) => editable("name", v)}
            />
            <View style={hs.row}>
              <View style={hs.field}>
                <AppSelect
                  label={tText("hrResult")}
                  value={form.result}
                  onValueChange={(v) => editable("result", v)}
                  options={[
                    "内定",
                    "不採用",
                    "見送り",
                    "内定取り消し",
                    "内定辞退",
                  ].map((v) => ({ value: v, label: v }))}
                />
              </View>
              <View style={hs.field}>
                <AppSelect
                  label={tText("hrTargetJob")}
                  value={form.recruitmentId || ""}
                  onValueChange={(v) => {
                    editable("recruitmentId", v || null);
                    if (v)
                      setForm((f) => ({
                        ...f,
                        recruitmentKind: "*",
                        employmentType: "*",
                      }));
                  }}
                  options={[
                    { value: "", label: tText("hrNoJobScope") },
                    ...jobs.data.map((j) => ({ value: j.id, label: j.title })),
                  ]}
                />
              </View>
            </View>
            {!form.recruitmentId && (
              <View style={hs.row}>
                <View style={hs.field}>
                  <AppSelect
                    label={tText("hrRecruitmentKind")}
                    value={form.recruitmentKind}
                    onValueChange={(v) => editable("recruitmentKind", v)}
                    options={[
                      all,
                      { value: "JOB", label: tText("hrJob") },
                      {
                        value: "COMPANY_RECRUITMENT",
                        label: tText("hrCompanyRecruitment"),
                      },
                    ]}
                  />
                </View>
                <View style={hs.field}>
                  <AppSelect
                    label={tText("hrEmploymentType")}
                    value={form.employmentType}
                    onValueChange={(v) => editable("employmentType", v)}
                    options={[
                      all,
                      ...employment.data.map((e) => ({
                        value: e.value,
                        label: e.label,
                      })),
                    ]}
                  />
                </View>
              </View>
            )}
            <AppInput
              label={tText("hrSubject")}
              value={form.subject}
              onChangeText={(v) => editable("subject", v)}
            />
            <AppTextArea
              label={tText("hrBody")}
              value={form.body}
              onChangeText={(v) => editable("body", v)}
              numberOfLines={10}
            />
            <BodyText>{tText("hrTemplateFormat")}</BodyText>
            <Text localize={false} style={hs.muted}>
              {(
                preview?.variables || [
                  "company.name",
                  "company.email",
                  "company.address",
                  "user.name",
                  "user.email",
                  "job.title",
                  "job.salary",
                  "job.location",
                  "job.employment",
                  "job.kind",
                  "result",
                ]
              )
                .map((v) => `{{${v}}}`)
                .join("　")}
            </Text>
            <View style={hs.row}>
              <Text>{tText("hrEnabled")}</Text>
              <AppSwitch
                accessibilityLabel={tText("hrEnabled")}
                value={form.enabled}
                onValueChange={(v) => editable("enabled", v)}
              />
            </View>
            {writable && (
              <View style={hs.row}>
                <AppButton
                  label={tText("hrSave")}
                  disabled={action.busy || !form.name.trim() || !!previewError}
                  onPress={() =>
                    void action.run(async () => {
                      const saved = await dataRequest<MailTemplate>(
                        "/company-mail/templates" +
                          (form.id ? "/" + form.id : ""),
                        token,
                        form,
                        form.id ? "PUT" : "POST",
                      );
                      setForm(saved);
                    })
                  }
                />
                {form.id && permission.level >= 3 && (
                  <ConfirmAction
                    ButtonComponent={AppButton}
                    danger
                    label={tText("hrDelete")}
                    message={tText("hrDeleteConfirm")}
                    onConfirm={async () => {
                      await dataRequest(
                        `/company-mail/templates/${form.id}?version=${form.version}`,
                        token,
                        undefined,
                        "DELETE",
                      );
                      setForm(fresh());
                    }}
                  />
                )}
              </View>
            )}
          </Panel>
          <Panel style={hs.card}>
            <SectionTitle>{tText("hrPreview")}</SectionTitle>
            <AppSelect
              label={tText("hrPreviewApplicant")}
              value={selected}
              onValueChange={setSelected}
              options={[
                { value: "", label: tText("hrSample") },
                ...interactions.data.items.map((i) => ({
                  value: i.id,
                  label: i.name + " / " + i.title,
                })),
              ]}
            />
            {!!previewError && (
              <Text accessibilityRole="alert" style={hs.error}>
                {previewError}
              </Text>
            )}
            {preview && (
              <View style={hs.preview}>
                <Text localize={false} style={{ fontWeight: "700" }}>
                  {preview.subject}
                </Text>
                <Text localize={false} style={{ lineHeight: 23 }}>
                  {preview.body}
                </Text>
              </View>
            )}
            <BodyText>{tText("hrForwardNote")}</BodyText>
          </Panel>
          {selected && (
            <Panel style={hs.card}>
              <SectionTitle>{tText("hrMailHistory")}</SectionTitle>
              <ResourceStatus
                loading={logs.loading}
                error={logs.error}
                onRetry={logs.refresh}
              />
              {!logs.data.length && !logs.loading && (
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
                        ButtonComponent={AppButton}
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
            </Panel>
          )}
        </View>
      </View>
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

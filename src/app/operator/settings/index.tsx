import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useEffect, useState } from "react";

import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import AppPage from "@/components/layout/AppPage";
import {
  AppButton,
  Panel,
  BodyText,
  SectionTitle,
} from "@/components/ui/AppUI";
import { AppInput, AppMultiSelect, AppSelect } from "@/components/form";
import {
  ResourceEditor,
  ruleFields,
  type Field,
} from "@/features/operator/ResourceEditor";
export default function OperatorSettings() {
  "use no memo";
  useLocaleVersion();
  const { token } = useAuth();
  const r = useResource<
    {
      key: string;
      value: {
        channels?: string[];
        accessRetentionDays?: number;
        errorRetentionDays?: number;
      };
      version: number;
    }[]
  >(token ? "/operator/settings" : null, [], true);
  const current = r.data.find((s) => s.key === "notifications");
  const [channels, setChannels] = useState<string[]>([]),
    [access, setAccess] = useState("90"),
    [retention, setRetention] = useState("180"),
    [category, setCategory] = useState("prefecture"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  useEffect(() => {
    setChannels(current?.value.channels || []);
    setAccess(String(current?.value.accessRetentionDays ?? 90));
    setRetention(String(current?.value.errorRetentionDays ?? 180));
  }, [current?.version, token]);
  const optionFields: Field[] = [
    {
      key: "category",
      label: sourceText("category"),
      kind: "select",
      choices: [category],
      initial: category,
    },
    { key: "value", label: sourceText("storedValue") },
    { key: "label", label: sourceText("displayLabel") },
    {
      key: "active",
      label: sourceText("enabled"),
      kind: "boolean",
      initial: true,
    },
    {
      key: "sortOrder",
      label: sourceText("displayOrder"),
      kind: "number",
      initial: 0,
    },
  ];
  async function save() {
    if (busy) return;
    if (!/^\d+$/.test(access) || !/^\d+$/.test(retention)) {
      setError(sourceText("enterANonNegativeIntegerForRetention"));
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await dataRequest(
        "/operator/settings/notifications",
        token,
        {
          value: {
            channels,
            accessRetentionDays: Number(access),
            errorRetentionDays: Number(retention),
          },
          version: current?.version ?? 0,
        },
        "PUT",
      );
      setNotice(sourceText("settingsSaved"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage
      title={tText("operatorSettings")}
      subtitle=""
      role="operator"
      activeMenu={sourceText("settings")}
    >
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      {!r.error && token && (
        <>
          <Panel>
            <SectionTitle>{tText("notificationsAndRetention")}</SectionTitle>
            <AppMultiSelect
              label={tText("notificationDestination")}
              value={channels}
              onValueChange={setChannels}
              options={[
                sourceText("email"),
                sourceText("managementConsole"),
              ].map((value) => ({
                value,
                label: value,
              }))}
            />
            <AppInput
              label={tText("accessLogRetentionDays")}
              value={access}
              onChangeText={setAccess}
              keyboardType="number-pad"
            />
            <AppInput
              label={tText("errorLogRetentionDays")}
              value={retention}
              onChangeText={setRetention}
              keyboardType="number-pad"
            />
            <BodyText>{tText("saveNotificationAndRetentionSettings")}</BodyText>
            {!!error && (
              <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                {error}
              </Text>
            )}
            {!!notice && <Text>{notice}</Text>}
            <AppButton
              label={busy ? sourceText("saving") : sourceText("save_384")}
              onPress={() => void save()}
            />
          </Panel>
          <ResourceEditor
            path="/operator/rules"
            title={tText("monitoringConditions")}
            fields={ruleFields}
          />
          <Panel>
            <SectionTitle>{tText("searchAndInputReferenceData")}</SectionTitle>
            <AppSelect
              label={tText("category")}
              value={category}
              onValueChange={setCategory}
              options={[
                ["prefecture", sourceText("prefecture")],
                ["employment", sourceText("employmentType")],
                ["workStyle", sourceText("workArrangements")],
                ["industry", sourceText("industry")],
                ["skill", sourceText("skills")],
                ["requirement", sourceText("requirements")],
              ].map(([value, label]) => ({ value, label }))}
            />
          </Panel>
          <ResourceEditor
            key={category}
            path="/options"
            readPath={`/options?category=${category}`}
            title={tText("options")}
            fields={optionFields}
          />
        </>
      )}
    </AppPage>
  );
}

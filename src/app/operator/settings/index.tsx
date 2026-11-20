import { useEffect, useState } from "react";
import { Text } from "react-native";
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
      label: "区分",
      kind: "select",
      choices: [category],
      initial: category,
    },
    { key: "value", label: "登録値" },
    { key: "label", label: "表示名" },
    { key: "active", label: "有効", kind: "boolean", initial: true },
    { key: "sortOrder", label: "表示順", kind: "number", initial: 0 },
  ];
  async function save() {
    if (busy) return;
    if (!/^\d+$/.test(access) || !/^\d+$/.test(retention)) {
      setError("保存日数は0以上の整数で入力してください。");
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
      setNotice("設定を保存しました。");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppPage title="運営設定" subtitle="" role="operator" activeMenu="設定">
      <ResourceStatus
        loading={r.loading}
        error={r.error}
        onRetry={r.refresh}
        privateData
      />
      {!r.error && token && (
        <>
          <Panel>
            <SectionTitle>通知・保存期間</SectionTitle>
            <AppMultiSelect
              label="通知先"
              value={channels}
              onValueChange={setChannels}
              options={["メール", "管理画面"].map((value) => ({
                value,
                label: value,
              }))}
            />
            <AppInput
              label="アクセス履歴の保存日数"
              value={access}
              onChangeText={setAccess}
              keyboardType="number-pad"
            />
            <AppInput
              label="エラー履歴の保存日数"
              value={retention}
              onChangeText={setRetention}
              keyboardType="number-pad"
            />
            <BodyText>通知・保存期間の設定値を保存します。</BodyText>
            {!!error && (
              <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
                {error}
              </Text>
            )}
            {!!notice && <Text>{notice}</Text>}
            <AppButton
              label={busy ? "保存中…" : "保存"}
              onPress={() => void save()}
            />
          </Panel>
          <ResourceEditor
            path="/operator/rules"
            title="監視条件"
            fields={ruleFields}
          />
          <Panel>
            <SectionTitle>検索・入力の基礎データ</SectionTitle>
            <AppSelect
              label="区分"
              value={category}
              onValueChange={setCategory}
              options={[
                ["prefecture", "都道府県"],
                ["employment", "雇用形態"],
                ["workStyle", "働き方"],
                ["industry", "業種"],
                ["skill", "スキル"],
                ["requirement", "応募条件"],
              ].map(([value, label]) => ({ value, label }))}
            />
          </Panel>
          <ResourceEditor
            key={category}
            path="/options"
            readPath={`/options?category=${category}`}
            title="選択肢"
            fields={optionFields}
          />
        </>
      )}
    </AppPage>
  );
}

import { AppInput, AppSwitch, AppMultiSelect, AppSelect } from "@/components/form";
import AppPage from "@/components/layout/AppPage";
import { SEARCH_COLORS as C } from "@/components/search/theme";
import { AppButton, Panel, SectionTitle } from "@/components/ui/AppUI";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

const initial = [
  {
    name: "APIエラー率",
    range: "5分",
    condition: "5",
    unit: "%",
    enabled: true,
  },
  {
    name: "DB接続エラー",
    range: "10分",
    condition: "20",
    unit: "件",
    enabled: true,
  },
  {
    name: "レスポンス遅延",
    range: "5分",
    condition: "2000",
    unit: "ms",
    enabled: false,
  },
];
export default function OperatorSettingsPage() {
  const [rules, setRules] = useState(initial);
  const [channels,setChannels]=useState(['メール','管理画面']);
  const [accessRetention,setAccessRetention]=useState('90日');
  const [errorRetention,setErrorRetention]=useState('180日');
  return (
    <AppPage
      title="運営設定"
      subtitle="監視条件、通知方法、アラームしきい値を設定します"
      role="operator"
      activeMenu="設定"
    >
      <Panel>
        <View style={s.head}>
          <SectionTitle>エラーアラーム条件</SectionTitle>
          <AppButton
            label="条件を追加"
            onPress={() =>
              Alert.alert("条件追加", "新しいアラーム条件を追加します。")
            }
          />
        </View>
        {rules.map((r, i) => (
          <View key={r.name} style={s.rule}>
            <View style={s.ruleName}>
              <Text style={s.name}>{r.name}</Text>
              <Text style={s.meta}>{r.range}間の集計値</Text>
            </View>
            <View style={s.condition}>
              <Text style={s.when}>しきい値</Text>
              <AppInput
                value={r.condition}
                onChangeText={(v) =>
                  setRules((old) =>
                    old.map((x, n) => (n === i ? { ...x, condition: v } : x)),
                  )
                }
                keyboardType="numeric"
                style={s.input}
              />
              <Text style={s.unit}>{r.unit} 以上</Text>
            </View>
            <AppSwitch accessibilityLabel={`${r.name}を有効にする`}
              value={r.enabled}
              onValueChange={(v) =>
                setRules((old) =>
                  old.map((x, n) => (n === i ? { ...x, enabled: v } : x)),
                )
              }
              trackColor={{ false: C.border, true: C.primarySoft }}
              thumbColor={r.enabled ? C.primary : C.textMuted}
            />
          </View>
        ))}
      </Panel>
      <View style={s.grid}>
        <Panel style={s.card}>
          <SectionTitle>通知先</SectionTitle>
          <Text style={s.label}>運営メールアドレス</Text>
          <AppInput
            defaultValue="operator@globalworkers.jp"
            style={s.fullInput}
          />
          <AppMultiSelect label="通知チャンネル" options={['メール','管理画面','Webhook'].map(value=>({value,label:value}))} value={channels} onValueChange={setChannels}/>
        </Panel>
        <Panel style={s.card}>
          <SectionTitle>監視データ保持期間</SectionTitle>
          <Text style={s.label}>アクセスログ</Text>
          <AppSelect accessibilityLabel="アクセスログの保持期間" value={accessRetention} onValueChange={setAccessRetention} options={["30日","90日","180日","365日"].map(value=>({value,label:value}))}/>
          <Text style={s.label}>エラーログ</Text>
          <AppSelect accessibilityLabel="エラーログの保持期間" value={errorRetention} onValueChange={setErrorRetention} options={["30日","90日","180日","365日"].map(value=>({value,label:value}))}/>
        </Panel>
      </View>
      <View style={s.actions}>
        <AppButton
          label="変更を破棄"
          outline
          onPress={() => {setRules(initial);setChannels(['メール','管理画面']);setAccessRetention('90日');setErrorRetention('180日');}}
        />
        <AppButton
          label="設定を保存"
          onPress={() => Alert.alert("保存完了", "運営設定を保存しました。")}
        />
      </View>
    </AppPage>
  );
}
const s = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  rule: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  ruleName: { flex: 1, minWidth: 150 },
  name: { color: C.text, fontWeight: "900" },
  meta: { color: C.textMuted, fontSize: 10, marginTop: 3 },
  condition: { flexDirection: "row", alignItems: "center", gap: 7 },
  when: { color: C.textSub, fontSize: 11 },
  input: {width: 72,minHeight: 38},
  unit: { width: 55, color: C.textSub, fontSize: 11 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 13 },
  card: { flex: 1, minWidth: 300 },
  label: { color: C.textSub, fontSize: 11, fontWeight: "700" },
  fullInput: {minHeight: 42},
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: C.primarySoft,
    color: C.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    fontSize: 11,
    fontWeight: "800",
  },
  chipOff: {
    backgroundColor: C.background,
    color: C.textMuted,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 99,
    fontSize: 11,
    fontWeight: "800",
  },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
});

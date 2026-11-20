import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { useResource, ResourceStatus } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import {
  Panel,
  SectionTitle,
  BodyText,
  AppButton,
} from "@/components/ui/AppUI";
import { AppInput, AppTextArea, AppSwitch } from "@/components/form";
type PublicCompany = {
  description: string;
  website: string;
  logoUrl: string;
  mark: string;
  markColor: string;
  latitude: number | null;
  longitude: number | null;
  publicCompany: boolean;
  version: number;
};
const empty: PublicCompany = {
  description: "",
  website: "",
  logoUrl: "",
  mark: "",
  markColor: "#2563EB",
  latitude: null,
  longitude: null,
  publicCompany: true,
  version: 0,
};
export default function PublicCompanyEditor() {
  const { token, user } = useAuth();
  const r = useResource<PublicCompany[]>(
    token ? "/me/company-public" : null,
    [],
    true,
  );
  const [draft, setDraft] = useState(empty),
    [lat, setLat] = useState(""),
    [lng, setLng] = useState(""),
    [editing, setEditing] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const saved = r.data[0] ?? empty;
  useEffect(() => {
    if (!editing) {
      setDraft(saved);
      setLat(saved.latitude == null ? "" : String(saved.latitude));
      setLng(saved.longitude == null ? "" : String(saved.longitude));
    }
  }, [r.data, editing]);
  async function save() {
    if (busy) return;
    if (
      !!lat !== !!lng ||
      (lat && !Number.isFinite(Number(lat))) ||
      (lng && !Number.isFinite(Number(lng)))
    ) {
      setError("緯度・経度は両方とも有効な数値で入力してください。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await dataRequest(
        "/me/company-public",
        token,
        {
          ...draft,
          latitude: lat ? Number(lat) : null,
          longitude: lng ? Number(lng) : null,
          version: saved.version,
        },
        "PUT",
      );
      setEditing(false);
      setNotice("公開情報を保存しました。");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel>
      <SectionTitle>企業の公開情報</SectionTitle>
      <ResourceStatus loading={r.loading} error={r.error} onRetry={r.refresh} />
      {editing ? (
        <>
          <AppTextArea
            label="企業紹介"
            value={draft.description}
            maxLength={8000}
            onChangeText={(v) => setDraft((d) => ({ ...d, description: v }))}
          />
          <AppInput
            label="企業サイトURL"
            value={draft.website}
            onChangeText={(v) => setDraft((d) => ({ ...d, website: v }))}
          />
          <AppInput
            label="ロゴ画像URL"
            value={draft.logoUrl}
            onChangeText={(v) => setDraft((d) => ({ ...d, logoUrl: v }))}
          />
          <AppInput
            label="一覧の表示文字"
            value={draft.mark}
            maxLength={8}
            onChangeText={(v) => setDraft((d) => ({ ...d, mark: v }))}
          />
          <AppInput
            label="表示色"
            value={draft.markColor}
            onChangeText={(v) => setDraft((d) => ({ ...d, markColor: v }))}
          />
          <AppInput
            label="拠点の緯度（地図検索用）"
            value={lat}
            onChangeText={setLat}
            keyboardType="numbers-and-punctuation"
          />
          <AppInput
            label="拠点の経度（地図検索用）"
            value={lng}
            onChangeText={setLng}
            keyboardType="numbers-and-punctuation"
          />
          <Text>企業と募集を公開する</Text>
          <AppSwitch
            accessibilityLabel="企業と募集を公開する"
            value={draft.publicCompany}
            onValueChange={(v) => setDraft((d) => ({ ...d, publicCompany: v }))}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <AppButton
              label="キャンセル"
              outline
              onPress={() => {
                if (!busy) setEditing(false);
              }}
            />
            <AppButton
              label={busy ? "保存中…" : "保存"}
              onPress={() => void save()}
            />
          </View>
        </>
      ) : (
        <>
          <BodyText>{saved.description || "企業紹介は未登録です。"}</BodyText>
          <BodyText>{saved.website}</BodyText>
          <BodyText>{saved.publicCompany ? "公開中" : "非公開"}</BodyText>
          {user?.accountType === "COMPANY" && !r.error && (
            <AppButton
              label="公開情報を編集"
              outline
              onPress={() => {
                setNotice("");
                setError("");
                setEditing(true);
              }}
            />
          )}
        </>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
          {error}
        </Text>
      )}
      {!!notice && <Text>{notice}</Text>}
    </Panel>
  );
}

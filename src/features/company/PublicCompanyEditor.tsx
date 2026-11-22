import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useEffect, useState } from "react";
import { View } from "react-native";
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
  "use no memo";
  useLocaleVersion();
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
      setError(sourceText("enterValidNumbersForBothLatitudeAnd"));
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
      setNotice(sourceText("publicInformationSaved"));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel>
      <SectionTitle>{tText("publicCompanyInformation")}</SectionTitle>
      <ResourceStatus loading={r.loading} error={r.error} onRetry={r.refresh} />
      {editing ? (
        <>
          <AppTextArea
            label={tText("companyIntroduction")}
            value={draft.description}
            maxLength={8000}
            onChangeText={(v) => setDraft((d) => ({ ...d, description: v }))}
          />
          <AppInput
            label={tText("companyWebsiteUrl")}
            value={draft.website}
            onChangeText={(v) => setDraft((d) => ({ ...d, website: v }))}
          />
          <AppInput
            label={tText("logoImageUrl")}
            value={draft.logoUrl}
            onChangeText={(v) => setDraft((d) => ({ ...d, logoUrl: v }))}
          />
          <AppInput
            label={tText("companyInitialsForLists")}
            value={draft.mark}
            maxLength={8}
            onChangeText={(v) => setDraft((d) => ({ ...d, mark: v }))}
          />
          <AppInput
            label={tText("displayColor")}
            value={draft.markColor}
            onChangeText={(v) => setDraft((d) => ({ ...d, markColor: v }))}
          />
          <AppInput
            label={tText("officeLatitudeForMapSearch")}
            value={lat}
            onChangeText={setLat}
            keyboardType="numbers-and-punctuation"
          />
          <AppInput
            label={tText("officeLongitudeForMapSearch")}
            value={lng}
            onChangeText={setLng}
            keyboardType="numbers-and-punctuation"
          />
          <Text>{tText("publishCompanyAndPostings")}</Text>
          <AppSwitch
            accessibilityLabel={tText("publishCompanyAndPostings")}
            value={draft.publicCompany}
            onValueChange={(v) => setDraft((d) => ({ ...d, publicCompany: v }))}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <AppButton
              label={tText("cancel")}
              outline
              onPress={() => {
                if (!busy) setEditing(false);
              }}
            />
            <AppButton
              label={busy ? sourceText("saving") : sourceText("save_384")}
              onPress={() => void save()}
            />
          </View>
        </>
      ) : (
        <>
          <BodyText localize={false}>
            {saved.description || tText("noCompanyIntroductionHasBeenAdded")}
          </BodyText>
          <BodyText>{saved.website}</BodyText>
          <BodyText>
            {saved.publicCompany
              ? sourceText("published")
              : sourceText("private")}
          </BodyText>
          {user?.accountType === "COMPANY" && !r.error && (
            <AppButton
              label={tText("editPublicInformation")}
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

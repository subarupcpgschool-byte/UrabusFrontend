import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import {
  AppSwitch,
  AppDatePicker,
  AppInput,
  AppTextArea,
  AppSelect,
  AppTagInput,
} from "@/components/form";
import { AppButton, Panel, SectionTitle } from "@/components/ui/AppUI";
import { useAccount } from "./AccountProvider";
import { profileError, type Profile } from "./data";

export default function ProfilePanel() {
  "use no memo";
  useLocaleVersion();
  const { user } = useAuth();
  const { data, saveProfile } = useAccount();
  const [draft, setDraft] = useState<Profile | null>(data?.profile ?? null);
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  const profileKey = JSON.stringify(data?.profile);
  useEffect(() => {
    setDraft(data?.profile ?? null);
  }, [profileKey]);
  if (!draft) return null;
  const change = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((previous) =>
      previous ? { ...previous, [key]: value } : previous,
    );
    setNotice("");
  };
  const field = (
    key: keyof Omit<
      Profile,
      "skills" | "occupation" | "publicProfile" | "allowScout"
    >,
  ) => ({
    value: draft[key],
    onChangeText: (v: string) => change(key, v),
    disabled: busy,
  });
  async function save() {
    if (!draft || busy) return;
    const invalid = profileError(draft);
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await saveProfile(draft);
      setNotice(sourceText("profileSaved"));
    } catch (e) {
      setError(e instanceof Error ? e.message : sourceText("unableToSave"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={s.stack}>
      <Panel>
        <SectionTitle>{tText("basicProfile")}</SectionTitle>
        <Text style={s.hint}>{tText("yourNameAndDateOfBirthAre")}</Text>
        <View style={s.grid}>
          <AppInput
            label={tText("familyName")}
            required
            {...field("familyName")}
            maxLength={50}
            containerStyle={s.cell}
          />
          <AppInput
            label={tText("givenName")}
            required
            {...field("givenName")}
            maxLength={50}
            containerStyle={s.cell}
          />
        </View>
        <View style={s.grid}>
          <AppInput
            label={tText("familyNameKatakana")}
            {...field("familyKana")}
            maxLength={50}
            containerStyle={s.cell}
          />
          <AppInput
            label={tText("givenNameKatakana")}
            {...field("givenKana")}
            maxLength={50}
            containerStyle={s.cell}
          />
        </View>
        <View style={s.grid}>
          <AppDatePicker
            label={tText("dateOfBirth")}
            required
            value={draft.birthDate}
            onValueChange={(v) => change("birthDate", v)}
            disabled={busy}
            containerStyle={s.cell}
          />
          <AppInput
            label={tText("addressCityOrWardOnly")}
            {...field("city")}
            maxLength={100}
            containerStyle={s.cell}
          />
        </View>
        <View style={s.grid}>
          <AppInput
            label={tText("phoneNumberOptional")}
            keyboardType="phone-pad"
            {...field("phone")}
            maxLength={25}
            containerStyle={s.cell}
          />
          <AppInput
            label={tText("businessNameOptional")}
            {...field("businessName")}
            maxLength={100}
            containerStyle={s.cell}
          />
        </View>
        {user && (
          <AppInput
            label={tText("registeredEmailAddress")}
            value={user.email}
            editable={false}
            hint={tText("theEmailAddressComesFromYourAccount")}
          />
        )}
        <AppSelect
          label={tText("transportation")}
          value={draft.transport}
          onValueChange={(v) => change("transport", v)}
          disabled={busy}
          options={[
            sourceText("notSelected_600"),
            sourceText("car"),
            sourceText("motorcycle"),
            sourceText("publicTransport"),
            sourceText("bicycle"),
            sourceText("walking"),
          ].map((label, i) => ({ label, value: i === 0 ? "" : label }))}
        />
      </Panel>
      <Panel>
        <SectionTitle>{tText("visibilityAndScoutSettings")}</SectionTitle>
        <AppInput
          label={tText("occupation")}
          value={draft.occupation ?? ""}
          onChangeText={(v) => change("occupation", v)}
          maxLength={120}
        />
        <Text>{tText("makeMyProfileAvailableInCompanyTalent")}</Text>
        <AppSwitch
          accessibilityLabel={tText("makeMyProfileAvailableInCompanyTalent")}
          value={draft.publicProfile ?? false}
          onValueChange={(v) => change("publicProfile", v)}
        />
        <Text>{tText("receiveScoutsAndOffers")}</Text>
        <AppSwitch
          accessibilityLabel={tText("receiveScoutsAndOffers")}
          value={draft.allowScout ?? false}
          onValueChange={(v) => change("allowScout", v)}
        />
      </Panel>
      <Panel>
        <SectionTitle>{tText("aboutMeAndSkills")}</SectionTitle>
        <AppTextArea
          label={tText("aboutMe")}
          {...field("bio")}
          maxLength={2000}
        />
        <AppTextArea
          label={tText("hobbiesAndInterests")}
          {...field("hobbies")}
          maxLength={1000}
        />
        <AppTagInput
          label={tText("skills")}
          value={draft.skills}
          onValueChange={(v) => change("skills", v)}
          disabled={busy}
          suggestions={[
            "Java",
            "React",
            "TypeScript",
            "Excel",
            sourceText("design"),
          ]}
        />
      </Panel>
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      {!!notice && (
        <Text accessibilityLiveRegion="polite" style={s.notice}>
          {notice}
        </Text>
      )}
      <View style={s.actions}>
        <AppButton
          label={tText("revertChanges")}
          outline
          onPress={() => {
            if (!busy) {
              setDraft(data?.profile ?? null);
              setError("");
              setNotice("");
            }
          }}
        />
        <AppButton
          label={busy ? sourceText("saving") : sourceText("saveProfile")}
          onPress={() => void save()}
        />
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  stack: { gap: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  cell: { flex: 1, minWidth: 220, maxWidth: "100%" },
  hint: { color: "#64748B", fontSize: 12, lineHeight: 20 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  error: { color: "#B42318" },
  notice: { color: "#13794E" },
});

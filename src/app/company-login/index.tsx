import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AppPage from "@/components/layout/AppPage";
import { AppInput } from "@/components/form";
import {
  AppButton,
  BodyText,
  Panel,
  SectionTitle,
} from "@/components/ui/AppUI";
import { useAuth } from "@/auth/AuthProvider";
import { authRequest, type AuthSession } from "@/auth/api";

export default function EmployeeLogin() {
  "use no memo";
  useLocaleVersion();
  const { ownerId } = useLocalSearchParams<{ ownerId: string }>();
  const { user, ready, acceptSession, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const validLink =
    typeof ownerId === "string" &&
    /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(ownerId);

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : sourceText("unableToCompleteTheAction"),
      );
    } finally {
      setBusy(false);
    }
  }

  async function signIn() {
    if (!validLink || !email.trim() || !password)
      throw new Error(sourceText("enterYourEmailAddressAndPassword"));
    const session = await authRequest<AuthSession>(
      `/company/${ownerId}/login`,
      { email: email.trim(), password },
    );
    await acceptSession(session);
    router.replace("/company");
  }

  return (
    <AppPage title={tText("employeeLogin")} subtitle="">
      <Panel style={{ width: "100%", maxWidth: 480, alignSelf: "center" }}>
        <SectionTitle>{tText("employeeOnlyLogin")}</SectionTitle>
        {!validLink ? (
          <BodyText>{tText("openTheLoginUrlProvidedByYour")}</BodyText>
        ) : !ready ? (
          <BodyText>{tText("loading")}</BodyText>
        ) : user ? (
          <>
            <BodyText>{tText("logOutOfYourCurrentAccountBefore")}</BodyText>
            <AppButton
              label={busy ? sourceText("processing") : sourceText("logOut")}
              onPress={() => void run(logout)}
            />
          </>
        ) : (
          <>
            <AppInput
              label={tText("emailAddress")}
              value={email}
              onChangeText={setEmail}
              editable={!busy}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              maxLength={254}
            />
            <AppInput
              label={tText("password")}
              value={password}
              onChangeText={setPassword}
              editable={!busy}
              secureTextEntry
              autoComplete="current-password"
              maxLength={72}
            />
            <AppButton
              label={busy ? sourceText("processing") : sourceText("logIn")}
              onPress={() => void run(signIn)}
            />
          </>
        )}
        {!!error && <BodyText>{error}</BodyText>}
      </Panel>
    </AppPage>
  );
}

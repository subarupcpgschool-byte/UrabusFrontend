import { translateText } from "@/i18n/display";
import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Pressable, Text } from "@/i18n/native";
import { AppInput, AppCheckbox, AppRadioGroup } from "@/components/form";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AppPage from "@/components/layout/AppPage";
import { Panel } from "@/components/ui/AppUI";
import { SEARCH_COLORS as C } from "@/components/search/theme";
import { authRequest, type AuthSession } from "@/auth/api";
import { useAuth } from "@/auth/AuthProvider";
import { startGoogle, type RegistrationAccountType } from "@/auth/google";
const accountTypes = [
  { label: sourceText("individualUser"), value: "GENERAL" },
  { label: sourceText("company"), value: "COMPANY" },
];

export default function AuthPage() {
  "use no memo";
  useLocaleVersion();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [register, setRegister] = useState(params.mode === "register");
  useEffect(() => {
    setRegister(params.mode === "register");
  }, [params.mode]);
  const [accountType, setAccountType] = useState<RegistrationAccountType | "">(
    "",
  );
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user, acceptSession, logout, ready } = useAuth();
  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : sourceText("theActionFailed"));
    } finally {
      setBusy(false);
    }
  }
  function validEmail() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      throw new Error(sourceText("enterAValidEmailAddress"));
  }
  async function submit() {
    validEmail();
    if (!password) throw new Error(sourceText("enterYourPassword"));
    if (register) {
      if (!accountType) throw new Error(sourceText("selectAnAccountType"));
      if (!name.trim()) throw new Error(sourceText("enterYourName"));
      if (password.length < 8)
        throw new Error(sourceText("useAPasswordWithAtLeast8"));
      if (password !== confirm)
        throw new Error(sourceText("thePasswordConfirmationDoesNotMatch"));
      const result = await authRequest<{ message: string }>("/register", {
        email: email.trim(),
        password,
        displayName: name.trim(),
        accountType,
        businessName:
          accountType === "COMPANY"
            ? businessName.trim() || undefined
            : undefined,
      });
      setPassword("");
      setConfirm("");
      setMessage(result.message);
    } else {
      await acceptSession(
        await authRequest<AuthSession>("/login", {
          email: email.trim(),
          password,
        }),
      );
      setPassword("");
      router.replace("/");
    }
  }
  async function google() {
    if (register && !accountType)
      throw new Error(sourceText("selectAnAccountType"));
    const ticket = await startGoogle(
      register && accountType ? accountType : undefined,
      businessName.trim(),
    );
    if (ticket) {
      router.replace({ pathname: "/auth-callback", params: { ticket } });
    }
  }
  const button = (label: string, onPress: () => void, outline = false) => (
    <Pressable
      accessibilityRole="button"
      disabled={busy || !ready}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        outline && s.outline,
        (pressed || busy || !ready) && { opacity: 0.6 },
      ]}
    >
      <Text style={[s.buttonText, outline && { color: C.text }]}>{label}</Text>
    </Pressable>
  );
  return (
    <AppPage
      title={translateText(
        register ? sourceText("createAnAccount") : sourceText("logIn"),
      )}
      subtitle={tText("getStartedWithGlobalworkersForFree")}
    >
      <View style={s.wrap}>
        <Panel style={s.card}>
          {!ready ? (
            <ActivityIndicator color={C.primary} />
          ) : user ? (
            <>
              <Text style={s.title}>{tText("loggedIn")}</Text>
              <Text localize={false} style={s.info}>
                {user.displayName} {tText("honorific")}
              </Text>
              <Text localize={false} style={s.info}>
                {user.email}
              </Text>
              <Text style={s.info}>
                {user.googleLinked
                  ? sourceText("googleAccountLinked")
                  : sourceText("loggedInWithEmail")}
              </Text>
              {button(sourceText("goToHome"), () => router.replace("/"))}
              {button(sourceText("logOut"), () => void run(logout), true)}
            </>
          ) : (
            <>
              <Text style={s.title}>
                {register
                  ? sourceText("createAFreeAccount")
                  : sourceText("logInToYourAccount")}
              </Text>
              {register && (
                <AppRadioGroup
                  label={tText("accountType")}
                  required
                  options={accountTypes}
                  value={accountType}
                  onValueChange={(value) => {
                    if (value === "GENERAL" || value === "COMPANY")
                      setAccountType(value);
                  }}
                  disabled={busy}
                />
              )}
              {register && accountType === "COMPANY" && (
                <>
                  <AppInput
                    label={tText("businessOrCompanyNameOptional")}
                    value={businessName}
                    onChangeText={setBusinessName}
                    editable={!busy}
                    maxLength={100}
                    placeholder={tText("exampleSubaruStore")}
                  />
                  <Text style={s.info}>
                    {tText("ifYouOperateABusinessYouCan")}
                  </Text>
                </>
              )}
              {(!register || !!accountType) && (
                <>
                  {button(
                    register
                      ? sourceText("signUpWithGoogle")
                      : sourceText("logInWithGoogle"),
                    () => void run(google),
                    true,
                  )}
                  <Text style={s.divider}>
                    {tText("orUseYourEmailAddress")}
                    {register ? sourceText("signUp") : sourceText("logIn")}
                  </Text>
                </>
              )}
              {register && (
                <AppInput
                  label={tText("name")}
                  required
                  accessibilityLabel={tText("name")}
                  value={name}
                  onChangeText={setName}
                  editable={!busy}
                  maxLength={100}
                  placeholder={tText("taroYamada")}
                  style={s.input}
                />
              )}
              <AppInput
                label={tText("emailAddress")}
                required
                accessibilityLabel={tText("emailAddress")}
                value={email}
                onChangeText={setEmail}
                editable={!busy}
                maxLength={254}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                placeholder="example@example.jp"
                style={s.input}
              />
              <AppInput
                label={tText("password")}
                required
                accessibilityLabel={tText("password")}
                value={password}
                onChangeText={setPassword}
                editable={!busy}
                secureTextEntry={!visible}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={register ? "new-password" : "current-password"}
                placeholder={translateText(
                  register
                    ? sourceText("atLeast8Characters")
                    : sourceText("password"),
                )}
                style={s.input}
              />
              {register && (
                <AppInput
                  label={tText("confirmPassword")}
                  required
                  accessibilityLabel={tText("passwordConfirmation")}
                  value={confirm}
                  onChangeText={setConfirm}
                  editable={!busy}
                  secureTextEntry={!visible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={tText("enterAgain")}
                  style={s.input}
                />
              )}
              <AppCheckbox
                label={tText("showPassword")}
                checked={visible}
                onValueChange={setVisible}
                disabled={busy}
              />
              {register && (
                <Text style={s.info}>
                  {tText("openTheLinkInYourVerificationEmail")}
                </Text>
              )}
              {button(
                busy
                  ? sourceText("processing")
                  : register
                    ? sourceText("sendVerificationEmail")
                    : sourceText("logIn"),
                () => void run(submit),
              )}
              <Pressable
                disabled={busy}
                onPress={() => {
                  setRegister((v) => !v);
                  setAccountType("");
                  setBusinessName("");
                  setPassword("");
                  setConfirm("");
                  setMessage("");
                  setError("");
                }}
              >
                <Text style={s.link}>
                  {register
                    ? sourceText("backToLogin")
                    : sourceText("createAccount")}
                </Text>
              </Pressable>
              <Pressable
                disabled={busy}
                onPress={() =>
                  void run(async () => {
                    validEmail();
                    setMessage(
                      (
                        await authRequest<{ message: string }>("/resend", {
                          email: email.trim(),
                        })
                      ).message,
                    );
                  })
                }
              >
                <Text style={s.link}>{tText("resendVerificationEmail")}</Text>
              </Pressable>
            </>
          )}
          {!!message && (
            <Text accessibilityLiveRegion="polite" style={s.success}>
              {message}
            </Text>
          )}
          {!!error && (
            <Text accessibilityRole="alert" style={s.error}>
              {error}
            </Text>
          )}
        </Panel>
      </View>
    </AppPage>
  );
}
const s = StyleSheet.create({
  wrap: {
    minHeight: 560,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  card: { width: "100%", maxWidth: 480, padding: 26, gap: 16 },
  title: {
    textAlign: "center",
    color: C.text,
    fontSize: 23,
    fontWeight: "900",
  },
  field: { gap: 7 },
  label: { color: C.text, fontWeight: "700", fontSize: 14 },
  input: { minHeight: 48 },
  button: {
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  outline: { backgroundColor: C.white, borderColor: C.border, borderWidth: 1 },
  buttonText: { color: C.white, fontWeight: "800", fontSize: 15 },
  link: { textAlign: "center", color: C.primary, fontSize: 13, padding: 6 },
  divider: { textAlign: "center", color: C.textSub },
  info: { color: C.textSub, fontSize: 14, lineHeight: 22 },
  success: {
    color: C.success,
    backgroundColor: C.successSoft,
    padding: 12,
    lineHeight: 22,
  },
  error: {
    color: C.danger,
    padding: 12,
    backgroundColor: "#FDECEC",
    lineHeight: 22,
  },
});

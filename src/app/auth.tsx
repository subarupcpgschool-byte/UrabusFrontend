import { AppTextInput } from "@/components/common/AppTextInput";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import AppPage from "@/components/layout/AppPage";
import { Panel } from "@/components/ui/AppUI";
import { SEARCH_COLORS as C } from "@/components/search/theme";
import { authRequest, type AuthSession } from "@/auth/api";
import { useAuth } from "@/auth/AuthProvider";
import { startGoogle } from "@/auth/google";
export default function AuthPage() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [register, setRegister] = useState(params.mode === "register");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(""); const [name, setName] = useState("");
  const [visible, setVisible] = useState(false); const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const { user, acceptSession, logout, ready } = useAuth();
  async function run(action: () => Promise<void>) {
    if (busy) return; setBusy(true); setError(""); setMessage("");
    try { await action(); } catch (e) { setError(e instanceof Error ? e.message : "処理に失敗しました。"); } finally { setBusy(false); }
  }
  function validEmail() { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error("正しいメールアドレスを入力してください。"); }
  async function submit() {
    validEmail();
    if (!password) throw new Error("パスワードを入力してください。");
    if (register) {
      if (!name.trim()) throw new Error("お名前を入力してください。");
      if (password.length < 8) throw new Error("パスワードは8文字以上で入力してください。");
      if (password !== confirm) throw new Error("確認用パスワードが一致しません。");
      const result = await authRequest<{ message: string }>("/register", { email: email.trim(), password, displayName: name.trim() });
      setPassword(""); setConfirm(""); setMessage(result.message);
    } else {
      await acceptSession(await authRequest<AuthSession>("/login", { email: email.trim(), password }));
      setPassword(""); router.replace("/");
    }
  }
  async function google() {
    const ticket = await startGoogle();
    if (ticket) { router.replace({ pathname: "/auth-callback", params: { ticket } }); }
  }
  const button = (label: string, onPress: () => void, outline = false) => <Pressable accessibilityRole="button" disabled={busy || !ready} onPress={onPress} style={({ pressed }) => [s.button, outline && s.outline, (pressed || busy || !ready) && { opacity: 0.6 }]}><Text style={[s.buttonText, outline && { color: C.text }]}>{label}</Text></Pressable>;
  return <AppPage title={register ? "ユーザー登録" : "ログイン"} subtitle="GlobalWorkersを無料で始めましょう"><View style={s.wrap}><Panel style={s.card}>
    {!ready ? <ActivityIndicator color={C.primary} /> : user ? <>
      <Text style={s.title}>ログイン中</Text><Text style={s.info}>{user.displayName} さん</Text><Text style={s.info}>{user.email}</Text>
      <Text style={s.info}>{user.googleLinked ? "Googleアカウント連携済み" : "メールアドレスでログイン中"}</Text>
      {button("トップ画面へ", () => router.replace("/"))}{button("ログアウト", () => void run(logout), true)}
    </> : <>
      <Text style={s.title}>{register ? "無料ユーザー登録" : "アカウントへログイン"}</Text>
      {button(register ? "Googleで登録する" : "Googleでログイン", () => void run(google), true)}
      <Text style={s.divider}>またはメールアドレスで{register ? "登録" : "ログイン"}</Text>
      {register && <View style={s.field}><Text style={s.label}>お名前</Text><AppTextInput accessibilityLabel="お名前" value={name} onChangeText={setName} editable={!busy} maxLength={100} placeholder="山田 太郎" style={s.input} /></View>}
      <View style={s.field}><Text style={s.label}>メールアドレス</Text><AppTextInput accessibilityLabel="メールアドレス" value={email} onChangeText={setEmail} editable={!busy} maxLength={254} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" placeholder="example@example.jp" style={s.input} /></View>
      <View style={s.field}><Text style={s.label}>パスワード</Text><AppTextInput accessibilityLabel="パスワード" value={password} onChangeText={setPassword} editable={!busy} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} autoComplete={register ? "new-password" : "current-password"} placeholder={register ? "8文字以上" : "パスワード"} style={s.input} /></View>
      {register && <View style={s.field}><Text style={s.label}>パスワード（確認）</Text><AppTextInput accessibilityLabel="確認用パスワード" value={confirm} onChangeText={setConfirm} editable={!busy} secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} placeholder="もう一度入力" style={s.input} /></View>}
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: visible }} onPress={() => setVisible(v => !v)}><Text style={s.link}>{visible ? "パスワードを隠す" : "パスワードを表示"}</Text></Pressable>
      {register && <Text style={s.info}>登録後、確認メールのリンクを開くと承認が完了します。承認後にログインできます。</Text>}
      {button(busy ? "処理中…" : register ? "確認メールを送信" : "ログイン", () => void run(submit))}
      <Pressable disabled={busy} onPress={() => { setRegister(v => !v); setPassword(""); setConfirm(""); setMessage(""); setError(""); }}><Text style={s.link}>{register ? "ログイン画面へ戻る" : "アカウントを作成する"}</Text></Pressable>
      <Pressable disabled={busy} onPress={() => void run(async () => { validEmail(); setMessage((await authRequest<{ message: string }>("/resend", { email: email.trim() })).message); })}><Text style={s.link}>確認メールを再送する</Text></Pressable>
    </>}
    {!!message && <Text accessibilityLiveRegion="polite" style={s.success}>{message}</Text>}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
  </Panel></View></AppPage>;
}
const s = StyleSheet.create({ wrap: { minHeight: 560, paddingVertical: 28, alignItems: "center", justifyContent: "center" }, card: { width: "100%", maxWidth: 480, padding: 26, gap: 16 }, title: { textAlign: "center", color: C.text, fontSize: 23, fontWeight: "900" }, field: { gap: 7 }, label: { color: C.text, fontWeight: "700", fontSize: 14 }, input: { minHeight: 48, borderRadius: 8, borderWidth: 1, borderColor: C.border, paddingHorizontal: 12, color: C.text, fontSize: 15 }, button: { minHeight: 48, borderRadius: 8, backgroundColor: C.primary, alignItems: "center", justifyContent: "center", padding: 12 }, outline: { backgroundColor: C.white, borderColor: C.border, borderWidth: 1 }, buttonText: { color: C.white, fontWeight: "800", fontSize: 15 }, link: { textAlign: "center", color: C.primary, fontSize: 13, padding: 6 }, divider: { textAlign: "center", color: C.textSub }, info: { color: C.textSub, fontSize: 14, lineHeight: 22 }, success: { color: C.success, backgroundColor: C.successSoft, padding: 12, lineHeight: 22 }, error: { color: C.danger, padding: 12, backgroundColor: "#FDECEC", lineHeight: 22 } });

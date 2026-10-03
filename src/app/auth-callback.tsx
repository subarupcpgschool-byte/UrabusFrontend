import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { authRequest, type AuthSession } from "@/auth/api";
import { useAuth } from "@/auth/AuthProvider";
WebBrowser.maybeCompleteAuthSession();
// 同じチケットをStrictModeや複数マウントで二重交換しない
const exchanges = new Map<string, Promise<AuthSession>>();
function exchange(ticket: string) {
  let task = exchanges.get(ticket);
  if (!task) { task = authRequest<AuthSession>("/google/exchange", { ticket }); exchanges.set(ticket, task); setTimeout(() => exchanges.delete(ticket), 120000); }
  return task;
}
export default function AuthCallback() {
  const params = useLocalSearchParams<{ ticket?: string; error?: string }>();
  const { acceptSession, ready } = useAuth(); const [error, setError] = useState(""); const started = useRef(false);
  useEffect(() => {
    if (!ready || started.current) return; started.current = true;
    if (params.error || !params.ticket || typeof params.ticket !== "string") { setError("Googleログインを完了できませんでした。手動登録済みの場合は先に確認メールを開いてから再試行してください。"); return; }
    void exchange(params.ticket).then(acceptSession).then(() => router.replace("/")).catch(e => setError(e instanceof Error ? e.message : "ログインに失敗しました。"));
  }, [ready, params.ticket, params.error, acceptSession]);
  return <View style={{ flex: 1, padding: 28, gap: 20, alignItems: "center", justifyContent: "center" }}>{error ? <><Text accessibilityRole="alert" style={{ color: "#B42318", fontSize: 16 }}>{error}</Text><Pressable onPress={() => router.replace("/auth")}><Text style={{ color: "#208AEF", padding: 16 }}>ログイン画面へ戻る</Text></Pressable></> : <><ActivityIndicator size="large" /><Text>Googleアカウントを確認しています…</Text></>}</View>;
}

import { Platform } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { API_BASE } from "./api";
export type RegistrationAccountType = "GENERAL" | "COMPANY";

export async function startGoogle(accountType?: RegistrationAccountType): Promise<string | null> {
  const registrationQuery = accountType ? `&mode=register&accountType=${encodeURIComponent(accountType)}` : "";
  const url = `${API_BASE}/api/platform-auth/google/start?platform=${Platform.OS === "web" ? "web" : "native"}${registrationQuery}`;
  if (Platform.OS === "web") { window.location.assign(url); return null; }
  const redirect = Linking.createURL("auth-callback");
  const result = await WebBrowser.openAuthSessionAsync(url, redirect);
  if (result.type !== "success") return null;
  const parsed = Linking.parse(result.url);
  if (parsed.queryParams?.error) throw new Error("Googleログインを完了できませんでした。手動登録済みの場合は確認メールを開いてください。");
  const ticket = parsed.queryParams?.ticket;
  return typeof ticket === "string" ? ticket : null;
}

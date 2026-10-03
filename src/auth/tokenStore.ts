import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
const KEY = "globalworkers.auth.token";
export async function readToken(): Promise<string | null> {
  if (Platform.OS === "web") return typeof window === "undefined" ? null : window.sessionStorage.getItem(KEY);
  return SecureStore.getItemAsync(KEY);
}
export async function writeToken(value: string | null) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") { if (value) window.sessionStorage.setItem(KEY, value); else window.sessionStorage.removeItem(KEY); }
    return;
  }
  if (value) await SecureStore.setItemAsync(KEY, value); else await SecureStore.deleteItemAsync(KEY);
}

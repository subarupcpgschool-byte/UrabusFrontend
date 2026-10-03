export const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
export type AuthUser = { id: string; email: string; displayName: string; emailVerified: boolean; googleLinked: boolean };
export type AuthSession = { accessToken: string; tokenType: string; expiresAt: string; user: AuthUser };
export async function authRequest<T>(path: string, body?: unknown, token?: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${API_BASE}/api/platform-auth${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "処理できませんでした。しばらくしてから再試行してください。");
    return result as T;
  } catch (error) {
    if (error instanceof TypeError || (error instanceof Error && error.name === "AbortError")) {
      throw new Error("サーバーに接続できません。通信状態を確認してください。");
    }
    throw error;
  } finally { clearTimeout(timer); }
}

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { authRequest, type AuthSession, type AuthUser } from "./api";
import { readToken, writeToken } from "./tokenStore";
type AuthContextValue = {
  user: AuthUser | null; token: string | null; ready: boolean;
  acceptSession: (session: AuthSession) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const revision = useRef(0);
  useEffect(() => {
    const rev = revision.current;
    let active = true;
    (async () => {
      try {
        const stored = await readToken();
        if (stored) {
          const current = await authRequest<AuthUser>("/me", undefined, stored);
          if (active && revision.current === rev) { setToken(stored); setUser(current); }
        }
      } catch { /* 通信エラーでは保存済みトークンを消さず、次回の起動で再確認する */ }
      finally { if (active) setReady(true); }
    })();
    return () => { active = false; };
  }, []);
  async function acceptSession(session: AuthSession) {
    revision.current++;
    await writeToken(session.accessToken); setToken(session.accessToken); setUser(session.user); setReady(true);
  }
  async function logout() {
    if (token) await authRequest("/logout", {}, token); // サーバーのセッションを失効させる
    revision.current++;
    await writeToken(null); setToken(null); setUser(null);
  }
  return <AuthContext.Provider value={{ user, token, ready, acceptSession, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const auth = useContext(AuthContext); if (!auth) throw new Error("AuthProviderが必要です。"); return auth;
}

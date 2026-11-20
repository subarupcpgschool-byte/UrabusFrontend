import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useResource } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { EvaluationRow } from "@/api/models";
import { validateDraft, type Evaluation, type EvaluationDraft } from "./model";
type Context = {
  records: Evaluation[];
  ready: boolean;
  error: string;
  now: number;
  submit: (id: string, draft: EvaluationDraft) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
const C = createContext<Context | null>(null);
export function EvaluationProvider({ children }: { children: ReactNode }) {
  const { token, user, ready } = useAuth();
  const [now, setNow] = useState(Date.now);
  const resource = useResource<EvaluationRow[]>(
    token && user?.accountType === "GENERAL" ? "/evaluations" : null,
    [],
    true,
  );
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const records: Evaluation[] = resource.data
    .filter((r) => r.direction === "USER_TO_COMPANY")
    .map((r) => ({
      id: r.id,
      version: r.version,
      applicationId: r.interactionId,
      company: r.company,
      mode: r.mode,
      total: Number(r.total),
      answers: r.answers && "response" in r.answers ? r.answers : null,
      submittedAt: r.submittedAt,
      publishAt: r.publishAt,
    }));
  async function submit(id: string, draft: EvaluationDraft) {
    if (!token) throw new Error("ログインしてください。");
    const invalid = validateDraft(draft);
    if (invalid) throw new Error(invalid);
    const existing = resource.data.find(
      (r) => r.interactionId === id && r.direction === "USER_TO_COMPANY",
    );
    await dataRequest(
      existing ? `/evaluations/${existing.id}` : "/evaluations",
      token,
      {
        interactionId: id,
        answers: draft,
        comment: "",
        version: existing?.version ?? 0,
      },
      existing ? "PUT" : "POST",
    );
    setNow(Date.now());
  }
  return (
    <C.Provider
      value={{
        records,
        ready: ready && (!token || resource.loaded),
        error: resource.error,
        now,
        submit,
        remove: async (applicationId) => {
          const record = resource.data.find(
            (r) =>
              r.interactionId === applicationId &&
              r.direction === "USER_TO_COMPANY",
          );
          if (!record || record.mode === "automatic")
            throw new Error("削除できる手動評価が見つかりません。");
          await dataRequest(
            `/evaluations/${record.id}?version=${record.version}`,
            token,
            undefined,
            "DELETE",
          );
        },
      }}
    >
      {children}
    </C.Provider>
  );
}
export function useEvaluations() {
  const c = useContext(C);
  if (!c) throw new Error("EvaluationProviderが必要です");
  return c;
}

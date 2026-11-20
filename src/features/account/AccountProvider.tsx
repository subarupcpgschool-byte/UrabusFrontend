import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useResource } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import type { ContractRow, EvaluationRow } from "@/api/models";
import {
  createAccountData,
  profileError,
  reviewError,
  type AccountData,
  type Contract,
  type Profile,
  type ReceivedReview,
} from "./data";
type SavedProfile = Profile & {
  occupation: string;
  publicProfile: boolean;
  allowScout: boolean;
  version: number;
};
type Context = {
  data: AccountData | null;
  ready: boolean;
  error: string;
  mockMode: boolean;
  contracts: Contract[];
  received: ReceivedReview[];
  saveProfile: (profile: Profile) => Promise<void>;
  saveReview: (
    contractId: string,
    rating: number,
    comment: string,
  ) => Promise<void>;
  refresh: () => void;
};
const C = createContext<Context | null>(null);
export function AccountProvider({ children }: { children: ReactNode }) {
  const { user, token, ready } = useAuth();
  const enabled = !!token && user?.accountType === "GENERAL";
  const profile = useResource<SavedProfile[]>(
    enabled ? "/me/profile" : null,
    [],
    true,
  );
  const contracts = useResource<ContractRow[]>(
    enabled ? "/contracts" : null,
    [],
    true,
  );
  const reviews = useResource<EvaluationRow[]>(
    enabled ? "/evaluations" : null,
    [],
    true,
  );
  const base = createAccountData(user?.displayName ?? "", false);
  const rows: Contract[] = contracts.data.map((c) => ({
    id: c.id,
    kind: c.recruitmentId ? "job" : "company",
    companyId: c.ownerId,
    company: c.company,
    jobId: c.recruitmentId ?? undefined,
    title: c.title,
    period: `${c.startDate || "未定"}〜${c.endDate || ""}`,
    status: c.status,
  }));
  const saved = profile.data[0];
  const data: AccountData = {
    profile: saved ?? base.profile,
    written: reviews.data
      .filter(
        (r) =>
          r.direction === "USER_TO_COMPANY" &&
          contracts.data.some((c) => c.interactionId === r.interactionId),
      )
      .map((r) => ({
        contractId: contracts.data.find(
          (c) => c.interactionId === r.interactionId,
        )!.id,
        mode: r.mode,
        rating: Number(r.total),
        comment: r.comment,
        updatedAt: r.submittedAt,
      })),
  };
  const received = reviews.data
    .filter((r) => r.direction === "COMPANY_TO_USER" && r.contractId)
    .map((r) => ({
      id: r.id,
      contractId: r.contractId!,
      date: r.submittedAt.slice(0, 10),
      rating: Number(r.total),
      comment: r.comment,
      scores: r.scores || [],
    }));
  return (
    <C.Provider
      value={{
        data: enabled ? data : null,
        ready:
          ready &&
          (!enabled || (profile.loaded && contracts.loaded && reviews.loaded)),
        error: profile.error || contracts.error || reviews.error,
        mockMode: false,
        contracts: rows,
        received,
        refresh: () => {
          profile.refresh();
          contracts.refresh();
          reviews.refresh();
        },
        saveProfile: async (p) => {
          if (!token) throw new Error("ログインしてください。");
          const error = profileError(p);
          if (error) throw new Error(error);
          await dataRequest(
            "/me/profile",
            token,
            {
              ...p,
              occupation: p.occupation ?? saved?.occupation ?? "",
              publicProfile: p.publicProfile ?? saved?.publicProfile ?? false,
              allowScout: p.allowScout ?? saved?.allowScout ?? false,
              version: saved?.version ?? 0,
            },
            "PUT",
          );
        },
        saveReview: async (contractId, rating, comment) => {
          if (!token) throw new Error("ログインしてください。");
          const error = reviewError(rating, comment);
          if (error) throw new Error(error);
          const prior = reviews.data.find(
            (r) =>
              (r.contractId === contractId ||
                contracts.data.find((c) => c.id === contractId)
                  ?.interactionId === r.interactionId) &&
              r.direction === "USER_TO_COMPANY",
          );
          await dataRequest(
            prior ? `/evaluations/${prior.id}` : "/evaluations",
            token,
            {
              contractId,
              rating,
              comment,
              scores: prior?.scores ?? [],
              version: prior?.version ?? 0,
            },
            prior ? "PUT" : "POST",
          );
        },
      }}
    >
      {children}
    </C.Provider>
  );
}
export function useAccount() {
  const c = useContext(C);
  if (!c) throw new Error("AccountProviderが必要です");
  return c;
}

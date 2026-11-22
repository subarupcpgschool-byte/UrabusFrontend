import { sourceText } from "@/i18n/source";
import { API_BASE } from "@/auth/api";
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
let revision = 0;
const listeners = new Set<() => void>();
export const dataRevision = () => revision;
export function subscribeData(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function invalidateData() {
  revision++;
  listeners.forEach((listener) => listener());
}
export async function dataRequest<T>(
  path: string,
  token?: string | null,
  body?: unknown,
  method: "GET" | "POST" | "PUT" | "DELETE" = body === undefined
    ? "GET"
    : "POST",
  signal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort);
  if (signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 60000);
  const multipart = typeof FormData !== "undefined" && body instanceof FormData;
  try {
    const response = await fetch(`${API_BASE}/api/platform-data${path}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body === undefined || multipart
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: multipart
        ? body
        : body === undefined
          ? undefined
          : JSON.stringify(body),
      signal: controller.signal,
    });
    const value =
      response.status === 204
        ? undefined
        : await response.json().catch(() => ({}));
    if (!response.ok)
      throw new ApiError(
        value?.message || sourceText("unableToCompleteTheActionPleaseReload"),
        response.status,
      );
    if (method !== "GET") invalidateData();
    return value as T;
  } catch (error) {
    if (
      error instanceof TypeError ||
      (error instanceof Error && error.name === "AbortError")
    )
      throw new Error(sourceText("cannotConnectToTheServerCheckThe"));
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
export const query = (values: Record<string, string | number | undefined>) =>
  new URLSearchParams(
    Object.entries(values)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();

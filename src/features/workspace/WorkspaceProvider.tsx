import { sourceText } from "@/i18n/source";
import { useLocaleVersion } from "@/i18n/display";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useResource } from "@/api/useResource";
import { dataRequest } from "@/api/platform";
import {
  jobItem,
  companyItem,
  type JobRow,
  type CompanyRow,
} from "@/api/models";
import type {
  CompanySearchItem,
  JobSearchItem,
} from "@/components/search/types";
export type Favorite = {
  key: string;
  kind: "company" | "job";
  item: CompanySearchItem | JobSearchItem;
  savedAt: number;
};
export type Attachment = {
  id: string;
  name: string;
  uri: string;
  mime: string;
  size: number;
};
export type Message = {
  id: string;
  text: string;
  attachments: Attachment[];
  at: number;
  mine: boolean;
  version?: number;
};
export type Room = {
  id: string;
  kind: "company" | "job";
  company: string;
  title: string;
  unread: number;
  archived: boolean;
  messages: Message[];
  createdAt: number;
  version?: number;
};
export type WorkspaceState = { favorites: Favorite[]; rooms: Room[] };
type FavoriteRow = {
  kind: Favorite["kind"];
  targetId: string;
  item: JobRow | CompanyRow | null;
  savedAt: string;
  available: boolean;
};
type RoomRow = Omit<Room, "messages" | "createdAt"> & {
  createdAt: string;
  updatedAt: string;
};
type Context = WorkspaceState & {
  ready: boolean;
  error: string;
  mockMode: boolean;
  resetMock: () => void;
  toggleFavorite: (
    kind: Favorite["kind"],
    item: Favorite["item"],
  ) => Promise<void>;
  openRoom: (
    kind: Room["kind"],
    id: string,
    company: string,
    title: string,
  ) => Promise<string>;
  send: (
    roomId: string,
    text: string,
    attachments: Attachment[],
  ) => Promise<void>;
  read: (id: string) => Promise<void>;
  archive: (id: string) => Promise<void>;
  refresh: () => void;
};
const C = createContext<Context | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  "use no memo";
  useLocaleVersion();
  const { token, ready: authReady } = useAuth();
  const favorites = useResource<FavoriteRow[]>(
    token ? "/favorites" : null,
    [],
    true,
  );
  const rooms = useResource<RoomRow[]>(token ? "/rooms" : null, [], true);
  const [problem, setProblem] = useState<{
    token: string | null;
    message: string;
  }>({ token: null, message: "" });
  const list = useMemo(
    () =>
      favorites.data
        .filter((f) => f.available && f.item)
        .map((f) => ({
          key: `${f.kind}:${f.targetId}`,
          kind: f.kind,
          item:
            f.kind === "job"
              ? jobItem(f.item as JobRow)
              : companyItem(f.item as CompanyRow),
          savedAt: Date.parse(f.savedAt),
        })),
    [favorites.data],
  );
  const roomItems = useMemo(
    () =>
      rooms.data.map((r) => ({
        ...r,
        messages: [],
        createdAt: Date.parse(r.updatedAt || r.createdAt),
        unread: Number(r.unread),
      })),
    [rooms.data],
  );
  async function execute<T>(operation: () => Promise<T>) {
    if (!token) throw new Error(sourceText("pleaseLogIn"));
    setProblem({ token, message: "" });
    try {
      return await operation();
    } catch (e) {
      setProblem({
        token,
        message:
          e instanceof Error
            ? e.message
            : sourceText("unableToCompleteTheAction"),
      });
      throw e;
    }
  }
  const value: Context = {
    favorites: list,
    rooms: roomItems,
    ready: authReady && (!token || (favorites.loaded && rooms.loaded)),
    error:
      favorites.error ||
      rooms.error ||
      (problem.token === token ? problem.message : ""),
    mockMode: false,
    resetMock: () => {},
    refresh: () => {
      favorites.refresh();
      rooms.refresh();
    },
    toggleFavorite: async (kind, item) =>
      execute(async () => {
        const active = list.some((f) => f.key === `${kind}:${item.id}`);
        await dataRequest(
          active ? `/favorites/${kind}/${item.id}` : "/favorites",
          token,
          active ? undefined : { kind, targetId: String(item.id) },
          active ? "DELETE" : "POST",
        );
      }),
    openRoom: async (kind, id, _company, title) =>
      execute(async () => {
        const room = await dataRequest<{ id: string }>("/rooms", token, {
          kind,
          targetId: id,
          title,
        });
        return room.id;
      }),
    send: async (id, text, attachments) =>
      execute(async () => {
        await dataRequest(`/rooms/${id}/messages`, token, {
          text,
          attachmentIds: attachments.map((a) => a.id),
          version: 0,
        });
      }),
    read: async (id) =>
      execute(async () => {
        await dataRequest(`/rooms/${id}/read`, token, {}, "POST");
      }),
    archive: async (id) =>
      execute(async () => {
        const room = roomItems.find((r) => r.id === id);
        await dataRequest(
          `/rooms/${id}/archive`,
          token,
          { archived: !room?.archived },
          "PUT",
        );
      }),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export function useWorkspace() {
  const c = useContext(C);
  if (!c) throw new Error(sourceText("workspaceproviderIsRequired"));
  return c;
}

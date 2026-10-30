import { createMockWorkspace, WORKSPACE_MOCK_ENABLED } from './mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/auth/AuthProvider';
import type { CompanySearchItem, JobSearchItem } from '@/components/search/types';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
export type Favorite = { key: string; kind: 'company' | 'job'; item: CompanySearchItem | JobSearchItem; savedAt: number };
export type Attachment = { id: string; name: string; uri: string; mime: string; size: number };
export type Message = { id: string; text: string; attachments: Attachment[]; at: number; mine: boolean };
export type Room = { id: string; kind: 'company' | 'job'; company: string; title: string; unread: number; archived: boolean; messages: Message[]; createdAt: number };
export type WorkspaceState = { favorites: Favorite[]; rooms: Room[] };
const empty = (): WorkspaceState => ({ favorites: [], rooms: [] });
type Context = WorkspaceState & { ready: boolean; error: string; mockMode: boolean; resetMock: () => void; toggleFavorite: (kind: Favorite['kind'], item: Favorite['item']) => void; openRoom: (kind: Room['kind'], id: string, company: string, title: string) => string; send: (roomId: string, text: string, attachments: Attachment[]) => void; read: (id: string) => void; archive: (id: string) => void };
const WorkspaceContext = createContext<Context | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
 const { user, ready: authReady } = useAuth();
 const key = authReady && (user || WORKSPACE_MOCK_ENABLED) ? `globalworkers.workspace.${WORKSPACE_MOCK_ENABLED ? "mock.v1" : "v1"}.${user?.id || "guest"}` : null;
 const [loadedKey, setLoadedKey] = useState<string | null>(null), [data, setData] = useState<WorkspaceState>(empty), [error, setError] = useState('');
 const queue = useRef(Promise.resolve());
 useEffect(() => { let active = true; setLoadedKey(null); setData(empty()); setError(''); if (!key) return;
  queue.current.then(() => AsyncStorage.getItem(key)).then(raw => { if (!active) return; const value = raw ? JSON.parse(raw) : WORKSPACE_MOCK_ENABLED ? createMockWorkspace() : empty(); if (!Array.isArray(value.favorites) || !Array.isArray(value.rooms)) throw new Error('invalid saved state'); setData(value); setLoadedKey(key); }).catch(() => { if(active) setError('保存データを読み込めませんでした。再度開いてください。'); });
  return () => { active = false; };
 }, [key]);
 const ready = !!key && key === loadedKey;
 const commit = (change: (state: WorkspaceState) => WorkspaceState) => { if (!ready || !key) return; setData(previous => change(previous)); };
 // Writes are ordered; the account key is captured so account switches cannot overwrite another user.
 useEffect(() => { if (!ready || !key) return; const value = JSON.stringify(data); queue.current = queue.current.then(() => AsyncStorage.setItem(key, value)).catch(() => setError('保存できませんでした。端末の空き容量を確認してください。')); }, [data, ready, key]);
 const toggleFavorite: Context['toggleFavorite'] = (kind, item) => commit(s => { const k = `${kind}:${item.id}`; return { ...s, favorites: s.favorites.some(f => f.key === k) ? s.favorites.filter(f => f.key !== k) : [{ key:k, kind, item, savedAt:Date.now() }, ...s.favorites] }; });
 const openRoom: Context['openRoom'] = (kind, id, company, title) => { const roomId = `${kind}:${id}`; commit(s => s.rooms.some(r => r.id === roomId) ? s : { ...s, rooms: [{ id:roomId, kind, company, title, unread:0, archived:false, messages:[], createdAt:Date.now() }, ...s.rooms] }); return roomId; };
 const send: Context['send'] = (id, text, attachments) => { if (!text.trim() && !attachments.length) return; commit(s => ({ ...s, rooms:s.rooms.map(r => r.id !== id ? r : { ...r, archived:false, messages:[...r.messages, { id:`${Date.now()}-${Math.random().toString(36).slice(2)}`, text:text.trim(), attachments, at:Date.now(), mine:true }] }) })); };
 const read = (id: string) => commit(s => s.rooms.some(r => r.id === id && r.unread) ? { ...s, rooms:s.rooms.map(r => r.id === id ? { ...r, unread:0 } : r) } : s);
 const archive = (id: string) => commit(s => ({ ...s, rooms:s.rooms.map(r => r.id === id ? { ...r, archived:!r.archived } : r) }));
 return <WorkspaceContext.Provider value={{ ...(ready ? data : empty()), ready, error, mockMode:WORKSPACE_MOCK_ENABLED, resetMock:() => { if(WORKSPACE_MOCK_ENABLED) commit(() => createMockWorkspace()); }, toggleFavorite, openRoom, send, read, archive }}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() { const context = useContext(WorkspaceContext); if (!context) throw new Error('WorkspaceProviderが必要です'); return context; }

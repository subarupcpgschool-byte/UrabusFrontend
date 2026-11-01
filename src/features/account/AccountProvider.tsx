import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@/auth/AuthProvider';
import { WORKSPACE_MOCK_ENABLED } from '@/features/workspace/mockData';
import { CONTRACTS, RECEIVED, createAccountData, profileError, reviewError, isAccountData, type AccountData, type Contract, type Profile, type ReceivedReview } from './data';

type Context = {
  data: AccountData | null; ready: boolean; error: string; mockMode: boolean;
  contracts: Contract[]; received: ReceivedReview[];
  saveProfile: (profile: Profile) => Promise<void>;
  saveReview: (contractId: string, rating: number, comment: string) => Promise<void>;
};
const AccountContext = createContext<Context | null>(null);
export function AccountProvider({ children }: { children: ReactNode }) {
  const { user, ready: authReady } = useAuth();
  const mockMode = WORKSPACE_MOCK_ENABLED;
  const key = authReady && (user || mockMode) ? `globalworkers.account.${mockMode ? 'mock' : 'live'}.v1.${user?.id ?? 'guest'}` : null;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [data, setData] = useState<AccountData | null>(null);
  const [error, setError] = useState('');
  const keyRef = useRef(key); keyRef.current = key;
  const dataRef = useRef<AccountData | null>(null);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true; setLoadedKey(null); setData(null); dataRef.current = null; setError('');
    if (!key) return;
    queue.current.then(() => AsyncStorage.getItem(key)).then(raw => {
      if (!active) return;
      const value: AccountData = raw ? JSON.parse(raw) : createAccountData(user?.displayName ?? '', mockMode);
      if (!isAccountData(value)) throw new Error('Invalid account state');
      dataRef.current = value; setData(value); setLoadedKey(key);
    }).catch(() => { if (active) setError('プロフィールを読み込めませんでした。再読み込みしてください。'); });
    return () => { active = false; };
  }, [key]);
  const ready = !!key && loadedKey === key;
  function save(change: (previous: AccountData) => AccountData): Promise<void> {
    const owner = key;
    if (!ready || !owner) return Promise.reject(new Error('読み込みが完了してから操作してください。'));
    const operation = queue.current.then(async () => {
      if (keyRef.current !== owner || !dataRef.current) throw new Error('アカウントが切り替わりました。');
      const next = change(dataRef.current);
      await AsyncStorage.setItem(owner, JSON.stringify(next));
      if (keyRef.current === owner) { dataRef.current = next; setData(next); }
    });
    queue.current = operation.catch(() => {});
    return operation;
  }
  return <AccountContext.Provider value={{ data: ready ? data : null, ready, error, mockMode,
    contracts: mockMode ? CONTRACTS : [], received: mockMode ? RECEIVED : [],
    saveProfile: async profile => {
      const error = profileError(profile); if (error) throw new Error(error);
      await save(previous => ({ ...previous, profile }));
    },
    saveReview: async (contractId, rating, comment) => {
      if (!mockMode || !CONTRACTS.some(c => c.id === contractId)) throw new Error('評価できる契約が見つかりません。');
      const error = reviewError(rating, comment); if (error) throw new Error(error);
      await save(previous => ({ ...previous, written: [...previous.written.filter(r => r.contractId !== contractId), { contractId, rating, comment: comment.trim(), updatedAt: new Date().toISOString() }] }));
    },
  }}>{children}</AccountContext.Provider>;
}
export function useAccount() { const context = useContext(AccountContext); if (!context) throw new Error('AccountProviderが必要です'); return context; }

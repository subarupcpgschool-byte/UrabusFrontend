import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AppPage from '@/components/layout/AppPage';
import { AppInput } from '@/components/form';
import { AppButton, BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';
import { useAuth } from '@/auth/AuthProvider';
import { authRequest, type AuthSession } from '@/auth/api';

export default function EmployeeLogin() {
  const { ownerId } = useLocalSearchParams<{ ownerId: string }>();
  const { user, ready, acceptSession, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const validLink = typeof ownerId === 'string' && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(ownerId);

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError('');
    try { await action(); }
    catch (e) { setError(e instanceof Error ? e.message : '処理できませんでした。'); }
    finally { setBusy(false); }
  }

  async function signIn() {
    if (!validLink || !email.trim() || !password) throw new Error('メールアドレスとパスワードを入力してください。');
    const session = await authRequest<AuthSession>(`/company/${ownerId}/login`, { email: email.trim(), password });
    await acceptSession(session);
    router.replace('/company');
  }

  return <AppPage title="従業員ログイン" subtitle="">
    <Panel style={{ width: '100%', maxWidth: 480, alignSelf: 'center' }}>
      <SectionTitle>従業員専用ログイン</SectionTitle>
      {!validLink ? <BodyText>企業から発行されたログインURLを開いてください。</BodyText> :
        !ready ? <BodyText>読み込み中…</BodyText> :
        user ? <>
          <BodyText>ログイン中のアカウントからログアウトして、従業員アカウントでログインしてください。</BodyText>
          <AppButton label={busy ? '処理中…' : 'ログアウト'} onPress={() => void run(logout)} />
        </> : <>
          <AppInput label="メールアドレス" value={email} onChangeText={setEmail} editable={!busy}
            autoCapitalize="none" keyboardType="email-address" autoComplete="email" maxLength={254} />
          <AppInput label="パスワード" value={password} onChangeText={setPassword} editable={!busy}
            secureTextEntry autoComplete="current-password" maxLength={72} />
          <AppButton label={busy ? '処理中…' : 'ログイン'} onPress={() => void run(signIn)} />
        </>}
      {!!error && <BodyText>{error}</BodyText>}
    </Panel>
  </AppPage>;
}

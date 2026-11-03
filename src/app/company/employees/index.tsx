import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { AppInput } from '@/components/form';
import { AppButton, BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';
import { useAuth } from '@/auth/AuthProvider';
import { authRequest, type AuthUser } from '@/auth/api';

const emptyForm = { displayName: '', email: '', password: '' };

export default function EmployeePage() {
  const { user, token, ready } = useAuth();
  const canManage = user?.accountType === 'COMPANY' && !!user.businessName && !!token;
  return <AppPage title="従業員管理" subtitle="" role="company" activeMenu="従業員管理">
    {!ready ? <BodyText>読み込み中…</BodyText> : canManage && user && token ?
      <EmployeeManager key={token} user={user} token={token} /> :
      <Panel>
        <SectionTitle>従業員管理</SectionTitle>
        <BodyText>屋号・法人名を登録した企業アカウントで利用できます。</BodyText>
        {!user && <Link href="/auth">ログインする</Link>}
      </Panel>}
  </AppPage>;
}

function EmployeeManager({ user, token }: { user: AuthUser; token: string }) {
  const [items, setItems] = useState<AuthUser[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const route = `/company-login?ownerId=${encodeURIComponent(user.id)}`;
  const origin = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin :
    process.env.EXPO_PUBLIC_WEB_BASE_URL?.replace(/\/$/, '');
  const loginUrl = origin ? `${origin}${route}` : route;

  useEffect(() => {
    let active = true;
    authRequest<AuthUser[]>('/employees', undefined, token)
      .then(list => { if (active) setItems(list); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [token]);

  async function run(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    try { await action(); }
    catch (e) { setError(e instanceof Error ? e.message : '処理できませんでした。'); }
    finally { setBusy(false); }
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
  }

  async function save() {
    const displayName = form.displayName.trim();
    const email = form.email.trim();
    if (!displayName || !email) throw new Error('名前とメールアドレスを入力してください。');
    if ((!editing || form.password) && form.password.length < 8) throw new Error('パスワードは8文字以上で入力してください。');
    const saved = await authRequest<AuthUser>(editing ? `/employees/${editing}/edit` : '/employees',
      { displayName, email, password: form.password || undefined }, token);
    setItems(old => editing ? (old ?? []).map(item => item.id === saved.id ? saved : item) : [saved, ...(old ?? [])]);
    setNotice(editing ? '従業員情報を更新しました。' : '従業員アカウントを作成しました。');
    resetForm();
  }

  async function remove(id: string) {
    await authRequest(`/employees/${id}/delete`, {}, token);
    setItems(old => (old ?? []).filter(item => item.id !== id));
    if (editing === id) resetForm();
    setDeleting(null);
    setNotice('従業員を削除しました。');
  }

  return <>
    <Panel>
      <SectionTitle>{user.businessName}の従業員専用ログインURL</SectionTitle>
      <Text selectable style={{ color: '#1857B4' }}>{loginUrl}</Text>
      {!origin && <BodyText>Web版で開くと共有用の完全なURLを確認できます。</BodyText>}
      <BodyText>従業員にはこのURLと、作成時に設定したログイン情報を個別に共有してください。</BodyText>
    </Panel>
    {!!error && <Text accessibilityRole="alert" style={{ color: '#B42318' }}>{error}</Text>}
    {!!notice && <Text accessibilityLiveRegion="polite">{notice}</Text>}
    <Panel>
      <SectionTitle>従業員一覧</SectionTitle>
      {items === null && !error && <BodyText>読み込み中…</BodyText>}
      {items?.length === 0 && <BodyText>登録済みの従業員はいません。</BodyText>}
      {items?.map(item => <Panel key={item.id}>
        <SectionTitle>{item.displayName}</SectionTitle>
        <BodyText>{item.email}</BodyText>
        {deleting === item.id ? <>
          <BodyText>この従業員を削除しますか？</BodyText>
          <AppButton label="削除を確定" danger onPress={() => void run(() => remove(item.id))} />
          <AppButton label="キャンセル" outline onPress={() => { if (!busy) setDeleting(null); }} />
        </> : <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
          <AppButton label="編集" outline onPress={() => {
            if (busy) return;
            setEditing(item.id);
            setForm({ displayName: item.displayName, email: item.email, password: '' });
          }} />
          <AppButton label="削除" danger onPress={() => { if (!busy) setDeleting(item.id); }} />
        </View>}
      </Panel>)}
    </Panel>
    {items !== null && <Panel>
      <SectionTitle>{editing ? '従業員を編集' : '従業員を作成'}</SectionTitle>
      <AppInput label="名前" value={form.displayName} editable={!busy} maxLength={100}
        onChangeText={displayName => setForm(previous => ({ ...previous, displayName }))} />
      <AppInput label="メールアドレス" value={form.email} editable={!busy} maxLength={254}
        autoCapitalize="none" keyboardType="email-address"
        onChangeText={email => setForm(previous => ({ ...previous, email }))} />
      <AppInput label={editing ? '新しいパスワード（変更する場合）' : '初期パスワード'} value={form.password}
        editable={!busy} secureTextEntry autoComplete="new-password" maxLength={72}
        onChangeText={password => setForm(previous => ({ ...previous, password }))} />
      <AppButton label={busy ? '処理中…' : editing ? '変更を保存' : '従業員を作成'} onPress={() => void run(save)} />
      {editing && <AppButton label="編集をキャンセル" outline onPress={() => { if (!busy) resetForm(); }} />}
    </Panel>}
  </>;
}

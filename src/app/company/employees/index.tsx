import { useEffect, useRef, useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { AppInput, AppSelect } from '@/components/form';
import { AppButton, BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';
import { useAuth } from '@/auth/AuthProvider';
import { useCompanyPermission } from '@/features/company/CompanyPermissionBoundary';
import { authRequest, type AuthUser } from '@/auth/api';

const emptyForm = { employeeNumber: '', familyName: '', givenName: '', email: '', password: '', gender: 'UNDISCLOSED' };
const genders = [
  { value: 'UNDISCLOSED', label: '回答しない' }, { value: 'MALE', label: '男性' },
  { value: 'FEMALE', label: '女性' }, { value: 'OTHER', label: 'その他' },
];
const options = (values: string[]) => values.map(value => ({ value, label: value }));
type SortKey = 'employeeNumber' | 'displayName' | 'createdAt';

export default function EmployeePage() {
  const { user, token, ready } = useAuth();
  const permission = useCompanyPermission('employees');
  const allowed = permission.allowed && !!token;
  return <AppPage title="従業員管理" subtitle="" role="company" activeMenu="従業員管理">
    {!ready || !permission.ready ? <BodyText>読み込み中…</BodyText> : allowed && user && token ?
      <EmployeeManager key={token} user={user} token={token} level={permission.level} /> :
      <Panel><SectionTitle>従業員管理</SectionTitle><BodyText>企業アカウント、または社員管理権限のある従業員で利用できます。</BodyText>
        {!user && <Link href="/auth">ログインする</Link>}
      </Panel>}
  </AppPage>;
}

function EmployeeManager({ user, token, level }: { user: AuthUser; token: string; level: number }) {
  const needsBusinessName = user.accountType === 'COMPANY' && !user.businessName?.trim();
  const [items, setItems] = useState<AuthUser[] | null>(null);
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState('10');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [direction, setDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<'detail' | 'create' | 'edit' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState(false);
  const [mailPassword, setMailPassword] = useState('');
  const [mailOpen, setMailOpen] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const employee = items?.find(item => item.id === selected);
  const origin = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin :
    process.env.EXPO_PUBLIC_WEB_BASE_URL?.replace(/\/$/, '');
  const loginUrl = `${origin || ''}/company-login?ownerId=${encodeURIComponent(user.companyOwnerId || user.id)}`;

  async function refresh() {
    setItems(await authRequest<AuthUser[]>('/employees', undefined, token));
  }
  useEffect(() => {
    let active = true;
    authRequest<AuthUser[]>('/employees', undefined, token)
      .then(list => { if (active) setItems(list); })
      .catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [token]);

  async function run(action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    try { await action(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : '処理できませんでした。'); }
    finally { busyRef.current = false; setBusy(false); }
  }
  function close() {
    if (busyRef.current) return;
    setMode(null);
    setSelected(null);
    setForm(emptyForm);
    setMailPassword('');
    setMailOpen(false);
    setDeleting(false);
    setError('');
  }
  function openDetail(item: AuthUser) {
    if (busyRef.current) return;
    setSelected(item.id);
    setMode('detail');
    setDeleting(false);
    setMailPassword('');
    setMailOpen(false);
    setError('');
  }
  function edit() {
    if (!employee || busyRef.current) return;
    setForm({
      employeeNumber: employee.employeeNumber || '', familyName: employee.familyName || employee.displayName,
      givenName: employee.givenName || '', email: employee.email, password: '', gender: employee.gender || 'UNDISCLOSED',
    });
    setMode('edit');
    setMailPassword('');
    setMailOpen(false);
    setError('');
    setDeleting(false);
  }
  async function save() {
    const familyName = form.familyName.trim();
    const givenName = form.givenName.trim();
    const displayName = [familyName, givenName].filter(Boolean).join(' ');
    const legacy = mode === 'edit' && !employee?.givenName;
    if (!familyName || (!givenName && !legacy)) throw new Error('従業員の姓・名を入力してください。');
    if (displayName.length > 100) throw new Error('姓・名は合計100文字以内で入力してください。');
    if (!form.email.trim()) throw new Error('登録メールアドレスを入力してください。');
    if ((mode === 'create' || form.password) && (form.password.length < 8 || form.password.length > 72)) {
      throw new Error('パスワードは8文字以上・72バイト以内で入力してください。');
    }
    if (form.employeeNumber.trim() && !/^[a-zA-Z0-9_-]{1,40}$/.test(form.employeeNumber.trim())) {
      throw new Error('従業員番号は40文字以内の半角英数字・ハイフン・アンダースコアで入力してください。');
    }
    const body = { ...form, familyName, givenName, displayName, email: form.email.trim(), password: form.password || undefined };
    if (mode === 'edit' && employee) {
      const saved = await authRequest<AuthUser>(`/employees/${employee.id}/edit`, body, token);
      setItems(old => (old || []).map(item => item.id === saved.id ? saved : item));
      setMode('detail');
      setForm(emptyForm);
      setNotice('従業員情報を更新しました。');
    } else {
      const result = await authRequest<{ employee: AuthUser; mailSent: boolean }>('/employees/register', body, token);
      setItems(old => [result.employee, ...(old || [])]);
      setSelected(result.employee.id);
      setMode('detail');
      setForm(emptyForm);
      setNotice(result.mailSent ? '従業員を作成し、登録案内メールを送信しました。' : '従業員は作成済みです。登録案内メールを送信できませんでした。設定を確認して再送してください。');
      if (!result.mailSent) { setMailPassword(form.password); setMailOpen(true); }
    }
  }
  async function remove() {
    if (!employee) return;
    await authRequest(`/employees/${employee.id}/delete`, {}, token);
    setItems(old => (old || []).filter(item => item.id !== employee.id));
    setMode(null);
    setSelected(null);
    setDeleting(false);
    setMailPassword('');
    setNotice('従業員を削除しました。');
  }
  async function resend() {
    if (!employee || !mailPassword) throw new Error('現在のログインパスワードを入力してください。');
    const result = await authRequest<{ mailSent: boolean }>(`/employees/${employee.id}/registration-mail`, { password: mailPassword }, token);
    if (!result.mailSent) throw new Error('登録案内メールを送信できませんでした。メール送信設定とログインURLの設定を確認してください。');
    setMailPassword('');
    setMailOpen(false);
    setNotice('登録案内メールを送信しました。');
  }

  const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/\s/g, '');
  const filtered = (items || []).filter(item => normalize(item.displayName + ' ' + (item.employeeNumber || '')).includes(normalize(query)));
  const sorted = [...filtered].sort((a, b) => {
    const comparison = sortKey === 'createdAt'
      ? (Date.parse(a.createdAt || '') || 0) - (Date.parse(b.createdAt || '') || 0)
      : (a[sortKey] || '').localeCompare(b[sortKey] || '', 'ja', { numeric: true });
    return (direction === 'asc' ? comparison : -comparison) || a.id.localeCompare(b.id);
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / Number(pageSize)));
  const currentPage = Math.min(page, totalPages);
  const shown = sorted.slice((currentPage - 1) * Number(pageSize), currentPage * Number(pageSize));
  const columns = width >= 900 ? 3 : width >= 560 ? 2 : 1;
  const field = (key: keyof typeof form) => ({
    value: form[key], editable: !busy, onChangeText: (value: string) => setForm(old => ({ ...old, [key]: value })),
  });
  const pager = <View style={s.pager}>
    <Pressable accessibilityRole="button" accessibilityLabel="前のページ" disabled={currentPage === 1 || busy}
      onPress={() => setPage(currentPage - 1)} style={[s.smallButton, currentPage === 1 && s.disabled]}><Text>前へ</Text></Pressable>
    <Text accessibilityLiveRegion="polite">{currentPage} / {totalPages} ページ　{filtered.length}件</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="次のページ" disabled={currentPage === totalPages || busy}
      onPress={() => setPage(currentPage + 1)} style={[s.smallButton, currentPage === totalPages && s.disabled]}><Text>次へ</Text></Pressable>
  </View>;

  return <>
    <Panel><SectionTitle>{user.businessName || '所属企業'}の従業員専用ログインURL</SectionTitle>
      <Text selectable style={s.link}>{loginUrl}</Text>
      <BodyText>作成後、従業員の登録メールアドレスへログイン情報を送信します。</BodyText>
    </Panel>
    {!mode && !!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {!mode && !!notice && <Text accessibilityLiveRegion="polite">{notice}</Text>}
    <Panel>
      <View style={s.row}><SectionTitle>従業員一覧</SectionTitle>
        {level >= 2 && !needsBusinessName && <View style={s.createButton}><AppButton label="作成＋" onPress={() => {
          if (busy || items === null) return;
          setForm(emptyForm); setSelected(null); setMode('create'); setError(''); setNotice('');
        }} /></View>}
      </View>
      {needsBusinessName && <BodyText>従業員を作成するには、「企業・権限」の企業プロフィールで屋号・法人名を登録してください。</BodyText>}
      <View style={s.toolbar}>
        <AppInput label="名前・従業員番号で検索" value={query} onChangeText={value => { setQuery(value); setPage(1); }} containerStyle={s.searchField} />
        <AppSelect label="表示件数" value={pageSize} options={options(['10', '20', '50'])}
          onValueChange={value => { setPageSize(value); setPage(1); }} containerStyle={s.shortFilter} />
        <AppSelect label="並び替え" value={sortKey} options={[
          { value: 'employeeNumber', label: '従業員番号' }, { value: 'displayName', label: '名前' }, { value: 'createdAt', label: '新規登録順' },
        ]} onValueChange={value => { setSortKey(value as SortKey); setPage(1); }} containerStyle={s.sortFilter} />
        <AppSelect label="並び順" value={direction} options={[{ value: 'asc', label: '昇順' }, { value: 'desc', label: '降順' }]}
          onValueChange={value => { setDirection(value); setPage(1); }} containerStyle={s.shortFilter} />
      </View>
      {pager}
      {items === null ? <><BodyText>{error ? '従業員を取得できませんでした。' : '読み込み中…'}</BodyText>
        {!!error && <AppButton label="再読み込み" outline onPress={() => void run(refresh)} />}</> :
        !shown.length && <BodyText>{query ? '検索条件に一致する従業員はいません。' : '登録済みの従業員はいません。'}</BodyText>}
      <View onLayout={event => setWidth(event.nativeEvent.layout.width)} style={s.grid}>
        {shown.map(item => <Pressable key={item.id} accessibilityRole="button"
          accessibilityLabel={`${item.employeeNumber || '番号未登録'} ${item.displayName}の詳細`}
          onPress={() => openDetail(item)} style={[s.card, { width: (width > 0 ? (width - 12 * (columns - 1)) / columns : undefined) }]}>
          <View style={s.row}><Ionicons name="person-circle-outline" size={36} color="#356396" />
            <Text style={s.number}>{item.employeeNumber || '番号未登録'}</Text></View>
          <Text style={s.name}>{item.displayName}</Text>
          <Text style={s.email} numberOfLines={1}>{item.email}</Text>
          <Text style={s.meta}>登録日　{item.createdAt ? new Date(item.createdAt).toLocaleDateString('ja-JP') : '未登録'}</Text>
        </Pressable>)}
      </View>
      {pager}
    </Panel>
    <Modal transparent visible={mode !== null} animationType="fade" onRequestClose={close}>
      <View style={s.backdrop}>
        <Pressable accessibilityRole="button" accessibilityLabel="従業員モーダルを閉じる" onPress={close} style={StyleSheet.absoluteFill} />
        <View accessibilityViewIsModal style={s.modal}>
          <View style={s.row}><Text accessibilityRole="header" style={s.name}>{mode === 'create' ? '従業員を作成' : mode === 'edit' ? '従業員情報を編集' : '従業員の詳細'}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="閉じる" disabled={busy} onPress={close} style={s.close}>
              <Ionicons name="close" size={28} color="#183455" /></Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" style={{ flexGrow: 0 }}>
            <View style={s.stack}>
              {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
              {!!notice && <Text accessibilityLiveRegion="polite">{notice}</Text>}
              {mode === 'detail' && employee ? <>
                <BodyText>従業員番号　{employee.employeeNumber || '未登録'}</BodyText>
                <BodyText>氏名　{employee.displayName}</BodyText>
                <Text selectable style={s.email}>登録メールアドレス　{employee.email}</Text>
                <BodyText>性別　{genders.find(gender => gender.value === employee.gender)?.label || '回答しない'}</BodyText>
                <BodyText>新規登録日時　{employee.createdAt ? new Date(employee.createdAt).toLocaleString('ja-JP') : '未登録'}</BodyText>
                <Text selectable style={s.link}>{loginUrl}</Text>
                {level >= 2 && <AppButton label="編集" outline onPress={edit} />}
                {level >= 3 && <AppButton label={deleting ? '削除を確定' : '削除'} danger onPress={() => {
                  if (busy) return;
                  if (deleting) void run(remove); else setDeleting(true);
                }} />}
                {deleting && <AppButton label="削除をキャンセル" outline onPress={() => { if (!busy) setDeleting(false); }} />}
                {level >= 2 && <AppButton label="登録案内メールを再送" outline onPress={() => { if (!busy) setMailOpen(open => !open); }} />}
                {mailOpen && <>
                  <AppInput label="現在のログインパスワード" secureTextEntry value={mailPassword} onChangeText={setMailPassword} editable={!busy} maxLength={72} />
                  <AppButton label={busy ? '処理中…' : '登録案内を送信'} onPress={() => void run(resend)} />
                </>}
              </> : <>
                <AppInput label="従業員番号（空欄で自動作成）" {...field('employeeNumber')} maxLength={40} autoCapitalize="characters" />
                <View style={s.filters}>
                  <AppInput label="従業員姓" required {...field('familyName')} maxLength={50} containerStyle={s.filter} />
                  <AppInput label="従業員名" required={mode === 'create' || !!employee?.givenName} {...field('givenName')} maxLength={50} containerStyle={s.filter} />
                </View>
                {mode === 'edit' && !employee?.familyName && <BodyText>既存の氏名を姓欄に表示しています。必要に応じて姓・名を分けてください。</BodyText>}
                <AppInput label="登録メールアドレス" required {...field('email')} maxLength={254} autoCapitalize="none" keyboardType="email-address" />
                <AppInput label={mode === 'edit' ? '新しいパスワード（変更する場合）' : 'パスワード'} required={mode === 'create'}
                  {...field('password')} secureTextEntry autoComplete="new-password" maxLength={72} />
                <AppSelect label="性別" value={form.gender} options={genders} disabled={busy}
                  onValueChange={gender => setForm(old => ({ ...old, gender }))} />
                <BodyText>作成時には、ログインURL・メールアドレス・パスワードを含む登録案内メールを送信します。</BodyText>
                <AppButton label={busy ? '処理中…' : mode === 'create' ? '作成してメール送信' : '変更を保存'} onPress={() => void run(save)} />
              </>}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  </>;
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  stack: { gap: 14, paddingBottom: 12 },
  createButton: { width: 110, flexShrink: 0 },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: 10 },
  searchField: { width: 300, maxWidth: '100%' },
  shortFilter: { width: 110, maxWidth: '100%' },
  sortFilter: { width: 150, maxWidth: '100%' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filter: { flexGrow: 1, flexBasis: 140, minWidth: 0 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { borderWidth: 1, borderColor: '#D2DFF0', borderRadius: 12, padding: 14, gap: 10, backgroundColor: '#F9FBFF', minWidth: 0 },
  name: { fontSize: 18, fontWeight: '700', color: '#183455', flexShrink: 1 },
  number: { fontSize: 12, fontWeight: '600', color: '#436384', flexShrink: 1 },
  email: { fontSize: 13, color: '#244564', flexShrink: 1 },
  meta: { fontSize: 12, color: '#64748B' },
  link: { color: '#1857B4', fontSize: 13 },
  error: { color: '#B42318' },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 14 },
  smallButton: { paddingHorizontal: 14, minHeight: 44, justifyContent: 'center', backgroundColor: '#EDF3FC', borderRadius: 7 },
  disabled: { opacity: 0.4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,.4)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: { width: '100%', maxWidth: 650, maxHeight: '90%', padding: 18, borderRadius: 16, backgroundColor: '#FFF', gap: 12 },
  close: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});

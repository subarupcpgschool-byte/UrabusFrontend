import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/auth/AuthProvider';
import { authRequest } from '@/auth/api';
import { AppInput, AppSelect } from '@/components/form';
import { BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';
import { levelLabel, noPermissions, permissionColumns, permissionOptions, type Flags, type PermissionLevel } from './companyPermissions';

type Role = { id: string; name: string; fixed: boolean; version: number; permissions: Flags };
type Position = { id: string; name: string; version: number };
type Member = { id: string; displayName: string; email: string | null; employeeNumber: string | null; roleId: string | null; positionId: string | null; roleName: string | null; positionName: string | null; lastLoginAt: string | null; version: number };
type Management = { roles: Role[]; positions: Position[]; members: Member[]; permissions: Flags };
type Form = { kind: 'role'; name: string; permissions: Flags } | { kind: 'position'; id?: string; version: number; name: string } | { kind: 'member'; member: Member; roleId: string; positionId: string };
const equalRole = (a: Role, b: Role) => a.name === b.name && a.permissions.scout === b.permissions.scout && permissionColumns.every(([key]) => a.permissions[key] === b.permissions[key]);
const message = (e: unknown) => e instanceof Error ? e.message : '処理できませんでした。';

export function ManagementButton({ label, onPress, disabled = false, primary = false, compact = false, accessibilityLabel }: { label: string; onPress: () => void; disabled?: boolean; primary?: boolean; compact?: boolean; accessibilityLabel?: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} disabled={disabled} accessibilityState={{ disabled }} onPress={onPress}
    style={({ pressed }) => [s.button, compact && s.compactButton, primary && s.primary, (disabled || pressed) && s.dim]}><Text style={[s.buttonText, primary && s.white]}>{label}</Text></Pressable>;
}
function Checkbox({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled: boolean; onChange: () => void }) {
  return <Pressable accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked, disabled }} aria-checked={checked} disabled={disabled} onPress={onChange}
    style={[s.checkTarget, disabled && s.dim]}><View style={[s.check, checked && s.checked]}>{checked && <Ionicons name="checkmark" size={18} color="#FFF" />}</View></Pressable>;
}
type ManagementProps = { onDirtyChange: (dirty: boolean) => void; onEmployees: () => void };
type Confirmation = { kind: 'update'; previous: Role; next: Role }
  | { kind: 'deleteRole'; item: Role }
  | { kind: 'deletePosition'; item: Position };

export default function CompanyManagement({ onDirtyChange, onEmployees }: ManagementProps) {
  const { user, token, ready } = useAuth();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [confirmError, setConfirmError] = useState('');
  const [tableWidth, setTableWidth] = useState(0);
  const [data, setData] = useState<Management | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Role>>({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [revision, setRevision] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const [form, setForm] = useState<Form | null>(null);
  const [initial, setInitial] = useState('');
  const [modalError, setModalError] = useState('');
  const [discard, setDiscard] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const hasChanges = !!data?.roles.some(role => drafts[role.id] && !equalRole(role, drafts[role.id]))
    || (form !== null && JSON.stringify(form) !== initial);
  useEffect(() => { onDirtyChange(hasChanges); }, [hasChanges, onDirtyChange]);
  useEffect(() => {
    let active = true;
    setData(null); setDrafts({}); setError(''); setForm(null);
    if (!ready || !token || !['COMPANY', 'EMPLOYEE'].includes(user?.accountType || '')) return;
    setLoading(true);
    authRequest<Management>('/company-management', undefined, token)
      .then(result => { if (active) setData(result); }).catch(e => { if (active) setError(message(e)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [ready, token, user?.accountType, revision]);
  async function run(key: string, action: () => Promise<void>) {
    if (busyRef.current) return;
    busyRef.current = true; setBusy(key); setNotice('');
    try { await action(); } finally { busyRef.current = false; setBusy(null); }
  }
  function open(value: Form) { if (busyRef.current) return; setForm(value); setInitial(JSON.stringify(value)); setModalError(''); setDiscard(false); }
  function close() { if (busyRef.current) return; setForm(null); setDiscard(false); setModalError(''); }
  function requestClose() { if (busyRef.current) return; if (JSON.stringify(form) !== initial) setDiscard(true); else close(); }
  async function updateRole(role: Role) {
    if (!token) return;
    await run(role.id, async () => {
      try {
        const saved = await authRequest<Role>(`/company-management/roles/${role.id}`, { name: role.name, version: role.version, permissions: role.permissions }, token);
        setData(old => old && ({ ...old, roles: old.roles.map(item => item.id === saved.id ? saved : item), members: old.members.map(item => item.roleId === saved.id ? { ...item, roleName: saved.name } : item) }));
        setDrafts(old => { const next = { ...old }; delete next[role.id]; return next; });
        setConfirmation(null);
        setNotice(`${saved.name}を更新しました。`);
      } catch (e) { setConfirmError(message(e)); }
    });
  }
  function openConfirmation(value: Confirmation) {
    setConfirmError('');
    setConfirmation(value);
  }
  async function confirmChange() {
    if (!confirmation || !token) return;
    setConfirmError('');
    if (confirmation.kind === 'update') {
      await updateRole(confirmation.next);
      return;
    }
    const { kind, item } = confirmation;
    await run(item.id, async () => {
      try {
        const collection = kind === 'deleteRole' ? 'roles' : 'positions';
        await authRequest(`/company-management/${collection}/${item.id}/delete`, { version: item.version }, token);
        setData(old => old && ({
          ...old,
          roles: kind === 'deleteRole' ? old.roles.filter(role => role.id !== item.id) : old.roles,
          positions: kind === 'deletePosition' ? old.positions.filter(position => position.id !== item.id) : old.positions,
        }));
        setConfirmation(null);
        setNotice(`${item.name}を削除しました。`);
      } catch (cause) { setConfirmError(message(cause)); }
    });
  }
  async function saveForm() {
    if (!form || !token) return;
    if (form.kind !== 'member' && !form.name.trim()) { setModalError('名称を入力してください。'); return; }
    await run('modal', async () => {
      setModalError('');
      try {
        if (form.kind === 'role') {
          const result = await authRequest<Role>('/company-management/roles', { name: form.name.trim(), permissions: form.permissions, version: 0 }, token);
          setData(old => old && ({ ...old, roles: [...old.roles, result] }));
        } else if (form.kind === 'position') {
          const result = await authRequest<Position>(`/company-management/positions${form.id ? '/' + form.id : ''}`, { name: form.name.trim(), version: form.version }, token);
          setData(old => old && ({ ...old, positions: form.id ? old.positions.map(item => item.id === result.id ? result : item) : [...old.positions, result], members: old.members.map(item => item.positionId === result.id ? { ...item, positionName: result.name } : item) }));
        } else {
          const result = await authRequest<Member>(`/company-management/members/${form.member.id}`, { roleId: form.roleId || null, positionId: form.positionId || null, version: form.member.version }, token);
          setData(old => old && ({ ...old, members: old.members.map(item => item.id === result.id ? result : item) }));
        }
        setForm(null); setDiscard(false); setNotice('保存しました。');
      } catch (e) { setModalError(message(e)); }
    });
  }
  function setRoleDraft(role: Role, patch: Partial<Role>) {
    setDrafts(old => ({ ...old, [role.id]: { ...role, ...patch } }));
  }
  if (!ready || loading) return <Panel><BodyText>社員・権限を読み込み中…</BodyText></Panel>;
  if (!data) return <Panel>{!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}<BodyText>社員・役職・役割の管理には社員管理または権限管理の許可が必要です。</BodyText>{token && <View style={s.actions}><ManagementButton label="再読み込み" onPress={() => setRevision(value => value + 1)} /></View>}</Panel>;
  const canManageRoles = data.permissions.roles >= 2;
  const canManageEmployees = data.permissions.employees >= 2;
  const showRoles = data.permissions.roles >= 1;
  const showPositions = data.permissions.employees >= 1;
  const narrowTable = tableWidth < 540;
  const roleWidth = narrowTable ? 108 : 168;
  const actionWidth = narrowTable ? 78 : 108;
  const members = data.members.filter(item => `${item.displayName} ${item.employeeNumber || ''}`.normalize('NFKC').toLowerCase().includes(query.normalize('NFKC').toLowerCase()));
  const pages = Math.max(1, Math.ceil(members.length / Number(pageSize))), current = Math.min(page, pages);
  const shown = members.slice((current - 1) * Number(pageSize), current * Number(pageSize));
  const pager = <View style={s.pager}><ManagementButton label="前へ" disabled={current === 1} onPress={() => setPage(current - 1)} /><Text>{current} / {pages} ページ　{members.length}件</Text><ManagementButton label="次へ" disabled={current === pages} onPress={() => setPage(current + 1)} /></View>;
  return <>
    {!!notice && <Text accessibilityLiveRegion="polite" style={s.success}>{notice}</Text>}
    <Panel>
      <View style={s.header}><SectionTitle>社員一覧</SectionTitle>{showPositions && <ManagementButton label="従業員管理" onPress={onEmployees} />}</View>
      <View style={s.controls}><AppInput label="名前・従業員番号で検索" containerStyle={s.search} value={query} onChangeText={value => { setQuery(value); setPage(1); }} /><AppSelect label="表示件数" containerStyle={s.pageSize} value={pageSize} onValueChange={value => { setPageSize(value); setPage(1); }} options={['10', '20', '50'].map(value => ({ value, label: value + '件' }))} /></View>
      <ScrollView horizontal><View style={s.memberTable}>
        <View style={[s.tableRow, s.heading]}>{['社員', '役職', '役割', '最終ログイン', '操作'].map((text, index) => <Text key={text} style={[s.cell, index === 0 && s.personCell]}>{text}</Text>)}</View>
        {shown.map(member => <View key={member.id} style={s.tableRow}>
          <View style={[s.cell, s.personCell]}><Text style={s.memberName}>{member.displayName}</Text><Text style={s.meta}>{member.employeeNumber || '番号未登録'}{'\n'}{member.email}</Text></View>
          <Text style={s.cell}>{member.positionName || '未設定'}</Text><Text style={s.cell}>{member.roleName || '個別権限'}</Text>
          <Text style={s.cell}>{member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString('ja-JP') : '未ログイン'}</Text>
          <View style={s.cell}>{(canManageRoles || canManageEmployees) && <ManagementButton label="編集" disabled={!!busy} onPress={() => open({ kind: 'member', member, roleId: member.roleId || '', positionId: member.positionId || '' })} />}</View>
        </View>)}
      </View></ScrollView>
      {!shown.length && <BodyText>{query ? '検索条件に一致する社員はいません。' : '登録済みの社員はいません。'}</BodyText>}{pager}
    </Panel>
    {showPositions && <Panel>
      <View style={s.header}><SectionTitle>役職一覧</SectionTitle>{canManageEmployees && <ManagementButton label="作成＋" primary disabled={!!busy} onPress={() => open({ kind: 'position', name: '', version: 0 })} />}</View>
      {!data.positions.length && <BodyText>登録済みの役職はありません。</BodyText>}
      {data.positions.map(position => <View key={position.id} style={s.positionRow}>
        <Text style={s.memberName}>{position.name}</Text>
        <View style={s.actions}>
          {canManageEmployees && <ManagementButton label={`${position.name}を編集`} disabled={!!busy} onPress={() => open({ kind: 'position', ...position })} />}
          {data.permissions.employees === 3 && <ManagementButton label="削除" disabled={!!busy} onPress={() => openConfirmation({ kind: 'deletePosition', item: position })} />}
        </View>
      </View>)}
    </Panel>}
    {showRoles && <Panel>
      <View style={s.header}><SectionTitle>役割一覧</SectionTitle>{canManageRoles && <ManagementButton label="作成＋" primary disabled={!!busy} onPress={() => open({ kind: 'role', name: '', permissions: { ...noPermissions } })} />}</View>
      <BodyText>中央を横スクロールして権限を設定できます。黄色の行には未保存の変更があります。</BodyText>
      <View style={s.fixedTable} onLayout={event => setTableWidth(event.nativeEvent.layout.width)}>
        <View style={[s.fixedColumn, { width: roleWidth }]}>
          <View style={[s.roleHeader, s.leftCell]}><Text style={s.tableLabel}>役割名</Text></View>
          {data.roles.map(original => {
            const role = drafts[original.id] || original;
            return <View key={role.id} style={[s.roleCell, s.leftCell, !equalRole(role, original) && s.changed]}>
              {role.fixed ? <Text style={s.memberName}>{role.name}（固定）</Text> :
                <AppInput accessibilityLabel={`${original.name}の役割名`} value={role.name} maxLength={100}
                  editable={canManageRoles && !busy} onChangeText={name => setRoleDraft(role, { name })} />}
            </View>;
          })}
        </View>
        <ScrollView horizontal style={s.permissionScroll} showsHorizontalScrollIndicator>
          <View>
            <View style={[s.roleHeader, s.permissionRow]}>
              {permissionColumns.map(([key, label]) => <Text key={key} style={[s.permissionCell, s.tableLabel]}>{label}</Text>)}
              <Text style={[s.permissionCell, s.tableLabel]}>スカウト</Text>
            </View>
            {data.roles.map(original => {
              const role = drafts[original.id] || original;
              const disabled = role.fixed || !canManageRoles || !!busy;
              return <View key={role.id} style={[s.roleCell, s.permissionRow, !equalRole(role, original) && s.changed]}>
                {permissionColumns.map(([key, label]) => <View key={key} style={s.permissionCell}>
                  <AppSelect accessibilityLabel={`${original.name}：${label}`} value={String(role.permissions[key])}
                    options={permissionOptions} disabled={disabled} onValueChange={value => setRoleDraft(role, { permissions: { ...role.permissions, [key]: Number(value) as PermissionLevel } })} />
                </View>)}
                <View style={s.permissionCell}><Checkbox label={`${original.name}：スカウト`} checked={role.permissions.scout} disabled={disabled}
                  onChange={() => setRoleDraft(role, { permissions: { ...role.permissions, scout: !role.permissions.scout } })} /></View>
              </View>;
            })}
          </View>
        </ScrollView>
        <View style={[s.fixedColumn, { width: actionWidth }]}>
          <View style={[s.roleHeader, s.operationCell]}><Text style={s.tableLabel}>操作</Text></View>
          {data.roles.map(original => {
            const role = drafts[original.id] || original;
            const dirty = !equalRole(role, original);
            return <View key={role.id} style={[s.roleCell, s.operationCell, dirty && s.changed]}>
              <ManagementButton label="更新" primary compact disabled={!canManageRoles || role.fixed || !!busy || !dirty || !role.name.trim()}
                accessibilityLabel={`${original.name}を更新`} onPress={() => openConfirmation({ kind: 'update', previous: original, next: role })} />
              {data.permissions.roles === 3 && !role.fixed && <ManagementButton label="削除" compact disabled={!!busy || dirty}
                accessibilityLabel={`${original.name}を削除`} onPress={() => openConfirmation({ kind: 'deleteRole', item: original })} />}
            </View>;
          })}
        </View>
      </View>
      <BodyText>対象案件の権限は、求人ごとに割り当てられた案件で使えます。</BodyText>
    </Panel>}
    <Modal transparent visible={confirmation !== null} animationType="fade" onRequestClose={() => { if (!busy) setConfirmation(null); }}>
      <View style={s.backdrop}>
        <View style={s.modal} accessibilityViewIsModal>
          <Text accessibilityRole="header" style={s.title}>{confirmation?.kind === 'update' ? '更新内容の確認' : '削除の確認'}</Text>
          <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={s.stack}>
            {!!confirmError && <Text accessibilityRole="alert" style={s.error}>{confirmError}</Text>}
            {confirmation?.kind === 'update' ? <>
              <BodyText>{confirmation.previous.name}の変更内容</BodyText>
              {confirmation.previous.name !== confirmation.next.name && <Text>役割名　{confirmation.previous.name} → {confirmation.next.name.trim()}</Text>}
              {permissionColumns.filter(([key]) => confirmation.previous.permissions[key] !== confirmation.next.permissions[key]).map(([key, label]) =>
                <View key={key}><Text style={s.memberName}>{label}</Text><Text>{levelLabel(confirmation.previous.permissions[key])} → {levelLabel(confirmation.next.permissions[key])}</Text></View>)}
              {confirmation.previous.permissions.scout !== confirmation.next.permissions.scout && <Text>スカウト　{confirmation.previous.permissions.scout ? '許可' : 'アクセス不可'} → {confirmation.next.permissions.scout ? '許可' : 'アクセス不可'}</Text>}
            </> : confirmation && <BodyText>{confirmation.item.name}を削除しますか？</BodyText>}
          </ScrollView>
          <View style={s.footer}><ManagementButton label="キャンセル" disabled={!!busy} onPress={() => setConfirmation(null)} />
            <ManagementButton label={busy ? '処理中…' : confirmation?.kind === 'update' ? '更新する' : '削除する'} primary disabled={!!busy} onPress={() => void confirmChange()} /></View>
        </View>
      </View>
    </Modal>
    <Modal transparent animationType="fade" visible={!!form} onRequestClose={() => discard ? setDiscard(false) : requestClose()}>
      <View style={s.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} accessibilityRole="button" accessibilityLabel="編集画面を閉じる" disabled={!!busy} onPress={requestClose} />
        <View style={s.modal} accessibilityViewIsModal importantForAccessibility={discard ? 'no-hide-descendants' : 'auto'}>
          <View style={s.header}><Text accessibilityRole="header" style={s.title}>{form?.kind === 'role' ? '役割を作成' : form?.kind === 'position' ? (form.id ? '役職を編集' : '役職を作成') : '社員の役職・役割を編集'}</Text><Pressable accessibilityRole="button" accessibilityLabel="閉じる" style={s.close} disabled={!!busy} onPress={requestClose}><Ionicons name="close" size={28} color="#183455" /></Pressable></View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.stack}>
            {!!modalError && <Text accessibilityRole="alert" style={s.error}>{modalError}</Text>}
            {form?.kind === 'member' ? <>
              <Text style={s.memberName}>{form.member.displayName}</Text><BodyText>{form.member.email}</BodyText>
              <AppSelect label="役職" value={form.positionId} disabled={!canManageEmployees || !!busy} options={[{ value: '', label: '未設定' }, ...data.positions.map(p => ({ value: p.id, label: p.name }))]} onValueChange={positionId => setForm({ ...form, positionId })} />
              <AppSelect label="役割" value={form.roleId} disabled={!canManageRoles || !!busy} options={[{ value: '', label: '個別権限（役割なし）' }, ...data.roles.filter(r => !r.fixed).map(r => ({ value: r.id, label: r.name }))]} onValueChange={roleId => setForm({ ...form, roleId })} />
              <BodyText>役割を変更すると、次の操作から新しい権限が適用されます。</BodyText>
            </> : form && <>
              <AppInput label={form.kind === 'role' ? '役割名' : '役職名'} required autoFocus value={form.name} maxLength={100} editable={!busy} onChangeText={name => setForm({ ...form, name })} />
              {form.kind === 'role' && <>
                {permissionColumns.map(([key, label]) => <AppSelect key={key} label={label} value={String(form.permissions[key])}
                  options={permissionOptions} disabled={!!busy} onValueChange={value => setForm({ ...form, permissions: { ...form.permissions, [key]: Number(value) as PermissionLevel } })} />)}
                <View style={s.header}><Text>スカウト</Text><Checkbox label="スカウト" checked={form.permissions.scout} disabled={!!busy}
                  onChange={() => setForm({ ...form, permissions: { ...form.permissions, scout: !form.permissions.scout } })} /></View>
              </>}
            </>}
          </ScrollView>
          <View style={s.footer}><ManagementButton label="キャンセル" disabled={!!busy} onPress={requestClose} /><ManagementButton label={busy === 'modal' ? '保存中…' : '保存'} primary disabled={!!busy} onPress={() => void saveForm()} /></View>
        </View>
        {discard && <View style={s.confirmBackdrop}><View style={s.confirm} accessibilityViewIsModal><Text accessibilityRole="header" style={s.title}>変更を破棄しますか？</Text><BodyText>保存していない変更を破棄して閉じます。</BodyText><View style={s.footer}><ManagementButton label="編集を続ける" onPress={() => setDiscard(false)} /><ManagementButton label="破棄して閉じる" onPress={close} /></View></View></View>}
      </View>
    </Modal>
  </>;
}
const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }, search: { width: 300, maxWidth: '100%' }, pageSize: { width: 110 },
  actions: { flexDirection: 'row', gap: 10 }, button: { minHeight: 44, minWidth: 84, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: '#1857B4', alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 13, fontWeight: '700', color: '#1857B4' }, primary: { backgroundColor: '#1857B4' }, white: { color: '#FFF' }, dim: { opacity: 0.45 },
  tableRow: { flexDirection: 'row', alignItems: 'center', minHeight: 58, borderBottomWidth: 1, borderBottomColor: '#DCE5EF' }, heading: { backgroundColor: '#F1F5FA' },
  memberTable: { minWidth: 920 }, cell: { width: 150, padding: 10, color: '#183455', fontSize: 13 }, personCell: { width: 320 },
  memberName: { color: '#183455', fontSize: 14, fontWeight: '700', flexShrink: 1 }, meta: { color: '#64748B', fontSize: 12, lineHeight: 20 },
  positionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, gap: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  fixedTable: { flexDirection: 'row', minWidth: 0, borderWidth: 1, borderColor: '#DCE5EF', borderRadius: 8, overflow: 'hidden' },
  fixedColumn: { flexShrink: 0, backgroundColor: '#FFF' },
  permissionScroll: { flex: 1, minWidth: 0 },
  roleHeader: { height: 56, backgroundColor: '#F1F5FA', justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DCE5EF' },
  roleCell: { height: 112, justifyContent: 'center', borderBottomWidth: 1, borderColor: '#DCE5EF', backgroundColor: '#FFF' },
  changed: { backgroundColor: '#FFF3BF' },
  leftCell: { paddingHorizontal: 8, borderRightWidth: 1, borderColor: '#DCE5EF' },
  operationCell: { paddingHorizontal: 6, gap: 4, borderLeftWidth: 1, borderColor: '#DCE5EF' },
  permissionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  permissionCell: { width: 184, paddingHorizontal: 8 },
  tableLabel: { color: '#183455', fontSize: 13, fontWeight: '700' },
  compactButton: { minWidth: 0, minHeight: 44, paddingHorizontal: 6 },
  checkTarget: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, check: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#7890AA', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' }, checked: { borderColor: '#1857B4', backgroundColor: '#1857B4' },
  pending: { fontSize: 11, color: '#875E00', fontWeight: '700' }, rowError: { fontSize: 13, color: '#B42318', padding: 12 }, error: { color: '#B42318', fontSize: 13 }, success: { color: '#187344' },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 12 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,.4)', padding: 16, alignItems: 'center', justifyContent: 'center' },
  modal: { width: '100%', maxWidth: 600, maxHeight: '90%', padding: 20, borderRadius: 16, backgroundColor: '#FFF', gap: 14 },
  close: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }, title: { fontSize: 17, fontWeight: '700', color: '#183455', flexShrink: 1 }, stack: { gap: 14, paddingBottom: 12 },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 10, paddingTop: 12 },
  confirmBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,23,42,.5)', padding: 16, justifyContent: 'center', alignItems: 'center' },
  confirm: { width: '100%', maxWidth: 440, backgroundColor: '#FFF', borderRadius: 14, padding: 22, gap: 16 },
});

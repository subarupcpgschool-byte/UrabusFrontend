import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AppPage from '@/components/layout/AppPage';
import { AppCheckbox, AppInput, AppSelect, AppTextArea } from '@/components/form';
import { AppButton, BodyText, Panel, SectionTitle } from '@/components/ui/AppUI';
import { authRequest } from '@/auth/api';
import { useAuth } from '@/auth/AuthProvider';

const path = '/company-recruitments';
const labels = {
  title: '募集タイトル', kind: '募集区分', employment: '雇用形態',
  location: '勤務地', compensation: '給与・報酬', description: '仕事内容', requirements: '応募条件',
};
const emptyDraft = {
  title: '', kind: 'JOB', employment: '正社員', location: '', compensation: '', description: '', requirements: '',
};
type Draft = typeof emptyDraft;
type Job = { id: string; document: string; deleted_at: string | null; can_edit: boolean };
type Employee = { id: string; display_name: string; can_create: boolean; edit_all: boolean };
type Overview = { jobs: Job[]; employees: Employee[]; canCreate: boolean; owner: boolean };
type Grant = { employeeId: string; canView: boolean; canEdit: boolean };
type History = { actor_name: string; action: string; before_value: string | null; after_value: string | null; changed_at: string };

export default function CompanyJobsPage() {
  const { token, user, ready } = useAuth();
  const allowed = user?.accountType === 'COMPANY' || user?.accountType === 'EMPLOYEE';
  return <AppPage title="求人作成・管理" subtitle="" role="company" activeMenu="求人管理">
    {!ready ? <BodyText>読み込み中…</BodyText> : token && allowed ? <RecruitmentManager key={token} token={token} /> :
      <Panel><BodyText>企業アカウントまたは所属企業の従業員アカウントでログインしてください。</BodyText></Panel>}
  </AppPage>;
}

function RecruitmentManager({ token }: { token: string }) {
  const [data, setData] = useState<Overview | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [history, setHistory] = useState<History[] | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const job = data?.jobs.find(row => row.id === selected);
  const request = <T,>(route = '', body?: unknown) => authRequest<T>(path + route, body, token);

  async function refresh() {
    setData(await request<Overview>());
  }

  useEffect(() => {
    let active = true;
    authRequest<Overview>(path, undefined, token)
      .then(value => { if (active) setData(value); })
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

  function open(id: string | null) {
    if (busy) return;
    setSelected(id);
    setDraft(null);
    setGrants(null);
    setHistory(null);
    setDeleteConfirm(false);
  }

  async function save() {
    if (!draft) return;
    const input = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])) as Draft;
    if (!input.title || !input.location || !input.compensation || !input.description) {
      throw new Error('募集タイトル、勤務地、給与・報酬、仕事内容を入力してください。');
    }
    const result = await request<{ id: string }>(job ? `/${job.id}/edit` : '', input);
    setDraft(null);
    setHistory(null);
    setSelected(result.id);
    setNotice(job ? '募集を更新しました。' : '募集を作成しました。');
    await refresh();
  }

  async function saveRole(employee: Employee, canCreate: boolean, editAll: boolean) {
    await request(`/employees/${employee.id}/role`, { canCreate, editAll: canCreate && editAll });
    await refresh();
  }

  const setField = (key: keyof Draft, value: string) =>
    setDraft(previous => previous ? { ...previous, [key]: value } : previous);

  return <>
    {!!error && <Text accessibilityRole="alert" style={{ color: '#B42318' }}>{error}</Text>}
    {!!notice && <Text accessibilityLiveRegion="polite">{notice}</Text>}
    {!data ? <Panel><BodyText>{error ? '募集を取得できませんでした。' : '読み込み中…'}</BodyText>
      {error && <AppButton label="再読み込み" onPress={() => void run(refresh)} />}</Panel> : <>
      <Panel>
        <SectionTitle>求人・企業募集一覧</SectionTitle>
        {data.canCreate && <AppButton label="募集を作成" onPress={() => {
          if (busy) return;
          open(null);
          setDraft({ ...emptyDraft });
        }} />}
        {data.jobs.length === 0 && <BodyText>閲覧できる募集はありません。</BodyText>}
        {data.jobs.map(item => <AppButton key={item.id} outline={item.id !== selected}
          label={`${item.deleted_at ? '［削除済み］' : ''}${(JSON.parse(item.document) as Draft).title}`}
          onPress={() => open(item.id)} />)}
      </Panel>
      {draft ? <Panel>
        <SectionTitle>{job ? '募集を編集' : '求人・企業募集を作成'}</SectionTitle>
        <AppSelect label={labels.kind} value={draft.kind} disabled={busy} onValueChange={value => setField('kind', value)}
          options={[{ label: '求人', value: 'JOB' }, { label: '企業の募集', value: 'COMPANY_RECRUITMENT' }]} />
        <AppSelect label={labels.employment} value={draft.employment} disabled={busy}
          onValueChange={value => setField('employment', value)}
          options={['正社員', '契約社員', '業務委託', 'アルバイト・パート', 'ボランティア'].map(value => ({ value, label: value }))} />
        {(['title', 'location', 'compensation'] as const).map(key => <AppInput key={key} label={labels[key]}
          value={draft[key]} editable={!busy} required maxLength={120} onChangeText={value => setField(key, value)} />)}
        <AppTextArea label={labels.description} value={draft.description} editable={!busy} required maxLength={8000}
          onChangeText={value => setField('description', value)} />
        <AppTextArea label={labels.requirements} value={draft.requirements} editable={!busy} maxLength={4000}
          onChangeText={value => setField('requirements', value)} />
        <AppButton label={busy ? '保存中…' : '保存する'} onPress={() => void run(save)} />
        <AppButton label="キャンセル" outline onPress={() => { if (!busy) setDraft(null); }} />
      </Panel> : job && <Panel>
        <SectionTitle>{(JSON.parse(job.document) as Draft).title}</SectionTitle>
        {Object.entries(JSON.parse(job.document) as Draft).filter(([key]) => key !== 'title').map(([key, value]) =>
          <BodyText key={key}>{labels[key as keyof Draft]}　{key === 'kind' ? (value === 'JOB' ? '求人' : '企業の募集') : value || '—'}</BodyText>)}
        {!job.deleted_at && job.can_edit && <AppButton label="編集" onPress={() => {
          if (!busy) setDraft(JSON.parse(job.document) as Draft);
        }} />}
        {!job.deleted_at && data.owner && <>
          <AppButton label="従業員の閲覧・編集権限" outline onPress={() => void run(async () =>
            setGrants(await request<Grant[]>(`/${job.id}/access`)))} />
          <AppButton label={deleteConfirm ? '削除を確定する' : '削除'} danger onPress={() => {
            if (busy) return;
            if (!deleteConfirm) { setDeleteConfirm(true); return; }
            void run(async () => {
              await request(`/${job.id}/delete`, {});
              setDeleteConfirm(false);
              setGrants(null);
              setHistory(null);
              setNotice('募集を削除しました。');
              await refresh();
            });
          }} />
          {deleteConfirm && <AppButton label="削除をキャンセル" outline onPress={() => setDeleteConfirm(false)} />}
        </>}
        <AppButton label="変更履歴を表示" outline onPress={() => void run(async () =>
          setHistory(await request<History[]>(`/${job.id}/history`)))} />
      </Panel>}
      {job && !job.deleted_at && grants && <Panel>
        <SectionTitle>求人別の権限</SectionTitle>
        <BodyText>編集を許可した従業員は、編集に必要な募集内容も表示できます。</BodyText>
        {data.employees.length === 0 && <BodyText>登録済みの従業員がいません。</BodyText>}
        {data.employees.map(employee => {
          const grant = grants.find(value => value.employeeId === employee.id) ??
            { employeeId: employee.id, canView: false, canEdit: false };
          function change(next: Grant) {
            setGrants(old => [...(old ?? []).filter(value => value.employeeId !== employee.id), next]);
          }
          return <View key={employee.id} style={{ gap: 8 }}>
            <BodyText>{employee.display_name}</BodyText>
            <AppCheckbox label="閲覧" checked={grant.canView} disabled={busy}
              onValueChange={canView => change({ ...grant, canView })} />
            <AppCheckbox label="編集" checked={grant.canEdit} disabled={busy}
              onValueChange={canEdit => change({ ...grant, canEdit })} />
          </View>;
        })}
        <AppButton label="権限を保存" onPress={() => void run(async () => {
          await request(`/${job.id}/access`, grants);
          setHistory(null);
          setNotice('権限を保存しました。');
        })} />
      </Panel>}
      {history && <Panel>
        <SectionTitle>変更履歴（最新100件）</SectionTitle>
        {history.length === 0 && <BodyText>変更履歴はありません。</BodyText>}
        {history.map((row, index) => <HistoryEntry key={index} row={row} />)}
      </Panel>}
      {data.owner && <Panel>
        <SectionTitle>従業員の作成・全件編集権限</SectionTitle>
        {data.employees.map(employee => <View key={employee.id} style={{ gap: 8 }}>
          <BodyText>{employee.display_name}</BodyText>
          <AppCheckbox label="求人・企業募集の作成" checked={employee.can_create} disabled={busy}
            onValueChange={value => void run(() => saveRole(employee, value, employee.edit_all))} />
          <AppCheckbox label="自社の全求人・募集の編集" checked={employee.edit_all} disabled={busy || !employee.can_create}
            onValueChange={value => void run(() => saveRole(employee, employee.can_create, value))} />
        </View>)}
        {data.employees.length === 0 && <BodyText>従業員管理から従業員を登録してください。</BodyText>}
      </Panel>}
    </>}
  </>;
}

function HistoryEntry({ row }: { row: History }) {
  const actionLabel = { CREATE: '作成', EDIT: '編集', DELETE: '削除', ACCESS: '求人別権限の変更' };
  const before = row.before_value ? JSON.parse(row.before_value) : {};
  const after = row.after_value ? JSON.parse(row.after_value) : {};
  const keys = Object.keys(labels) as (keyof Draft)[];
  const label = actionLabel[row.action as keyof typeof actionLabel] ?? row.action;
  return <View style={{ gap: 4, paddingVertical: 8 }}>
    <Text>{label} ／ {row.actor_name} ／ {new Date(row.changed_at).toLocaleString('ja-JP')}</Text>
    {row.action === 'ACCESS' ? <BodyText>{row.before_value} → {row.after_value}</BodyText> :
      keys.filter(key => before[key] !== after[key]).map(key =>
        <BodyText key={key}>{labels[key]}　{before[key] ?? '—'} → {after[key] ?? '—'}</BodyText>)}
  </View>;
}

import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/auth/AuthProvider';
import { AppDatePicker, AppInput, AppTextArea, AppSelect, AppTagInput } from '@/components/form';
import { AppButton, Panel, SectionTitle } from '@/components/ui/AppUI';
import { useAccount } from './AccountProvider';
import { profileError, type Profile } from './data';

export default function ProfilePanel() {
  const { user } = useAuth();
  const { data, saveProfile } = useAccount();
  const [draft, setDraft] = useState<Profile | null>(data?.profile ?? null);
  const [busy, setBusy] = useState(false), [notice, setNotice] = useState(''), [error, setError] = useState('');
  useEffect(() => { setDraft(data?.profile ?? null); }, [data?.profile]);
  if (!draft) return null;
  const change = <K extends keyof Profile>(key: K, value: Profile[K]) => { setDraft(previous => previous ? { ...previous, [key]: value } : previous); setNotice(''); };
  const field = (key: keyof Omit<Profile, 'skills'>) => ({ value: draft[key], onChangeText: (v: string) => change(key, v), disabled: busy });
  async function save() {
    if (!draft || busy) return;
    const invalid = profileError(draft); if (invalid) { setError(invalid); return; }
    setBusy(true); setError(''); setNotice('');
    try { await saveProfile(draft); setNotice('プロフィールをこの端末に保存しました。'); } catch (e) { setError(e instanceof Error ? e.message : '保存できませんでした。'); } finally { setBusy(false); }
  }
  return <View style={s.stack}>
    <Panel><SectionTitle>基本プロフィール</SectionTitle><Text style={s.hint}>氏名と生年月日は必須です。住所は市区町村まで入力してください。</Text>
      <View style={s.grid}><AppInput label="姓" required {...field('familyName')} maxLength={50} containerStyle={s.cell}/><AppInput label="名" required {...field('givenName')} maxLength={50} containerStyle={s.cell}/></View>
      <View style={s.grid}><AppInput label="姓（カナ）" {...field('familyKana')} maxLength={50} containerStyle={s.cell}/><AppInput label="名（カナ）" {...field('givenKana')} maxLength={50} containerStyle={s.cell}/></View>
      <View style={s.grid}><AppDatePicker label="生年月日" required value={draft.birthDate} onValueChange={v => change('birthDate', v)} disabled={busy} containerStyle={s.cell}/><AppInput label="住所（市区町村まで）" {...field('city')} maxLength={100} containerStyle={s.cell}/></View>
      <View style={s.grid}><AppInput label="電話番号（任意）" keyboardType="phone-pad" {...field('phone')} maxLength={25} containerStyle={s.cell}/><AppInput label="事業名（任意）" {...field('businessName')} maxLength={100} containerStyle={s.cell}/></View>
      {user && <AppInput label="登録メールアドレス" value={user.email} editable={false} hint="メールアドレスは認証情報から表示しています。"/>}
      <AppSelect label="移動手段" value={draft.transport} onValueChange={v => change('transport', v)} disabled={busy} options={['未選択','車','バイク','公共交通','自転車','徒歩'].map((label,i) => ({ label, value: i === 0 ? '' : label }))}/>
    </Panel>
    <Panel><SectionTitle>自己紹介・スキル</SectionTitle><AppTextArea label="自己紹介" {...field('bio')} maxLength={2000}/><AppTextArea label="趣味・興味" {...field('hobbies')} maxLength={1000}/><AppTagInput label="スキル" value={draft.skills} onValueChange={v => change('skills',v)} disabled={busy} suggestions={['Java','React','TypeScript','Excel','デザイン']} /></Panel>
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}{!!notice && <Text accessibilityLiveRegion="polite" style={s.notice}>{notice}</Text>}
    <View style={s.actions}><AppButton label="変更を戻す" outline onPress={() => { if (!busy) { setDraft(data?.profile ?? null); setError(''); setNotice(''); } }}/><AppButton label={busy ? '保存中…' : 'プロフィールを保存'} onPress={() => void save()}/></View>
  </View>;
}
const s = StyleSheet.create({ stack: { gap: 16 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 }, cell: { flex: 1, minWidth: 220, maxWidth: '100%' }, hint: { color: '#64748B', fontSize: 12, lineHeight: 20 }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, error: { color: '#B42318' }, notice: { color: '#13794E' } });

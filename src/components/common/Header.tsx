import { useAuth } from '@/auth/AuthProvider';
import { C } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Logo } from './Logo';

type Panel = '通知' | 'お気に入り' | 'メッセージ';
type Item = { label: string; path?: Href; panel?: Panel };
const publicItems: Item[] = [
  { label: '求人を探す', path: '/jobs' }, { label: '企業を探す', path: '/companies' },
  { label: '評価について', path: '/reviews' }, { label: '料金', path: '/price' },
  { label: 'ご利用ガイド', path: '/guide' },
];
const memberItems: Item[] = [
  { label: '求人を探す', path: '/jobs' }, { label: '企業を探す', path: '/companies' },
  { label: 'お気に入り', path: '/favorites' }, { label: 'メッセージ', path: '/messages' },
];

/** All public/search/management screens share authentication and navigation here. */
export function Header({ desktop }: { desktop?: boolean }) {
  const { user, ready } = useAuth();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const displayWidth = width;
  const wide = displayWidth >= 1200 && desktop !== false;
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<Panel | null>(null);
  useEffect(() => { setOpen(false); setPanel(null); }, [pathname, user?.id]);
  const items = user ? memberItems : publicItems;
  const navigate = (path: Href) => { setOpen(false); setPanel(null); router.push(path); };
  const select = (item: Item) => {
    setOpen(false);
    if (item.path) navigate(item.path);
    else if (item.panel) setPanel(item.panel);
  };
  const icon = (name: keyof typeof Ionicons.glyphMap, label: Panel) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={() => { setOpen(false); if (label === 'お気に入り') navigate('/favorites'); else setPanel(label); }} style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [s.icon, (hovered || pressed) && s.soft]}>
      <Ionicons name={name} size={23} color={C.navy} />
    </Pressable>
  );
  const links = (mobile: boolean) => items.map(item => {
    const active = !!item.path && (pathname === item.path || pathname.startsWith(`${item.path}/`));
    return <Pressable key={item.label} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => select(item)} style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [mobile ? s.mobileItem : s.navItem, active && s.active, (hovered || pressed) && s.soft]}>
      <Text style={[s.navText, active && { color: C.blue }]}>{item.label}</Text>
      {mobile && <Ionicons name="chevron-forward" size={17} color={C.muted} />}
    </Pressable>;
  });
  return <View style={s.header}>
    <View style={[s.inner, displayWidth < 480 && { paddingHorizontal: 12 }]}>
      <Logo width={displayWidth < 480 ? 145 : 200} />
      {wide && <View style={s.nav}>{links(false)}</View>}
      <View style={s.actions}>
        {!ready ? <View accessibilityLabel="ログイン状態を確認中" style={s.loading}><ActivityIndicator color={C.blue} /></View> : user ? <>
          {icon('notifications-outline', '通知')}
          {wide && icon('heart-outline', 'お気に入り')}
          <Pressable accessibilityRole="button" accessibilityLabel={`${user.displayName}のアカウント`} onPress={() => navigate('/auth')} style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [s.account, (hovered || pressed) && s.soft]}>
            <View style={s.avatar}><Text style={s.initial}>{Array.from(user.displayName.trim())[0] || 'U'}</Text></View>
            {(wide || displayWidth >= 600) && <Text numberOfLines={1} style={s.name}>{user.displayName}</Text>}
          </Pressable>
        </> : wide ? <>
          <Pressable accessibilityRole="button" onPress={() => navigate('/auth')} style={s.iconText}><Text style={s.login}>ログイン</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => navigate({ pathname: '/auth', params: { mode: 'register' } })} style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [s.register, (hovered || pressed) && { opacity: .8 }]}><Text style={s.registerText}>新規登録</Text></Pressable>
        </> : null}
        {!wide && <Pressable accessibilityRole="button" accessibilityLabel={open ? 'メニューを閉じる' : 'メニューを開く'} accessibilityState={{ expanded: open }} onPress={() => setOpen(v => !v)} style={s.icon}><Ionicons name={open ? 'close' : 'menu'} size={28} color={C.navy} /></Pressable>}
      </View>
    </View>
    {!wide && ready && !user && <View style={s.mobileAuth}><Pressable accessibilityRole="button" onPress={() => navigate('/auth')} style={s.iconText}><Text style={s.login}>ログイン</Text></Pressable><Pressable accessibilityRole="button" onPress={() => navigate({ pathname: '/auth', params: { mode: 'register' } })} style={s.register}><Text style={s.registerText}>新規登録</Text></Pressable></View>}
    {!wide && open && <View style={s.mobileMenu}>{links(true)}{user && <Pressable accessibilityRole="button" onPress={() => navigate('/auth')} style={s.mobileItem}><Text style={s.navText} numberOfLines={1}>{user.displayName} ／ アカウント</Text></Pressable>}</View>}
    <Modal visible={panel !== null} transparent animationType="fade" onRequestClose={() => setPanel(null)}>
      <View style={s.overlay}><Pressable accessibilityRole="button" accessibilityLabel="閉じる" style={StyleSheet.absoluteFill} onPress={() => setPanel(null)} /><View accessibilityViewIsModal style={s.dialog}>
        <View style={s.dialogHeading}><Text accessibilityRole="header" style={s.dialogTitle}>{panel}</Text><Pressable accessibilityRole="button" accessibilityLabel="閉じる" onPress={() => setPanel(null)} style={s.icon}><Ionicons name="close" size={24} color={C.navy} /></Pressable></View>
        <Text style={s.description}>{panel}の一覧表示は準備中です。</Text>
        <Pressable accessibilityRole="button" onPress={() => setPanel(null)} style={s.register}><Text style={s.registerText}>閉じる</Text></Pressable>
      </View></View>
    </Modal>
  </View>;
}
const s = StyleSheet.create({
  header: { backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, zIndex: 5 },
  inner: { width: '100%', maxWidth: 1320, minHeight: 72, alignSelf: 'center', paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', gap: 12 },
  nav: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignSelf: 'stretch', gap: 10 },
  navItem: { justifyContent: 'center', paddingHorizontal: 10, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  active: { borderBottomColor: C.blue }, navText: { color: C.text, fontSize: 14, fontWeight: '700' },
  actions: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  soft: { backgroundColor: '#EFF6FF' }, iconText: { minHeight: 44, paddingHorizontal: 12, justifyContent: 'center' },
  login: { color: C.blue, fontWeight: '800', fontSize: 14 }, register: { backgroundColor: C.blue, minHeight: 42, paddingHorizontal: 20, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  registerText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  account: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 5, borderRadius: 9 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5F1FF', justifyContent: 'center', alignItems: 'center' },
  initial: { color: C.blue, fontSize: 16, fontWeight: '800' }, name: { maxWidth: 120, color: C.text, fontSize: 14, fontWeight: '700' },
  mobileAuth: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, paddingHorizontal: 16, paddingBottom: 10 },
  loading: { width: 64, alignItems: 'center' }, mobileMenu: { borderTopWidth: 1, borderColor: C.border, padding: 14, gap: 4 },
  mobileItem: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: C.border },
  overlay: { flex: 1, backgroundColor: 'rgba(8,27,80,.35)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialog: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 16, padding: 22, gap: 20 },
  dialogHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, dialogTitle: { color: C.navy, fontWeight: '800', fontSize: 21 }, description: { color: C.text, lineHeight: 24 },
});

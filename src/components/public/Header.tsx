import { COLORS } from '@constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

type NavItem = { label: string; route: Href };

const navItems: NavItem[] = [
    { label: '求人を探す', route: '/jobs' as Href },
    { label: '企業を探す', route: '/companies' as Href },
    { label: '評価について', route: '/reviews' as Href },
    { label: '料金', route: '/pricing' as Href },
];

export default function HeaderComponent() {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1040;
    const [menuOpen, setMenuOpen] = useState(false);

    const move = (route: Href) => {
        setMenuOpen(false);
        router.push(route);
    };

    return (
        <View style={styles.headerWrap}>
            <View style={styles.header}>
                <Pressable onPress={() => move('/' as Href)} style={styles.brand}>
                    <View style={styles.logoMark}><Text style={styles.logoText}>GW</Text></View>
                    <Text style={styles.brandText}>GlobalWorkers</Text>
                </Pressable>

                {isDesktop ? (
                    <>
                        <View style={styles.navigation}>
                            {navItems.map((item) => (
                                <Pressable key={item.label} onPress={() => move(item.route)} style={styles.navButton}>
                                    <Text style={styles.navText}>{item.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                        <View style={styles.actions}>
                            <Pressable onPress={() => move('/login' as Href)} style={styles.loginButton}>
                                <Text style={styles.loginText}>ログイン</Text>
                            </Pressable>
                            <Pressable onPress={() => move('/signup/user' as Href)} style={styles.primaryButton}>
                                <Text style={styles.primaryText}>無料で始める</Text>
                            </Pressable>
                        </View>
                    </>
                ) : (
                    <Pressable onPress={() => setMenuOpen((v) => !v)} style={styles.menuButton}>
                        <Ionicons name={menuOpen ? 'close' : 'menu'} size={25} color={COLORS.navy} />
                    </Pressable>
                )}
            </View>

            {!isDesktop && menuOpen && (
                <View style={styles.mobileMenu}>
                    {navItems.map((item) => (
                        <Pressable key={item.label} onPress={() => move(item.route)} style={styles.mobileItem}>
                            <Text style={styles.mobileText}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
                        </Pressable>
                    ))}
                    <View style={styles.mobileActions}>
                        <Pressable onPress={() => move('/login' as Href)} style={[styles.secondaryButton, styles.mobileAction]}>
                            <Text style={styles.secondaryText}>ログイン</Text>
                        </Pressable>
                        <Pressable onPress={() => move('/signup/user' as Href)} style={[styles.primaryButton, styles.mobileAction]}>
                            <Text style={styles.primaryText}>無料で始める</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrap: { zIndex: 20, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    header: { minHeight: 72, width: '100%', maxWidth: 1440, alignSelf: 'center', paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center' },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    logoMark: { width: 40, height: 40, borderRadius: 13, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
    logoText: { color: '#fff', fontSize: 14, fontWeight: '800' },
    brandText: { color: COLORS.navy, fontSize: 20, fontWeight: '800' },
    navigation: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    navButton: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
    navText: { color: '#35435A', fontSize: 14, fontWeight: '600' },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    loginButton: { minHeight: 42, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
    loginText: { color: COLORS.navy, fontSize: 14, fontWeight: '700' },
    primaryButton: { minHeight: 43, paddingHorizontal: 17, borderRadius: 11, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
    primaryText: { color: '#fff', fontSize: 13, fontWeight: '800' },
    secondaryButton: { minHeight: 43, paddingHorizontal: 17, borderRadius: 11, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    secondaryText: { color: COLORS.navy, fontSize: 13, fontWeight: '700' },
    menuButton: { marginLeft: 'auto', width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    mobileMenu: { paddingHorizontal: 18, paddingBottom: 18, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
    mobileItem: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.border },
    mobileText: { color: COLORS.ink, fontSize: 15, fontWeight: '600' },
    mobileActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
    mobileAction: { flex: 1 },
});

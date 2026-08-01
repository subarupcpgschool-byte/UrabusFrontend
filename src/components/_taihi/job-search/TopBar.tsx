import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, type Href } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: '求人を探す', href: '/jobs' },
  { label: '企業を探す', href: '/companies' },
  { label: 'GlobalWorkersについて', href: '/about' },
] as const;

export default function TopBar() {
  const { width } = useWindowDimensions();
  const horizontalPadding = Math.max(20, Math.min(width * 0.06, 72));

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={[styles.inner, { paddingHorizontal: horizontalPadding }]}>
        <Link href={'/' as Href} asChild>
          <Pressable style={styles.logoLink}>
            <LinearGradient
              colors={['#6fc0f0', '#14284d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoMark}
            >
              <Feather name="globe" size={18} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.logoText}>GlobalWorkers</Text>
          </Pressable>
        </Link>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nav}
          style={styles.navScroll}
        >
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/jobs';

            return (
              <Link key={item.href} href={item.href as Href} asChild>
                <Pressable
                  style={StyleSheet.flatten([
                    styles.navLink,
                    active && styles.navLinkActive,
                  ])}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.navText, active && styles.navTextActive]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(20, 40, 77, 0.14)',
  },
  inner: {
    width: '100%',
    maxWidth: 1180,
    minHeight: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
  },
  logoLink: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 12,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#14284d',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  navScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  nav: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 24,
  },
  navLink: {
    minHeight: 60,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingTop: 2,
  },
  navLinkActive: {
    borderBottomColor: '#2f6fcb',
  },
  navText: {
    color: '#5b6b85',
    fontSize: 14,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#14284d',
  },
});

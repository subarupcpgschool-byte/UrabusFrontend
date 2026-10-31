import { useAuth } from '@/auth/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

/** The server and first client render share this shell, never a width-0 page. */
export default function AppReadyGate({ children }: PropsWithChildren) {
  const { ready: authReady } = useAuth();
  const { width, height } = useWindowDimensions();
  const [fontsLoaded, fontError] = useFonts(Ionicons.font);
  const [assetsReady, setAssetsReady] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);

  useEffect(() => {
    let active = true;
    // Failed assets must not leave the entire application permanently blocked.
    Asset.loadAsync(require('../../../assets/images/logo.svg'))
      .catch(error => console.warn('Logo preload failed', error))
      .finally(() => { if (active) setAssetsReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (width <= 0 || height <= 0) return;
    // Let React Native Web publish the browser dimensions before mounting routes.
    const frame = requestAnimationFrame(() => setLayoutReady(true));
    return () => cancelAnimationFrame(frame);
  }, [width, height]);

  useEffect(() => {
    if (fontError) console.warn('Icon font preload failed', fontError);
  }, [fontError]);

  if (!authReady || !assetsReady || !layoutReady || (!fontsLoaded && !fontError)) {
    return (
      <View style={styles.shell} accessibilityRole="progressbar" accessibilityLabel="画面を読み込んでいます">
        <Text style={styles.title}>GlobalWorkers</Text>
        {Platform.OS !== 'web' && <ActivityIndicator color="#2879D8" />}
        <Text style={styles.caption}>読み込み中…</Text>
      </View>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  shell: { flex: 1, minHeight: '100%', alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: '#F5F8FC' },
  title: { fontSize: 24, fontWeight: '700', color: '#183455' },
  caption: { fontSize: 14, color: '#61738B' },
});

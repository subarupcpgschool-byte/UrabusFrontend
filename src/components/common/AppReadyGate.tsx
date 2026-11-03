import { useAuth } from '@/auth/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { useWindowDimensions } from 'react-native';
import OrbitLoadingScreen from './OrbitLoadingScreen';

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
    return <OrbitLoadingScreen />;
  }
  return <>{children}</>;
}

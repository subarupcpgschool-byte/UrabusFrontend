import { useLocaleVersion } from "@/i18n/display";
import { useAuth } from "@/auth/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Asset } from "expo-asset";
import {
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useWindowDimensions } from "react-native";
import OrbitLoadingScreen from "./OrbitLoadingScreen";

/** The server and first client render share this shell, never a width-0 page. */
export default function AppReadyGate({ children }: PropsWithChildren) {
  "use no memo";
  useLocaleVersion();
  const { ready: authReady } = useAuth();
  const { width, height } = useWindowDimensions();
  const [fontsLoaded, fontError] = useFonts(Ionicons.font);
  const [assetsReady, setAssetsReady] = useState(false);
  const [layoutReady, setLayoutReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [logoShown, setLogoShown] = useState(false);
  const handleLogoReady = useCallback(() => setLogoReady(true), []);

  useEffect(() => {
    if (!logoReady) return;
    let secondFrame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Start the minimum visible time only after the logo can be painted.
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        timer = setTimeout(() => setLogoShown(true), 450);
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [logoReady]);

  useEffect(() => {
    let active = true;
    // Failed assets must not leave the entire application permanently blocked.
    Asset.loadAsync(require("../../../assets/images/logo.svg"))
      .catch((error) => console.warn("Logo preload failed", error))
      .finally(() => {
        if (active) setAssetsReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (width <= 0 || height <= 0) return;
    // Let React Native Web publish the browser dimensions before mounting routes.
    const frame = requestAnimationFrame(() => setLayoutReady(true));
    return () => cancelAnimationFrame(frame);
  }, [width, height]);

  useEffect(() => {
    if (fontError) console.warn("Icon font preload failed", fontError);
  }, [fontError]);

  if (
    !authReady ||
    !assetsReady ||
    !layoutReady ||
    !logoShown ||
    (!fontsLoaded && !fontError)
  ) {
    return <OrbitLoadingScreen onLogoReady={handleLogoReady} />;
  }
  return <>{children}</>;
}

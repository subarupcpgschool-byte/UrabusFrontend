import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import LoadingLogoFallback, { type LoadingLogoProps } from './LoadingLogoFallback';
import { loadingLogoUri } from './loadingLogoSource';

export default function LoadingLogo({ onReady }: LoadingLogoProps) {
  const [displayed, setDisplayed] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (displayed || failed) return;
    const timer = setTimeout(() => setFailed(true), 5000);
    return () => clearTimeout(timer);
  }, [displayed, failed]);
  useEffect(() => { if (displayed) onReady?.(); }, [displayed, onReady]);
  if (failed) return <LoadingLogoFallback onReady={onReady} />;
  return <Image
    source={{ uri: loadingLogoUri }}
    style={{ width: 252, height: 84 }}
    contentFit="contain"
    priority="high"
    transition={0}
    onDisplay={() => setDisplayed(true)}
    onError={() => setFailed(true)}
    accessibilityLabel="GlobalWorkers"
  />;
}

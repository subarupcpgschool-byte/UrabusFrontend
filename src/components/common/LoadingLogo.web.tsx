import { loadingLogoUri } from './loadingLogoSource';
import { useEffect, useRef, useState } from 'react';
import LoadingLogoFallback, { type LoadingLogoProps } from './LoadingLogoFallback';

// A regular inline image is present in the initial HTML, before hydration.
export default function LoadingLogo({ onReady }: LoadingLogoProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (failed) return;
    const image = imageRef.current;
    if (!image) return;
    let active = true;
    const timer = setTimeout(() => { if (active) setFailed(true); }, 5000);
    const fail = () => { if (active) { clearTimeout(timer); setFailed(true); } };
    const ready = async () => {
      try {
        if (typeof image.decode === 'function') await image.decode();
        if (active) {
          if (image.naturalWidth === 0) { fail(); return; }
          clearTimeout(timer);
          onReady?.();
        }
      } catch { fail(); }
    };
    image.addEventListener('load', ready);
    image.addEventListener('error', fail);
    // A cached/SSR image may have loaded before React attaches its handlers.
    if (image.complete) void ready();
    return () => {
      active = false;
      clearTimeout(timer);
      image.removeEventListener('load', ready);
      image.removeEventListener('error', fail);
    };
  }, [failed, onReady]);
  if (failed) return <LoadingLogoFallback onReady={onReady} />;
  return <img
    ref={imageRef}
    src={loadingLogoUri}
    alt="GlobalWorkers"
    width={252}
    height={84}
    loading="eager"
    decoding="sync"
    draggable={false}
    style={{ display: 'block', objectFit: 'contain', flexShrink: 0 }}
  />;
}

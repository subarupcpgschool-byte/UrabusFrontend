import { useEffect, useRef, useState } from 'react';
import { useIsFocused, usePreventRemove } from '@react-navigation/native';
import { router, useNavigation, usePathname, type Href } from 'expo-router';
import { Platform } from 'react-native';

export function useSettingsExitGuard(dirty: boolean, discard: () => void) {
  const navigation = useNavigation();
  const pathname = usePathname();
  const focused = useIsFocused();
  const [pending, setPending] = useState<(() => void) | null>(null);
  const webEntry = useRef<{ url: string; state: unknown } | null>(null);
  const confirmed = useRef<(() => void) | null>(null);
  const block = focused && dirty;
  usePreventRemove(block, ({ data }) => {
    setPending(() => () => navigation.dispatch(data.action));
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || !block) return;
    webEntry.current = { url: window.location.href, state: window.history.state };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const onHistoryChange = (event: PopStateEvent) => {
      if (window.location.href === webEntry.current?.url) return;
      // Forward navigation can leave this screen in the stack, so it may not trigger beforeRemove.
      event.stopImmediatePropagation();
      const state = event.state;
      setPending(() => () => window.dispatchEvent(new PopStateEvent('popstate', { state })));
    };
    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('popstate', onHistoryChange, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('popstate', onHistoryChange, true);
    };
  }, [block]);

  useEffect(() => {
    if (block || !confirmed.current) return;
    const action = confirmed.current;
    confirmed.current = null;
    action();
  }, [block]);

  function navigate(path: Href) {
    const nextPath = typeof path === 'string' ? path : path.pathname;
    if (nextPath === pathname) return;
    if (block) setPending(() => () => router.push(path));
    else router.push(path);
  }

  function stay() {
    // A browser back action changes the address before the stack guard runs.
    const entry = webEntry.current;
    if (Platform.OS === 'web' && entry && window.location.href !== entry.url) {
      window.history.pushState(entry.state, '', entry.url);
    }
    setPending(null);
  }

  function leave() {
    if (!pending) return;
    confirmed.current = pending;
    setPending(null);
    discard();
  }

  return { navigate, stay, leave, showing: pending !== null };
}

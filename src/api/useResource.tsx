import { sourceText } from "@/i18n/source";
import { tText, useLocaleVersion } from "@/i18n/display";
import { Text } from "@/i18n/native";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { AppButton } from "@/components/ui/AppUI";
import { dataRequest, dataRevision, subscribeData } from "./platform";
export function useResource<T>(
  path: string | null,
  initial: T,
  privateData = false,
) {
  const { token, ready } = useAuth();
  const revision = useSyncExternalStore(subscribeData, dataRevision, () => 0);
  const [retry, setRetry] = useState(0);
  const key =
    ready && path && (!privateData || token)
      ? `${token ?? "public"}:${path}`
      : null;
  const [state, setState] = useState<{
    key: string | null;
    data: T;
    loading: boolean;
    error: string;
    resolved: boolean;
  }>({ key: null, data: initial, loading: false, error: "", resolved: false });
  const initialRef = useRef(initial);
  initialRef.current = initial;
  useEffect(() => {
    if (!key || !path) return;
    let active = true;
    const controller = new AbortController();
    setState((old) => ({
      key,
      data: old.key === key ? old.data : initialRef.current,
      loading: true,
      error: "",
      resolved: old.key === key && old.resolved,
    }));
    dataRequest<T>(path, token, undefined, "GET", controller.signal)
      .then((data) => {
        if (active)
          setState({ key, data, loading: false, error: "", resolved: true });
      })
      .catch((e) => {
        if (active)
          setState((old) => ({
            key,
            data: old.key === key ? old.data : initialRef.current,
            loading: false,
            error: e instanceof Error ? e.message : sourceText("unableToLoad"),
            resolved: true,
          }));
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [key, revision, retry]);
  const refresh = useCallback(() => setRetry((n) => n + 1), []);
  return {
    data: key && state.key === key ? state.data : initial,
    loading: !ready || (!!key && (state.key !== key || state.loading)),
    error: key && state.key === key ? state.error : "",
    refresh,
    loaded: !key ? ready : state.key === key && state.resolved,
    available: !!key,
  };
}
export function ResourceStatus({
  loading,
  error,
  onRetry,
  privateData = false,
}: {
  loading: boolean;
  error: string;
  onRetry: () => void;
  privateData?: boolean;
}) {
  "use no memo";
  useLocaleVersion();
  const { user, ready } = useAuth();
  if (privateData && ready && !user)
    return (
      <AppButton
        label={tText("logInToContinue")}
        onPress={() => router.push("/auth")}
      />
    );
  if (error)
    return (
      <View style={{ gap: 10, padding: 12 }}>
        <Text accessibilityRole="alert" style={{ color: "#B42318" }}>
          {error}
        </Text>
        <AppButton label={tText("reload")} outline onPress={onRetry} />
      </View>
    );
  return loading ? (
    <Text style={{ padding: 10, color: "#64748B" }}>{tText("loading")}</Text>
  ) : null;
}

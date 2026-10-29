import { Ionicons } from "@expo/vector-icons";
import { useWorkspace, type Favorite } from "@/features/workspace/WorkspaceProvider";
import { useAuth } from "@/auth/AuthProvider";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { SEARCH_COLORS as C } from "./theme";

export default function FavoriteButton({ type = "bookmark", label, item, kind }: { type?: "bookmark" | "heart"; label: string; item: Favorite["item"]; kind: Favorite["kind"] }) {
  const { favorites, ready, toggleFavorite } = useWorkspace();
  const { user, ready: authReady } = useAuth();
  const active = favorites.some(f => f.key === `${kind}:${item.id}`);
  const name = type === "heart" ? active ? "heart" : "heart-outline" : active ? "bookmark" : "bookmark-outline";
  return <Pressable accessibilityRole="button" accessibilityLabel={`${label}をお気に入り${active ? "から解除" : "に登録"}`} accessibilityState={{ selected: active }} disabled={!authReady || (!!user && !ready)} onPress={() => user ? toggleFavorite(kind, item) : router.push("/auth")} style={({ pressed }) => [s.button, pressed && s.pressed]}><Ionicons name={name} size={23} color={active ? C.danger : C.primary} /></Pressable>;
}
const s = StyleSheet.create({ button:{width:40,height:40,borderRadius:9,borderWidth:1,borderColor:C.border,backgroundColor:C.white,alignItems:"center",justifyContent:"center"},pressed:{opacity:.65,transform:[{scale:.96}]} });

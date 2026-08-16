import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SEARCH_COLORS as C } from "./theme";

export default function FavoriteButton({ type = "bookmark", label }: { type?: "bookmark" | "heart"; label: string }) {
  const [active, setActive] = useState(false);
  const name = type === "heart" ? active ? "heart" : "heart-outline" : active ? "bookmark" : "bookmark-outline";
  return <Pressable accessibilityLabel={`${label}をお気に入り`} accessibilityState={{ selected: active }} onPress={() => setActive(v => !v)} style={({ pressed }) => [s.button, pressed && s.pressed]}><Ionicons name={name} size={23} color={active ? C.danger : C.primary} /></Pressable>;
}
const s = StyleSheet.create({ button:{width:40,height:40,borderRadius:9,borderWidth:1,borderColor:C.border,backgroundColor:C.white,alignItems:"center",justifyContent:"center"},pressed:{opacity:.65,transform:[{scale:.96}]} });

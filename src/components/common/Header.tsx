import { router } from "expo-router";
import { useAuth } from "@/auth/AuthProvider";
import { C } from "@/theme/colors";
import { notify } from "@/utils/pathUtils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { Logo } from "./Logo";

export function Header({ desktop }: { desktop: boolean }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const items = [
    {
      path: "/jobs",
      text: "求人を探す",
    },
    {
      path: "/companies",
      text: "企業を探す",
    },
    {
      path: "/ssss",
      text: "評価について",
    },
    {
      path: "/price",
      text: "料金",
    },
    {
      path: "/guide",
      text: "ご利用ガイド",
    },
  ];
  return (
    <View style={s.header}>
      <View style={s.headerInner}>
        <Logo />
        {desktop ? (
          <>
            <View style={s.nav}>
              {items.map((x) => (
                <Pressable key={x.path} onPress={() => x.path === "/price" ? router.push("/price") : notify(x.text)}>
                  <Text style={s.navText}>{x.text}</Text>
                </Pressable>
              ))}
            </View>
            <View style={s.headerActions}>
              <Pressable onPress={() => router.push("/auth")}>
                <Text style={s.login}>{user ? user.displayName : "ログイン"}</Text>
              </Pressable>
              <Button label={user ? "アカウント" : "無料で始める"} onPress={() => router.push(user ? "/auth" : { pathname: "/auth", params: { mode: "register" } })} />
            </View>
          </>
        ) : (
          <Pressable onPress={() => setOpen((v) => !v)} style={s.menu}>
            <Ionicons name={open ? "close" : "menu"} size={29} color={C.navy} />
          </Pressable>
        )}
      </View>
      {!desktop && open && (
        <View style={s.mobileMenu}>
          <Pressable onPress={() => router.push("/auth")} style={s.mobileItem}><Text style={s.login}>{user ? user.displayName : "ログイン"}</Text></Pressable>
          {items.map((x) => (
            <Pressable
              key={x.path}
              onPress={() => x.path === "/price" ? router.push("/price") : notify(x.text)}
              style={s.mobileItem}
            >
              <Text style={s.navText}>{x.text}</Text>
              <Ionicons name="chevron-forward" size={18} color={C.muted} />
            </Pressable>
          ))}
          <Button label={user ? "アカウント" : "無料で始める"} onPress={() => router.push(user ? "/auth" : { pathname: "/auth", params: { mode: "register" } })} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    zIndex: 5,
  },
  headerInner: {
    width: "100%",
    maxWidth: 1320,
    minHeight: 72,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  nav: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 27 },
  navText: { color: C.text, fontSize: 14, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 20 },
  login: { color: C.blue, fontWeight: "800" },
  menu: {
    marginLeft: "auto",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileMenu: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  mobileItem: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
});

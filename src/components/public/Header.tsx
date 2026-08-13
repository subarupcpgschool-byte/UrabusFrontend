import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";

import { BREAKPOINTS, COLORS, GRADIENTS } from "@/theme/GlobalWorkersStyles";
import {
  responsiveStyle,
  responsiveStyles,
  responsiveTextStyle,
} from "@/theme/themeUtils";

const NAVIGATION: [string, string][] = [
  ["求人を探す", "/jobs"],
  ["企業を探す", "/companies"],
  ["評価について", "/reviews"],
  ["料金", "/pricing"],
];

export default function HeaderComponent() {
  const { width } = useWindowDimensions();
  const desktop = width >= BREAKPOINTS.desktop;
  const [open, setOpen] = useState(false);

  const go = (href: string) => {
    setOpen(false);
    router.push(href as Href);
  };

  return (
    <View
      style={[
        ...responsiveStyle("publicHeader", width),
        {
          justifyContent: "space-around",
          flexDirection: "row",
          paddingHorizontal: width < BREAKPOINTS.tablet ? 15 : 28,
        },
      ]}
    >
      <View
        style={{
          width: "100%",
          maxWidth: 1240,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: desktop ? 48 : 14,
        }}
      >
        <Pressable
          onPress={() => go("/")}
          style={[...responsiveStyle("brand", width), { flexDirection: "row" }]}
        >
          <LinearGradient
            colors={[...GRADIENTS.logoMark]}
            style={responsiveStyles(["logoMark"], width) as never}
          >
            <Text
              style={[
                responsiveTextStyle(["logoMark"], width),
                { color: COLORS.white },
              ]}
            >
              GW
            </Text>
          </LinearGradient>

          <Text style={responsiveTextStyle(["brandStrong"], width)}>
            GlobalWorkers
          </Text>
        </Pressable>

        {desktop ? (
          <>
            <View
              style={[
                ...responsiveStyle("publicHeaderNav", width),
                {
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "right",
                },
              ]}
            >
              {NAVIGATION.map(([label, href]) => (
                <Pressable
                  key={href}
                  onPress={() => go(href)}
                  style={{ paddingVertical: 10 }}
                >
                  <Text style={responsiveTextStyle(["publicHeaderNav"], width)}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View
              style={[
                ...responsiveStyle("headerActions", width),
                { flexDirection: "row" },
              ]}
            >
              <Pressable
                onPress={() => go("/login")}
                style={responsiveStyles(["btn", "btnLink"], width) as never}
              >
                <Text style={responsiveTextStyle(["btn", "btnLink"], width)}>
                  ログイン
                </Text>
              </Pressable>

              <Pressable
                onPress={() => go("/signup/user")}
                style={responsiveStyles(["btn", "btnPrimary"], width) as never}
              >
                <Text
                  style={[
                    responsiveTextStyle(["btn", "btnPrimary"], width),
                    { color: COLORS.white },
                  ]}
                >
                  無料で始める
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable
            onPress={() => setOpen((value) => !value)}
            style={[
              ...responsiveStyle("mobileMenu", width),
              {
                marginLeft: "auto",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
              },
            ]}
          >
            <Ionicons
              name={open ? "close" : "menu"}
              size={24}
              color={COLORS.navy}
            />
          </Pressable>
        )}
      </View>

      {!desktop && open ? (
        <View
          style={{
            position: "absolute",
            top: 70,
            left: 0,
            right: 0,
            backgroundColor: COLORS.white,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.line,
            paddingHorizontal: 18,
            paddingBottom: 18,
            zIndex: 50,
          }}
        >
          {NAVIGATION.map(([label, href]) => (
            <Pressable
              key={href}
              onPress={() => go(href)}
              style={{
                minHeight: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderTopColor: COLORS.line,
              }}
            >
              <Text style={{ color: COLORS.ink, fontWeight: "600" }}>
                {label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
            </Pressable>
          ))}

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 14,
            }}
          >
            <Pressable
              onPress={() => go("/login")}
              style={[
                ...(responsiveStyles(["btn", "btnGhost"], width) as never),
                { flex: 1 },
              ]}
            >
              <Text style={responsiveTextStyle(["btn", "btnGhost"], width)}>
                ログイン
              </Text>
            </Pressable>

            <Pressable
              onPress={() => go("/signup/user")}
              style={[
                ...(responsiveStyles(["btn", "btnPrimary"], width) as never),
                { flex: 1 },
              ]}
            >
              <Text
                style={[
                  responsiveTextStyle(["btn", "btnPrimary"], width),
                  { color: COLORS.white },
                ]}
              >
                無料で始める
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

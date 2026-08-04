import { LinearGradient } from "expo-linear-gradient";
import { Text, useWindowDimensions, View } from "react-native";

import { COLORS, GRADIENTS } from "@/theme/GlobalWorkersStyles";
import { responsiveStyle, responsiveTextStyle } from "@/theme/themeUtils";

export default function FooterComponent() {
  const { width } = useWindowDimensions();

  return (
    <View
      style={[
        ...responsiveStyle("publicFooter", width),
        {
          flexDirection: width < 700 ? "column" : "row",
          paddingHorizontal: width < 700 ? 18 : 28,
          paddingVertical: 30,
        },
      ]}
    >
      <View
        style={[...responsiveStyle("brand", width), { flexDirection: "row" }]}
      >
        <LinearGradient
          colors={[...GRADIENTS.logoMark]}
          style={[
            ...responsiveStyle("logoMark", width),
            { width: 32, height: 32 },
          ]}
        >
          <Text
            style={[
              responsiveTextStyle(["logoMark"], width),
              { color: COLORS.white, fontSize: 11 },
            ]}
          >
            GW
          </Text>
        </LinearGradient>

        <Text
          style={[
            responsiveTextStyle(["brandStrong"], width),
            { color: COLORS.white },
          ]}
        >
          GlobalWorkers
        </Text>
      </View>

      <Text style={responsiveTextStyle(["publicFooterP"], width)}>
        評価でつながる直接雇用プラットフォーム
      </Text>

      <Text style={responsiveTextStyle(["publicFooterSmall"], width)}>
        © 2026 GlobalWorkers
      </Text>
    </View>
  );
}

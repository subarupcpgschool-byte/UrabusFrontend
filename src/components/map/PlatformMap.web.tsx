import { COLORS } from "@/theme/colors";
import type { PlatformMapProps } from "@/types/map";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

/**
 * Web向けの軽量マップ表示です。
 * react-native-maps をWeb bundleへ含めないため、platform fileで分離しています。
 * 本番でGoogle Maps / MapLibre / Leaflet等を採用する場合は、このファイルだけ差し替えられます。
 */
export default function PlatformMap({
  region,
  radiusKm,
  craftsmen,
}: PlatformMapProps) {
  const circleSize = radiusKm === 3 ? 150 : radiusKm === 5 ? 220 : 310;

  return (
    <View style={styles.map}>
      <View style={[styles.road, styles.road1]} />
      <View style={[styles.road, styles.road2]} />
      <View style={[styles.road, styles.road3]} />
      <View style={[styles.road, styles.road4]} />
      <View style={styles.park} />
      <View style={styles.river} />

      <Text style={[styles.mapLabel, { top: 24, left: 22 }]}>東大阪市</Text>
      <Text style={[styles.mapLabel, { bottom: 24, right: 28 }]}>
        現在地周辺
      </Text>

      <View
        pointerEvents="none"
        style={[
          styles.radius,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
          },
        ]}
      />

      <View style={styles.centerPin}>
        <Ionicons name="location" size={38} color={COLORS.primaryDark} />
      </View>

      {craftsmen.slice(0, 4).map((item, index) => (
        <View
          key={item.id}
          style={[
            styles.workerPin,
            index === 0 && { top: "25%", left: "25%" },
            index === 1 && { top: "32%", right: "18%" },
            index === 2 && { bottom: "21%", left: "30%" },
            index === 3 && { bottom: "26%", right: "25%" },
          ]}
        >
          <Ionicons name="person" size={13} color={COLORS.white} />
        </View>
      ))}

      <View style={styles.coordBadge}>
        <Text style={styles.coordText}>
          {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)} /{" "}
          {radiusKm}km
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    minHeight: 320,
    overflow: "hidden",
    backgroundColor: "#EEF2E9",
    position: "relative",
  },
  road: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    opacity: 0.92,
    borderWidth: 1,
    borderColor: "#E4E7E0",
  },
  road1: {
    width: "120%",
    height: 16,
    top: "25%",
    left: "-10%",
    transform: [{ rotate: "8deg" }],
  },
  road2: {
    width: "110%",
    height: 13,
    top: "58%",
    left: "-5%",
    transform: [{ rotate: "-5deg" }],
  },
  road3: {
    height: "130%",
    width: 14,
    left: "34%",
    top: "-15%",
    transform: [{ rotate: "4deg" }],
  },
  road4: {
    height: "125%",
    width: 11,
    right: "25%",
    top: "-10%",
    transform: [{ rotate: "-8deg" }],
  },
  park: {
    position: "absolute",
    width: 130,
    height: 80,
    right: 30,
    top: 28,
    borderRadius: 18,
    backgroundColor: "#DCECD2",
  },
  river: {
    position: "absolute",
    width: 38,
    height: "130%",
    right: 90,
    top: "-15%",
    backgroundColor: "#CDE9EF",
    transform: [{ rotate: "9deg" }],
  },
  radius: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    marginTop: -110,
    borderWidth: 2,
    borderColor: "rgba(79,141,89,0.72)",
    backgroundColor: "rgba(105,169,111,0.16)",
  },
  centerPin: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -19,
    marginTop: -24,
  },
  workerPin: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  mapLabel: {
    position: "absolute",
    color: "#667169",
    fontWeight: "800",
    fontSize: 12,
    backgroundColor: "rgba(255,255,255,0.72)",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  coordBadge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  coordText: { color: COLORS.textSub, fontSize: 10, fontWeight: "700" },
});

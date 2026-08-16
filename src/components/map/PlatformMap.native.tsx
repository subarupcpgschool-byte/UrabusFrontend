import { COLORS } from "@/theme/colors";
import type { PlatformMapProps } from "@/types/map";
import { StyleSheet } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

export default function PlatformMap({
  region,
  radiusKm,
  craftsmen,
  onRegionChangeComplete,
}: PlatformMapProps) {
  return (
    <MapView
      style={styles.map}
      region={region}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      <Marker
        coordinate={{ latitude: region.latitude, longitude: region.longitude }}
        title="検索中心"
        pinColor={COLORS.primary}
      />

      <Circle
        center={{ latitude: region.latitude, longitude: region.longitude }}
        radius={radiusKm * 1000}
        fillColor="rgba(103, 174, 113, 0.16)"
        strokeColor="rgba(82, 155, 94, 0.72)"
        strokeWidth={2}
      />

      {craftsmen.map((item, index) => (
        <Marker
          key={item.id}
          coordinate={{
            latitude: region.latitude + 0.008 * (index + 1),
            longitude:
              region.longitude +
              (index % 2 === 0 ? 0.009 : -0.008) * (index + 1),
          }}
          title={item.name}
          description={`${item.job} / ${item.distance}`}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});

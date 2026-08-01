import { StyleSheet, View } from 'react-native';
import MapView, {
  Circle,
  Marker,
  type MapPressEvent,
  type MarkerDragStartEndEvent,
} from 'react-native-maps';

import type { AreaMapProps, Coordinate } from './types';

function getRegion(center: Coordinate, radiusKm: number) {
  const latitudeDelta = Math.max((radiusKm / 111) * 2.8, 0.02);
  const longitudeScale = Math.max(
    Math.cos((center.latitude * Math.PI) / 180),
    0.25,
  );

  return {
    ...center,
    latitudeDelta,
    longitudeDelta: latitudeDelta / longitudeScale,
  };
}

export default function AreaMap({
  center,
  radiusKm,
  jobLocations = [],
  interactive = true,
  compact = false,
  onCenterChange,
}: AreaMapProps) {
  const handleMapPress = (event: MapPressEvent) => {
    if (!interactive) return;
    onCenterChange?.(event.nativeEvent.coordinate);
  };

  const handleDragEnd = (event: MarkerDragStartEndEvent) => {
    if (!interactive) return;
    onCenterChange?.(event.nativeEvent.coordinate);
  };

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <MapView
        key={`${compact ? 'compact' : 'main'}-${center.latitude}-${center.longitude}`}
        style={StyleSheet.absoluteFill}
        initialRegion={getRegion(center, radiusKm)}
        onPress={handleMapPress}
        pitchEnabled={interactive}
        rotateEnabled={interactive}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        toolbarEnabled={false}
        pointerEvents={interactive ? 'auto' : 'none'}
      >
        <Circle
          center={center}
          radius={radiusKm * 1000}
          strokeColor="#2f6fcb"
          fillColor="rgba(111, 192, 240, 0.25)"
          strokeWidth={2}
        />

        <Marker
          coordinate={center}
          draggable={interactive}
          pinColor="#14284d"
          onDragEnd={handleDragEnd}
          title="検索範囲の中心"
        />

        {!compact &&
          jobLocations.map((job) => (
            <Marker
              key={job.id}
              coordinate={{
                latitude: job.latitude,
                longitude: job.longitude,
              }}
              pinColor="#2f6fcb"
              title={job.title}
              description={job.company}
            />
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 340,
    backgroundColor: '#eff5fc',
  },
  compactContainer: {
    width: 88,
    height: 88,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

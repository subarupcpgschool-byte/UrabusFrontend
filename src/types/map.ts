export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type MapCraftsman = {
  id: string;
  name: string;
  job: string;
  distance: string;
};

export type PlatformMapProps = {
  region: MapRegion;
  radiusKm: number;
  craftsmen: MapCraftsman[];
  onRegionChangeComplete?: (region: MapRegion) => void;
};

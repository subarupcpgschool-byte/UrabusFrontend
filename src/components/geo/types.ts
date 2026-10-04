export type SearchArea = { latitude: number; longitude: number; radiusKm: number };
export type GeoMapProps = { area: SearchArea; onCenter: (latitude: number, longitude: number) => void };

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type AreaSelection = {
  center: Coordinate;
  radiusKm: number;
};

export type JobLocation = Coordinate & {
  id: string;
  title: string;
  company: string;
};

export type Job = {
  id: string;
  logoText: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salary: string;
  tags: string[];
  industry: string;
  coordinate: Coordinate;
};

export type AreaMapProps = {
  center: Coordinate;
  radiusKm: number;
  jobLocations?: JobLocation[];
  interactive?: boolean;
  compact?: boolean;
  onCenterChange?: (coordinate: Coordinate) => void;
};

import 'leaflet/dist/leaflet.css';

import { useEffect, useRef } from 'react';
import type * as Leaflet from 'leaflet';

import type { AreaMapProps } from './types';

const getZoom = (radiusKm: number) => {
  if (radiusKm <= 2) return 13;
  if (radiusKm <= 5) return 12;
  if (radiusKm <= 10) return 11;
  if (radiusKm <= 20) return 10;
  return 9;
};

export default function AreaMap({
  center,
  radiusKm,
  jobLocations = [],
  interactive = true,
  compact = false,
  onCenterChange,
}: AreaMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const centerMarkerRef = useRef<Leaflet.Marker | null>(null);
  const circleRef = useRef<Leaflet.Circle | null>(null);
  const onCenterChangeRef = useRef(onCenterChange);

  useEffect(() => {
    onCenterChangeRef.current = onCenterChange;
  }, [onCenterChange]);

  useEffect(() => {
    let disposed = false;

    const initialize = async () => {
      if (!containerRef.current || mapRef.current) return;

      const L = await import('leaflet');
      if (disposed || !containerRef.current) return;

      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        zoomControl: interactive && !compact,
        dragging: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
        boxZoom: interactive,
        keyboard: interactive,
        touchZoom: interactive,
        attributionControl: !compact,
      }).setView([center.latitude, center.longitude], getZoom(radiusKm));

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const makePinIcon = (color: string) =>
        L.divIcon({
          className: '',
          html: `<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:${color};border:3px solid #fff;box-shadow:0 2px 7px rgba(16,28,44,.3);transform:rotate(-45deg)"></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 18],
        });

      const centerMarker = L.marker([center.latitude, center.longitude], {
        draggable: interactive,
        icon: makePinIcon('#14284d'),
      }).addTo(map);

      if (interactive) {
        centerMarker.on('dragend', (event) => {
          const latLng = (event.target as Leaflet.Marker).getLatLng();
          onCenterChangeRef.current?.({
            latitude: latLng.lat,
            longitude: latLng.lng,
          });
        });

        map.on('click', (event: Leaflet.LeafletMouseEvent) => {
          onCenterChangeRef.current?.({
            latitude: event.latlng.lat,
            longitude: event.latlng.lng,
          });
        });
      }

      const circle = L.circle([center.latitude, center.longitude], {
        radius: radiusKm * 1000,
        color: '#2f6fcb',
        fillColor: '#6fc0f0',
        fillOpacity: 0.25,
        weight: 2,
      }).addTo(map);

      if (!compact) {
        jobLocations.forEach((job) => {
          L.marker([job.latitude, job.longitude], {
            icon: makePinIcon('#2f6fcb'),
          })
            .addTo(map)
            .bindPopup(`<strong>${job.title}</strong><br>${job.company}`);
        });
      }

      mapRef.current = map;
      centerMarkerRef.current = centerMarker;
      circleRef.current = circle;

      requestAnimationFrame(() => map.invalidateSize());
    };

    void initialize();

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      centerMarkerRef.current = null;
      circleRef.current = null;
      leafletRef.current = null;
    };
    // The map is initialized once. Prop updates are handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const latLng: Leaflet.LatLngExpression = [
      center.latitude,
      center.longitude,
    ];

    centerMarkerRef.current?.setLatLng(latLng);
    circleRef.current?.setLatLng(latLng);
    circleRef.current?.setRadius(radiusKm * 1000);

    if (compact) {
      mapRef.current?.setView(latLng, getZoom(radiusKm), { animate: false });
    }
  }, [center.latitude, center.longitude, radiusKm, compact]);

  return (
    <div
      ref={containerRef}
      aria-label="求人検索範囲の地図"
      style={{
        width: compact ? 88 : '100%',
        height: compact ? 88 : 340,
        borderRadius: compact ? 12 : 0,
        overflow: 'hidden',
        background: '#eff5fc',
      }}
    />
  );
}

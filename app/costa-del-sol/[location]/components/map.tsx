"use client";

import { useEffect, useRef, useState } from "react";

interface AreaData {
  _id: string;
  name: string;
  point: {
    type: string;
    coordinates: number[];
  };
  boundryCordinates?: number[][];
  property_count?: number;
  all_count?: number;
  sale_count?: number;
  rent_count?: number;
  newDev_count?: number;
}

interface PropertyMapProps {
  areas?: AreaData[];
  parentArea?: AreaData & { areas?: any[] };
  onAreaClick?: (area: any) => void;
}

export function PropertyMap({ areas, parentArea, onAreaClick }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circleRef = useRef<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    let isMounted = true;
    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!isMounted) return;
      setLeaflet(L);
      if (!map.current) {
        map.current = L.map(mapContainer.current!, {
          attributionControl: false,
        }).setView([36.5116, -4.8848], 9);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map.current);
      }
    };
    init();
    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leaflet || !map.current) return;

    markersRef.current.forEach((m: any) => m.remove());
    markersRef.current = [];
    circleRef.current?.remove?.();
    circleRef.current = null;

    const allBounds: any[] = [];

    // Parent city boundary in yellow
    //@ts-ignore
    if (parentArea?.boundryCordinates?.length >= 3) {
      const latLngs = parentArea?.boundryCordinates?.map(
        (c) => [c[1], c[0]] as [number, number],
      );
      const polygon = leaflet
        .polygon(latLngs, {
          color: "#EAB308",
          weight: 3,
          fillColor: "#EAB308",
          fillOpacity: 0.15,
        })
        .on("click", () => onAreaClick?.(parentArea))
        .addTo(map.current);
      circleRef.current = polygon;
      allBounds.push(polygon.getBounds());

      const center = polygon.getBounds().getCenter();
      const label = leaflet
        .marker([center.lat, center.lng], {
          icon: leaflet.divIcon({
            html: `<div style="transform: translate(-50%, -50%); white-space: nowrap;" class="flex flex-col items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold pointer-events-none">
              <span class="font-bold">${parentArea?.name}</span>
              <span class="text-yellow-600">${parentArea?.all_count ?? parentArea?.property_count ?? 0}</span>
            </div>`,
            className: "",
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
        })
        .addTo(map.current);
      markersRef.current.push(label);
    }

    // Sub-area circles in orange
    areas?.forEach((area) => {
      const coords = area?.point?.coordinates;
      if (!coords || coords.length < 2) return;
      const [lng, lat] = coords;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      const count = area.all_count ?? area.property_count ?? 0;
      const radius = Math.max(800, Math.min(4000, count * 40 + 1000));

      const circle = leaflet
        .circle([lat, lng], {
          radius,
          color: "#EA580C",
          weight: 2,
          fillColor: "#EA580C",
          fillOpacity: 0.2,
        })
        .on("click", () => onAreaClick?.(area))
        .addTo(map.current);

      const label = leaflet
        .marker([lat, lng], {
          icon: leaflet.divIcon({
            html: `<div style="transform: translate(-50%, -50%); white-space: nowrap;" class="flex flex-col items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold pointer-events-none">
              <span>${area.name}</span>
              <span class="text-orange-600">${count}</span>
            </div>`,
            className: "",
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
        })
        .addTo(map.current);
      markersRef.current.push(label);

      allBounds.push(circle.getBounds());
    });

    if (allBounds.length > 0) {
      const combined = allBounds.reduce(
        (acc, b) => acc.extend(b),
        leaflet.latLngBounds(allBounds[0]),
      );
      map.current.fitBounds(combined, { padding: [24, 24], animate: false });
    }
  }, [leaflet, areas, parentArea]);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

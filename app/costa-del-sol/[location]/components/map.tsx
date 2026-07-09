"use client";

import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface AreaData {
  _id: string;
  name: string;
  point: {
    type: string;
    coordinates: number[];
  };
  property_count?: number;
  all_count?: number;
  sale_count?: number;
  rent_count?: number;
  newDev_count?: number;
}

interface PropertyMapProps {
  areas?: AreaData[];
  onAreaClick?: (area: AreaData) => void;
}

export function PropertyMap({ areas, onAreaClick }: PropertyMapProps) {
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

    if (!areas || areas.length === 0) return;

    const allBounds: any[] = [];

    areas.forEach((area) => {
      const coords = area?.point?.coordinates;
      if (!coords || coords.length < 2) return;
      const [lng, lat] = coords;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      const count = area.all_count ?? area.property_count ?? 0;
      const radius = Math.max(1000, Math.min(8000, count * 50 + 1500));

      const circle = leaflet
        .circle([lat, lng], {
          radius,
          color: "#111827",
          weight: 2,
          fillColor: "#D9F99D",
          fillOpacity: 0.25,
        })
        .on("click", () => onAreaClick?.(area))
        .addTo(map.current);
      circleRef.current = circle;

      const label = leaflet
        .marker([lat, lng], {
          icon: leaflet.divIcon({
            html: `<div style="transform: translate(-50%, -50%); white-space: nowrap;" class="flex flex-col items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold pointer-events-none">
              <span>${area.name}</span>
              <span class="text-blue-600">${count}</span>
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
  }, [leaflet, areas]);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

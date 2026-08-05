"use client";

import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { useEffect, useRef, useState } from "react";

export function PropertyMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const { mainReducer } = usePosterReducers();
  const [leaflet, setLeaflet] = useState<any>(null);

  const selectedLocation = mainReducer?.property_details?.location;

  useEffect(() => {
    if (!mapContainer.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (!isMounted || !mapContainer.current) return;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeaflet(L);

      // Initialize map only once
      if (!map.current) {
        map.current = L.map(mapContainer.current, {
          attributionControl: false,
        }).setView([36.5116, -4.8848], 9);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map.current);
      }
    };

    initMap();

    return () => {
      isMounted = false;

      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leaflet || !map.current || !selectedLocation?.point?.coordinates) return;

    const [lng, lat] = selectedLocation.point.coordinates;
    if (typeof lat !== "number" || typeof lng !== "number") return;

    circleRef.current?.remove?.();
    map.current.setView([lat, lng], 12);

    circleRef.current = leaflet.circle([lat, lng], {
      radius: 5000,
      color: "#111827",
      weight: 2,
      fillColor: "#D9F99D",
      fillOpacity: 0.2,
    }).addTo(map.current);

    map.current.fitBounds(circleRef.current.getBounds(), {
      padding: [24, 24],
    });
  }, [leaflet, selectedLocation]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

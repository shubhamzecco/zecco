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

const PIN_COLOR = "#2563EB"; // blue-600
const PIN_COLOR_DARK = "#1D4ED8"; // blue-700
const BOUNDARY_COLOR = "#64748B"; // slate-500

// Builds a pin-shaped divIcon
function createPinIcon(leaflet: any) {
  const html = `
    <div style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));">
      <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" style="display:block;">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z"
              fill="${PIN_COLOR}" stroke="${PIN_COLOR_DARK}" stroke-width="1"/>
        <circle cx="15" cy="15" r="5.5" fill="#ffffff"/>
      </svg>
    </div>
  `;
  return leaflet.divIcon({
    html,
    className: "",
    iconSize: [30, 40],
    iconAnchor: [15, 40], // tip of the pin points at the coordinate
    popupAnchor: [0, -36],
  });
}

// Injects tooltip styling once
function ensureTooltipStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("property-map-tooltip-style")) return;
  const style = document.createElement("style");
  style.id = "property-map-tooltip-style";
  style.textContent = `
    .property-pin-tooltip {
      background: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 6px 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      font-family: inherit;
    }
    .property-pin-tooltip::before {
      border-top-color: #ffffff;
    }
    .property-pin-tooltip .pin-tooltip-name {
      display: block;
      font-weight: 600;
      font-size: 12px;
      color: #0f172a;
      text-align: center;
      white-space: nowrap;
    }
    .property-pin-tooltip .pin-tooltip-count {
      display: block;
      font-weight: 700;
      font-size: 12px;
      color: ${PIN_COLOR};
      text-align: center;
    }
  `;
  document.head.appendChild(style);
}

export function PropertyMap({ areas, parentArea, onAreaClick }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const boundaryRef = useRef<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    let isMounted = true;
    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (!isMounted) return;
      ensureTooltipStyles();
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
    boundaryRef.current?.remove?.();
    boundaryRef.current = null;

    const allBounds: any[] = [];

    // Parent city boundary — subtle dashed outline, no heavy fill
    //@ts-ignore
    if (parentArea?.boundryCordinates?.length >= 3) {
      const latLngs = parentArea?.boundryCordinates?.map(
        (c) => [c[1], c[0]] as [number, number],
      );
      const polygon = leaflet
        .polygon(latLngs, {
          color: BOUNDARY_COLOR,
          weight: 2,
          dashArray: "6 6",
          fillColor: BOUNDARY_COLOR,
          fillOpacity: 0.05,
        })
        .on("click", () => onAreaClick?.(parentArea))
        .addTo(map.current);
      boundaryRef.current = polygon;
      allBounds.push(polygon.getBounds());

      const center = polygon.getBounds().getCenter();
      const parentCount = parentArea?.all_count ?? parentArea?.property_count ?? 0;

      const pin = leaflet
        .marker([center.lat, center.lng], {
          icon: createPinIcon(leaflet),
        })
        .bindTooltip(
          `<span class="pin-tooltip-name">${parentArea?.name}</span><span class="pin-tooltip-count">${parentCount}</span>`,
          { direction: "top", offset: [0, -38], opacity: 1, className: "property-pin-tooltip" },
        )
        .on("click", () => onAreaClick?.(parentArea))
        .addTo(map.current);
      markersRef.current.push(pin);
    }

    // Sub-area pins — same style as parent, differentiated only via tooltip content
    areas?.forEach((area) => {
      const coords = area?.point?.coordinates;
      if (!coords || coords.length < 2) return;
      const [lng, lat] = coords;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      const count = area.all_count ?? area.property_count ?? 0;

      const pin = leaflet
        .marker([lat, lng], {
          icon: createPinIcon(leaflet),
        })
        .bindTooltip(
          `<span class="pin-tooltip-name">${area.name}</span><span class="pin-tooltip-count">${count}</span>`,
          { direction: "top", offset: [0, -38], opacity: 1, className: "property-pin-tooltip" },
        )
        .on("click", () => onAreaClick?.(area))
        .addTo(map.current);
      markersRef.current.push(pin);

      allBounds.push(leaflet.latLngBounds([[lat, lng], [lat, lng]]));
    });

    if (allBounds.length > 0) {
      const combined = allBounds.reduce(
        (acc, b) => acc.extend(b),
        leaflet.latLngBounds(allBounds[0]),
      );
      map.current.fitBounds(combined, { padding: [48, 48], animate: false });
    }
  }, [leaflet, areas, parentArea]);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
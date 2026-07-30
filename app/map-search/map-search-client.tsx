"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import MainLayout from "@/components/layouts/main-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { citySlug } from "@/utils/common";
import {
  ArrowRight,
  Check,
  LocateFixed,
  MapPin,
  PenTool
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "draw" | "select";

const DEFAULT_CENTER: [number, number] = [36.5116, -4.8848];

// Costa del Sol approx bounds (lat/lng) to keep the map focused.
const COSTA_DEL_SOL_BOUNDS: [[number, number], [number, number]] = [
  [36.28, -5.35], // south-west
  [36.85, -3.85], // north-east
];

// For initial load we want the whole region visible.
// fitBounds will set an appropriate zoom, but we cap it for UX.
const MIN_ZOOM = 7;
const MAX_ZOOM = 18;

export default function MapSearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") === "select" ? "select" : "draw") as Mode;
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const drawnLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circleRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [leaflet, setLeaflet] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"unknown" | "granted" | "prompt" | "denied">("unknown");
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [drawModeActive, setDrawModeActive] = useState(false);
  const [message, setMessage] = useState(
    mode === "select"
      ? "Pick a region from the list or use the map."
      : "Choose how you want to search on the map.",
  );

  const allLocations = useMemo(() => mainReducer?.all_location_list || [], [mainReducer?.all_location_list]);

  const cities = useMemo(() => {
    const data = mainReducer?.search_by_area?.data;
    if (!Array.isArray(data)) return [];
    return data;
  }, [mainReducer?.search_by_area]);

  const getCount = (item: any): number => item?.all_count ?? item?.property_count ?? 0;

  useEffect(() => {
    if (!isConnected) return;
    sendMessage("action", {
      type: "locationService",
      action: "searchLocationArea",
      payload: {},
    });
    sendMessage("action", {
      type: "locationService",
      action: "areas_list",
      payload: { search: "", limit: 200, page: 1 },
    });
  }, [isConnected, sendMessage]);

  useEffect(() => {
    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      await import("leaflet-draw/dist/leaflet.draw.css");
      await import("leaflet-draw");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      ensureTooltipStyles();
      setLeaflet(L);
    };
    init();
  }, []);

  useEffect(() => {
    if (!leaflet || !mapContainerRef.current || mapRef.current) return;

    mapRef.current = leaflet.map(mapContainerRef.current, {
      attributionControl: false,
      // Constrain panning/zooming so the user stays focused on Costa del Sol
      maxBounds: COSTA_DEL_SOL_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      // Avoid odd overscroll bounce on some devices
      worldCopyJump: false,
    });

    // Initial view: fit entire Costa del Sol with a clean centered map.
    mapRef.current.fitBounds(COSTA_DEL_SOL_BOUNDS, {
      padding: [16, 16],
      animate: false,
    });

    // Enforce bounds explicitly (some Leaflet versions rely on this in addition to options)
    mapRef.current.setMaxBounds(COSTA_DEL_SOL_BOUNDS);

    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: MAX_ZOOM,
    }).addTo(mapRef.current);

    const drawnItems = new leaflet.FeatureGroup();
    drawnLayerRef.current = drawnItems;
    mapRef.current.addLayer(drawnItems);

    const drawControl = new leaflet.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        edit: true,
        remove: true,
      },
    });
    mapRef.current.addControl(drawControl);

    const onCreated = (event: any) => {
      drawnItems.clearLayers();
      drawnItems.addLayer(event.layer);
      setDrawModeActive(false);
      setMessage("Area drawn. Review and apply your search.");
    };

    const onDeleted = () => {
      setMessage("Draw a new area or pick a region.");
    };

    mapRef.current.on(leaflet.Draw.Event.CREATED, onCreated);
    mapRef.current.on(leaflet.Draw.Event.DELETED, onDeleted);

    return () => {
      mapRef.current?.off(leaflet.Draw.Event.CREATED, onCreated);
      mapRef.current?.off(leaflet.Draw.Event.DELETED, onDeleted);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [leaflet]);

  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.permissions || !navigator.geolocation) return;

      try {
        const result = await navigator.permissions.query({ name: "geolocation" as PermissionName });
        setGeoStatus(result.state);
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => setCurrentLocation(null),
            { enableHighAccuracy: true, timeout: 8000 },
          );
        }
      } catch {
        setGeoStatus("unknown");
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    if (!leaflet || !mapRef.current) return;

    if (currentLocation) {
      // Keep view within Costa del Sol bounds even if user grants a distant location.
      const { lat, lng } = clampToCostaDelSolBounds(currentLocation.lat, currentLocation.lng);

      mapRef.current.setView([lat, lng], 13);
      userMarkerRef.current?.remove?.();
      userMarkerRef.current = leaflet.marker([lat, lng])
        .addTo(mapRef.current)
        .bindPopup("Your current location");
      setMessage("Location ready. You can draw an area or use nearby search.");
    }
  }, [currentLocation, leaflet]);

  useEffect(() => {
    if (!leaflet || !mapRef.current) return;

    markersRef.current.forEach((m: any) => m.remove());
    markersRef.current = [];
    const featureGroup = new leaflet.FeatureGroup();
    const allBounds: any[] = [];

    cities.forEach((city: any) => {
      // --- draw city boundary polygon (dotted) ---
      if (city?.boundryCordinates?.length >= 3) {
        const latLngs = city.boundryCordinates.map(
          (c: number[]) => [c[1], c[0]] as [number, number],
        );
        const polygon = leaflet
          .polygon(latLngs, {
            color: PIN_COLOR,
            weight: 2,
            dashArray: "6 6",
            fillColor: PIN_COLOR,
            fillOpacity: 0.04,
          })
          .addTo(featureGroup);
        markersRef.current.push(polygon);
        allBounds.push(polygon.getBounds());
      }

      // --- city pin ---
      const cityCoords = city?.point?.coordinates;
      if (cityCoords?.length >= 2) {
        const [clng, clat] = cityCoords;
        if (typeof clat === "number" && typeof clng === "number") {
          const count = getCount(city);
          const cityPin = leaflet
            .marker([clat, clng], {
              icon: createPinIcon(leaflet, true),
            })
            .bindTooltip(
              `<span class="pin-tooltip-name">${city.name}</span><span class="pin-tooltip-type">${count} properties</span>`,
              { direction: "top", offset: [0, -38], opacity: 1, className: "map-search-pin-tooltip" },
            )
            .on("click", () => navigateToArea(city))
            .addTo(featureGroup);
          markersRef.current.push(cityPin);
          allBounds.push(leaflet.latLngBounds([[clat, clng], [clat, clng]]));
        }
      }

      // --- area pins within the city ---
      (city?.areas || []).forEach((area: any) => {
        const count = getCount(area);
        const areaCoords = area?.point?.coordinates;
        if (!areaCoords || areaCoords.length < 2) return;
        const [alng, alat] = areaCoords;
        if (typeof alat !== "number" || typeof alng !== "number") return;

        const areaPin = leaflet
          .marker([alat, alng], {
            icon: createPinIcon(leaflet, false),
          })
          .bindTooltip(
            `<span class="pin-tooltip-name">${area.name}</span><span class="pin-tooltip-type">${count} properties</span>`,
            { direction: "top", offset: [0, -38], opacity: 1, className: "map-search-pin-tooltip" },
          )
          .on("click", () => navigateToArea({ ...area, city_name: city.name }))
          .addTo(featureGroup);
        markersRef.current.push(areaPin);
        allBounds.push(leaflet.latLngBounds([[alat, alng], [alat, alng]]));
      });
    });

    featureGroup.addTo(mapRef.current);

    if (allBounds.length > 0) {
      const combined = allBounds.reduce(
        (acc, b) => acc.extend(b),
        leaflet.latLngBounds(allBounds[0]),
      );
      mapRef.current.fitBounds(combined, { padding: [48, 48], animate: false });
    }
  }, [leaflet, cities]);

  const groupedLocations = useMemo(() => {
    return cities
      .map((city: any) => ({
        city,
        count: getCount(city),
        areas: (city?.areas || []).map((area: any) => ({ area, count: getCount(area) })),
      }))
      .sort((a: any, b: any) => b.count - a.count);
  }, [cities]);

  console.log("groupedLocations ::: " , groupedLocations)

  const findNearestArea = (lat: number, lng: number) => {
    let nearest = null;
    let minDistance = Infinity;

    for (const area of allLocations) {
      const coords = area?.point?.coordinates;
      if (!coords) continue;
      const [areaLng, areaLat] = coords;
      const distance = Math.sqrt(
        Math.pow(areaLat - lat, 2) + Math.pow(areaLng - lng, 2),
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearest = area;
      }
    }
    return nearest;
  };

  const getAreaPoint = (area: any) => {
    const coordinates = area?.point?.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

    const [lng, lat] = coordinates;
    if (typeof lat !== "number" || typeof lng !== "number") return null;

    return { lat, lng };
  };

  const getAreaRadius = (area: any) => {
    const type = String(area?.type || "").toLowerCase();

    switch (type) {
      case "city":
        return 5000; // 5 km
      case "area":
        return 3000; // 3 km
      case "subarea":
        return 1500; // 1.5 km
      default:
        return 2500; // 2.5 km
    }
  };

  const clearMapSelection = () => {
    drawnLayerRef.current?.clearLayers?.();
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    circleRef.current?.remove?.();
    circleRef.current = null;
    setSelectedArea(null);
  };

  const clampToCostaDelSolBounds = (lat: number, lng: number) => {
    const clampedLat = Math.min(COSTA_DEL_SOL_BOUNDS[1][0], Math.max(COSTA_DEL_SOL_BOUNDS[0][0], lat));
    const clampedLng = Math.min(COSTA_DEL_SOL_BOUNDS[1][1], Math.max(COSTA_DEL_SOL_BOUNDS[0][1], lng));
    return { lat: clampedLat, lng: clampedLng };
  };

  const PIN_COLOR = "#2563EB";
  const PIN_COLOR_DARK = "#1D4ED8";

  function createPinIcon(L: any, isCity: boolean) {
    const w = isCity ? 34 : 28;
    const h = isCity ? 46 : 38;
    const html = `
      <div style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;">
          <path d="${isCity
            ? "M17 0C7.6 0 0 7.6 0 17c0 11.9 17 29 17 29s17-17.1 17-29C34 7.6 26.4 0 17 0z"
            : "M14 0C6.268 0 0 6.268 0 14c0 9.8 14 24 14 24s14-14.2 14-24C28 6.268 21.732 0 14 0z"}"
                fill="${PIN_COLOR}" stroke="${PIN_COLOR_DARK}" stroke-width="1"/>
          <circle cx="${isCity ? 17 : 14}" cy="${isCity ? 17 : 14}" r="${isCity ? 6.5 : 5}" fill="#ffffff"/>
        </svg>
      </div>
    `;
    return L.divIcon({
      html,
      className: "",
      iconSize: [w, h],
      iconAnchor: [w / 2, h],
      popupAnchor: [0, -(h - 4)],
    });
  }

  function ensureTooltipStyles() {
    if (typeof document === "undefined") return;
    if (document.getElementById("map-search-pin-styles")) return;
    const style = document.createElement("style");
    style.id = "map-search-pin-styles";
    style.textContent = `
      .map-search-pin-tooltip {
        background: #ffffff;
        border: none;
        border-radius: 10px;
        padding: 6px 10px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        font-family: inherit;
      }
      .map-search-pin-tooltip::before {
        border-top-color: #ffffff;
      }
      .map-search-pin-tooltip .pin-tooltip-name {
        display: block;
        font-weight: 600;
        font-size: 12px;
        color: #0f172a;
        text-align: center;
        white-space: nowrap;
      }
      .map-search-pin-tooltip .pin-tooltip-type {
        display: block;
        font-weight: 700;
        font-size: 10px;
        color: #2563EB;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  const navigateToArea = (area: any) => {
    if (!area) return;
    const type = area?.type?.toLowerCase();
    let url = `${App_url.link.COSTA_DEL_SOL}/properties?`;

    switch (type) {
      case "city":
        url += `city=${citySlug(area?.name_slug || area.name)}`;
        break;
      case "area":
        url += `city=${citySlug(area?.city_name)}&area=${citySlug(area?.name_slug || area.name)}`;
        break;
      case "subarea":
        url += `city=${citySlug(area?.city_name)}&area=${citySlug(area?.area_name)}&subarea=${citySlug(area?.name_slug || area.name)}`;
        break;
      default:
        url += `city=${citySlug(area.name)}`;
    }

    router.push(url);
  };

  const centerOnArea = async (areaName: string) => {
    if (!leaflet || !mapRef.current) return;
    clearMapSelection();
    const area = allLocations.find((item: any) => item?.name === areaName);
    setSelectedArea(area || { name: areaName });
    navigateToArea(area);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("denied");
      setMessage("Location is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoStatus("granted");
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setGeoStatus("denied");
        setMessage("Location permission was denied. You can still use the map.");
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const applySelection = () => {
    const drawn = drawnLayerRef.current?.getLayers?.()?.[0];

    if (selectedArea?.name) {
      navigateToArea(selectedArea);
      return;
    }

    if (drawn && drawn.getLatLngs) {
      const center = drawn.getBounds().getCenter();
      const nearestArea = findNearestArea(center.lat, center.lng);
      navigateToArea(nearestArea);
      return;
    }
  };
  return (
    <MainLayout>
      <div className="h-screen bg-[#F3F7FB] mt-[-30px]">
        <div className="mx-auto grid h-full w-full gap-4 px-4 py-4 lg:grid-cols-[320px_1fr]">
          <aside className="flex flex-col gap-3 rounded-3xl border bg-white p-4 shadow-sm overflow-hidden">
            <div className="flex-shrink-0 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${cities.length > 0 ? "bg-green-400" : "bg-slate-300"} animate-pulse`} />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-700">{message}</p>
            </div>

            {selectedArea && getAreaPoint(selectedArea) && (
              <div className="flex-shrink-0 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <MapPin size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">Selected Area</p>
                    <p className="text-sm font-bold text-blue-900">{selectedArea.name}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-blue-600">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 font-mono font-medium">
                    {getAreaPoint(selectedArea)!.lat.toFixed(4)}, {getAreaPoint(selectedArea)!.lng.toFixed(4)}
                  </span>
                  {getCount(selectedArea) > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-0.5 font-semibold text-green-700">
                      {getCount(selectedArea)} properties
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex-shrink-0">
              <button onClick={requestLocation} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-md">
                <span className="flex items-center gap-2 font-semibold text-slate-700">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                    <LocateFixed size={14} className="text-blue-600" />
                  </div>
                  Use My Location
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  geoStatus === "granted" ? "bg-green-100 text-green-700" :
                  geoStatus === "denied" ? "bg-red-100 text-red-600" :
                  "bg-slate-100 text-slate-500"
                }`}>
                  {geoStatus === "granted" ? "Allowed" : geoStatus === "denied" ? "Denied" : "Optional"}
                </span>
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-shrink-0 mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                  <MapPin size={14} className="text-white" />
                </div>
                <h2 className="text-sm font-bold text-slate-800">Select Area</h2>
                <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  {groupedLocations.length} cities
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-1">
                {groupedLocations.length > 0 && groupedLocations?.map((group: any) => (
                  <div key={group.city.name} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <button onClick={() => navigateToArea(group.city)} className="w-full">
                      <div className="flex items-center justify-between bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] px-3.5 py-2.5 rounded-t-xl">
                        <span className="text-sm font-bold text-white">{group.city.name}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                          {group.count}
                        </span>
                      </div>
                    </button>

                    {group.areas.length > 0 && (
                      <div className="border-t border-slate-100">
                        {group.areas.map((ag: any, idx: number) => (
                          <button
                            key={ag.area._id || idx}
                            onClick={() => navigateToArea({ ...ag.area, city_name: group.city.city_name || group.city.name })}
                            className="flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-blue-50 border-b border-slate-50 last:border-b-0"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                              <span className="text-xs font-medium text-slate-700">{ag.area.name}</span>
                            </div>
                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 whitespace-nowrap ml-2">
                              {ag.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm h-full">
            <div ref={mapContainerRef} className="flex-1 w-full min-h-0" />
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-slate-600">
                {mode === "select"
                  ? "Pick an area on the left to highlight it on the map."
                  : currentLocation
                    ? `Current location available at ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                    : "You can keep using the map without granting location access."}
              </p>

              <button
                onClick={applySelection}
                className="ml-4 inline-flex items-center gap-2 rounded-full bg-sky_blue_color px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition-all hover:opacity-90"
              >
                Apply Search
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

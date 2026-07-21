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

  const areas = useMemo(() => mainReducer?.all_location_list || [], [mainReducer?.all_location_list]);

  useEffect(() => {
    if (!isConnected) return;
    sendMessage("action", {
      type: "locationService",
      action: "searchLocationArea",
      payload: {},
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

  const areaOptions: any = useMemo(
    () =>
      areas
        .map((item: any) => item?.name)
        .filter((name: string, index: number, arr: string[]) => name && arr.indexOf(name) === index)
        .slice(0, 24),
    [areas],
  );

  const findNearestArea = (lat: number, lng: number) => {
    let nearest = null;
    let minDistance = Infinity;

    for (const area of areas) {
      const coords = area?.point?.coordinates;

      if (!coords) continue;

      const [areaLng, areaLat] = coords;

      const distance = Math.sqrt(
        Math.pow(areaLat - lat, 2) +
        Math.pow(areaLng - lng, 2)
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

  const centerOnArea = async (areaName: string) => {
    if (!leaflet || !mapRef.current) return;

    clearMapSelection();
    const area = areas.find((item: any) => item?.name === areaName);
    setSelectedArea(area || { name: areaName });
    const point = getAreaPoint(area);
    const center = point || currentLocation || DEFAULT_CENTER;
    const centerLat = Array.isArray(center)
      ? center[0]
      : typeof center === "object" && center
        ? (center as any).lat
        : DEFAULT_CENTER[0];
    const centerLng = Array.isArray(center)
      ? center[1]
      : typeof center === "object" && center
        ? (center as any).lng
        : DEFAULT_CENTER[1];

    if (point) {
      circleRef.current = leaflet.circle([point.lat, point.lng], {
        radius: getAreaRadius(area),
        color: "#111827",
        weight: 2,
        fillColor: "#D9F99D",
        fillOpacity: 0.35,
      }).addTo(mapRef.current);

      // Keep fitBounds within Costa del Sol for a consistent UX.
      const bounds = circleRef.current.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const clampedSW = clampToCostaDelSolBounds(sw.lat, sw.lng);
      const clampedNE = clampToCostaDelSolBounds(ne.lat, ne.lng);

      mapRef.current.fitBounds(
        leaflet.latLngBounds(
          [clampedSW.lat, clampedSW.lng],
          [clampedNE.lat, clampedNE.lng],
        ),
        {
          padding: [24, 24],
          animate: false,
        },
      );
    } else {
      const { lat, lng } = clampToCostaDelSolBounds(centerLat, centerLng);
      mapRef.current.setView([lat, lng], currentLocation ? 13 : 10);
    }
    setMessage(`Selected ${areaName}. Apply to continue.`);
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
      router.push(
        `${App_url.link.COSTA_DEL_SOL}/properties?city=${citySlug(selectedArea?.city_name || selectedArea.name)}`
      );
      return;
    }

    if (drawn && drawn.getLatLngs) {
      const latLngs = drawn.getLatLngs?.()[0]?.map((point: any) => [point.lat, point.lng]) || [];
      const center = drawn.getBounds().getCenter();
      const nearestArea = findNearestArea(center.lat, center.lng);
      router.push(
        `${App_url.link.COSTA_DEL_SOL}/properties?city=${citySlug(nearestArea?.name || "marbella")}`
      );
      return;
    }
  };
  return (
    <MainLayout>
      <div className="min-h-screen bg-[#F3F7FB] mt-[-30px]">
        <div className="mx-auto grid w-full gap-4 px-4 py-4 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 rounded-3xl border bg-white p-4 shadow-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Status</p>
              <p className="mt-1 text-sm text-slate-700">{message}</p>
            </div>

            <div className="space-y-2">
              <button onClick={requestLocation} className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left hover:bg-slate-50">
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <LocateFixed size={16} />
                  Use My Location
                </span>
                <span className="text-xs text-slate-500">{geoStatus === "granted" ? "Allowed" : geoStatus === "denied" ? "Denied" : "Optional"}</span>
              </button>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-slate-600" />
                <h2 className="font-semibold text-slate-900">Select Area</h2>
              </div>
              <div className="flex max-h-[480px] flex-col gap-2 overflow-auto pr-1">
                {areas.length > 0 && areaOptions?.map((name: any) => (
                  <button
                    key={name}
                    onClick={() => centerOnArea(name)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm ${selectedArea?.name === name ? "border-sky-500 bg-sky-50 text-sky-900" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{name}</span>
                      {selectedArea?.name === name && <Check size={14} className="text-sky-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <div ref={mapContainerRef} className="h-[75vh] w-full" />

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

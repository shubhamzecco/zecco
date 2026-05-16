// ==========================================
// DrawAreaMap.tsx
// REAL ESTATE MAP WITH REAL AREA FILTERING
// ==========================================

"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";
import * as turf from "@turf/turf";

import { useMemo, useState } from "react";

import {
    FeatureGroup,
    MapContainer,
    Marker,
    Polygon,
    Popup,
    TileLayer,
} from "react-leaflet";

import { EditControl } from "react-leaflet-draw";

import {
    Bath,
    BedDouble,
    Building2,
    MapPin,
    Search,
} from "lucide-react";

// ==========================================
// INSTALL
// ==========================================
//
// npm install leaflet react-leaflet leaflet-draw
// npm install @turf/turf
//
// ==========================================

// ==========================================
// FIX LEAFLET ICON
// ==========================================

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ==========================================
// TYPES
// ==========================================

type Coordinate = {
    lat: number;
    lng: number;
};

type Property = {
    id: number;
    title: string;
    city: string;
    location: string;
    price: string;
    beds: number;
    baths: number;
    image: string;
    lat: number;
    lng: number;
};

// ==========================================
// DUMMY PROPERTY DATA
// ==========================================

const DUMMY_PROPERTIES: Property[] = [
    {
        id: 1,
        title: "Luxury Villa",
        city: "Pune",
        location: "Baner",
        price: "$850,000",
        beds: 4,
        baths: 3,
        image:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200",
        lat: 18.559,
        lng: 73.786,
    },
    {
        id: 2,
        title: "Modern Apartment",
        city: "Pune",
        location: "Wakad",
        price: "$420,000",
        beds: 2,
        baths: 2,
        image:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200",
        lat: 18.599,
        lng: 73.763,
    },
    {
        id: 3,
        title: "Premium Penthouse",
        city: "Pune",
        location: "Kharadi",
        price: "$1,200,000",
        beds: 5,
        baths: 4,
        image:
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200",
        lat: 18.551,
        lng: 73.947,
    },
];

// ==========================================
// COMPONENT
// ==========================================

export default function DrawAreaMap() {
    const [polygonCoords, setPolygonCoords] = useState<
        Coordinate[]
    >([]);

    const [filteredProperties, setFilteredProperties] =
        useState<Property[]>(DUMMY_PROPERTIES);

    // ==========================================
    // HANDLE DRAW CREATED
    // ==========================================

    const handleCreated = (e: any) => {
        const layer = e.layer;

        // ======================================
        // POLYGON
        // ======================================

        if (e.layerType === "polygon") {

            const latlngs = layer.getLatLngs()[0];

            const polygonCoords = latlngs.map(
                (item: any) => [
                    item.lng,
                    item.lat,
                ]
            );

            // CLOSE POLYGON
            polygonCoords.push(polygonCoords[0]);

            // CREATE POLYGON
            const polygon = turf.polygon([
                polygonCoords,
            ]);

            // FILTER PROPERTIES
            const insideProperties =
                DUMMY_PROPERTIES.filter(
                    (property) => {

                        const point = turf.point([
                            property.lng,
                            property.lat,
                        ]);

                        return turf.booleanPointInPolygon(
                            point,
                            polygon
                        );
                    }
                );

            // UPDATE STATE
            setFilteredProperties(insideProperties);

            setPolygonCoords(
                latlngs.map((item: any) => ({
                    lat: item.lat,
                    lng: item.lng,
                }))
            );
        }

        // ======================================
        // RECTANGLE
        // ======================================

        if (e.layerType === "rectangle") {

            const bounds = layer.getBounds();

            const west = bounds.getWest();
            const south = bounds.getSouth();
            const east = bounds.getEast();
            const north = bounds.getNorth();

            const rectanglePolygon = turf.polygon([
                [
                    [west, south],
                    [east, south],
                    [east, north],
                    [west, north],
                    [west, south],
                ],
            ]);

            const insideProperties =
                DUMMY_PROPERTIES.filter(
                    (property) => {

                        const point = turf.point([
                            property.lng,
                            property.lat,
                        ]);

                        return turf.booleanPointInPolygon(
                            point,
                            rectanglePolygon
                        );
                    }
                );

            setFilteredProperties(insideProperties);

            setPolygonCoords([
                { lat: south, lng: west },
                { lat: south, lng: east },
                { lat: north, lng: east },
                { lat: north, lng: west },
            ]);
        }
    };

    // ==========================================
    // MAP CENTER
    // ==========================================

    const center = useMemo(
        () => [18.5204, 73.8567] as [number, number],
        []
    );

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-100">

            {/* ====================================== */}
            {/* SIDEBAR */}
            {/* ====================================== */}

            <div className="absolute top-0 left-0 z-[1000] w-[420px] h-full bg-white shadow-2xl border-r border-gray-200 flex flex-col">

                {/* HEADER */}
                <div className="p-6 border-b border-gray-200">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-3xl bg-blue-100 flex items-center justify-center">
                            <Building2 className="text-blue-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Property Search
                            </h1>

                            <p className="text-gray-500 text-sm">
                                Draw area on map
                            </p>
                        </div>
                    </div>

                    {/* SEARCH */}
                    <div className="mt-6 relative">

                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search city or area..."
                            className="w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-white"
                        />
                    </div>

                    {/* COUNT */}
                    <div className="mt-5 bg-blue-50 rounded-2xl p-4 flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Properties Found
                            </p>

                            <h3 className="font-bold text-3xl text-blue-600">
                                {filteredProperties.length}
                            </h3>
                        </div>

                        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                            <Building2 className="text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* PROPERTY LIST */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5">

                    {filteredProperties.length === 0 && (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-10 text-center text-gray-500">
                            No properties inside selected area
                        </div>
                    )}

                    {filteredProperties.map((property) => (
                        <div
                            key={property.id}
                            className="rounded-3xl overflow-hidden border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300"
                        >

                            {/* IMAGE */}
                            <div className="relative h-[220px]">

                                <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full text-sm font-semibold shadow">
                                    {property.location}
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="p-5">

                                <div className="flex items-start justify-between">

                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {property.title}
                                        </h2>

                                        <div className="flex items-center gap-2 text-gray-500 mt-2">

                                            <MapPin size={16} />

                                            <span className="text-sm">
                                                {property.location},{" "}
                                                {property.city}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-blue-600 font-bold text-xl">
                                        {property.price}
                                    </h3>
                                </div>

                                {/* FEATURES */}
                                <div className="flex items-center gap-6 mt-5 pt-5 border-t border-gray-100">

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <BedDouble size={18} />
                                        <span>
                                            {property.beds} Beds
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Bath size={18} />
                                        <span>
                                            {property.baths} Baths
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ====================================== */}
            {/* MAP */}
            {/* ====================================== */}

            <div className="absolute inset-0 ml-[420px]">

                <MapContainer
                    center={center}
                    zoom={12}
                    className="w-full h-full"
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* PROPERTY MARKERS */}
                    {filteredProperties.map((property) => (
                        <Marker
                            key={property.id}
                            position={[
                                property.lat,
                                property.lng,
                            ]}
                        >
                            <Popup>
                                <div className="w-[220px]">

                                    <img
                                        src={property.image}
                                        className="w-full h-[120px] object-cover rounded-xl"
                                    />

                                    <h3 className="font-bold text-lg mt-3">
                                        {property.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {property.location}
                                    </p>

                                    <p className="text-blue-600 font-bold text-lg mt-2">
                                        {property.price}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* DRAW CONTROLS */}
                    <FeatureGroup>
                        <EditControl
                            position="topright"
                            onCreated={handleCreated}
                            draw={{
                                rectangle: true,
                                polygon: true,
                                circle: false,
                                polyline: false,
                                marker: false,
                                circlemarker: false,
                            }}
                            edit={{
                                remove: true,
                            }}
                        />
                    </FeatureGroup>

                    {/* SHOW POLYGON */}
                    {polygonCoords.length > 0 && (
                        <Polygon
                            positions={polygonCoords.map(
                                (item) => [
                                    item.lat,
                                    item.lng,
                                ]
                            )}
                            pathOptions={{
                                color: "#2563EB",
                                fillColor: "#3B82F6",
                                fillOpacity: 0.2,
                                weight: 3,
                            }}
                        />
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
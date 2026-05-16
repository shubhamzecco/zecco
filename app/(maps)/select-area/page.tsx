// ==========================================
// SelectAreaMap.tsx
// REAL ESTATE AREA HIGHLIGHT MAP
// IDEALISTA STYLE UI
// ==========================================

"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
    GeoJSON,
    MapContainer,
    Marker,
    TileLayer,
    useMapEvents,
} from "react-leaflet";

import { useRef, useState } from "react";

import {
    MapPin,
    Search,
    Trash2,
    X,
} from "lucide-react";

// ==========================================
// FIX LEAFLET ICON
// ==========================================

delete (L.Icon.Default.prototype as any)
    ._getIconUrl;

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

type Position = {
    lat: number;
    lng: number;
};

type Suggestion = {
    display_name: string;
    lat: string;
    lon: string;
    geojson?: any;
};

// ==========================================
// CLICK HANDLER
// ==========================================

function ClickHandler({
    setPosition,
}: {
    setPosition: (value: Position) => void;
}) {

    useMapEvents({
        click(e) {

            setPosition({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            });

        },
    });

    return null;
}

// ==========================================
// COMPONENT
// ==========================================

export default function SelectAreaMap() {

    // ======================================
    // STATES
    // ======================================

    const [position, setPosition] =
        useState<Position | null>(null);

    const [search, setSearch] =
        useState("");

    const [suggestions, setSuggestions] =
        useState<Suggestion[]>([]);

    const [selectedArea, setSelectedArea] =
        useState<Suggestion | null>(null);

    const [hoveredArea, setHoveredArea] =
        useState<string | null>(null);

    const debounceRef =
        useRef<NodeJS.Timeout | null>(null);

    // ======================================
    // DEFAULT CENTER
    // ======================================

    const defaultCenter: [number, number] = [
        40.4168,
        -3.7038,
    ];

    // ======================================
    // SEARCH
    // ======================================

    const handleSearch = async (
        value: string
    ) => {

        setSearch(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current =
            setTimeout(async () => {

                if (!value) {
                    setSuggestions([]);
                    return;
                }

                try {

                    // ==================================
                    // NOMINATIM API
                    // ==================================

                    const response =
                        await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${value}`
                        );

                    const data =
                        await response.json();

                    setSuggestions(data);

                } catch (error) {

                    console.log(error);

                }

            }, 500);
    };

    // ======================================
    // SELECT LOCATION
    // ======================================

    const handleSelectSuggestion = (
        item: Suggestion
    ) => {

        setPosition({
            lat: Number(item.lat),
            lng: Number(item.lon),
        });

        setSelectedArea(item);

        setSearch(item.display_name);

        setSuggestions([]);
    };

    // ======================================
    // CLEAR
    // ======================================

    const clearSearch = () => {

        setSearch("");

        setSuggestions([]);

        setSelectedArea(null);

        setHoveredArea(null);
    };

    // ======================================
    // DUMMY PROPERTY COUNT
    // ======================================

    const propertyCount = 9283;

    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white">

            {/* ================================== */}
            {/* TOP HEADER */}
            {/* ================================== */}

            <div className="absolute top-0 left-0 right-0 z-[1000] bg-white border-b border-gray-200 h-[82px] flex items-center justify-between px-6">

                {/* TITLE */}
                <h1 className="text-4xl font-light text-black">
                    Select areas
                </h1>

                {/* SEARCH */}
                <div className="relative w-[450px]">

                    {/* SEARCH ICON */}
                    <Search
                        size={22}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    {/* INPUT */}
                    <input
                        value={search}
                        onChange={(e) =>
                            handleSearch(
                                e.target.value
                            )
                        }
                        type="text"
                        placeholder="Neighbourhood, city, municipality"
                        className="w-full h-[48px] border border-gray-500 bg-white pl-14 pr-14 text-[18px] outline-none"
                    />

                    {/* CLEAR */}
                    {search && (

                        <button
                            onClick={clearSearch}
                            className="absolute right-5 top-1/2 -translate-y-1/2"
                        >

                            <X
                                size={18}
                                className="text-gray-500"
                            />

                        </button>

                    )}

                    {/* ================================== */}
                    {/* SUGGESTIONS */}
                    {/* ================================== */}

                    {suggestions.length > 0 && (

                        <div className="absolute top-[55px] left-0 w-full bg-white border border-gray-300 shadow-2xl max-h-[400px] overflow-y-auto">

                            {suggestions.map(
                                (item, index) => (

                                    <button
                                        key={index}
                                        onClick={() =>
                                            handleSelectSuggestion(
                                                item
                                            )
                                        }
                                        className="w-full px-5 py-4 text-left hover:bg-gray-100 border-b border-gray-200 transition-all"
                                    >

                                        <div className="flex items-start gap-3">

                                            <MapPin
                                                size={18}
                                                className="text-gray-500 mt-1"
                                            />

                                            <div>

                                                <p className="text-[15px] text-gray-800">
                                                    {
                                                        item.display_name
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

            {/* ================================== */}
            {/* SELECTED CARD */}
            {/* ================================== */}

            {selectedArea && (

                <div className="absolute top-[100px] left-8 z-[1000] w-[340px] bg-white shadow-2xl border border-gray-200">

                    {/* HEADER */}
                    <div className="p-6">

                        <div className="flex items-start justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <MapPin
                                        size={20}
                                        className="text-black"
                                    />

                                    <h2 className="text-[20px] font-semibold text-black">
                                        Selected areas
                                    </h2>

                                </div>

                                <div className="mt-6 flex items-center justify-between">

                                    <p className="text-[18px] text-black">
                                        {
                                            selectedArea.display_name.split(
                                                ","
                                            )[0]
                                        }
                                    </p>

                                    <p className="text-[28px] font-light text-gray-600">
                                        {
                                            propertyCount.toLocaleString()
                                        }
                                    </p>

                                </div>

                            </div>

                            {/* DELETE */}
                            <button
                                onClick={clearSearch}
                            >
                                <Trash2
                                    size={20}
                                    className="text-blue-600"
                                />
                            </button>

                        </div>

                    </div>

                    {/* BUTTON */}
                    <button className="w-full h-[58px] bg-fuchsia-700 hover:bg-fuchsia-800 transition-all text-white text-[18px] font-semibold">
                        View{" "}
                        {propertyCount.toLocaleString()}{" "}
                        properties
                    </button>

                </div>

            )}

            {/* ================================== */}
            {/* TOOLTIP */}
            {/* ================================== */}

            {hoveredArea && (

                <div className="absolute top-[260px] left-1/2 z-[1200] bg-yellow-300 border border-yellow-500 px-5 py-4 shadow-xl">

                    <h3 className="font-bold text-black text-[20px]">
                        {hoveredArea}
                    </h3>

                    <p className="text-black text-[18px]">
                        {propertyCount.toLocaleString()} properties
                    </p>

                </div>

            )}

            {/* ================================== */}
            {/* MAP */}
            {/* ================================== */}

            <div className="absolute inset-0 top-[82px]">

                <MapContainer
                    center={defaultCenter}
                    zoom={6}
                    minZoom={4}
                    maxZoom={18}
                    zoomControl={false}
                    className="w-full h-full"
                >

                    {/* TILE */}
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* CLICK */}
                    <ClickHandler
                        setPosition={setPosition}
                    />

                    {/* MARKER */}
                    {position && (

                        <Marker
                            position={[
                                position.lat,
                                position.lng,
                            ]}
                        />

                    )}

                    {/* ================================== */}
                    {/* HIGHLIGHT AREA */}
                    {/* ================================== */}

                    {selectedArea?.geojson && (

                        <GeoJSON
                            data={
                                selectedArea.geojson
                            }
                            style={() => ({
                                color: "#8B006B",
                                weight: 4,
                                fillColor: "#B01284",
                                fillOpacity: 0.28,
                            })}
                            eventHandlers={{
                                mouseover: (
                                    e
                                ) => {

                                    const layer =
                                        e.target;

                                    layer.setStyle({
                                        fillOpacity: 0.4,
                                        weight: 5,
                                    });

                                    setHoveredArea(
                                        selectedArea.display_name.split(
                                            ","
                                        )[0]
                                    );
                                },

                                mouseout: (
                                    e
                                ) => {

                                    const layer =
                                        e.target;

                                    layer.setStyle({
                                        fillOpacity: 0.28,
                                        weight: 4,
                                    });

                                    setHoveredArea(
                                        null
                                    );
                                },
                            }}
                        />

                    )}

                </MapContainer>

            </div>

        </div>

    );
}
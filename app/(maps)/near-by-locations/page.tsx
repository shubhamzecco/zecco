// ================================
// 3. NearbySearchMap.tsx
// ================================

"use client";

import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
} from "react-leaflet";

import L from "leaflet";
import { useEffect, useState } from "react";

const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

type Place = {
    lat: number;
    lng: number;
    title: string;
};

export default function NearbySearchMap() {
    const [currentLocation, setCurrentLocation] = useState<
        [number, number]
    >([18.5204, 73.8567]);

    const [places, setPlaces] = useState<Place[]>([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            setCurrentLocation([lat, lng]);

            // Example Dummy Nearby Data
            setPlaces([
                {
                    lat: lat + 0.01,
                    lng: lng + 0.01,
                    title: "Nearby Property 1",
                },
                {
                    lat: lat - 0.01,
                    lng: lng - 0.01,
                    title: "Nearby Property 2",
                },
            ]);
        });
    }, []);

    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden">
            <MapContainer
                center={currentLocation}
                zoom={13}
                className="w-full h-full"
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                    position={currentLocation}
                    icon={markerIcon}
                >
                    <Popup>Your Current Location</Popup>
                </Marker>

                {places.map((place, index) => (
                    <Marker
                        key={index}
                        position={[place.lat, place.lng]}
                        icon={markerIcon}
                    >
                        <Popup>{place.title}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
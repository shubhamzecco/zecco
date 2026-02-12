'use client'

import { useEffect, useRef, useState } from 'react'
import { getPropertiesByLocation, getLocationCenter, type Property } from '@/lib/property-data'

export function PropertyMap() {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<any>(null)
    const markersRef = useRef<any[]>([])
    const [selectedLocation] = useState('Marbella')
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!mapContainer.current) return

        // Dynamically import Leaflet only on client side
        const initMap = async () => {
            const L = (await import('leaflet')).default
            await import('leaflet/dist/leaflet.css')

            // Initialize map
            if (!map.current) {
                map.current = L.map(mapContainer.current ? mapContainer.current : '', {
                    attributionControl: false,
                }).setView([36.5116, -4.8848], 9)

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                }).addTo(map.current)
            }

            // Clear existing markers
            markersRef.current.forEach((marker: any) => marker.remove())
            markersRef.current = []

            // Get properties for selected location
            const locationProps = getPropertiesByLocation(selectedLocation)
            const center = getLocationCenter(selectedLocation)

            // Center map on location
            if (map.current) {
                map.current.setView([center.lat, center.lng], selectedLocation === 'Marbella' ? 10 : 11)
            }

            // Add property markers
            locationProps.forEach((property: Property) => {
                if (map.current) {
                    // Create custom icon
                    const iconHtml = `
            <div class="flex items-center justify-center bg-blue-600 text-white rounded-full w-10 h-10 font-bold text-sm shadow-lg border-2 border-white">
              ${property.priceFormatted.replace('€', '')}
            </div>
          `

                    const marker = L.marker([property.lat, property.lng], {
                        icon: L.divIcon({
                            html: iconHtml,
                            className: 'property-marker',
                            iconSize: [40, 40],
                            iconAnchor: [20, 20],
                        }),
                    })
                        .bindPopup(`
              <div class="p-3">
                <h3 class="font-bold text-lg mb-2">${property.name}</h3>
                <p class="text-sm text-gray-600 mb-1"><strong>Price:</strong> ${property.priceFormatted}</p>
                <p class="text-sm text-gray-600 mb-1"><strong>Type:</strong> ${property.type}</p>
                <p class="text-sm text-gray-600 mb-1"><strong>Area:</strong> ${property.area} m²</p>
                <p class="text-sm text-gray-600"><strong>Beds:</strong> ${property.beds}</p>
              </div>
            `)
                        .addTo(map.current)

                    markersRef.current.push(marker)
                }
            })
        }

        initMap()
    }, [selectedLocation])

    return (
        <div className="relative w-full h-96 overflow-hidden">
            <div
                ref={mapContainer}
                className="w-full h-full"
            />
        </div>

    )
}

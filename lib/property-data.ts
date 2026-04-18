export interface Property {
  id: string
  name: string
  location: string
  lat: number
  lng: number
  price: number
  priceFormatted: string
  type: string
  area: number
  beds: number
}

export interface LocationArea {
  name: string
  properties: Property[]
}

export const properties: Property[] = [
  // Marbella
  {
    id: "prop-1",
    name: "Luxury Penthouse",
    location: "Marbella",
    lat: 36.5116,
    lng: -4.8848,
    price: 850000,
    priceFormatted: "€850K",
    type: "Penthouse",
    area: 320,
    beds: 4
  },
  {
    id: "prop-2",
    name: "Beach Villa",
    location: "Marbella",
    lat: 36.5190,
    lng: -4.8820,
    price: 695000,
    priceFormatted: "€695K",
    type: "Villa",
    area: 280,
    beds: 4
  },
  {
    id: "prop-3",
    name: "Modern Apartment",
    location: "Marbella",
    lat: 36.5100,
    lng: -4.8900,
    price: 450000,
    priceFormatted: "€450K",
    type: "Apartment",
    area: 150,
    beds: 3
  },
  // Malaga
  {
    id: "prop-4",
    name: "City Center Flat",
    location: "Málaga",
    lat: 36.7213,
    lng: -4.4215,
    price: 375000,
    priceFormatted: "€375K",
    type: "Apartment",
    area: 120,
    beds: 2
  },
  {
    id: "prop-5",
    name: "Historic Townhouse",
    location: "Málaga",
    lat: 36.7250,
    lng: -4.4200,
    price: 425000,
    priceFormatted: "€425K",
    type: "Townhouse",
    area: 180,
    beds: 3
  },
  {
    id: "prop-6",
    name: "Seafront Property",
    location: "Málaga",
    lat: 36.7180,
    lng: -4.4150,
    price: 550000,
    priceFormatted: "€550K",
    type: "Villa",
    area: 250,
    beds: 4
  },
  // Fuengirola
  {
    id: "prop-7",
    name: "Modern Beach Apartment",
    location: "Fuengirola",
    lat: 36.5325,
    lng: -4.6279,
    price: 320000,
    priceFormatted: "€320K",
    type: "Apartment",
    area: 110,
    beds: 2
  },
  {
    id: "prop-8",
    name: "Garden Villa",
    location: "Fuengirola",
    lat: 36.5380,
    lng: -4.6250,
    price: 480000,
    priceFormatted: "€480K",
    type: "Villa",
    area: 220,
    beds: 3
  },
  // Benalmádena
  {
    id: "prop-9",
    name: "Beachfront Condo",
    location: "Benalmádena",
    lat: 36.5946,
    lng: -4.5339,
    price: 395000,
    priceFormatted: "€395K",
    type: "Apartment",
    area: 140,
    beds: 3
  },
  {
    id: "prop-10",
    name: "Clifftop Villa",
    location: "Benalmádena",
    lat: 36.5980,
    lng: -4.5300,
    price: 650000,
    priceFormatted: "€650K",
    type: "Villa",
    area: 310,
    beds: 5
  },
  // Puerto Banús
  {
    id: "prop-11",
    name: "Marina Apartment",
    location: "Puerto Banús",
    lat: 36.5098,
    lng: -4.9481,
    price: 520000,
    priceFormatted: "€520K",
    type: "Apartment",
    area: 160,
    beds: 2
  },
  {
    id: "prop-12",
    name: "Luxury Marina Villa",
    location: "Puerto Banús",
    lat: 36.5130,
    lng: -4.9510,
    price: 1200000,
    priceFormatted: "€1.2M",
    type: "Villa",
    area: 400,
    beds: 5
  },
  // Estepona
  {
    id: "prop-13",
    name: "Old Town Townhouse",
    location: "Estepona",
    lat: 36.4283,
    lng: -5.1466,
    price: 340000,
    priceFormatted: "€340K",
    type: "Townhouse",
    area: 130,
    beds: 2
  },
  {
    id: "prop-14",
    name: "Beachfront Property",
    location: "Estepona",
    lat: 36.4350,
    lng: -5.1420,
    price: 620000,
    priceFormatted: "€620K",
    type: "Villa",
    area: 280,
    beds: 4
  }
]

export const locations = [
  "Marbella",
  "Málaga",
  "Fuengirola",
  "Benalmádena",
  "Puerto Banús",
  "Estepona"
]

export function getPropertiesByLocation(location: string): Property[] {
  if (!location) return properties
  return properties.filter(p => p.location === location)
}

export function getLocationCenter(location: string): { lat: number; lng: number } {
  const locationProps = getPropertiesByLocation(location)
  if (locationProps.length === 0) {
    // Default center (Marbella)
    return { lat: 36.5116, lng: -4.8848 }
  }

  const avgLat = locationProps.reduce((sum, p) => sum + p.lat, 0) / locationProps.length
  const avgLng = locationProps.reduce((sum, p) => sum + p.lng, 0) / locationProps.length

  return { lat: avgLat, lng: avgLng }
}

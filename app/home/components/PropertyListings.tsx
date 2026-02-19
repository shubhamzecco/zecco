"use client"
import { App_url } from '@/constant/static'
import Link from 'next/link'
import { useState } from 'react'
import PropertyCard from '../../../components/cards/PropertyCard'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { clearBreadcrumbs, setBreadcrumbs } from '@/redux/modules/main/action'


interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  images: string[];
  beds: number;
  baths: number;
  area: number;
  isLiked?: boolean;
}


const propertyData: Property[] = [
  {
    id: '1',
    title: 'Modern 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Marbella, Málaga, Spain',
    images: [App_url.image.image_1, App_url.image.image_2, App_url.image.image_3],
    beds: 2,
    baths: 2,
    area: 3900,
  },
  {
    id: '2',
    title: 'Luxury 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Costa del Sol, Spain',
    images: [App_url.image.image_6],
    beds: 2,
    baths: 2,
    area: 3900,
  },
  {
    id: '3',
    title: 'Stylish 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Estepona, Spain',
    images: [App_url.image.image_5],
    beds: 2,
    baths: 2,
    area: 3900,
  },
  {
    id: '4',
    title: 'Contemporary 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Benalmádena, Spain',
    images: [App_url.image.image_4],
    beds: 2,
    baths: 2,
    area: 3900,
  },
  {
    id: '5',
    title: 'Premium 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Marbella, Spain',
    images: [App_url.image.image_3],
    beds: 2,
    baths: 2,
    area: 3900,
  },
  {
    id: '6',
    title: 'Spacious 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Nerja, Spain',
    images: [App_url.image.image_2],
    beds: 2,
    baths: 2,
    area: 3900,
  },
  {
    id: '7',
    title: 'Spacious 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Nerja, Spain',
    images: [App_url.image.costa_del_sol],
    beds: 2,
    baths: 2,
    area: 3900,
  },
  {
    id: '8',
    title: 'Spacious 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Nerja, Spain',
    images: [App_url.image.your_search],
    beds: 2,
    baths: 2,
    area: 3900,
  },
]

export default function PropertyListings() {

  const [properties, setProperties] = useState<Property[]>(propertyData);
  const dispatch = useDispatch()
  const router = useRouter()

  const toggleLike = (id: string) => {
    setProperties((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isLiked: !item.isLiked }
          : item
      )
    );
  };

    const handleNavigate = () => {
      dispatch(clearBreadcrumbs())
      dispatch(setBreadcrumbs([
        { label: "Home", href: "/" },
           { label: "Zecco's Favorites", href: App_url.link.ZECCO_FAVORITES },
      ]))
      router.push(`${App_url.link.ZECCO_FAVORITES}`)
    }

  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10 bg-white  lg:mx-10 mb-10">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-manrope text-[#00000]">Zecco's Favorites</h2>
          <button onClick={handleNavigate} className='rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   py-2 text-xs lg:text-sm shadow-sm  text-white '>
            View All Properties
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {properties?.map((property) => (
            <PropertyCard key={property.id} {...property} onLikeToggle={() => toggleLike(property.id)} />
          ))}
        </div>
      </div>
    </section>
  )
}

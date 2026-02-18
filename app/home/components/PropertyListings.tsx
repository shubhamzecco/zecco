import { Button } from '@/components/ui/button'
import PropertyCard from '../../../components/cards/PropertyCard'
import { App_url } from '@/constant/static'

const propertyData = [
  {
    id: '1',
    title: 'Modern 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Marbella, Málaga, Spain',
    images: [App_url.image.image_1, App_url.image.image_2, App_url.image.image_3],
    beds: 2,
    baths: 2,
    area: 3900,
    featured: true,
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
  return (
    <section className="px-4 sm:px-6 lg:px-8 mt-10 bg-white  lg:mx-10 mb-10">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-manrope text-[#00000]">Zecco's Favorites</h2>
          <Button className='rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   lg:py-2 text-xs lg:text-sm shadow-sm  text-white '>
            View All Properties
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {propertyData?.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* Mobile View All Button */}
        {/* <Button className='rounded-full font-manrope bg-dark_navy font-medium  px-7  py-2 text-sm shadow-xl  text-white '>
          View All Properties
        </Button> */}
      </div>
    </section>
  )
}

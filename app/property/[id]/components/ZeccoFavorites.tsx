
import PropertyCard from '@/components/cards/PropertyCard'
import { App_url } from '@/constant/static'

const propertyData = [
  {
    id: '1',
    title: 'Modern 2-Bedroom Apartment in Marbella, Spain',
    price: '€545,000',
    location: 'Marbella, Málaga, Spain',
    images: [App_url.image.image_1],
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
    images: [App_url.image.image_6 , App_url.image.image_5 , App_url.image.image_4],
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
  }
]
export default function ZeccoFavorites() {
  return (
    <section className=" bg-white mb-20">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl sm:text-xl font-bold font-manrope text-[#00000]">Zecco's Favorites</h2>
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

import PropertyCard from '@/components/cards/PropertyCard'
import SidebarLayout from '@/components/layouts/sidebar-layout'
import { App_url } from '@/constant/static'

const FavoritesPage = () => {
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
        }
    ]
    return (
        <SidebarLayout>
            <div className="lg:px-12 px-5  py-8 h-full
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]">
                <section className="mt-5 mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">Favorites</h2>
                        <div className=" bg-[#EEF2FF] rounded-full px-3 py-1 ">
                            <p className='font-manrope font-semibold text-[#2828FF] uppercase text-sm'>{propertyData?.length} Properties</p>
                        </div>
                    </div>
                    <div className="bg-white/70 p-7  rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                            {propertyData?.map((property) => (
                                <PropertyCard key={property.id} {...property} aiInsights={true} isLiked={true} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </SidebarLayout>
    )
}

export default FavoritesPage

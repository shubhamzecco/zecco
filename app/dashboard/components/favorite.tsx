"use client"
import PropertyCard from '@/components/cards/PropertyCard'
import { App_url } from '@/constant/static'
import { Property } from '@/utils/types';
import { useState } from 'react';

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
            isLiked : true
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
            isLiked : true
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
            isLiked : true
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

const Favorite = () => {

    const [properties, setProperties] = useState<Property[]>(propertyData);
    
        const toggleLike = (id: string) => {
            setProperties((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, isLiked: !item.isLiked }
                        : item
                )
            );
        };

    return (
        <section className="mt-10 mb-6">
            <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">Favorite</h2>
            <div className="bg-white/70 p-7  rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {properties?.filter((item : Property) => item?.isLiked)?.splice(0, 3)?.map((property) => (
                        <PropertyCard key={property.id} {...property} onLikeToggle={() => toggleLike(property?.id)} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Favorite

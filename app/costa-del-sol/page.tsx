import AreaCard from '@/components/cards/AreaCard'
import MainLayout from '@/components/layouts/main-layout'
import { App_url } from '@/constant/static'
import React from 'react'

const CostadelSol = () => {
    const areasData = [
        {
            id: '1',
            title: 'Marbella',
            image: App_url.image.cds_marbella,
            description: 'The Luxury Coastal Icon',
        },
        {
            id: '2',
            title: 'Malaga',
            image: App_url.image.cds_malaga,
            description: 'The Cultural Capital of the Costa',
        },
        {
            id: '3',
            title: 'Fuengirola',
            image: App_url.image.cds_fuengirola,
            description: 'Vibrant Living by the Sea',
        },
        {
            id: '4',
            title: 'Benalmádena',
            image: App_url.image.cds_Benalmádena,
            description: 'Where Coast Meets Community',
        },
        {
            id: '5',
            title: 'Mijas',
            image: App_url.image.cds_Mijas,
            description: 'Traditional Charm with Sea Views',
        },
        {
            id: '6',
            title: 'Estepona',
            image: App_url.image.cds_Estepona,
            description: 'The Garden of the Costa del Sol',
        },
        {
            id: '7',
            title: 'Benahavís',
            image: App_url.image.cds_Benahavís,
            description: 'The Gourmet Village of Luxury Living',
        },
        {
            id: '8',
            title: 'Coín',
            image: App_url.image.cds_Coín,
            description: 'Authentic Andalusian Heartland',
        },
        {
            id: '9',
            title: 'Casares',
            image: App_url.image.cds_Casares,
            description: 'The White Village Above the Coast',
        }
    ]

    return (
        <MainLayout isBreadcrumb isFilter>
            <div className="lg:mx-7 lg:pb-10 px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
                    {areasData?.map((area) => (
                        <div
                            key={area.id}
                            className={`flex-shrink-0 w-full`}
                        >
                            <AreaCard {...area} />
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}

export default CostadelSol

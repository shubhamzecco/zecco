import MainLayout from '@/components/layouts/main-layout'
import React from 'react'
import PropertyGallery from './components/ImageGallery'
import { PropertyInfo } from './components/PropertyInfo'
import { AIMarketIntelligence } from './components/AIMarketIntelligence'
import { PropertyDescription } from './components/PropertyDescription'
import { MapSection } from './components/MapSection'
import { AgentCard } from './components/AgentCard'
import PropertyStats from './components/PropertyStats'
import BasicFeatures from './components/BasicFeatures'
import ZeccoFavorites from './components/ZeccoFavorites'
import NearByPlaces from './components/near-by-palces'

const Page = () => {
    return (
        <MainLayout isBreadcrumb isPropertyDetails chatBotWidget={false}>
            <div className="lg:mx-7 px-4 sm:px-6 lg:px-8">
                <div className="lg:col-span-1">
                    <PropertyGallery />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <PropertyInfo />
                        <PropertyStats />
                        <AIMarketIntelligence />
                        <PropertyDescription />
                        <BasicFeatures />
                        <MapSection />
                    </div>

                    <div className="lg:col-span-1">
                        <AgentCard />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <NearByPlaces/>
                    <ZeccoFavorites />
                </div>
            </div>
        </MainLayout>
    )
}

export default Page

"use client"
import { setBreadcrumbs } from '@/redux/modules/main/action'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Footer from '../../components/Footer'
import PricingPlans from '../../components/section/PricingPlans'
import AiExpertise from './components/AiExpertise'
import AreasOfInterest from './components/AreasOfInterest'
import Blogs from './components/Blogs'
import EssentialAspects from './components/EssentialAspects'
import ExploreByTypes from './components/ExploreByTypes'
import ExploreRegions from './components/ExploreRegions'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import PropertyListings from './components/PropertyListings'
import SmarterSearch from './components/SmarterSearch'

const HomePage = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setBreadcrumbs([{ label: "Home", href: "/" }]))
    }, [])
    return (
        <>
            <main className={`w-full bg-white`}>
                <Navbar />
                <HeroSection />
                <AiExpertise />
                <PropertyListings />
                <AreasOfInterest />
                <EssentialAspects />
                <ExploreByTypes />
                <PricingPlans heading='Choose your Zecco plan' description='Unlock the full power of our AI-driven distribution network and dominate the Spanish property market.' />
                <Blogs />
                <SmarterSearch />
                <ExploreRegions />
                <Footer />
            </main>
            {/* <ChatWidget/> */}
        </>
    )
}

export default HomePage

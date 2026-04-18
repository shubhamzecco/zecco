"use client"
import Footer from '../../components/Footer'
import Navbar from './components/Navbar'
import AiExpertise from './components/AiExpertise'
import AreasOfInterest from './components/AreasOfInterest'
import Blogs from './components/Blogs'
import EssentialAspects from './components/EssentialAspects'
import ExploreByTypes from './components/ExploreByTypes'
import ExploreRegions from './components/ExploreRegions'
import HeroSection from './components/HeroSection'
import PricingPlans from '../../components/section/PricingPlans'
import PropertyListings from './components/PropertyListings'
import SmarterSearch from './components/SmarterSearch'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setBreadcrumbs } from '@/redux/modules/main/action'

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

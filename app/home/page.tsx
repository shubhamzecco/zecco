import ChatWidget from '@/components/chat/chatbot-widget'
import AiExpertise from './components/AiExpertise'
import AreasOfInterest from './components/AreasOfInterest'
import Blogs from './components/Blogs'
import EssentialAspects from './components/EssentialAspects'
import ExploreByTypes from './components/ExploreByTypes'
import ExploreRegions from './components/ExploreRegions'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import PricingPlans from './components/PricingPlans'
import PropertyListings from './components/PropertyListings'
import SmarterSearch from './components/SmarterSearch'

const HomePage = () => {
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
                <PricingPlans />
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

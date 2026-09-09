import Footer from "../../components/Footer";
import PricingPlans from "../../components/section/PricingPlans";
import { FaqSection } from "@/components/seo/FaqSection";
export const dynamic = "force-dynamic";

import AiExpertise from "./components/AiExpertise";
import AreasOfInterest from "./components/AreasOfInterest";
import Blogs from "./components/Blogs";
import EssentialAspects from "./components/EssentialAspects";
import ExploreByTypes from "./components/ExploreByTypes";
import ExploreRegions from "./components/ExploreRegions";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import PropertyListings from "./components/PropertyListings";
import SmarterSearch from "./components/SmarterSearch";
import {
  serverFetchAreaList,
  serverFetchFavoriteList,
  serverFetchLocationList,
  serverFetchPackageList,
  serverFetchPrebuiltSuggestions,
} from "@/lib/serverActions";

const HomePage = async () => {
  const [favoriteData, locationData, packageData, areaData, suggestions] =
    await Promise.allSettled([
      serverFetchFavoriteList({
        limit: 10,
        page: 1,
        search: "",
        location_id: null,
      }),
      serverFetchLocationList({
        search: "",
        limit: 12,
        page: 1,
        status: true,
      }),
      serverFetchPackageList({
        search: "",
        limit: 12,
        page: 1,
        status: true,
      }),
      serverFetchAreaList({
        search: "",
        limit: 10,
        page: 1,
      }),
      serverFetchPrebuiltSuggestions(),
    ]);

  const favorite = favoriteData.status === "fulfilled" ? favoriteData.value : null;
  const locations =
    locationData.status === "fulfilled" ? locationData.value : null;
  const packages =
    packageData.status === "fulfilled" ? packageData.value : null;
  const areas = areaData.status === "fulfilled" ? areaData.value : null;
  const prebuiltSuggestions =
    suggestions.status === "fulfilled" ? suggestions.value : [];

  return (
    <>
      <main className={`w-full bg-white`}>
        <Navbar />
        <HeroSection suggestions={prebuiltSuggestions} />
        <AiExpertise />
        <PropertyListings initialData={favorite} />
        <AreasOfInterest initialData={locations} />
        <EssentialAspects />
        <ExploreByTypes />
        <PricingPlans
          heading="Choose your Zecco plan"
          description="Unlock the full power of our AI-driven distribution network and dominate the Spanish property market."
          initialData={packages}
        />
        <Blogs />
        <SmarterSearch />
        <ExploreRegions initialData={areas} />
        <Footer />
      </main>
      <FaqSection/>
    </>
  );
};

export default HomePage;

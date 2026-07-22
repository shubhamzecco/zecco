import { App_url } from "@/constant/static";
import Image from "next/image";
import PropertySearchBar from "./PropertySearchBar";

export default function HeroSection() {
  return (
    <div className="relative h-[80vh] sm:h-[60vh] landscape:sm:h-[80vh]   lg:h-[100vh] w-full  bg-gradient-to-b from-sky-600/20  via-white to-white">
      {/* Background Image */}
      <Image
        src={App_url.image.home}
        alt="Luxury villa in Spain"
        fill
        className="lg:object-fill max-md:object-cover mx-auto"
        priority
      />
       <div className="absolute inset-0 rounded-b-[40px] bg-gradient-to-b from-white/20 via-white/20 to-transparent" />
      <div className="absolute top-[23%]  lg:top-[23%] left-0 right-0 flex flex-col items-center text-center px-4 -translate-y-1/2">
        <Image
          src={App_url.image.logo}
          alt="logo"
          width={280}
          height={190}
          className="lg:object-cover max-md:object-cover mx-auto"
          priority
        />
      </div>

      {/* Search Bar pinned to bottom */}
      <div className="absolute bottom-7 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto">
          <PropertySearchBar />
        </div>
      </div>
    </div>
  );
}

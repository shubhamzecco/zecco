import Image from 'next/image'
import PropertySearchBar from './PropertySearchBar'
import { App_url } from '@/constant/static'

export default function HeroSection() {
  return (
    <div className="relative  h-[100vh] w-full  bg-gradient-to-b from-sky-600/20  via-white to-white">
      {/* Background Image */}
      <Image
        src={App_url.image.home}
        alt="Luxury villa in Spain"
        fill
        className="object-fill mx-auto"
        priority
      />

      {/* Center Content */}
      {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-manrope font-bold text-heading_text_color mb-4 text-balance">
            Find Your Dream Home In{" "}
            <span className="bg-gradient-to-b from-[#1466EC] to-[#04ADF7] bg-clip-text text-transparent">
              Spain
            </span>
          </h1>

          <p className="text-md sm:text-lg font-manrope text-[#0B5394] mx-auto">
            The new standard in property search. Smarter with AI.
            Trusted by local experts.
          </p>
        </div>
      </div> */}
      <div className="absolute top-[35%] left-0 right-0 flex flex-col items-center text-center px-4 -translate-y-1/2">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-manrope font-bold text-heading_text_color mb-4 text-balance">
            Find Your Dream Home In{" "}
            <span className="bg-gradient-to-b from-[#1466EC] to-[#04ADF7] bg-clip-text text-transparent">
              Spain
            </span>
          </h1>

          <p className="text-md sm:text-lg font-manrope text-[#0B5394] mx-auto">
            The new standard in property search. Smarter with AI. Trusted by
            local experts.
          </p>
        </div>
      </div>

      {/* Search Bar pinned to bottom */}
      <div className="absolute bottom-28 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto">
          <PropertySearchBar />
        </div>
      </div>
    </div>
  );
}

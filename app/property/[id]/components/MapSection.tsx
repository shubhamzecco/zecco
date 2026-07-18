import { ChevronDown, Info, MapPin } from "lucide-react";
import { PropertyMap } from "./map";

export function MapSection() {
  return (
    <div className="lg:mb-8">
      <h3 className="text-xl font-bold font-manrope text-heading_text_color mb-4">
        Explore The Neighborhood
      </h3>
      <div className="rounded-lg overflow-hidden bg-gradient-to-b from-blue-200 to-blue-100 h-80 relative">
        <PropertyMap />
        {/* <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-full shadow-md text-xs tracking-wider text-[#111827] font-manrope font-bold flex items-center gap-1">
          <MapPin className="w-4 h-4" /> Nearby Places{" "}
          <ChevronDown className="w-4 h-4" />
        </div> */}
      </div>
      <p className="text-md text-[#64748B] mt-4 flex items-center gap-1 font-normal tracking-wider">
        <div className="w-6 h-6">
          <Info className="w-5 h-5" />
        </div>
        For privacy reasons, the advertiser has not indicated the exact address.
      </p>
    </div>
  );
}

import { Property } from "@/redux/modules/main/types";
import { Square, BedDouble, Bath, ArrowUp, Scan, ArrowUpFromLine } from "lucide-react";

interface PropertyStats {
  property: Property;
}

export default function PropertyStats({property} : PropertyStats) {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm mb-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
            <Scan className="w-5 h-5 text-[#475569]" />
          </div>
          <div>
            <p className="text-sm font-manrope font-bold text-[#111827]">
              {property?.mtsBuild} /m²
            </p>
            <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
              Built
            </p>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
            <BedDouble className="w-5 h-5 text-[#475569]" />
          </div>
          <div>
            <p className="text-sm font-manrope font-bold text-[#111827]">
              {property?.bedrooms} Bedrooms
            </p>
            <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
              Sleeps {property?.bedrooms}
            </p>
          </div>
        </div>

        {/* Bathrooms */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
            <Bath className="w-5 h-5 text-[#475569]" />
          </div>
          <div>
            <p className="text-sm whitespace-nowrap font-manrope font-bold text-[#111827]">
              {property?.bathrooms} Bathrooms
            </p>
            <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
              Total
            </p>
          </div>
        </div>

        {/* Floor */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
            <ArrowUpFromLine className="w-5 h-5 text-[#475569]" />
          </div>
          <div>
            <p className="text-sm font-manrope font-bold text-[#111827]">
              1st Floor
            </p>
            <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
              Exterior with lift
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

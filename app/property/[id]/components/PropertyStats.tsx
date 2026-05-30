import { IProperty } from "@/redux/modules/main/types";
import {
  ArrowUpFromLine,
  Bath,
  BedDouble,
  ChartColumnDecreasing,
  LandPlot,
  Scan,
  SquareActivity
} from "lucide-react";

interface PropertyStats {
  property: IProperty;
}

export default function PropertyStats({ property }: PropertyStats) {
  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm mb-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {property?.mtsBuild !== null && property?.mtsBuild !== undefined && (
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
        )}

        {/* Bedrooms */}
        {property?.bedrooms !== null && property?.bedrooms !== undefined && (
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
        )}

        {/* Bathrooms */}
        {property?.bathrooms !== null && property?.bathrooms !== undefined && (
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
        )}

        {/* Floor */}
        {property?.floors !== null && property?.floors !== undefined && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
              <ArrowUpFromLine className="w-5 h-5 text-[#475569]" />
            </div>
            <div>
              <p className="text-sm font-manrope font-bold text-[#111827]">
                {property?.floors} Floor
              </p>
              <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
                Exterior with lift
              </p>
            </div>
          </div>
        )}

        {property?.mtsInterior !== null &&
          property?.mtsInterior !== undefined && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
                <ChartColumnDecreasing className="w-5 h-5 text-[#475569]" />
              </div>
              <div>
                <p className="text-sm font-manrope font-bold text-[#111827]">
                  {property?.mtsInterior} /m²
                </p>
                <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
                  Interior area
                </p>
              </div>
            </div>
          )}

        {property?.mtsTerrace !== null &&
          property?.mtsTerrace !== undefined && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
                <SquareActivity className="w-5 h-5 text-[#475569]" />
              </div>
              <div>
                <p className="text-sm font-manrope font-bold text-[#111827]">
                  {property?.mtsTerrace} /m²
                </p>
                <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
                  Terrace area
                </p>
              </div>
            </div>
          )}

        {property?.mtsPlot !== null && property?.mtsPlot !== undefined && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-md">
              <LandPlot className="w-5 h-5 text-[#475569]" />
            </div>
            <div>
              <p className="text-sm font-manrope font-bold text-[#111827]">
                {property?.mtsPlot} /m²
              </p>
              <p className="text-xs font-manrope font-semibold text-[#6B7280] uppercase">
                Plot area
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

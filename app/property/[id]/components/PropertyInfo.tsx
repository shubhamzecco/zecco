import { IProperty, Property } from "@/redux/modules/main/types";
import { ShieldCheck, Sparkles } from "lucide-react";

interface PropertyInfoProps {
  property: IProperty;
}
export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="mb-5">
      <div className="flex gap-3 mb-2">
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#1466EC] text-white text-sm font-manrope font-medium leading-none backdrop-blur-md">
          <Sparkles size={12} className="text-white" />
          <span>AI Verified</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#5BA55A] text-white text-sm font-manrope font-medium leading-none backdrop-blur-md">
          <ShieldCheck size={12} className="text-white" />
          <span>Verified Seller</span>
        </div>
      </div>
      <h1 className="text-3xl font-manrope text-heading_text_color font-semibold  mb-2">Stylish {property?.bedrooms}-Bedroom {property?.propertyCategory?.name} in {property?.locationCity?.name} , {property?.locationCountry?.name}</h1>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-manrope font-bold text-heading_text_color">€{property?.salePrice}</span>
        <span className="text-md text-[#9CA3AF] font-manrope  line-through">{property?.salePrice}</span>
        <span className="text-red-600 font-semibold text-lg">0%</span>
      </div>
      <p className="font-manrope font-semibold uppercase text-[#64748B] text-sm mb-4">{property?.locationCity?.name} , {property?.locationCountry?.name}</p>
    </div>
  )
}

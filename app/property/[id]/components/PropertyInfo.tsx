import { IProperty } from "@/redux/modules/main/types";
import { formatEuro } from "@/utils/common";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

interface PropertyInfoProps {
  property: IProperty;
}
export function PropertyInfo({ property }: PropertyInfoProps) {
  // console.log("property::", property)
  return (
    <div className="mb-5">
      <div className="flex flex-wrap gap-2 mb-2">
        {property?.property_tags?.length
          ? property.property_tags.map((tag: any) => {
            const tagName = tag?.name?.trim() || "";
            const normalizedTag = tagName.toLowerCase();

            let Icon = null;
            let className =
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-white text-sm font-manrope font-medium leading-none";

            if (["ai verified"].includes(normalizedTag)) {
              Icon = Sparkles;
              className += " bg-[#1466EC]";
            } else if (["verified seller"].includes(normalizedTag)) {
              Icon = ShieldCheck;
              className += " bg-[#5BA55A]";
            } else if (["zecco favourites"].includes(normalizedTag)) {
              Icon = Heart;
              className += " bg-[#F59E0B]";
            } else {
              className += " bg-gray-500";
            }

            return (
              <div key={tag?._id} className={className}>
                {Icon && <Icon size={12} className="text-white" />}
                <span>{tagName}</span>
              </div>
            );
          })
          : null}
      </div>
      <h1 className="text-3xl font-manrope text-heading_text_color font-semibold  mb-2">
        {property?.bedrooms ? `${property?.bedrooms} Bedroom ` : ""}{" "}
        {property?.propertyType
          ? property?.propertyType?.name
          : property?.propertyCategory?.name}{" "}
        for{" "}
        {property?.isSale && property?.isRent
          ? "Sale or Rent"
          : property?.isSale
            ? "Sale"
            : property?.isRent
              ? "Rent"
              : ""}{" "}
        in {property?.locationSubarea ? `${property?.locationSubarea},` : ""}{" "}
        {property?.locationArea ? `${property?.locationArea},` : ""}{" "}
        {property?.locationCity}, {property?.locationCountry}
      </h1>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-3xl font-manrope font-bold text-heading_text_color">
          {formatEuro(property?.salePrice ?? 0)}
        </span>
        {/* <span className="text-md text-[#4B5563] font-manrope  line-through">
          {property?.salePrice}
        </span>
        <span className="text-red-600 font-semibold text-lg">0%</span> */}
      </div>
      <p className="font-manrope font-semibold uppercase text-[#64748B] text-sm mb-4">
        {property?.locationCity} , {property?.locationCountry}
      </p>
    </div>
  );
}

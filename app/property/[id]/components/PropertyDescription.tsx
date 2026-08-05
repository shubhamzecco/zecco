import { IPropertyDescription } from "@/redux/modules/main/types";
import { useState } from "react";

export function PropertyDescription({
  propertyDescriptions,
}: {
  propertyDescriptions: IPropertyDescription[];
}) {
  const [showMore, setShowMore] = useState(false);

  const description =
    propertyDescriptions?.find((item) => item?.language === "en")
      ?.description || "";

  const isLongText = description.length > 500;

  const displayedText = showMore
    ? description
    : `${description.slice(0, 500)}${isLongText ? "..." : ""}`;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold font-manrope text-heading_text_color mb-4">
        Property Description
      </h3>

      <p className="text-[#64748B] font-manrope font-normal leading-relaxed mb-4">
        {displayedText}
        {isLongText && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-600 ml-1 font-medium font-manrope hover:underline"
          >
            {showMore ? "Show Less" : "More"}
          </button>
        )}
      </p>
    </div>
  );
}

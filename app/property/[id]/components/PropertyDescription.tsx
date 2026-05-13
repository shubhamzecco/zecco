import { IPropertyDescription } from "@/redux/modules/main/types";

export function PropertyDescription({ propertyDescriptions }: { propertyDescriptions: IPropertyDescription[] }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold font-manrope text-heading_text_color mb-4">Property Description</h3>
      {propertyDescriptions?.map((description, index) => {
        if (description?.language === 'en') {
          return (
            <p key={index} className="text-[#64748B] font-manrope font-normal leading-relaxed mb-4">
              {description?.description}
            </p>
          )
        }
      })}
    </div>
  )
}

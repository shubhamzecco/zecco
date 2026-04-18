import {
  Square,
  Bed,
  Bath,
  Droplets,
  Home,
  Package,
  Scan,
} from "lucide-react";

export default function BasicFeatures() {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold font-manrope text-heading_text_color mb-4">Basic Features</h3>
      <div className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
          <div className="space-y-4">
            <Feature
              icon={<Scan className="w-5 h-5 text-[#94A3B8]" />}
              text="99 m² built, 74 m² floor area"
            />
            <Feature
              icon={<Bed className="w-5 h-5 " />}
              text="3 Bedrooms"
            />
            <Feature
              icon={<Bath className="w-5 h-5 " />}
              text="2 Bathrooms"
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Feature
              icon={<Droplets className="w-5 h-5 " />}
              text="Swimming Pool"
            />
            <Feature
              icon={<Home className="w-5 h-5 " />}
              text="New housing development"
            />
            <Feature
              icon={<Package className="w-5 h-5 " />}
              text="Storage room"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

/* Reusable row */
function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg text-[#94A3B8] ">
        {icon}
      </div>
      <p className="text-[15px] font-manrope font-medium text-[#334155]">
        {text}
      </p>
    </div>
  );
}

import Image from 'next/image'
import { CheckCircle2, Users, Lightbulb, LayoutPanelLeft, Layers, Pin, MapPin, Building, Sparkles } from 'lucide-react'
import { App_url } from "@/constant/static";

export default function Operate() {
  const features = [
    {
      icon: <MapPin size={32} />,
      title: 'Costa del Sol Specialists',
      description: 'Deep local knowledge in every pocket of the Sun Coast.',
    },
    {
      icon: <Building size={32} />,
      title: 'High-Demand Cities',
      description: 'Curated listings in the most economically vibrant urban areas.',
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Premium Portfolios',
      description: 'Investment-ready assets that exceed traditional standards.',
    },
  ]

  return (
    <section className="">
      <div className=" lg:mx-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-5 ">
          <div>
            <h2 className="text-3xl font-manrope sm:text-4xl font-semibold text-[#000000] mb-5">
              Where We Operate
            </h2>
            <p className="text-slate_gray font-manrope font-normal max-w-lg mb-10">
              We specialize in the most sought-after locations along the southern coast of Spain, ensuring our clients have access to prime real estate in high-demand zones.
            </p>

            <div className="space-y-10">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#4A86E8] w-16 h-16 rounded-xl flex justify-center items-center text-white shadow-xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-manrope font-medium text-[#000000] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate_gray font-manrope font-normal max-w-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">

            {/* IMAGE */}
            <div className="relative w-full h-[510px]">
              <Image
                src={App_url.image.about_us_2}
                alt="Modern villa interior"
                fill
                className="object-fill rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

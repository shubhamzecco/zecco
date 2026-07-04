import { App_url } from "@/constant/static";
import Image from "next/image";

export default function EssentialAspects() {
  const features = [
    {
      icon: App_url.image.local,
      title: "Local Expertise",
      description:
        "Deep understanding of Spanish property laws, regions, and market trends.",
    },
    {
      icon: App_url.image.ai_search,
      title: "Personalized AI Search",
      description:
        "Smart recommendations tailored to your lifestyle, budget, and goals.",
    },
    {
      icon: App_url.image.modular,
      title: "Modular Solutions",
      description:
        "Buy, rent, invest, or relocate—everything in one seamless platform.",
    },
  ];

  return (
    <section className=" mt-10 bg-[#F8FAFC]">
      <div className=" lg:mx-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-5 ">
          {/* Left Side - Features */}
          <div>
            <h2 className="text-3xl font-manrope sm:text-4xl font-bold text-gray-900 mb-14">
              Essential Aspects
              <br /> Driving Our Success
            </h2>

            <div className="space-y-10">
              {features?.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 bg-[#4A86E8] w-16 h-16 rounded-xl flex justify-center items-center text-white shadow-xl">
                    <Image
                      src={feature?.icon}
                      alt={feature?.title}
                      width={30}
                      height={30}
                    />
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

          {/* Right Side - Image */}
          <div className="relative">
            {/* TEXT */}
            <p className="text-slate_gray font-manrope font-normal max-w-lg mb-10">
              At Legally, we provide clear, transparent, and personalized legal
              services you can trust, delivered by experienced attorneys.
            </p>

            {/* IMAGE */}
            <div className="relative w-full h-[510px]">
              <Image
                src={App_url.image.image_1}
                alt="Modern villa interior"
                fill
                className="object-cover rounded-2xl shadow-xl"
              />

              {/* AI VERIFIED BADGE */}
              <div className="absolute bottom-0 lg:bottom-16 lg:-left-28 bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3">
                <div className="">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="w-3 h-3 rounded-full bg-success_green" />
                    <span className="text-sm uppercase tracking-wide font-inter font-semibold text-cool_gray">
                      Real-time Analysis
                    </span>
                  </div>
                  <h1 className="flex items-center gap-2 text-xl font-manrope font-bold text-[#000000] mb-1">
                    <Image
                      src={App_url.image.chat_logo}
                      alt="logo"
                      width={20}
                      height={20}
                      unoptimized
                    />
                    <span>AI-Verified</span>
                  </h1>
                  <p className="text-slate_gray font-manrope font-normal">
                    Every listing vetted for ROI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

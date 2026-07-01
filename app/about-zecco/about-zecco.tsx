"use client";
import MainLayout from "@/components/layouts/main-layout";
import { App_url } from "@/constant/static";
import { clearBreadcrumbs, setBreadcrumbs } from "@/redux/modules/main/action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Operate from "./components/operate";
import WhyChooseZecco from "./components/why-choose-zecco";

const AboutZecco = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleNavigate = () => {
    dispatch(clearBreadcrumbs());
    dispatch(
      setBreadcrumbs([
        { label: "Home", href: "/" },
        { label: "Explore properties", href: App_url.link.COSTA_DEL_SOL },
      ]),
    );
    router.push(`${App_url.link.COSTA_DEL_SOL}/explore-properties`);
  };

  return (
    <MainLayout chatBotWidget={false}>
      <section className="py-10 -mt-7 bg-white">
        <div className="lg:mx-10 px-6">
          <div className="flex flex-col md:flex-row md:justify-between mb-7">
            <div className="">
              <p className="font-manrope font-medium text-[#000000] uppercase flex items-center gap-1 mb-5">
                {" "}
                <div className="w-3 h-3 bg-[#747474] rounded-full"></div>About
                us
              </p>
              <h2 className="text-3xl capitalize font-manrope font-semibold text-[#000000]">
                Smarter Buying.
                <br />
                Confidence Built-in.
              </h2>
            </div>
            <div className="">
              <p className="text-slate_gray font-normal font-manrope text-md max-w-xl mt-4 md:mt-0">
                We bridge the gap between AI-driven intelligence and local
                expertise to simplify your property journey in the Costa del
                Sol.
              </p>
              <button
                onClick={handleNavigate}
                className="w-fit px-10 mt-10 tracking-wider shadow-md my-4 bg-[#136AED] text-white text-[15px] py-2.5 rounded-full font-inter font-semibold flex items-center gap-2"
              >
                Explore properties
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-[0.4fr_1fr] gap-6 mb-7">
            <div className="">
              <Image
                src={App_url.image.about_us_1}
                alt="About Us"
                className="rounded-[10px] object-cover w-full h-[91vh]"
                width={400}
                height={180}
              />
            </div>
            <div className="">
              <Image
                src={App_url.image.contact_us}
                alt="Contact Us"
                className="rounded-[10px] object-cover w-full"
                width={400}
                height={100}
              />
            </div>
          </div>

          <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-7">
            {[
              {
                title: "Vetted Excellence",
                description:
                  "Every listing is manually vetted for legal and financial integrity.",
              },
              {
                title: "Data Enlightenment",
                description:
                  "Our neural networks help you find the highest yield investments.",
              },
              {
                title: "Human Connection",
                description:
                  "A personal agent guides you through every single step of the purchase.",
              },
            ]?.map((item, i) => (
              <div className="lg:border-r pr-4 last:border-0" key={i}>
                <h1 className="text-xl font-bold text-[#000000] font-manrope my-3 mb-4">
                  {item?.title}
                </h1>
                <p className="text-[#64748B] first:max-w-[15rem] font-manrope font-medium text-sm">
                  {item?.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhyChooseZecco />
      <Operate />
    </MainLayout>
  );
};

export default AboutZecco;

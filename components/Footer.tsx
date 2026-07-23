import { App_url } from "@/constant/static";
import {
  ChevronRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import App from "next/app";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B1220] text-slate-300">
      {/* GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220] via-[#0E1B3C] to-[#0B1220]" />
      <div className="absolute bottom-0 left-0 right-0 flex h-full">
        <div className="relative w-1/2 opacity-100">
          <Image
            src={App_url.image.footer}
            alt="City skyline left"
            fill
            className="object-contain object-bottom"
          />
        </div>

        <div className="relative w-1/2 opacity-100">
          <Image
            src={App_url.image.footer}
            alt="City skyline right"
            fill
            className="object-contain object-bottom"
          />
        </div>
      </div>

      <div className="relative lg:mx-10 px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-semibold text-blue-400">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src={App_url.image.logo}
                    alt="logo"
                    width={160}
                    height={100}
                  />
                </Link>
              </span>
            </div>

            <p className="text-md leading-relaxed mb-6 font-manrope font-medium text-slate_gray ">
              Smart property search powered by AI and guided by local experts, making buying and selling in the Costa del Sol simple and transparent.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-3">
              {[<Facebook />, <Twitter />, <Instagram />].map((icon, i) => (
                <span
                  key={i}
                  className="h-9 w-9 p-2 flex items-center justify-center rounded-full bg-white text-[#64748B] hover:bg-white/90 transition cursor-pointer text-sm"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <div className="mb-3 ml-2">
              <h4 className="text-white font-instrument_sans text-md font-medium ">
                Quick link
              </h4>
              <svg
                width="50"
                height="24"
                viewBox="0 0 220 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <path
                  d="M0 12 L15 2 L30 12 L45 2 L60 12 L75 2 L90 12 L105 2 L120 12 L135 2 L150 12 L165 2 L180 12 L195 2 L210 12"
                  stroke="#CBD5E1"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <ul className="space-y-3 text-sm">
              {/* "Home", "About us", "Privacy Policy", "Terms & Conditions" */}
              {[
                { title: "Home", link: "/" },
                { title: "About Us", link: App_url.link.ABOUT_ZECCO },
                {
                  title: "Privacy Policy",
                  link: App_url?.link?.PRIVACY_POLICY,
                },
                {
                  title: "Terms & Conditions",
                  link: App_url?.link?.TERMS_CONDITION,
                },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item?.link}
                  className="hover:text-white font-manrope font-medium text-white/50 flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronRight /> {item?.title}
                </Link>
              ))}
            </ul>
          </div>

          
          <div>
            <div className="mb-3 ml-2">
              <h4 className="text-white font-instrument_sans text-md font-medium ">
                Help
              </h4>
              <svg
                width="45"
                height="20"
                viewBox="0 0 220 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <path
                  d="M0 12 L15 2 L30 12 L45 2 L60 12 L75 2 L90 12 L105 2 L120 12 L135 2 L150 12 L165 2 L180 12 L195 2 L210 12"
                  stroke="#CBD5E1"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                // { title: "FAQs", link: "#" },
                { title: "Supports", link: App_url.link.CONTACT_US },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item?.link}
                  className="hover:text-white font-manrope font-medium text-white/50 flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronRight /> {item?.title}
                </Link>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <div className="mb-3 ml-2">
              <h4 className="text-white font-instrument_sans text-md font-medium ">
                Contact
              </h4>
              <svg
                width="50"
                height="30"
                viewBox="0 0 220 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <path
                  d="M0 12 L15 2 L30 12 L45 2 L60 12 L75 2 L90 12 L105 2 L120 12 L135 2 L150 12 L165 2 L180 12 L195 2 L210 12"
                  stroke="#CBD5E1"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <ul className="space-y-4 text-sm">
              <li className="flex text-white/50 items-start gap-3 font-manrope font-medium">
                <MapPin size={25} className="text-white/50 mt-0.5" />
                <span>
                  2600<span className="font-bold"> ZECCO.es</span>, Malaga,
                  Spain
                </span>
              </li>

              <li className="flex text-white/50 items-center gap-3 text-md font-manrope font-medium">
                <Mail size={25} className="text-white/50 mt-0.5" />
                info@zecco.es
              </li>

              <li className="flex text-white/50 items-center gap-3 font-manrope font-medium">
                <Phone size={25} className="text-white/50] mt-0.5" />
                +34 600 000 000
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-5 pt-6 font-poppins font-normal text-center text-md text-white">
          © 2026 All rights reserved
        </div>
      </div>
    </footer>
  );
}

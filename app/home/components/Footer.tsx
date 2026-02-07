import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { App_url } from '@/constant/static'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    Company: ['About Us', 'Blog', 'Careers', 'Press', 'Contact'],
    Properties: ['Buy', 'Rent', 'Invest', 'Commercial', 'Residential'],
    Resources: ['FAQ', 'Support', 'Documentation', 'API Docs', 'Terms'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'],
  }

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


      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

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
              The proper footer or proper time can
              preserve your protection. We assist
              you make sure everybody forward.
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
            <h4 className="text-white font-instrument_sans text-md font-medium mb-4 ml-2">
              Quick link
            </h4>
            <ul className="space-y-3 text-sm">
              {['Home', 'About us', 'Privacy Policy', 'Terms & Conditions'].map(
                (item, i) => (
                  <li
                    key={i}
                    className="hover:text-white font-manrope font-medium text-white/50 flex items-center gap-1 transition cursor-pointer"
                  >
                    <ChevronRight /> {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h4 className="text-white font-instrument_sans text-md font-medium mb-4 ml-2">
              Help
            </h4>
            <ul className="space-y-3 text-sm">
              {['FAQs', 'Supports'].map((item, i) => (
                <li
                  key={i}
                  className="hover:text-white font-manrope font-medium text-white/50 flex items-center gap-1 transition cursor-pointer"
                >
                  <ChevronRight /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-instrument_sans text-md font-medium mb-4">
              Contact
            </h4>

            <ul className="space-y-4 text-sm">
              <li className="flex text-white/50 items-start gap-3 font-manrope font-medium">
                <MapPin size={25} className="text-white/50 mt-0.5" />
                <span>
                  2600<span className="font-bold"> ZECCO.es</span>, Malaga, Spain
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
          © 2024 All rights reserved
        </div>
      </div>
    </footer>
  )
}

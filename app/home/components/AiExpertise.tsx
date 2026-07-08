"use client";
import { App_url } from "@/constant/static";
import { setChatBadgeOpen } from "@/redux/modules/main/action";
import {
  ArrowRight,
  Headphones,
  MapPin,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

export default function AiExpertise() {
  const dispatch = useDispatch();
  return (
    <section>
      <div className="bg-[#F8FAFC] w-full">
        <div className="lg:mx-10 px-4 sm:px-6 lg:px-8">
          <div className="max-lg:grid lg:flex max-lg:grid-cols-1 gap-5 items-stretch py-14">
            <div
              className="w-full  lg:w-[40%]  rounded-2xl p-6 sm:p-8 lg:p-10
              bg-gradient-to-b
              from-[#1466EC] from-[60%]
              to-[#04ADF7] to-[100%]
              text-white shadow-xl flex flex-col"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="w-3 h-3 rounded-full bg-[#00FFFF] animate-pulse" />
                <span className="text-sm tracking-wide font-inter font-semibold text-[#00FFFF]">
                  ZECCO.ES AI ONLINE
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-manrope leading-snug mb-8">
                Your AI Property <br /> Specialist
              </h2>

              <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-30 blur-md" />
                <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-r from-[#4F46E5] to-[#34D399]">
                  <div className="w-full h-full rounded-full bg-[#00004B] flex items-center justify-center">
                    <Image
                      src={App_url.image.chat_logo}
                      alt="Chat"
                      width={60}
                      height={60}
                    />
                  </div>
                </div>

                <div className="absolute -top-2 -right-2 w-10 h-10 border border-white/20 bg-white/10 rounded-xl backdrop-blur-lg flex items-center justify-center">
                  <Zap size={22} className="text-yellow-400" />
                </div>
              </div>

              <p className="text-lg sm:text-xl font-manrope font-medium leading-relaxed mb-auto">
                Meet Zecco – your AI search agent, working for you to find the
                best property listings that match your criteria.
              </p>

              <button
                onClick={() => dispatch(setChatBadgeOpen(true))}
                className="mt-8 w-full sm:max-w-[70%]
                bg-white text-[#00004B]
                py-4 rounded-xl
                flex items-center justify-center gap-2
                font-manrope font-bold tracking-wider
                hover:bg-gray-100 transition"
              >
                INITIALIZE SEARCH
                <ArrowRight size={22} />
              </button>
            </div>

            <section className="w-full  lg:w-[60%]  bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="w-3 h-3 rounded-full bg-[#1155CC] animate-pulse" />
                    <span className="text-sm uppercase tracking-wide font-inter font-semibold text-[#9CA3AF]">
                      Expert Network
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#000023] font-manrope leading-snug mb-8">
                    Personal, Local <br /> Expertise
                  </h2>

                  <p className="text-[#6B7280] font-manrope font-medium text-base sm:text-lg max-w-md mb-10 sm:mb-16">
                    When you're ready to make a move, our network of elite
                    advisors handles the local nuances, legal complexities, and
                    final negotiations.
                  </p>

                  <div className="flex gap-4 flex-wrap">
                    <Link
                      href={App_url.link.CONTACT_US}
                      className="px-6 py-3 font-manrope font-bold flex items-center gap-4 bg-[#F9FAFB] text-heading_text_color rounded-xl text-sm"
                    >
                      <Headphones size={22} className="text-blue_color" />
                      Talk to Advisor
                      <ArrowRight size={22} />
                    </Link>

                    <Link
                      href={App_url.link.CONTACT_US}
                      className="px-6 py-3 font-manrope font-bold flex items-center gap-4 bg-[#F9FAFB] text-heading_text_color rounded-xl text-sm"
                    >
                      <MapPin size={22} className="text-emerald_green" />
                      Area Specialist
                      <ArrowRight size={22} />
                    </Link>
                  </div>
                </div>

                {/* IMAGE */}
                <div className="relative min-h-[280px] md:min-h-full bg-gradient-to-br from-orange-200 to-orange-50">
                  <Image
                    src={App_url.image.ai_expert}
                    alt="Advisor"
                    fill
                    className="object-cover object-[30%_center]"
                  />

                  <div
                    className="absolute inset-y-0 left-0 right-0
                    bg-gradient-to-r
                    from-white
                    via-transparent via-40%
                    to-transparent"
                  />

                  {/* STATS */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 space-y-3 z-10">
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue_color">
                        <Users size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-text_gray_color font-manrope font-bold tracking-widest">
                          ACTIVE ADVISORS
                        </p>
                        <p className="font-manrope font-extrabold tracking-wider text-heading_text_color">
                          42 Online Now
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald_green">
                        <ShieldCheck size={24} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-text_gray_color font-manrope font-bold tracking-widest">
                          Trust Rating
                        </p>
                        <p className="font-manrope font-extrabold tracking-wider text-heading_text_color">
                          9.9/10 Client <br /> Satisfaction
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

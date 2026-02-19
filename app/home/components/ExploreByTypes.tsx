import { App_url } from '@/constant/static'
import { clearBreadcrumbs, setBreadcrumbs } from '@/redux/modules/main/action'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

export default function ExploreByTypes() {

  const dispatch = useDispatch()
  const router = useRouter()

  const handleNavigate = (region: string) => {
    const slug = region
      .toLowerCase()
      .replace(/\s+/g, "-");
    dispatch(clearBreadcrumbs())
    dispatch(setBreadcrumbs([
      { label: "Home", href: "/" },
      { label: "Costa del Sol areas and Cities", href: App_url.link.COSTA_DEL_SOL },
      { label: region, href: `${App_url.link.COSTA_DEL_SOL}/${slug}` },
    ]))
    router.push(`${App_url.link.COSTA_DEL_SOL}/${slug}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#111C3A] to-[#16213E] py-10">

      {/* BACKGROUND BUILDING IMAGE */}
      <div className="absolute inset-0 lg:-top-52 lg:-left-72 w-full">
        <Image
          src={App_url.image.building}
          alt="Buildings"
          fill
          className="object-contain scale-125 brightness-0 invert opacity-30"
        />
      </div>

      {/* CONTENT */}
      <div className="relative lg:mx-10 px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <h2 className="text-3xl font-manrope font-semibold text-white">
            Explore By Types
          </h2>

          <p className="text-white/50 font-manrope text-lg max-w-[35rem] mt-4 md:mt-0">
            Discover properties tailored to your lifestyle, business needs, and investment goals across Spain.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CARD */}
          {[
            {
              title: "Existing Build",
              desc: "Apartments, villas, and <br/> townhouses for everyday living.",
              action: "Browse Existing Build",
              navigation_title: 'Under Construction'
            },
            {
              title: "Newly Build Projects",
              desc: "Offices, retail spaces, and business-ready properties.",
              action: "Browse Newly Build projects",
              navigation_title: 'New Property'
            },
            {
              title: "Investment",
              desc: "High-yield properties with strong rental and appreciation potential.",
              action: "Browse Investment",
              navigation_title: 'Commercial Property'
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 text-white hover:bg-white/10 transition"
            >
              <h3 className="text-lg font-manrope font-semibold tracking-wider mb-4">
                {item.title}
              </h3>

              <p className="text-md font-manrope font-medium text-slate_gray max-w-[19rem] mb-8">
                {item?.desc?.split("<br/>").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>

              <button onClick={() => handleNavigate(item?.navigation_title)} className="flex uppercase items-center gap-2 text-[0.7rem] font-manrope tracking-wider font-semibold text-white hover:text-[#38BDF8] transition">
                {item.action}
                <ArrowUpRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

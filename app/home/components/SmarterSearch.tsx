import Image from 'next/image'
import { Check, Zap } from 'lucide-react'
import { App_url } from '@/constant/static'
import { useRouter } from 'next/navigation'

export default function SmarterSearch() {
  const router = useRouter()
  return (
    <section className="relative overflow-hidden bg-[#0B1220]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#0E1B3C] to-[#1A140E]" />

      <div className="relative lg:mx-10 px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <div className="text-white">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3 py-2 rounded-full mb-6">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.377-2.454a1 1 0 00-1.176 0l-3.377 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
            NEW: MVP CLIENT PORTAL
          </span>

          <h1 className="text-4xl lg:text-4xl font-manrope font-semibold leading-loose lg:mb-4">
            A Smarter Way To
          </h1>
          <h1 className="text-4xl lg:text-4xl font-manrope font-semibold leading-loose mb-6">Manage Your Search</h1>

          <ul className="space-y-4 text-cool_gray mb-8">
            {[
              'Curate your own shortlist of dream homes.',
              'Get instant alerts for specific criteria.',
              'Smart matching based on your behavior.',
              'Secure documents and personal details.',
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                  <Check className="h-3 w-3 text-white" />
                </span>
                <span className="text-md font-manrope font-medium">{text}</span>
              </li>
            ))}
          </ul>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button onClick={() => router.push(App_url.link.SIGN_UP)} className="bg-[#2563EB] hover:bg-[#1D4ED8] transition text-white text-sm font-medium px-6 py-3 rounded-full">
              Register Free
            </button>

            <button onClick={() => router.push(App_url.link.SIGN_IN)} className="bg-white/10 hover:bg-white/20 transition text-white text-sm font-medium px-6 py-3 rounded-full">
              Login to Portal
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE + CARDS */}
        <div className="relative flex justify-center">
          <div className="backdrop-blur-2xl bg-white/10 rounded-2xl rotate-[4deg] w-full h-[450px] border border-white/40 flex justify-end items-center">
            <div className="relative w-[93%] h-[400px] -top-1 -rotate-[4deg] overflow-hidden shadow-2xl mr-3 ring-1 ring-white/10">
              <Image
                src={App_url.image.your_search}
                alt="Villa"
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="absolute max-md:-bottom-16 lg:bottom-0 lg:-left-6 bg-white rounded-2xl shadow-xl p-5 w-[290px]">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Zap size={18} className="text-[#D97706]" />
              </div>

              <div>
                <p className="text-xs tracking-wider font-inter font-medium text-[#94A3B8] mb-1">
                  AI RECOMMENDATION
                </p>
                <p className="text-md font-inter font-semibold text-[#000000]">
                  Villa Las Brisas
                </p>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="mt-4">
              <div className="h-6 w-full rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full w-[90%] bg-blue-600 rounded-full" />
              </div>
              <p className="mt-[1px] font-inter font-normal text-xs text-[#64748B]">
                90% Match with your saved preferences
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

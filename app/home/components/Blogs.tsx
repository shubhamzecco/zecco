import Image from 'next/image'
import BlogCard from './BlogCard'
import { App_url } from '@/constant/static'

const blogs = [
  {
    title: "Mallorca Living Guide",
    desc: "Discover luxury coastal lifestyles in the Balearic Islands",
    image: App_url.image.blog_image_1,
  },
  {
    title: "Barcelona Market Update",
    desc: "Latest trends in pricing, demand, and rental yields",
    image: App_url.image.blog_image_2
  },
  {
    title: "Digital Nomads in Spain",
    desc: "Best cities, visas, and homes for remote professionals",
    image: App_url.image.blog_image_3
  },
]

export default function Blogs() {
  return (
    <section className="py-14 bg-white">
      <div className="lg:mx-10 px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between mb-12">
          <h2 className="text-3xl font-manrope font-bold text-[#000000]">
            Blogs & Insights
          </h2>

          <p className="text-slate_gray font-medium font-manrope text-md max-w-lg mt-4 md:mt-0">
            Stay informed with Spain’s property trends, legal updates, and investment guides.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {blogs.map((blog, index) => (
            <div
              key={index}
              className="group relative h-[440px] overflow-hidden shadow-sm"
            >
              {/* IMAGE */}
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* DARK OVERLAY */}
              {/* <div className="absolute inset-0 bottom-0  bg-gradient-to-t from-[#020617]/60 via-[#020617]/40 to-transparent" /> */}
              {/* LEFT WHITE SHADOW / FADE */}
              <div
                className="absolute inset-y-0 left-0 right-0
                        bg-gradient-to-t
                        from-[#172131]
                        via-[#172131] via-15%
                        to-transparent
                        pointer-events-none select-none"
              />

              {/* CONTENT */}
              <div className="absolute bottom-0 p-6 text-center w-full">
                <h3 className="text-lg font-manrope font-semibold text-white mb-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-center font-manrope font-normal max-w-[18rem] mx-auto text-white/60 leading-relaxed">
                  {blog.desc}
                </p>
              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

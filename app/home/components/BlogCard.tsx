import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface BlogCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  date: string
  category: string
}

export default function BlogCard({ title, excerpt, image, date, category }: BlogCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-all cursor-pointer">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{category}</span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{excerpt}</p>

        {/* CTA */}
        <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
          <span>Read Article</span>
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  )
}

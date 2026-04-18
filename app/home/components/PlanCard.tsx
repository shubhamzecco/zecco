import { Check } from 'lucide-react'

interface PlanCardProps {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  ctaText?: string
}

export default function PlanCard({
  name,
  price,
  description,
  features,
  popular = false,
  ctaText = 'Get Started',
}: PlanCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 transition-all ${
        popular
          ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-xl scale-105'
          : 'bg-white border border-gray-200 text-gray-900'
      }`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="mb-4 inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Most Popular
        </div>
      )}

      {/* Plan Name */}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>

      {/* Description */}
      <p className={`text-sm mb-6 ${popular ? 'text-blue-100' : 'text-gray-600'}`}>{description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className={popular ? 'text-blue-100' : 'text-gray-600'}> /month</span>
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
          popular
            ? 'bg-white text-blue-600 hover:bg-blue-50'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {ctaText}
      </button>

      {/* Features List */}
      <div className="space-y-4">
        <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
          popular ? 'text-blue-100' : 'text-gray-600'
        }`}>
          What's included
        </p>
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check size={20} className={popular ? 'text-white' : 'text-blue-600'} />
            <span className={`text-sm ${popular ? 'text-blue-50' : 'text-gray-700'}`}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

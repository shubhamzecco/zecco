import { AlertCircle, CheckCircle, Landmark, Map, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react'
import PricingChart from './Chart'

export function AIMarketIntelligence() {
  return (
    <div className="mb-8 bg-[#fafafa] border border-[#F3F4F6] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg lg:text-xl font-bold font-manrope whitespace-nowrap">AI Market Intelligence</h2>
        <span className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full">Live Analysis</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#F3F4F6]">
          <p className="text-sm text-[#136AED] mb-1 font-manrope font-bold uppercase flex items-center">
            <span><Map className="w-5 h-5 inline mr-2" /></span>
            Sub-district avg
          </p>
          <p className="text-2xl font-bold text-heading_text_color flex items-center gap-1 mb-1">€9,850 <span className='text-[15px] mt-[6px] text-[#9CA3AF] font-manrope font-bold'>/m²</span></p>
          <p className='font-manrope font-medium text-[#9CA3AF] text-xs'>Based on 240 recent sales in Marbella</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#F3F4F6]">
          <p className="text-sm text-[#059669] mb-1 font-manrope font-bold uppercase flex items-center">
            <span><TrendingUp className="w-5 h-5 inline mr-2" /></span>
            Investment Grade
          </p>
          <p className="text-2xl font-bold text-[#059669] flex items-center gap-1 mb-1">AAA+ </p>
          <p className='font-manrope font-medium text-[#9CA3AF] text-xs'>Top 1% value opportunity in Marbella</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border border-[#F3F4F6]">
          <p className="text-sm text-[#EA580C] mb-1 font-manrope font-bold uppercase flex items-center">
            <span><Landmark className="w-5 h-5 inline mr-2" /></span>
            Area Demand
          </p>
          <p className="text-2xl font-bold text-heading_text_color flex items-center gap-1 mb-1">Extreme</p>
          <p className='font-manrope font-medium text-[#9CA3AF] text-xs'>Avg. time on market: 12 days</p>
        </div>
      </div>

      {/* Pricing Chart */}
      <div className="bg-white lg:p-6  rounded-xl mb-6">
        <div className="flex max-md:flex-col max-md:p-6 items-center justify-between">
          <h3 className="font-bold text-heading_text_color text-md lg:text-lg mb-4 font-manrope">Pricing Trajectory</h3>
          <p className='font-manrope font-medium text-[#9CA3AF] text-sm'>Avg. Price / m²</p>
        </div>
        <div className="h-48 flex items-end justify-between gap-2 lg:px-4 mt-20">
          <PricingChart />
        </div>
      </div>

      {/* Advantages & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h4 className="font-manrope font-bold text-[#059669] text-md mb-3 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 -mt-[2px]" />
            Strategic Advantages
          </h4>
          <ul className="list-disc pl-5 text-[15px] font-manrope font-medium text-[#64748B] space-y-2 marker:text-green-500 marker:h-2">
            <li>Massive arbitrage: Property is priced 80% below Marbella market average.</li>
            <li>Salamanca district has the highest rental demand in continental Spain.</li>
            <li>Asset appreciation in this specific block is +15% YoY.</li>
          </ul>

        </div>
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h4 className="font-manrope font-bold text-[#DC2626] text-md mb-3 flex items-center gap-2">
            <ThumbsDown className="w-5 h-5 mt-[4px]" />
            Market Risks
          </h4>
          <ul className="list-disc pl-5 text-[15px] font-manrope font-medium text-[#64748B] space-y-2 marker:text-[#F87171] marker:h-2">
            <li>Possible urgent sale status (Verify for hidden liabilities).</li>
            <li>Marbella noise levels can be high on lower exterior floors.</li>
            <li>IBI (Property Tax) in this district is among Marbella highest.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

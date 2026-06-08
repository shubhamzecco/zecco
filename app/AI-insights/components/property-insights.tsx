import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { formatEuro } from "@/utils/common";
import { Check, TrendingUp } from "lucide-react";

export default function PropertyInsights() {
  const { mainReducer } = usePosterReducers();
  return (
    <section>
      <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">
        Analyzing Property Details
      </h2>
      <div className="w-full max-w-6xl mx-auto font-[Inter,system-ui]">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Investment Potential */}
          <div className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="text-blue-500" />
              </div>
              <h3 className="font-bold font-manrope text-heading_text_color text-lg lg:text-xl">
                Investment Potential
              </h3>
            </div>

            <p className="text-sm tracking-wider font-manrope font-bold text-[#64748B] mb-2">
              Why This Fits You
            </p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                style={{ width: `${mainReducer?.ai_insight?.growth_percent}%` }}
                className={`h-full w-[${mainReducer?.ai_insight?.growth_percent}%] bg-blue-600 rounded-full`}
              />
            </div>
            <p className="text-sm font-manrope font-semibold text-heading_text_color mb-5">
              {mainReducer?.ai_insight?.growth_score} / 10 -{" "}
              {mainReducer?.ai_insight?.growth_label}
            </p>

            <p className="text-sm tracking-wider font-manrope font-bold text-[#64748B] mb-2">
              Rental Yield Potential
            </p>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                style={{
                  width: `${mainReducer?.ai_insight?.rental_yield_percent}%`,
                }}
                className={`h-full w-[${mainReducer?.ai_insight?.rental_yield_percent}%] bg-blue-600 rounded-full`}
              />
            </div>
            <p className="text-sm font-manrope font-semibold text-heading_text_color mb-5">
              {mainReducer?.ai_insight?.rental_yield} / 10 -{" "}
              {mainReducer?.ai_insight?.rental_yield_label}
            </p>

            <div className="pt-4 border-t">
              <p className="text-sm tracking-wider font-manrope font-bold text-heading_text_color mb-2">
                Recommendation:
              </p>
              <p className="text-sm font-manrope  font-medium text-[#64748B]">
                Excellent for long-term investment and capital appreciation
              </p>
            </div>
          </div>

          {/* Market Insights */}
          <div className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="text-blue-500" />
              </div>
              <h3 className="font-bold font-manrope text-heading_text_color text-lg lg:text-xl">
                Area Insights
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B] font-manrope font-semibold">
                  Price per m²:
                </span>
                <span className="font-bold text-heading_text_color font-manrope">
                  {formatEuro(mainReducer?.ai_insight?.price_per_sqm || 0)} m²
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B] font-manrope font-semibold">
                  Area Average:
                </span>
                <span className="font-bold text-heading_text_color font-manrope">
                  {formatEuro(mainReducer?.ai_insight?.area_avg_price_sqm || 0)} m²
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-t-2 border-b-2">
                <span className="text-[#64748B] font-manrope font-semibold">
                  Status
                </span>
                <span className="flex font-manrope items-center gap-1 text-[#16A34A] font-bold">
                  <Check className="" size={20} /> Below Average
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B] font-manrope font-semibold">
                  Average Rent:
                </span>
                <span className="font-bold text-heading_text_color font-manrope">
                 {formatEuro(mainReducer?.ai_insight?.average_rent_monthly || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B] font-manrope font-semibold">
                  Future Growth 5 Years:
                </span>
                <span className="font-bold text-heading_text_color font-manrope">
                  {mainReducer?.ai_insight?.growth_percent_5yr || 0} %
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#64748B] font-manrope font-semibold">
                  Age of Property:
                </span>
                <span className="font-bold text-heading_text_color font-manrope">
                  {mainReducer?.ai_insight?.age_of_property || 0} years
                </span>
              </div>
            </div>

            <p className="text-md font-manrope font-medium text-[#64748B] mt-6 leading-relaxed">
              This property is positioned competitively in the Manhattan market
              with strong growth potential.
            </p>
          </div>
        </div>

        {/* Property Summary */}
        <div className="">
          <h3 className="font-bold text-lg mb-4 font-inter text-[#111827]">
            Property Summary
          </h3>

          <ul className="space-y-3 text-sm bg-white rounded-2xl p-6 shadow-sm">
            {Object.entries(
              mainReducer?.ai_insight?.ai_report?.ai_summary || {},
            ).map(([key, value], i) => {
              const formattedTitle = key
                .replace(/[_-]/g, " ") // remove _ and -
                .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize words

              return (
                <li key={i} className="flex gap-2 items-center">
                  <span className="text-[#059669] mt-0.5 border-2 border-[#059669] rounded-full p-[2px]">
                    <Check size={15} />
                  </span>

                  <span className="font-inter font-medium text-[#64748B]">
                    <span className="font-bold font-inter text-[#111827]">
                      {formattedTitle}:
                    </span>{" "}
                    {value}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

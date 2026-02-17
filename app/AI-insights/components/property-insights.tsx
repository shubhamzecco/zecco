import { Check, TrendingUp } from "lucide-react";

export default function PropertyInsights() {
    return (
        <section>
            <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">Analyzing Property Details</h2>
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

                        <p className="text-sm tracking-wider font-manrope font-bold text-[#64748B] mb-2">Why This Fits You</p>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div className="h-full w-[85%] bg-blue-600 rounded-full" />
                        </div>
                        <p className="text-sm font-manrope font-semibold text-heading_text_color mb-5">
                            8.5/10 – High Growth Area
                        </p>

                        <p className="text-sm tracking-wider font-manrope font-bold text-[#64748B] mb-2">Rental Yield Potential</p>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div className="h-full w-[78%] bg-blue-600 rounded-full" />
                        </div>
                        <p className="text-sm font-manrope font-semibold text-heading_text_color mb-5">
                            7.8% – Strong Returns
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
                                Market Insights
                            </h3>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[#64748B] font-manrope font-semibold">Price per sq ft:</span>
                                <span className="font-bold text-heading_text_color font-manrope">$714/sqft</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-[#64748B] font-manrope font-semibold">Area Average:</span>
                                <span className="font-bold text-heading_text_color font-manrope">$715/sqft</span>
                            </div>

                            <div className="flex justify-between items-center py-3 border-t-2 border-b-2">
                                <span className="text-[#64748B] font-manrope font-semibold">Status</span>
                                <span className="flex font-manrope items-center gap-1 text-[#16A34A] font-bold">
                                    <Check className="" size={20} /> Below Average
                                </span>
                            </div>
                        </div>

                        <p className="text-md font-manrope font-medium text-[#64748B] mt-6 leading-relaxed">
                            This property is positioned competitively in the Manhattan
                            market with strong growth potential.
                        </p>
                    </div>
                </div>

                {/* Property Summary */}
                <div className="">
                    <h3 className="font-bold text-lg mb-4 font-inter text-[#111827]">
                        Property Summary
                    </h3>

                    <ul className="space-y-3 text-sm bg-white rounded-2xl p-6 shadow-sm">
                        {[
                            "Strong Location: Excellent schools and amenities nearby",
                            "Recent Construction: Modern amenities and smart home features",
                            "Market Demand: High buyer interest in this area",
                            "Future Growth: Projected 12% appreciation over 5 years",
                        ].map((item, i) => {
                            const [title, description] = item.split(":");

                            return (
                                <li key={i} className="flex gap-2 items-center">
                                    <span className="text-[#059669] mt-0.5 border-2 border-[#059669] rounded-full p-[2px]">
                                        <Check size={15} />
                                    </span>

                                    <span className="font-inter font-medium text-[#64748B]">
                                        <span className="font-bold font-inter text-[#111827]">
                                            {title}:
                                        </span>{" "}
                                        {description}
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

"use client";

const data = [
    {
        title: "100%",
        heading: "Listing Verification",
        desc: "Zero fraud risk—every property is triple-checked by legal experts.",
    },
    {
        title: "24/7",
        heading: "Human Support",
        desc: "Consultative agents focused on your long-term success, not just sales.",
    },
    {
        title: "AI+",
        heading: "Predictive Analytics",
        desc: "Data-driven insights to predict appreciation and rental yields.",
    },
    {
        title: "€0",
        heading: "Zecco AI Assistance",
        desc: "Full cost transparency on commissions, taxes, and legal fees from day one.",
    },
];

export default function WhyChooseZecco() {
    return (
        <section className="bg-[#F8FAFC] py-16">
            <div className="max-w-7xl mx-auto px-4">

                <h2 className="text-center font-manrope text-4xl font-semibold text-black">
                    Why Choose Zecco?
                </h2>
                <p className="text-center font-manrope font-normal mt-3 text-[#333333]">
                    A seamless journey from browsing to keys in hand, powered by data and expertise.
                </p>

                <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-10">
                    {data.map((item, index) => {
                        const isFirst = index === 0;
                        const isLast = index === data.length - 1;

                        return (
                            <div key={index}>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl font-manrope font-bold text-[#333333] whitespace-nowrap">
                                        {item.title}
                                    </span>
                                    {!isLast && (
                                        <div className="w-5 h-[2px] bg-gray-200"></div>
                                    )}

                                    {!isLast && (
                                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                                    )}
                                    {!isLast && (
                                        <div className="flex-1 h-[2px] bg-gray-200"></div>
                                    )}
                                </div>

                                <h4 className="text-lg font-manrope font-bold text-[#333333]">
                                    {item.heading}
                                </h4>
                                <p className="mt-2 font-manrope font-normal text-sm text-[#333333] leading-relaxed">
                                    {item.desc}
                                </p>

                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

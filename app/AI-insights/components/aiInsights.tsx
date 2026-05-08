import { App_url } from '@/constant/static';
import { Property } from '@/redux/modules/main/types';
import { ArrowRight, Bath, BedSingle, Cpu, Expand, FileText, Search } from 'lucide-react';
import Image from 'next/image';

type AiInsightsProps = {
    property : Property
    onGetStarted: () => void;
};

const AiInsights = ({ onGetStarted , property}: AiInsightsProps) => {
    return (
        <section className=" mb-6">
            <h2 className="font-bold text-lg mb-4 font-inter text-[#111827]">AI Insights</h2>
            <div className="flex flex-col gap-6">
                <div className="bg-white/70 rounded-2xl relative">
                    <div className="lg:flex items-start gap-3">
                        <div className="lg:h-32 max-md:h-52">
                            <Image
                                src={property?.images?.[0]}
                                alt="AI Insights"
                                width={160}
                                height={100}
                                className="lg:rounded-l-2xl max-md:rounded-t-2xl max-md:w-full object-cover max-md:h-52 lg:h-32"
                            />
                
                        </div>
                        <div className="flex flex-col gap-1 max-md:mb-5">
                            <h2 className='font-bold text-lg font-manrope px-4 pt-4 text-[#64748B]'>€{property?.salePrice}</h2>
                            <h1 className="font-bold text-md font-inter px-4 pt-1 text-[#111827]">Stylish {property?.bedrooms}-Bedroom {property?.propertyCategory} in {property?.city?.name} , {property?.country}</h1>
                            <div className="flex gap-5 items-center pt-2 px-4 text-sm">
                                <div className="flex font-manrope font-normal items-center gap-1">
                                    <Expand size={18} className="text-gray-400" />
                                    <span>{property?.mtsBuild} /m²</span>
                                </div>

                                <div className="flex font-manrope font-normal items-center gap-1">
                                    <BedSingle size={18} className="text-gray-400" />
                                    <span>{property?.bedrooms} Bed</span>
                                </div>
                                <div className="flex font-manrope font-normal items-center gap-1">
                                    <Bath size={18} className="text-gray-400" />
                                    <span>{property?.bathrooms} Bath</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 my-5">
                <div className="bg-white rounded-lg p-4 flex items-start gap-4 ">
                    <div className="bg-[#4A86E8] p-2 rounded-xl flex items-center justify-center w-16 h-16">
                        <Search size={25} className="text-white " />
                    </div>
                    <div className="w-[80%]">
                        <h1 className="font-bold text-md font-inter text-[#111827]">1. Select Property</h1>
                        <p className='font-inter font-medium text-[#4B5563] text-sm'>Choose a property based on your location, budget, and preferences.</p>
                    </div>
                </div>
                <div className="bg-white rounded-lg p-4 flex items-start gap-4 ">
                    <div className="bg-[#4A86E8] p-2 rounded-xl flex items-center justify-center w-16 h-16">
                        <Cpu size={25} className="text-white " />
                    </div>
                    <div className="w-[80%]">
                        <h1 className="font-bold text-md  font-inter text-[#111827]">2. AI Analysis</h1>
                        <p className='font-inter font-medium text-[#4B5563] text-sm'>Our AI processes property details using market trends, pricing data, and comparable properties.</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg p-4 flex items-start gap-4 ">
                <div className="bg-[#4A86E8] p-2 rounded-xl flex items-center justify-center w-16 h-16">
                    <FileText size={25} className="text-white " />
                </div>
                <div className="w-[80%]">
                    <h1 className="font-bold text-md  font-inter text-[#111827]">3. Property Analysis Report</h1>
                    <p className='font-inter font-medium text-[#4B5563] text-sm'>Receive a personalized AI-powered report with valuation, investment insights, and market recommendations.</p>
                </div>
            </div>

            <button onClick={onGetStarted} className="w-fit px-10 tracking-wider shadow-md my-4 bg-[#111827] text-white text-[15px] py-2.5 rounded-[10px] font-inter font-extrabold flex items-center gap-2">
                Get Started <ArrowRight size={18} className="ml-2" />
            </button>
        </section>
    )
}

export default AiInsights

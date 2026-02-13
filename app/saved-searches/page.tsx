import SidebarLayout from '@/components/layouts/sidebar-layout'
import { savedSearchesData } from '@/utils/common'
import { LayoutGrid } from 'lucide-react'
import Image from 'next/image'

const SavedSearches = () => {
    return (
        <SidebarLayout>
            <div className="px-12  py-12 h-full
                            bg-gradient-to-r
                        from-[#60A5FA]/10
                        via-[#fafafa] via-[70%]
                        to-[#fafafa] to-[100%]">
                <section className="mt-5 mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="font-bold text-xl mb-4 font-inter text-[#111827]">Saved Searches</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
                        {savedSearchesData?.map((search) => (
                            <div key={search?.id} className="bg-white/70 rounded-2xl relative">
                                <div className=" bg-[#EEF2FF] border border-[#E0E7FF] rounded-full px-3 py-1 absolute top-3 right-4 flex items-center gap-1">
                                    <p className='font-manrope font-semibold text-[#2563EB] text-[11px]'>Apartment</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="">
                                        <Image
                                            src={search?.image}
                                            alt="AI Insights"
                                            width={140}
                                            height={150}
                                            className="rounded-l-2xl object-cover"
                                        />
                                    </div>
                                    <div className="mt-5">
                                        <h1 className="font-bold text-lg font-inter px-4 pt-4 text-[#111827]">{search?.title}</h1>
                                        <div className="flex gap-5 items-center pt-2 px-4 text-sm">
                                            <div className="flex font-inter font-medium items-center gap-1 text-[#4B5563]">
                                                {search?.description}
                                            </div>
                                        </div>
                                        <div className="flex font-manrope font-normal items-center gap-1 pt-2 px-4">
                                            <LayoutGrid size={18} className="text-gray-400" />
                                            <span>{search?.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </SidebarLayout>
    )
}

export default SavedSearches

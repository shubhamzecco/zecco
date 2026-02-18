// "use client"
// import { propertyData } from '@/app/zecco-favorites/page';
// import PropertyCard from '@/components/cards/PropertyCard';
// import MainLayout from '@/components/layouts/main-layout';
// import FilterPanel from './components/filter-panel';
// import { useEffect, useRef, useState } from 'react';

// const Page = () => {
//     const gridRef = useRef<HTMLDivElement>(null);
//     const [gridHeight, setGridHeight] = useState<number>(0);


//     const handleFilterChange = (filters: any) => {
//         console.log('Filters applied:', filters);
//     };

//     useEffect(() => {
//         if (gridRef.current) {
//             setGridHeight(gridRef.current.offsetHeight);
//         }
//     }, [propertyData]);


//     return (
//         <MainLayout isBreadcrumb isFilter isPropertyType isProperty propertyCount={propertyData?.length}>
//             <div className="lg:mx-7 lg:pb-10 px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-start gap-4 h-full overflow-y-auto">
//                     <div className="" style={{ height: gridHeight || "auto" }}>
//                         <FilterPanel onFilterChange={handleFilterChange} />
//                     </div>
//                     <div  ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//                         {propertyData?.map((property) => (
//                             <PropertyCard key={property.id} {...property} />
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </MainLayout>
//     )
// }

// export default Page


"use client";

import { propertyData } from "@/app/zecco-favorites/page";
import PropertyCard from "@/components/cards/PropertyCard";
import MainLayout from "@/components/layouts/main-layout";
import FilterPanel from "./components/filter-panel";
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const Page = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [gridHeight, setGridHeight] = useState<number>(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleFilterChange = (filters: any) => {
        console.log("Filters applied:", filters);
    };

    useEffect(() => {
        if (gridRef.current) {
            setGridHeight(gridRef.current.offsetHeight);
        }
    }, [propertyData]);

    return (
        <MainLayout
            isBreadcrumb
            isFilter
            isPropertyType
            isProperty
            propertyCount={propertyData?.length}
        >
            <div className="lg:mx-7 lg:pb-10 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-4 lg:hidden">
                    <div className="">
                        <p className='font-manrope block lg:hidden font-semibold text-black'>{propertyData?.length} results in drawn area</p>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-btn_color text-white text-sm font-medium"
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                    </button>
                </div>

                <div className="flex items-start gap-4">
                    <div
                        className="hidden lg:block"
                        style={{ height: gridHeight || "auto" }}
                    >
                        <FilterPanel onFilterChange={handleFilterChange} />
                    </div>

                    {/* 🔹 Property Grid */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full"
                    >
                        {propertyData?.map((property) => (
                            <PropertyCard key={property.id} {...property} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 🔹 Mobile Filter Drawer */}
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={() => setIsFilterOpen(false)}
            />
            <div
                className={`fixed top-0 left-0 z-50 mt-[4.7rem] h-full w-[85%] max-w-sm bg-white transform transition-transform duration-300 ease-in-out lg:hidden
        ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex items-center bg-gray-50 justify-between p-4 border-b">
                    <h2 className="text-lg font-manrope font-semibold">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <div className="h-[calc(100%-180px)] overflow-y-auto">
                    <FilterPanel onFilterChange={handleFilterChange} />
                </div>
            </div>
        </MainLayout>
    );
};

export default Page;


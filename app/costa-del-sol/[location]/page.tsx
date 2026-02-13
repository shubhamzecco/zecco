"use client"
import { propertyData } from '@/app/zecco-favorites/page';
import PropertyCard from '@/components/cards/PropertyCard';
import MainLayout from '@/components/layouts/main-layout';
import FilterPanel from './components/filter-panel';
import { useEffect, useRef, useState } from 'react';

const Page = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [gridHeight, setGridHeight] = useState<number>(0);


    const handleFilterChange = (filters: any) => {
        console.log('Filters applied:', filters);
    };

    useEffect(() => {
        if (gridRef.current) {
            setGridHeight(gridRef.current.offsetHeight);
        }
    }, [propertyData]);


    return (
        <MainLayout isBreadcrumb isFilter isPropertyType isProperty propertyCount={propertyData?.length}>
            <div className="lg:mx-7 lg:pb-10 px-4 sm:px-6 lg:px-8">
                <div className="flex items-start gap-4 h-full overflow-y-auto">
                    <div className="" style={{ height: gridHeight || "auto" }}>
                        <FilterPanel onFilterChange={handleFilterChange} />
                    </div>
                    <div  ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {propertyData?.map((property) => (
                            <PropertyCard key={property.id} {...property} />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default Page

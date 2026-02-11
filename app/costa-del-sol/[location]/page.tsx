"use client"
import { propertyData } from '@/app/zecco-favorites/page';
import PropertyCard from '@/components/cards/PropertyCard';
import MainLayout from '@/components/layouts/main-layout';
import FilterPanel from './components/filter-panel';

const Page = () => {

    const handleFilterChange = (filters: any) => {
        console.log('Filters applied:', filters);
    };

 
    return (
        <MainLayout isBreadcrumb isFilter>
            <div className="lg:mx-7 lg:pb-10 px-4 sm:px-6 lg:px-8">
                <div className="flex items-start gap-4 h-full overflow-y-auto">
                    <div className="">
                        <FilterPanel onFilterChange={handleFilterChange} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PropertyMap } from './map';
import { useWebSocket } from '@/api/socket/WebSocketContext';
import { usePosterReducers } from '@/redux/getdata/usePostReducer';

interface FilterPanelProps {
    onFilterChange?: (filters: any) => void;
}

type FiltersState = {
    propertyType: string;
    priceMin: string;
    priceMax: string;
    sizeMin: string;
    sizeMax: string;

    typeOfHome: Record<string, boolean>;
    propertyStatus: Record<string, boolean>;
    bedrooms: Record<string, boolean>;
    condition: Record<string, boolean>;
    moreFilters: Record<string, boolean>;
    floor: Record<string, boolean>;
    multimedia: Record<string, boolean>;
    publicationDate: Record<string, boolean>;
};


type CheckboxGroup =
    | 'typeOfHome'
    | 'propertyStatus'
    | 'bedrooms'
    | 'condition'
    | 'moreFilters'
    | 'floor'
    | 'multimedia'
    | 'publicationDate';


export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [filters, setFilters] = useState<FiltersState>({
        propertyType: 'Flat / Apartment',
        priceMin: '',
        priceMax: '',
        sizeMin: '',
        sizeMax: '',
        typeOfHome: { all: true },
        propertyStatus: { bareOwnership: true },
        bedrooms: {},
        condition: {},
        moreFilters: {},
        floor: {},
        multimedia: {},
        publicationDate: {},
    });
    const { mainReducer } = usePosterReducers()
    const handleInputChange = (field: string, value: string) => {
        const updated = { ...filters, [field]: value };
        setFilters(updated);
        onFilterChange?.(updated);
    };

    const handleCheckboxChange = (
        category: CheckboxGroup,
        option: string,
        checked: boolean
    ) => {
        const updated: FiltersState = {
            ...filters,
            [category]: {
                ...filters[category],
                [option]: checked,
            },
        };

        setFilters(updated);
        onFilterChange?.(updated);
    };

    return (
        <div className="w-full bg-[#F8FAFC] rounded-lg h-full overflow-y-auto">
            <div className="w-full h-96 p-1">
                <PropertyMap />
            </div>
            <div className="p-6 space-y-6">
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Property type
                    </Label>
                    <div className="relative">
                        <select
                            value={filters.propertyType}
                            onChange={(e) => handleInputChange('propertyType', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            {mainReducer?.property_type_list?.map((type) => (
                                <option key={type.id} value={type?.name}>{type.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Price
                    </Label>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="Min"
                                    value={filters.priceMin}
                                    onChange={(e) => handleInputChange('priceMin', e.target.value)}
                                    className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    €
                                </span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="Max"
                                    value={filters.priceMax}
                                    onChange={(e) => handleInputChange('priceMax', e.target.value)}
                                    className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    €
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Size */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Size
                    </Label>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="Min"
                                    value={filters.sizeMin}
                                    onChange={(e) => handleInputChange('sizeMin', e.target.value)}
                                    className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    sq ft
                                </span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="Max"
                                    value={filters.sizeMax}
                                    onChange={(e) => handleInputChange('sizeMax', e.target.value)}
                                    className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    sq ft
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Type of Home */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Type of home
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'flats', label: 'Flats, Penthouse and Duplexes' },
                            { id: 'townhouse', label: 'Townhouse' },
                            { id: 'villa', label: 'Villa' },
                            { id: 'countryhouse', label: 'Country house' },
                            { id: 'fincaland', label: 'Finca Land' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.typeOfHome[item.id as keyof typeof filters.typeOfHome] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('typeOfHome', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Status of Property */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Current status of the property
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'available', label: 'Available, without any of the previous restrictions' },
                            { id: 'bareOwnership', label: 'Bare Ownership' },
                            { id: 'rented', label: 'Rented, with tenants' },
                            { id: 'illegally', label: 'Illegally Occupied' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.propertyStatus[item.id as keyof typeof filters.propertyStatus] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('propertyStatus', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bedrooms */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Bedrooms
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'studio', label: '0 Bedrooms (Studio flats)' },
                            { id: '1bed', label: '1 Bedrooms' },
                            { id: '2bed', label: '2 Bedrooms' },
                            { id: '3bed', label: '3 or more Bedrooms' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.bedrooms[item.id as keyof typeof filters.bedrooms] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('bedrooms', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Condition */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Condition
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'new', label: 'New Homes' },
                            { id: 'good', label: 'Good Condition' },
                            { id: 'renovate', label: 'Need Renovating' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.condition[item.id as keyof typeof filters.condition] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('condition', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* More Filters */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        More filters
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'ac', label: 'Air conditioning' },
                            { id: 'lift', label: 'Lift' },
                            { id: 'balcony', label: 'Balcony' },
                            { id: 'terrace', label: 'Terrace' },
                            { id: 'garden', label: 'Garden' },
                            { id: 'parking', label: 'Parking Space' },
                            { id: 'pool', label: 'Swimming Pool' },
                            { id: 'storage', label: 'Storage Room' },
                            { id: 'seaview', label: 'Sea View' },
                            { id: 'furnished', label: 'Fully Furnished' },
                            { id: 'semifurnished', label: 'Semi Furnished' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.moreFilters[item.id as keyof typeof filters.moreFilters] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('moreFilters', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floor */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Floor
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'top', label: 'Top floor' },
                            { id: 'middle', label: 'Middle floors' },
                            { id: 'ground', label: 'Ground floor' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.floor[item.id as keyof typeof filters.floor] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('floor', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Multimedia */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Multimedia
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'floorplan', label: 'With floor plan' },
                            { id: 'virtualtour', label: 'With a virtual tour' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.multimedia[item.id as keyof typeof filters.multimedia] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('multimedia', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Publication Date */}
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Publication date
                    </Label>
                    <div className="space-y-2.5">
                        {[
                            { id: 'indifferent', label: 'Indifferent' },
                            { id: 'last48', label: 'Last 48 hours' },
                            { id: 'lastweek', label: 'Last week' },
                            { id: 'lastmonth', label: 'Last month' },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.publicationDate[item.id as keyof typeof filters.publicationDate] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('publicationDate', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={item.id} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

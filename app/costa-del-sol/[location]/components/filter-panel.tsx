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
    types: Record<number, boolean>;
    propertyStatus: Record<string, boolean>;
    condition: Record<string, boolean>;
    moreFilters: Record<string, boolean>;
    floor: Record<string, boolean>;
    multimedia: Record<string, boolean>;
    publicationDate: Record<string, boolean>;
    bedroomsFrom: number | null;
    bedroomsTo: number | null;
};


type CheckboxGroup =
    | 'types'
    | 'propertyStatus'
    | 'condition'
    | 'moreFilters'
    | 'floor'
    | 'multimedia'
    | 'publicationDate';


const filterList = [
    { id: 1, label: "Front line golf", value: "FrontLineGolf" },
    { id: 2, label: "Front line beach", value: "FrontLineBeach" },
    { id: 3, label: "Mountainside", value: "MountaInSide" },
    { id: 4, label: "Amenities near", value: "AmenitiesNear" },
    { id: 5, label: "Transport near", value: "TransportNear" },
    { id: 6, label: "Air conditioning", value: "Airconditioning" },
    { id: 7, label: "Central heating", value: "CentralHeating" },
    { id: 8, label: "Partly furnished", value: "PartlyFurnished" },
    { id: 9, label: "Fully furnished", value: "FullyFurnished" },
    { id: 10, label: "Fully fitted kitchen", value: "FullyFittedKitchen" },
    { id: 11, label: "Utility room", value: "UtilityRoom" },
    { id: 12, label: "Fireplace", value: "FirePlace" },
    { id: 13, label: "Marble floors", value: "MarbleFloors" },
    { id: 14, label: "Jacuzzi", value: "Jacuzzi" },
    { id: 15, label: "Sauna", value: "Sauna" },
    { id: 16, label: "Satellite TV", value: "SatelliteTV" },
    { id: 17, label: "Basement", value: "Basement" },
    { id: 18, label: "Solar panels", value: "SolarPanels" },
    { id: 19, label: "Guest room", value: "GuestRoom" },
    { id: 20, label: "Storage room", value: "StorageRoom" },
    { id: 21, label: "Gym", value: "Gym" },
    { id: 22, label: "Alarm", value: "Alarm" },
    { id: 23, label: "Solarium", value: "Solarium" },
    { id: 24, label: "Security entrance", value: "SecurityEntrance" },
    { id: 25, label: "Double glazing", value: "DoubleGlazing" },
    { id: 26, label: "Video entrance", value: "VideoEntrance" },
    { id: 27, label: "Brand new", value: "BrandNew" },
    { id: 28, label: "Dining room", value: "DiningRoom" },
    { id: 29, label: "Barbecue", value: "Barbecue" },
    { id: 30, label: "Security service 24h", value: "SecurityService24h" },
    { id: 31, label: "Telephone", value: "Telephone" },
    { id: 32, label: "Guest toilet", value: "GuestToilet" },
    { id: 33, label: "Private terrace", value: "PrivateTerrace" },
    { id: 34, label: "Kitchen equipped", value: "KitchenEquipped" },
    { id: 35, label: "Living room", value: "LivingRoom" },
    { id: 36, label: "Study room", value: "StudyRoom" },
    { id: 37, label: "Water tank", value: "WaterTank" },
    { id: 38, label: "Parquet floors", value: "ParquetFloors" },
    { id: 39, label: "Wall-to-wall carpet", value: "WallToWallCarpet" },
    { id: 40, label: "Separate apartment", value: "SeparateApartment" },
    { id: 41, label: "Sea view", value: "SeaView" },
    { id: 42, label: "Country view", value: "CountryView" },
    { id: 43, label: "Mountain view", value: "MountainView" },
    { id: 44, label: "Golf view", value: "Golfview" },
    { id: 45, label: "Indoor pool", value: "InDoorPool" },
    { id: 46, label: "Heated pool", value: "HeatedPool" },
    { id: 47, label: "Underfloor heating (throughout)", value: "UnderFloorHeating" },
    { id: 48, label: "Automatic irrigation system", value: "AutomaticIrrigationSystem" },
    { id: 49, label: "Security shutters", value: "SecurityShutters" },
    { id: 50, label: "Smart home system", value: "HomeAutomationSystem" },
    { id: 51, label: "Dolby Stereo Surround system", value: "DolbyStereoSurroundSystem" },
    { id: 52, label: "Bars", value: "Bars" },
    { id: 53, label: "Laundry room", value: "LaundryRoom" },
    { id: 54, label: "Internet - Wifi", value: "InternetWifi" },
    { id: 55, label: "Covered terrace", value: "CoveredTerrace" },
    { id: 56, label: "24h Service", value: "24hService" },
    { id: 57, label: "Electric blinds", value: "ElectricBlinds" },
    { id: 58, label: "Fitted wardrobes", value: "FittedWardrobes" },
    { id: 59, label: "Gated community", value: "GatedCommunity" },
    { id: 60, label: "Lift", value: "Lift" },
    { id: 62, label: "Garden view", value: "GardenView" },
    { id: 63, label: "Pool view", value: "PoolView" },
    { id: 64, label: "Panoramic view", value: "PanoramicView" },
    { id: 65, label: "Tennis / paddle court", value: "TennisPaddleCourt" },
    { id: 66, label: "Beachside", value: "Beachside" },
    { id: 67, label: "Cinema room", value: "CinemaRoom" },
    { id: 68, label: "Street view", value: "StreetView" },
    { id: 69, label: "Doorman", value: "Doorman" },
    { id: 70, label: "Underfloor heating (bathrooms)", value: "UnderfloorHheatingBathrooms" },
    { id: 71, label: "Underfloor heating (partial)", value: "UnderfloorHeatingPartial" },
    { id: 72, label: "Wine Cellar", value: "WineCellar" },
    { id: 73, label: "Steam Room", value: "SteamRoom" },
    { id: 74, label: "Unfurnished", value: "Unfurnished" },
    { id: 75, label: "Close to children playground", value: "CloseToChildrenPlayground" },
    { id: 78, label: "Close to Sea/Beach", value: "CloseToSeaBeach" },
    { id: 79, label: "Close to Golf", value: "CloseToGolf" },
    { id: 80, label: "Uncovered terrace", value: "UncoveredTerrace" },
    { id: 81, label: "Game Room", value: "GameRoom" },
    { id: 82, label: "Glass Doors", value: "GlassDoors" },
    { id: 83, label: "Separate dining room", value: "SeparateDiningRoom" },
    { id: 84, label: "Wooden floors", value: "WoodenFloors" },
    { id: 85, label: "Open plan kitchen", value: "OpenPlanKitchen" },
    { id: 86, label: "Balcony", value: "Balcony" },
    { id: 87, label: "Optional furniture", value: "OptionalFurniture" },
    { id: 88, label: "SPA", value: "SPA" },
    { id: 89, label: "Turkish bath", value: "TurkishBath" },
    { id: 90, label: "Wheelchair Accessible", value: "WheelchairAccessible" },
    { id: 91, label: "Excellent condition", value: "ExcellentCondition" },
    { id: 92, label: "Good condition", value: "GoodCondition" },
    { id: 93, label: "Recently Renovated/Refurbished", value: "RecentlyRenovatedRefurbished" },
    { id: 94, label: "Renovation Needed", value: "RenovationNeeded" },
    { id: 95, label: "Lake view", value: "LakeView" },
    { id: 96, label: "Urban view", value: "UrbanView" },
    { id: 97, label: "Ceiling cooling system", value: "CeilingCoolingSystem" },
    { id: 98, label: "Ceiling heating system", value: "CeilingHeatingSystem" },
    { id: 99, label: "Underfloor cooling system", value: "UnderfloorCoolingSystem" },
    { id: 100, label: "Saltwater swimming pool", value: "SaltwaterSwimmingPool" },
    { id: 101, label: "Close to shops", value: "CloseToShops" },
    { id: 102, label: "Close to town", value: "CloseToTown" },
    { id: 103, label: "Close to port", value: "CloseToPort" },
    { id: 104, label: "Close to schools", value: "CloseToSchools" },
    { id: 105, label: "Surveillance cameras", value: "SurveillanceCameras" },
    { id: 106, label: "Guest apartment", value: "GuestApartment" },
    { id: 107, label: "Inside Golf Resort", value: "InsideGolfResort" },
    { id: 108, label: "Marina view", value: "MarinaView" },
    { id: 109, label: "Office room", value: "OfficeRoom" },
    { id: 110, label: "Pets allowed", value: "PetsAllowed" },
    { id: 111, label: "Individual A/C units", value: "IndividualUnitsAC" },
    { id: 112, label: "Central heating by radiators", value: "CentralHeatingByRadiators" },
    { id: 113, label: "Electric radiators", value: "ElectricRadiators" },
    { id: 114, label: "Gas heating", value: "GasHeating" },
    { id: 115, label: "Gres floors", value: "GresFloors" },
    { id: 116, label: "Armored door", value: "ArmoredDoor" },
    { id: 117, label: "Kitchenette", value: "kitchenette" },
    { id: 118, label: "Ground floor patio", value: "GroundFloorPatio" },
    { id: 119, label: "Partial sea views", value: "PartialSeaViews" },
    { id: 120, label: "Well", value: "Well" },
    { id: 121, label: "Porcelain floors", value: "PorcelainFloors" },
    { id: 122, label: "Aerothermics", value: "Aerothermics" },
    { id: 123, label: "Internet - Fibre optic", value: "InternetFibre" },
    { id: 124, label: "Walk in closet", value: "Walk in closet" },
    { id: 125, label: "Walk in closet", value: "Walk in closet" },
    { id: 126, label: "Walk-in closet", value: "WalkinCloset" },
    { id: 127, label: "Gasoil heating", value: "GasoilHeating" },
    { id: 128, label: "Septic Tank", value: "SepticTank" },
    { id: 129, label: "Outdoor kitchen", value: "OutdoorKitchen" },
    { id: 130, label: "Roof terrace", value: "RoofTerrace" },
    { id: 131, label: "Swim jet", value: "SwimJet" },
    { id: 132, label: "Mature gardens", value: "MatureJardens" },
    { id: 133, label: "Heliport", value: "Heliport" },
    { id: 134, label: "Stone floors", value: "StoneFloors" },
    { id: 135, label: "Direct sea access", value: "DirectSeaAccess" },
    { id: 136, label: "Mains electricity supply", value: "MainsElectricitySupply" },
    { id: 137, label: "Mains water supply", value: "MainsWaterSupply" },
    { id: 138, label: "Stables", value: "Stables" },
    { id: 139, label: "Reverse Osmosis water system", value: "ReverseOsmosisWaterSystem" },
    { id: 140, label: "Staff accommodation", value: "StaffAccommodation" },
    { id: 141, label: "EV charging station", value: "EVChargingStation" },
    { id: 142, label: "Private mooring", value: "PrivateMooring" },
    { id: 143, label: "Close to restaurants", value: "CloseToRestaurants" },
    { id: 144, label: "City views", value: "CityViews" },
    { id: 145, label: "Co-Working area", value: "CoWorkingSpace" },
    { id: 146, label: "Rotating parking", value: "RotatingParking" },
    { id: 147, label: "Massage Room", value: "MassageRoom" },
    { id: 148, label: "Individual heating", value: "Individualheating" },
    { id: 152, label: "Porcelain Stoneware", value: "PorcelainStoneware" },
    { id: 153, label: "Cocktail bar", value: "CocktailBar" },
    { id: 154, label: "Concierge Service", value: "ConciergeService" },
    { id: 155, label: "Garage included in price", value: "GarageIncludedInPrice" },
    { id: 156, label: "Photovoltaica", value: "photovoltaica" },
    { id: 157, label: "Geothermal heat pump system", value: "GeothermalHeatPumpSystem" },
    { id: 158, label: "Fan coil system", value: "FanCoilSystem" },
    { id: 159, label: "Condensation based fresh water generator", value: "CondensationBasedFreshWaterGenerator" },
    { id: 160, label: "Micro cement flooring", value: "MicroCementFlooring" },
    { id: 161, label: "Fire pit", value: "FirePit" },
    { id: 162, label: "Panic room", value: "PanicRoom" },
    { id: 163, label: "Triple glazing", value: "TripleGlazing" },
    { id: 164, label: "Motion detectors", value: "MotionDetectors" },
    { id: 165, label: "Interior (facing inner courtyard)", value: "InteriorFacingInnerCourtyard" },
    { id: 166, label: "Mountain Side", value: "sidemountain" },
    { id: 167, label: "Wheelchair Accesible Home", value: "wheelchairAccesibleHome" },
]

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
    const [filters, setFilters] = useState<FiltersState>({
        propertyType: 'Apartment',
        priceMin: '',
        priceMax: '',
        sizeMin: '',
        sizeMax: '',
        types: {},
        propertyStatus: { bareOwnership: true },
        bedroomsFrom: null,
        bedroomsTo: null,
        condition: {},
        moreFilters: {},
        floor: {},
        multimedia: {},
        publicationDate: {},
    });
    const { mainReducer } = usePosterReducers()
    const { sendMessage } = useWebSocket()

    const handleInputChange = (field: string, value: string | number) => {
        if (field === 'propertyType') {
            sendMessage('action', {
                type: "propertyService",
                action: "propertyTypes",
                payload: {
                    id: Number(value),
                    is_subtype: true
                }
            })
        }
        const updated = { ...filters, [field]: value };
        setFilters(updated);

        if(field === 'propertyType'){
             onFilterChange?.(filters);
        }

    };

    const handleEnterPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === 'tab') {
            onFilterChange?.(filters);
        }
    };

    const handleCheckboxChange = (
        category: CheckboxGroup,
        option: string | number,
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
                            onChange={(e) => {
                                handleInputChange("propertyType", e.target.value)
                            }}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            {mainReducer?.property_type_list?.map((type) => {
                                return <option key={type.id} value={type?.id}>{type.name}</option>
                            })}
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
                                    onKeyDown={handleEnterPress}
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
                                    onKeyDown={handleEnterPress}
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
                                    onKeyDown={handleEnterPress}
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
                                    onKeyDown={handleEnterPress}
                                    className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    sq ft
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Type of home
                    </Label>
                    <div className="space-y-2.5">
                        {mainReducer?.property_subtype_list?.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={filters.types[item.id] || false}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('types', item.id, checked as boolean)
                                    }
                                    className="rounded"
                                />
                                <Label htmlFor={String(item.id)} className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer">
                                    {item.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

              
                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope  tracking-wide">
                        Bedroom
                    </Label>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="From"
                                    value={filters.bedroomsFrom ?? ''}
                                    onChange={(e) => handleInputChange('bedroomsFrom', e.target.value)}
                                    onKeyDown={handleEnterPress}
                                    className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    from
                                </span> */}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="relative">
                                <Input
                                    placeholder="To"
                                    value={filters.bedroomsTo ?? ''}
                                    onChange={(e) => handleInputChange('bedroomsTo', e.target.value)}
                                    onKeyDown={handleEnterPress}
                                    className="w-full  bg-white pr-14 px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-manrope text-text_gray_color pointer-events-none">
                                    to
                                </span> */}
                            </div>
                        </div>
                    </div>
                </div>


                <div className="space-y-3">
                    <Label className="text-md font-medium text-text_gray_color font-manrope tracking-wide">
                        More filters
                    </Label>

                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                        {filterList?.map((item: any) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.name}
                                    checked={filters.moreFilters?.[item.id]}
                                    onCheckedChange={(checked) =>
                                        handleCheckboxChange('moreFilters', item.id, checked as boolean)
                                    }
                                    onKeyDown={handleEnterPress}
                                    className="rounded"
                                />

                                <Label
                                    htmlFor={item.name}
                                    className="text-sm font-manrope font-normal text-[#0F172A] cursor-pointer"
                                >
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* <div className="space-y-3">
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
                </div> */}
            </div>
        </div>
    );
}

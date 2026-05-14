"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FilterPanel from "./components/filter-panel";
import { useDispatch } from "react-redux";
import { setPropertyDetails } from "@/redux/modules/main/action";
import { useParams, useSearchParams } from "next/navigation";

type PropertyType = "buy" | "rent" | "new";

const LIMIT = 18;

const Page = () => {
    const gridRef = useRef<HTMLDivElement>(null);
    const [gridHeight, setGridHeight] = useState<number>(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [propertyType, setPropertyType] =
        useState<PropertyType>("buy");
    const [propertyTypes, setPropertyTypes] = useState("");
    const [page, setPage] = useState(1);
    const { mainReducer } = usePosterReducers();
    const { sendMessage, isConnected, lastEvent } = useWebSocket();
    const dispatch = useDispatch();
    const [filterData, setFilterData] = useState({})
    const id = useParams()

    const propertyList =
        mainReducer?.property_list_with_limit?.data || [];

    const handleFilterChange = (filters: any) => {
        console.log("filters :::: " , filters)
        const selectedKeys = Object.keys(filters?.types || {}).filter(
            (key) => Number(filters?.types?.[key]) && key !== "all"
        );
        console.log("selectedKeys ::: " , selectedKeys)
        const selectedFeatures = Object.keys(filters?.moreFilters || {}).filter(
            (key) => Number(filters?.moreFilters?.[key]) && key !== "all"
        );
        const featureIds = selectedFeatures.map(Number).join(',')
        const payload = {
            categories: selectedKeys?.length > 0 ? null : Number(filters?.propertyType),
            types: Number(selectedKeys) === 0 ? null : selectedKeys?.length > 1 ? selectedKeys?.map((key) => Number(key)) : Number(selectedKeys),
            feature: featureIds,
            bedroomsFrom: filters?.bedroomsFrom ? Number(filters?.bedroomsFrom) : null,
            bedroomsTo: filters?.bedroomsTo ? Number(filters?.bedroomsTo) : null,
            priceFrom: filters?.priceMin ? Number(filters?.priceMin) : null,
            priceTo: filters?.priceMax ?  Number(filters?.priceMax) : null,
            buildFrom: filters?.sizeMin ?  Number(filters?.sizeMin) : null,
            buildTo: filters?.sizeMax ?  Number(filters?.sizeMax) : null,
            limit: LIMIT,
            page: page,
            cities: Number(id?.location),
            country: 6,
            ...(propertyType === 'buy' && { forSale: true, sold: false }),
            ...(propertyType === 'rent' && { forRent: true, rented: false, forSale: false }),
            ...(propertyType === 'new' && { isNewDev: true, forSale: true }),
        }
        setFilterData(payload)
        sendMessage("action", {
            type: "propertyService",
            action: "list",
            payload: payload
        });
    };

    useEffect(() => {
        if (!isConnected) return;
        sendMessage("action", {
            type: "propertyService",
            action: "list",
            payload: {
                limit: LIMIT,
                page: page,
                search: "",
                cities: Number(id?.location),
                country: 6,
                ...(propertyType === 'buy' && { forSale: true, sold: false }),
                ...(propertyType === 'rent' && { forRent: true, rented: false, forSale: false }),
                ...(propertyType === 'new' && { isNewDev: true, forSale: true }),
            },
        });
        setPage(1);

    }, [id]);

    useEffect(() => {
        if (
            lastEvent?.data?.status &&
            lastEvent?.data?.request?.type ===
            "userService" &&
            (
                lastEvent?.data?.request?.action ===
                "addFavorite" ||
                lastEvent?.data?.request?.action ===
                "removeFavorite"
            )
        ) {
            sendMessage("action", {
                type: "propertyService",
                action: "list",
                payload: {
                    limit: LIMIT,
                    page: page,
                    search: "",
                    cities: Number(id?.location),
                    country: 6,
                    property_type: propertyTypes || undefined,
                    ...(propertyType === 'buy' && { forSale: true, sold: false }),
                    ...(propertyType === 'rent' && { forRent: true, rented: false, forSale: false }),
                    ...(propertyType === 'new' && { isNewDev: true, forSale: true }),
                },
            });
        }
    }, [lastEvent]);

    useEffect(() => {
        dispatch(setPropertyDetails(null))
    }, [])

    return (
        <MainLayout
            isBreadcrumb
            isFilter
            isPropertyType
            isProperty
            propertyTypes={propertyTypes}
            callBackPropertyType={(value) => {
                setPropertyTypes(value);
                setPage(1);
            }}
            propertyCount={propertyList?.length}
            propertyType={propertyType}
            onPropertyTypeChange={(data: PropertyType) => {
                sendMessage("action", {
                    type: "propertyService",
                    action: "list",
                    payload: {
                        ...filterData,
                        ...(data === 'buy' && { forSale: true, sold: false }),
                        ...(data === 'rent' && { forRent: true, rented: false, forSale: false }),
                        ...(data === 'new' && { isNewDev: true, forSale: true }),
                    }
                });
                setPropertyType(data)
            }}
        >
            <div className="lg:mx-7 lg:pb-10 px-4 sm:px-6 lg:px-8">

                {/* MOBILE FILTER BUTTON */}

                <div className="flex justify-between items-center mb-4 lg:hidden">
                    <div>
                        <p className="font-manrope block lg:hidden font-semibold text-black">
                            {propertyList?.length} results
                            in drawn area
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            setIsFilterOpen(true)
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-btn_color text-white text-sm font-medium"
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                    </button>
                </div>

                <div className="flex items-start gap-4">

                    {/* DESKTOP FILTER */}

                    <div
                        className="hidden lg:block sticky top-28 min-w-[300px]"
                        style={{
                            height: gridHeight
                                ? `${gridHeight}px`
                                : "100%",
                            maxHeight:
                                "calc(100vh - 120px)",
                            overflowY: "auto",
                        }}
                    >
                        <FilterPanel
                            onFilterChange={
                                
                                handleFilterChange
                            }
                        />
                    </div>

                    {/* PROPERTY GRID */}

                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 w-full"
                    >
                        {propertyList?.map(
                            (property) => (
                                <PropertyCard
                                    property={property}
                                    key={property.id}
                                    {...property}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE OVERLAY */}

            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isFilterOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                    }`}
                onClick={() =>
                    setIsFilterOpen(false)
                }
            />

            {/* MOBILE FILTER DRAWER */}

            <div
                className={`fixed top-0 left-0 z-50 mt-[4.7rem] h-full w-[85%] max-w-sm bg-white transform transition-transform duration-300 ease-in-out lg:hidden
                ${isFilterOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center bg-gray-50 justify-between p-4 border-b">
                    <h2 className="text-lg font-manrope font-semibold">
                        Filters
                    </h2>

                    <button
                        onClick={() =>
                            setIsFilterOpen(false)
                        }
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="h-[calc(100%-180px)] overflow-y-auto">
                    <FilterPanel
                        onFilterChange={
                            handleFilterChange
                        }
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default Page;
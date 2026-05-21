"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import FilterPanel from "./components/filter-panel";
import { useDispatch } from "react-redux";
import {
    setAiInsight,
    setBreadcrumbs,
    setPropertyDetails,
} from "@/redux/modules/main/action";
import { useParams } from "next/navigation";
import { IPropertyResponse } from "@/redux/modules/main/types";

type PropertyType = "buy" | "rent" | "new" | "all";

const LIMIT = 18;

const Page = () => {
    const gridRef = useRef<HTMLDivElement>(null);

    const [gridHeight, setGridHeight] =
        useState<number>(0);

    const [isFilterOpen, setIsFilterOpen] =
        useState(false);

    const [propertyType, setPropertyType] =
        useState<PropertyType>("all");

    const [propertyTypes, setPropertyTypes] =
        useState("");

    const [page, setPage] = useState(1);

    const [loading, setLoading] =
        useState(false);

    const [hasMore, setHasMore] =
        useState(true);

    const [properties, setProperties] =
        useState<any[]>([]);

    const [filterData, setFilterData] =
        useState<any>({});

    const fetchedPages = useRef<Set<string>>(
        new Set()
    );

    const { mainReducer } = usePosterReducers();

    const {
        sendMessage,
        isConnected,
        lastEvent,
    } = useWebSocket();

    const dispatch = useDispatch();

    const id = useParams();

    // ==========================================
    // COMMON API CALL
    // ==========================================
    const fetchProperties = (
        currentPage: number,
        filters = filterData,
        reset = false
    ) => {
        if (!isConnected || loading) return;

        const uniqueKey = JSON.stringify({
            page: currentPage,
            propertyType,
            propertyTypes,
            filters,
        });

        // prevent duplicate api call
        if (
            fetchedPages.current.has(uniqueKey) &&
            !reset
        ) {
            return;
        }

        fetchedPages.current.add(uniqueKey);

        setLoading(true);

        sendMessage("action", {
            type: "propertyService",
            action: "list",
            payload: {
                limit: LIMIT,
                page: currentPage,
                search: "",
                cities: Number(id?.location),
                country: 6,
                status: true,
                forAll: propertyType === "all" ? true : false,
                categories: propertyTypes
                    ? Number(propertyTypes)
                    : filters?.propertyType,
                ...filters,

                ...(propertyType === "buy" && {
                    forSale: true,
                    sold: false,
                    forRent: false,
                }),

                ...(propertyType === "rent" && {
                    forRent: true,
                    rented: false,
                    forSale: false,
                }),

                ...(propertyType === "new" && {
                    isNewDev: true,
                    forSale: true,
                }),
            },
        });
    };

    useEffect(() => {
        setPage(1);
        setProperties([]);
        setHasMore(true);

        fetchedPages.current.clear();

        fetchProperties(1, filterData, true);
    }, [
        isConnected,
        propertyType,
        propertyTypes,
        mainReducer?.propertyFilter
    ]);

    useEffect(() => {
        const response =
            mainReducer?.property_list_with_limit;

        if (!response?.data) return;

        const newData = response?.data || [];

        if (page === 1) {
            setProperties(newData);
        } else {
            setProperties((prev) => {
                const existingIds = new Set(
                    prev.map((item) => item.id)
                );

                const filtered =
                    newData.filter(
                        (item: any) =>
                            !existingIds.has(item.id)
                    );

                return [...prev, ...filtered];
            });
        }

        setHasMore(newData.length >= LIMIT);

        setLoading(false);
    }, [mainReducer?.property_list_with_limit]);

    // ==========================================
    // FILTER CHANGE
    // ==========================================

    const handleFilterChange = (
        filters: any
    ) => {
        const selectedKeys = Object.keys(
            filters?.types || {}
        ).filter(
            (key) =>
                Number(filters?.types?.[key]) &&
                key !== "all"
        );

        const selectedFeatures =
            Object.keys(
                filters?.moreFilters || {}
            ).filter(
                (key) =>
                    Number(
                        filters?.moreFilters?.[key]
                    ) && key !== "all"
            );

        const payload = {
            categories:
                selectedKeys?.length > 0
                    ? null
                    : Number(
                        filters?.propertyType
                    ),

            types:
                selectedKeys?.length === 0
                    ? null
                    : selectedKeys?.length > 1
                        ? selectedKeys?.map(
                            (key) =>
                                Number(key)
                        )
                        : Number(selectedKeys),

            features: selectedFeatures,

            bedroomsFrom:
                filters?.bedroomsFrom
                    ? Number(
                        filters?.bedroomsFrom
                    )
                    : null,

            bedroomsTo:
                filters?.bedroomsTo
                    ? Number(
                        filters?.bedroomsTo
                    )
                    : null,

            priceFrom:
                filters?.priceMin
                    ? Number(
                        filters?.priceMin
                    )
                    : null,

            priceTo:
                filters?.priceMax
                    ? Number(
                        filters?.priceMax
                    )
                    : null,

            buildFrom:
                filters?.sizeMin
                    ? Number(
                        filters?.sizeMin
                    )
                    : null,

            buildTo:
                filters?.sizeMax
                    ? Number(
                        filters?.sizeMax
                    )
                    : null,
        };

        const cleanPayload =
            Object.fromEntries(
                Object.entries(payload).filter(
                    ([_, value]) =>
                        value !== null &&
                        value !== undefined
                )
            );

        setFilterData(cleanPayload);

        // reset
        setPage(1);
        setProperties([]);
        setHasMore(true);

        fetchedPages.current.clear();

        fetchProperties(
            1,
            cleanPayload,
            true
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            if (loading || !hasMore)
                return;

            const scrollTop =
                window.scrollY;

            const windowHeight =
                window.innerHeight;

            const documentHeight =
                document.documentElement
                    .scrollHeight;

            if (
                scrollTop + windowHeight >=
                documentHeight - 300
            ) {
                const nextPage =
                    page + 1;

                setPage(nextPage);

                fetchProperties(
                    nextPage
                );
            }
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [
        page,
        loading,
        hasMore,
        filterData,
    ]);

    useEffect(() => {
        if (
            lastEvent?.data?.status &&
            lastEvent?.data?.request
                ?.type ===
            "userService" &&
            (lastEvent?.data?.request
                ?.action ===
                "addFavorite" ||
                lastEvent?.data?.request
                    ?.action ===
                "removeFavorite")
        ) {
            fetchedPages.current.clear();

            fetchProperties(
                1,
                filterData,
                true
            );
        }
        if (
            lastEvent?.data?.status &&
            lastEvent?.data?.request
                ?.type ===
            "savedSearchService" &&
            (lastEvent?.data?.request
                ?.action ===
                "add")
        ) {
            fetchedPages.current.clear();
            setFilterData(null)

            fetchProperties(
                1,
                filterData,
                true
            );
        }
    }, [lastEvent]);


    useEffect(() => {
        if (
            mainReducer?.breadcrumbs
                ?.length === 4
        ) {
            const breadcrumbsWithoutLast =
                mainReducer.breadcrumbs?.slice(
                    0,
                    -1
                ) || [];

            dispatch(
                setBreadcrumbs(
                    breadcrumbsWithoutLast
                )
            );
        }
        dispatch(setPropertyDetails(null));
        dispatch(setAiInsight({} as IPropertyResponse));

    }, []); 

    const handleSavedSearches =
        () => {
            sendMessage("action", {
                type: "savedSearchService",
                action: "add",
                payload: {
                    ...filterData,
                    categories: propertyTypes ?? filterData?.propertyType,
                    cities: id?.location
                },
            });
        };

    return (
        <MainLayout
            isBreadcrumb
            isFilter
            isPropertyType
            isProperty
            propertyTypes={propertyTypes}
            callBackPropertyType={(
                value
            ) => {
                setPropertyTypes(value);
            }}
            propertyCount={
                properties?.length
            }
            propertyType={propertyType}
            onPropertyTypeChange={(
                data: PropertyType
            ) => {
                setPropertyType(data);
            }}
            savedSearch={
                Object.keys(filterData || {})
                    .length > 0
            }
            savedSearches={
                handleSavedSearches
            }
        >
            <div className="px-4 sm:px-6 lg:mx-7 lg:px-8 lg:pb-10">
                {/* MOBILE FILTER */}
                <div className="mb-4 flex items-center justify-between lg:hidden">
                    <p className="block font-manrope text-black font-semibold lg:hidden">
                        {properties?.length} results
                        in drawn area
                    </p>

                    <button
                        onClick={() =>
                            setIsFilterOpen(
                                true
                            )
                        }
                        className="flex items-center gap-2 rounded-lg bg-btn_color px-4 py-2 text-sm font-medium text-white"
                    >
                        <SlidersHorizontal
                            size={16}
                        />
                        Filters
                    </button>
                </div>

                <div className="flex items-start gap-4">
                    {/* DESKTOP FILTER */}
                    <div
                        className="sticky top-28 hidden min-w-[300px] lg:block"
                        style={{
                            height: gridHeight
                                ? `${gridHeight}px`
                                : "100%",
                            maxHeight:
                                "calc(100vh - 120px)",
                            overflowY:
                                "auto",
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
                        className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {properties?.map(
                            (property) => (
                                <PropertyCard
                                    key={
                                        property.id
                                    }
                                    property={
                                        property
                                    }
                                    {...property}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* LOADER */}
                {loading && (
                    <div className="py-10 text-center text-sm font-medium text-gray-500">
                        Loading...
                    </div>
                )}

                {/* NO DATA */}
                {!loading &&
                    properties?.length ===
                    0 && (
                        <div className="py-10 text-center text-sm font-medium text-gray-500">
                            No Properties
                            Found
                        </div>
                    )}
            </div>

            {/* OVERLAY */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isFilterOpen
                    ? "visible opacity-100"
                    : "invisible opacity-0"
                    }`}
                onClick={() =>
                    setIsFilterOpen(false)
                }
            />

            {/* MOBILE FILTER DRAWER */}
            <div
                className={`fixed left-0 top-0 z-50 mt-[4.7rem] h-full w-[85%] max-w-sm transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${isFilterOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                    <h2 className="text-lg font-manrope font-semibold">
                        Filters
                    </h2>

                    <button
                        onClick={() =>
                            setIsFilterOpen(
                                false
                            )
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
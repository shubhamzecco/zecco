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
import { useParams } from "next/navigation";

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
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { mainReducer } = usePosterReducers();
    const { sendMessage, isConnected, lastEvent } = useWebSocket();
    const dispatch = useDispatch();
    const { id } = useParams()

    const propertyList =
        mainReducer?.property_list_with_limit?.data || [];

    const handleFilterChange = (filters: any) => {
        console.log(filters);
    };

    const fetchProperties = (
        pageNumber: number,
        reset = false
    ) => {
        if (!isConnected) return;

        setLoading(true);

        sendMessage("action", {
            type: "propertyService",
            action: "list",
            payload: {
                limit: LIMIT,
                page: pageNumber,
                search: "",
                city: id,
                country: "Spain",
                property_type: propertyTypes || undefined,
                listing_type: propertyType,
            },
        });

        if (reset) {
            setHasMore(true);
        }
    };

    useEffect(() => {
        if (!isConnected) return;

        setPage(1);

        fetchProperties(1, true);
    }, [
        isConnected,
        propertyType,
        propertyTypes
    ]);

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
            fetchProperties(1, true);
        }
    }, [lastEvent]);

    useEffect(() => {
        const handleScroll = () => {
            if (loading || !hasMore) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight =
                document.documentElement.scrollHeight;

            if (
                scrollTop + windowHeight >=
                fullHeight - 300
            ) {
                const nextPage = page + 1;

                setPage(nextPage);

                fetchProperties(nextPage);
            }
        };

        window.addEventListener(
            "scroll",
            handleScroll
        );

        return () =>
            window.removeEventListener(
                "scroll",
                handleScroll
            );
    }, [page, loading, hasMore]);


    useEffect(() => {
        if (!loading) return;

        if (propertyList.length < LIMIT) {
            setHasMore(false);
        }

        setLoading(false);
    }, [propertyList]);


    useEffect(() => {
        const updateHeight = () => {
            if (gridRef.current) {
                setGridHeight(
                    gridRef.current.offsetHeight
                );
            }
        };

        updateHeight();

        window.addEventListener(
            "resize",
            updateHeight
        );

        return () =>
            window.removeEventListener(
                "resize",
                updateHeight
            );
    }, [propertyList]);

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
            onPropertyTypeChange={setPropertyType}
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

                        {/* LOADING */}

                        {loading && (
                            <div className="col-span-full flex justify-center py-6">
                                <p className="text-sm text-gray-500">
                                    Loading more
                                    properties...
                                </p>
                            </div>
                        )}

                        {/* NO MORE DATA */}

                        {!hasMore &&
                            propertyList?.length >
                            0 && (
                                <div className="col-span-full flex justify-center py-6">
                                    <p className="text-sm text-gray-400">
                                        No more
                                        properties
                                    </p>
                                </div>
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
"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import {
    ChevronDown,
    ChevronUp,
    MapPin,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

const propertyTypeMap: Record<number, string> = {
    1: "Apartment",
    2: "Villa",
    3: "House",
    4: "Studio",
    5: "Penthouse",
    9: "Townhouse",
    1030: "Duplex",
};

const featureMap: Record<number, string> = {
    1: "Front line golf",
    2: "Beachside",
    3: "Town",
    9: "Mountain Views",
    10: "Sea Views",
    11: "Private Garden",
    14: "Pool",
    21: "Gym",
    25: "Garage",
    28: "Lift",
    30: "Terrace",
    33: "Air Conditioning",
    34: "Security",
};

const SavedSearches = () => {
    const { sendMessage } =
        useWebSocket();

    const { mainReducer } =
        usePosterReducers();

    const [expandedCards, setExpandedCards] =
        useState<string[]>([]);

    useEffect(() => {
        sendMessage("action", {
            type: "savedSearchService",
            action: "list",
            payload: {},
        });
    }, []);

    const handleDelete = (
        id: string
    ) => {
        sendMessage("action", {
            type: "savedSearchService",
            action: "delete",
            payload: {
                id,
            },
        });
    };

    const handleApplySearch = (
        item: any
    ) => {
        console.log(
            "Apply Search ::: ",
            item
        );
    };

    const toggleExpand = (
        id: string
    ) => {
        setExpandedCards((prev) =>
            prev.includes(id)
                ? prev.filter(
                    (item) => item !== id
                )
                : [...prev, id]
        );
    };

    const generateFilters = (
        item: any
    ) => {
        const filters: {
            label: string;
            value: string | string[];
        }[] = [];

        if (
            item?.types?.filter(Boolean)
                ?.length > 0
        ) {
            filters.push({
                label: "Types",
                value:
                    item?.types
                        ?.filter(Boolean)
                        ?.map(
                            (
                                type: number
                            ) =>
                                propertyTypeMap[
                                    type
                                ] ||
                                `Type ${type}`
                        ),
            });
        }

        if (
            item?.features?.filter(Boolean)
                ?.length > 0
        ) {
            filters.push({
                label: "Features",
                value:
                    item?.features
                        ?.filter(Boolean)
                        ?.map(
                            (
                                feature: number
                            ) =>
                                featureMap[
                                    feature
                                ] ||
                                `Feature ${feature}`
                        ),
            });
        }

        if (
            item?.bedroomsFrom ||
            item?.bedroomsTo
        ) {
            filters.push({
                label: "Bedrooms",
                value: `${item?.bedroomsFrom || 0
                    } - ${
                    item?.bedroomsTo || 0
                }`,
            });
        }

        if (
            item?.priceFrom ||
            item?.priceTo
        ) {
            filters.push({
                label: "Price",
                value: `€${item?.priceFrom?.toLocaleString() || 0
                    } - €${item?.priceTo?.toLocaleString() || 0
                    }`,
            });
        }

        if (
            item?.buildFrom ||
            item?.buildTo
        ) {
            filters.push({
                label: "Build Size",
                value: `${item?.buildFrom || 0
                    }m² - ${
                    item?.buildTo || 0
                }m²`,
            });
        }

        const status: string[] = [];

        if (item?.forSale) {
            status.push(
                "For Sale"
            );
        }

        if (item?.forRent) {
            status.push(
                "For Rent"
            );
        }

        if (item?.isNewDev) {
            status.push(
                "New Development"
            );
        }

        if (status?.length > 0) {
            filters.push({
                label: "Status",
                value: status,
            });
        }

        return filters;
    };

    return (
        <SidebarLayout>
            <div
                className="min-h-screen bg-gradient-to-r
                from-[#60A5FA]/10
                via-[#fafafa]
                to-[#fafafa]
                px-5 py-8 lg:px-12"
            >
                <section className="mt-5">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="font-inter text-2xl font-bold text-[#111827]">
                                Saved Searches
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your saved
                                property filters
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-2 shadow-sm">
                            <span className="font-semibold text-[#2563EB]">
                                {mainReducer
                                    ?.saved_searches
                                    ?.data
                                    ?.length || 0}
                            </span>{" "}
                            Searches
                        </div>
                    </div>

                    <div className="space-y-5">
                        {mainReducer?.saved_searches?.data?.map(
                            (
                                item: any
                            ) => {
                                const filters =
                                    generateFilters(
                                        item
                                    );

                                const isExpanded =
                                    expandedCards.includes(
                                        item?._id
                                    );

                                const visibleFilters =
                                    isExpanded
                                        ? filters
                                        : filters.slice(
                                            0,
                                            4
                                        );

                                return (
                                    <div
                                        key={
                                            item?._id
                                        }
                                        className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        item?.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleApplySearch(
                                                            item
                                                        )
                                                    }
                                                    className="rounded-2xl bg-btn_color px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                                                >
                                                    Apply
                                                    Search
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            item?._id
                                                        )
                                                    }
                                                    className="rounded-2xl border border-red-200 p-3 text-red-600 transition-all hover:bg-red-50"
                                                >
                                                    <Trash2
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            {visibleFilters?.map(
                                                (
                                                    filter,
                                                    index
                                                ) => (
                                                    <div
                                                        key={
                                                            index
                                                        }
                                                        className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                                                    >
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                            {
                                                                filter.label
                                                            }
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {(Array.isArray(
                                                                filter.value
                                                            )
                                                                ? filter.value
                                                                : [
                                                                    filter.value,
                                                                ]
                                                            )?.map(
                                                                (
                                                                    value: string,
                                                                    index: number
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-2 text-sm font-medium text-[#2563EB]"
                                                                    >
                                                                        {
                                                                            value
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {filters?.length >
                                            4 && (
                                                <button
                                                    onClick={() =>
                                                        toggleExpand(
                                                            item?._id
                                                        )
                                                    }
                                                    className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#2563EB]"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            Show
                                                            Less
                                                            <ChevronUp
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            +
                                                            {
                                                                filters.length -
                                                                4
                                                            }{" "}
                                                            More
                                                            Filters
                                                            <ChevronDown
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                    </div>
                                );
                            }
                        )}
                    </div>

                    {mainReducer
                        ?.saved_searches
                        ?.data
                        ?.length ===
                        0 && (
                            <div className="mt-24 flex flex-col items-center justify-center">
                                <div className="rounded-full bg-blue-100 p-5">
                                    <MapPin className="text-blue-600" />
                                </div>

                                <h2 className="mt-5 text-2xl font-bold text-gray-800">
                                    No Saved
                                    Searches
                                </h2>

                                <p className="mt-2 text-center text-sm text-gray-500">
                                    Your saved
                                    filters will
                                    appear here
                                </p>
                            </div>
                        )}
                </section>
            </div>
        </SidebarLayout>
    );
};

export default SavedSearches;
"use client";

import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setBreadcrumbs, setPropertyFilter } from "@/redux/modules/main/action";
import {
    ChevronDown,
    ChevronUp,
    Eye,
    MapPin,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const propertyTypeMap: Record<number, string> = {
    1: "Studio",
    2: "Apartment",
    3: "Penthouse",
    4: "Town House",
    5: "Villa",
    6: "Finca",
    7: "Unique Buildings",
    8: "Cortijo",
    9: "Bungalow",
    12: "Duplex",
    13: "Semi Detached House",
    14: "Country House",
    15: "House",
    16: "Semi Detached Villa",
    17: "Ground Floor Apartment",
    18: "Loft",

    1001: "Bar",
    1002: "Building",
    1003: "Castle",
    1004: "Commercial Premises",
    1005: "Development Land",
    1006: "Discotheque",
    1008: "Golf Course",
    1009: "Golf Plot",
    1010: "Hotel",
    1011: "Hotel Plot",
    1012: "Industrial Land",
    1013: "Industrial Premises",
    1014: "Office",
    1015: "Parking",
    1016: "Restaurant",
    1017: "Shopping Centre",
    1018: "Supermarket",
    1019: "Residential Plot",
    1020: "Rustic Plot",
    1021: "Store Room",
    1022: "Boat",
    1023: "Riad",
    1026: "Unique Building",
    1027: "Palace",
    1028: "Mooring",
    1029: "Business",

    1030: "Mansion",
    1031: "Duplex Penthouse",
    1032: "Triplex",
    1033: "Estate",
    1034: "Shop",
    1035: "Office Units",
    1036: "Ground Floor Duplex",
    1037: "Investment",
    1038: "Flat",
    1039: "Chalet",
};

export const featureMap: Record<number, string> = {
    1: "Front line golf",
    2: "Front line beach",
    3: "Mountainside",
    4: "Amenities near",
    5: "Transport near",
    6: "Air conditioning",
    7: "Central heating",
    8: "Partly furnished",
    9: "Fully furnished",
    10: "Fully fitted kitchen",
    11: "Utility room",
    12: "Fireplace",
    13: "Marble floors",
    14: "Jacuzzi",
    15: "Sauna",
    16: "Satellite TV",
    17: "Basement",
    18: "Solar panels",
    19: "Guest room",
    20: "Storage room",
    21: "Gym",
    22: "Alarm",
    23: "Solarium",
    24: "Security entrance",
    25: "Double glazing",
    26: "Video entrance",
    27: "Brand new",
    28: "Dining room",
    29: "Barbecue",
    30: "Security service 24h",
    31: "Telephone",
    32: "Guest toilet",
    33: "Private terrace",
    34: "Kitchen equipped",
    35: "Living room",
    36: "Study room",
    37: "Water tank",
    38: "Parquet floors",
    39: "Wall-to-wall carpet",
    40: "Separate apartment",
    41: "Sea view",
    42: "Country view",
    43: "Mountain view",
    44: "Golf view",
    45: "Indoor pool",
    46: "Heated pool",
    47: "Underfloor heating (throughout)",
    48: "Automatic irrigation system",
    49: "Security shutters",
    50: "Smart home system",
    51: "Dolby Stereo Surround system",
    52: "Bars",
    53: "Laundry room",
    54: "Internet - Wifi",
    55: "Covered terrace",
    56: "24h Service",
    57: "Electric blinds",
    58: "Fitted wardrobes",
    59: "Gated community",
    60: "Lift",
    62: "Garden view",
    63: "Pool view",
    64: "Panoramic view",
    65: "Tennis / paddle court",
    66: "Beachside",
    67: "Cinema room",
    68: "Street view",
    69: "Doorman",
    70: "Underfloor heating (bathrooms)",
    71: "Underfloor heating (partial)",
    72: "Wine Cellar",
    73: "Steam Room",
    74: "Unfurnished",
    75: "Close to children playground",
    78: "Close to Sea/Beach",
    79: "Close to Golf",
    80: "Uncovered terrace",
    81: "Game Room",
    82: "Glass Doors",
    83: "Separate dining room",
    84: "Wooden floors",
    85: "Open plan kitchen",
    86: "Balcony",
    87: "Optional furniture",
    88: "SPA",
    89: "Turkish bath",
    90: "Wheelchair Accessible",
    91: "Excellent condition",
    92: "Good condition",
    93: "Recently Renovated/Refurbished",
    94: "Renovation Needed",
    95: "Lake view",
    96: "Urban view",
    97: "Ceiling cooling system",
    98: "Ceiling heating system",
    99: "Underfloor cooling system",
    100: "Saltwater swimming pool",
    101: "Close to shops",
    102: "Close to town",
    103: "Close to port",
    104: "Close to schools",
    105: "Surveillance cameras",
    106: "Guest apartment",
    107: "Inside Golf Resort",
    108: "Marina view",
    109: "Office room",
    110: "Pets allowed",
    111: "Individual A/C units",
    112: "Central heating by radiators",
    113: "Electric radiators",
    114: "Gas heating",
    115: "Gres floors",
    116: "Armored door",
    117: "Kitchenette",
    118: "Ground floor patio",
    119: "Partial sea views",
    120: "Well",
    121: "Porcelain floors",
    122: "Aerothermics",
    123: "Internet - Fibre optic",
    124: "Walk in closet",
    125: "Walk in closet",
    126: "Walk-in closet",
    127: "Gasoil heating",
    128: "Septic Tank",
    129: "Outdoor kitchen",
    130: "Roof terrace",
    131: "Swim jet",
    132: "Mature gardens",
    133: "Heliport",
    134: "Stone floors",
    135: "Direct sea access",
    136: "Mains electricity supply",
    137: "Mains water supply",
    138: "Stables",
    139: "Reverse Osmosis water system",
    140: "Staff accommodation",
    141: "EV charging station",
    142: "Private mooring",
    143: "Close to restaurants",
    144: "City views",
    145: "Co-Working area",
    146: "Rotating parking",
    147: "Massage Room",
    148: "Individual heating",
    152: "Porcelain Stoneware",
    153: "Cocktail bar",
    154: "Concierge Service",
    155: "Garage included in price",
    156: "Photovoltaica",
    157: "Geothermal heat pump system",
    158: "Fan coil system",
    159: "Condensation based fresh water generator",
    160: "Micro cement flooring",
    161: "Fire pit",
    162: "Panic room",
    163: "Triple glazing",
    164: "Motion detectors",
    165: "Interior (facing inner courtyard)",
    166: "Mountain Side",
    167: "Wheelchair Accesible Home",
};

type SavedSearchesProps = {
    isDashboard?: boolean;
};

const SavedSearches = ({
    isDashboard = false,
}: SavedSearchesProps) => {
    const { sendMessage, lastEvent } = useWebSocket();
    const { mainReducer } = usePosterReducers();
    const router = useRouter()
    const dispatch = useDispatch()

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
        dispatch(setBreadcrumbs([
            ...mainReducer.breadcrumbs,
            { label: 'Costa del Sol areas and Cities', href: `${App_url.link.COSTA_DEL_SOL}/${item?.cities}` },
        ]))
        router.push(`${App_url.link.COSTA_DEL_SOL}/${item?.cities}`)
        dispatch(setPropertyFilter(item))
    };


    const generateFilters = (
        item: any
    ) => {
        const filters: {
            label: string;
            value: string | string[];
        }[] = [];

        if (
            item?.categories) {
            filters.push({
                label: "Property Type",
                value: propertyTypeMap[item?.categories],
            });
        }

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
                        )?.join(', '),
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
                    } - ${item?.bedroomsTo || 0
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
                    }m² - ${item?.buildTo || 0
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

    useEffect(() => {
        if (lastEvent?.data?.status && lastEvent?.data?.request?.type === 'savedSearchService' && (lastEvent?.data?.request?.action === 'delete' || lastEvent?.data?.request?.action === 'updatePassword')) {
            sendMessage("action", {
                type: "savedSearchService",
                action: "list",
                payload: {},
            });
        }

    }, [lastEvent])



    return (

        <section className="mt-5">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-lg mb-2 font-inter text-[#111827]"> Saved Searches</h2>
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
                    (item: any) => {
                        const filters =
                            generateFilters(item);

                        return (
                            <div
                                key={item?._id}
                                className="rounded-md flex gap-4 py-4 bg-white px-5 shadow-sm transition-all duration-300 hover:shadow-lg"
                            >
                                {item?.city && (
                                    <div className="shrink-0">
                                        <img
                                            src={`${URL}${item?.city?.image}`}
                                            alt={item?.city?.name}
                                            className="h-16 w-16 rounded-2xl object-cover border border-gray-200"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-7 text-gray-500 break-words">
                                        {filters?.map((filter, index) => (
                                            <span key={index}>
                                                <span className="font-semibold uppercase text-xs text-black">
                                                    {filter.label} :
                                                </span>{" "}

                                                {Array.isArray(filter.value)
                                                    ? filter.value.join(", ")
                                                    : filter.value}

                                                {index !== filters.length - 1 && (
                                                    <span className="mx-2 text-gray-300">
                                                        |
                                                    </span>
                                                )}
                                            </span>
                                        ))}

                                        <div className="flex justify-end items-center gap-3 ml-auto shrink-0">
                                            <button
                                                onClick={() =>
                                                    handleApplySearch(
                                                        item
                                                    )
                                                }
                                                className="rounded-2xl border border-blue-200 p-2 text-blue-600 transition-all hover:bg-blue-50"
                                            >
                                                <Eye size={15} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        item?._id
                                                    )
                                                }
                                                className="rounded-2xl border border-red-200 p-2 text-red-600 transition-all hover:bg-red-50"
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>
                                        </div>
                                    </p>
                                </div>
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

    );
};

export default SavedSearches;
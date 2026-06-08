"use client";

import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import {
  setBreadcrumbs,
  setPropertyFilter
} from "@/redux/modules/main/action";
import { citySlug, formatEuro } from "@/utils/common";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

type SavedSearchesProps = {
  isDashboard?: boolean;
};

const SavedSearches = ({ isDashboard = false }: SavedSearchesProps) => {
  const { sendMessage, lastEvent, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = (id: string) => {
    sendMessage("action", {
      type: "savedSearchService",
      action: "delete",
      payload: {
        id,
      },
    });
  };

  useEffect(() => {
    if (!isConnected) return;
    sendMessage("action", {
      type: "propertyService",
      action: "propertyTypes",
      payload: {
        is_subtype: true,
      },
    });

    sendMessage("action", {
      type: "propertyService",
      action: "features",
      payload: {},
    });
  }, [isConnected]);

  const propertyCategoryMap = useMemo(() => {
    if (!mainReducer?.property_type_list) return {} as Record<number, string>;

    return mainReducer.property_type_list.reduce(
      (acc, item) => {
        if (!item.is_subtype) {
          acc[item.id] = item.name;
        }
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [mainReducer?.property_type_list]);

  const propertyTypeMap = useMemo(() => {
    if (!mainReducer?.property_subtype_list)
      return {} as Record<number, string>;

    return mainReducer.property_subtype_list.reduce(
      (acc, item) => {
        if (item.is_subtype) {
          acc[item.id] = item.name;
        }
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [mainReducer?.property_subtype_list]);

  const featureMap = useMemo(() => {
    if (!mainReducer?.property_features_list)
      return {} as Record<number, string>;

    return mainReducer?.property_features_list.reduce(
      (acc, item) => {
        acc[item.id] = item.name;

        return acc;
      },
      {} as Record<number, string>,
    );
  }, [mainReducer?.property_features_list]);

  const handleApplySearch = (item: any) => {
    dispatch(
      setBreadcrumbs([
        { label: "Home", href: "/" },
        {
          label: "Costa del Sol areas and Cities",
          href: `${App_url.link.COSTA_DEL_SOL}`,
        },
        {
          label: item?.cities,
          href: `${App_url.link.COSTA_DEL_SOL}/${item?.cities}`,
        },
      ]),
    );
    router.push(`${App_url.link.COSTA_DEL_SOL}/${citySlug(item?.cities)}`);
    dispatch(setPropertyFilter(item));
  };

  const generateSearchTitle = (item: any) => {
    const parts: string[] = [];

    // Bedrooms
    if (item?.bedroomsFrom && item?.bedroomsTo) {
      parts.push(`${item.bedroomsFrom}–${item.bedroomsTo} Bedroom`);
    } else if (item?.bedroomsFrom) {
      parts.push(`${item.bedroomsFrom}+ Bedroom`);
    } else if (item?.bedroomsTo) {
      parts.push(`Up to ${item.bedroomsTo} Bedroom`);
    }

    // Category
    if (item?.categories && item?.types?.filter(Boolean)?.length === 0) {
      const categoryName = propertyCategoryMap[item.categories];
      if (categoryName) {
        parts.push(categoryName);
      }
    }

    // Property Types
    if (item?.types?.filter(Boolean)?.length > 0) {
      const types = item.types
        .filter(Boolean)
        .map((type: number) => propertyTypeMap[type])
        .filter(Boolean);

      if (types.length > 0) {
        parts.push(types.join(" & "));
      }
    }

    // Status
    const status: string[] = [];

    if (item?.forSale) status.push("for Sale");
    else if (item?.forRent) status.push("for Rent");
    else if (item?.isNewDev) status.push("New Developments");
    else status.push("for Sale or Rent");

    if (status.length > 0) {
      parts.push(status.join(" & "));
    }

    // Location
    if (
      item?.search &&
      item?.search.toLowerCase() !== item.city.name.toLowerCase()
    ) {
      parts.push(`in ${item.search}, ${item.city.name}, Spain`);
    } else if (item?.city?.name) {
      parts.push(`in ${item.city.name}, Spain`);
    }

    // Price
    if (item?.priceFrom && item?.priceTo) {
      parts.push(
        `from ${formatEuro(item.priceFrom)} to ${formatEuro(item.priceTo)}`,
      );
    } else if (item?.priceFrom) {
      parts.push(`from ${formatEuro(item.priceFrom)}`);
    } else if (item?.priceTo) {
      parts.push(`up to ${formatEuro(item.priceTo)}`);
    }

    // Build Size
    if (item?.buildFrom && item?.buildTo) {
      parts.push(`with ${item.buildFrom}m²–${item.buildTo}m² Build Area`);
    } else if (item?.buildFrom) {
      parts.push(`with ${item.buildFrom}m²+ Build Area`);
    } else if (item?.buildTo) {
      parts.push(`with up to ${item.buildTo}m² Build Area`);
    }

    // Features
    if (item?.features?.filter(Boolean)?.length > 0) {
      const features = item.features
        .filter(Boolean)
        .map((feature: number) => featureMap[feature])
        .filter(Boolean);

      if (features.length > 0) {
        parts.push(`featuring ${features.join(" & ")}`);
      }
    }

    return parts.join(" ");
  };

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "savedSearchService" &&
      (lastEvent?.data?.request?.action === "delete" ||
        lastEvent?.data?.request?.action === "updatePassword")
    ) {
      sendMessage("action", {
        type: "savedSearchService",
        action: "list",
        payload: {},
      });
    }
  }, [lastEvent]);

  return (
    <section className="mt-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg font-inter text-[#111827]">
          Saved Searches
        </h2>
        <button
          onClick={() => router.push(`${App_url.link.SAVED_SEARCHES}`)}
          className="rounded-full font-manrope bg-btn_color font-medium  px-3 lg:px-7   py-2 text-xs lg:text-sm shadow-sm  text-white "
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {mainReducer?.saved_searches?.data?.slice(0, 3)?.map((item: any) => {
          const title = generateSearchTitle(item);

          return (
            <div
              key={item?._id}
              className="rounded-lg flex gap-4 py-4 bg-white px-5 shadow-sm transition-all duration-300 hover:shadow-lg"
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
                <p className="font-semibold text-sm text-black leading-7 break-words">
                  {title}

                  <div className="flex justify-end items-center gap-3 ml-auto shrink-0">
                    <button
                      onClick={() => handleApplySearch(item)}
                      className="rounded-2xl border border-blue-200 p-2 text-blue-600 transition-all hover:bg-blue-50"
                    >
                      <Eye size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(item?._id)}
                      className="rounded-2xl border border-red-200 p-2 text-red-600 transition-all hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {mainReducer?.saved_searches?.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="mt-5 text-xl font-bold text-gray-800">
            No Saved Searches
          </h2>

          <p className="mt-2 text-center text-sm text-gray-500">
            Your saved filters will appear here
          </p>
        </div>
      )}
    </section>
  );
};

export default SavedSearches;

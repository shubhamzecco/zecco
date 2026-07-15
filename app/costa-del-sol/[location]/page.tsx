"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import MainLayout from "@/components/layouts/main-layout";
import LoginPopup from "@/components/login-popup";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import {
  setAiInsight,
  setLoginPopup,
  setPropertyDetails,
  setPropertyFilter,
} from "@/redux/modules/main/action";
import { IPropertyResponse } from "@/redux/modules/main/types";
import { citySlug } from "@/utils/common";
import { SearchX, SlidersHorizontal, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import FilterPanel from "./components/filter-panel";
import PropertyCardSkeleton from "./components/PropertyCardSkeleton";

type PropertyType = "buy" | "rent" | "new" | "all";

const LIMIT = 18;

const Page = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType>("all");
  const [categories, setPropertyTypes] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<any>({});
  const { mainReducer, user_data } = usePosterReducers();
  const [search, setSearch] = useState(
    mainReducer?.propertyFilter?.search || "",
  );
  const fetchedPages = useRef<Set<string>>(new Set());
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const dispatch = useDispatch();
  const id = useParams();
  const router = useRouter();
  const fetchProperties = (
    currentPage: number,
    filters = filterData,
    reset = false,
    searchValue = search,
  ) => {
    if (!isConnected || loading) return;

    const uniqueKey = JSON.stringify({
      page: currentPage,
      propertyType,
      categories,
      filters,
      search: searchValue,
    });

    // prevent duplicate api call
    if (fetchedPages.current.has(uniqueKey) && !reset) {
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

        // SEARCH VALUE
        search: searchValue,

        cities: id?.location,
        country: "Spain",
        status: true,

        forAll: propertyType === "all",

        categories: categories ? Number(categories) : filters?.categories,

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
          sold: false,
          rented: false,
        }),
      },
    });
  };

  useEffect(() => {
    if (!mainReducer?.propertyFilter) {
      setFiltersInitialized(true);
      return;
    }

    const filter = mainReducer?.propertyFilter;
    const selectedKeys = Array.isArray(filter?.types)
      ? filter?.types
      : Object.entries(filter?.types || {})
        .filter(([_, value]) => value)
        .map(([key]) => Number(key));

    const selectedFeatures = Array.isArray(filter?.features)
      ? filter?.features
      : Object.entries(filter?.features || {})
        .filter(([_, value]) => value)
        .map(([key]) => Number(key));

    const payload = {
      categories: filter?.categories ?? null,
      types: selectedKeys ?? null,
      features: selectedFeatures,

      bedroomsFrom: filter?.bedroomsFrom ?? null,
      bedroomsTo: filter?.bedroomsTo ?? null,

      priceFrom: filter?.priceFrom ?? null,
      priceTo: filter?.priceTo ?? null,

      buildFrom: filter?.buildFrom ?? null,
      buildTo: filter?.buildTo ?? null,
    };

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== null && value !== undefined && value !== "",
      ),
    );

    setFilterData((prev: any) => {
      const prevStr = JSON.stringify(prev);
      const newStr = JSON.stringify(cleanPayload);
      return prevStr === newStr ? prev : cleanPayload;
    });

    if (mainReducer?.propertyFilter?.propertyType) {
      setPropertyType(mainReducer?.propertyFilter?.propertyType || "");
    } else {
      if (mainReducer?.propertyFilter?.forSale) {
        setPropertyType("buy");
      } else if (mainReducer?.propertyFilter?.forRent) {
        setPropertyType("rent");
      } else if (mainReducer?.propertyFilter?.isNewDev) {
        setPropertyType("new");
      } else {
        setPropertyType(propertyType);
      }
    }
    setPropertyTypes(filter?.categories ? String(filter?.categories) : "");
    // setSearch(search ? search : filter?.search);
    setFiltersInitialized(true);
  }, [mainReducer?.propertyFilter]);

  useEffect(() => {
    if (!isConnected || !filtersInitialized) return;
    setPage(1);
    setProperties([]);
    setHasMore(true);
    fetchedPages.current.clear();
    fetchProperties(1, filterData, true, search);
  }, [
    isConnected,
    propertyType,
    categories,
    filterData,
    filtersInitialized,
  ]);

  // API RESPONSE
  useEffect(() => {
    const response = mainReducer?.property_list_with_limit;

    if (!response?.data) return;

    const newData = response?.data || [];

    if (page === 1) {
      setProperties(newData);
    } else {
      setProperties((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));

        const filtered = newData?.filter(
          (item: any) => !existingIds.has(item._id),
        );

        return [...prev, ...filtered];
      });
    }

    setHasMore(newData?.length >= LIMIT);

    setLoading(false);
  }, [mainReducer?.property_list_with_limit]);

  const handleFilterChange = (filters: any) => {
    const selectedKeys = Object.keys(filters?.types || {}).filter(
      (key) => Number(filters?.types?.[key]) && key !== "all",
    );

    const selectedFeatures = Object.keys(filters?.features || {}).filter(
      (key) => Number(filters?.features?.[key]) && key !== "all",
    );

    const payload = {
      categories: selectedKeys?.length > 0 ? null : Number(filters?.categories),

      types:
        selectedKeys?.length === 0
          ? null
          : selectedKeys?.length > 1
            ? selectedKeys?.map((key) => Number(key))
            : Number(selectedKeys),

      features: selectedFeatures,

      bedroomsFrom: filters?.bedroomsFrom
        ? Number(filters?.bedroomsFrom)
        : null,

      bedroomsTo: filters?.bedroomsTo ? Number(filters?.bedroomsTo) : null,

      priceFrom: filters?.priceFrom ? Number(filters?.priceFrom) : null,

      priceTo: filters?.priceTo ? Number(filters?.priceTo) : null,

      buildFrom: filters?.buildFrom ? Number(filters?.buildFrom) : null,

      buildTo: filters?.buildTo ? Number(filters?.buildTo) : null,
    };

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );

    setFilterData(cleanPayload);

    // RESET
    setPage(1);
    setProperties([]);
    setHasMore(true);

    fetchedPages.current.clear();

    fetchProperties(1, cleanPayload, true, search);
  };

  // SEARCH
  const handleSearch = (value: any) => {
    const searchValue =
      typeof value === "string" ? value : value?.name || "";
      if(!searchValue) return 

    setSearch(searchValue);

    dispatch(
      setPropertyFilter({
        ...mainReducer?.propertyFilter,
        search: searchValue,
      })
    );

    // Typing: only update state, show dropdown handled by MainLayout
    if (typeof value === "string") {
      if (value.trim() === "") {
        setPage(1);
        setHasMore(true);
        fetchedPages.current.clear();
        fetchProperties(1, filterData, true, "");
      }
      return;
    }

    // Dropdown selection: fetch results and update route
    setPage(1);
    setHasMore(true);
    fetchedPages.current.clear();
    fetchProperties(1, filterData, true, searchValue);

    if (value?.city_name && value.city_name !== id?.location) {
      router.replace(
        `${App_url.link.COSTA_DEL_SOL}/${citySlug(value.city_name)}`
      );
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = window.scrollY;

      const windowHeight = window.innerHeight;

      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 300) {
        const nextPage = page + 1;

        setPage(nextPage);

        fetchProperties(nextPage, filterData, false, search);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading, hasMore, filterData, search]);

  // FAVORITE / SAVE SEARCH
  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      (lastEvent?.data?.request?.action === "addFavorite" ||
        lastEvent?.data?.request?.action === "removeFavorite")
    ) {
      fetchedPages.current.clear();

      fetchProperties(1, filterData, true, search);
    }
  }, [lastEvent]);

  useEffect(() => {
    dispatch(setPropertyDetails(null));

    dispatch(setAiInsight({} as IPropertyResponse));
  }, []);

  const handleSavedSearches = () => {
    if (!user_data?.access_token) {
      dispatch(setLoginPopup(true));
      return;
    } else {
      sendMessage("action", {
        type: "savedSearchService",
        action: "add",
        payload: {
          ...filterData,
          search,
          categories: categories ?? filterData?.categories,
          cities: id?.location,
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
            rented: false,
            sold: false,
          }),
        },
      });
    }
  };

  useEffect(() => {
    sendMessage("action", {
      type: "locationService",
      action: "searchLocationArea",
      payload: {},
    });
  }, []);


  return (
    <MainLayout
      isBreadcrumb
      isFilter
      isPropertyType
      isProperty
      isLocationDropdown
      propertyTypes={categories}
      searchValueProp={search}
      handleSearch={(e) => handleSearch(e)}
      callBackPropertyType={(value) => {
        setPropertyTypes(value);
      }}
      propertyCount={
        mainReducer?.property_list_with_limit?.pagination?.totalCount
      }
      propertyType={propertyType}
      onPropertyTypeChange={(data: PropertyType) => {
        setPropertyType(data);
      }}
      savedSearch={Object.keys(filterData || {}).length > 0}
      savedSearches={handleSavedSearches}
      filteredLocations={mainReducer?.all_location_list || []}
    >
      <div className="px-4 sm:px-6 lg:mx-7 lg:px-8 lg:pb-10">
        {/* MOBILE FILTER */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="block font-manrope font-semibold text-black lg:hidden">
            {mainReducer?.property_list_with_limit?.pagination?.totalCount}{" "}
            results in drawn area
          </p>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-btn_color px-4 py-2 text-sm font-medium text-white"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <div className="flex items-start gap-4">
          {/* DESKTOP FILTER */}
          <div
            className=" min-w-[300px] hidden lg:block"
            style={
              {
                // height: gridHeight ? `${gridHeight}px` : "100%",
                // maxHeight: "calc(100vh - 120px)",
                // overflowY: "auto",
              }
            }
          >
            <FilterPanel onFilterChange={handleFilterChange} />
          </div>

          {/* PROPERTY GRID */}
          <div className="w-full">
            {loading ? (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {Array.from({ length: 9 }).map((_, index) => (
                  <PropertyCardSkeleton key={index} />
                ))}
              </div>
            ) : properties?.length > 0 ? (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {properties.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    {...property}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-gray-100 p-5">
                      <SearchX className="h-10 w-10 text-[#136AED]" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    No Properties Found
                  </h2>

                  <p className="mt-2 text-gray-500">
                    No properties match your current filters.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LOADER */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <h2 className="text-2xl font-bold text-slate-800">
                Loading Properties
              </h2>

              <p className="mt-2 text-slate-500">
                Please wait while we fetch the latest properties...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isFilterOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* MOBILE FILTER DRAWER */}
      <div
        className={`fixed left-0 top-0 z-50 mt-[4.7rem] h-full w-[85%] max-w-sm transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b bg-gray-50 p-4">
          <h2 className="font-manrope text-lg font-semibold">Filters</h2>

          <button onClick={() => setIsFilterOpen(false)} aria-label="close">
            <X size={20} />
          </button>
        </div>

        <div className="h-[calc(100%-180px)] overflow-y-auto">
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
      </div>
      <LoginPopup />
    </MainLayout>
  );
};

export default Page;

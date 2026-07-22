"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import MainLayout from "@/components/layouts/main-layout";
import LoginPopup from "@/components/login-popup";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setAiInsight, setAiSelectedProperty, setLoginPopup, setPropertyDetails, setUpdatePropertyLike } from "@/redux/modules/main/action";
import { IProperty, IPropertyResponse } from "@/redux/modules/main/types";
import { citySlug } from "@/utils/common";
import { SearchX, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import FilterPanel from "./components/filter-panel";
import PropertyCardSkeleton from "./components/PropertyCardSkeleton";

type PropertyType = "buy" | "rent" | "new" | "all";

const LIMIT = 18;

export function parseCSV(value: string): number[] {
  return value ? value.split(",").map(Number).filter((n) => !isNaN(n)) : [];
}

type UrlFilters = {
  city: string;
  area: string;
  subarea: string;
  categories: string;
  bedroomsFrom: string;
  bedroomsTo: string;
  priceFrom: string;
  priceTo: string;
  buildFrom: string;
  buildTo: string;
  types: string;
  features: string;
};

function readFilters(sp: URLSearchParams): UrlFilters {
  return {
    city: sp.get("city") || "",
    area: sp.get("area") || "",
    subarea: sp.get("subarea") || "",
    categories: sp.get("categories") || "",
    bedroomsFrom: sp.get("bedroomsFrom") || "",
    bedroomsTo: sp.get("bedroomsTo") || "",
    priceFrom: sp.get("priceFrom") || "",
    priceTo: sp.get("priceTo") || "",
    buildFrom: sp.get("buildFrom") || "",
    buildTo: sp.get("buildTo") || "",
    types: sp.get("types") || sp.get("propertyType") || "",
    features: sp.get("features") || "",
  };
}

const Page = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const { mainReducer, user_data } = usePosterReducers();
  const fetchedPages = useRef<Set<string>>(new Set());
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlFilters = useMemo(() => readFilters(searchParams), [searchParams]);
  const searchValue = urlFilters.area || urlFilters.subarea;

  const search_by_area = mainReducer?.search_by_area;
  const isAiSelectMode = searchParams.get("select") === "true";
  const aiSelectedProperty = mainReducer?.ai_selected_property;
  const hasCity = !!urlFilters.city;
  const filtersArea = hasCity
    ? search_by_area?.data?.filter(
      (i: any) => i.name?.toLowerCase() === urlFilters.city.toLowerCase(),
    )
    : [];
  const areas = hasCity ? filtersArea?.[0]?.areas : search_by_area?.data;
  const parentArea = hasCity ? filtersArea?.[0] : null;

  const buildUniqueKey = (currentPage: number) =>
    JSON.stringify({ page: currentPage, propertyType, ...urlFilters });

  const fetchProperties = useCallback(
    (currentPage: number, reset = false) => {
      if (!isConnected || loading) return;
      const key = buildUniqueKey(currentPage);
      if (fetchedPages.current.has(key) && !reset) return;
      fetchedPages.current.add(key);
      setLoading(true);

      const common = {
        limit: LIMIT,
        page: currentPage,
        country: "Spain",
        status: true,
        ...(propertyType === "buy" && { forSale: true, sold: false, forRent: false }),
        ...(propertyType === "rent" && { forRent: true, rented: false, forSale: false }),
        ...(propertyType === "new" && { isNewDev: true, sold: false, rented: false }),
      };

      const payload: any = {
        ...common,
        cities: urlFilters.city || undefined,
        ...(searchValue && { search: searchValue }),
        forAll: propertyType === "all",
        categories: urlFilters.categories ? Number(urlFilters.categories) : undefined,
        ...(urlFilters.bedroomsFrom && { bedroomsFrom: Number(urlFilters.bedroomsFrom) }),
        ...(urlFilters.bedroomsTo && { bedroomsTo: Number(urlFilters.bedroomsTo) }),
        ...(urlFilters.priceFrom && { priceFrom: Number(urlFilters.priceFrom) }),
        ...(urlFilters.priceTo && { priceTo: Number(urlFilters.priceTo) }),
        ...(urlFilters.buildFrom && { buildFrom: Number(urlFilters.buildFrom) }),
        ...(urlFilters.buildTo && { buildTo: Number(urlFilters.buildTo) }),
        ...(urlFilters.types && { types: parseCSV(urlFilters.types) }),
        ...(urlFilters.features && { features: parseCSV(urlFilters.features) }),
      };

      sendMessage("action", { type: "propertyService", action: "list", payload });
      sendMessage("action", { type: "locationService", action: "areas_list", payload });
    },
    [isConnected, loading, propertyType, urlFilters, searchValue],
  );

  useEffect(() => {
    if (!isConnected) return;
    setPage(1);
    setProperties([]);
    setHasMore(true);
    fetchedPages.current.clear();
    fetchProperties(1, true);
  }, [isConnected, propertyType, urlFilters]);

  useEffect(() => {
    const res = mainReducer?.property_list_with_limit;
    if (!res?.data) return;
    const newData = res.data || [];
    if (page === 1) {
      setProperties(newData);
    } else {
      setProperties((prev) => {
        const ids = new Set(prev.map((p: any) => p._id));
        return [...prev, ...newData.filter((p: any) => !ids.has(p._id))];
      });
    }
    setHasMore(newData.length >= LIMIT);
    setLoading(false);
  }, [mainReducer?.property_list_with_limit]);

  useEffect(() => {
    const onScroll = () => {
      if (loading || !hasMore) return;
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 300) {
        const next = page + 1;
        setPage(next);
        fetchProperties(next);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, loading, hasMore, fetchProperties]);

  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [pathname, searchParams, router],
  );

  const handleFilterChange = useCallback(
    (filters: any) => {
      const u: Record<string, string> = {};
      u.categories = filters.categories ? String(filters.categories) : "";
      const types = Object.keys(filters.types || {}).filter((k) => filters.types[k]);
      u.types = types.length ? types.join(",") : "";
      const features = Object.keys(filters.features || {}).filter((k) => filters.features[k]);
      u.features = features.length ? features.join(",") : "";
      u.bedroomsFrom = filters.bedroomsFrom ? String(filters.bedroomsFrom) : "";
      u.bedroomsTo = filters.bedroomsTo ? String(filters.bedroomsTo) : "";
      u.priceFrom = filters.priceFrom || "";
      u.priceTo = filters.priceTo || "";
      u.buildFrom = filters.buildFrom || "";
      u.buildTo = filters.buildTo || "";
      updateUrl(u);
    },
    [updateUrl],
  );

  const handleSearch = useCallback(
    (value: any) => {
      const name = typeof value === "string" ? value : value?.name || "";
      const cityName = value?.city_name || name;
      updateUrl({ city: citySlug(cityName), area: citySlug(name), subarea: "" });
    },
    [updateUrl],
  );

  const onAreaClick = useCallback(
    (item: any) => {

      const type = item?.type?.toLowerCase();

      if (
        (type === "city" &&
          urlFilters.city?.toLowerCase() === item?.name?.toLowerCase()) ||
        (type === "area" &&
          urlFilters.area?.toLowerCase() === item?.name?.toLowerCase()) ||
        (type === "subarea" &&
          urlFilters.subarea?.toLowerCase() === item?.name?.toLowerCase())
      ) {
        return;
      }

      switch (type) {
        case "city":
          updateUrl({
            city: citySlug(item?.name_slug),
            area: "",
            subarea: "",
          });
          break;

        case "area":
          updateUrl({
            city: citySlug(item?.city_name || urlFilters.city),
            area: citySlug(item?.name_slug),
            subarea: "",
          });
          break;

        case "subarea":
          updateUrl({
            city: citySlug(item?.city_name || urlFilters.city),
            area: citySlug(item?.area_name || urlFilters.area),
            subarea: citySlug(item?.name_slug),
          });
          break;

        default:
          break;
      }
    },
    [urlFilters, updateUrl]
  );

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "userService" &&
      (lastEvent?.data?.request?.action === "addFavorite" ||
        lastEvent?.data?.request?.action === "removeFavorite")
    ) {
      fetchedPages.current.clear();
      fetchProperties(1, true);
    }
  }, [lastEvent, fetchProperties]);

  useEffect(() => {
    dispatch(setPropertyDetails(null));
    dispatch(setAiInsight({} as IPropertyResponse));
  }, []);

  useEffect(() => {
    if (isConnected) {
      sendMessage("action", { type: "locationService", action: "searchLocationArea", payload: {} });
    }
  }, [isConnected, sendMessage]);

  const handleAiSelect = useCallback((property: IProperty) => {
    if (!user_data?.access_token) {
      dispatch(setLoginPopup(true));
      return;
    }
    sendMessage("action", {
      type: "userService",
      action: "addFavorite",
      payload: { property_id: property?._id },
    });
    dispatch(setUpdatePropertyLike({
      property_id: property?._id,
      isFavorite: true,
    }));
    dispatch(setAiSelectedProperty(property));
    router.push("/AI-insights");
  }, [sendMessage, dispatch, router, user_data]);

  const handleSavedSearches = useCallback(() => {
    if (!user_data?.access_token) {
      dispatch(setLoginPopup(true));
      return;
    }
    sendMessage("action", {
      type: "savedSearchService",
      action: "add",
      payload: {
        search: searchValue,
        categories: urlFilters.categories || null,
        cities: urlFilters.city || null,
        ...(urlFilters.types && { types: parseCSV(urlFilters.types) }),
        ...(urlFilters.features && { features: parseCSV(urlFilters.features) }),
        ...(urlFilters.bedroomsFrom && { bedroomsFrom: Number(urlFilters.bedroomsFrom) }),
        ...(urlFilters.bedroomsTo && { bedroomsTo: Number(urlFilters.bedroomsTo) }),
        ...(urlFilters.priceFrom && { priceFrom: Number(urlFilters.priceFrom) }),
        ...(urlFilters.priceTo && { priceTo: Number(urlFilters.priceTo) }),
        ...(urlFilters.buildFrom && { buildFrom: Number(urlFilters.buildFrom) }),
        ...(urlFilters.buildTo && { buildTo: Number(urlFilters.buildTo) }),
        ...(propertyType === "buy" && { forSale: true, sold: false, forRent: false }),
        ...(propertyType === "rent" && { forRent: true, rented: false, forSale: false }),
        ...(propertyType === "new" && { isNewDev: true, rented: false, sold: false }),
      },
    });
  }, [user_data, dispatch, searchValue, urlFilters, propertyType]);

  const filterPanelFilters = useMemo(
    () => ({
      categories: urlFilters.categories || urlFilters.types || null,
      types: urlFilters.types
        ? Object.fromEntries(parseCSV(urlFilters.types).map((id) => [id, true]))
        : urlFilters.types,
      features: urlFilters.features
        ? Object.fromEntries(parseCSV(urlFilters.features).map((id) => [id, true]))
        : {},
      bedroomsFrom: urlFilters.bedroomsFrom ? Number(urlFilters.bedroomsFrom) : null,
      bedroomsTo: urlFilters.bedroomsTo ? Number(urlFilters.bedroomsTo) : null,
      priceFrom: urlFilters.priceFrom || "",
      priceTo: urlFilters.priceTo || "",
      buildFrom: urlFilters.buildFrom || "",
      buildTo: urlFilters.buildTo || "",
      propertyStatus: { bareOwnership: true },
      condition: {},
      floor: {},
      multimedia: {},
      publicationDate: {},
    }),
    [urlFilters],
  );


  return (
    <MainLayout
      isBreadcrumb
      isFilter
      isPropertyType
      isProperty
      propertyTypes={urlFilters.categories}
      searchValueProp={searchValue}
      handleSearch={handleSearch}
      callBackPropertyType={(v: string) => updateUrl({ categories: v })}
      propertyCount={mainReducer?.property_list_with_limit?.pagination?.totalCount}
      propertyType={propertyType}
      onPropertyTypeChange={(v: PropertyType) => setPropertyType(v)}
      savedSearch={Object.keys(urlFilters).some((k) => (k !== "city" && k !== "area" && k !== "subarea" && (mainReducer?.property_list_with_limit?.data?.length ?? 0) > 0) && Boolean(urlFilters[k as keyof UrlFilters]))}
      savedSearches={handleSavedSearches}
      filteredLocations={mainReducer?.all_location_list || []}
    >
      <div className="px-4 sm:px-6 lg:mx-7 lg:px-8 lg:pb-10">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <p className="block font-manrope font-semibold text-black lg:hidden">
            {mainReducer?.property_list_with_limit?.pagination?.totalCount} results in drawn area
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
          <div className="min-w-[300px] hidden lg:block">
            <FilterPanel
              initialFilters={filterPanelFilters}
              onFilterChange={handleFilterChange}
              areas={areas}
              parentArea={parentArea}
              onAreaClick={onAreaClick}
            />
          </div>

          <div className="w-full">
            {isAiSelectMode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <Sparkles size={18} className="text-[#2563EB] shrink-0" />
                <p className="text-sm font-manrope text-[#2563EB]">
                  Select a property to add to favorites and use for AI Insights
                </p>
              </div>
            )}
            {loading ? (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : properties?.length > 0 ? (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
              >
                {properties?.map((p) => (
                  <PropertyCard
                    key={p._id}
                    property={p}
                    {...p}
                    isSelected={isAiSelectMode && aiSelectedProperty?._id === p._id}
                    onSelect={isAiSelectMode ? handleAiSelect : undefined}
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
                  <h2 className="text-2xl font-bold text-gray-800">No Properties Found</h2>
                  <p className="mt-2 text-gray-500">No properties match your current filters.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">Loading Properties</h2>
              <p className="mt-2 text-slate-500">Please wait while we fetch the latest properties...</p>
            </div>
          </div>
        )}
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${isFilterOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        onClick={() => setIsFilterOpen(false)}
      />

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
          <FilterPanel
            initialFilters={filterPanelFilters}
            onFilterChange={handleFilterChange}
            areas={areas}
            parentArea={parentArea}
            onAreaClick={onAreaClick}
          />
        </div>
      </div>
      <LoginPopup />
    </MainLayout>
  );
};

export default Page;

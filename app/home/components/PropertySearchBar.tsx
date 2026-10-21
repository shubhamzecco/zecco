"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, MapPlus, Search, SearchIcon } from "lucide-react";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { citySlug } from "@/utils/common";

const PREBUILT_SUGGESTIONS_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search/prebuilt-suggestions`
    : "http://localhost:8000/api/search/prebuilt-suggestions";

const PARSE_FILTERS_URL =
  process.env.NEXT_PUBLIC_ENDPOINT_API_URL
    ? `${process.env.NEXT_PUBLIC_ENDPOINT_API_URL}/api/search/parse-filters`
    : "http://localhost:8000/api/search/parse-filters";

const DEBOUNCE_MS = 1000;
let prebuiltSuggestionsPromise: Promise<any[]> | null = null;
let prebuiltSuggestionsCache: any[] | null = null;

async function loadPrebuiltSuggestions() {
  if (prebuiltSuggestionsCache) {
    return prebuiltSuggestionsCache;
  }

  if (!prebuiltSuggestionsPromise) {
    prebuiltSuggestionsPromise = fetch(PREBUILT_SUGGESTIONS_URL, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load prebuilt suggestions");
        }

        const json = await res.json();
        const suggestions = json?.data?.suggestions;
        prebuiltSuggestionsCache = Array.isArray(suggestions) ? suggestions : [];
        return prebuiltSuggestionsCache;
      })
      .catch(() => {
        prebuiltSuggestionsCache = [];
        return [];
      })
      .finally(() => {
        prebuiltSuggestionsPromise = null;
      });
  }

  return prebuiltSuggestionsPromise;
}

async function parseSearchQuery(query: string): Promise<Record<string, any>> {
  const res = await fetch(PARSE_FILTERS_URL, {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to parse search query");
  const json = await res.json();
  return json?.data?.filters || {};
}

// filter-key aliases -> all of these resolve to the "categories" param.
// NOTE: "types" is intentionally NOT here -> it is a separate filter param
// that must be passed through as-is.
const CATEGORY_FILTER_KEYS = [
  "type",
  "propertyType",
  "property_type",
  "category",
];
// "types" is its own param, and its value is also used to look up the category id
const TYPES_FILTER_KEYS = ["types"];
const BEDROOM_FILTER_KEYS = ["bedrooms", "bedroom"];
const CITY_FILTER_KEYS = ["cities", "city"];
const AREA_FILTER_KEYS = ["areas", "area"];

// match a type entry by id or name
function matchType(
  value: any,
  propertyTypeList: any[],
): any | undefined {
  const searchVal = String(value).toLowerCase().trim();
  const property = propertyTypeList?.find((t: any) => {
    const name = String(t?.name ?? "").toLowerCase().trim();
    return (
      String(t?.id) === searchVal ||
      name === searchVal ||
      name.includes(searchVal) ||
      (!!name && searchVal.includes(name))
    );
  })
  return property;
}

// "types" value -> the CATEGORY id of the matched type (t.category.id)
function findCategoryId(
  value: any,
  propertyTypeList: any[],
): number | string | undefined {
  const matchCategory = matchType(value, propertyTypeList)?.category?.id
  return matchCategory;
}

// category value (name or id) -> the matched type's own id
function resolveCategoryId(
  value: any,
  propertyTypeList: any[],
): number | string {
  return matchType(value, propertyTypeList)?.id ?? value;
}

function applyFiltersToParams(
  filters: Record<string, any>,
  propertyTypeList: any[],
  selectedCategoryId?: number | string | null,
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(filters || {})?.forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (BEDROOM_FILTER_KEYS?.includes(key)) {
      params.set("bedroomsFrom", String(value));
      params.set("bedroomsTo", String(value));
      return;
    }

    if (TYPES_FILTER_KEYS?.includes(key)) {
      params.set("types", String(value));
      const categoryId = findCategoryId(value, propertyTypeList);
      if (categoryId !== undefined) {
        params.set("categories", String(categoryId));
      }
      return;
    }

    if (CATEGORY_FILTER_KEYS?.includes(key)) {
      const categoryId = String(resolveCategoryId(value, propertyTypeList));
      params.set("categories", categoryId);
      return;
    }

    if (CITY_FILTER_KEYS?.includes(key)) {
      params.set("city", String(value));
      return;
    }

    if (AREA_FILTER_KEYS?.includes(key)) {
      params.set("area", String(value));
      return;
    }

    if (Array?.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.set(key, String(value));
    }
  });

  if (!params.has("categories") && selectedCategoryId) {
    params.set("categories", String(selectedCategoryId));
    // params.set("category", String(selectedCategoryId));
  }

  return params;
}

function buildSuggestionUrl(filters: Record<string, any>): string {
  return `/costa-del-sol/properties?${applyFiltersToParams(
    filters || {},
    [],
  ).toString()}`;
}

const getPropertyType = (search: string, propertyTypes: any[]) => {
  const text = search.toLowerCase();

  return propertyTypes.find((item) => {
    const name = String(item?.name ?? "").toLowerCase();
    if (!name) return false;

    return (
      text.includes(name) ||
      text.includes(name.replace(/s$/, "")) // apartment -> apartments
    );
  });
};

const PropertySearchBar = ({
  initialSuggestions = [],
}: {
  initialSuggestions?: any[];
}) => {
  const router = useRouter();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const propertyTypes = mainReducer?.property_type_list || [];

  const [open, setOpen] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selected, setSelected] = useState<any>("");
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
  const [propertyDropdownPosition, setPropertyDropdownPosition] = useState<"top" | "bottom">("bottom");
  const [isSearching, setIsSearching] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>(
    Array.isArray(initialSuggestions) ? initialSuggestions?.slice(0, 8) : [],
  );
  const [prebuiltSuggestions, setPrebuiltSuggestions] = useState<any[]>(
    Array.isArray(initialSuggestions) ? initialSuggestions : [],
  );

  const autocompleteSuggestionsRef = useRef<any[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // tracks the exact query that was last sent over the websocket
  const latestQueryRef = useRef("");

  // ----------------------------------------------------------------
  // property types
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!isConnected) return;
    sendMessage("action", {
      type: "propertyService",
      action: "propertyTypes",
      payload: {},
    });
  }, [isConnected ]);

  // ----------------------------------------------------------------
  // click outside
  // ----------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----------------------------------------------------------------
  // main search (Enter / Search button)
  // ----------------------------------------------------------------
  const handleSearch = useCallback(async () => {
    if (isSearching || !searchText.trim()) return;

    setIsSearching(true);

    try {
      const matchedType = getPropertyType(searchText, propertyTypes);

      if (matchedType) {
        setSelected(matchedType);
      }

      const filters = await parseSearchQuery(searchText);

      const params = applyFiltersToParams(
        filters,
        propertyTypes,
        matchedType?.id || selected?.id,
      );

      router.push(
        `${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`,
      );
    } catch {
      const matchedType = getPropertyType(searchText, propertyTypes);

      if (matchedType) {
        setSelected(matchedType);
      }

      const params = new URLSearchParams();

      if (selected?.id) {
        params.set("categories", String(selected.id));
      }

      if (searchText) {
        params.set("city", citySlug(searchText));
      }

      router.push(
        `${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`,
      );
    } finally {
      setIsSearching(false);
    }
  }, [router, selected, searchText, propertyTypes, isSearching]);

  // ----------------------------------------------------------------
  // click on a suggestion
  // ----------------------------------------------------------------
  const callSearch = async (data: any) => {
    const query = data?.query || data?.title || "";

    let filters: Record<string, any> = { ...(data?.filters || {}) };

    if (query) {
      try {
        const parsed = await parseSearchQuery(query);
        if (parsed && typeof parsed === "object") {
          // data.filters win; parsed fills in anything missing
          filters = { ...parsed, ...filters };
        }
      } catch {
        // keep the suggestion's own filters
      }
    }

    const params = applyFiltersToParams(
      filters,
      propertyTypes,
      selected?.id,
    );

    router.push(
      `${App_url.link.COSTA_DEL_SOL}/properties?${params.toString()}`,
    );
  };

  const openMapSearch = useCallback(
    (mode: "draw" | "select" = "draw") => {
      setSearchDropdown(false);
      router.push(`/map-search?mode=${mode}`);
    },
    [router],
  );

  // ----------------------------------------------------------------
  // consume websocket autocomplete replies (with stale-guard)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (
      lastEvent?.data?.request?.type !== "searchService" ||
      lastEvent?.data?.request?.action !== "autocompleteSearch"
    ) {
      return;
    }

    // only accept the reply that matches the last query we actually sent
    const replyQuery = lastEvent?.data?.request?.payload?.query ?? "";
    if (replyQuery !== latestQueryRef.current) return;

    const suggestions = Array.isArray(lastEvent?.data?.data?.suggestions)
      ? lastEvent.data.data.suggestions
      : [];
    autocompleteSuggestionsRef.current = suggestions;

    // re-check against current input for extra safety
    const current = searchText.trim().toLowerCase();
    if (!current) {
      setSearchSuggestions(prebuiltSuggestions);
      return;
    }

    const stillLocal = prebuiltSuggestions.filter((item: any) =>
      String(item?.title || "").toLowerCase().includes(current),
    );

    if (stillLocal.length > 0) {
      setSearchSuggestions(stillLocal);
    } else {
      setSearchSuggestions(suggestions);
    }
  }, [lastEvent]); // intentionally NOT depending on searchText / prebuiltSuggestions

  // ----------------------------------------------------------------
  // load prebuilt suggestions once
  // ----------------------------------------------------------------
  useEffect(() => {
    if (Array.isArray(initialSuggestions) && initialSuggestions.length > 0) {
      return;
    }

    let isMounted = true;

    loadPrebuiltSuggestions().then((suggestions) => {
      if (!isMounted) return;

      setPrebuiltSuggestions(suggestions);

      const value = searchText.trim().toLowerCase();
      if (!value) {
        setSearchSuggestions(suggestions);
        return;
      }

      const localMatches = suggestions.filter((item: any) =>
        String(item?.title || "").toLowerCase().includes(value),
      );

      if (localMatches.length > 0) {
        setSearchSuggestions(localMatches);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // ----------------------------------------------------------------
  // position helpers
  // ----------------------------------------------------------------
  const handleSearchFocus = useCallback(() => {
    if (!searchRef.current) return;

    const rect = searchRef.current.getBoundingClientRect();
    const dropdownHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }

    setSearchDropdown(true);
  }, []);

  const handlePropertyDropdown = () => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    const dropdownHeight = 250;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setPropertyDropdownPosition("top");
    } else {
      setPropertyDropdownPosition("bottom");
    }

    setOpen((prev) => !prev);
  };

  // ----------------------------------------------------------------
  // INPUT CHANGE – proper debounce + local-first
  // ----------------------------------------------------------------
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const normalizedValue = value.trim().toLowerCase();

      // clear any pending debounced call
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      setSearchText(value);
      setSelectedLocation(null);
      setSearchDropdown(true);
      handleSearchFocus();

      // empty → show prebuilt
      if (!value.trim()) {
        setSearchSuggestions(prebuiltSuggestions);
        return;
      }

      // local matches first (instant)
      const localMatches = prebuiltSuggestions.filter((item: any) =>
        String(item?.title || "").toLowerCase().includes(normalizedValue),
      );

      if (localMatches.length > 0) {
        setSearchSuggestions(localMatches);
        return; // no network needed
      }

      // no local match → debounce the websocket call
      debounceRef.current = setTimeout(() => {
        latestQueryRef.current = value; // mark the query we are about to send

        sendMessage("action", {
          type: "searchService",
          action: "autocompleteSearch",
          payload: {
            query: value,
          },
        });

        debounceRef.current = null;
      }, DEBOUNCE_MS);
    },
    [prebuiltSuggestions, handleSearchFocus],
  );

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // ----------------------------------------------------------------
  // render
  // ----------------------------------------------------------------
  return (
    <div className="w-full max-w-[52rem] mx-auto">
      {/* SSR-visible suggestion links (for search engines / no-JS) */}
      <ul role="list" className="hidden" aria-label="Popular searches">
        {initialSuggestions?.map((item: any, index) => (
          <li key={index}>
            <a href={buildSuggestionUrl(item?.filters)}>{item?.title}</a>
          </li>
        ))}
      </ul>

      <div
        className="
          flex flex-col sm:flex-row
          sm:items-center
          gap-3 sm:gap-2
          rounded-full
          sm:border border-border-gray
          sm:bg-white
          px-2 py-3 sm:py-1.5
          shadow-sm
        "
      >
        <div className="flex max-sm:gap-1 gap-2 max-md:bg-white max-md:rounded-full max-md:p-1">
          {/* BUY / RENT */}
          <div className="flex items-center rounded-full bg-[#D6E0EC] p-1 w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-none rounded-full font-manrope font-semibold text-sm px-5 py-3 bg-[#D6E0EC] text-black`}
            >
              Buy
            </button>
          </div>

          <div className="flex items-center rounded-full bg-[#D6E0EC] p-2 w-full sm:w-auto">
            <div ref={dropdownRef} className="relative w-full sm:w-auto">
              <button
                onClick={handlePropertyDropdown}
                className="flex items-center justify-center w-full sm:w-[130px] truncate gap-2 rounded-full px-3 py-2 text-sm font-semibold sm:min-w-[120px]"
              >
                <span className="truncate">
                  {selected ? selected?.name : propertyTypes?.[0]?.name}
                </span>

                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""
                    }`}
                />
              </button>

              {open && (
                <div
                  className={`
                    absolute left-0 w-44 rounded-xl bg-white shadow-lg border
                    border-slate-200 z-50 max-h-[300px] overflow-y-auto
                    ${propertyDropdownPosition === "bottom"
                      ? "top-full mt-2"
                      : "bottom-full mb-2"
                    }
                  `}
                >
                  <ul className="py-1 text-sm text-slate-700">
                    {propertyTypes?.map((item: any) => (
                      <li key={item?.id}>
                        <button
                          onClick={() => {
                            setSelected(item);
                            setOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-center transition ${selected?.id === item?.id
                              ? "bg-slate-100 font-semibold"
                              : "hover:bg-slate-100"
                            }`}
                        >
                          {item?.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          ref={searchRef}
          className="flex max-md:bg-white max-md:rounded-full max-md:p-[2px] sm:w-full relative"
        >
          <div className="flex max-md:flex-1 items-center gap-2 px-3 max-md:my-3 w-full">
            <Search size={18} className="text-slate-gray shrink-0" />

            <input
              type="text"
              placeholder="Search in Spain..."
              value={searchText}
              onFocus={handleSearchFocus}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-md text-dark-navy placeholder-slate-gray outline-none"
            />
          </div>

          {searchDropdown && (
            <div
              className={`
                absolute left-0 w-full rounded-xl bg-white shadow-lg border
                border-slate-200 z-50 max-h-[300px] overflow-y-auto
                ${dropdownPosition === "bottom"
                  ? "top-full mt-2"
                  : "bottom-full mb-2"
                }
              `}
            >
              <ul className="py-1 text-sm text-slate-700">
                <li>
                  <button
                    type="button"
                    onClick={() => openMapSearch("draw")}
                    className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-slate-100 transition font-medium"
                  >
                    <MapPlus size={18} className="shrink-0" />
                    <span>Draw your area</span>
                  </button>
                </li>

                {searchSuggestions?.map((item: any, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => callSearch(item)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span>{item?.title}</span>
                        <span className="text-xs text-gray-500">
                          {item?.count ?? 0} properties
                        </span>
                      </div>
                    </button>
                  </li>
                ))}

                {searchText && searchSuggestions.length === 0 && (
                  <li className="px-4 py-3 text-gray-500">
                    No suggestions found
                  </li>
                )}
              </ul>
            </div>
          )}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="
              sm:w-[30%]
              whitespace-nowrap
              flex items-center justify-center gap-2
              rounded-full
              bg-[#0a6fd1]
              px-9 py-4
              text-sm font-semibold text-white
              hover:opacity-90 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isSearching ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <SearchIcon size={16} />
            )}
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertySearchBar);
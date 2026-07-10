"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ChevronDown, MapPlus, Search, SearchIcon } from "lucide-react";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setPropertyFilter } from "@/redux/modules/main/action";
import { citySlug } from "@/utils/common";

const PropertySearchBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const propertyTypes = mainReducer?.property_type_list || [];
  const [open, setOpen] = useState(false);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selected, setSelected] = useState<any>(propertyTypes?.[0] || null);
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">("bottom");
  const [propertyDropdownPosition, setPropertyDropdownPosition] = useState<"top" | "bottom">("bottom");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (!isConnected) return;

    sendMessage("action", {
      type: "propertyService",
      action: "propertyTypes",
      payload: {},
    });
  }, [isConnected, sendMessage]);


  useEffect(() => {
    if (propertyTypes?.length > 0 && !selected) {
      setSelected(propertyTypes[0]);
    }
  }, [propertyTypes, selected]);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSearch = useCallback(() => {
    dispatch(
      setPropertyFilter({
        categories: selected?.id,
        propertyType: "buy",
        search: searchText,
      }),
    );

    router.push(`${App_url.link.COSTA_DEL_SOL}/${citySlug(searchText)}`);
  }, [dispatch, router, selected]);

  const callSearch = (data: any) => {
    dispatch(
      setPropertyFilter({
        categories: selected?.id,
        propertyType: "buy",
        search: data?.filters?.city ? data?.filters?.city : "",
      }),
    );

    router.push(`${App_url.link.COSTA_DEL_SOL}/${citySlug(data?.filters?.city)}`);
  }


  const openMapSearch = useCallback(
    (mode: "draw" | "select" = "draw") => {
      setSearchDropdown(false);
      router.push(`/map-search?mode=${mode}`);
    },
    [router],
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (
      lastEvent?.data?.request?.type === "searchService" &&
      lastEvent?.data?.request?.action === "autocompleteSearch"
    ) {
      setSearchSuggestions(lastEvent.data?.data?.suggestions || []);
    }
  }, [lastEvent]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setSearchText(value);
      setSelectedLocation(null);
      setSearchDropdown(true);
      handleSearchFocus();

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!value.trim()) {
        setSearchSuggestions([]);
        return;
      }

      debounceRef.current = setTimeout(() => {
        sendMessage("action", {
          type: "searchService",
          action: "autocompleteSearch",
          payload: {
            query: value,
          },
        });
      }, 300);
    },
    [sendMessage]
  );

  const handleSearchFocus = () => {
    if (!searchRef.current) return;

    const rect = searchRef.current.getBoundingClientRect();

    const dropdownHeight = 320; // approximate height
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }

    setSearchDropdown(true);
  };

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

  return (
    <div className="w-full max-w-[52rem] mx-auto">
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
            <div ref={dropdownRef} className="relative">
              <button
                onClick={handlePropertyDropdown}
                className="flex items-center w-[130px] truncate justify-between gap-2 rounded-full px-3 py-2 text-sm font-semibold min-w-[120px]"
              >
                {selected?.name}

                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${open ? "rotate-180" : ""
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
                          className={`w-full px-4 py-2 text-left transition ${selected?.id === item?.id
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
                    onClick={() => {
                      openMapSearch("draw");
                    }}
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
                      onClick={() => {
                        callSearch(item)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.title}</span>

                        <span className="text-xs text-gray-500">
                          {item.count} properties
                        </span>
                      </div>
                    </button>
                  </li>
                ))}

                {searchText &&
                  searchSuggestions.length === 0 && (
                    <li className="px-4 py-3 text-gray-500">
                      No suggestions found
                    </li>
                  )}
              </ul>
            </div>
          )}

          <button
            onClick={handleSearch}
            className="
              sm:w-[30%]
              whitespace-nowrap
              flex items-center justify-center gap-2
              rounded-full
              bg-[#0a6fd1]
              px-9 py-4
              text-sm font-semibold text-white
              hover:opacity-90 transition
            "
          >
            <SearchIcon size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertySearchBar);

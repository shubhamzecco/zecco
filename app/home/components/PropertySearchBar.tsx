"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { useDispatch, shallowEqual } from "react-redux";

import { ChevronDown, Search, Sparkles } from "lucide-react";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import {
  setBreadcrumbs,
  setPropertyFilter,
} from "@/redux/modules/main/action";

const PropertySearchBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { sendMessage, isConnected } =
    useWebSocket();

  const {
    mainReducer,
  } = usePosterReducers();

  const propertyTypes =
    mainReducer?.property_type_list || [];

  const locations =
    mainReducer?.location_list_without_limit
      ?.data || [];

  const [buttonActivate, setButtonActivate] =
    useState<"buy" | "rent">("buy");

  const [open, setOpen] = useState(false);

  const [searchDropdown, setSearchDropdown] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [selectedLocation, setSelectedLocation] =
    useState<any>(null);

  const [selected, setSelected] = useState<any>(
    propertyTypes?.[0] || null
  );

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const searchRef =
    useRef<HTMLDivElement>(null);

  // =========================
  // INITIAL DATA FETCH
  // =========================
  useEffect(() => {
    if (!isConnected) return;

    sendMessage("action", {
      type: "propertyService",
      action: "propertyTypes",
      payload: {},
    });

    sendMessage("action", {
      type: "locationService",
      action: "list",
      payload: {
        search: "",
        limit: 0,
        page: 1,
        status: true,
      },
    });
  }, [isConnected, sendMessage]);

  // =========================
  // DEFAULT PROPERTY TYPE
  // =========================
  useEffect(() => {
    if (
      propertyTypes?.length > 0 &&
      !selected
    ) {
      setSelected(propertyTypes[0]);
    }
  }, [propertyTypes, selected]);

  // =========================
  // OUTSIDE CLICK
  // =========================
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setSearchDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // FILTERED LOCATIONS
  // =========================
  const filteredLocations = useMemo(() => {
    if (!searchText.trim()) {
      return locations;
    }

    const lower =
      searchText.toLowerCase();

    return locations.filter((item: any) =>
      item?.name
        ?.toLowerCase()
        ?.includes(lower)
    );
  }, [locations, searchText]);

  // =========================
  // HANDLERS
  // =========================
  const handleSearch = useCallback(() => {
    if (!selectedLocation) return;

    dispatch(setPropertyFilter({
      propertyTypes: selected?.id,
      propertyType: buttonActivate
    }))

    dispatch(
      setBreadcrumbs([
        ...mainReducer.breadcrumbs,
        {
          label:
            "Costa del Sol areas and Cities",
          href: `${App_url.link.COSTA_DEL_SOL}/${selected?.id}`,
        },
        {
          label: selectedLocation?.name,
          href: `${App_url.link.COSTA_DEL_SOL}/${selectedLocation?.id}`,
        },
      ])
    );

    router.push(
      `${App_url.link.COSTA_DEL_SOL}/${selectedLocation?.id}`
    );
  }, [
    dispatch,
    mainReducer?.breadcrumbs,
    router,
    selected,
    selectedLocation,
  ]);

  const handleLocationSelect =
    useCallback((item: any) => {
      setSelectedLocation(item);
      setSearchText(item?.name);
      setSearchDropdown(false);
    }, []);

  const handleInputChange =
    useCallback(
      (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        setSearchText(e.target.value);
        setSelectedLocation(null);
        setSearchDropdown(true);
      },
      []
    );

  return (
    <div className="w-full max-w-[52rem] mx-auto">
      <div
        className="
          flex flex-col sm:flex-row
          sm:items-center
          gap-3 sm:gap-2
          rounded-full
          lg:border border-border-gray
          lg:bg-white
          px-2 py-3 sm:py-1.5
          shadow-sm
        "
      >
        <div className="flex gap-5 max-md:bg-white max-md:rounded-full max-md:p-1">
          {/* BUY / RENT */}
          <div className="flex items-center rounded-full bg-[#D6E0EC] p-1 gap-2 w-full sm:w-auto">
            <button
              onClick={() =>
                setButtonActivate("buy")
              }
              className={`flex-1 sm:flex-none rounded-full font-manrope font-semibold text-sm px-5 py-3 ${buttonActivate === "buy"
                  ? "bg-sky_blue_color text-white"
                  : "text-[#0F172A]"
                }`}
            >
              Buy
            </button>

            <button
              onClick={() =>
                setButtonActivate("rent")
              }
              className={`flex-1 sm:flex-none rounded-full font-manrope font-semibold text-sm px-5 py-3 ${buttonActivate === "rent"
                  ? "bg-sky_blue_color text-white"
                  : "text-[#0F172A]"
                }`}
            >
              Rent
            </button>
          </div>

          {/* PROPERTY TYPE */}
          <div className="flex items-center rounded-full bg-[#D6E0EC] p-2 w-full sm:w-auto">
            <div
              ref={dropdownRef}
              className="relative"
            >
              <button
                onClick={() =>
                  setOpen((prev) => !prev)
                }
                className="flex items-center justify-between gap-2 rounded-full px-3 py-2 text-sm font-semibold min-w-[120px]"
              >
                {selected?.name}

                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${open ? "rotate-180" : ""
                    }`}
                />
              </button>

              {open && (
                <div className="absolute left-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-200 z-50">
                  <ul className="py-1 text-sm text-slate-700">
                    {propertyTypes.map(
                      (item: any) => (
                        <li key={item?.id}>
                          <button
                            onClick={() => {
                              setSelected(item);
                              setOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left transition ${selected?.id ===
                                item?.id
                                ? "bg-slate-100 font-semibold"
                                : "hover:bg-slate-100"
                              }`}
                          >
                            {item?.name}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div
          ref={searchRef}
          className="flex max-md:bg-white max-md:rounded-full max-md:p-[2px] lg:w-full relative"
        >
          <div className="flex max-md:flex-1 items-center gap-2 px-3 max-md:my-3 w-full">
            <Search
              size={18}
              className="text-slate-gray shrink-0"
            />

            <input
              type="text"
              placeholder="Search in Spain..."
              value={searchText}
              onFocus={() =>
                setSearchDropdown(true)
              }
              onChange={handleInputChange}
              className="w-full bg-transparent text-md text-dark-navy placeholder-slate-gray outline-none"
            />
          </div>

          {searchDropdown && (
            <div className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white shadow-lg border border-slate-200 z-50 max-h-[300px] overflow-y-auto">
              {filteredLocations.length >
                0 ? (
                <ul className="py-1 text-sm text-slate-700">
                  {filteredLocations.map(
                    (item: any) => (
                      <li key={item?.id}>
                        <button
                          onClick={() =>
                            handleLocationSelect(
                              item
                            )
                          }
                          className="w-full px-4 py-3 text-left hover:bg-slate-100 transition"
                        >
                          {item?.name}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No locations found
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleSearch}
            className="
              lg:w-[30%]
              whitespace-nowrap
              flex items-center justify-center gap-2
              rounded-full
              bg-sky_blue_color
              px-9 py-4
              text-sm font-semibold text-white
              hover:opacity-90 transition
            "
          >
            <Sparkles size={16} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PropertySearchBar);
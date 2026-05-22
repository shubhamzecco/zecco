"use client";

import { useWebSocket } from "@/api/socket/WebSocketContext";
import AreaCard from "@/components/cards/AreaCard";
import MainLayout from "@/components/layouts/main-layout";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setBreadcrumbs, setPropertyFilter } from "@/redux/modules/main/action";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const LIMIT = 12;

const CostadelSol = () => {
  const { sendMessage, isConnected } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ store all previous pages
  const [allAreas, setAllAreas] = useState<any[]>([]);

  // ✅ avoid duplicate api call
  const fetchedPages = useRef<Set<string>>(new Set());
  const fetchAreas = (
    currentPage: number,
    searchValue: string,
    reset = false,
  ) => {
    if (!isConnected || loading) return;

    const uniqueKey = `${searchValue}-${currentPage}`;
    if (fetchedPages.current.has(uniqueKey) && !reset) return;

    setLoading(true);

    fetchedPages.current.add(uniqueKey);

    sendMessage("action", {
      type: "locationService",
      action: "list",
      payload: {
        search: searchValue,
        limit: LIMIT,
        page: currentPage,
        status: true,
      },
    });
  };

  useEffect(() => {
    fetchAreas(1, "", true);
  }, [isConnected]);

  useEffect(() => {
    const response = mainReducer?.location_list_with_limit;

    if (!response?.data) return;

    const newData = response?.data || [];

    if (page === 1) {
      setAllAreas(newData);
    } else {
      setAllAreas((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));

        const filtered = newData.filter(
          (item: any) => !existingIds.has(item._id),
        );

        return [...prev, ...filtered];
      });
    }

    setHasMore(newData.length >= LIMIT);

    setLoading(false);
  }, [mainReducer?.location_list_with_limit]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    setHasMore(true);
    setAllAreas([]);
    fetchedPages.current.clear();

    fetchAreas(1, value, true);
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

        fetchAreas(nextPage, search);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading, hasMore, search]);

  useEffect(() => {
    if (mainReducer?.breadcrumbs?.length === 3) {
      const breadcrumbsWithoutLast =
        mainReducer.breadcrumbs?.slice(0, -1) || [];

      dispatch(setBreadcrumbs(breadcrumbsWithoutLast));
    }
    dispatch(setPropertyFilter({}));
  }, []);

  return (
    <MainLayout
      isBreadcrumb
      isFilter
      handleSearch={(e) => handleSearch(e)}
      placeholder="city"
      filteredLocations={mainReducer?.location_list_without_limit?.data || []}
    >
      <div className="px-4 sm:px-6 lg:mx-7 lg:px-8 lg:pb-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {allAreas?.map((area) => (
            <div key={area._id} className="w-full flex-shrink-0">
              <AreaCard {...area} />
            </div>
          ))}
        </div>

        {/* Loader */}
        {loading && (
          <div className="py-10 text-center text-sm font-medium text-gray-500">
            Loading...
          </div>
        )}

        {/* No Data */}
        {!loading && allAreas?.length === 0 && (
          <div className="py-10 text-center text-sm font-medium text-gray-500">
            No areas found
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CostadelSol;

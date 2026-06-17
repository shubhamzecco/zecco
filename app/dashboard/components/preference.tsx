"use client";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import PropertyCard from "@/components/cards/PropertyCard";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LIMIT = 18;

const PreferenceProperty = () => {
  const { isConnected, sendMessage, lastEvent } = useWebSocket();
  const { mainReducer } = usePosterReducers();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allPrefereneces, setAllPrefereneces] = useState<any[]>([]);
  const fetchedPages = useRef<Set<string>>(new Set());

  const fetchAreas = (currentPage: number, reset = false) => {
    if (!isConnected || loading) return;

    const uniqueKey = `${currentPage}`;
    if (fetchedPages.current.has(uniqueKey) && !reset) return;

    setLoading(true);

    fetchedPages.current.add(uniqueKey);

    sendMessage("action", {
      type: "userService",
      action: "getPreferenceProperties",
      payload: {
        limit: LIMIT,
        page: currentPage,
        status: true,
      },
    });
  };

  useEffect(() => {
    fetchAreas(1);
  }, [isConnected]);

  useEffect(() => {
    const response = mainReducer?.preference_property_list;

    if (!response?.data) return;

    const newData = response?.data || [];

    if (page === 1) {
      setAllPrefereneces(newData);
    } else {
      setAllPrefereneces((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));

        const filtered = newData.filter(
          (item: any) => !existingIds.has(item._id),
        );

        return [...prev, ...filtered];
      });
    }

    setHasMore(newData.length >= LIMIT);

    setLoading(false);
  }, [mainReducer?.preference_property_list]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = window.scrollY;

      const windowHeight = window.innerHeight;

      const documentHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= documentHeight - 300) {
        const nextPage = page + 1;

        setPage(nextPage);

        fetchAreas(nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loading, hasMore]);

  return (
    <section className="mt-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg font-inter text-[#111827]">
          Recommended Properties Based on Your Preferences
        </h2>
      </div>
      <div className="bg-white/70 p-7 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-scroll max-h-[100vh]">
          {allPrefereneces?.map((property) => (
            <PropertyCard property={property} key={property.id} {...property} />
          ))}
        </div>

        {loading && (
          <div className="py-10 text-center text-sm font-medium text-gray-500">
            Loading...
          </div>
        )}

        {!loading && allPrefereneces?.length === 0 && (
          <div className="!bg-none flex flex-col items-center justify-center">
            <h2 className="mt-5 text-xl font-bold text-gray-800">
              No Properties Match Your Preferences
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Update your property preferences to receive personalized property
              recommendations.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PreferenceProperty;

import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { clearBreadcrumbs, setBreadcrumbs } from "@/redux/modules/main/action";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

type ListingType = "buy" | "rent" | "new";

interface Region {
  name: string;
  count: string;
  items?: Record<ListingType, string[][]>;
}

export default function ExploreRegions() {
  const [selectedButton, setSelectedButton] = useState<ListingType>("buy");
  const { sendMessage, isConnected } = useWebSocket();
  const dispatch = useDispatch();
  const { mainReducer } = usePosterReducers();
  const router = useRouter();
  const LIMIT = 10;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [areasData, setAreasData] = useState<any[]>([]);
  const loadedPages = useRef<Record<ListingType, Set<number>>>({
    buy: new Set(),
    rent: new Set(),
    new: new Set(),
  });

  const fetchAreas = (nextPage: number, selectedButtonType: ListingType) => {
    if (loading || loadedPages.current[selectedButtonType].has(nextPage)) {
      return;
    }

    setLoading(true);

    loadedPages.current[selectedButtonType].add(nextPage);

    console.log("selectedButtonType", selectedButtonType);

    const requestPayload: any = {
      search: "",
      limit: LIMIT,
      page: nextPage,
    };

    if (selectedButtonType === "buy") {
      requestPayload.forSale = true;
    }

    if (selectedButtonType === "rent") {
      requestPayload.forRent = true;
    }

    if (selectedButtonType === "new") {
      requestPayload.isNewDev = true;
    }

    sendMessage("action", {
      type: "locationService",
      action: "areas_list",
      payload: requestPayload,
    });
    setPage(nextPage);
  };
  console.log("selectedButton", selectedButton);
  useEffect(() => {
    setAreasData([]);
    setPage(1);
    scrollRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
    fetchAreas(1, selectedButton);
  }, [selectedButton]);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container || isHovered) return;

    const getScrollAmount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        return container.clientWidth;
      }
      return (container.clientWidth - 72) / 4;
    };

    const interval = setInterval(() => {
      const scrollAmount = getScrollAmount();

      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      const remaining = maxScrollLeft - container.scrollLeft;

      // hit api when only 1 card pending
      if (remaining <= scrollAmount * 1.2) {
        fetchAreas(page + 1, selectedButton);
      }

      // reset after end
      if (container.scrollLeft >= maxScrollLeft) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollBy({
          left: scrollAmount + 24,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [page, loading, isHovered]);

  useEffect(() => {
    const latestData = mainReducer?.search_by_area?.data || [];

    if (latestData?.length > 0) {
      setAreasData((prev) => {
        const existingIds = new Set(prev.map((item: any) => item?.name));

        const newItems = latestData.filter(
          (item: any) => !existingIds.has(item?.name),
        );

        return [...prev, ...newItems];
      });

      setLoading(false);
    }
  }, [mainReducer?.search_by_area?.data]);

  const handleNavigate = (region: string) => {
    dispatch(clearBreadcrumbs());
    dispatch(
      setBreadcrumbs([
        { label: "Home", href: "/" },
        {
          label: "Costa del Sol areas and Cities",
          href: App_url.link.COSTA_DEL_SOL,
        },
        { label: region, href: `${App_url.link.COSTA_DEL_SOL}/${region}` },
      ]),
    );
    router.push(`${App_url.link.COSTA_DEL_SOL}/${region}`);
  };

  const TABS: { label: string; value: ListingType }[] = [
    { label: "Buy", value: "buy" },
    { label: "Rent", value: "rent" },
    { label: "New", value: "new" },
  ];

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container || loading) return;

    const scrollAmount =
      window.innerWidth < 640
        ? container.clientWidth
        : window.innerWidth < 1024
          ? container.clientWidth / 2
          : (container.clientWidth - 72) / 4;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const remaining = maxScrollLeft - container.scrollLeft;

    // if only last card pending
    if (remaining <= scrollAmount * 1.2) {
      fetchAreas(page + 1, selectedButton);
    }
  };

  return (
    <section className="bg-[#F8FAFC] py-14">
      <div className=" lg:mx-10 px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between mb-10 pb-5 border-b border-white/6">
          <h2 className="text-3xl capitalize font-manrope font-bold text-[#000000]">
            Explore homes by area
          </h2>

          <p className="text-slate_gray font-medium font-manrope text-md max-w-lg mt-4 md:mt-0">
            Navigate through Spain's most iconic provinces and find the
            municipality that fits your lifestyle.
          </p>
        </div>

        {/* TABS */}
        <div className="inline-flex gap-1 mb-10 rounded-lg bg-white p-1">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                (console.log("tab?.value", tab?.value),
                  setSelectedButton(tab?.value));
              }}
              className={`px-4 py-2 font-manrope font-bold uppercase text-sm rounded-md  ${
                tab?.value === selectedButton
                  ? "bg-[#0F172A] text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-2"
        >
          {areasData?.map((region: any, index: number) => (
            <div
              key={index}
              className="
flex-none
w-full
sm:w-[calc(50%-12px)]
lg:w-[calc((100%-72px)/4)]
bg-white
rounded-2xl
p-6
shadow-sm
flex
flex-col
"
            >
              <h3 className="font-manrope font-extrabold text-lg text-[#111827] mb-2">
                {region.name}
              </h3>

              <span className="inline-block text-xs font-medium text-[#64748B] tracking-wider w-fit uppercase bg-[#F3F4F6] px-3 py-1 rounded-md mb-4">
                {region.property_count} PROPERTIES
              </span>

              <ul className="space-y-2 flex-1">
                {region?.areas?.slice(0, 11)?.map((item: any, i: number) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm text-[#64748B]"
                  >
                    <span className="flex items-center gap-2 font-manrope font-medium">
                      <ChevronRight className="w-4 h-4 text-[#64748B]" />

                      {item?.name?.length > 23
                        ? `${item?.name?.slice(0, 23)}...`
                        : item?.name}
                    </span>

                    <span className="text-[#64748B] font-manrope font-medium">
                      {item?.property_count}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleNavigate(region?.name)}
                className="mt-6 bg-[#4A86E8] text-white py-2 font-manrope font-bold rounded-full text-sm transition"
              >
                View all listings
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

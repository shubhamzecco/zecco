import { useWebSocket } from "@/api/socket/WebSocketContext";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { clearBreadcrumbs, setBreadcrumbs } from "@/redux/modules/main/action";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";

type ListingType = "buy" | "rent" | "new";

const LIMIT = 10;

// regions per card
const REGIONS_PER_CARD = 2;

export default function ExploreRegions() {
  const [selectedButton, setSelectedButton] = useState<ListingType>("buy");

  const { sendMessage } = useWebSocket();

  const dispatch = useDispatch();

  const { mainReducer } = usePosterReducers();

  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [areasData, setAreasData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / LIMIT);
  const loadedPages = useRef<Record<ListingType, Set<number>>>({
    buy: new Set(),
    rent: new Set(),
    new: new Set(),
  });

  // =========================
  // FETCH AREAS
  // =========================
  const fetchAreas = (nextPage: number, selectedButtonType: ListingType) => {
    if (nextPage > totalPages && totalPages !== 0) {
      return;
    }

    if (loading || loadedPages.current[selectedButtonType].has(nextPage)) {
      return;
    }

    setLoading(true);

    loadedPages.current[selectedButtonType].add(nextPage);

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

  // =========================
  // TAB CHANGE
  // =========================

  useEffect(() => {
    setAreasData([]);

    setPage(1);
    loadedPages.current = {
      buy: new Set(),
      rent: new Set(),
      new: new Set(),
    };

    scrollRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });

    fetchAreas(1, selectedButton);
  }, [selectedButton]);

  // =========================
  // API RESPONSE
  // =========================

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
    }

    setTotalCount(mainReducer?.search_by_area?.pagination?.totalCount || 0);

    setLoading(false);
  }, [mainReducer?.search_by_area?.data]);

  // =========================
  // GROUP CARDS (STRATIFIED PACKING)
  // =========================

  const groupedCards = useMemo(() => {
    const cards: any[][] = [];

    // 1. Separate cities based on whether they have exactly 5 areas
    const exactFiveAreaCities = areasData.filter(
      (region) => Math.min(region?.areas?.length || 0, 5) === 5,
    );
    const remainingCities = areasData.filter(
      (region) => Math.min(region?.areas?.length || 0, 5) < 5,
    );

    // 2. First Phase: Force exactly 5-area cities into cards of 2
    for (let i = 0; i < exactFiveAreaCities.length; i += 2) {
      const pair = exactFiveAreaCities.slice(i, i + 2);
      cards.push(pair);
    }

    // 3. Second Phase: Run layout packing calculations on the remaining smaller cities
    let currentCard: any[] = [];
    let currentCardSlotCount = 0;

    // Total virtual slots allowed for smaller cities per card
    const MAX_SLOTS_PER_CARD = 12;

    remainingCities.forEach((region) => {
      const activeAreasCount = Math.min(region?.areas?.length || 0, 5);

      // Cost calculation: 2 slots for headers/spacing + area list length
      const regionSlotCost = 2 + activeAreasCount;

      // If it overflows the card capacity, push current card container and reset
      if (
        currentCardSlotCount + regionSlotCost > MAX_SLOTS_PER_CARD &&
        currentCard.length > 0
      ) {
        cards.push(currentCard);
        currentCard = [];
        currentCardSlotCount = 0;
      }

      currentCard.push(region);
      currentCardSlotCount += regionSlotCost;
    });

    // Push any remaining small cities left over in the loop
    if (currentCard.length > 0) {
      cards.push(currentCard);
    }

    return cards;
  }, [areasData]);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    const container = scrollRef.current;

    if (!container || isHovered) return;

    const card = container.querySelector<HTMLElement>(".region-card");

    if (!card) return;

    const cardWidth = card.offsetWidth + 24;

    const interval = setInterval(() => {
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      // fetch more
      if (maxScrollLeft - container.scrollLeft < container.clientWidth * 1.5) {
        fetchAreas(page + 1, selectedButton);
      }

      // reset to first
      if (container.scrollLeft + cardWidth >= maxScrollLeft) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        // move full card
        container.scrollBy({
          left: cardWidth,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [page, isHovered, selectedButton]);

  // =========================
  // MANUAL SCROLL
  // =========================

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container || loading) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    const remaining = maxScrollLeft - container.scrollLeft;

    if (remaining <= container.clientWidth * 1.2) {
      fetchAreas(page + 1, selectedButton);
    }
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigate = (region: string) => {
    dispatch(clearBreadcrumbs());

    dispatch(
      setBreadcrumbs([
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Costa del Sol areas and Cities",
          href: App_url.link.COSTA_DEL_SOL,
        },
        {
          label: region,
          href: `${App_url.link.COSTA_DEL_SOL}/${region}`,
        },
      ]),
    );

    router.push(`${App_url.link.COSTA_DEL_SOL}/${region}`);
  };

  const TABS = [
    {
      label: "Buy",
      value: "buy",
    },
    {
      label: "Rent",
      value: "rent",
    },
    {
      label: "New",
      value: "new",
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-14">
      <div className="lg:mx-10 px-6">
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
          {TABS.map((tab: any, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedButton(tab?.value)}
              className={`px-4 py-2 font-manrope font-bold uppercase text-sm rounded-md transition-all duration-300 ${
                tab?.value === selectedButton
                  ? "bg-[#0F172A] text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {/* CARDS */}

        {/* CARDS CONTAINER */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory py-2"
        >
          {groupedCards?.map((card: any, cardIndex: number) => (
            <div
              key={cardIndex}
              className="
        region-card
        snap-start
        flex-none
        w-full
        sm:w-[calc(50%-12px)]
        lg:w-[calc((100%-72px)/4)]
        bg-white
        rounded-2xl
        p-6
        shadow-sm
        h-[490px]             {/* Keeps all UI cards a consistent uniform height */}
        overflow-hidden
      "
            >
              {/* Changed gap-6 to justify-between or smaller gap to maximize space */}
              <div className="flex flex-col h-full gap-4 justify-start">
                {card.map((region: any, regionIndex: number) => (
                  <div
                    key={regionIndex}
                    className="
              border-b
              last:border-b-0
              border-slate-100
              pb-2
            "
                  >
                    <h3 className="font-manrope font-extrabold text-lg text-[#111827] mb-1">
                      {region.name}
                    </h3>

                    <div className="flex justify-between items-center gap-2 my-2">
                      <h2 className="inline-block text-xs font-medium text-[#64748B] tracking-wider uppercase bg-[#F3F4F6] px-3 py-1 rounded-md">
                        {region.property_count} PROPERTIES
                      </h2>
                      <button
                        onClick={() => handleNavigate(region?.name)}
                        className="text-[#4A86E8] font-manrope font-bold text-sm transition hover:opacity-90"
                      >
                        View
                      </button>
                    </div>

                    <ul className="space-y-2 my-2">
                      {region?.areas
                        ?.slice(0, 5)
                        ?.map((item: any, i: number) => (
                          <li
                            key={i}
                            className="flex items-center justify-between text-sm text-[#64748B]"
                          >
                            <span className="flex items-center gap-2 font-manrope font-medium truncate max-w-[80%]">
                              <ChevronRight className="w-4 h-4 text-[#64748B] flex-shrink-0" />
                              <span className="truncate">
                                {item?.name?.length > 23
                                  ? `${item?.name?.slice(0, 23)}...`
                                  : item?.name}
                              </span>
                            </span>

                            <span className="text-[#64748B] font-manrope font-medium">
                              {item?.property_count}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

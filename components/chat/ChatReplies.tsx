"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDispatch } from "react-redux";
import { ChatMessage } from "./zecco-chat-modal";
import { setPropertyFilter } from "@/redux/modules/main/action";
import { App_url } from "@/constant/static";
import { citySlug } from "@/utils/common";
import { useRouter } from "next/navigation";
import PropertyCarousel from "./PropertyCarousel";

const QUICK_ACTIONS = [
  "Find properties for buy in Costa del Sol, Spain.",
  "Explore apartments and villas in Marbella.",
  "Search budget-friendly homes across Costa del Sol, Spain",
];

type Props = {
  messages: ChatMessage[];
  isLoading: boolean;
  onQuickSend: (text: string) => void;
};

export default function ChatReplies({
  messages,
  isLoading,
  onQuickSend,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  /* ---------------- detect manual scroll ---------------- */

  const handleShowProperties = (msg: ChatMessage) => {
    if (!msg?.hasMore || !msg?.viewMore) return;
    dispatch(setPropertyFilter({}));
    const data = msg.viewMore;

    dispatch(
      setPropertyFilter({
        categories: Number(data?.category) || null,
        propertyType: data?.intent || "",
        search: data?.location || "",
        bedroomsFrom: Number(data?.bedrooms) || null,
        bedroomsTo: Number(data?.bedrooms) || null,
        priceFrom: data?.budgetMin || "",
        priceTo: data?.budgetMax || "",
        types: data?.propertyType ? [Number(data?.propertyType)] : [],
      }),
    );

    router.push(`${App_url.link.COSTA_DEL_SOL}/${citySlug(data.locationCity)}`);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // If user is within 80px of bottom → allow auto scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;

    setShouldAutoScroll(isNearBottom);
  };

  /* ---------------- auto scroll ---------------- */

  useEffect(() => {
    if (shouldAutoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, shouldAutoScroll]);

  /* ---------------- helpers ---------------- */

  const formatChatMessage = (text: string) => {
    return text
      ?.replace(
        /Details URL:\s*(\/property\/[a-zA-Z0-9]+)/g,
        "Details URL: [Click here]($1)",
      )
      .replace(/\n{3,}/g, "\n\n");
  };

  const formatTime = (timestamp?: string | Date) =>
    timestamp
      ? new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

  const getMarkdownComponents = (isUser: boolean, currentMsg: ChatMessage) => ({
    strong: ({ children }: any) => (
      <strong className="font-semibold text-[14px]">{children}</strong>
    ),
    p: ({ children }: any) => {
      // Safely join children into a cohesive string check to catch parsing fragmentation
      const rawText = Array.isArray(children)
        ? children
            .map((c) => (typeof c === "string" ? c : c?.props?.children || ""))
            .join("")
        : typeof children === "string"
          ? children
          : "";

      if (rawText.includes("[SHOW_BUTTON]")) {
        const [before, after] = rawText.split("[SHOW_BUTTON]");

        return (
          <div className="mb-3">
            {/* Context Text */}
            {before && (
              <p className="text-[14px] leading-6 whitespace-pre-line mb-2">
                {before.trim()}
              </p>
            )}

            {/* Interactive Button Section */}
            {currentMsg?.hasMore && currentMsg?.viewMore && (
              <div className="my-2 pt-1 pb-1">
                <p className="text-xs text-gray-500 mb-1.5 font-medium">
                  Click below to view your results:
                </p>
                <button
                  onClick={() => handleShowProperties(currentMsg)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white border border-gray-200 hover:bg-blue-50 text-blue-600 font-semibold flex items-center justify-center gap-2 rounded-lg text-sm shadow-sm transition-all"
                >
                  <span>View matching properties</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Next Follow-up Question */}
            {after && (
              <p className="text-[14px] leading-6 whitespace-pre-line mt-3">
                {after.trim()}
              </p>
            )}
          </div>
        );
      }

      return (
        <p
          className={`text-[14px] leading-6 whitespace-pre-line ${isUser ? "mb-1" : "mb-3"}`}
        >
          {children}
        </p>
      );
    },
    ul: ({ children }: any) => (
      <ul className="ml-4 mb-3 list-disc space-y-1">{children}</ul>
    ),
    li: ({ children }: any) => (
      <li className="text-[14px] leading-6">{children}</li>
    ),
    a: ({ href, children }: any) => (
      <button
        onClick={() => {
          if (href) {
            router.push(href);
          }
        }}
        className="text-blue-600 hover:underline hover:text-blue-700"
      >
        {children}
      </button>
    ),
  });

  console.log("messages ::::" , messages)

  /* ---------------- render ---------------- */
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-5 space-y-4 scrollbar-thin scrollbar-thumb-blue-200"
    >
      {/* INITIAL MESSAGE */}
      {messages?.length === 0 && (
        <>
          <div className="rounded-2xl bg-white p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-sm font-semibold">Zecco.es AI</span>
            </div>
            <p className="text-sm text-gray-700">
              I’m Zecco, your AI onboarding assistant with Zecco.es. I can help
              you explore homes, look at financing and pre-approval, or set up
              tours.
              <br />
              <br />
              What would you like to focus on today—finding a place,
              understanding your budget, or learning more about how Zecco.es
              works?{" "}
            </p>
          </div>

          {QUICK_ACTIONS?.map((text) => (
            <button
              key={text}
              onClick={() => onQuickSend(text)}
              className="w-full rounded-xl bg-white border px-4 py-3 text-left text-sm hover:bg-gray-50"
            >
              {text}
            </button>
          ))}
        </>
      )}

      {/* MESSAGES */}
      {messages?.map((msg) => {
        const isUser = msg?.sender === "user";
        return (
          <div
            key={msg?.id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div className={`chat-bubble ${isUser ? "sent" : "received"}`}>
              <ReactMarkdown components={getMarkdownComponents(isUser, msg)}>
                {formatChatMessage(msg?.text)}
              </ReactMarkdown>
              {!isUser && msg.properties && msg.properties.length > 0 && (
                <PropertyCarousel properties={msg.properties} />
              )}
              {msg.hasMore && msg.viewMore && (
                <button
                  onClick={() => handleShowProperties(msg)}
                  className="px-6 py-2.5 bg-white hover:bg-blue-50 text-blue-600 font-semibold flex items-center justify-center gap-2 rounded-lg text-sm"
                >
                  <span>Show more properties</span>
                  <ArrowRight size={16} className={`transition-transform`} />
                </button>
              )}
              <div className="text-[11px] opacity-70 text-right">
                {formatTime(msg?.timestamp)}
              </div>
            </div>
          </div>
        );
      })}

      {/* LOADING */}
      {isLoading && (
        <div className="flex items-center gap-3 mt-3">
          <div className="relative w-4 h-4">
            <span className="absolute inset-0 rounded-full bg-purple-500 opacity-60 animate-ping" />
            <span className="relative block w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400" />
          </div>
          <span className="text-[13px] text-muted-foreground">
            Zecco is typing...
          </span>
        </div>
      )}

      {/* SCROLL ANCHOR */}
      <div ref={bottomRef} />
    </div>
  );
}

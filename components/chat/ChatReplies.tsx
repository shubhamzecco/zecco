"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "./zecco-chat-modal";

const QUICK_ACTIONS = [
  "I have a property in mind and I want to book a tour",
  "I want to get pre-approved",
  "Explore homes",
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

  /* ---------------- detect manual scroll ---------------- */

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
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let formatted = text.replace(urlRegex, (url) => `[Click here](${url})`);
    return formatted.replace(/\n{3,}/g, "\n\n");
  };

  const formatTime = (timestamp?: string | Date) =>
    timestamp
      ? new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "";

  const markdownComponents = (isUser: boolean) => ({
    p: ({ children }: any) => (
      <p className={`text-sm leading-6 ${isUser ? "mb-1" : "mb-2"}`}>
        {children}
      </p>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky_blue_color underline"
      >
        {children}
      </a>
    ),
  });

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
              <ReactMarkdown components={markdownComponents(isUser)}>
                {formatChatMessage(msg?.text)}
              </ReactMarkdown>
              <div className="text-[11px] opacity-70 text-right">
                {formatTime(msg?.timestamp)}
              </div>
            </div>
          </div>
        );
      })}

      {/* LOADING */}
      {isLoading && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Zecco is thinking…</span>
        </div>
      )}

      {/* SCROLL ANCHOR */}
      <div ref={bottomRef} />
    </div>
  );
}

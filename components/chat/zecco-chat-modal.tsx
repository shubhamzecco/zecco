"use client";

import { sendZeccoAIMessage, ZeccoAIResponse } from "@/lib/chatApi";
import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { addAIChatMessage } from "@/redux/modules/main/action";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, UserPlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { customToast } from "../customToast";
import ChatInput from "./ChatInput";
import ChatReplies from "./ChatReplies";
import { getFingerprintDeviceInfo } from "@/utils/deviceFingerprint";

/* ---------------- TYPES ---------------- */

export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  viewMore?: {
    location: string;
    intent: string;
    budgetMin: string;
    budgetMax: string;
    bedrooms: string | null;
    propertyType: string | null;
    locationCity: string;
    category: string | null;
  };
  hasMore?: boolean;
  properties?: ZeccoAIResponse["properties"];
  suggestions?: ZeccoAIResponse["suggestions"];
};

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function ZecooAIChat({ isOpen = true, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { mainReducer, user_id } = usePosterReducers();
  const ai_chat_messages = mainReducer?.ai_chat_messages ?? [];

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    dispatch(
      addAIChatMessage({
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
      }),
    );

    setIsLoading(true);
    try {
      const fpInfo = await getFingerprintDeviceInfo();
      const sessionId = user_id ?? fpInfo?.deviceId!;
      const res: ZeccoAIResponse = await sendZeccoAIMessage(text, sessionId, user_id);

      const LIMIT_MARKER = "[LIMIT_REACHED]";
      const isLimit = res?.response?.includes(LIMIT_MARKER);
      if (isLimit) {
        setIsLimitReached(true);
      }

      dispatch(
        addAIChatMessage({
          id: Date.now().toString(),
          text: isLimit
            ? res.response.replace(LIMIT_MARKER, "").trim()
            : res.response || "No response from Zecco AI",
          sender: "bot",
          timestamp: new Date(),
          hasMore: (res.properties?.length ?? 0) > 0,
          properties: res.properties,
          suggestions: res.suggestions,
        }),
      );
    } catch {
      dispatch(
        addAIChatMessage({
          id: Date.now().toString(),
          text: "I'm temporarily handling a high volume of property searches. Please try again in a moment, and I'll continue helping you discover properties that match your preferences.",
          sender: "bot",
          timestamp: new Date(),
        }),
      );
      customToast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-1 sm:bottom-24 sm:left-40 lg:left-auto lg:bottom-4 lg:right-4 max-md:px-3 z-50 bg-ai-glow-blue"
        >
          <div className="lg:w-[480px] sm:w-[95%] max-md:w-full max-sm:min-h-[89vh] max-h-[75vh] min-h-[75vh]  lg:max-h-[95vh] lg:min-h-[95vh] rounded-3xl bg-[#F3F8FF] shadow-2xl border border-blue-100 overflow-hidden flex flex-col">
            {/* HEADER */}
            <div className="relative shrink-0 flex flex-col items-center px-6 pt-6 pb-4 bg-[#F3F8FF] z-10">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
                aria-label="close"
              >
                <X size={16} />
              </button>

              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-30 blur-md" />

                <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-r from-[#4F46E5] to-[#34D399]">
                  <div className="w-full h-full rounded-full bg-[#00004B] flex items-center justify-center">
                    <Image
                      src={App_url.image.chat_logo}
                      alt="Chat"
                      width={25}
                      height={25}
                      priority
                    />
                  </div>
                </div>
              </div>

              <h2 className="mt-3 text-lg font-semibold text-gray-900">
                Zecco.es AI
              </h2>

              <p className="mt-1 text-center text-sm text-gray-600 leading-relaxed">
                Meet Zecco AI by Zecco.es, your guide to finding and buying your
                perfect home.
              </p>
            </div>

            <ChatReplies
              messages={ai_chat_messages}
              isLoading={isLoading}
              onQuickSend={handleSend}
              onSuggestionClick={() => inputRef.current?.focus()}
            />

            {/* LIMIT REACHED */}
            {isLimitReached && (
              <div className="shrink-0 bg-gradient-to-br from-amber-50 to-orange-50 border-t border-amber-200 p-4 space-y-3">
                <p className="text-sm font-medium text-amber-800">
                  Free limit reached
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Sign in or create an account to continue your property search
                  and unlock unlimited messages.
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => router.push(App_url.link.SIGN_IN)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 active:scale-[0.98] transition-all"
                  >
                    <LogIn size={16} />
                    Sign in
                  </button>
                  <button
                    onClick={() => router.push(App_url.link.SIGN_UP)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-amber-300 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 active:scale-[0.98] transition-all"
                  >
                    <UserPlus size={16} />
                    Create account
                  </button>
                </div>
              </div>
            )}

            {/* INPUT */}
            <ChatInput
              ref={inputRef}
              isLoading={isLoading}
              disabled={isLimitReached}
              onSend={handleSend}
              maxLength={300}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

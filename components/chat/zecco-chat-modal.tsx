"use client";

import { App_url } from "@/constant/static";
import { sendChatMessage } from "@/lib/chatApi";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { addAIChatMessage } from "@/redux/modules/main/action";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { customToast } from "../customToast";
import ChatInput from "./ChatInput";
import ChatReplies from "./ChatReplies";

/* ---------------- TYPES ---------------- */

export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};


export default function ZecooAIChat({ isOpen = true, onClose }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { mainReducer } = usePosterReducers();
  const ai_chat_messages = mainReducer?.ai_chat_messages ?? [];

  const getSessionId = () => {
    const key = "zecco_session_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = "web_" + crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  };

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ai_chat_messages, isLoading]);

  /* ---------------- SEND MESSAGE ---------------- */

  //   const handleSend = async (text: string) => {
  //     if (!text.trim() || isLoading) return;

  //     const userMessage: ChatMessage = {
  //       id: Date.now().toString(),
  //       text,
  //       sender: "user",
  //       timestamp: new Date(),
  //     };

  //     setMessages((prev) => [...prev, userMessage]);
  //     setIsLoading(true);

  //     try {
  //       const res = await sendChatMessage(text, getSessionId());

  //       const botMessage: ChatMessage = {
  //         id: Date.now().toString(),
  //         text: res?.reply ?? "No response from Zecco AI",
  //         sender: "bot",
  //         timestamp: new Date(),
  //       };

  //       setMessages((prev) => [...prev, botMessage]);
  //     } catch {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           id: Date.now().toString(),
  //           text: "Sorry, something went wrong. Please try again.",
  //           sender: "bot",
  //           timestamp: new Date(),
  //         },
  //       ]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

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
      const res = await sendChatMessage(text, getSessionId());

      dispatch(
        addAIChatMessage({
          id: Date.now().toString(),
          text: res?.reply ?? "No response from Zecco AI",
          sender: "bot",
          timestamp: new Date(),
        }),
      );
    } catch {
      dispatch(
        addAIChatMessage({
          id: Date.now().toString(),
          text: "Something went wrong. Please try again.",
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
          className="fixed bottom-1  max-md:px-3 lg:right-6 z-50 bg-ai-glow-blue"
        >
          <div className="lg:w-[480px] max-md:w-full max-h-[75vh] min-h-[75vh]  lg:max-h-[95vh] lg:min-h-[95vh] rounded-3xl bg-[#F3F8FF] shadow-2xl border border-blue-100 overflow-hidden flex flex-col">
            {/* HEADER */}
            <div className="relative shrink-0 flex flex-col items-center px-6 pt-6 pb-4 bg-[#F3F8FF] z-10">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
              >
                <X size={16} />
              </button>

              {/* <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                <Sparkles size={22} />
              </div> */}

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
            />

            <div ref={messagesEndRef} />

            {/* INPUT */}
            <ChatInput isLoading={isLoading} onSend={handleSend} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

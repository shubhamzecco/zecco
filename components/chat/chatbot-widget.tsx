"use client";

import { App_url } from "@/constant/static";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { setChatBadgeOpen } from "@/redux/modules/main/action";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ZecooAIChat from "./zecco-chat-modal";

interface Message {
  id: number;
  text: string;
  sender: string;
  avatar: string;
  senderName: string;
  time: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const { mainReducer } = usePosterReducers();
  const dispatch = useDispatch();

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after 2 seconds
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const openChat = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-28 right-8 z-40 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-white rounded-lg shadow-xl p-4 w-72 border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <Image
                src={App_url.image.chat_logo}
                alt="chat"
                width={25}
                height={25}
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">Zecco AI</h3>
                <p className="text-sm text-gray-600">
                  Hey, you can also chat & explore homes with me!
                </p>
              </div>
              <button onClick={() => setShowNotification(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={openChat}
        className="fixed bottom-8 right-8 z-50 cursor-pointer"
      >
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
      </div>

      {(isOpen || mainReducer?.ai_chat_badge_open) && (
        <ZecooAIChat
          isOpen={isOpen || mainReducer?.ai_chat_badge_open}
          onClose={() => {
            setIsOpen(false);
            dispatch(setChatBadgeOpen(false));
          }}
        />
      )}
    </>
  );
}

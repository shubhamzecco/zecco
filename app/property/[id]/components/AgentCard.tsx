"use client";
import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import ProfileAvatar from "@/components/profile";
import { App_url } from "@/constant/static";
import { IUserTypes } from "@/redux/modules/common/user_data";
import { setLoginPopup } from "@/redux/modules/main/action";
import { HelpCircle, Mail, MessageSquare, Phone, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface AgentCardProps {
  user_data?: {
    access_token?: string;
    user?: IUserTypes;
  };
  agent_details?: any;
  property?: any;
}

export function AgentCard({ user_data, agent_details, property }: AgentCardProps) {
  const [contactMessage, setContactMessage] = useState("");
  const dispatch = useDispatch();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const { id } = useParams();

  const isLoggedIn = !!user_data?.access_token;
  const agentAssign = user_data?.user?.agent;
  const router = useRouter();

  useEffect(() => {
    const payload = {
      type: "userService",
      action: "get",
      payload: {},
    };
    sendMessage("action", payload)
  }, [])

  const handleCreateChat = () => {
    sendMessage("action", {
      type: "chatService",
      action: "create",
      payload: {
        participants: agentAssign ? user_data?.user?.agent?.agent?._id : null,
        property_id: id,
        message: contactMessage,
      },
    });
  };

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "chatService" &&
      lastEvent?.data?.request?.action === "create"
    ) {
      router.push(`${App_url.link.MESSAGE}`);
    }
  }, [lastEvent]);

  const assignedAgent =
    user_data?.user?.agent?.agent ||
    property?.agent_assigned ||
    property?.location?.agent_assigned ||
    agent_details
  null;

  const appointedAgentName = assignedAgent
    ? `${assignedAgent.first_name || ""} ${assignedAgent.last_name || ""}`.trim()
    : ""

  const appointedAgentContact = assignedAgent ? assignedAgent?.contact_no
    : "";

  const appointedAgentEmail = assignedAgent
    ? assignedAgent?.email
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-24 bg-white border border-[#F3F4F6] rounded-2xl mb-4 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      <div className="h-1 bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF]" />
      <div className="p-4 2xl:p-5">
        <div className="flex items-center gap-3 2xl:gap-4 mb-3 2xl:mb-1">
          <div className="relative flex-shrink-0 overflow-hidden rounded-full">
            <div className="w-12 h-12 2xl:w-14 2xl:h-14 overflow-hidden rounded-full bg-gradient-to-br from-[#2563EB] to-[#2563EB]/70 flex items-center justify-center text-white font-bold">
              {isLoggedIn &&
                (user_data?.user?.agent?.agent?.profile_image ||
                  agent_details?.profile_image) ? (
                <Image
                  src={
                    agentAssign
                      ? URL + (user_data?.user?.agent?.agent?.profile_image ?? "")
                      : URL + (agent_details?.profile_image ?? "")
                  }
                  alt="Agent Profile"
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <ProfileAvatar
                  name={`${isLoggedIn ? user_data?.user?.agent?.agent?.first_name || agent_details?.first_name : "Agent"} ${isLoggedIn ? user_data?.user?.agent?.agent?.last_name || agent_details?.last_name : ""}`}
                  className="!w-12 !h-12 2xl:!w-14 2xl:!h-14 !text-xl 2xl:!text-2xl border-2 border-white !text-white !bg-[#2563EB]"
                />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] 2xl:text-xs text-[#64748B] font-manrope font-semibold uppercase tracking-wider">
              Your appointed real estate agent
            </p>
            <p className="font-bold text-base 2xl:text-lg text-[#0F172A] font-manrope truncate leading-tight mt-0.5">
              {appointedAgentName}
            </p>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-2xl bg-[#22C55E15] text-[#22C55E] text-[9px] 2xl:text-xs font-manrope font-semibold tracking-wider uppercase mt-0.5">
              <ShieldCheck className="w-2.5 h-2.5 2xl:w-3 2xl:h-3" />
              Verified Agent
            </span>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-xl p-2.5 2xl:p-3 mb-3 2xl:mb-4 space-y-1">
          <a
            href={`tel:${appointedAgentContact}`}
            className="text-xs 2xl:text-sm text-[#0F172A] font-manrope font-medium flex items-center gap-2.5 hover:bg-white hover:shadow-sm rounded-lg px-2 py-1.5 transition-all duration-200 group"
          >
            <span className="flex-shrink-0 w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors">
              <Phone className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#2563EB]" />
            </span>
            {appointedAgentContact}
          </a>

          <a
            href={`mailto:${appointedAgentEmail}`}
            className="text-xs 2xl:text-sm text-[#0F172A] font-manrope font-medium flex items-center gap-2.5 hover:bg-white hover:shadow-sm rounded-lg px-2 py-1.5 transition-all duration-200 group"
          >
            <span className="flex-shrink-0 w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors">
              <Mail className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#2563EB]" />
            </span>
            <span className="truncate">{appointedAgentEmail}</span>
          </a>
        </div>

        {(!isLoggedIn || user_data?.user?.agent) && (
          <>
            <div className="mb-3 2xl:mb-4">
              <label className="flex items-center gap-1.5 text-xs 2xl:text-sm font-semibold font-manrope text-[#0F172A] mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#64748B]" />
                Ask your real estate agent
              </label>

              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="State your strategic interest for personal acquisition..."
                className="w-full p-2.5 2xl:p-3 border border-[#E2E8F0] rounded-xl placeholder:font-manrope placeholder:font-medium placeholder:text-[#94A3B8] text-xs 2xl:text-sm text-[#0F172A] resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all duration-200"
                rows={3}
              />
            </div>

            <button
              onClick={() =>
                isLoggedIn ? handleCreateChat() : dispatch(setLoginPopup(true))
              }
              className="w-full uppercase cursor-pointer text-white bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] font-manrope font-semibold text-xs 2xl:text-sm py-2.5 2xl:py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all duration-200 mb-3 2xl:mb-4 flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
              Chat with our agent
            </button>
          </>
        )}

        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.location.href = `tel:${agent_details?.contact_no || user_data?.user?.agent?.agent?.contact_no}`;
            }
          }}
          className="w-full cursor-pointer border border-[#E2E8F0] text-[#0F172A] font-manrope font-semibold text-xs 2xl:text-sm py-2 2xl:py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] hover:border-[#2563EB] transition-all duration-200 flex items-center gap-1.5 justify-center mb-3 2xl:mb-4"
        >
          <Phone className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-[#2563EB]" />
          CALL ADVISOR
        </button>

        <div className="border-t border-[#F3F4F6] pt-2.5 2xl:pt-3">
          <Link
            href={App_url.link.CONTACT_US}
            className="text-center flex justify-center items-center gap-1 font-manrope font-medium text-[11px] 2xl:text-xs text-[#94A3B8] hover:text-[#2563EB] cursor-pointer transition-colors duration-200"
          >
            <HelpCircle className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />
            CONTACT SUPPORT
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

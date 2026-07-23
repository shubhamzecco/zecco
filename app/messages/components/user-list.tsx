import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import ProfileAvatar from "@/components/profile";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { formatTime } from "@/utils/common";
import { Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

export interface IParticipant {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  active_status?: string;
}

export interface IChat {
  _id: string;
  participants: IParticipant[];
  property: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface UserListProps {
  onSelect?: (user: any) => void;
  userList?: IChat[];
  selectedUser?: IChat | null;
}

const UserList: React.FC<UserListProps> = ({
  onSelect,
  userList,
  selectedUser,
}) => {
  const { user_data } = usePosterReducers();
  const { sendMessage } = useWebSocket();

  const handleCallBack = (user: any) => {
    onSelect?.(user);
    sendMessage("action", {
      type: "chatService",
      action: "mark_as_read",
      payload: { chat_id: user?._id },
    });
  };

  return (
    <div className="flex flex-col h-full border-r bg-[#F8F9FA] overflow-hidden max-lg:rounded-2xl rounded-bl-2xl rounded-tl-2xl">
      {/* User list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="border-b mb-3 pb-2">
          <h1 className="font-bold font-manrope text-[#64748B]">
            Recent Conversations
          </h1>
        </div>
        {userList?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-3">
              <Search className="w-7 h-7 text-[#2F80FF]" />
            </div>
            <p className="text-sm font-manrope font-medium text-gray-500">
              No conversations yet
            </p>
          </div>
        ) : (
          userList?.map((user: any) => {
            const findParticipant = user?.participants?.find(
              (p: any) => p?._id !== user_data?.user?._id,
            );
            const isSelected = selectedUser?._id === user?._id;
            return (
              <div
                key={user?._id}
                onClick={() => handleCallBack(user)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 mb-0.5 group ${isSelected
                    ? "bg-[#F0FDFA] border border-[#99F6E4]"
                    : "hover:bg-[#F1F5F9]"
                  }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {findParticipant?.profile_image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                      <Image
                        src={URL + findParticipant?.profile_image}
                        alt={findParticipant?.first_name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <ProfileAvatar
                      name={`${findParticipant?.first_name} ${findParticipant?.last_name}`}
                      className={`!w-12 !h-12 !text-lg !font-bold border-2 ${isSelected
                          ? "!text-[#0F172A] bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] border-white"
                          : "!text-white !bg-[#2F80FF] border-[#EFF6FF]"
                        }`}
                    />
                  )}
                  {/* {findParticipant?.active_status !== undefined && (
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                        findParticipant?.active_status === "active"
                          ? "bg-emerald-400"
                          : "bg-red-500"
                      }`}
                    />
                  )} */}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between relative">
                    <h3 className="text-sm font-bold font-manrope truncate text-[#0F172A]">
                      {findParticipant?.first_name}{" "}
                      {findParticipant?.last_name}
                    </h3>
                    {user?.unread_count > 0 && (
                      <span
                        className={`ml-2 text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shrink-0 ${isSelected
                            ? "bg-white text-[#2F80FF]"
                            : "bg-[#2F80FF] text-white"
                          }`}
                      >
                        {user?.unread_count > 99
                          ? "99+"
                          : user?.unread_count}
                      </span>
                    )}
                    {(findParticipant?.active_status !== undefined && findParticipant?.active_status !== "active") && (
                      <span className="absolute -top-1  -right-1 px-2 bg-black/20 text-black text-xs font-bold font-manrope  py-0.5 rounded-md shadow-sm">
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p
                      className={`text-xs truncate font-manrope ${isSelected ? "text-[#64748B]" : "text-gray-400"
                        }`}
                    >
                      {user?.message || "Start a conversation..."}
                    </p>
                    <span
                      className={`text-[10px] font-manrope shrink-0 ml-2 ${isSelected ? "text-[#64748B]" : "text-gray-400"
                        }`}
                    >
                      {formatTime(user?.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default React.memo(UserList);

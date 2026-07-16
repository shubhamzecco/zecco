import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import ProfileAvatar from "@/components/profile";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { formatTime } from "@/utils/common";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface IParticipant {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
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
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    sendMessage("action", {
      type: "chatService",
      action: "list",
      payload: {
        search: search,
      },
    });
  };

  return (
    <div className="flex flex-col h-full border-r bg-[#F8F9FA] overflow-hidden rounded-bl-2xl rounded-tl-2xl">
      {/* Header */}
      {/* <div className="">
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            placeholder="Search conversations..."
            className="w-full bg-[#F1F5F9] h-10 pl-10 pr-10 rounded-xl text-sm outline-none font-manrope placeholder:text-gray-400 focus:ring-2 focus:ring-[#2F80FF]/30 focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                handleSearch();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div> */}


      {/* User list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
      <div className=" border-b mb-3 pb-2">
        <h1 className="font-bold font-manrope text-[#64748B]">Recent Conversations</h1>
      </div>
        {userList?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center mb-3">
              <Search className="w-7 h-7 text-[#2F80FF]" />
            </div>
            <p className="text-sm font-manrope font-medium text-gray-500">
              No conversations yet
            </p>
          </div>
        )}
        {userList?.map((user: any) => {
          const findParticipant = user?.participants?.find(
            (p: any) => p?._id !== user_data?.user?._id,
          );
          const isSelected = selectedUser?._id === user?._id;
          return (
            <div
              key={user?._id}
              onClick={() => {
                onSelect?.(user);
                sendMessage("action", {
                  type: "chatService",
                  action: "mark_as_read",
                  payload: { chat_id: user?._id },
                });
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 mb-0.5 group ${
                isSelected
                  ? "bg-[#F0FDFA] border border-[#99F6E4] "
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
                    className={`!w-12 !h-12 !text-lg !font-bold border-2 ${
                      isSelected
                        ? "!text-[#0F172A] bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] border-white "
                        : "!text-white !bg-[#2F80FF] border-[#EFF6FF]"
                    }`}
                  />
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-bold font-manrope truncate text-[#0F172A] `}
                  >
                    {findParticipant?.first_name} {findParticipant?.last_name}
                  </h3>
                  <span
                    className={`text-[10px] font-manrope shrink-0 ml-2 ${
                      isSelected ? "text-[#64748B]" : "text-gray-400"
                    }`}
                  >
                    {formatTime(user?.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p
                    className={`text-xs truncate font-manrope ${
                      isSelected ? "text-[#64748B]" : "text-gray-400"
                    }`}
                  >
                    {user?.message || "Start a conversation..."}
                  </p>
                  {user?.unread_count > 0 && (
                    <span
                      className={`ml-2 text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-white text-[#2F80FF]"
                          : "bg-[#2F80FF] text-white"
                      }`}
                    >
                      {user?.unread_count > 99 ? "99+" : user?.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserList;

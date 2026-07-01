import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import ProfileAvatar from "@/components/profile";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { Search } from "lucide-react";
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
    <div className="bg-[#F5F7FA] p-4 px-9 md:px-6 rounded-lg h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-md text-[#111827]">Messages</h2>
      </div>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          placeholder="Search"
          className="w-full bg-white h-11 pl-10 pr-4 rounded-xl text-sm outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      {userList?.map((user: any) => {
        const findParticipant = user?.participants?.find(
          (p: any) => p?._id !== user_data?.user?._id,
        );
        return (
          <div
            key={user?._id}
            onClick={() => {
              onSelect?.(user);
              sendMessage("action", {
                type: "chatService",
                action: "mark_as_read",
                payload: {
                  chat_id: user?._id,
                },
              });
            }}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${selectedUser?._id === user?._id ? "bg-white hover:bg-blue-100" : "hover:bg-white"} hover:bg-white transition mt-3`}
          >
            <div className="relative w-12 h-12">
              {findParticipant?.profile_image ? (
                <Image
                  src={URL + findParticipant?.profile_image}
                  alt={findParticipant?.first_name}
                  width={48}
                  height={48}
                  className="rounded-full h-full w-full object-cover"
                />
              ) : (
                <>
                  <ProfileAvatar
                    name={`${findParticipant?.first_name}  ${findParticipant?.last_name}`}
                    className="!w-12 !h-12 !text-2xl border-4 border-[#EFF6FF] !text-white !bg-[#2563EB]"
                  />
                </>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#111827]">
                {findParticipant?.first_name} {findParticipant?.last_name}
              </h3>
              <p className="text-xs text-gray-400">{user?.message}</p>
            </div>

            {user?.unread_count > 0 && (
              <span className="ml-auto bg-[#111827] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                {user?.unread_count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserList;

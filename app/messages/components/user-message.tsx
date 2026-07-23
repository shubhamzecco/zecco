"use client";

import { URL } from "@/api/rest/fetchData";
import { useWebSocket } from "@/api/socket/WebSocketContext";
import ProfileAvatar from "@/components/profile";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";
import { formatTime } from "@/utils/common";
import {
  ArrowLeft,
  Download,
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Paperclip,
  Phone,
  Send,
  Smile,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import UploadPreviewModal from "./UploadPreviewModal";

const UserMessage = ({
  isMobile = false,
  onBack,
  user,
}: {
  isMobile?: boolean;
  onBack?: () => void;
  user?: any;
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { user_data, mainReducer } = usePosterReducers();
  const { sendMessage, isConnected, lastEvent } = useWebSocket();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const findParticipant = user?.participants?.find(
    (p: any) => p?._id !== user_data?.user?._id,
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="w-5 h-5 text-orange-500" />;
      case "zip":
      case "rar":
      case "7z":
        return <FileArchive className="w-5 h-5 text-yellow-600" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <FileImage className="w-5 h-5 text-purple-500" />;
      case "mp4":
      case "mov":
      case "avi":
        return <FileVideo className="w-5 h-5 text-pink-500" />;
      case "mp3":
      case "wav":
        return <FileAudio className="w-5 h-5 text-indigo-500" />;
      case "js":
      case "ts":
      case "json":
      case "html":
      case "css":
        return <FileCode className="w-5 h-5 text-gray-600" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  useEffect(() => {
    if (user?._id) {
      sendMessage("action", {
        type: "chatService",
        action: "get_messages",
        payload: { chat_id: user?._id },
      });
    }
  }, [isConnected, user?._id]);

  useEffect(() => {
    if (
      lastEvent?.data?.status &&
      lastEvent?.data?.request?.type === "chatService" &&
      lastEvent?.data?.request?.action === "send_message"
    ) {
      sendMessage("action", {
        type: "chatService",
        action: "get_messages",
        payload: { chat_id: user?._id },
      });
      setMessage("");
    }
  }, [lastEvent]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      sendMessage("action", {
        type: "chatService",
        action: "mark_as_read",
        payload: { chat_id: user?._id },
      });
    }
  }, [mainReducer?.chat_messages_by_user]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage("action", {
      type: "chatService",
      action: "send_message",
      payload: {
        id: user?._id,
        message: message,
        attachment: [],
      },
    });
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderAttachment = (msg: any, isSender: boolean) => {
    if (!msg?.attachment?.length) return null;
    return (
      <div className="flex flex-wrap gap-3 max-w-xs mt-2">
        {msg.attachment.map((file: any, index: number) => {
          const fileUrl = URL + file?.fileUrl;
          const isImage = file?.fileType?.startsWith("image");
          const fileName = file?.originalName || "file";

          return (
            <div key={index} className="relative">
              {isImage ? (
                <div className="relative group rounded-xl overflow-hidden shadow-sm">
                  <img
                    src={fileUrl}
                    alt={fileName}
                    className="w-32 h-32 object-cover"
                  />
                  <button
                    onClick={async () => {
                      const response = await fetch(fileUrl);
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = fileName;
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                    aria-label="download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl min-w-[160px] shadow-sm ${isSender
                    ? "bg-white/15 border border-white/20"
                    : "bg-gray-50 border border-gray-100"
                    }`}
                >
                  {getIcon(
                    file?.originalName?.split(".")?.pop()?.toLowerCase(),
                  )}
                  <span
                    className={`text-xs truncate max-w-[100px] font-manrope ${isSender ? "text-white" : "text-gray-600"
                      }`}
                  >
                    {fileName}
                  </span>
                  <a
                    href={fileUrl}
                    download
                    target="_blank"
                    className={`ml-auto transition ${isSender
                      ? "text-white/70 hover:text-white"
                      : "text-gray-400 hover:text-[#2F80FF]"
                      }`}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="hidden max-lg:flex items-center gap-3 px-4 lg:px-5 py-3 bg-white border-b border-gray-100 shrink-0">
          {isMobile && (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] transition"
              aria-label="back"
            >
              <ArrowLeft size={18} className="text-[#0F172A]" />
            </button>
          )}

          <div className="relative">
            {findParticipant?.profile_image ? (
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#2F80FF]/20 shadow-sm">
                <img
                  src={URL + findParticipant?.profile_image}
                  alt={findParticipant?.first_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <ProfileAvatar
                name={`${findParticipant?.first_name} ${findParticipant?.last_name}`}
                className="!w-11 !h-11 !text-base !font-bold !text-white !bg-[#2F80FF] border-2 border-[#EFF6FF]"
              />
            )}
            {/* <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" /> */}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-[#0F172A] text-[15px] font-manrope truncate">
              {findParticipant?.first_name} {findParticipant?.last_name}
            </h2>
            <p className="text-[11px] text-gray-400 font-manrope font-medium">
              {findParticipant?.email}
            </p>
          </div>

          {!isMobile && (
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = `tel:${findParticipant?.contact_no}`;
                }
              }}
              className="w-10 h-10 rounded-full bg-[#2F80FF] text-white flex items-center justify-center hover:bg-[#2563EB] hover:scale-105 transition-all duration-200 shadow-md shadow-[#2F80FF]/30"
              aria-label="call"
            >
              <Phone size={16} />
            </button>
          )}
        </div>

        {/* Messages area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto min-h-0 px-4 lg:px-6 py-5 space-y-3 scroll-smooth"
          style={{
            // backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232F80FF' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            // backgroundColor: "#F8FAFC",
          }}
        >
          {Array.isArray(mainReducer?.chat_messages_by_user) && mainReducer?.chat_messages_by_user?.length > 0 ? (
            mainReducer?.chat_messages_by_user?.map(
              (msg: any, index: number) => {
                const isSender = msg?.sender?._id === user_data?.user?._id;
                const showAvatar =
                  index === 0 ||
                  mainReducer?.chat_messages_by_user?.[index - 1]?.sender?._id !==
                  msg?.sender?._id;

                return (
                  <div key={index}>
                    {!isSender ? (
                      <div className="flex items-end gap-2 max-w-[80%]">
                        <div className="max-w-[80%]">
                          {msg?.message && (
                            <div className="bg-[#F1F5F9] px-4 py-2.5 rounded-2xl rounded-bl-md text-sm shadow-sm border border-gray-100/80 text-[#374151] font-manrope leading-relaxed break-words">
                              {msg?.message}
                              <p className="text-[10px] text-[#64748B] mt-1 ml-1 font-manrope">
                                {formatTime(msg?.createdAt)}
                              </p>
                            </div>
                          )}
                          {renderAttachment(msg, false)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end max-w-[80%] ml-auto">
                        <div>
                          {msg?.message && (
                            <div
                              className="px-4 py-2.5 font-manrope bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] rounded-2xl rounded-br-md text-sm shadow-md text-white leading-relaxed break-words"
                            >
                              {msg?.message}
                              <p className="text-[10px] text-white/50 mt-1 ml-1 font-manrope">
                                {formatTime(msg?.createdAt)}
                              </p>
                            </div>
                          )}
                          {renderAttachment(msg, true)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              },
            )
          ) : (
              <div className="flex items-center justify-center h-full text-black font-manrope text-sm">
                No messages found
              </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-100 bg-white px-4 lg:px-5 py-3 shrink-0">
          <div className="flex items-center gap-2 border border-[#E2E8F0] bg-[#F1F5F9] rounded-2xl px-3 py-1">
            <button
              onClick={() => document.getElementById("fileUpload")?.click()}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-[#2F80FF] hover:bg-[#EFF6FF] transition-all"
              aria-label="attach"
            >
              <Paperclip size={18} />
            </button>
            <input
              id="fileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files);
                setSelectedFiles(files);
                setShowUploadModal(true);
                e.target.value = "";
              }}
            />

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                const el = e.target;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-transparent outline-none text-sm px-1 font-manrope placeholder:text-gray-400 resize-none max-h-[120px] overflow-y-auto leading-relaxed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                  }
                }
              }}
            />

            <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-amber-500 hover:bg-amber-50 transition-all">
              <Smile size={20} />
            </button>

            <button
              onClick={handleSend}
              className="w-10 h-10 -mr-1.5 rounded-xl bg-gradient-to-r from-[#2F80FF] to-[#5DAEFF] flex items-center justify-center text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
              // style={{
              //   background:
              //     message.trim()
              //       ? "linear-gradient(135deg, #2F80FF 0%, #2563EB 100%)"
              //       : "#CBD5E1",
              // }}
              aria-label="send"
            >
              <Send size={20} className="-rotate-80" />
            </button>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadPreviewModal
          files={selectedFiles}
          token={user_data?.access_token}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedFiles([]);
          }}
          onSend={(data: any) => {
            sendMessage("action", {
              type: "chatService",
              action: "send_message",
              payload: {
                id: user?._id,
                message: data?.message_content || "",
                attachment: data?.attachment || [],
              },
            });
            setShowUploadModal(false);
            setSelectedFiles([]);
          }}
        />
      )}
    </>
  );
};

export default UserMessage;

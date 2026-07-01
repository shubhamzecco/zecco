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
        payload: {
          chat_id: user?._id,
        },
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
        payload: {
          chat_id: user?._id,
        },
      });
      setMessage("");
    }
  }, [lastEvent]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
      sendMessage("action", {
        type: "chatService",
        action: "mark_as_read",
        payload: {
          chat_id: user?._id,
        },
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
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex flex-col bg-white rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 lg:px-6 py-4 bg-white shrink-0">
          {isMobile && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div className="relative">
            <div className="w-14 h-14 border rounded-full p-1 bg-white shadow-sm">
              {findParticipant?.profile_image ? (
                <img
                  src={URL + findParticipant?.profile_image}
                  alt={findParticipant?.first_name}
                  className="rounded-full w-full h-full object-cover"
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
          </div>

          <div>
            <h2 className="font-semibold text-[#111827] text-[15px]">
              {findParticipant?.first_name} {findParticipant?.last_name}
            </h2>

            <p className="text-xs text-gray-400 font-medium">Agent</p>
          </div>

          {!isMobile && (
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = `tel:${findParticipant?.contact_no}`;
                }
              }}
              className="ml-auto bg-black text-white w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 transition"
            >
              <Phone size={18} />
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto min-h-[60vh] max-h-[60vh] px-4 lg:px-6 py-5 space-y-4 bg-[#fafafa] scroll-smooth"
        >
          {mainReducer?.chat_messages_by_user?.map(
            (msg: any, index: number) => {
              const isSender = msg?.sender?._id === user_data?.user?._id;
              return (
                <div key={index}>
                  {!isSender ? (
                    <div className="flex items-end gap-2">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm shrink-0">
                        {msg?.sender?.first_name?.[0]}
                        {msg?.sender?.last_name?.[0]}
                      </div>

                      <div className="max-w-[75%]">
                        {msg?.message && (
                          <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md text-sm shadow-sm border border-gray-100 text-gray-700">
                            {msg?.message}
                          </div>
                        )}
                        {msg?.attachment?.length > 0 && (
                          <div className="flex flex-wrap gap-3 max-w-xs">
                            {msg?.attachment?.map((file: any, index: number) => {
                              const fileUrl = URL + file?.fileUrl;
                              const isImage =
                                file?.fileType?.startsWith("image");
                              const fileName = file?.originalName || "file";

                              return (
                                <div key={index} className="relative">
                                  {/* ✅ IMAGE */}
                                  {isImage ? (
                                    <div className="relative group">
                                      <img
                                        src={fileUrl}
                                        alt={fileName}
                                        className="w-32 h-32 object-cover rounded-lg border"
                                      />

                                      {/* Download */}
                                      <button
                                        onClick={async () => {
                                          const response = await fetch(fileUrl);
                                          const blob = await response.blob();

                                          const url =
                                            window.URL.createObjectURL(blob);
                                          const link =
                                            document.createElement("a");

                                          link.href = url;
                                          link.download = fileName; // 👈 actual file name
                                          document.body.appendChild(link);
                                          link.click();

                                          link.remove();
                                          window.URL.revokeObjectURL(url);
                                        }}
                                        className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                                      >
                                        <Download className="w-5 h-5" />
                                      </button>
                                    </div>
                                  ) : (
                                    /* ✅ FILE */
                                    <div className="flex items-center gap-2 bg-gray-100 border px-3 py-3 rounded-lg min-w-[160px]">
                                      {getIcon(
                                        file?.originalName
                                          ?.split(".")
                                          ?.pop()
                                          ?.toLowerCase(),
                                      )}

                                      <span className="text-xs truncate max-w-md">
                                        {fileName}
                                      </span>

                                      <a
                                        href={fileUrl}
                                        download
                                        target="_blank"
                                        className="ml-auto text-gray-600 hover:text-black"
                                      >
                                        <Download className="w-5 h-5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <p className="text-[10px] text-gray-400 mt-1 ml-1">
                          {formatTime(msg?.createdAt)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="max-w-[75%]">
                        {msg?.message && (
                          <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md text-sm shadow-md">
                            {msg?.message}
                          </div>
                        )}
                        {msg?.attachment?.length > 0 && (
                          <div className="flex flex-wrap gap-3 max-w-xs">
                            {msg?.attachment?.map((file: any, index: number) => {
                              const fileUrl = URL + file?.fileUrl;
                              const isImage =
                                file?.fileType?.startsWith("image");
                              const fileName = file?.originalName || "file";

                              return (
                                <div key={index} className="relative">
                                  {/* ✅ IMAGE */}
                                  {isImage ? (
                                    <div className="relative group">
                                      <img
                                        src={fileUrl}
                                        alt={fileName}
                                        className="w-32 h-32 object-cover rounded-lg border"
                                      />

                                      {/* Download */}
                                      <button
                                        onClick={async () => {
                                          const response = await fetch(fileUrl);
                                          const blob = await response.blob();

                                          const url =
                                            window.URL.createObjectURL(blob);
                                          const link =
                                            document.createElement("a");

                                          link.href = url;
                                          link.download = fileName; // 👈 actual file name
                                          document.body.appendChild(link);
                                          link.click();

                                          link.remove();
                                          window.URL.revokeObjectURL(url);
                                        }}
                                        className="absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                                      >
                                        <Download className="w-5 h-5" />
                                      </button>
                                    </div>
                                  ) : (
                                    /* ✅ FILE */
                                    <div className="flex items-center gap-2 bg-gray-100 border px-3 py-3 rounded-lg min-w-[160px]">
                                      {getIcon(
                                        file?.originalName
                                          ?.split(".")
                                          ?.pop()
                                          ?.toLowerCase(),
                                      )}

                                      <span className="text-xs truncate max-w-md">
                                        {fileName}
                                      </span>

                                      <a
                                        href={fileUrl}
                                        download
                                        target="_blank"
                                        className="ml-auto text-gray-600 hover:text-black"
                                      >
                                        <Download className="w-5 h-5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1 pr-1">
                          <p className="text-[10px] text-gray-400">
                            {formatTime(msg?.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            },
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-white px-4 lg:px-6 py-4 shrink-0">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm px-2"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={() => document.getElementById("fileUpload")?.click()}
              className="hover:bg-[#deffde] text-gray-500 rounded-lg"
            >
              <Paperclip size={20} />
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

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white min-w-[44px] h-11 rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-md"
            >
              <Send size={18} className="rotate-45" />
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

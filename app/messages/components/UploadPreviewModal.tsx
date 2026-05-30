"use client";

import React, { useEffect, useState } from "react";
import { Send, X, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import CommonApiRequest, { URL } from "@/api/rest/fetchData";
import { App_url } from "@/constant/static";
import {
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  File,
} from "lucide-react";
import { usePosterReducers } from "@/redux/getdata/usePostReducer";

export default function UploadPreviewModal({
  files,
  onClose,
  onSend,
  token,
}: any) {
  const MAX_FILE_SIZE = 3.1 * 1024 * 1024; // 3MB
  const MAX_FILES = 3;
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState<{ [key: number]: number }>({});
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [localFiles, setLocalFiles] = useState<File[]>(
    files
      .filter((file: File) => file.size <= MAX_FILE_SIZE)
      .slice(0, MAX_FILES),
  );
  const [uploadedIndexes, setUploadedIndexes] = useState<number[]>([]);
  if (typeof window === "undefined") return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-8 h-8 text-red-500" />;

      case "doc":
      case "docx":
        return <FileText className="w-8 h-8 text-blue-500" />;

      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="w-8 h-8 text-green-500" />;

      case "ppt":
      case "pptx":
        return <FileText className="w-8 h-8 text-orange-500" />;

      case "zip":
      case "rar":
      case "7z":
        return <FileArchive className="w-8 h-8 text-yellow-600" />;

      case "mp4":
      case "mov":
      case "avi":
        return <FileVideo className="w-8 h-8 text-pink-500" />;

      case "mp3":
      case "wav":
        return <FileAudio className="w-8 h-8 text-indigo-500" />;

      case "js":
      case "ts":
      case "json":
      case "html":
      case "css":
        return <FileCode className="w-8 h-8 text-gray-600" />;

      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  useEffect(() => {
    if (localFiles.length > 0) {
      uploadFiles(localFiles);
    }
  }, [localFiles]);

  const removeFile = (index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddMore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE,
    );

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE,
    );

    if (oversizedFiles.length > 0) {
      alert("Each file must be less than or equal to 3 MB.");
    }

    setLocalFiles((prev) => {
      const updatedFiles = [...prev, ...validFiles];

      if (updatedFiles.length > MAX_FILES) {
        alert("You can upload a maximum of 3 files.");
      }

      return updatedFiles.slice(0, MAX_FILES);
    });

    e.target.value = "";
  };

  /* ================= UPLOAD ================= */
  const uploadFiles = async (filesToUpload: File[]) => {
    setUploading(true);

    const results = [...uploadedFiles];
    const newUploadedIndexes = [...uploadedIndexes];

    for (let i = 0; i < filesToUpload.length; i++) {
      if (newUploadedIndexes.includes(i)) continue;

      const formData = new FormData();
      formData.append("file", filesToUpload[i]);

      const response = await CommonApiRequest(
        "POST",
        App_url?.endpoint_url?.UPLOAD_FILE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event: any) => {
            const percent = Math.round((event.loaded * 100) / event.total);

            setProgress((prev) => ({
              ...prev,
              [i]: percent,
            }));
          },
        },
      );
      if (response?.status === 201) {
        results[i] = response?.data;
        newUploadedIndexes.push(i);
      }
    }

    setUploadedFiles(results);
    setUploadedIndexes(newUploadedIndexes);
    setUploading(false);
  };
  /* ================= SEND ================= */
  const handleSend = async () => {
    onSend({
      message_content: caption,
      attachment: uploadedFiles,
    });

    onClose();
  };
  const isUploadingDone = uploadedIndexes.length === localFiles.length;
  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-2xl rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-semibold text-gray-800">
            {localFiles.length} files selected
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#135D7B] hover:bg-red-600 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-wrap gap-4 p-5 overflow-auto bg-gray-100">
          {/* Files */}
          {localFiles.map((file: File, index: number) => {
            const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
            const isImage = file.type.startsWith("image");
            const uploaded = uploadedFiles[index];
            const url = uploaded
              ? URL + uploaded.fileUrl
              : globalThis.URL.createObjectURL(file);

            return (
              <div
                key={index}
                className="relative w-32 h-32 bg-gray-300 rounded-lg overflow-hidden"
              >
                {/* ❌ Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 z-10"
                >
                  <X size={14} />
                </button>
                {/* Preview */}

                {isImage ? (
                  <img src={url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2 text-center">
                    {getIcon(fileExt)}

                    <span className="text-[10px] break-all line-clamp-2">
                      {uploaded?.original_name || file.name}
                    </span>
                  </div>
                )}
                {/* Progress */}
                {uploading && (
                  <div className="absolute bottom-0 left-0 w-full bg-black/40">
                    <div
                      className="bg-green-500 h-1"
                      style={{ width: `${progress[index] || 0}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {/* ➕ Add More Button */}
          {localFiles.length < MAX_FILES && (
            <label className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
              <Plus className="text-gray-500" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleAddMore}
              />
            </label>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-end items-center">
          <button
            disabled={!isUploadingDone}
            onClick={handleSend}
            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${
              isUploadingDone
                ? "bg-green-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send <Send className="w-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

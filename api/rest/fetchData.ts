"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */
import { toast } from "react-toastify";
import { setShowModalPopup } from "../../redux/actions/action";
import { ILoginTypes } from "@/utils/types";
import axios, { type AxiosRequestConfig, type Method } from "axios";

export const URL = process.env.NEXT_PUBLIC_ENDPOINT_API_URL;

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}

const CommonApiRequest = async <T, B = unknown>(
  method: Method,
  endpoint: string,
  data?: B,
  config: AxiosRequestConfig = {},
  access_token?: string,
): Promise<ApiResponse<T>> => {
  try {
    const response = await axios({
      method,
      url: `${URL}${endpoint}`,
      data: method.toLowerCase() === "get" ? undefined : data,
      params: method.toLowerCase() === "get" ? data : undefined,
      withCredentials: true,
      headers: {
        Authorization: access_token ? `Bearer ${access_token}` : "",
        ...config.headers,
      },
      ...config,
    });

    return {
      ...response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as {
      response?: {
        status?: number;
        data?: unknown;
        message?: string;
      };
    };

    return {
      status: err.response?.status ?? 500,
      data: (err.response?.data ?? {}) as T,
      message: err.response?.message || "",
    };
  }
};

export default CommonApiRequest;


export function fetchData(
  url: string,
  method: any,
  headers: any = {},
  data: any = null,
  params: any = null
) {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      headers,
      data,
      params,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          const errorMessage =
            error.response.data.error ||
            error.response.data.message ||
            "An error occurred";
          if (errorMessage !== "Unauthorized") toast.error(errorMessage);
          reject(error);
        } else if (error.request) {
          // The request was made but no response was received
          toast.error("No response received from server.");
          console.error("No response received:", error.request);
          reject("No response received from server.");
        } else {
          // Something happened in setting up the request that triggered an error
          toast.error(`Request failed: ${error.message}`);
          console.error("Request failed:", error.message);
          reject(`Request failed: ${error.message}`);
        }
      });
  });
}

export const postDoc = async (
  url: string,
  token: string,
  body: any,
  dispatch?: any,
  download?: boolean,
  FileName?: any
): Promise<any> => {
  try {
    const response = await fetch(`${URL}${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    if (response?.status === 200) {
      // Optionally handle status-specific logic here
    }
    const contentType = response.headers.get("Content-Type");
    if (contentType && !contentType.includes("application/json")) {
      // If the response is any file (non-JSON data)
      const blob = await response.blob();
      const contentDisposition = response.headers.get("content-disposition");

      let filename = FileName || "file"; // Default filename if not provided

      // Extract filename from Content-Disposition header if it exists
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=([^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, ""); // Clean up any quotes
        }
      }

      if (dispatch) {
        if (download) {
          // Download the file
          await downloadFile(blob, filename, contentType);
        } else {
          // Open the file in a new tab (optional)
          await openFileInNewTab(blob, dispatch, FileName);
        }
      }

      return "File processed";
    } else {
      // Handle JSON response
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const getDataMe = async (
  url: string,
  token: string,
  dispatch?: any,
  withCredentials: boolean = false
): Promise<any> => {
  try {
    const response = await fetch(`${URL}${url}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      },
      credentials: withCredentials ? "include" : "same-origin", // ✅ allow cookies
    });

    if (!response.ok) return response;

    const contentType = response.headers.get("Content-Type");
    if (contentType && !contentType.includes("application/json")) {
      const blob = await response.blob();
      return blob;
    }

    return await response.json();
  } catch (error) {
    return error;
  }
};

export const getData = async (
  url: string,
  token: string,
  dispatch?: any,
  download?: boolean,
  FileName?: string,
  onProgress?: (percent: number) => void
): Promise<any> => {
  try {
    const response = await fetch(`${URL}${url}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      credentials: "include",
    });

    if (!response?.ok) {
      try {
        const errorData = await response.json();
        toast.error(errorData?.message);
      } catch (e) {
        return { message: "Unknown error" };
      }
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && !contentType.includes("application/json")) {
      const contentDisposition = response.headers.get("content-disposition");

      let filename = FileName || "file";

      if (contentDisposition) {
        const matches = /filename[^;=\n]*=([^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      const reader = response.body?.getReader();

      let received = 0;
      const chunks: BlobPart[] = [];

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.length;
            if (total && onProgress) {
              const percent = Math.round((received / total) * 100);
              onProgress(percent);
            }
          }
        }
      }

      const blob = new Blob(chunks, { type: contentType });
      const fileType = getFileType(filename);

      if (dispatch) {
        if (download || fileType !== "pdf") {
          await downloadFile(blob, filename, contentType);
        } else if (
          contentType === "application/pdf" ||
          filename?.endsWith(".pdf")
        ) {
          await openFileInNewTab(blob, dispatch, FileName);
        } else {
          await downloadFile(blob, filename, contentType);
        }
      }

      return response;
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    return error;
  }
};

// Function to handle file download with any file type
const downloadFile = (blob: Blob, filename: string, contentType: string) => {
  if (typeof window !== "undefined") {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "downloaded_file";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};

// Function to open a file in a new tab (optional use case)
const openFileInNewTab = (blob: Blob, dispatch?: any, filename?: any) => {
  if (typeof window !== "undefined") {
    const url = window.URL.createObjectURL(blob);
    dispatch(
      setShowModalPopup({
        show: "PREVIEW",
        data: { url: url, filename: filename },
      })
    );
  }
};

export const postData = async (
  url: string,
  data_req?: any,
  token?: string,
  content_type: "application/json" | "multipart/form-data" = "application/json"
): Promise<any> => {
  try {
    const headers = {
      // Accept: "application/json",
      "Content-Type": content_type,
      Authorization: "Bearer " + token,
    };
    const data = await fetchData(`${URL}${url}`, "POST", headers, data_req);
    return data;
  } catch (error) {
    return error;
  }
};

export const downloadZipFile = async (
  url: string,
  data_req: any,
  token: string,
  content_type: "application/json" | "multipart/form-data" = "application/json",
  responseType: "json" | "arraybuffer" | "blob" = "json" // <-- add this
): Promise<any> => {
  try {
    const headers: any = {
      "Content-Type": content_type,
      Authorization: "Bearer " + token,
    };

    const response = await fetch(`${URL}${url}`, {
      method: "POST",
      headers,
      body:
        content_type === "application/json"
          ? JSON.stringify(data_req)
          : data_req,
    });

    if (!response.ok) throw new Error("Request failed: " + response.status);

    // Handle response type
    if (responseType === "arraybuffer") {
      return await response.arrayBuffer();
    } else if (responseType === "blob") {
      return await response.blob();
    } else {
      return await response.json();
    }
  } catch (error) {
    return error;
  }
};

export const patchData = async (
  url: string,
  data_req: any,
  token: string,
  content_type: "application/json" | "multipart/form-data" = "application/json"
): Promise<any> => {
  try {
    const headers = {
      // Accept: "application/json",
      "Content-Type": content_type,
      Authorization: "Bearer " + token,
    };
    const data = await fetchData(`${URL}${url}`, "PATCH", headers, data_req);
    return data;
  } catch (error) {
    return error;
  }
};

// export const AuthReq = async (
//   url: string,
//   data_req: ILoginTypes,
//   withCredentials?: boolean
// ): Promise<any> => {
//   try {
//     const data = await fetchData(
//       `${URL}${url}`,
//       "POST",
//       {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       data_req,
//       withCredentials
//     );
//     return data;
//   } catch (error) {
//     return error;
//   }
// };

export const AuthReq = async (
  url: string,
  data_req: ILoginTypes
): Promise<any> => {
  try {
    const response = await fetch(`${URL}${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // VERY IMPORTANT: use "include" for cookies across domains
      // credentials: withCredentials ? "include" : "same-origin",
      body: JSON.stringify(data_req),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("AuthReq Error:", error);
    toast.error(error as any);
    return error;
  }
};

export const getImage = async (
  url: string,
  token: string
): Promise<string | null | undefined> => {
  try {
    const response = await fetch(`${URL}${url}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }
    const blob = await response.blob();
    if (typeof window !== "undefined") {
      const imageUrl = window.URL.createObjectURL(blob);
      return imageUrl;
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

export function getFileType(filename: string): string | null {
  const regex = /\.([a-zA-Z0-9]+)$/; // Matches the last extension after a dot
  const match = filename?.match?.(regex);

  return match ? match[1] : null; // Return the extension or null if not found
}

export const getApi = async (
  url: string,
  config: { withCredentials?: boolean } = {}
) => {
  try {
    const response = await axios.get(`${URL}${url}`, {
      withCredentials: config.withCredentials ?? false,
    });
    return response?.data;
  } catch (error: any) {
    console.error("GET API Error:", error?.response?.data || error.message);
    return error;
  }
};


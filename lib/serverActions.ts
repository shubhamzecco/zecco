import "server-only";
import { io } from "socket.io-client";

const API_URL =
  process.env.NEXT_PUBLIC_ENDPOINT_API_URL || "http://localhost:8000";

const DEFAULT_TIMEOUT = 4000;

type SocketResponse = {
  request?: {
    type?: string;
    action?: string;
  };
  data?: any;
  status?: boolean;
};

async function socketFetch<T = any>(
  type: string,
  action: string,
  payload: any = {},
  options: { timeout?: number; auth?: Record<string, any> } = {},
): Promise<T> {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT;

  try {
    const socket = io(API_URL, {
      auth: options.auth,
      transports: ["websocket"],
      reconnection: false,
      timeout: 3000,
    });

    return await new Promise<T>((resolve) => {
      const timer = setTimeout(() => {
        try {
          socket.disconnect();
        } catch (_) {}
        resolve(null as T);
      }, timeout);

      const cleanup = () => {
        clearTimeout(timer);
        try {
          socket.disconnect();
        } catch (_) {}
      };

      socket.on("connect", () => {
        socket.emit("action", { type, action, payload });
      });

      socket.onAny((_event: string, res: SocketResponse) => {
        if (
          res?.request?.type === type &&
          res?.request?.action === action
        ) {
          cleanup();
          resolve(res?.data ?? (null as T));
        }
      });

      socket.on("connect_error", () => {
        cleanup();
        resolve(null as T);
      });
    });
  } catch (err) {
    console.error(`[socketFetch] ${type}.${action} error:`, err);
    return null as T;
  }
}

export async function serverFetchPropertyList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return socketFetch("propertyService", "list", payload, options);
}

export async function serverFetchPropertyDetail(
  id: string,
  options?: { timeout?: number },
): Promise<any> {
  return socketFetch("propertyService", "get", { id }, options);
}

export async function serverFetchLocationList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return socketFetch("locationService", "list", payload, options);
}

export async function serverFetchAreaList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return socketFetch("locationService", "areas_list", payload, options);
}

export async function serverFetchPackageList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return socketFetch("packageService", "list", payload, options);
}

export async function serverFetchTermsConditions(
  options?: { timeout?: number },
): Promise<any> {
  return socketFetch("termsConditionsService", "get", {}, options);
}

export async function serverFetchPrivacyPolicy(
  options?: { timeout?: number },
): Promise<any> {
  return socketFetch("privacyPolicyService", "get", {}, options);
}

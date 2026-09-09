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

type CacheEntry = {
  value: any;
  expires: number;
};

const serverCache = new Map<string, CacheEntry>();
const inFlightCache = new Map<string, Promise<any>>();

function withCache<T>(
  key: string,
  ttlMs: number,
  fetchFn: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const hit = serverCache.get(key);
  if (hit && hit.expires > now) return Promise.resolve(hit.value);

  const pending = inFlightCache.get(key);
  if (pending) return pending;

  const run = (async () => {
    try {
      const value = await fetchFn();
      if (value !== null && value !== undefined) {
        serverCache.set(key, { value, expires: Date.now() + ttlMs });
      }
      return value;
    } finally {
      inFlightCache.delete(key);
    }
  })();

  inFlightCache.set(key, run);
  return run;
}

export async function serverFetchPropertyList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `propertyList:${JSON.stringify(payload)}`,
    2 * 60 * 1000,
    () => socketFetch("propertyService", "list", payload, options),
  );
}

export async function serverFetchFavoriteList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `favoriteList:${JSON.stringify(payload)}`,
    2 * 60 * 1000,
    () =>
      socketFetch(
        "propertyService",
        "list",
        { favorite: true, ...payload },
        options,
      ),
  );
}

export async function serverFetchPropertyDetail(
  id: string,
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `propertyDetail:${id}`,
    5 * 60 * 1000,
    () => socketFetch("propertyService", "get", { id }, options),
  );
}

export async function serverFetchLocationList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `locationList:${JSON.stringify(payload)}`,
    10 * 60 * 1000,
    () => socketFetch("locationService", "list", payload, options),
  );
}

export async function serverFetchAreaList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `areaList:${JSON.stringify(payload)}`,
    10 * 60 * 1000,
    () => socketFetch("locationService", "areas_list", payload, options),
  );
}

export async function serverFetchAllLocationList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `allLocationList:${JSON.stringify(payload)}`,
    10 * 60 * 1000,
    () =>
      socketFetch(
        "locationService",
        "searchLocationArea",
        payload,
        options,
      ),
  );
}

export async function serverFetchPackageList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `packageList:${JSON.stringify(payload)}`,
    30 * 60 * 1000,
    () => socketFetch("packageService", "list", payload, options),
  );
}

export async function serverFetchTermsConditions(
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    "termsConditions",
    60 * 60 * 1000,
    () => socketFetch("termsConditionsService", "get", {}, options),
  );
}

export async function serverFetchPrivacyPolicy(
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    "privacyPolicy",
    60 * 60 * 1000,
    () => socketFetch("privacyPolicyService", "get", {}, options),
  );
}

export async function serverFetchPrebuiltSuggestions(): Promise<any[]> {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_ENDPOINT_API_URL ||
    "http://localhost:8000";

  try {
    const res = await fetch(
      `${base}/api/search/prebuilt-suggestions`,
      {
        method: "GET",
        headers: { accept: "*/*" },
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const suggestions = json?.data?.suggestions;
    return Array.isArray(suggestions) ? suggestions : [];
  } catch {
    return [];
  }
}

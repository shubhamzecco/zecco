import "server-only";

type CacheEntry = {
  value: any;
  expires: number;
};

const serverCache = new Map<string, CacheEntry>();
const inFlightCache = new Map<string, Promise<any>>();

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_ENDPOINT_API_URL ||
  "http://localhost:8000";

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

async function restFetch<T = any>(
  url: string,
  options: {
    method?: string;
    body?: any;
    timeout?: number;
  } = {},
): Promise<T> {
  const { method = "GET", body, timeout = 10000 } = options;
  try {
    const res = await fetch(`${API_URL}${url}`, {
      method,
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(timeout),
    });
    if (!res.ok) return null as T;
    const json = await res.json();
    return json as T;
  } catch {
    return null as T;
  }
}

export async function serverFetchPropertyList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `propertyList:${JSON.stringify(payload)}`,
    5 * 60 * 1000,
    () =>
      restFetch("/api/property/list", {
        method: "POST",
        body: payload,
        timeout: options?.timeout,
      }),
  );
}

export async function serverFetchFavoriteList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `favoriteList:${JSON.stringify(payload)}`,
    5 * 60 * 1000,
    () =>
      restFetch("/api/property/list", {
        method: "POST",
        body: { favorite: true, ...payload },
        timeout: options?.timeout,
      }),
  );
}

export async function serverFetchPropertyDetail(
  id: string,
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `propertyDetail:${id}`,
    10 * 60 * 1000,
    () =>
      restFetch(`/api/property/${encodeURIComponent(id)}`, {
        timeout: options?.timeout,
      }),
  );
}

export async function serverFetchLocationList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `locationList:${JSON.stringify(payload)}`,
    15 * 60 * 1000,
    () =>
      restFetch("/api/location/list", {
        method: "POST",
        body: payload,
        timeout: options?.timeout,
      }),
  );
}

export async function serverFetchAreaList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `areaList:${JSON.stringify(payload)}`,
    15 * 60 * 1000,
    () =>
      restFetch("/api/location/areas-list", {
        method: "POST",
        body: payload,
        timeout: options?.timeout,
      }),
  );
}

export async function serverFetchAllLocationList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `allLocationList:${JSON.stringify(payload)}`,
    15 * 60 * 1000,
    () =>
      restFetch("/api/location/search-area", {
        method: "POST",
        body: payload,
        timeout: options?.timeout,
      }),
  );
}

export async function serverFetchPackageList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    `packageList:${JSON.stringify(payload)}`,
    30 * 60 * 1000,
    () =>
      restFetch("/api/package/list", {
        method: "POST",
        body: payload,
        timeout: options?.timeout,
      }),
  );
}

export async function serverFetchTermsConditions(
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    "termsConditions",
    60 * 60 * 1000,
    () => restFetch("/api/termsConditions", { timeout: options?.timeout }),
  );
}

export async function serverFetchPrivacyPolicy(
  options?: { timeout?: number },
): Promise<any> {
  return withCache(
    "privacyPolicy",
    60 * 60 * 1000,
    () => restFetch("/api/privacyPolicy", { timeout: options?.timeout }),
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

export async function serverFetchAllPropertyList(
  payload: any = {},
  options?: { timeout?: number; maxItems?: number },
): Promise<{ data: any[]; pagination?: any }> {
  const maxItems = options?.maxItems ?? 5000;
  const cacheKey: any = { ...payload };
  delete cacheKey.limit;
  delete cacheKey.page;

  return withCache(
    `allPropertyList:${JSON.stringify(cacheKey)}`,
    10 * 60 * 1000,
    async () => {
      const first: any =
        (await restFetch("/api/property/list", {
          method: "POST",
          body: { ...payload, limit: 1000, page: 1 },
          timeout: options?.timeout,
        })) || {};
      const firstData = Array.isArray(first?.data) ? first.data : [];
      const total = first?.pagination?.totalCount ?? firstData.length;

      const data = [...firstData];
      const pages = Math.min(
        Math.ceil(total / 1000),
        Math.ceil(maxItems / 1000),
      );

      for (let p = 2; p <= pages; p++) {
        const res: any =
          (await restFetch("/api/property/list", {
            method: "POST",
            body: { ...payload, limit: 1000, page: p },
            timeout: options?.timeout,
          })) || {};
        data.push(...(Array.isArray(res?.data) ? res.data : []));
        if (data.length >= maxItems || data.length >= total) break;
      }

      return {
        data: data.slice(0, maxItems),
        pagination: { ...(first?.pagination || {}), totalCount: total },
      };
    },
  );
}

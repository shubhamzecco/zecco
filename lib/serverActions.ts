import "server-only";
import { unstable_cache } from "next/cache";

const inFlightCache = new Map<string, Promise<any>>();

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_ENDPOINT_API_URL ||
  "http://localhost:8000";

function withInFlightDedupe<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const pending = inFlightCache.get(key);
  if (pending) return pending;

  const run = (async () => {
    try {
      return await fetchFn();
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
    revalidate?: number | false;
    tags?: string[];
  } = {},
): Promise<T> {
  const { method = "GET", body, timeout = 10000, revalidate = 300, tags } = options;
  try {
    const fetchOptions: RequestInit = {
      method,
      headers: { "Content-Type": "application/json", accept: "*/*" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeout),
    };

    if (revalidate === false) {
      fetchOptions.cache = "no-store";
    } else if (method === "GET") {
      (fetchOptions as any).next = { revalidate, ...(tags ? { tags } : {}) };
    }

    const res = await fetch(`${API_URL}${url}`, fetchOptions);
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
  const cacheKey = JSON.stringify(payload);
  return withInFlightDedupe(`propertyList:${cacheKey}`, () =>
    unstable_cache(
      async () => {
        return restFetch("/api/property/list", {
          method: "POST",
          body: payload,
          timeout: options?.timeout,
        });
      },
      ["server-property-list", cacheKey],
      { revalidate: 300, tags: ["properties"] },
    )(),
  );
}

export async function serverFetchFavoriteList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  const body = { favorite: true, ...payload };
  const cacheKey = JSON.stringify(body);
  return withInFlightDedupe(`favoriteList:${cacheKey}`, () =>
    unstable_cache(
      async () => {
        return restFetch("/api/property/list", {
          method: "POST",
          body,
          timeout: options?.timeout,
        });
      },
      ["server-favorite-list", cacheKey],
      { revalidate: 300, tags: ["favorites", "properties"] },
    )(),
  );
}

export async function serverFetchPropertyDetail(
  idOrSlug: string,
  options?: { timeout?: number },
): Promise<any> {
  if (!idOrSlug) return null;
  // Extract 24-character hexadecimal MongoDB ID if a slug is provided
  const extractedId = idOrSlug.match(/[a-f0-9]{24}/i)?.[0] || idOrSlug;

  return withInFlightDedupe(`propertyDetail:${extractedId}`, () =>
    unstable_cache(
      async () => {
        return restFetch(`/api/property/${encodeURIComponent(extractedId)}`, {
          timeout: options?.timeout,
          revalidate: 600,
          tags: ["property-detail", `property-${extractedId}`],
        });
      },
      ["server-property-detail", extractedId],
      { revalidate: 600, tags: ["property-detail", `property-${extractedId}`] },
    )(),
  );
}

export async function serverFetchLocationList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  const cacheKey = JSON.stringify(payload);
  return withInFlightDedupe(`locationList:${cacheKey}`, () =>
    unstable_cache(
      async () => {
        return restFetch("/api/location/list", {
          method: "POST",
          body: payload,
          timeout: options?.timeout,
        });
      },
      ["server-location-list", cacheKey],
      { revalidate: 900, tags: ["locations"] },
    )(),
  );
}

export async function serverFetchAreaList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  const cacheKey = JSON.stringify(payload);
  return withInFlightDedupe(`areaList:${cacheKey}`, () =>
    unstable_cache(
      async () => {
        return restFetch("/api/location/areas-list", {
          method: "POST",
          body: payload,
          timeout: options?.timeout,
        });
      },
      ["server-area-list", cacheKey],
      { revalidate: 900, tags: ["areas"] },
    )(),
  );
}

export async function serverFetchAllLocationList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  const cacheKey = JSON.stringify(payload);
  return withInFlightDedupe(`allLocationList:${cacheKey}`, () =>
    unstable_cache(
      async () => {
        return restFetch("/api/location/search-area", {
          method: "POST",
          body: payload,
          timeout: options?.timeout,
        });
      },
      ["server-all-location-list", cacheKey],
      { revalidate: 900, tags: ["all-locations"] },
    )(),
  );
}

export async function serverFetchPackageList(
  payload: any = {},
  options?: { timeout?: number },
): Promise<any> {
  const cacheKey = JSON.stringify(payload);
  return withInFlightDedupe(`packageList:${cacheKey}`, () =>
    unstable_cache(
      async () => {
        return restFetch("/api/package/list", {
          method: "POST",
          body: payload,
          timeout: options?.timeout,
        });
      },
      ["server-package-list", cacheKey],
      { revalidate: 1800, tags: ["packages"] },
    )(),
  );
}

export async function serverFetchTermsConditions(
  options?: { timeout?: number },
): Promise<any> {
  return withInFlightDedupe("termsConditions", () =>
    unstable_cache(
      async () => {
        return restFetch("/api/termsConditions", {
          timeout: options?.timeout,
          revalidate: 3600,
          tags: ["terms"],
        });
      },
      ["server-terms-conditions"],
      { revalidate: 3600, tags: ["terms"] },
    )(),
  );
}

export async function serverFetchPrivacyPolicy(
  options?: { timeout?: number },
): Promise<any> {
  return withInFlightDedupe("privacyPolicy", () =>
    unstable_cache(
      async () => {
        return restFetch("/api/privacyPolicy", {
          timeout: options?.timeout,
          revalidate: 3600,
          tags: ["privacy"],
        });
      },
      ["server-privacy-policy"],
      { revalidate: 3600, tags: ["privacy"] },
    )(),
  );
}

export async function serverFetchPrebuiltSuggestions(): Promise<any[]> {
  return withInFlightDedupe("prebuiltSuggestions", () =>
    unstable_cache(
      async () => {
        try {
          const res = await fetch(`${API_URL}/api/search/prebuilt-suggestions`, {
            method: "GET",
            headers: { accept: "*/*" },
            signal: AbortSignal.timeout(4000),
          });
          if (!res.ok) return [];
          const json = await res.json();
          const suggestions = json?.data?.suggestions;
          return Array.isArray(suggestions) ? suggestions : [];
        } catch {
          return [];
        }
      },
      ["server-prebuilt-suggestions"],
      { revalidate: 1800, tags: ["suggestions"] },
    )(),
  );
}

export async function serverFetchAllPropertyList(
  payload: any = {},
  options?: { timeout?: number; maxItems?: number },
): Promise<{ data: any[]; pagination?: any }> {
  const maxItems = options?.maxItems ?? 5000;
  const cacheKey: any = { ...payload };
  delete cacheKey.limit;
  delete cacheKey.page;

  const keyString = JSON.stringify(cacheKey);

  return withInFlightDedupe(`allPropertyList:${keyString}`, () =>
    unstable_cache(
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
      ["server-all-property-list", keyString],
      { revalidate: 600, tags: ["properties"] },
    )(),
  );
}

// src/api/strapiClient.ts
import { NEXT_PUBLIC_STRAPI_BASE_URL, NEXT_PUBLIC_STRAPI_TOKEN } from './env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

export async function strapiRequest<T = any>(
  endpoint: string,
  method: HttpMethod = 'GET',
  options: RequestOptions = {},
): Promise<T> {
  try {
    const url = new URL(`${NEXT_PUBLIC_STRAPI_BASE_URL}${endpoint}`);

    // Append query params if provided
    if (options?.params) {
      Object.entries(options?.params)?.forEach(([key, value]) =>
        url?.searchParams?.append(key, String(value)),
      );
    }

    // Always include Bearer token from env.ts
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NEXT_PUBLIC_STRAPI_TOKEN}`,
      ...options.headers,
    };

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: options?.data ? JSON.stringify(options?.data) : undefined,
      cache: 'no-store',
    });

    if (!res?.ok) {
      const text = await res?.text();
      throw new Error(text || `Strapi ${method} request failed`);
    }

    return (await res?.json()) as T;
  } catch (err: any) {
    console.error('[Strapi Client Error]:', err?.message);
    throw err;
  }
}

// --- Convenience wrappers ---
export const strapiGet = <T = any>(
  endpoint: string,
  params?: Record<string, any>,
) => strapiRequest<T>(endpoint, 'GET', { params });

export const strapiPost = <T = any>(endpoint: string, data?: any) =>
  strapiRequest<T>(endpoint, 'POST', { data });

export const strapiPut = <T = any>(endpoint: string, data?: any) =>
  strapiRequest<T>(endpoint, 'PUT', { data });

export const strapiPatch = <T = any>(endpoint: string, data?: any) =>
  strapiRequest<T>(endpoint, 'PATCH', { data });

export const strapiDelete = <T = any>(
  endpoint: string,
  params?: Record<string, any>,
) => strapiRequest<T>(endpoint, 'DELETE', { params });

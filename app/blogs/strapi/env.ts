export const NEXT_PUBLIC_STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
export const NEXT_PUBLIC_STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

if (!NEXT_PUBLIC_STRAPI_BASE_URL)
  throw new Error('STRAPI_URL is not set in .env');
if (!NEXT_PUBLIC_STRAPI_TOKEN)
  throw new Error('NEXT_PUBLIC_STRAPI_TOKEN is not set in .env');

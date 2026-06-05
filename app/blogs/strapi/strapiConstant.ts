export const STRAPI_ENDPOINTS = {
  GET_LIMITED_ARTICLES: (locale: string) =>
    `/api/articles?locale=${locale}&populate=*&pagination[page]=1&pagination[pageSize]=3`,

  GET_LATEST_ARTICLES: (locale: string) =>
    `/api/articles?locale=${locale}&populate=*&pagination[page]=1&pagination[pageSize]=5`,

  GET_ARTICLES: (page: number, locale: string) =>
    `/api/articles?locale=${locale}&populate=*&pagination[page]=${page}&pagination[pageSize]=${process.env.NEXT_PUBLIC_BLOGS_PER_PAGE}`,

  GET_ARTICLES_BY_SLUG: (slug: string, locale: string) =>
    `/api/articles?locale=${locale}&filters[slug][$eq]=${slug}&populate=*`,
};

const API_URL = import.meta.env.VITE_API_URL ?? "";

/** Backend qaytargan rasm yo'lini to'liq URL ga aylantiradi. */
export const getImageUrl = (url?: string | null): string => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  return `${API_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("uz-UZ").format(price);

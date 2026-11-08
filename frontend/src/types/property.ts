export type ListingType = "SALE" | "RENT";

export type PropertyStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PropertyImage {
  id: number;
  url: string;
  altText?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: "USD" | "UZS";
  listingType: ListingType;
  status: PropertyStatus;
  address: string;
  city: string;
  area: number;
  rooms: number;
  bathrooms: number;
  images: PropertyImage[];
  category: Category;
  categoryId: number;
  createdAt?: string;
  /** Faqat admin ro'yxatida keladi */
  owner?: { id: number; fullName: string; email: string };
}

export interface PropertyMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PropertyResponse {
  data: Property[];
  meta: PropertyMeta;
}
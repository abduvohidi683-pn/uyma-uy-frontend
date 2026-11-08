import api from "./api";
import type { PropertyResponse , Property } from "../types/property";

export interface PropertyFilters {
  page?: number;
  limit?: number;
  city?: string;
  category?: string;
  type?: "SALE" | "RENT" | "";
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}

export const getProperties = async (
  filters: PropertyFilters
): Promise<PropertyResponse> => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined)
  );

  const response = await api.get<PropertyResponse>("/properties", { params });
  return response.data;
};



export interface PropertyDetail extends Property {
  owner: {
    id: number;
    fullName: string;
    phone?: string;
    email: string;
  };
}

export const getPropertyById = async (
  id: string
): Promise<PropertyDetail> => {
  const response = await api.get<PropertyDetail>(`/properties/${id}`);

  return response.data;
};


export const getMyProperties = async (): Promise<Property[]> => {
  const response = await api.get<Property[]>("/properties/my");

  return response.data;
};


export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  currency: "USD" | "UZS";
  listingType: "SALE" | "RENT";
  categoryId: number;
  address: string;
  city: string;
  area: number;
  rooms: number;
  bathrooms: number;
}

export const createProperty = async (data: CreatePropertyData) => {
  const response = await api.post("/properties", data);

  return response.data;
};



export const updateProperty = async (
  id: number,
  data: CreatePropertyData
) => {
  const response = await api.patch(`/properties/${id}`, data);

  return response.data;
};

export const deleteProperty = async (id: number) => {
  const response = await api.delete(`/properties/${id}`);

  return response.data;
};

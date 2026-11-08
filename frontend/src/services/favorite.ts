import api from "./api";
import type { Property } from "../types/property";

export interface Favorite {
  id: number;
  createdAt: string;
  userId: number;
  propertyId: number;
  property: Property;
}

export const getFavorites = async (): Promise<Favorite[]> => {
  const response = await api.get<Favorite[]>("/favorites");
  return response.data;
};

export const addFavorite = async (propertyId: number) => {
  const response = await api.post(`/favorites/${propertyId}`);
  return response.data;
};

export const removeFavorite = async (propertyId: number) => {
  const response = await api.delete(`/favorites/${propertyId}`);
  return response.data;
};
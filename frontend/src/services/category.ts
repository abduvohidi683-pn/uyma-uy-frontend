import api from "./api";
import type { Category } from "../types/property";

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>("/categories");

  return response.data;
};

export interface CategoryPayload {
  name?: string;
  slug?: string;
}

export const createCategory = async (
  data: Required<CategoryPayload>
): Promise<Category> => {
  const response = await api.post<Category>("/categories", data);

  return response.data;
};

export const updateCategory = async (
  id: number,
  data: CategoryPayload
): Promise<Category> => {
  const response = await api.patch<Category>(`/categories/${id}`, data);

  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);

  return response.data;
};
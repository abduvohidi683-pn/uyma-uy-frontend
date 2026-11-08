import api from "./api";
import type { User } from "../types/user";

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
}

export const updateMe = async (data: UpdateProfileData): Promise<User> => {
  const response = await api.patch<User>("/users/me", data);
  return response.data;
};
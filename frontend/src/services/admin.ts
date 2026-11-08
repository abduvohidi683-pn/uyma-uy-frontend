
import api from "./api";
import type { Property, PropertyMeta } from "../types/property";

export interface AdminPropertiesResponse {
  data: Property[];
  meta: PropertyMeta;
}

export const getAdminProperties = async (
  status: "PENDING" | "APPROVED" | "REJECTED" = "PENDING",
  page = 1,
  limit = 12
): Promise<AdminPropertiesResponse> => {
  const response = await api.get("/admin/properties", {
    params: { status, page, limit },
  });

  return response.data;
};

export const updatePropertyStatus = async (
  id: number,
  status: "APPROVED" | "REJECTED"
) => {
  const response = await api.patch(
    `/admin/properties/${id}/status`,
    { status }
  );

  return response.data;
};


export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string | null;
  createdAt: string;
  _count?: { properties: number };
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get<AdminUser[]>("/admin/users");

  return response.data;
};


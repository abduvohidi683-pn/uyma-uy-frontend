import api from "./api";
import type { Inquiry } from "../types/inquiry";

export interface CreateInquiryData {
  message: string;
  phone: string;
}

export const createInquiry = async (
  propertyId: number,
  data: CreateInquiryData
) => {
  const response = await api.post(
    `/properties/${propertyId}/inquiries`,
    data
  );

  return response.data;
};

export const getMyInquiries = async (): Promise<Inquiry[]> => {
  const response = await api.get<Inquiry[]>("/inquiries/my");

  return response.data;
};
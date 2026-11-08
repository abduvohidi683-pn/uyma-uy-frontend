import api from "./api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/api";

export const loginRequest = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

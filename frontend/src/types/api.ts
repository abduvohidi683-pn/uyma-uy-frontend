import type { User } from "./user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

/**
 * Backend xatosidan o'qiladigan matnni oladi.
 * NestJS validatsiya xatolari massiv bo'lib keladi, shuni ham qo'llaydi.
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  const message = (
    err as { response?: { data?: { message?: string | string[] } } }
  )?.response?.data?.message;

  if (Array.isArray(message)) return message.join(", ");
  return message || fallback;
}

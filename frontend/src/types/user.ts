export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
}
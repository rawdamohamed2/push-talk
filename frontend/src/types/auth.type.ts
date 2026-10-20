import type { User } from "@/types/index.ts";

export interface user {
  id: number;
  username: string;
}
export interface loginData {
  username: string;
  password: string;
}
export interface signUpData {
  username: string;
  password: string;
  password_confirmation: string;
}
export interface StoredAuth {
  token: string;
  user: User;
}

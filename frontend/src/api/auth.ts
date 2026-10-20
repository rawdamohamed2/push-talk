import { request } from "./http.ts";
import type { loginData, StoredAuth } from "@/types/auth.type.ts";

export const login = (data: loginData) =>
  request<StoredAuth>("/auth/login", { method: "POST", json: data });

export const signup = (signup: loginData) =>
  request<StoredAuth>("/auth/signup", { method: "POST", json: signup });

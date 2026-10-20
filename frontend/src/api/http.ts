import axios, { AxiosError } from "axios";
import { authStorage } from "@/lib/authStorage.ts";

const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface FieldIssue {
  field: string;
  message: string;
}

interface ErrorBody {
  error?: { code?: string; message?: string; details?: FieldIssue[] };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: FieldIssue[];

  constructor(
    status: number,
    code: string,
    message: string,
    details: FieldIssue[] = [],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export const http = axios.create({ baseURL: BASE_URL });

http.interceptors.request.use((config) => {
  const token = authStorage.get()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isCancel(error)) throw error;

    if (!(error instanceof AxiosError) || !error.response) {
      throw new ApiError(
        0,
        "network_error",
        "Cannot reach the server. Check your connection.",
      );
    }

    const { status, data } = error.response;
    // 401 وإحنا باعتين توكن = التوكن انتهى. (401 على login مفيهوش توكن، فمش بيعمل logout)
    if (status === 401 && authStorage.get()) onUnauthorized?.();

    const body = await readErrorBody(data);
    throw new ApiError(
      status,
      body.error?.code ?? "http_error",
      body.error?.message ?? error.message,
      body.error?.details ?? [],
    );
  },
);

async function readErrorBody(data: unknown): Promise<ErrorBody> {
  try {
    if (data instanceof Blob) return JSON.parse(await data.text()) as ErrorBody;
    return (data ?? {}) as ErrorBody;
  } catch {
    return {};
  }
}

export async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    json?: unknown;
    form?: FormData;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const { method = "GET", json, form, signal } = options;
  const res = await http.request<T>({
    url: path,
    method,
    data: form ?? json,
    signal,
  });
  return res.data;
}

export async function requestBlob(
  path: string,
  signal?: AbortSignal,
): Promise<Blob> {
  const res = await http.get<Blob>(path, { responseType: "blob", signal });
  return res.data;
}

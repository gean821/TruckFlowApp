import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/AuthStore";
import router from "@/router";
import type RefreshResponseDto from "@/Dtos/auth/RefreshResponseDto";

const REFRESH_URL = "/Auth/refresh";
const LOGIN_URLS = ["/AuthAdmin/login", "/AuthMotorista/login", "/registro"];

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();

    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<RefreshResponseDto> | null = null;

function performRefresh(): Promise<RefreshResponseDto> {
  if (!refreshPromise) {
    refreshPromise = http
      .post<RefreshResponseDto>(REFRESH_URL)
      .then((response) => response.data)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? "";

    const skipRefresh =
      status !== 401 ||
      !original ||
      original._retry ||
      url.includes(REFRESH_URL) ||
      LOGIN_URLS.some((u) => url.includes(u));

    if (skipRefresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const refreshed = await performRefresh();

      const auth = useAuthStore();
      auth.setSession(refreshed.token, refreshed.tokenExpiresAt);

      original.headers["Authorization"] = `Bearer ${refreshed.token}`;
      return http(original);
    } catch (refreshError) {
      const auth = useAuthStore();
      auth.clearSession();
      router.push("/login");
      return Promise.reject(refreshError);
    }
  },
);

export default http;

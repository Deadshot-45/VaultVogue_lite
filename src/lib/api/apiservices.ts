import axios, { AxiosRequestConfig } from "axios";
import { logError } from "../log-error";
import { getAuthCookie } from "../auth";

const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (typeof window === "undefined") {
    return process.env.API_URL || envUrl || "http://localhost:5000";
  }

  // On client-side, use the public API URL when provided; otherwise use relative paths.
  return envUrl ?? "";
};

const BASE_URL = getBaseUrl();

/**
 * Custom Axios Instance
 */
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request Interceptor: Attach Token (if needed)
api.interceptors.request.use(
  (config) => {
    // You can retrieve the auth token from localStorage, cookie, or store here
    // Example:

    const token = typeof window !== "undefined" ? getAuthCookie() : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logError(error, "Axios Request Interceptor");
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized (401), forbidden (403), etc.
    if (error.response?.status === 401) {
      // Logic for logout or re-auth can go here
      console.warn("Unauthorized! Redirecting to login...");
    }

    const status = error.response?.status;
    const errorContext = status
      ? `API Error: ${status}`
      : `API Network Error: ${error.message || "Unknown"}`;

    logError(error, errorContext);
    return Promise.reject(error);
  },
);

/**
 * Example Service Methods (Optional)
 */
export const ApiService = {
  get: async <T>(
    url: string,
    params?: object,
    headers?: AxiosRequestConfig["headers"],
  ) => {
    const response = await api.get<T>(url, { params, headers });
    return response.data;
  },
  post: async <T>(
    url: string,
    data?: object,
    headers?: AxiosRequestConfig["headers"],
  ) => {
    const response = await api.post<T>(url, data, { headers });
    return response.data;
  },
  put: async <T>(
    url: string,
    data?: object,
    headers?: AxiosRequestConfig["headers"],
  ) => {
    const response = await api.put<T>(url, data, { headers });
    return response.data;
  },
  delete: async <T>(url: string, headers?: AxiosRequestConfig["headers"]) => {
    const response = await api.delete<T>(url, { headers });
    return response.data;
  },
};

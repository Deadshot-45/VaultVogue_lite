import axios from "axios";
import { logError } from "../log-error";

// Configure with NEXT_PUBLIC_ for client-side availability
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/";

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
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    logError(error, "Axios Request Interceptor");
    return Promise.reject(error);
  }
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

    logError(error, `API Error: ${error.response?.status || "Unknown"}`);
    return Promise.reject(error);
  }
);

/**
 * Example Service Methods (Optional)
 */
export const ApiService = {
  get: async <T>(url: string, params?: object) => {
    const response = await api.get<T>(url, { params });
    return response.data;
  },
  post: async <T>(url: string, data?: object) => {
    const response = await api.post<T>(url, data);
    return response.data;
  },
  put: async <T>(url: string, data?: object) => {
    const response = await api.put<T>(url, data);
    return response.data;
  },
  delete: async <T>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};

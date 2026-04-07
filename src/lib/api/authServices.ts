import { api } from "./apiservices";

export interface User {
  id: string;
  _id?: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export const authService = {
  token: null as string | null,

  notifyAuthChange: () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("authchange"));
    }
  },

  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/api/authcontroller/login", {
      identifier: email,
      password,
    });

    const data = response.data;
    authService.token = data?.data?.token ?? "";

    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", data?.data?.token ?? "");
    }

    authService.notifyAuthChange();

    return data;
  },

  signUp: async (payload: SignUpPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/api/authcontroller/register",
      payload,
    );

    const data = response.data;
    authService.token = data?.data?.token ?? "";

    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", data?.data?.token ?? "");
    }

    authService.notifyAuthChange();

    return data;
  },

  signOut: () => {
    authService.token = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }

    authService.notifyAuthChange();
  },

  getToken: () => {
    if (authService.token) return authService.token;
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  },

  isAuthenticated: () => !!authService.getToken(),
};

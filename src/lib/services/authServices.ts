import { ApiService } from "./apiservices";

export interface User {
  id: string;
  _id?: string;
  email: string;
  name?: string;
  fullName?: string;
  role?: 'admin' | 'seller' | 'user';
  avatar?: string;
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
    const data = await ApiService.post<AuthResponse>("/api/authcontroller/login", {
      identifier: email,
      password,
    });

    authService.token = data?.data?.token ?? "";

    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", data?.data?.token ?? "");
    }

    authService.notifyAuthChange();

    return data;
  },

  adminSignIn: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await ApiService.post<AuthResponse>("/api/admin/login", {
      email,
      password,
    });

    authService.token = data?.data?.token ?? "";

    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", data?.data?.token ?? "");
    }

    authService.notifyAuthChange();

    return data;
  },

  signUp: async (payload: SignUpPayload): Promise<AuthResponse> => {
    const data = await ApiService.post<AuthResponse>(
      "/api/authcontroller/register",
      payload,
    );

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

  googleLogin: async (firebaseToken: string): Promise<any> => {
    return ApiService.post(
      "/api/auth/google",
      {},
      {
        Authorization: `Bearer ${firebaseToken}`,
      },
    );
  },

  sendOtp: async (email: string): Promise<any> => {
    return ApiService.post("/api/authController/forgot-password", { email });
  },

  verifyOtp: async (email: string, otp: string): Promise<any> => {
    return ApiService.post("/api/ekycController/verify-otp", {
      identifier: email,
      otp,
    });
  },

  resetPassword: async (password: string, confirmPassword: string, email: string, token: string): Promise<any> => {
    return ApiService.post(
      "/api/authController/reset-password",
      {
        confirmPassword,
        password,
        identifier: email,
      },
      {
        Authorization: `Bearer ${token}`,
      },
    );
  },
};



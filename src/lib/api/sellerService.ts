import { api } from "./apiservices";

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType: "savings" | "current";
}

export interface SellerOnboardPayload {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  website?: string;
  gstNumber: string;
  bankDetails: BankDetails;
  ownerUserId?: string;
}

export interface SellerResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const sellerService = {
  onboard: async (payload: SellerOnboardPayload): Promise<SellerResponse> => {
    const response = await api.post<SellerResponse>("/api/sellers/onboard", payload);
    return response.data;
  },

  getAll: async (): Promise<any[]> => {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>("/api/sellers");
      return response.data?.data ?? [];
    } catch (err) {
      console.error("Failed to fetch sellers from API, falling back to local list.", err);
      throw err;
    }
  },

  getByEmail: async (email: string): Promise<any | null> => {
    try {
      const response = await api.get<{ success: boolean; data: any }>(`/api/sellers/by-email/${email}`);
      return response.data?.data ?? null;
    } catch (err: any) {
      // Handle 404 cleanly as a non-registered seller
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  approve: async (id: string): Promise<SellerResponse> => {
    const response = await api.patch<SellerResponse>(`/api/sellers/${id}/approve`);
    return response.data;
  },

  reject: async (id: string): Promise<SellerResponse> => {
    const response = await api.patch<SellerResponse>(`/api/sellers/${id}/reject`);
    return response.data;
  },
};

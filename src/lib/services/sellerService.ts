import { ApiService } from "./apiservices";

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
    return ApiService.post<SellerResponse>("/api/sellers/onboard", payload);
  },

  

  getByEmail: async (email: string): Promise<any | null> => {
    try {
      const response = await ApiService.get<{ success: boolean; data: any }>(`/api/sellers/by-email/${email}`);
      return response?.data ?? null;
    } catch (err: any) {
      // Handle 404 cleanly as a non-registered seller
      if (err.status === 404) return null;
      throw err;
    }
  },

  approve: async (id: string): Promise<SellerResponse> => {
    return ApiService.patch<SellerResponse>(`/api/sellers/${id}/approve`);
  },

  reject: async (id: string): Promise<SellerResponse> => {
    return ApiService.patch<SellerResponse>(`/api/sellers/${id}/reject`);
  },

  getSellerOrders: async (): Promise<{ success: boolean; data: any[] }> => {
    return ApiService.get<{ success: boolean; data: any[] }>("/api/orders/seller/all");
  },

  getSellerProducts: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    return ApiService.get<{ success: boolean; data: any[] }>(
      `/api/products/getAll?sellerId=${userId}&limit=100&isActive=all`,
    );
  },

  getSellerDashboardProducts: async (userId: string): Promise<{ success: boolean; data: any[] }> => {
    return ApiService.get<{ success: boolean; data: any[] }>(
      `/api/products/getAll?sellerId=${userId}&limit=100`,
    );
  },
};

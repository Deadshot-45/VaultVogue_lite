// src/lib/services/orderService.ts
import { ApiService } from "./apiservices";

export interface AddressPayload {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CheckoutPayload {
  address: AddressPayload;
  shippingMethod: "standard" | "express" | "vip";
  paymentMethod: "card" | "cod" | "upi" | "razorpay";
  promoCode?: string;
  tax?: number;
  subtotal?: number;
  shippingFee?: number;
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  url?: string;
  razorpay?: {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
  };
  data?: {
    _id: string;
    userId: string;
    items: any[];
    shippingAddress: AddressPayload;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
  };
}

export const orderService = {
  createCheckoutSession: async (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    return ApiService.post<CheckoutResponse>(
      "/api/orders/checkout-session",
      payload,
    );
  },

  /**
   * Retry a failed/pending payment for an existing order.
   * Backend re-creates the gateway session without creating a new order.
   * Returns the same shape as createCheckoutSession.
   */
  retryPayment: async (
    orderId: string,
    paymentMethod: "card" | "upi" | "cod",
    idempotencyKey: string,
  ): Promise<CheckoutResponse> => {
    return ApiService.post<CheckoutResponse>(
      "/api/orders/retry-payment",
      { orderId, paymentMethod, idempotencyKey },
      {
        "Idempotency-Key": idempotencyKey,
      },
    );
  },

  confirmOrder: async (orderId: string, sessionId?: string): Promise<{ success: boolean }> => {
    return ApiService.post<{ success: boolean }>(
      "/api/orders/confirm",
      {
        orderId,
        sessionId,
      },
    );
  },

  getUserOrders: async (): Promise<any> => {
    return ApiService.get("/api/orders");
  },

  getOrderById: async (id: string): Promise<any> => {
    const data = await ApiService.get<{ success: boolean; data: any }>(`/api/orders/${id}`);
    return data.data;
  },

  getAdminOrders: async (): Promise<{ success: boolean; data: any[] }> => {
    return ApiService.get<{ success: boolean; data: any[] }>("/api/admin/orders/all");
  },

  getRecentAdminOrders: async (): Promise<{ success: boolean; data: any[] }> => {
    return ApiService.get<{ success: boolean; data: any[] }>("/api/orders/admin/all");
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<{ success: boolean }> => {
    return ApiService.patch<{ success: boolean }>(`/api/orders/${orderId}/status`, { status });
  },
};

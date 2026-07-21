// src/lib/api/orderService.ts
import { api } from "./apiservices";

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
  createCheckoutSession: async (payload: CheckoutPayload) => {
    const response = await api.post<CheckoutResponse>(
      "/api/orders/checkout-session",
      payload,
    );
    return response.data;
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
    const response = await api.post<CheckoutResponse>(
      "/api/orders/retry-payment",
      { orderId, paymentMethod, idempotencyKey },
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      } as any,
    );
    return response.data;
  },

  confirmOrder: async (orderId: string, paymentIntentId?: string) => {
    const response = await api.post<{ success: boolean }>(
      "/api/orders/confirm",
      {
        orderId,
        paymentIntentId,
      },
    );
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get("/api/orders");
    return response.data;
  },

  getOrderById: async (id:string) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data.data;
  }
};


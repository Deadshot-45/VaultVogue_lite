export type PaymentStatus =
  | 'INITIATED'
  | 'PROCESSING'
  | 'AUTHORIZED'
  | 'SUCCESS'
  | 'FAILED'
  | 'REFUNDED';

export type PaymentGateway = 'STRIPE' | 'RAZORPAY' | 'PAYPAL' | 'COD';

export interface PaymentDetails {
  id: string;
  orderId: string;
  paymentGateway: PaymentGateway;
  transactionId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  idempotencyKey: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitializePaymentPayload {
  orderId: string;
  amount: number;
  currency?: string;
  gateway?: PaymentGateway;
  idempotencyKey: string;
}

export interface SimulateWebhookPayload {
  eventId?: string;
  gateway?: PaymentGateway;
  eventType: 'payment_intent.succeeded' | 'payment_intent.payment_failed';
  payload: {
    orderId: string;
    amount?: number;
    error?: string;
  };
}

/** Payload sent to POST /api/orders/retry-payment */
export interface RetryPaymentPayload {
  orderId: string;
  paymentMethod: 'card' | 'upi' | 'cod';
  idempotencyKey: string;
}

/** Response shape — same as checkout-session response */
export interface RetryPaymentResponse {
  success: boolean;
  message?: string;
  /** Stripe hosted checkout URL */
  url?: string;
  /** Razorpay order data */
  razorpay?: {
    orderId: string;
    amount: number;
    currency: string;
    key: string;
  };
  data?: {
    _id: string;
    paymentStatus: string;
    status: string;
  };
}

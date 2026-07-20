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

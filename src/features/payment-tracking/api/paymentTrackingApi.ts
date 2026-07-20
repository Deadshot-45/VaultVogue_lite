import { ApiService } from '@/lib/services/apiservices';
import type {
  PaymentDetails,
  InitializePaymentPayload,
  SimulateWebhookPayload,
} from '../types/payment';

export const paymentTrackingApi = {
  async getPaymentStatus(idOrOrderId: string): Promise<{ success: boolean; payment: PaymentDetails }> {
    return ApiService.get<{ success: boolean; payment: PaymentDetails }>(
      `/api/payments/${encodeURIComponent(idOrOrderId)}/status`
    );
  },

  async initializePayment(payload: InitializePaymentPayload): Promise<{ success: boolean; isDuplicate: boolean; payment: PaymentDetails }> {
    return ApiService.post<{ success: boolean; isDuplicate: boolean; payment: PaymentDetails }>(
      `/api/payments/initialize`,
      payload,
      {
        'Idempotency-Key': payload.idempotencyKey,
      }
    );
  },

  async triggerSimulatedWebhook(payload: SimulateWebhookPayload): Promise<{ received: boolean; message: string }> {
    return ApiService.post<{ received: boolean; message: string }>(
      `/api/webhooks/payment`,
      payload
    );
  },
};

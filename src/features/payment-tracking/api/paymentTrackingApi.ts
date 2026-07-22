import { ApiService } from "@/lib/services/apiservices";
import { getAuthCookie } from "@/lib/auth";
import type {
  PaymentDetails,
  InitializePaymentPayload,
  SimulateWebhookPayload,
  RetryPaymentPayload,
  RetryPaymentResponse,
} from "../types/payment";

export const paymentTrackingApi = {
  async getPaymentStatus(idOrOrderId: string) {
    return verifyAndPollPaymentStatus(idOrOrderId);
  },

  async initializePayment(payload: InitializePaymentPayload): Promise<{
    success: boolean;
    isDuplicate: boolean;
    payment: PaymentDetails;
  }> {
    return ApiService.post<{
      success: boolean;
      isDuplicate: boolean;
      payment: PaymentDetails;
    }>(`/api/payments/initialize`, payload, {
      "Idempotency-Key": payload.idempotencyKey,
    });
  },

  async triggerSimulatedWebhook(
    payload: SimulateWebhookPayload,
  ): Promise<{ received: boolean; message: string }> {
    return ApiService.post<{ received: boolean; message: string }>(
      `/api/webhooks/payment`,
      payload,
    );
  },

  /**
   * Retry a failed/pending payment. The backend re-creates the gateway
   * session for an existing order (no new order created).
   */
  async retryPayment(
    payload: RetryPaymentPayload,
  ): Promise<RetryPaymentResponse> {
    return ApiService.post<RetryPaymentResponse>(
      `/api/orders/retry-payment`,
      payload,
      {
        "Idempotency-Key": payload.idempotencyKey,
      },
    );
  },
};

// ─── Poll Result Types ──────────────────────────────────────────────────────────

export type PollResult =
  | { success: true; status: "paid"; payment: PaymentDetails }
  | { success: false; status: "failed"; message: string; payment?: PaymentDetails }
  | { success: false; status: "pending"; message: string; payment?: PaymentDetails };

/**
 * Polls `GET /api/payments/status/:orderId` with linear backoff until the
 * payment reaches a terminal state (paid | failed) or attempts run out.
 *
 * Strategy:
 *   - Attempt 1 → wait 2 s
 *   - Attempt 2 → wait 4 s
 *   - Attempt N → wait N × delayMs
 *
 * The auth token is read from the cookie on every attempt so it stays
 * fresh even in long-running poll sequences.
 *
 * @param orderId     - The order ID to poll
 * @param maxAttempts - Max number of attempts before timing out (default 5)
 * @param delayMs     - Base delay between attempts in ms (default 2000)
 */
export async function verifyAndPollPaymentStatus(
  orderId: string,
  maxAttempts = 5,
  delayMs = 2000,
): Promise<PollResult> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // ApiService.get unwraps the axios response data directly and handles auth headers
      const data = await ApiService.get<any>(
        `/api/payments/${encodeURIComponent(orderId)}/status`,
      );

      const paymentObj = data?.data || data?.payment;
      const status = paymentObj?.status?.toLowerCase();

      if (data?.success && (status === "paid" || status === "success")) {
        return { success: true, status: "paid", payment: paymentObj };
      }

      if (status === "failed") {
        return {
          success: false,
          status: "failed",
          message: paymentObj?.errorMessage || "Payment declined",
          payment: paymentObj,
        };
      }
    } catch (err: any) {
      console.warn(
        `Payment poll attempt ${attempt} failed:`,
        err?.message || err,
      );
    }

    // Linear backoff: wait longer on each attempt
    if (attempt < maxAttempts) {
      await new Promise<void>((res) => setTimeout(res, delayMs * attempt));
    }
  }

  return {
    success: false,
    status: "pending",
    message: "Payment verification timed out",
  };
}

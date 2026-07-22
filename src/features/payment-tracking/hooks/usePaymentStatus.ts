"use client";

import {
  useSuspenseQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  paymentTrackingApi,
  verifyAndPollPaymentStatus,
  type PollResult,
} from "../api/paymentTrackingApi";
import { PaymentDetails, SimulateWebhookPayload } from "../types/payment";
import { openRazorpayCheckout } from "@/lib/services/razorpay";
import { ApiService } from "@/lib/services/apiservices";
import { orderService } from "@/lib/services/orderService";

// ─── usePaymentStatus ──────────────────────────────────────────────────────────

export function usePaymentStatus(idOrOrderId: string) {
  const queryClient = useQueryClient();

  const query = useSuspenseQuery<PollResult>({
    queryKey: ["payment-status", idOrOrderId],
    queryFn: () => verifyAndPollPaymentStatus(idOrOrderId),
    staleTime: 1000 * 10,
    retry: (failureCount, error: any) => {
      // Do not retry 4xx errors (e.g. 404 Not Found)
      if (error?.status && error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const webhookMutation = useMutation({
    mutationFn: (payload: SimulateWebhookPayload) =>
      paymentTrackingApi.triggerSimulatedWebhook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment-status", idOrOrderId],
      });
      queryClient.invalidateQueries({ queryKey: ["order-tracking"] });
    },
    onError: (error: any) => {
      console.error("Webhook simulation error:", error?.message || error);
    },
  });

  return {
    payment: query.data?.payment as PaymentDetails,
    triggerWebhook: webhookMutation.mutateAsync,
    isSimulating: webhookMutation.isPending,
  };
}

// ─── useRetryPayment ───────────────────────────────────────────────────────────

export type RetryPaymentMethod = "stripe" | "razorpay" | "cod";

interface RetryOptions {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

/**
 * Hook that orchestrates the full payment retry flow.
 * Calls POST /api/orders/retry-payment then handles:
 *   - Stripe  → window.location.href redirect
 *   - Razorpay → openRazorpayCheckout modal → verify signature
 *   - COD     → inline success
 */
export function useRetryPayment({
  orderId,
  customerName,
  customerPhone,
  customerEmail,
}: RetryOptions) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["payment-status", orderId] });
    queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };

  const mutation = useMutation({
    mutationFn: async (paymentMethod: RetryPaymentMethod) => {
      // Fresh idempotency key per retry attempt
      const idempotencyKey = `retry_${orderId}_${Date.now()}`;

      const apiPaymentMethod =
        paymentMethod === "stripe"
          ? "card"
          : paymentMethod === "razorpay"
            ? "upi"
            : "cod";

      const response = await paymentTrackingApi.retryPayment({
        orderId,
        paymentMethod: apiPaymentMethod,
        idempotencyKey,
      });

      if (!response.success) {
        throw new Error(response.message || "Retry failed. Please try again.");
      }

      // ── Stripe redirect ──────────────────────────────────────────────────
      if (paymentMethod === "stripe" && response.url) {
        toast.info("Redirecting to Stripe checkout portal...");
        window.location.href = response.url;
        return { gateway: "stripe" as const, pending: true };
      }

      // ── Razorpay modal ───────────────────────────────────────────────────
      if (paymentMethod === "razorpay" && response.razorpay) {
        toast.info("Opening Razorpay payment gateway...");
        const rzpData = response.razorpay;

        await openRazorpayCheckout({
          keyId: rzpData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          orderId: rzpData.orderId,
          amount: rzpData.amount,
          currency: rzpData.currency || "INR",
          customerName,
          customerPhone,
          customerEmail,
          onSuccess: async (paymentRes) => {
            try {
              await ApiService.post("/api/payments/verify", {
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature,
              });
              toast.success("Payment verified! Order updated.");
              invalidateAll();
              router.push(
                `/success?order_id=${orderId}&payment_intent=${paymentRes.razorpay_payment_id}`,
              );
            } catch (verErr: any) {
              toast.error(verErr?.message || "Payment verification failed.");
              throw verErr;
            }
          },
          onDismiss: () => {
            toast.warning("Payment cancelled. You can retry anytime.");
          },
        });

        return { gateway: "razorpay" as const, pending: false };
      }

      // ── COD ─────────────────────────────────────────────────────────────
      if (paymentMethod === "cod") {
        toast.success("Order confirmed for Cash on Delivery!");
        invalidateAll();
        return { gateway: "cod" as const, pending: false };
      }

      throw new Error("Unexpected payment method or missing gateway response.");
    },

    onSuccess: (result) => {
      // Don't double-invalidate for stripe (navigating away) or razorpay (done in onSuccess cb)
      if (result?.gateway === "cod") {
        invalidateAll();
      }
    },

    onError: (error: any) => {
      console.error("Retry payment error:", error);
      toast.error(error?.message || "Payment retry failed. Please try again.");
    },
  });

  return {
    retryPayment: mutation.mutate,
    retryPaymentAsync: mutation.mutateAsync,
    isRetrying: mutation.isPending,
    retryError: mutation.error as any,
    isRetrySuccess: mutation.isSuccess,
  };
}

export function useConfirmPayment({
  targetOrderId,
  sessionId,
  paymentIntentId,
}: {
  targetOrderId: string;
  sessionId: string;
  paymentIntentId: string;
}) {
  const query = useQuery({
    queryKey: ["verify-payment", targetOrderId, sessionId, paymentIntentId],
    queryFn: () =>
      orderService.confirmOrder(
        targetOrderId,
        sessionId ?? paymentIntentId ?? undefined,
      ),
    enabled: !!targetOrderId,
  });
  return query;
}

export function useOrderDetails(orderId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      try {
        return await orderService.getOrderById(orderId);
      } catch (_) {
        const fallbackRes = await ApiService.get<{
          success: boolean;
          payment: any;
        }>(`/api/payments/${encodeURIComponent(orderId)}/status`);
        return fallbackRes?.payment || null;
      }
    },
    enabled: !!orderId && enabled,
  });
}

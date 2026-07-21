// src/lib/query/useCheckout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, CheckoutPayload } from "../services/orderService";

export const usePlaceOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkoutData: CheckoutPayload) => {
      const response = await orderService.createCheckoutSession(checkoutData);

      if (!response.success) {
        throw new Error(response.message || "Checkout registration failed");
      }

      return response;
    },
    onSuccess: (response) => {
      // Only invalidate cart immediately for COD (no external gateway redirect).
      // For Stripe: cart cleared by webhook after payment confirmation on /success.
      // For Razorpay: cart cleared after signature verification in onSuccess callback.
      const isGatewayRedirect = !!response?.url || !!response?.razorpay;
      if (!isGatewayRedirect) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
};

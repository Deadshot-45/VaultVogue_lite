// src/lib/query/useCheckout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, CheckoutPayload } from "../api/orderService";

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
    onSuccess: () => {
      // Invalidate queries so cart drawer updates instantly
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

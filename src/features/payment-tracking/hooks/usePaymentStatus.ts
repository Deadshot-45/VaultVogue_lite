import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentTrackingApi } from '../api/paymentTrackingApi';
import type { PaymentDetails, SimulateWebhookPayload } from '../types/payment';

export function usePaymentStatus(idOrOrderId: string) {
  const queryClient = useQueryClient();

  const query = useSuspenseQuery<{ success: boolean; payment: PaymentDetails }>({
    queryKey: ['payment-status', idOrOrderId],
    queryFn: () => paymentTrackingApi.getPaymentStatus(idOrOrderId),
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
      queryClient.invalidateQueries({ queryKey: ['payment-status', idOrOrderId] });
      queryClient.invalidateQueries({ queryKey: ['order-tracking'] });
    },
    onError: (error: any) => {
      console.error('Webhook simulation error:', error?.message || error);
    },
  });

  return {
    payment: query.data?.payment,
    triggerWebhook: webhookMutation.mutateAsync,
    isSimulating: webhookMutation.isPending,
  };
}

import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderTrackingApi } from '../api/orderTrackingApi';
import type { OrderTrackingDetails, UpdateOrderStatusPayload } from '../types/orderTracking';

export function useOrderTracking(orderId: string) {
  const queryClient = useQueryClient();

  const query = useSuspenseQuery<OrderTrackingDetails>({
    queryKey: ['order-tracking', orderId],
    queryFn: () => orderTrackingApi.getOrderTracking(orderId),
    staleTime: 1000 * 30, // 30s
    retry: (failureCount, error: any) => {
      // Do not retry 4xx client errors (e.g., 404 Not Found, 400 Bad Request)
      if (error?.status && error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateOrderStatusPayload) =>
      orderTrackingApi.updateOrderStatus(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-tracking', orderId] });
      queryClient.invalidateQueries({ queryKey: ['payment-status', orderId] });
    },
    onError: (error: any) => {
      console.error('Error updating order status:', error?.message || error);
    },
  });

  return {
    tracking: query.data,
    updateStatus: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

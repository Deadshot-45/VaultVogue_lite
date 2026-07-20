import { ApiService } from '@/lib/services/apiservices';
import type { OrderTrackingDetails, UpdateOrderStatusPayload } from '../types/orderTracking';

export const orderTrackingApi = {
  async getOrderTracking(orderId: string): Promise<OrderTrackingDetails> {
    return ApiService.get<OrderTrackingDetails>(
      `/api/orders/${encodeURIComponent(orderId)}/track`
    );
  },

  async updateOrderStatus(
    orderId: string,
    payload: UpdateOrderStatusPayload
  ): Promise<{ success: boolean; tracking: OrderTrackingDetails }> {
    return ApiService.post<{ success: boolean; tracking: OrderTrackingDetails }>(
      `/api/orders/${encodeURIComponent(orderId)}/track`,
      payload
    );
  },
};

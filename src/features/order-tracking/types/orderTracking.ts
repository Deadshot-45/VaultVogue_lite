export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_AUTHORIZED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export interface TrackingCheckpoint {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface OrderTrackingDetails {
  orderId: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  carrierName: string | null;
  trackingNumber: string | null;
  estimatedDeliveryAt: string | null;
  history: TrackingCheckpoint[];
}

export interface UpdateOrderStatusPayload {
  toStatus: OrderStatus;
  note?: string;
  carrierName?: string;
  trackingNumber?: string;
}

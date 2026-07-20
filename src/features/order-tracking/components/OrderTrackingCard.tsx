"use client";

import React, { useCallback } from "react";
import { useOrderTracking } from "../hooks/useOrderTracking";
import { TrackingTimeline } from "./TrackingTimeline";
import type { OrderStatus } from "../types/orderTracking";
import {
  Truck,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface OrderTrackingCardProps {
  orderId: string;
}

const STEP_ORDER: OrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_AUTHORIZED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export const OrderTrackingCard: React.FC<OrderTrackingCardProps> = ({
  orderId,
}) => {
  const { tracking, updateStatus, isUpdating } = useOrderTracking(orderId);

  console.log("tracking", tracking);

  const currentStepIndex = STEP_ORDER.indexOf(tracking.currentStatus);

  const handleAdvanceState = useCallback(async () => {
    const nextStepMap: Partial<Record<OrderStatus, OrderStatus>> = {
      PENDING_PAYMENT: "PAYMENT_AUTHORIZED",
      PAYMENT_AUTHORIZED: "PROCESSING",
      PROCESSING: "SHIPPED",
      SHIPPED: "DELIVERED",
    };

    const nextStatus = nextStepMap[tracking.currentStatus];
    if (nextStatus) {
      await updateStatus({
        toStatus: nextStatus,
        note: `Simulated carrier update to ${nextStatus}`,
        carrierName: nextStatus === "SHIPPED" ? "FedEx Priority" : undefined,
        trackingNumber:
          nextStatus === "SHIPPED"
            ? `FX-${Date.now().toString().slice(-8)}`
            : undefined,
      });
    }
  }, [tracking.currentStatus, updateStatus]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Order #{tracking.orderNumber}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {tracking.currentStatus?.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Order ID:{" "}
            <code className="text-xs font-mono">{tracking.orderId}</code>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {tracking.currentStatus !== "DELIVERED" &&
            tracking.currentStatus !== "CANCELLED" && (
              <button
                onClick={handleAdvanceState}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isUpdating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>Simulate Next Stage</span>
              </button>
            )}
        </div>
      </div>

      {/* Carrier & Estimated Delivery Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Truck className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Carrier</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {tracking.carrierName || "Pending Carrier Assignment"}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Tracking Number</span>
          </div>
          <p className="text-sm font-semibold font-mono text-gray-900 dark:text-gray-100">
            {tracking.trackingNumber || "N/A"}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <PackageCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Estimated Delivery</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {tracking.estimatedDeliveryAt
              ? new Date(tracking.estimatedDeliveryAt).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )
              : "Calculating..."}
          </p>
        </div>
      </div>

      {/* Status Stepper Progress Bar */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Fulfillment Lifecycle
          </span>
          <span className="text-xs font-bold text-primary">
            Step {Math.max(0, currentStepIndex + 1)} of {STEP_ORDER.length}
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  10,
                  ((currentStepIndex + 1) / STEP_ORDER.length) * 100,
                ),
              )}%`,
            }}
          />
        </div>
      </div>

      {/* History Timeline */}
      <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Tracking Checkpoint History
        </h3>
        <TrackingTimeline history={tracking.history} />
      </div>
    </div>
  );
};

export default OrderTrackingCard;

import React, { Suspense } from 'react';
import { OrderTrackingCard } from '@/features/order-tracking';
import { PaymentTrackerCard } from '@/features/payment-tracking';
import { QueryErrorBoundary } from '@/components/feedback/query-error-boundary';

interface OrderTrackingPageProps {
  params: Promise<{
    id: string;
  }>;
}

function LoadingSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-6">
      <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/3" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-16 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
      </div>
      <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded-full w-full" />
      <div className="h-32 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

export default async function OrderTrackingPage({ params }: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          Live Order Tracking
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor your package fulfillment status and payment confirmation in real-time.
        </p>
      </div>

      {/* Order Tracking Card with Error Boundary & Suspense */}
      <QueryErrorBoundary fallbackTitle="Order Tracking Unavailable">
        <Suspense fallback={<LoadingSkeleton />}>
          <OrderTrackingCard orderId={id} />
        </Suspense>
      </QueryErrorBoundary>

      {/* Payment Tracker Card with Error Boundary & Suspense */}
      <QueryErrorBoundary fallbackTitle="Payment Verification Unavailable">
        <Suspense fallback={<LoadingSkeleton />}>
          <PaymentTrackerCard idOrOrderId={id} />
        </Suspense>
      </QueryErrorBoundary>
    </div>
  );
}

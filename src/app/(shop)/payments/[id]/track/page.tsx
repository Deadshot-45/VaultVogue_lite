import React, { Suspense } from 'react';
import { PaymentTrackerCard } from '@/features/payment-tracking';
import { QueryErrorBoundary } from '@/components/feedback/query-error-boundary';

interface PaymentTrackingPageProps {
  params: Promise<{
    id: string;
  }>;
}

function PaymentSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-6">
      <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/3" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
        <div className="h-20 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
      </div>
      <div className="h-24 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}

export default async function PaymentTrackingPage({ params }: PaymentTrackingPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          Payment Status & Gateway Verification
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Verify transaction authorization state and test webhook callbacks.
        </p>
      </div>

      <QueryErrorBoundary fallbackTitle="Payment Verification Unavailable">
        <Suspense fallback={<PaymentSkeleton />}>
          <PaymentTrackerCard idOrOrderId={id} />
        </Suspense>
      </QueryErrorBoundary>
    </div>
  );
}

import React, { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OrderTrackingCard } from "@/features/order-tracking";
import { PaymentTrackerCard } from "@/features/payment-tracking";
import { QueryErrorBoundary } from "@/components/feedback/query-error-boundary";

interface OrderTrackingPageProps {
  params: Promise<{
    id: string;
  }>;
}

function LoadingSkeleton() {
  return (
    <div className="bg-[var(--vault-panel)] border border-[var(--vault-line)] p-6 sm:p-8 animate-pulse space-y-6">
      <div className="h-6 bg-[var(--vault-line)]/50 rounded-none w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-16 bg-[var(--vault-line)]/40 rounded-none" />
        <div className="h-16 bg-[var(--vault-line)]/40 rounded-none" />
        <div className="h-16 bg-[var(--vault-line)]/40 rounded-none" />
      </div>
      <div className="h-2 bg-[var(--vault-line)]/50 rounded-none w-full" />
      <div className="h-28 bg-[var(--vault-line)]/30 rounded-none" />
    </div>
  );
}

export default async function OrderTrackingPage({
  params,
}: OrderTrackingPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] text-[var(--vault-ink)] transition-colors duration-300">
      {/* Breadcrumb Navigation */}
      <div className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)]/60 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--vault-accent)] transition-colors"
            >
              Vault Vogue
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <Link
              href="/orders"
              className="hover:text-[var(--vault-accent)] transition-colors"
            >
              Orders
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <span className="text-[var(--vault-accent)] font-semibold">
              Track Waybill {id}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] font-semibold">
            Air-Courier Telemetry
          </div>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Live Consignment Tracking
          </h1>
          <p className="font-mono text-xs text-[var(--vault-muted)] mt-1">
            Waybill reference:{" "}
            <strong className="text-[var(--vault-ink)]">{id}</strong> ·
            Real-time waypoint updates.
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
    </div>
  );
}

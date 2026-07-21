'use client';

import React, { useCallback } from 'react';
import { usePaymentStatus, useRetryPayment } from '../hooks/usePaymentStatus';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { CreditCard, Key, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

interface PaymentTrackerCardProps {
  idOrOrderId: string;
  customerName?: string;
  customerPhone?: string;
}

export const PaymentTrackerCard: React.FC<PaymentTrackerCardProps> = ({
  idOrOrderId,
  customerName,
  customerPhone,
}) => {
  const { payment, triggerWebhook, isSimulating } = usePaymentStatus(idOrOrderId);

  const { retryPayment, isRetrying } = useRetryPayment({
    orderId: payment?.orderId || idOrOrderId,
    customerName,
    customerPhone,
  });

  const handleSimulateSuccessWebhook = useCallback(async () => {
    await triggerWebhook({
      eventId: `evt_sim_${Date.now()}`,
      gateway: payment.paymentGateway,
      eventType: 'payment_intent.succeeded',
      payload: {
        orderId: payment.orderId,
        amount: payment.amount,
      },
    });
  }, [payment, triggerWebhook]);

  const handleSimulateFailedWebhook = useCallback(async () => {
    await triggerWebhook({
      eventId: `evt_sim_${Date.now()}`,
      gateway: payment.paymentGateway,
      eventType: 'payment_intent.payment_failed',
      payload: {
        orderId: payment.orderId,
        error: 'Insufficient funds on credit card',
      },
    });
  }, [payment, triggerWebhook]);

  const isFailed = payment?.status === 'FAILED';
  const isFailedOrPending =
    isFailed || payment?.status === 'INITIATED' || payment?.status === 'PROCESSING';

  // Map gateway to retry method
  const retryMethod =
    payment?.paymentGateway === 'STRIPE'
      ? 'stripe'
      : payment?.paymentGateway === 'COD'
      ? 'cod'
      : 'razorpay';

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Payment Status & Verification
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Payment ID: <code className="font-mono">{payment.id}</code>
          </p>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      {/* Payment Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-1">
          <span className="text-xs font-medium text-gray-500">Total Charged</span>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {payment.currency} ${payment.amount.toFixed(2)}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-1">
          <span className="text-xs font-medium text-gray-500">Gateway Provider</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {payment.paymentGateway}
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 space-y-1 sm:col-span-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <Key className="w-3.5 h-3.5 text-primary" />
            <span>Idempotency Key</span>
          </div>
          <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
            {payment.idempotencyKey}
          </p>
        </div>
      </div>

      {payment.errorMessage && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300">
          <strong>Failure Reason:</strong> {payment.errorMessage}
        </div>
      )}

      {/* ── Retry Payment (shown for FAILED / INITIATED / PROCESSING) ── */}
      {isFailedOrPending && (
        <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              {isFailed ? 'Retry Failed Payment' : 'Complete Pending Payment'}
            </h4>
          </div>
          <p className="text-xs text-gray-500">
            {isFailed
              ? 'Retry using the original payment gateway for this order.'
              : 'This payment is still in progress. Click below to open the payment gateway.'}
          </p>
          <button
            onClick={() => retryPayment(retryMethod as any)}
            disabled={isRetrying}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Processing...' : `Retry via ${payment.paymentGateway}`}
          </button>
        </div>
      )}

      {/* Webhook Event Simulation Control */}
      <div className="p-4 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-700 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Gateway Webhook Simulator (Test Environment)
          </h4>
        </div>
        <p className="text-xs text-gray-500">
          Trigger real-time webhook payloads to test payment confirmation and order state transitions.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleSimulateSuccessWebhook}
            disabled={isSimulating}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            Simulate Gateway Success Webhook
          </button>
          <button
            onClick={handleSimulateFailedWebhook}
            disabled={isSimulating}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            Simulate Gateway Fail Webhook
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentTrackerCard;

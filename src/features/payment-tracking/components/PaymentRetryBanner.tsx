'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  RefreshCw,
  CreditCard,
  QrCode,
  Truck,
  ChevronDown,
  ShieldCheck,
  Clock,
  XCircle,
} from 'lucide-react';
import { useRetryPayment, RetryPaymentMethod } from '../hooks/usePaymentStatus';

interface PaymentRetryBannerProps {
  orderId: string;
  paymentStatus: string; // 'pending' | 'failed' | 'FAILED' | 'INITIATED' | 'unpaid' etc.
  errorMessage?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  /** If provided, forces only this gateway option visible */
  defaultGateway?: RetryPaymentMethod;
}

const GATEWAY_OPTIONS: { id: RetryPaymentMethod; label: string; subLabel: string; icon: React.ReactNode }[] = [
  {
    id: 'razorpay',
    label: 'Razorpay',
    subLabel: 'UPI · QR · Netbanking · Wallets',
    icon: <QrCode className="h-4 w-4 text-emerald-500" />,
  },
  {
    id: 'stripe',
    label: 'Stripe',
    subLabel: 'Credit / Debit Card · Link',
    icon: <CreditCard className="h-4 w-4 text-indigo-500" />,
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    subLabel: 'Pay when your order arrives',
    icon: <Truck className="h-4 w-4 text-amber-500" />,
  },
];

function isFailed(status: string) {
  const s = status?.toLowerCase();
  return s === 'failed' || s === 'unpaid' || s === 'initiated' || s === 'pending';
}

export function PaymentRetryBanner({
  orderId,
  paymentStatus,
  errorMessage,
  customerName,
  customerPhone,
  customerEmail,
  defaultGateway = 'razorpay',
}: PaymentRetryBannerProps) {
  const [selectedGateway, setSelectedGateway] = useState<RetryPaymentMethod>(defaultGateway);
  const [gatewayOpen, setGatewayOpen] = useState(false);

  const { retryPayment, isRetrying } = useRetryPayment({
    orderId,
    customerName,
    customerPhone,
    customerEmail,
  });

  if (!isFailed(paymentStatus)) return null;

  const selected = GATEWAY_OPTIONS.find((g) => g.id === selectedGateway)!;

  const isCritical = paymentStatus?.toLowerCase() === 'failed';
  const isProcessing = paymentStatus?.toLowerCase() === 'processing' || paymentStatus?.toLowerCase() === 'initiated';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`overflow-hidden rounded-2xl border shadow-md ${
        isCritical
          ? 'border-rose-200 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/30'
          : 'border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30'
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full ${
          isCritical ? 'bg-gradient-to-r from-rose-500 to-red-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
        }`}
      />

      <div className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              isCritical
                ? 'bg-rose-100 border-rose-200 text-rose-600 dark:bg-rose-900/40 dark:border-rose-700 dark:text-rose-400'
                : 'bg-amber-100 border-amber-200 text-amber-600 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-400'
            }`}
          >
            {isCritical ? (
              <XCircle className="h-4.5 w-4.5" />
            ) : (
              <Clock className="h-4.5 w-4.5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p
              className={`text-xs font-bold uppercase tracking-widest ${
                isCritical ? 'text-rose-700 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {isCritical ? 'Payment Failed' : 'Payment Pending'}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
              {errorMessage
                ? errorMessage
                : isCritical
                ? 'Your payment could not be processed. Please choose a payment method and try again.'
                : 'This order is awaiting payment. Complete your payment to confirm the order.'}
            </p>
          </div>
        </div>

        {/* Error detail pill */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200/70 bg-rose-100/60 dark:border-rose-800/50 dark:bg-rose-950/40 px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
            <p className="text-[10px] text-rose-700 dark:text-rose-400 font-mono">{errorMessage}</p>
          </div>
        )}

        {/* Gateway selector */}
        <div className="relative">
          <button
            type="button"
            disabled={isRetrying}
            onClick={() => setGatewayOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/60 bg-white dark:bg-zinc-900 hover:border-[var(--gold-soft)] transition-all text-left disabled:opacity-50"
          >
            <div className="flex items-center gap-2.5">
              {selected.icon}
              <div>
                <p className="text-xs font-semibold text-[var(--brand-text)]">{selected.label}</p>
                <p className="text-[10px] text-muted-foreground">{selected.subLabel}</p>
              </div>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${gatewayOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {gatewayOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 top-full mt-1.5 w-full rounded-xl border border-border/60 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden"
              >
                {GATEWAY_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setSelectedGateway(option.id);
                      setGatewayOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors ${
                      selectedGateway === option.id ? 'bg-[var(--gold-glow)] dark:bg-zinc-800' : ''
                    }`}
                  >
                    {option.icon}
                    <div>
                      <p className="text-xs font-semibold text-[var(--brand-text)]">{option.label}</p>
                      <p className="text-[10px] text-muted-foreground">{option.subLabel}</p>
                    </div>
                    {selectedGateway === option.id && (
                      <span className="ml-auto text-[10px] font-bold text-[var(--gold)] uppercase tracking-wider">Selected</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Retry button */}
        <button
          type="button"
          disabled={isRetrying}
          onClick={() => retryPayment(selectedGateway)}
          className={`w-full flex items-center justify-center gap-2.5 h-11 rounded-xl text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
            isCritical
              ? 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 shadow-rose-200 dark:shadow-rose-900/40'
              : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-amber-200 dark:shadow-amber-900/40'
          }`}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Processing Payment...' : `Retry with ${selected.label}`}
        </button>

        {/* Security note */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>256-bit SSL secured · Bank-grade encryption · No card data stored</span>
        </div>
      </div>
    </motion.div>
  );
}

export default PaymentRetryBanner;

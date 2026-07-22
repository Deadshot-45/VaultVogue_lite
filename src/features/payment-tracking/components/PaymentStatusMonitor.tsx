'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle,
} from 'lucide-react';
import {
  usePaymentStatusChecker,
  type CheckerStatus,
  type UsePaymentStatusCheckerOptions,
} from '../hooks/usePaymentStatusChecker';
import { PaymentRetryBanner } from './PaymentRetryBanner';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PaymentStatusMonitorProps {
  orderId: string;
  paymentMethod?: string;
  customerName?: string;
  customerPhone?: string;
  /** When true renders a slimmer inline version for sidebars */
  compact?: boolean;
  /** Called once when status reaches "paid" */
  onSuccess?: (paymentData: any) => void;
  /** Called once when status reaches "failed" */
  onFailure?: (message: string) => void;
  checkerOptions?: UsePaymentStatusCheckerOptions;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function RelativeTime({ date }: { date: Date }) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const update = () => {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 5) setLabel('just now');
      else if (seconds < 60) setLabel(`${seconds}s ago`);
      else setLabel(`${Math.floor(seconds / 60)}m ago`);
    };
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [date]);

  return <>{label}</>;
}

// ─── Status Icon ───────────────────────────────────────────────────────────────

function StatusIcon({ status }: { status: CheckerStatus }) {
  switch (status) {
    case 'paid':
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400"
        >
          <CheckCircle2 className="h-7 w-7 text-emerald-500" />
        </motion.div>
      );
    case 'failed':
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400"
        >
          <XCircle className="h-7 w-7 text-rose-500" />
        </motion.div>
      );
    case 'timeout':
      return (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400">
          <AlertTriangle className="h-7 w-7 text-amber-500" />
        </div>
      );
    default:
      return (
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold-glow)] border-2 border-[var(--gold)]">
          <Loader2 className="h-7 w-7 text-[var(--gold)] animate-spin" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full border-2 border-[var(--gold)] animate-ping opacity-30" />
        </div>
      );
  }
}

// ─── Status badge label ────────────────────────────────────────────────────────

const STATUS_LABEL: Record<CheckerStatus, string> = {
  idle:              'Initialising...',
  polling:           'Verifying with gateway...',
  'manual-checking': 'Rechecking...',
  paid:              'Payment Confirmed',
  failed:            'Payment Failed',
  timeout:           'Verification Timed Out',
};

const STATUS_COLOR: Record<CheckerStatus, string> = {
  idle:              'text-muted-foreground',
  polling:           'text-[var(--gold)]',
  'manual-checking': 'text-blue-600 dark:text-blue-400',
  paid:              'text-emerald-600 dark:text-emerald-400',
  failed:            'text-rose-600 dark:text-rose-400',
  timeout:           'text-amber-600 dark:text-amber-400',
};

// ─── Main Component ────────────────────────────────────────────────────────────

export function PaymentStatusMonitor({
  orderId,
  paymentMethod,
  customerName,
  customerPhone,
  compact = false,
  onSuccess,
  onFailure,
  checkerOptions,
}: PaymentStatusMonitorProps) {
  const {
    status,
    paymentData,
    message,
    isPolling,
    isManualChecking,
    lastCheckedAt,
    manualCheck,
    startPolling,
  } = usePaymentStatusChecker(orderId, checkerOptions);

  // Fire callbacks on terminal state
  useEffect(() => {
    if (status === 'paid') onSuccess?.(paymentData);
    if (status === 'failed') onFailure?.(message ?? 'Payment failed');
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = isPolling || isManualChecking;
  const isTerminal = status === 'paid' || status === 'failed';
  const isTimedOut = status === 'timeout';

  // ── Compact (sidebar) view ──────────────────────────────────────────────────
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          {isActive ? (
            <Loader2 className="h-4 w-4 text-[var(--gold)] animate-spin shrink-0" />
          ) : status === 'paid' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : status === 'failed' ? (
            <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
          ) : (
            <Clock className="h-4 w-4 text-amber-500 shrink-0" />
          )}
          <div>
            <p className={`text-[11px] font-semibold ${STATUS_COLOR[status]}`}>
              {STATUS_LABEL[status]}
            </p>
            {lastCheckedAt && (
              <p className="text-[10px] text-muted-foreground">
                Last checked: <RelativeTime date={lastCheckedAt} />
              </p>
            )}
          </div>
        </div>

        {!isTerminal && (
          <button
            onClick={manualCheck}
            disabled={isActive}
            title="Check payment status now"
            className="p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-[var(--gold)] hover:border-[var(--gold-soft)] transition-all disabled:opacity-40"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isManualChecking ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
    );
  }

  // ── Full (page-level) view ──────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto space-y-6"
      >
        {/* Status card */}
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-lg">
          {/* Top accent bar */}
          <div
            className={`h-1 w-full ${
              status === 'paid'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : status === 'failed'
                ? 'bg-gradient-to-r from-rose-500 to-red-400'
                : status === 'timeout'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-[var(--gold)] to-amber-400 animate-pulse'
            }`}
          />

          <div className="p-8 flex flex-col items-center text-center gap-4">
            <StatusIcon status={status} />

            <div className="space-y-1">
              <h2 className={`text-lg font-bold ${STATUS_COLOR[status]}`}>
                {STATUS_LABEL[status]}
              </h2>

              {message && (
                <p className="text-xs text-muted-foreground">{message}</p>
              )}

              {isPolling && !isTerminal && (
                <p className="text-xs text-muted-foreground">
                  Listening for gateway confirmation...
                </p>
              )}
            </div>

            {/* Polling indicator row */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              {isPolling ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-[var(--gold)]" />
                  <span>Auto-verifying via webhook</span>
                </>
              ) : isTimedOut ? (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-amber-500" />
                  <span>Auto-poll expired — use manual check</span>
                </>
              ) : null}

              {lastCheckedAt && (
                <span className="ml-1 opacity-70">
                  · <RelativeTime date={lastCheckedAt} />
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 w-full">
              {/* Manual check — always visible while not terminal */}
              {!isTerminal && (
                <button
                  onClick={manualCheck}
                  disabled={isActive}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 bg-white dark:bg-zinc-900 hover:border-[var(--gold-soft)] text-xs font-semibold text-[var(--brand-text)] transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isManualChecking ? 'animate-spin' : ''}`} />
                  {isManualChecking ? 'Checking...' : 'Check Status Now'}
                </button>
              )}

              {/* Restart poll after timeout */}
              {isTimedOut && (
                <button
                  onClick={startPolling}
                  disabled={isPolling}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--gold)] text-white text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90 disabled:opacity-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry Auto-Verify
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Retry banner for FAILED state */}
        {status === 'failed' && (
          <PaymentRetryBanner
            orderId={orderId}
            paymentStatus="failed"
            errorMessage={message ?? undefined}
            customerName={customerName}
            customerPhone={customerPhone}
            defaultGateway={
              paymentMethod === 'card' ? 'stripe' :
              paymentMethod === 'cod'  ? 'cod'    : 'razorpay'
            }
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default PaymentStatusMonitor;

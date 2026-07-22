'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { verifyAndPollPaymentStatus, type PollResult } from '../api/paymentTrackingApi';
import { paymentTrackingApi } from '../api/paymentTrackingApi';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CheckerStatus =
  | 'idle'
  | 'polling'
  | 'manual-checking'
  | 'paid'
  | 'failed'
  | 'timeout';

export interface PaymentStatusCheckerState {
  /** Resolved terminal status — null while still checking */
  status: CheckerStatus;
  /** Raw payment data returned by a successful poll */
  paymentData: any | null;
  /** Human-readable error / timeout message */
  message: string | null;
  /** Number of auto-poll cycles run so far */
  pollingAttempts: number;
  /** Is the automatic polling loop currently active? */
  isPolling: boolean;
  /** Is a user-triggered manual check in flight? */
  isManualChecking: boolean;
  /** Timestamp of the most recent successful status fetch */
  lastCheckedAt: Date | null;
}

export interface UsePaymentStatusCheckerOptions {
  /**
   * Start auto-polling immediately on mount.
   * Default: true
   */
  autoStart?: boolean;
  /**
   * Max automatic poll attempts before switching to timeout state.
   * Default: 5
   */
  maxAttempts?: number;
  /**
   * Base delay between automatic poll attempts (ms).
   * The actual wait = delayMs × attemptNumber  (linear backoff).
   * Default: 2000
   */
  delayMs?: number;
  /**
   * Extra React-Query cache keys to invalidate once payment is confirmed paid.
   */
  invalidateOnSuccess?: string[][];
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Dual-mode payment status checker.
 *
 * MODE 1 — Automatic polling (webhook-driven, passive):
 *   Calls `verifyAndPollPaymentStatus` in the background. The backend DB is
 *   kept up-to-date by the gateway's webhook handler, so each poll effectively
 *   "listens" for webhook completion without needing a WebSocket.
 *
 * MODE 2 — Manual check (user-triggered, active):
 *   Calls `GET /api/payments/:orderId/status` on demand, bypassing the poll
 *   loop. Acts as a fallback when the auto-poll has timed out or the user
 *   simply wants an immediate refresh.
 *
 * Whichever mode resolves to a terminal state first wins.
 */
export function usePaymentStatusChecker(
  orderId: string | null | undefined,
  options: UsePaymentStatusCheckerOptions = {},
) {
  const {
    autoStart = true,
    maxAttempts = 5,
    delayMs = 2000,
    invalidateOnSuccess = [],
  } = options;

  const queryClient = useQueryClient();

  const [state, setState] = useState<PaymentStatusCheckerState>({
    status: 'idle',
    paymentData: null,
    message: null,
    pollingAttempts: 0,
    isPolling: false,
    isManualChecking: false,
    lastCheckedAt: null,
  });

  // Prevent state updates after unmount
  const mountedRef = useRef(true);
  // Prevent duplicate poll runs
  const pollingRef = useRef(false);

  const safeSetState = useCallback(
    (update: Partial<PaymentStatusCheckerState>) => {
      if (mountedRef.current) {
        setState((prev) => ({ ...prev, ...update }));
      }
    },
    [],
  );

  /** Invalidate all relevant React-Query caches on confirmed payment */
  const invalidateCaches = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['userOrders'] });
    queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    queryClient.invalidateQueries({ queryKey: ['payment-status', orderId] });
    for (const key of invalidateOnSuccess) {
      queryClient.invalidateQueries({ queryKey: key });
    }
  }, [queryClient, orderId, invalidateOnSuccess]);

  // ── Map PollResult → CheckerStatus ──────────────────────────────────────────
  const applyPollResult = useCallback(
    (result: PollResult) => {
      const now = new Date();

      if (result.success && result.status === 'paid') {
        invalidateCaches();
        safeSetState({
          status: 'paid',
          paymentData: result.payment,
          message: null,
          isPolling: false,
          isManualChecking: false,
          lastCheckedAt: now,
        });
        return;
      }

      if (!result.success && result.status === 'failed') {
        safeSetState({
          status: 'failed',
          message: result.message,
          isPolling: false,
          isManualChecking: false,
          lastCheckedAt: now,
        });
        return;
      }

      // status === 'pending' → timed out
      safeSetState({
        status: 'timeout',
        message: result.message,
        isPolling: false,
        isManualChecking: false,
        lastCheckedAt: now,
      });
    },
    [invalidateCaches, safeSetState],
  );

  // ── MODE 1: Auto polling ─────────────────────────────────────────────────────
  const startPolling = useCallback(async () => {
    if (!orderId || pollingRef.current) return;

    pollingRef.current = true;
    safeSetState({ status: 'polling', isPolling: true, pollingAttempts: 0 });

    const result = await verifyAndPollPaymentStatus(orderId, maxAttempts, delayMs);

    pollingRef.current = false;
    applyPollResult(result);
  }, [orderId, maxAttempts, delayMs, safeSetState, applyPollResult]);

  // ── MODE 2: Manual check ─────────────────────────────────────────────────────
  const manualCheck = useCallback(async () => {
    if (!orderId || state.isManualChecking) return;

    safeSetState({ isManualChecking: true });

    try {
      // Use the React-Query-aware endpoint for a single fresh fetch
      const res = await paymentTrackingApi.getPaymentStatus(orderId);
      const now = new Date();

      safeSetState({ lastCheckedAt: now, isManualChecking: false });

      if (!res.payment) return;

      const payStatus = res.payment.status?.toLowerCase();

      if (payStatus === 'success' || payStatus === 'paid') {
        invalidateCaches();
        safeSetState({ status: 'paid', paymentData: res.payment, message: null });
      } else if (payStatus === 'failed') {
        safeSetState({
          status: 'failed',
          message: res.payment.errorMessage || 'Payment was declined.',
        });
      }
      // Otherwise keep current status — still processing
    } catch (err: any) {
      console.warn('Manual payment check failed:', err?.message || err);
      safeSetState({ isManualChecking: false });
    }
  }, [orderId, state.isManualChecking, invalidateCaches, safeSetState]);

  /** Abort the auto-poll (e.g. user navigates away) */
  const stopPolling = useCallback(() => {
    pollingRef.current = false;
    safeSetState({ isPolling: false });
  }, [safeSetState]);

  // ── Mount / unmount lifecycle ────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    if (autoStart && orderId) {
      startPolling();
    }

    return () => {
      mountedRef.current = false;
      pollingRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return {
    ...state,
    manualCheck,
    startPolling,
    stopPolling,
  };
}

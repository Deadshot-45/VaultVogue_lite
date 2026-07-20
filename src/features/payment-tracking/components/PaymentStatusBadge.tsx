import React from 'react';
import type { PaymentStatus } from '../types/payment';
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'SUCCESS':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Payment Captured</span>
        </span>
      );
    case 'PROCESSING':
    case 'AUTHORIZED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{status}</span>
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Payment Failed</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
          <Clock className="w-3.5 h-3.5" />
          <span>{status}</span>
        </span>
      );
  }
};

export default PaymentStatusBadge;

'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ApiError } from '@/lib/services/apiservices';

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class QueryErrorBoundary extends React.Component<QueryErrorBoundaryProps, State> {
  constructor(props: QueryErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('QueryErrorBoundary caught an API error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const error = this.state.error;
      const isApiError = error instanceof ApiError;
      const status = isApiError ? error.status : null;
      const message = error?.message || 'Failed to load tracking data.';

      return (
        <div className="bg-white dark:bg-zinc-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 shadow-sm space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {this.props.fallbackTitle || (status === 404 ? 'Tracking Record Not Found' : 'Service Temporarily Unavailable')}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              {message}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-zinc-100 text-white dark:text-gray-900 text-xs font-semibold rounded-xl hover:bg-gray-800 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function logError(error: unknown, context?: string) {
  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", context, error);
  }

  // Production hook (Sentry, LogRocket, Datadog, etc.)
  // sentry.captureException(error)
}

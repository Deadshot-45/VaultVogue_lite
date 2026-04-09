const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

export function logError(error: unknown, context?: string) {
  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", context, error);
  } else {
    console.error("[Error]", context, getErrorMessage(error));
  }

  // Production hook (Sentry, LogRocket, Datadog, etc.)
  // sentry.captureException(error)
}

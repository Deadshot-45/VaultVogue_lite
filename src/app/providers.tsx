"use client";

import { ErrorBoundary } from "@/components/feedback/error-boundary";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-context";
import { AuthInitializer } from "@/lib/store/AuthInitializer";
import { getAuthCookie } from "@/lib/auth";
import { makePersistor, makeStore } from "@/lib/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Loader } from "@/components/feedback/Loader";

// Suppress the React 19 warning for next-themes script tag in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

import { StorefrontProvider } from "@/features/storefront/context/storefront-context";

interface Props {
  readonly children: React.ReactNode;
}

export function Providers({ children }: Props) {
  const [store] = useState(() => makeStore());
  const [persistor, setPersistor] = useState<ReturnType<
    typeof makePersistor
  > | null>(null);
  const persistorRef = useRef<ReturnType<typeof makePersistor> | null>(null);
  // Inside your Providers component, replace the current initialization:
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes: Catalog data is served instantly from cache without an Express network request
            gcTime: 1000 * 60 * 10, // 10 minutes: Unused cache data stays in memory before garbage collection
            refetchOnWindowFocus: false, // Prevents refreshing the catalog every time the user clicks back into the browser window
          },
        },
      }),
  );

  useEffect(() => {
    if (!persistorRef.current) {
      const nextPersistor = makePersistor(store);
      persistorRef.current = nextPersistor;
      setPersistor(nextPersistor);
    }
  }, [store]);

  useEffect(() => {
    const token = getAuthCookie();
    console.log(token);
    if (token) {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  }, [queryClient]);

  return (
    <ThemeProvider>
      <StorefrontProvider>
        <ReduxProvider store={store}>
          {persistor ? (
            <PersistGate loading={<Loader />} persistor={persistor}>
              <ErrorBoundary>
                <AuthInitializer />
                <QueryClientProvider client={queryClient}>
                  <SidebarProvider>
                    <div>
                      <Toaster
                        position="top-right"
                        duration={3000}
                        expand={true}
                        richColors={false}
                        closeButton={true}
                        toastOptions={{
                          classNames: {
                            toast: "toast",
                            success: "toast-success",
                            error: "toast-error",
                            info: "toast-info",
                            warning: "toast-warning",
                            loading: "toast-loading",
                          },
                        }}
                      />
                    </div>
                    {children}
                  </SidebarProvider>
                </QueryClientProvider>
              </ErrorBoundary>
            </PersistGate>
          ) : (
            <Loader />
          )}
        </ReduxProvider>
      </StorefrontProvider>
    </ThemeProvider>
  );
}

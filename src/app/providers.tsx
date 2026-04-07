"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthInitializer } from "@/lib/store/AuthInitializer";
import { getAuthCookie } from "@/lib/auth";
import { makePersistor, makeStore } from "@/lib/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

interface Props {
  readonly children: React.ReactNode;
}

export function Providers({ children }: Props) {
  const [store] = useState(() => makeStore());
  const [persistor] = useState(() => makePersistor(store));
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    const token = getAuthCookie();
    console.log(token);
    if (token) {
      queryClient.invalidateQueries({ queryKey: ["cart-details"] });
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <PersistGate
        loading={
          <div className="h-screen flex items-center justify-center">
            Loading...
          </div>
        }
        persistor={persistor}
      >
        <ErrorBoundary>
          <AuthInitializer />
          <QueryClientProvider client={queryClient}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
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
                      },
                    }}
                  />
                </div>
                {children}
              </SidebarProvider>
            </NextThemesProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </PersistGate>
    </ReduxProvider>
  );
}

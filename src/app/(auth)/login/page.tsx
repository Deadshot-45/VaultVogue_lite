import React, { Suspense } from "react";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Sign In | VAULT VOGUE",
  description:
    "Sign in to your VAULT VOGUE Maison account to access your orders, saved items, and personalized edits.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--vault-bg)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--vault-accent)]" />
        </div>
      }
    >
      <AuthPage initialMode="signin" />
    </Suspense>
  );
}

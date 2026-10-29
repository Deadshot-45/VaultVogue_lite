import React, { Suspense } from "react";
import { AuthPage } from "@/features/auth/components/AuthPage";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Create Account | VAULT VOGUE",
  description:
    "Join the VAULT VOGUE Maison. Unlock priority collection capsules, bespoke concierge care, and cryptographic provenance certificates.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--vault-bg)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--vault-accent)]" />
        </div>
      }
    >
      <AuthPage initialMode="signup" />
    </Suspense>
  );
}

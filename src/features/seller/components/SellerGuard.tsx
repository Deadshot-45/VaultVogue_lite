"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Clock, ShieldAlert, ArrowLeft, Store, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { sellerService } from "@/lib/services/sellerService";

interface SellerGuardProps {
  children: React.ReactNode;
}

export function SellerGuard({ children }: SellerGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<"approved" | "pending" | "rejected" | "not_found" | "loading">("loading");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated || !user) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    // Bypass check for admin users
    if (user.role === "admin") {
      setStatus("approved");
      return;
    }

    const checkStatus = async () => {
      try {
        // 1. Attempt to fetch from real API
        const seller = await sellerService.getByEmail(user.email);
        if (seller) {
          setBusinessName(seller.name);
          setStatus(seller.status);
          return;
        }
      } catch (err) {
        console.warn("Backend API status check failed, using localStorage fallback:", err);
      }

      // 2. LocalStorage Fallback (local testing)
      const localSellers = localStorage.getItem("vault_vogue_admin_sellers");
      if (localSellers) {
        const sellersList = JSON.parse(localSellers);
        const match = sellersList.find((s: any) => s.email.toLowerCase() === user.email.toLowerCase());
        
        if (match) {
          setBusinessName(match.businessName);
          setStatus(match.status);
          return;
        }
      }
      setStatus("not_found");
    };

    checkStatus();
  }, [isAuthenticated, user, router]);

  // Prevent hydration flashing
  if (!mounted || status === "loading") {
    return (
      <div className="flex min-h-screen w-full mx-auto items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--gold)" }} />
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] font-medium">
            Resolving Partner Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Approved status: Show dashboard pages
  if (status === "approved") {
    return <>{children}</>;
  }

  // Pending status blocker page
  if (status === "pending") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-[var(--background)]">
        <div className="card max-w-md w-full text-center p-8 space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto">
            <Clock className="h-6 w-6 text-amber-500 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="font-cormorant text-2xl font-light text-[var(--brand-text)]">
              Application Under Curation Review
            </h2>
            <p className="text-xs text-muted-foreground">
              Your registration for <strong className="text-[var(--brand-text)] font-semibold">{businessName || "your brand"}</strong> is currently under review by our Maison Curation Board.
            </p>
          </div>

          <p className="text-[11px] text-muted-foreground bg-[var(--gold-glow)] border border-[var(--gold-faint)] p-3 rounded-lg">
            Verification typically takes 24–48 hours. You will receive an approval notification containing your boutique credentials.
          </p>

          <div className="pt-2 flex justify-center gap-4">
            <Link href="/" className="btn-ghost py-2 px-4 text-xs flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Boutique Floor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Rejected status blocker page
  if (status === "rejected") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-[var(--background)]">
        <div className="card max-w-md w-full text-center p-8 space-y-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 mx-auto">
            <ShieldAlert className="h-6 w-6 text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="font-cormorant text-2xl font-light text-red-500">
              Application Declined
            </h2>
            <p className="text-xs text-muted-foreground">
              We regret to inform you that your application for <strong className="text-[var(--brand-text)] font-semibold">{businessName}</strong> does not align with our current curation guidelines.
            </p>
          </div>

          <p className="text-[11px] text-muted-foreground">
            For inquiries regarding our brand selection policies, please get in touch with our partnerships office at <span className="underline">partnerships@vaultvogue.com</span>.
          </p>

          <div className="pt-2 flex justify-center">
            <Link href="/" className="btn-primary py-2 px-5 text-xs">
              Return to Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not registered as seller blocker page
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[var(--background)]">
      <div className="card max-w-md w-full text-center p-8 space-y-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gold-faint)] border border-[var(--gold-soft)] mx-auto">
          <Store className="h-6 w-6 text-[var(--gold)]" />
        </div>

        <div className="space-y-2">
          <h2 className="font-cormorant text-2xl font-light text-[var(--brand-text)]">
            Register as a Seller Partner
          </h2>
          <p className="text-xs text-muted-foreground">
            You do not currently have an active seller profile associated with <strong className="text-[var(--brand-text)]">{user?.email}</strong>.
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Apply today to gain access to the Vault Vogue partner tools and begin cataloging your collection.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link href="/" className="btn-ghost py-2 px-4 text-xs">
            Cancel
          </Link>
          <Link href="/sell" className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

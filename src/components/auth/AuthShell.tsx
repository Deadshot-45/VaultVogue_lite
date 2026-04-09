"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
};

export function AuthShell({
  title,
  description,
  footerText,
  footerLink,
  footerLinkLabel,
  children,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-[#0f172acc] dark:shadow-[0_28px_100px_rgba(0,0,0,0.35)]">
        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

        {/* Header */}
        <div>
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/65 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5" />
              Secure Access
            </div>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full px-4 text-muted-foreground"
            >
              <Link href="/">
                Storefront
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-foreground">
            {title}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Feature Pills (mobile only) */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:hidden">
          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium">Curated drops</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <Truck className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium">Fast delivery</p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-medium">Protected checkout</p>
          </div>
        </div>

        {/* Form / Content */}
        {children}

        {/* Divider */}
        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-border/80" />
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Account Access
          </span>
          <div className="h-px flex-1 bg-border/80" />
        </div>

        {/* Footer */}
        <p className="text-sm text-muted-foreground">
          {footerText}{" "}
          <Link href={footerLink} className="font-semibold text-foreground">
            {footerLinkLabel}
          </Link>
        </p>
      </Card>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUpRight,
  LockKeyhole,
  PackageCheck,
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

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Trusted Checkout",
    description:
      "Encrypted access, protected sessions, and dependable support.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Priority dispatch on curated drops and seasonal collections.",
  },
  {
    icon: PackageCheck,
    title: "Order Tracking",
    description:
      "Keep every purchase, return, and update in one clean account.",
  },
];

const stats = [
  { value: "48h", label: "Express dispatch" },
  { value: "4.9/5", label: "Member satisfaction" },
  { value: "24/7", label: "Support coverage" },
];

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkLabel,
}: AuthShellProps) {
  return (
    <section className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative hidden overflow-hidden rounded-[2rem] border border-black/5 bg-[linear-gradient(135deg,#0f172a_0%,#111827_52%,#1f2937_100%)] p-8 text-white shadow-[0_32px_100px_rgba(15,23,42,0.25)] lg:flex lg:flex-col lg:justify-between dark:border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(212,175,55,0.22),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.08),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.03)_45%,transparent_70%)]" />

          <div className="relative z-10">
            <Badge className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/80 shadow-none backdrop-blur-md">
              Premium Member Access
            </Badge>

            <div className="mt-8 max-w-xl">
              <p className="text-sm uppercase tracking-[0.35em] text-white/45">
                Vault Vogue
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-balance xl:text-5xl">
                Elevated fashion starts with a sharper account experience.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
                Sign in to manage orders, save favorites, and move through
                checkout with the polish of a premium storefront.
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {valueProps.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-xl"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                    <item.icon className="h-5 w-5 text-[#f3d08b]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-white/62">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid gap-4 mt-4 xl:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-5 backdrop-blur-md"
              >
                <p className="text-2xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Card className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8 dark:border-white/10 dark:bg-[#0f172acc] dark:shadow-[0_28px_100px_rgba(0,0,0,0.35)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

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
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
                {title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>

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

            {children}

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/80" />
              <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Account Access
              </span>
              <div className="h-px flex-1 bg-border/80" />
            </div>

            <p className="text-sm text-muted-foreground">
              {footerText}{" "}
              <Link href={footerLink} className="font-semibold text-foreground">
                {footerLinkLabel}
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

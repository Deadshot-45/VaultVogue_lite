"use client";

import { ArrowUpRight, LockKeyhole } from "lucide-react";
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl p-6 sm:p-10 backdrop-blur-2xl"
        style={{
          background: "color-mix(in oklch, var(--bg) 92%, transparent)",
          border: "1px solid var(--gold-faint)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.08)",
        }}
      >
        {/* Top gold accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--gold-soft), transparent)",
          }}
        />

        {/* Header row */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
            style={{
              border: "1px solid var(--gold-faint)",
              background: "var(--gold-glow)",
            }}
          >
            <LockKeyhole className="h-3.5 w-3.5" />
            Secure Access
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Storefront
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Title */}
        <h2 className="font-cormorant text-4xl font-light tracking-tight text-foreground">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {/* Form content */}
        <div className="mt-8">{children}</div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: "var(--gold-faint)" }} />
          <span
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: "var(--gold)" }}
          >
            Account Access
          </span>
          <div className="h-px flex-1" style={{ background: "var(--gold-faint)" }} />
        </div>

        {/* Footer */}
        <p className="text-sm text-muted-foreground">
          {footerText}{" "}
          <Link
            href={footerLink}
            className="font-semibold text-foreground transition-colors duration-200 hover:opacity-70"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

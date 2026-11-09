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
    <div className="flex min-h-screen items-center justify-center bg-(--vault-bg) px-4 py-12 transition-colors duration-300">
      <div className="relative w-full max-w-xl border border-(--vault-line) bg-(--vault-panel) p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Top Rose Gold accent line */}
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--vault-accent), transparent)",
          }}
        />

        {/* Header row */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-2 border border-(--vault-line) bg-(--vault-bg) px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-(--vault-accent)">
            <LockKeyhole className="h-3 w-3 text-(--vault-accent)" />
            Authenticated Gateway
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1 border border-(--vault-line) px-3.5 py-1 font-mono text-[10px] uppercase tracking-wider text-(--vault-muted) transition-colors duration-200 hover:border-(--vault-accent) hover:text-(--vault-accent)"
          >
            Storefront
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Title */}
        <h2 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-tight text-(--vault-ink)">
          {title}
        </h2>

        <p className="mt-2.5 max-w-md font-sans text-xs sm:text-sm leading-relaxed text-(--vault-muted)">
          {description}
        </p>

        {/* Form content */}
        <div className="mt-8">{children}</div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-(--vault-line)" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-(--vault-accent) font-semibold flex items-center gap-1">
             VAULT VOGUE IDENTITY
          </span>
          <div className="h-px flex-1 bg-(--vault-line)" />
        </div>

        {/* Footer */}
        <p className="font-mono text-xs text-(--vault-muted) text-center sm:text-left">
          {footerText}{" "}
          <Link
            href={footerLink}
            className="font-semibold text-(--vault-accent) uppercase tracking-wider transition-colors hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

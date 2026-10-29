"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main
      role="main"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--vault-bg)] px-6 py-24 text-center text-[var(--vault-ink)] transition-colors duration-300"
    >
      <div className="mx-auto max-w-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-14 shadow-2xl backdrop-blur-md">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--vault-accent)] animate-pulse" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--vault-accent)]">
            ERROR 404 // VOID COORDINATE
          </p>
        </div>

        <div className="mx-auto my-5 h-px w-16 bg-[var(--vault-accent)]/40" />

        {/* Masked Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-none">
          Page Not Found.
        </h1>

        {/* Narrative Description */}
        <p className="mx-auto mt-5 max-w-md font-sans text-xs sm:text-sm text-[var(--vault-muted)] leading-relaxed">
          The silhouette, archive entry, or collection coordinate you requested does not exist or has been rotated to our private retrospective.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3 font-mono text-xs uppercase tracking-widest font-bold"
          >
            Explore Catalog <ArrowRight size={13} />
          </Link>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider"
          >
            <ArrowLeft size={13} /> Go Back
          </button>
        </div>

        {/* Footer Meta */}
        <div className="mt-10 pt-6 border-t border-[var(--vault-line)] flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[var(--vault-muted)]">
          <span>VAULT VOGUE ATELIER</span>
          <span className="text-[var(--vault-accent)]">PARIS · INDORE · TOKYO</span>
        </div>
      </div>
    </main>
  );
}

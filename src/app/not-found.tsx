"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main
      role="main"
      className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 text-center"
    >
      <p className="section-label">Error 404</p>
      <div className="gold-divider mx-auto mt-4" />
      <h1 className="mt-8 font-cormorant text-6xl font-light tracking-tight text-foreground md:text-8xl">
        Page Not Found
      </h1>

      <p className="mt-8 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
        The archive you are looking for does not exist or has been moved to a new collection.
      </p>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={() => router.push("/")}
          className="rounded-full px-10 py-3 text-sm font-medium text-white transition-all active:scale-95"
          style={{ background: "var(--gold)" }}
        >
          Return Home
        </button>
        <button
          onClick={() => router.back()}
          className="rounded-full border border-border/40 px-10 py-3 text-sm font-medium transition-colors hover:bg-muted/50"
        >
          Go Back
        </button>
      </div>
    </main>
  );
}

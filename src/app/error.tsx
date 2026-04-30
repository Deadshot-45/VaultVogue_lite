"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 p-6 py-24 text-center">
      <p className="section-label">System Error</p>
      <div className="gold-divider mx-auto" />
      <h1 className="mt-4 font-cormorant text-4xl font-light tracking-tight text-foreground md:text-6xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm leading-7 text-muted-foreground">
        {error.message || "An unexpected error occurred while loading this collection."}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          onClick={() => reset()}
          className="rounded-full px-10 py-3 text-sm font-medium text-white transition-all active:scale-95"
          style={{ background: "var(--gold)" }}
        >
          Try Again
        </button>
        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-border/40 px-10 py-3 text-sm font-medium transition-colors hover:bg-muted/50"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

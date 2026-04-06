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
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-muted-foreground">{error.message || "An unexpected error occurred."}</p>

      <div className="flex gap-3">
        <Button
          onClick={() => reset()}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Try again
        </Button>

        <Button
          onClick={() => router.push("/")}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}

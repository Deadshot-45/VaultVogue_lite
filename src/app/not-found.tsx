"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main
      role="main"
      className="flex h-screen w-screen flex-col items-center justify-center px-6 text-center py-20"
    >
      <h1 className="text-5xl font-bold tracking-tight">404</h1>

      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>

      <div className="mt-6 flex gap-3">
        <Button
          onClick={() => router.back()}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Go Back
        </Button>

        <Button
          onClick={() => router.push("/")}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Go Home
        </Button>
      </div>
    </main>
  );
}

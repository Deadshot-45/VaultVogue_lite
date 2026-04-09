"use client";

import { Badge } from "@/components/ui/badge";

const returnSteps = [
  "Request a return within 7 days of delivery from your account or support email.",
  "Make sure the item is unused, with original tags and packaging intact.",
  "Once approved, our team shares pickup or self-ship instructions.",
  "Refunds are processed after the returned item passes quality review.",
];

export default function ReturnsPage() {
  return (
    <section className="sale-theme mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="rounded-[2rem] border border-white/10 dark:bg-gradient-to-br from-[#2a0c0f] to-[#140607] p-8 shadow-lg">
        <Badge className="rounded-full px-3 py-1 sale-primary">Returns</Badge>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Returns Made Simple
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          We keep the process clear and straightforward so you can shop with
          more confidence.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-8 grid gap-4">
        {returnSteps.map((step, index) => (
          <div
            key={step}
            className="flex gap-4 rounded-[1.5rem] border border-foreground/10 sale-bg-gradient dark:bg-[#1a0a0c] p-6 transition-all hover:-translate-y-1 dark:hover:bg-[#221012] hover:shadow-lg"
          >
            {/* Step Number */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white font-semibold">
              {index + 1}
            </div>

            {/* Text */}
            <p className="pt-2 text-sm leading-6 text-muted-foreground">
              {step}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

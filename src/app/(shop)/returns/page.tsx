"use client";

import { Badge } from "@/components/ui/badge";

const returnSteps = [
  "Request a return edit within 7 days of delivery from your account workspace or client concierge.",
  "Ensure the creation is unused, with original tags, labels, and atelier packaging fully intact.",
  "Once approved, our team shares shipping instructions and logistics details.",
  "Refunds are credited to your original payment method after passing physical inspection.",
];

export default function ReturnsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
      {/* Header */}
      <div className="text-center rounded-[2rem] border border-[var(--gold-soft)] bg-card/45 p-8 sm:p-12 shadow-xl backdrop-blur-md">
        <Badge className="rounded-full px-3 py-1 badge-gold">Returns</Badge>

        <h1 className="mt-6 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
          Atelier Return Policies
        </h1>
        <div className="gold-divider mx-auto mt-4" />

        <p className="mx-auto mt-6 max-w-xl text-xs text-muted-foreground leading-relaxed">
          We maintain a refined and clear process to ensure your shopping experience remains flawless.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-12 grid gap-6">
        {returnSteps.map((step, index) => (
          <div
            key={step}
            className="flex gap-5 rounded-2xl border border-border/40 bg-card/25 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--gold-soft)] hover:shadow-md"
          >
            {/* Step Number */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold)] text-white text-xs font-bold shadow-sm">
              0{index + 1}
            </div>

            {/* Text */}
            <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
              {step}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

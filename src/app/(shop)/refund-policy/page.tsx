"use client";

import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Clock, Ban } from "lucide-react";

const refundPoints = [
  {
    title: "Refund Eligibility",
    detail:
      "Refunds are typically issued for approved returns, canceled prepaid orders, or confirmed fulfillment issues under the Maison guarantee.",
    icon: RefreshCcw,
  },
  {
    title: "Processing Timeline",
    detail:
      "Once approved, refunds are usually processed back to your original payment method within 5 to 10 business days.",
    icon: Clock,
  },
  {
    title: "Non-Refundable Cases",
    detail:
      "Items returned damaged, used, or without original tags and atelier sealing may not qualify for a full refund review.",
    icon: Ban,
  },
];

export default function RefundPolicyPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
      {/* Header */}
      <div className="text-center rounded-[2rem] border border-[var(--gold-soft)] bg-card/45 p-8 sm:p-12 shadow-xl backdrop-blur-md">
        <Badge className="rounded-full px-3 py-1 badge-gold">Legal</Badge>

        <h1 className="mt-6 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
          Atelier Refund Policy
        </h1>
        <div className="gold-divider mx-auto mt-4" />

        <p className="mx-auto mt-6 max-w-xl text-xs text-muted-foreground leading-relaxed">
          Clear guidance on when refunds are available and how long the transition process takes.
        </p>
      </div>

      {/* Points */}
      <div className="mt-12 space-y-4">
        {refundPoints.map((point) => (
          <div
            key={point.title}
            className="flex gap-5 rounded-2xl border border-border/40 bg-card/25 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--gold-soft)] hover:shadow-md"
          >
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--gold-faint)]">
              <point.icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-sm font-semibold text-[var(--brand-text)]">
                {point.title}
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {point.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

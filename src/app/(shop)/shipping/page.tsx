"use client";

import { Badge } from "@/components/ui/badge";

const shippingInfo = [
  {
    title: "Standard Atelier Delivery",
    detail:
      "Delivered in 3 to 7 business days across most premium metropolitan and regional locations.",
  },
  {
    title: "Real-time Order Tracking",
    detail:
      "Tracking details are shared via client notifications once your creation is packed and dispatched.",
  },
  {
    title: "Shipping Milestones",
    detail:
      "You will receive curated status updates for confirmed, packed, shipped, and delivered orders.",
  },
];

export default function ShippingPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
      {/* Header */}
      <div className="text-center rounded-[2rem] border border-[var(--gold-soft)] bg-card/45 p-8 sm:p-12 shadow-xl backdrop-blur-md">
        <Badge className="rounded-full px-3 py-1 badge-gold">Shipping</Badge>

        <h1 className="mt-6 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
          Delivery &amp; Shipping Services
        </h1>
        <div className="gold-divider mx-auto mt-4" />

        <p className="mx-auto mt-6 max-w-xl text-xs text-muted-foreground leading-relaxed">
          Everything you need to know about dispatch timelines, delivery windows, and tracking coordinates.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {shippingInfo.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border/40 bg-card/25 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--gold-soft)] hover:shadow-md"
          >
            <h2 className="text-sm font-semibold tracking-wide text-[var(--brand-text)]">
              {item.title}
            </h2>

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

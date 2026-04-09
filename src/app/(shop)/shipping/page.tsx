"use client";

import { Badge } from "@/components/ui/badge";

const shippingInfo = [
  {
    title: "Standard Delivery",
    detail:
      "Delivered in 3 to 7 business days across most serviceable locations.",
  },
  {
    title: "Order Tracking",
    detail:
      "Tracking details are shared after your package is packed and dispatched.",
  },
  {
    title: "Shipping Updates",
    detail:
      "You will receive status updates for confirmed, packed, shipped, and delivered orders.",
  },
];

export default function ShippingPage() {
  return (
    <section className="sale-theme mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div
        className="text-center rounded-[2rem] border border-border/50 bg-background/70 p-8 shadow-sm backdrop-blur-sm 
                      dark:border-white/10 dark:bg-gradient-to-br dark:from-[#2a0c0f] dark:to-[#140607] dark:shadow-lg"
      >
        <Badge className="rounded-full px-3 py-1 sale-primary">Shipping</Badge>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground dark:text-white">
          Delivery and Shipping Info
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Everything you need to know about dispatch timelines, delivery
          windows, and tracking.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {shippingInfo.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.5rem] border border-border/50 bg-background/70 p-6 backdrop-blur-sm transition-all 
                       hover:-translate-y-1 hover:shadow-md
                       dark:border-white/10 dark:bg-[#1a0a0c] dark:hover:bg-[#221012] dark:hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              {item.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

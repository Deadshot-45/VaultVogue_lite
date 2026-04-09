"use client";

import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Clock, Ban } from "lucide-react";

const refundPoints = [
  {
    title: "Refund Eligibility",
    detail:
      "Refunds are typically issued for approved returns, canceled prepaid orders, or confirmed fulfillment issues.",
    icon: RefreshCcw,
  },
  {
    title: "Processing Timeline",
    detail:
      "Once approved, refunds are usually processed back to the original payment method within 5 to 10 business days.",
    icon: Clock,
  },
  {
    title: "Non-Refundable Cases",
    detail:
      "Items returned damaged, used, or without original tags may not qualify for a full refund review.",
    icon: Ban,
  },
];

export default function RefundPolicyPage() {
  return (
    <section className="sale-theme mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div
        className="text-center rounded-[2rem] border border-border/50 bg-background/70 p-8 shadow-sm backdrop-blur-sm
                      dark:border-white/10 dark:bg-gradient-to-br dark:from-[#2a0c0f] dark:to-[#140607] dark:shadow-lg"
      >
        <Badge className="rounded-full px-3 py-1 sale-primary">Legal</Badge>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground dark:text-white">
          Refund Policy
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Clear guidance on when refunds are available and how long the process
          usually takes.
        </p>
      </div>

      {/* Points */}
      <div className="mt-10 space-y-4">
        {refundPoints.map((point) => (
          <div
            key={point.title}
            className="flex gap-4 rounded-[1.5rem] border border-border/50 bg-background/70 p-6 backdrop-blur-sm transition-all
                       hover:-translate-y-1 hover:shadow-md
                       dark:border-white/10 dark:bg-[#1a0a0c] dark:hover:bg-[#221012] dark:hover:shadow-lg"
          >
            {/* Icon */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl 
                            bg-primary/10 text-primary
                            dark:bg-white/5 dark:text-red-400"
            >
              <point.icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-lg font-semibold text-foreground dark:text-white">
                {point.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {point.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import ProtectedPage from "@/components/auth/ProtectedPage";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const orders = [
  {
    id: "SH-1234",
    status: "Delivered",
    total: "$495.00",
    date: "March 21, 2026",
  },
  {
    id: "SH-2871",
    status: "Processing",
    total: "$245.00",
    date: "April 4, 2026",
  },
];

export default function OrdersPage() {
  const router = useRouter();

  return (
    <ProtectedPage>
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
        
        {/* Editorial Heading */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Fulfillment History</p>
            <div className="gold-divider" />
            <h1 className="mt-5 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
              Maison Orders
            </h1>
          </div>
          <button
            onClick={() => router.push("/")}
            className="btn-secondary hidden sm:inline-flex py-3.5 text-xs font-semibold uppercase tracking-wider"
          >
            Continue Browsing
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </button>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md transition-all hover:border-[var(--gold-soft)] shadow-md hover:shadow-lg"
            >
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--gold-faint)]">
                    <PackageCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--brand-text)]">{order.id}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Placed on {order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="text-right space-y-1">
                    <p className="text-base font-bold text-[var(--gold)]">{order.total}</p>
                    <Badge className="rounded-full badge-gold font-normal px-2.5 py-0.5 text-[9px]">
                      {order.status}
                    </Badge>
                  </div>
                  <button className="btn-secondary py-2.5 px-6 text-xs font-semibold uppercase tracking-wider border-[var(--gold-soft)] text-[var(--gold)]">
                    Track Order
                  </button>
                </div>
              </div>

              {/* Status bar */}
              <div className="h-1 w-full bg-[var(--gold-faint)]">
                <div
                  className="h-full bg-[var(--gold)]"
                  style={{
                    width: order.status === "Delivered" ? "100%" : "45%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center sm:hidden">
          <button
            onClick={() => router.push("/")}
            className="btn-secondary w-full py-4 text-xs font-semibold uppercase tracking-wider"
          >
            Continue Browsing
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </section>
    </ProtectedPage>
  );
}

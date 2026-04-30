"use client";

import ProtectedPage from "@/components/auth/ProtectedPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, PackageCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const orders = [
  {
    id: "VV-1234",
    status: "Delivered",
    total: "$ 4,999",
    date: "March 21, 2026",
  },
  {
    id: "VV-2871",
    status: "Processing",
    total: "$ 2,499",
    date: "April 4, 2026",
  },
];

export default function OrdersPage() {
  const router = useRouter();

  return (
    <ProtectedPage>
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Fulfillment History</p>
            <div className="gold-divider" />
            <h1 className="mt-5 font-cormorant text-4xl font-light text-foreground lg:text-5xl">
              Your Orders
            </h1>
          </div>
          <Button
            variant="outline"
            className="hidden rounded-full sm:flex"
            onClick={() => router.push("/")}
          >
            Continue Shopping
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-border/40 bg-background/50 transition-all hover:border-foreground/10"
            >
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/30">
                    <PackageCheck className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">Placed on {order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="text-right">
                    <p className="text-lg font-semibold">{order.total}</p>
                    <Badge variant="secondary" className="rounded-full bg-muted/60 font-normal shadow-none">
                      {order.status}
                    </Badge>
                  </div>
                  <button className="rounded-full border border-border/40 px-6 py-2 text-sm font-medium transition-colors hover:bg-muted/50">
                    Track Order
                  </button>
                </div>
              </div>

              {/* Status bar (visual only) */}
              <div className="h-1 w-full bg-muted/30">
                <div
                  className="h-full"
                  style={{
                    width: order.status === "Delivered" ? "100%" : "45%",
                    background: "var(--gold)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center sm:hidden">
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => router.push("/")}
          >
            Continue Shopping
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </ProtectedPage>
  );
}

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
    total: "Rs. 4,999",
    date: "March 21, 2026",
  },
  {
    id: "VV-2871",
    status: "Processing",
    total: "Rs. 2,499",
    date: "April 4, 2026",
  },
];

export default function OrdersPage() {
  const router = useRouter();

  return (
    <ProtectedPage>
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border bg-background/75 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Orders
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Track your recent purchases
              </h1>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/")}
            >
              Continue Shopping
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="rounded-[1.5rem]">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ordered on {order.date}
                  </p>
                </div>
                <Badge variant="secondary">{order.status}</Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <PackageCheck className="h-5 w-5 text-primary" />
                  Your order is in the current fulfillment timeline.
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{order.total}</span>
                  <Button variant="outline">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </ProtectedPage>
  );
}

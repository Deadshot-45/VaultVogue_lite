"use client";

import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Badge } from "@/components/ui/badge";
import { orderService } from "@/lib/services/orderService";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2, PackageCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

function resolveProductImage(imageField: string | undefined): string {
  if (!imageField) return FALLBACK_IMAGE;

  const imgStr = imageField.trim();

  // If it's a direct URL
  if (
    imgStr.startsWith("http://") ||
    imgStr.startsWith("https://") ||
    imgStr.startsWith("/")
  ) {
    return imgStr;
  }

  // Try parsing as standard JSON
  try {
    const parsed = JSON.parse(imgStr);
    if (parsed) {
      if (typeof parsed === "string") return parsed;
      if (typeof parsed === "object") {
        if (parsed.url) return parsed.url;
        if (Array.isArray(parsed) && parsed[0]?.url) return parsed[0].url;
      }
    }
  } catch {
    // Fail-safe: regex for non-standard JS-like object string representations
  }

  // Try extracting using regex for format like { url: 'https://...' } or "url": "https://..."
  const match = imgStr.match(/url\s*:\s*['"]([^'"]+)['"]/i);
  if (match && match[1]) {
    return match[1];
  }

  return FALLBACK_IMAGE;
}

export default function OrdersPage() {
  const router = useRouter();

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["userOrders"],
    queryFn: orderService.getUserOrders,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)]" />
      </div>
    );
  }

  const rawOrders =
    responseData?.data || (Array.isArray(responseData) ? responseData : []);

  const orders = rawOrders.map((order: any) => ({
    id: order._id || order.id || "VV-UNKNOWN",
    items: order.items || [],
    status: order.status
      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
      : "Pending",
    total:
      order.totalAmount !== undefined
        ? `$${Number(order.totalAmount).toFixed(2)}`
        : "$0.00",
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Date Unknown",
  }));

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
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-border/40 bg-card/45 backdrop-blur-md rounded-2xl p-8 shadow-sm">
            <PackageCheck className="h-16 w-16 text-muted-foreground/60 mb-4 stroke-1" />
            <h2 className="text-xl font-light font-cormorant text-[var(--brand-text)] mb-2">
              No Orders Found
            </h2>
            <p className="text-xs text-muted-foreground max-w-xs mb-6">
              It looks like you haven't placed any orders yet. Discover our
              latest collections.
            </p>
            <button
              onClick={() => router.push("/")}
              className="btn-secondary py-3 px-8 text-[10px] font-semibold uppercase tracking-wider border-[var(--gold-soft)] text-[var(--gold)]"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order: any) => (
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
                      <h3 className="text-sm font-semibold text-[var(--brand-text)]">
                        {order.id}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Placed on {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 sm:gap-10">
                    <div className="text-right space-y-1">
                      <p className="text-base font-bold text-[var(--gold)]">
                        {order.total}
                      </p>
                      <Badge className="rounded-full badge-gold font-normal px-2.5 py-0.5 text-[9px]">
                        {order.status}
                      </Badge>
                    </div>
                    {order.status?.toLowerCase() === "shipped" ? (
                      <button
                        onClick={() => router.push(`/orders/${order.id}/track`)}
                        className="btn-primary py-2.5 px-5 text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        Track Package
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="btn-secondary py-2.5 px-6 text-xs font-semibold uppercase tracking-wider border-[var(--gold-soft)] text-[var(--gold)]"
                      >
                        View Receipt
                      </button>
                    )}
                  </div>
                </div>

                {/* Items List */}
                {order.items && order.items.length > 0 && (
                  <div className="border-t border-border/40 bg-card/10 px-6 py-4 space-y-4">
                    {order.items.map((item: any, idx: number) => {
                      const imageUrl = resolveProductImage(item.image);
                      return (
                        <div
                          key={item._id || idx}
                          className="flex items-center gap-4"
                        >
                          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border/30 bg-muted">
                            <Image
                              src={imageUrl}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[var(--brand-text)] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Qty: {item.quantity} · $
                              {(item.price || 0).toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-[var(--brand-text)]">
                              $
                              {(
                                (item.price || 0) * (item.quantity || 1)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Status bar */}
                <div className="h-1 w-full bg-[var(--gold-faint)]">
                  <div
                    className="h-full bg-[var(--gold)]"
                    style={{
                      width: ["delivered", "confirmed"].includes(
                        order.status.toLowerCase(),
                      )
                        ? "100%"
                        : "45%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

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

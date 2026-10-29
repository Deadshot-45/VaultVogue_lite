"use client";

import React from "react";
import Link from "next/link";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Badge } from "@/components/ui/badge";
import { orderService } from "@/lib/services/orderService";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Loader2, PackageCheck, RefreshCw, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

function resolveProductImage(imageField: string | undefined): string {
  if (!imageField) return FALLBACK_IMAGE;

  const imgStr = imageField.trim();

  if (
    imgStr.startsWith("http://") ||
    imgStr.startsWith("https://") ||
    imgStr.startsWith("/")
  ) {
    return imgStr;
  }

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
    // Fail-safe: fallback to regex
  }

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
      <div className="flex items-center justify-center h-screen bg-[var(--vault-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--vault-accent)]" />
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
        ? `₹${Number(order.totalAmount).toLocaleString("en-IN")}.00`
        : "₹0.00",
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Date Unknown",
    paymentStatus: order.paymentStatus || "pending",
  }));

  const needsRetry = (paymentStatus: string) => {
    const s = paymentStatus?.toLowerCase();
    return s === "unpaid" || s === "failed" || s === "pending" || s === "initiated";
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-[var(--vault-bg)] text-[var(--vault-ink)] transition-colors duration-300">
        {/* ── Breadcrumb Bar ── */}
        <div className="border-b border-[var(--vault-line)] bg-[var(--vault-panel)]/50 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--vault-muted)]" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[var(--vault-ink)] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/account" className="hover:text-[var(--vault-ink)] transition-colors">
                Maison Portal
              </Link>
              <span>/</span>
              <span className="text-[var(--vault-accent)] font-semibold">Orders</span>
            </nav>
          </div>
        </div>

        <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8 space-y-10">
          {/* Editorial Heading */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--vault-line)] pb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
                Fulfillment History
              </p>
              <div className="h-0.5 w-12 bg-[var(--vault-accent)] mt-3" />
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[var(--vault-ink)]">
                Maison Orders
              </h1>
            </div>
            <button
              onClick={() => router.push("/products")}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] transition-all shadow-sm active:scale-[0.98]"
            >
              Continue Browsing
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-[var(--vault-line)] bg-[var(--vault-panel)] rounded-3xl p-8 shadow-sm">
              <PackageCheck className="h-16 w-16 text-[var(--vault-muted)]/50 mb-4 stroke-1" />
              <h2 className="text-2xl font-light font-serif text-[var(--vault-ink)] mb-2">
                No Orders Placed Yet
              </h2>
              <p className="text-xs text-[var(--vault-muted)] max-w-xs mb-6 font-light">
                Discover our latest menswear, womenswear, and youth archives.
              </p>
              <button
                onClick={() => router.push("/products")}
                className="rounded-xl bg-[var(--vault-accent)] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:brightness-110 active:scale-[0.98] transition-all"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] transition-all hover:border-[var(--vault-accent)]/50 shadow-sm"
                >
                  <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] border border-[var(--vault-accent)]/20">
                        <PackageCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--vault-ink)] font-mono">
                          {order.id}
                        </h3>
                        <p className="text-xs text-[var(--vault-muted)] mt-0.5">
                          Placed on {order.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8">
                      <div className="text-right space-y-1">
                        <p className="font-mono text-base font-bold text-[var(--vault-ink)]">
                          {order.total}
                        </p>
                        <Badge className="rounded-full bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] border border-[var(--vault-accent)]/30 font-medium px-2.5 py-0.5 text-[9px]">
                          {order.status}
                        </Badge>
                      </div>
                      {order.status?.toLowerCase() === "shipped" ? (
                        <button
                          onClick={() => router.push(`/orders/${order.id}/track`)}
                          className="rounded-xl bg-[var(--vault-accent)] py-2.5 px-5 text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2 active:scale-95 hover:brightness-110 transition-all cursor-pointer shadow-sm"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          Track Package
                        </button>
                      ) : needsRetry(order.paymentStatus) ? (
                        <button
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 px-5 text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry Payment
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="rounded-xl border border-[var(--vault-line)] bg-[var(--vault-bg)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] py-2.5 px-5 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] transition-colors"
                        >
                          View Receipt
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  {order.items && order.items.length > 0 && (
                    <div className="border-t border-[var(--vault-line)] bg-[var(--vault-bg)]/30 px-6 py-4 space-y-3">
                      {order.items.map((item: any, idx: number) => {
                        const imageUrl = resolveProductImage(item.image);
                        return (
                          <div
                            key={item._id || idx}
                            className="flex items-center gap-4"
                          >
                            <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)]">
                              <Image
                                src={imageUrl}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-[var(--vault-ink)] truncate">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-[var(--vault-muted)] mt-0.5">
                                Qty: {item.quantity} · ₹
                                {(item.price || 0).toLocaleString("en-IN")}.00 each
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-xs font-semibold text-[var(--vault-ink)]">
                                ₹
                                {(
                                  (item.price || 0) * (item.quantity || 1)
                                ).toLocaleString("en-IN")}
                                .00
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Status bar */}
                  <div className="h-1 w-full bg-[var(--vault-line)]">
                    <div
                      className="h-full bg-[var(--vault-accent)] transition-all duration-500"
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
          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => router.push("/products")}
              className="w-full rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)]"
            >
              Continue Browsing
            </button>
          </div>
        </section>
      </div>
    </ProtectedPage>
  );
}

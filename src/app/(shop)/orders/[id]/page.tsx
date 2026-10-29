"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Loader2,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/lib/services/orderService";
import { PaymentRetryBanner } from "@/features/payment-tracking/components/PaymentRetryBanner";

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

function formatCurrency(amount: number): string {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}.00`;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", params?.id],
    queryFn: () => orderService.getOrderById(params?.id as string),
    enabled: !!params?.id,
  });

  const handleCopyId = () => {
    if (!params?.id) return;
    navigator.clipboard.writeText(params.id as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--vault-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--vault-accent)]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <ProtectedPage>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-md mx-auto px-4">
          <div className="h-16 w-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center text-rose-500">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-serif text-3xl font-light text-[var(--vault-ink)]">
              Order Not Found
            </h2>
            <p className="text-xs text-[var(--vault-muted)] mt-2 leading-relaxed">
              We couldn't retrieve details for this order. It may not exist or
              you may not have authorization to view it.
            </p>
          </div>
          <button
            onClick={() => router.push("/orders")}
            className="rounded-xl bg-[var(--vault-accent)] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Back to Orders
          </button>
        </div>
      </ProtectedPage>
    );
  }

  const orderStatus = (order.status || "pending").toLowerCase();

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "processing":
        return "bg-[var(--vault-cobalt)]/10 text-[var(--vault-cobalt)] border border-[var(--vault-cobalt)]/20";
      case "shipped":
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      default:
        return "bg-[var(--vault-muted)]/10 text-[var(--vault-muted)] border border-[var(--vault-muted)]/20";
    }
  };

  const steps = [
    { label: "Placed", done: true },
    {
      label: "Confirmed",
      done: ["confirmed", "processing", "shipped", "delivered"].includes(orderStatus),
    },
    { label: "Shipped", done: ["shipped", "delivered"].includes(orderStatus) },
    { label: "Delivered", done: orderStatus === "delivered" },
  ];

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
              <Link href="/orders" className="hover:text-[var(--vault-ink)] transition-colors">
                Orders
              </Link>
              <span>/</span>
              <span className="text-[var(--vault-accent)] font-semibold font-mono truncate max-w-[140px] sm:max-w-none">
                #{order?._id}
              </span>
            </nav>
          </div>
        </div>

        <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/orders")}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--vault-accent)] hover:brightness-125 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Heading & Metadata */}
            <div className="border-b border-[var(--vault-line)] pb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
                  Order Details
                </p>
                <div className="h-0.5 w-12 bg-[var(--vault-accent)]" />

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-[var(--vault-ink)]">
                    Receipt #{order?._id?.slice(-12).toUpperCase()}
                  </h1>
                  <button
                    onClick={handleCopyId}
                    className="p-1.5 rounded-lg border border-[var(--vault-line)] hover:bg-[var(--vault-panel)] transition-colors text-[var(--vault-muted)] hover:text-[var(--vault-accent)]"
                    title="Copy Full Order ID"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--vault-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[var(--vault-accent)]" />
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-[var(--vault-accent)]" />
                    Payment:{" "}
                    <span className="capitalize font-medium text-[var(--vault-ink)]">
                      {order.paymentMethod}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={`rounded-full font-medium px-3.5 py-1 text-xs uppercase tracking-wider ${getStatusBadgeStyle(orderStatus)}`}
                >
                  {order.status}
                </Badge>
                {orderStatus === "shipped" && (
                  <button
                    onClick={() =>
                      order?._id && router.push(`/orders/${order._id}/track`)
                    }
                    className="rounded-xl bg-[var(--vault-accent)] py-2.5 px-4 font-semibold uppercase tracking-wider text-white flex items-center gap-2 shadow-sm active:scale-95 hover:brightness-110 transition-all cursor-pointer text-xs"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Track Live Package</span>
                  </button>
                )}
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tracking Status Timeline */}
                <div className="overflow-hidden rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 shadow-sm">
                  <h3 className="text-sm font-semibold text-[var(--vault-ink)] mb-6 flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[var(--vault-accent)]" />
                    Shipment Progress
                  </h3>

                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 px-2">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--vault-line)] -translate-y-1/2 hidden md:block z-0" />

                    {steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex md:flex-col items-center gap-4 md:gap-2.5 relative z-10 w-full md:w-auto"
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            step.done
                              ? "bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] border-[var(--vault-accent)]"
                              : "bg-[var(--vault-bg)] text-[var(--vault-muted)] border-[var(--vault-line)]"
                          }`}
                        >
                          {step.done ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="text-xs font-semibold">
                              {idx + 1}
                            </span>
                          )}
                        </div>
                        <div className="text-left md:text-center">
                          <p
                            className={`text-xs font-medium ${step.done ? "text-[var(--vault-ink)] font-semibold" : "text-[var(--vault-muted)]"}`}
                          >
                            {step.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items Card */}
                <div className="overflow-hidden rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] shadow-sm">
                  <div className="px-6 py-5 border-b border-[var(--vault-line)] flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-[var(--vault-accent)]" />
                    <h3 className="text-sm font-semibold text-[var(--vault-ink)]">
                      Order Items
                    </h3>
                  </div>

                  <div className="divide-y divide-[var(--vault-line)]">
                    {order.items?.map((item: any, idx: number) => {
                      const imageUrl = resolveProductImage(item.image);
                      return (
                        <div
                          key={item._id || idx}
                          className="flex gap-5 p-6 items-center"
                        >
                          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--vault-line)] bg-[var(--vault-bg)]">
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-[var(--vault-ink)] line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[var(--vault-muted)] mt-1 flex items-center gap-3">
                              <span>
                                Quantity:{" "}
                                <strong className="text-[var(--vault-ink)]">
                                  {item.quantity}
                                </strong>
                              </span>
                              {item.size && (
                                <>
                                  <span className="text-[var(--vault-line)]">|</span>
                                  <span>
                                    Size:{" "}
                                    <strong className="text-[var(--vault-ink)]">
                                      {item.size}
                                    </strong>
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-semibold text-[var(--vault-accent)] block">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            <span className="text-[10px] text-[var(--vault-muted)]">
                              {formatCurrency(item.price)} each
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Sidebar Area */}
              <div className="space-y-8">
                {/* Delivery Address */}
                <div className="overflow-hidden rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-[var(--vault-ink)] mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--vault-accent)]" />
                    Shipping Address
                  </h3>

                  <div className="text-xs space-y-2">
                    <p className="font-semibold text-sm text-[var(--vault-ink)]">
                      {order.shippingAddress.fullName}
                    </p>
                    <div className="text-[var(--vault-muted)] space-y-1 leading-relaxed">
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p>{order.shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>

                    <Separator className="my-3 bg-[var(--vault-line)]" />

                    <p className="text-[var(--vault-muted)]">
                      Phone:{" "}
                      <strong className="text-[var(--vault-ink)]">
                        {order.shippingAddress.phone}
                      </strong>
                    </p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="overflow-hidden rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-[var(--vault-ink)] mb-4 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[var(--vault-accent)]" />
                    Payment Details
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-[var(--vault-muted)]">
                      <span>Subtotal</span>
                      <span className="font-mono text-[var(--vault-ink)]">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[var(--vault-muted)]">
                      <span>Shipping Fee</span>
                      <span className="font-mono text-[var(--vault-ink)]">
                        {order.shippingFee === 0
                          ? "Complimentary"
                          : formatCurrency(order.shippingFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[var(--vault-muted)]">
                      <span>Atelier Duty / Tax</span>
                      <span className="font-mono text-[var(--vault-ink)]">
                        {formatCurrency(order.tax)}
                      </span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-rose-500 font-mono">
                        <span>Discount</span>
                        <span>- {formatCurrency(order.discount)}</span>
                      </div>
                    )}

                    <Separator className="my-2 bg-[var(--vault-line)]" />

                    <div className="flex justify-between text-sm font-bold text-[var(--vault-ink)] pt-1">
                      <span>Total Amount</span>
                      <span className="font-mono text-[var(--vault-accent)]">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <Separator className="my-2 bg-[var(--vault-line)]" />

                    <div className="pt-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[var(--vault-muted)]">
                          Payment Status
                        </span>
                        <Badge
                          className={`rounded-full px-2 py-0.5 text-[9px] uppercase font-medium border ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      {order.stripePaymentIntentId && (
                        <div className="flex justify-between text-[10px] text-[var(--vault-muted)]">
                          <span>Txn ID</span>
                          <span
                            className="font-mono truncate max-w-[120px]"
                            title={order.stripePaymentIntentId}
                          >
                            {order.stripePaymentIntentId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Retry Banner */}
                {order.paymentStatus !== "paid" && (
                  <PaymentRetryBanner
                    orderId={order._id}
                    paymentStatus={order.paymentStatus}
                    customerName={order.shippingAddress?.fullName}
                    customerPhone={order.shippingAddress?.phone}
                    defaultGateway={
                      order.paymentMethod === "card"
                        ? "stripe"
                        : order.paymentMethod === "cod"
                        ? "cod"
                        : "razorpay"
                    }
                  />
                )}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </ProtectedPage>
  );
}

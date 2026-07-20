"use client";

import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { orderService } from "@/lib/services/orderService";
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
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

function resolveProductImage(imageField: string | undefined): string {
  if (!imageField) return FALLBACK_IMAGE;

  const imgStr = imageField.trim();
  
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://") || imgStr.startsWith("/")) {
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
  } catch {}

  const match = imgStr.match(/url\s*:\s*['"]([^'"]+)['"]/i);
  if (match && match[1]) {
    return match[1];
  }

  return FALLBACK_IMAGE;
}

function formatCurrency(amount: number, currencyCode?: string): string {
  const symbol = currencyCode === "INR" ? "Rs." : "$";
  return `${symbol} ${Number(amount).toFixed(2)}`;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const { data: order, isLoading, error } = useQuery({
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
      <div className="flex items-center justify-center h-screen bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--gold)]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <ProtectedPage>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-md mx-auto px-4">
          <div className="h-16 w-16 bg-red-500/10 border-2 border-red-500/20 rounded-full flex items-center justify-center text-red-500">
            <Package className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-cormorant text-3xl font-light text-[var(--brand-text)]">
              Order Not Found
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              We couldn't retrieve details for this order. It may not exist or you may not have authorization to view it.
            </p>
          </div>
          <button
            onClick={() => router.push("/orders")}
            className="btn-secondary py-3 px-8 text-xs font-semibold uppercase tracking-wider border-[var(--gold-soft)] text-[var(--gold)]"
          >
            Back to Orders
          </button>
        </div>
      </ProtectedPage>
    );
  }

  const orderStatus = (order.status || "pending").toLowerCase();
  const currency = order.payment?.currency || "INR";

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "shipped":
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20";
    }
  };

  const steps = [
    { label: "Placed", done: true },
    { label: "Confirmed", done: ["confirmed", "processing", "shipped", "delivered"].includes(orderStatus) },
    { label: "Shipped", done: ["shipped", "delivered"].includes(orderStatus) },
    { label: "Delivered", done: orderStatus === "delivered" },
  ];

  return (
    <ProtectedPage>
      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
        
        {/* Navigation & Actions */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/orders")}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Heading & Metadata */}
          <div className="mb-12 border-b border-border/40 pb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-label">Order Details</p>
              <div className="gold-divider" />
              
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h1 className="font-cormorant text-3xl font-light text-[var(--brand-text)] md:text-4xl">
                  Receipt #{order._id}
                </h1>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg border border-border/40 hover:bg-card/65 transition-colors text-muted-foreground hover:text-[var(--gold)]"
                  title="Copy Order ID"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[var(--gold)]" />
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-[var(--gold)]" />
                  Payment: <span className="capitalize font-medium text-[var(--brand-text)]">{order.paymentMethod}</span>
                </span>
              </div>
            </div>

            <div>
              <Badge className={`rounded-full font-normal px-3.5 py-1 text-xs uppercase tracking-wider ${getStatusBadgeStyle(orderStatus)}`}>
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Tracking Status Timeline */}
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/45 p-6 backdrop-blur-md shadow-md">
                <h3 className="text-sm font-semibold text-[var(--brand-text)] mb-6 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[var(--gold)]" /> Shipment Progress
                </h3>
                
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 px-2">
                  {/* Horizontal line for desktop */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border/30 -translate-y-1/2 hidden md:block z-0" />
                  
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2.5 relative z-10 w-full md:w-auto">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          step.done
                            ? "bg-[var(--gold-glow)] text-[var(--gold)] border-[var(--gold)]"
                            : "bg-[var(--background)] text-muted-foreground border-border/60"
                        }`}
                      >
                        {step.done ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="text-left md:text-center">
                        <p className={`text-xs font-medium ${step.done ? "text-[var(--brand-text)]" : "text-muted-foreground"}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Card */}
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md shadow-md">
                <div className="px-6 py-5 border-b border-border/40 flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[var(--gold)]" />
                  <h3 className="text-sm font-semibold text-[var(--brand-text)]">Order Items</h3>
                </div>
                
                <div className="divide-y divide-border/40">
                  {order.items?.map((item: any, idx: number) => {
                    const imageUrl = resolveProductImage(item.image);
                    return (
                      <div key={item._id || idx} className="flex gap-5 p-6 items-center">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-border/30 bg-muted">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-[var(--brand-text)] line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                            <span>Quantity: <strong className="text-[var(--brand-text)]">{item.quantity}</strong></span>
                            {item.size && (
                              <>
                                <span className="text-border/60">|</span>
                                <span>Size: <strong className="text-[var(--brand-text)]">{item.size}</strong></span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-[var(--gold)] block">
                            {formatCurrency(item.price * item.quantity, currency)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatCurrency(item.price, currency)} each
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
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/45 p-6 backdrop-blur-md shadow-md">
                <h3 className="text-sm font-semibold text-[var(--brand-text)] mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[var(--gold)]" /> Shipping Address
                </h3>
                
                <div className="text-xs space-y-2">
                  <p className="font-semibold text-sm text-[var(--brand-text)]">
                    {order.shippingAddress.fullName}
                  </p>
                  <div className="text-muted-foreground space-y-1 leading-relaxed">
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                  
                  <Separator className="my-3 bg-border/40" />
                  
                  <p className="text-muted-foreground">
                    Phone: <strong className="text-[var(--brand-text)]">{order.shippingAddress.phone}</strong>
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card/45 p-6 backdrop-blur-md shadow-md">
                <h3 className="text-sm font-semibold text-[var(--brand-text)] mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[var(--gold)]" /> Payment Details
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-[var(--brand-text)]">{formatCurrency(order.subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Fee</span>
                    <span className="text-[var(--brand-text)]">
                      {order.shippingFee === 0 ? "Complimentary" : formatCurrency(order.shippingFee, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Atelier Duty / Tax</span>
                    <span className="text-[var(--brand-text)]">{formatCurrency(order.tax, currency)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Discount</span>
                      <span>- {formatCurrency(order.discount, currency)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2 bg-border/40" />
                  
                  <div className="flex justify-between text-sm font-bold text-[var(--brand-text)] pt-1">
                    <span>Total Amount</span>
                    <span className="text-[var(--gold)]">{formatCurrency(order.totalAmount, currency)}</span>
                  </div>

                  <Separator className="my-2 bg-border/40" />

                  <div className="pt-1 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <Badge className={`rounded-full px-2 py-0.5 text-[9px] uppercase font-medium border ${
                        order.paymentStatus === "paid"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      }`}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    {order.stripePaymentIntentId && (
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Txn ID</span>
                        <span className="font-mono truncate max-w-[120px]" title={order.stripePaymentIntentId}>
                          {order.stripePaymentIntentId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </ProtectedPage>
  );
}

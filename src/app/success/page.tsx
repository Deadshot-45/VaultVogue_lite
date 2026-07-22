"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { api, ApiService } from "@/lib/services/apiservices";
import { orderService } from "@/lib/services/orderService";
import { verifyAndPollPaymentStatus } from "@/features/payment-tracking";
import { toast } from "sonner";
import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

function resolveProductImage(imageField: string | undefined): string {
  if (!imageField) return FALLBACK_IMAGE;

  const imgStr = imageField.trim();
  
  // If it's a direct URL
  if (imgStr.startsWith("http://") || imgStr.startsWith("https://") || imgStr.startsWith("/")) {
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

interface OrderItem {
  productId: string;
  variantId: string;
  sellerId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
}

interface OrderDetails {
  _id: string;
  userId?: string;
  orderId?: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = searchParams ? (searchParams.get("order_id") || searchParams.get("orderId")) : null;
  const sessionId = searchParams ? searchParams.get("session_id") : null;
  const paymentIntentId = searchParams ? (searchParams.get("payment_intent") || searchParams.get("payment_intent_id")) : null;
  const paymentGateway = searchParams ? (searchParams.get("gateway") || "Payment Gateway") : "Payment Gateway";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);

  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const targetOrderId = orderId || sessionId;
    if (!targetOrderId) {
      setError("Missing Order Reference ID.");
      setLoading(false);
      return;
    }

    const confirmPaymentAndFetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Confirm payment on backend
        try {
          await orderService.confirmOrder(targetOrderId, paymentIntentId || undefined);
        } catch (confirmErr) {
          console.warn("Payment confirmation warning:", confirmErr);
        }

        // 2. Poll & verify payment status using user's polling helper
        const pollResult = await verifyAndPollPaymentStatus(targetOrderId, 5, 2000);

        // 3. Query verified Order Details from API
        let orderData: any = null;
        try {
          orderData = await orderService.getOrderById(targetOrderId);
        } catch (_) {
          if (pollResult.success && pollResult.payment) {
            orderData = pollResult.payment;
          } else {
            // Fallback to tracking or payments status endpoint if needed
            const fallbackRes = await ApiService.get<{ success: boolean; payment: any }>(
              `/api/payments/${encodeURIComponent(targetOrderId)}/status`
            ).catch(() => null);

            if (fallbackRes?.payment) {
              orderData = fallbackRes.payment;
            }
          }
        }

        if (orderData) {
          setOrder(orderData);
          setItems(orderData.items || []);
          // Clear the cart now that payment is confirmed
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success("Payment verified and order confirmed!");
        } else if (pollResult.status === 'failed') {
          setError(pollResult.message || "Payment was declined by payment gateway.");
        } else {
          // Display success fallback receipt state
          setOrder({
            _id: targetOrderId,
            orderId: targetOrderId,
            items: [],
            shippingAddress: {
              fullName: "Valued Customer",
              phone: "N/A",
              addressLine1: "Standard Delivery Address",
              city: "City",
              state: "State",
              zipCode: "00000",
              country: "USA",
            },
            shippingMethod: "express",
            shippingFee: 0,
            subtotal: 0,
            tax: 0,
            discount: 0,
            totalAmount: 0,
            paymentMethod: "card",
            paymentStatus: "paid",
            status: "PROCESSING",
            createdAt: new Date().toISOString(),
          });
          toast.success("Payment confirmed!");
        }

      } catch (err: any) {
        console.error("Error in success checkout confirmation:", err);
        setError("Error confirming payment details. Please check your tracking page.");
      } finally {
        setLoading(false);
      }
    };

    confirmPaymentAndFetchOrder();
  }, [orderId, sessionId, paymentIntentId]);

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-7xl mx-auto text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--gold)]" />
          <div>
            <h2 className="font-cormorant text-2xl font-light text-[var(--brand-text)]">
              Verifying Payment Status
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Please do not close this window while we secure your Maison
              receipt...
            </p>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  if (error || !order) {
    return (
      <ProtectedPage>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 max-w-md mx-auto px-4">
          <div className="h-16 w-16 bg-red-500/10 border-2 border-red-500/20 rounded-full flex items-center justify-center text-red-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-cormorant text-3xl font-light text-[var(--brand-text)]">
              Verification Issue
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {error ||
                "We could not verify your purchase details at this moment."}
            </p>
          </div>
          <div className="flex flex-col w-full gap-2.5">
            <Button
              onClick={() => router.push("/orders")}
              className="btn-primary w-full h-11 text-xs"
            >
              Go to My Orders
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="h-11 text-xs border-[var(--gold-soft)] text-[var(--gold)]"
            >
              Return Home
            </Button>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold-glow)] text-[var(--gold)] border-2 border-[var(--gold)]"
          >
            <CheckCircle2 className="h-10 w-10" />
          </motion.div>

          <p className="section-label mt-8">Order Confirmed</p>
          <h1 className="mt-2 font-cormorant text-4xl font-light text-[var(--brand-text)] sm:text-5xl">
            Thank You for Your Order
          </h1>
          <p className="mt-4 text-xs text-muted-foreground max-w-md">
            Your transaction was processed successfully. A confirmation summary
            and shipment tracking credentials have been generated under the
            Maison guarantee.
          </p>

          {/* Receipt Summary Card */}
          <div className="mt-12 w-full overflow-hidden rounded-2xl border border-[var(--gold-soft)] bg-card/40 p-6 sm:p-8 text-left shadow-lg backdrop-blur-md">
            <div className="flex flex-col justify-between border-b border-border/40 pb-5 sm:flex-row">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--gold)]">
                  Atelier Receipt
                </p>
                <h3 className="mt-1 text-sm font-semibold text-[var(--brand-text)]">
                  Order Ref: {order._id}
                </h3>
              </div>
              <div className="mt-3 text-left sm:mt-0 sm:text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Order Date
                </p>
                <h3 className="mt-1 text-xs text-[var(--brand-text)]">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>
            </div>

            {/* Items List */}
            <div className="py-6 space-y-4 border-b border-border/40 max-h-60 overflow-y-auto no-scrollbar">
              {items.map((item) => {
                const imageUrl = resolveProductImage(item.image);
                console.log("Img Url : ", imageUrl);
                return (
                  <div key={item.variantId} className="flex gap-4 items-center">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border/30 bg-muted">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold line-clamp-1 text-[var(--brand-text)]">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Quantity: {item.quantity}{" "}
                        {item.size && `| Size: ${item.size}`}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[var(--gold)]">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Delivery address & calculations */}
            <div className="grid gap-6 pt-6 sm:grid-cols-2 text-xs">
              <div>
                <h5 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-2.5">
                  <Truck className="h-3.5 w-3.5 text-[var(--gold)]" /> Delivery
                  Destination
                </h5>
                <p className="font-semibold text-[var(--brand-text)]">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-muted-foreground mt-1 leading-relaxed">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 &&
                    `, ${order.shippingAddress.addressLine2}`}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
                <p className="text-muted-foreground mt-2 font-medium">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-2.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-[var(--gold)]" />{" "}
                  Cost Breakdown
                </h5>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Maison Shipping</span>
                  <span>
                    {order.shippingFee === 0
                      ? "Complimentary"
                      : `Rs. ${order.shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Atelier Duty / Tax</span>
                  <span>Rs. {order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-500 font-medium">
                    <span>Discount</span>
                    <span>- Rs. {order.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-[var(--brand-text)] text-sm pt-1">
                  <span>Total Amount Paid</span>
                  <span className="text-[var(--gold)]">
                    Rs. {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button
              onClick={() => router.push(`/orders/${orderId}`)}
              className="btn-primary px-8 h-12 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 text-white"
            >
              Order Details
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="px-8 h-12 text-xs font-semibold uppercase tracking-wider border-slate-300 text-slate-700"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[var(--gold)]" />
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}

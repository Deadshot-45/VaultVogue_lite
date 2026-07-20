"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Lock, Landmark, ArrowRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface CartItem {
  variantId: string;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  selectedPayment: "stripe" | "razorpay" | "cod";
  isSubmitting: boolean;
  onPlaceOrder: (e: React.FormEvent) => void;
  couponBoxNode?: React.ReactNode;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

export function OrderSummary({
  cartItems,
  subtotal,
  shippingCost,
  discountAmount,
  taxAmount,
  totalAmount,
  selectedPayment,
  isSubmitting,
  onPlaceOrder,
  couponBoxNode,
}: OrderSummaryProps) {
  return (
    <div className="rounded-[2.5rem] border border-slate-200/50 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] sticky top-24">
      <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)] mb-6 text-left">
        Order Summary
      </h3>

      {/* Product List */}
      <div className="space-y-4 max-h-48 overflow-y-auto pr-1 no-scrollbar mb-6">
        {cartItems.map((item) => (
          <div
            key={item.variantId}
            className="flex gap-3 items-center text-xs justify-between"
          >
            <div className="flex gap-2.5 items-center min-w-0">
              <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded bg-slate-50 border border-slate-100">
                <Image
                  src={item.image || FALLBACK_IMAGE}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 text-left">
                <h4 className="font-semibold text-[var(--brand-text)] truncate text-[11px] max-w-[170px]">
                  {item.name}
                </h4>
                <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                  Qty: {item.quantity}{" "}
                  {item.size ? `| Sz: ${item.size}` : ""}{" "}
                  {item.color ? `| Cl: ${item.color}` : ""}
                </p>
              </div>
            </div>
            <span className="font-bold text-[var(--gold)] font-mono">
              ₹{((item.price ?? 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-5 border-slate-100" />

      {/* Render coupon Box Node inside order summary just like Amazon */}
      {couponBoxNode && (
        <>
          {couponBoxNode}
          <Separator className="my-5 border-slate-100" />
        </>
      )}

      {/* Pricing Breakdown */}
      <div className="space-y-3.5 text-xs text-left">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping & Handling</span>
          <span className="font-mono">
            {shippingCost === 0 ? (
              <span className="text-green-600 font-semibold uppercase">FREE</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>GST / Duty (8%)</span>
          <span className="font-mono">₹{taxAmount.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Coupon Discount</span>
            <span className="font-mono">- ₹{discountAmount.toFixed(2)}</span>
          </div>
        )}

        <Separator className="my-3 border-slate-100" />

        <div className="flex justify-between text-sm font-bold text-[var(--brand-text)] pt-1">
          <span>Total Amount</span>
          <span className="text-[var(--gold)] text-base font-bold font-mono">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Place Order / Payment CTA */}
      <form onSubmit={onPlaceOrder}>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full mt-6 py-4 h-12 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md text-slate-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 text-white" />
              Processing...
            </>
          ) : (
            <>
              {selectedPayment === "stripe" && `Continue to Stripe`}
              {selectedPayment === "razorpay" && `Continue to Razorpay`}
              {selectedPayment === "cod" && `Place COD Order`}
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </>
          )}
        </Button>
      </form>

      <Separator className="my-5 border-slate-100" />

      {/* Payment Security */}
      <div className="flex gap-3.5 items-center rounded-xl bg-slate-50/50 border border-slate-100 p-4 text-[10px] text-muted-foreground leading-normal text-left">
        <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
        <div>
          <p className="font-bold text-[var(--brand-text)] flex items-center gap-1">
            Secure Checkout
            <Lock className="h-2.5 w-2.5 text-slate-400" />
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">
            SSL Encrypted & PCI DSS Compliant transactions.
          </p>
        </div>
      </div>
    </div>
  );
}

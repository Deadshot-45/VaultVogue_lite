"use client";

import React from "react";
import {
  CreditCard,
  ShieldCheck,
  Check,
  Smartphone,
  Sparkles,
  QrCode,
  HelpCircle,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PaymentSelectorProps {
  selectedPayment: "stripe" | "razorpay" | "cod";
  onChangePayment: (payment: "stripe" | "razorpay" | "cod") => void;
}

export function PaymentSelector({
  selectedPayment,
  onChangePayment,
}: PaymentSelectorProps) {
  const options = [
    {
      id: "stripe" as const,
      name: "Stripe secure card Checkout",
      tagline: "Recommended for Credit & Debit Cards",
      description: "Pay securely via credit card, debit card, or link. Supports Visa, Mastercard, Amex, Discover.",
      icons: [
        <CreditCard key="card" className="h-5 w-5 text-indigo-500" />,
        <Sparkles key="spark" className="h-4 w-4 text-[var(--gold)]" />,
      ],
      badge: "Credit/Debit Card",
    },
    {
      id: "razorpay" as const,
      name: "Razorpay UPI & instant Pay",
      tagline: "Recommended for Indian Payments",
      description: "Pay instantly using UPI apps, scan-to-pay QR codes, Netbanking (all major Indian banks), or digital wallets.",
      icons: [
        <QrCode key="qr" className="h-5 w-5 text-emerald-500" />,
        <Smartphone key="phone" className="h-4 w-4 text-blue-500" />,
      ],
      badge: "UPI & QR, Netbanking",
    },
    {
      id: "cod" as const,
      name: "Cash on Delivery",
      tagline: "Pay upon order arrival",
      description: "Hand over cash or UPI payment directly to the delivery agent when your luxury atelier pieces arrive.",
      icons: [
        <Truck key="truck" className="h-5 w-5 text-amber-500" />,
      ],
      badge: "Pay on Delivery",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)]">
          Payment Method
        </h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
          Choose gateway - details will be entered on secure checkout pages
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        {options.map((option) => {
          const isSelected = selectedPayment === option.id;

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card
                onClick={() => onChangePayment(option.id)}
                className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    : "border-slate-100 bg-white hover:border-slate-300"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4 items-start justify-between">
                    
                    {/* Left Icon Panel */}
                    <div className="flex gap-3.5 items-start text-left min-w-0">
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "bg-slate-50 border-slate-100 text-slate-400"
                        }`}
                      >
                        {option.icons[0]}
                      </div>
                      
                      {/* Name & Tagline */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-[var(--brand-text)]">
                            {option.name}
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                            {option.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--gold)] font-medium mt-0.5">
                          {option.tagline}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed max-w-lg">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Check / Radio circle */}
                    <div className="shrink-0 flex items-center pt-1">
                      {isSelected ? (
                        <div className="h-5 w-5 rounded-full bg-blue-600 border border-blue-600 flex items-center justify-center text-white shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-slate-200" />
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Security Footer Details */}
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-[10px] text-muted-foreground text-left mt-6">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
        <p className="leading-normal">
          Vault Vogue securely routes all transaction sessions using bank-grade 256-bit SSL encryption. We never store credit card pin details or bank passwords on our servers.
        </p>
      </div>
    </div>
  );
}

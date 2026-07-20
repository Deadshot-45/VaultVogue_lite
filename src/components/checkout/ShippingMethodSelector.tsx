"use client";

import React from "react";
import { Truck, Check, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface ShippingMethod {
  id: string;
  name: string;
  duration: string;
  cost: number;
  description: string;
}

interface ShippingMethodSelectorProps {
  selectedMethodId: string;
  onSelectMethod: (id: string) => void;
  subtotal: number;
}

export function ShippingMethodSelector({
  selectedMethodId,
  onSelectMethod,
  subtotal,
}: ShippingMethodSelectorProps) {
  
  // Dynamic Standard Delivery Cost calculation (FREE above 999)
  const standardCost = subtotal > 999 ? 0 : 99;

  const methods: ShippingMethod[] = [
    {
      id: "standard",
      name: "Standard Delivery",
      duration: "3–5 Business Days",
      cost: standardCost,
      description: subtotal > 999 ? "Complimentary on orders above ₹999" : "Standard premium logistics courier",
    },
    {
      id: "express",
      name: "Express Delivery",
      duration: "1–2 Business Days",
      cost: 250,
      description: "Expedited shipping route with priority mapping",
    },
    {
      id: "vip",
      name: "Same Day Delivery",
      duration: "Delivered Today",
      cost: 500,
      description: "Available in select cities for prompt handovers",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)] flex items-center gap-2 text-left">
        <Truck className="h-5 w-5 text-[var(--gold)]" />
        Shipping Speed
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        {methods.map((method) => {
          const isSelected = selectedMethodId === method.id;
          return (
            <Card
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-blue-500/[0.02] shadow-[0_4px_20px_-4px_rgba(59,130,246,0.12)]"
                  : "border-border/40 hover:border-slate-300 bg-white"
              }`}
            >
              {isSelected && (
                <div className="absolute right-3 top-3 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              <CardContent className="p-5 flex flex-col justify-between h-full text-left">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {method.id === "vip" ? "Maison Instant" : "Premium Transit"}
                  </p>
                  <p className="font-bold text-sm text-[var(--brand-text)] mt-1.5">{method.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{method.duration}</p>
                  <p className="text-[10px] text-slate-400 mt-3 leading-normal">{method.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-semibold">Delivery Charge</span>
                  <span className="font-mono font-bold text-xs text-[var(--gold)]">
                    {method.cost === 0 ? (
                      <span className="text-green-600 font-semibold uppercase">FREE</span>
                    ) : (
                      `₹${method.cost}.00`
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  orderId: string;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export function SuccessModal({
  isOpen,
  orderId,
  onContinueShopping,
  onViewOrders,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md rounded-[2rem] p-8 bg-white border border-border/40 text-center shadow-2xl">
        <DialogHeader className="flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200">
            <CheckCircle2 className="h-10 w-10 animate-pulse" />
          </div>
          
          <DialogTitle className="font-cormorant text-3xl font-light text-[var(--brand-text)] mt-6">
            Payment Successful
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-3">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Your transaction was processed successfully. A confirmation invoice detailing your order items has been generated.
          </p>
          <div className="bg-slate-50 rounded-xl py-3 px-4 border border-slate-100/60 inline-block">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Atelier Reference ID</p>
            <p className="font-mono font-bold text-sm text-[var(--brand-text)] mt-1">{orderId}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={onViewOrders}
            className="btn-primary w-full h-11 text-xs font-semibold uppercase tracking-widest active:scale-95 transition-all text-slate-100"
          >
            Track Live Package & Orders
          </Button>
          <Button
            onClick={onContinueShopping}
            variant="outline"
            className="w-full h-11 text-xs font-semibold uppercase tracking-widest rounded-lg border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            Continue Shopping
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

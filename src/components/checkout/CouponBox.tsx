"use client";

import React from "react";
import { Check, Percent } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CouponBoxProps {
  coupon: string;
  onCouponChange: (val: string) => void;
  appliedPromo: string | null;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

export function CouponBox({
  coupon,
  onCouponChange,
  appliedPromo,
  onApplyCoupon,
  onRemoveCoupon,
}: CouponBoxProps) {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="promo"
        className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-semibold flex items-center gap-1.5"
      >
        <Percent className="h-3 w-3 text-[var(--gold-soft)]" />
        Maison Promo / Voucher Code
      </Label>
      <div className="flex gap-2">
        <Input
          id="promo"
          value={coupon}
          onChange={(e) => onCouponChange(e.target.value)}
          placeholder="e.g. WELCOME10"
          className="h-10 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg bg-slate-50/50"
          disabled={!!appliedPromo}
        />
        {appliedPromo ? (
          <Button
            type="button"
            onClick={onRemoveCoupon}
            variant="destructive"
            className="h-10 text-xs px-4"
          >
            Remove
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onApplyCoupon}
            className="btn-secondary h-10 text-xs px-5 border-[var(--gold)] text-[var(--gold)] font-semibold uppercase tracking-wider active:scale-95 transition-all"
          >
            Apply
          </Button>
        )}
      </div>

      {/* Applied Badge */}
      {appliedPromo && (
        <div className="flex items-center mt-2.5">
          <Badge
            variant="secondary"
            className="bg-green-50 text-green-700 hover:bg-green-50 border border-green-200/50 text-[10px] py-1 px-2.5 rounded-lg flex items-center gap-1 font-semibold"
          >
            <Check className="h-3.5 w-3.5 text-green-600" />
            Promo Applied: {appliedPromo}
          </Badge>
        </div>
      )}

      {!appliedPromo && (
        <div className="text-[9px] text-muted-foreground leading-relaxed pl-1">
          Available benefits: <span className="font-mono font-semibold text-[var(--gold)]">WELCOME10</span> (10% Off) or <span className="font-mono font-semibold text-[var(--gold)]">ATELIER5</span> (₹500 Off)
        </div>
      )}
    </div>
  );
}

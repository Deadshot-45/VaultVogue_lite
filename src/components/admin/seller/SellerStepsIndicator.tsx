"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SellerOnboardingStep } from "@/types/admin";

const STEPS: { step: SellerOnboardingStep; label: string; sublabel: string }[] = [
  { step: 1, label: 'Business Info',   sublabel: 'Company details' },
  { step: 2, label: 'Bank Details',    sublabel: 'Payment account' },
  { step: 3, label: 'Product Listing', sublabel: 'First product' },
  { step: 4, label: 'Review',          sublabel: 'Confirm & submit' },
];

interface Props {
  current: SellerOnboardingStep;
}

export function SellerStepsIndicator({ current }: Props) {
  return (
    <div className="flex items-center justify-between mb-10">
      {STEPS.map((s, i) => {
        const done   = s.step < current;
        const active = s.step === current;

        return (
          <div key={s.step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300',
                )}
                style={{
                  borderColor:     done || active ? 'var(--gold)' : 'var(--border)',
                  background:      done ? 'var(--gold)' : active ? 'var(--gold-faint)' : 'transparent',
                  color:           done ? '#fff' : active ? 'var(--gold)' : 'var(--muted-foreground)',
                }}
              >
                {done ? <Check className="h-4 w-4" /> : s.step}
              </div>
              <div className="text-center hidden sm:block">
                <p className={cn('text-[10px] font-semibold uppercase tracking-wider', active ? '' : 'text-muted-foreground')} style={{ color: active ? 'var(--gold)' : undefined }}>
                  {s.label}
                </p>
                <p className="text-[9px] text-muted-foreground">{s.sublabel}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 mx-3 h-px transition-all duration-500"
                style={{ background: s.step < current ? 'var(--gold)' : 'var(--border)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

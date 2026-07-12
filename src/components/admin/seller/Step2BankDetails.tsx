"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import type { BankDetails } from "@/types/admin";

interface Props {
  data: BankDetails;
  onChange: (data: BankDetails) => void;
  errors: Partial<Record<keyof BankDetails, string>>;
}

export function Step2BankDetails({ data, onChange, errors }: Props) {
  const handle = (field: keyof BankDetails) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...data, [field]: e.target.value });

  return (
    <div className="space-y-5">
      <div
        className="flex items-start gap-3 rounded-xl p-4"
        style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-faint)' }}
      >
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--gold)' }} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Bank details are encrypted and stored securely. Payouts are processed within 7 business days after a successful sale.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Bank Name *</Label>
          <Input id="bankName" placeholder="e.g. HDFC Bank" value={data.bankName} onChange={handle('bankName')} className="h-11" aria-invalid={!!errors.bankName} />
          {errors.bankName && <p className="text-xs text-destructive">{errors.bankName}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Account Holder Name *</Label>
          <Input id="accountHolder" placeholder="As per bank records" value={data.accountHolder} onChange={handle('accountHolder')} className="h-11" aria-invalid={!!errors.accountHolder} />
          {errors.accountHolder && <p className="text-xs text-destructive">{errors.accountHolder}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Account Number *</Label>
          <Input id="accountNumber" placeholder="e.g. 50100123456789" value={data.accountNumber} onChange={handle('accountNumber')} className="h-11" aria-invalid={!!errors.accountNumber} />
          {errors.accountNumber && <p className="text-xs text-destructive">{errors.accountNumber}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">IFSC Code *</Label>
          <Input id="ifscCode" placeholder="e.g. HDFC0001234" value={data.ifscCode} onChange={handle('ifscCode')} className="h-11 uppercase" aria-invalid={!!errors.ifscCode} />
          {errors.ifscCode && <p className="text-xs text-destructive">{errors.ifscCode}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="section-label text-[10px]">Account Type *</Label>
          <select id="accountType" value={data.accountType} onChange={handle('accountType')} className="input-field h-11">
            <option value="savings">Savings Account</option>
            <option value="current">Current Account</option>
          </select>
        </div>
      </div>
    </div>
  );
}

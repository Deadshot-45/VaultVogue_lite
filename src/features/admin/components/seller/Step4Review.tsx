"use client";

import type { SellerOnboardingForm } from "@/types/admin";
import { Building2, CreditCard, Package, CheckCircle2 } from "lucide-react";

interface Props {
  form: SellerOnboardingForm;
  onAgreementChange: (agreed: boolean) => void;
}

const Section = ({ icon: Icon, title, rows }: { icon: React.ElementType; title: string; rows: [string, string][] }) => (
  <div className="card mb-4">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--gold-faint)' }}>
        <Icon className="h-4 w-4" style={{ color: 'var(--gold)' }} />
      </div>
      <p className="section-label text-[10px]">{title}</p>
    </div>
    <dl className="grid grid-cols-2 gap-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium mt-0.5" style={{ color: 'var(--brand-text)' }}>{value || '—'}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export function Step4Review({ form, onAgreementChange }: Props) {
  const { businessInfo: b, bankDetails: bk, productListing: p } = form;

  return (
    <div className="space-y-4">
      <Section icon={Building2} title="Business Information" rows={[
        ['Business Name', b.businessName],
        ['Owner Name', b.ownerName],
        ['Email', b.email],
        ['Phone', b.phone],
        ['Category', b.category],
        ['GST', b.gstNumber || 'Not provided'],
      ]} />

      <Section icon={CreditCard} title="Bank Details" rows={[
        ['Bank Name', bk.bankName],
        ['Account Holder', bk.accountHolder],
        ['Account No.', bk.accountNumber ? '••••' + bk.accountNumber.slice(-4) : ''],
        ['IFSC Code', bk.ifscCode],
        ['Account Type', bk.accountType],
      ]} />

      <Section icon={Package} title="First Product" rows={[
        ['Product Name', p.productName],
        ['SKU', p.sku],
        ['Price', p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : ''],
        ['Category', p.category],
        ['Min. Order Qty', p.moq || '1'],
      ]} />

      {/* Terms */}
      <div className="card">
        <div className="flex items-start gap-3">
          <input
            id="terms-agree"
            type="checkbox"
            checked={form.agreedToTerms}
            onChange={(e) => onAgreementChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[var(--gold)] cursor-pointer"
          />
          <label htmlFor="terms-agree" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            I confirm that all information provided is accurate and agree to Vault Vogue&apos;s{' '}
            <span style={{ color: 'var(--gold)' }}>Seller Terms & Conditions</span>,{' '}
            <span style={{ color: 'var(--gold)' }}>Commission Policy</span>, and{' '}
            <span style={{ color: 'var(--gold)' }}>Data Privacy Agreement</span>.
          </label>
        </div>
      </div>
    </div>
  );
}

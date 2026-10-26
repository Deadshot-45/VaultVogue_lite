"use client";

import Link from "next/link";
import { RefreshCcw, Clock, ShieldCheck, AlertCircle, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

const REFUND_POLICIES = [
  {
    step: "01",
    code: "QUALIFICATION // 7 DAYS",
    title: "Reimbursement Eligibility",
    summary:
      "Archive garments qualify for a 100% complete refund when requested within 7 calendar days of confirmed courier delivery. Pieces must remain unworn, unaltered, and with all embedded NFC serial security seals intact.",
    details: [
      "Original Tyvek® garment packaging and dust bags must accompany the intake return.",
      "Footwear soles must exhibit zero scuffs or outdoor wear marks.",
      "Custom bespoke bespoke-tailored garments and final archive vault clearance pieces are non-refundable.",
    ],
    icon: RefreshCcw,
  },
  {
    step: "02",
    code: "BANKING // 3–5 DAYS",
    title: "Financial Processing & Settlement",
    summary:
      "Once our atelier intake inspectors approve the garment condition, refund settlements are initiated immediately. Funds reflect on your bank or credit card statement within 3 to 5 business days.",
    details: [
      "Stripe card payments: 3–5 business days depending on your issuing financial institution.",
      "Razorpay UPI / Netbanking: 24–48 banking hours direct to source account.",
      "Store Credit Option: Instant credit with a complimentary +5% Maison archive acquisition bonus.",
    ],
    icon: Clock,
  },
  {
    step: "03",
    code: "PRE-DISPATCH // INSTANT",
    title: "Cancellations Prior to Flight Manifest",
    summary:
      "Should you need to cancel an acquisition before crating and air-courier manifest generation (T+02:00 hours), full instant cancellation and 100% immediate repayment are executed with zero penalty fees.",
    details: [
      "Trigger cancellation directly from your authenticated Account Orders workspace.",
      "Automated reversal is transmitted instantly to your payment gateway.",
      "Live status notification pushed immediately via client email.",
    ],
    icon: CheckCircle2,
  },
  {
    step: "04",
    code: "TRANSIT // DAMAGED OR INCORRECT",
    title: "Transit Irregularity & Atelier Guarantee",
    summary:
      "In the improbable event of transit damage or shipment discrepancy, Vault Vogue assumes 100% liability. We dispatch a priority replacement or issue an unconditional full refund including all delivery fees.",
    details: [
      "Notify concierge within 48 hours of carrier handover timestamp.",
      "Complimentary priority courier pickup dispatched to retrieve the piece.",
      "Immediate expedited priority re-dispatch or instant full refund.",
    ],
    icon: AlertCircle,
  },
];

export default function RefundPolicyPage() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 sm:py-20 text-[var(--vault-ink)]">
      {/* Editorial Header Block */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 backdrop-blur-md mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]">
              Maison Escrow &amp; Client Guarantee
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            PROTOCOL // 100% ATELIER VERIFICATION
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Refund &amp; <span className="font-serif italic text-[var(--gold)]">Settlement</span>
              <br />
              Guidelines.
            </h1>
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
              Transparent terms governing archival returns, payment reimbursements, pre-dispatch cancellations,
              and our unwavering commitment to client satisfaction.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">RETURN WINDOW:</span>
              <span className="font-bold">7 CALENDAR DAYS</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">REFUND TIMELINE:</span>
              <span className="text-[var(--gold)] font-bold">3–5 BANKING DAYS</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">RETURN SHIPPING:</span>
              <span className="text-emerald-500 font-bold">COMPLIMENTARY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {REFUND_POLICIES.map((p) => (
          <article
            key={p.title}
            className="group border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:border-[var(--gold-soft)] hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[10px] pb-4 border-b border-[var(--vault-line)]">
                <span className="text-[var(--gold)] font-bold">{p.code}</span>
                <span className="font-serif italic text-lg text-[var(--vault-muted)]">
                  {p.step}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--gold-faint)] bg-[var(--gold-glow)] text-[var(--gold)]">
                  <p.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
                  {p.title}
                </h2>
              </div>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-sans">
                {p.summary}
              </p>

              <ul className="mt-6 space-y-2 border-t border-[var(--vault-line)] pt-4 font-mono text-[11px] text-[var(--vault-muted)]">
                {p.details.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--gold)] mt-0.5">▪</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {/* Initiation Action Strip */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">
              Ready to Initiate a Return or Exchange?
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Manage Purchases in Your Account Workspace
          </h3>
          <p className="text-xs text-[var(--vault-muted)] font-mono">
            Access your active orders, print pre-paid waybills, or contact the atelier concierge.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 border border-[var(--gold)] bg-[var(--gold)] text-white px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold transition hover:opacity-90 whitespace-nowrap"
          >
            Go to My Orders <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 border border-[var(--vault-line)] bg-[var(--vault-canvas)] text-[var(--vault-ink)] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold transition hover:border-[var(--vault-ink)] whitespace-nowrap"
          >
            Contact Concierge
          </Link>
        </div>
      </div>
    </section>
  );
}

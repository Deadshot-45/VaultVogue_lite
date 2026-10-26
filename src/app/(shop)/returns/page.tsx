"use client";

import Link from "next/link";
import { RotateCcw, PackageCheck, Truck, CheckCircle2, ShieldCheck, ArrowRight, HelpCircle, AlertCircle } from "lucide-react";

const RETURN_STAGES = [
  {
    step: "01",
    code: "ACTION // INITIATE TICKET",
    title: "Request Return via Account",
    window: "WITHIN 7 CALENDAR DAYS",
    desc: "Log into your authenticated account and select 'Return or Exchange Piece' on the specific order. Specify reason and request either a full refund or alternate size allocation.",
    telemetry: "STATUS: AUTOMATED AUTHORIZATION",
    icon: RotateCcw,
  },
  {
    step: "02",
    code: "CRATING // RE-SEAL GARMENT",
    title: "Archival Re-Packaging",
    window: "STEP 02 OF 04",
    desc: "Place the unworn garment back in its breathable Tyvek® protective bag with all embedded cryptographic NFC seals, tags, and hangers intact.",
    telemetry: "CONDITION: UNWORN & TAGGED",
    icon: PackageCheck,
  },
  {
    step: "03",
    code: "LOGISTICS // AIR COURIER",
    title: "Complimentary Doorstep Pickup",
    window: "SCHEDULED AT YOUR CONVENIENCE",
    desc: "A pre-paid air-courier manifest (DHL Express or Blue Dart Air) is generated automatically. A courier arrives at your specified coordinate to retrieve the sealed parcel.",
    telemetry: "EXPENSE: 100% COMPLIMENTARY",
    icon: Truck,
  },
  {
    step: "04",
    code: "INTAKE // SETTLEMENT",
    title: "Physical Inspection & Re-Credit",
    window: "T+48 HOURS FROM ARRIVAL",
    desc: "Our master tailors inspect the garment under white laboratory lighting. Upon seal verification, the full refund is released to your source payment or replacement piece dispatched.",
    telemetry: "RESOLUTION: 100% REIMBURSEMENT",
    icon: CheckCircle2,
  },
];

const ACCEPTANCE_CRITERIA = [
  {
    title: "Cryptographic NFC Seal Intact",
    desc: "The woven care label must contain the original untampered NFC authentication chip.",
  },
  {
    title: "Zero Wear or Fabric Stretch",
    desc: "Garments must show no perfume, deodorant, makeup marks, alterations, or fiber wear.",
  },
  {
    title: "Full Archival Packaging",
    desc: "Includes branded rigid box, Tyvek® protective bag, spare buttons, and provenance card.",
  },
  {
    title: "Timely 7-Day Window",
    desc: "Return must be logged within 7 days of confirmed carrier courier signature.",
  },
];

export default function ReturnsPage() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 sm:py-20 text-[var(--vault-ink)]">
      {/* Editorial Header Block */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 backdrop-blur-md mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]">
              Client Care &amp; Alteration Protocols
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            TIMEFRAME // 7 CALENDAR DAYS
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Archival Return &amp;
              <br />
              <span className="font-serif italic text-[var(--gold)]">Exchange</span> Protocol.
            </h1>
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
              We design every piece to be a permanent cornerstone of your wardrobe.
              Should silhouette proportions or sizing require adjustment, our complimentary 4-stage process ensures effortless resolution.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">RETURN FEE:</span>
              <span className="text-emerald-500 font-bold">$0.00 (COMPLIMENTARY)</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">EXCHANGE DISPATCH:</span>
              <span className="text-[var(--gold)] font-bold">EXPRESS AIR-FREIGHT</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">COURIER PICKUP:</span>
              <span className="font-bold">DOORSTEP RETRIEVAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stage Architectural Pipeline */}
      <div className="mb-16">
        <div className="mb-6 flex items-center justify-between border-b border-[var(--vault-line)] pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
            // STEP-BY-STEP CUSTODY CHAIN
          </span>
          <span className="font-mono text-[10px] uppercase text-[var(--vault-muted)]">
            4 VERIFIED CHECKPOINTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RETURN_STAGES.map((st) => (
            <article
              key={st.step}
              className="group border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-[var(--gold-soft)] hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-[10px] border-b border-[var(--vault-line)] pb-3">
                  <span className="font-serif italic text-2xl text-[var(--gold)]">
                    {st.step}
                  </span>
                  <span className="px-2 py-0.5 border border-[var(--vault-line)] text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                    {st.window}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--gold-faint)] bg-[var(--gold-glow)] text-[var(--gold)]">
                    <st.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] font-bold">
                    {st.title}
                  </h3>
                </div>

                <p className="text-xs leading-relaxed text-[var(--vault-muted)] font-sans">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[var(--vault-line)] font-mono text-[9px] uppercase text-emerald-500 font-bold">
                ● {st.telemetry}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Acceptance Standards Checklist */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 backdrop-blur-md mb-16">
        <div className="mb-8 border-b border-[var(--vault-line)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] block">
              // ATELIER QUALITY SPECIFICATIONS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Intake Inspection Criteria
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            To preserve the integrity of future collectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACCEPTANCE_CRITERIA.map((crit, idx) => (
            <div
              key={crit.title}
              className="border border-[var(--vault-line)] bg-[var(--vault-canvas)] p-5 space-y-2"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--gold)] uppercase font-bold">
                <CheckCircle2 size={13} />
                <span>REQUIREMENT 0{idx + 1}</span>
              </div>
              <h4 className="font-mono text-xs uppercase font-bold text-[var(--vault-ink)]">
                {crit.title}
              </h4>
              <p className="text-xs text-[var(--vault-muted)] leading-relaxed">
                {crit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Strip */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">
              Initiate an Archival Exchange Today
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Access Your Orders to Generate Waybill
          </h3>
          <p className="text-xs text-[var(--vault-muted)] font-mono">
            Directly select garments from your acquisition history and request immediate pickup.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 border border-[var(--gold)] bg-[var(--gold)] text-white px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold transition hover:opacity-90 whitespace-nowrap"
          >
            My Orders Workspace <ArrowRight size={14} />
          </Link>
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 border border-[var(--vault-line)] bg-[var(--vault-canvas)] text-[var(--vault-ink)] px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold transition hover:border-[var(--vault-ink)] whitespace-nowrap"
          >
            Contact Atelier Concierge
          </Link>
        </div>
      </div>
    </section>
  );
}

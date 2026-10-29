"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  PlaneTakeoff,
  MapPin,
  CheckCircle2,
  Radar,
  Search,
  ChevronRight,
} from "lucide-react";

const DISPATCH_MILESTONES = [
  {
    step: "01",
    code: "STATUS // CONFIRMED",
    title: "Order & Variant SKU Lock",
    window: "T+00:15 MIN",
    desc: "Your specific archival piece (Colorway & Size Matrix) is allocated in our vaults and keyed to a cryptographic NFC serial tag.",
    telemetry: "INVENTORY LOCK: VERIFIED",
  },
  {
    step: "02",
    code: "STATUS // PACKED",
    title: "Climate-Sealed Crating",
    window: "T+06:00 HRS",
    desc: "Garment undergoes steam-decompression, is encased in a breathable Tyvek® garment bag, and sealed in a weatherproof rigid archive box.",
    telemetry: "HUMIDITY SEAL: 42% RH",
  },
  {
    step: "03",
    code: "STATUS // SHIPPED",
    title: "Air-Freight Courier Handover",
    window: "T+18:00 HRS",
    desc: "Dispatched via priority air courier (DHL Express / Blue Dart Air) with live GPS waypoint telemetry pushed to client channels.",
    telemetry: "CARRIER: AIR-FREIGHT PRIORITY",
  },
  {
    step: "04",
    code: "STATUS // DELIVERED",
    title: "Signature Client Handover",
    window: "3–7 BUSINESS DAYS",
    desc: "Direct-to-door courier delivery across metropolitan and regional coordinates worldwide with biometric or signature confirmation.",
    telemetry: "PROOF OF DELIVERY: SIGNED",
  },
];

const TRANSIT_ZONES = [
  {
    id: "metro",
    label: "DOMESTIC METRO",
    hubs: "INDORE / MUMBAI / BENGALURU / DELHI",
    window: "2 – 4 BUSINESS DAYS",
    carrier: "BLUE DART AIR // PRIORITY",
    duties: "ALL TAXES & GST INCLUDED",
    cutOff: "16:00 IST SAME-DAY DISPATCH",
  },
  {
    id: "eu",
    label: "EUROPEAN ATELIER",
    hubs: "PARIS / MILAN / BERLIN / LONDON",
    window: "3 – 5 BUSINESS DAYS",
    carrier: "DHL EXPRESS WORLDWIDE",
    duties: "DDP (DELIVERED DUTY PAID)",
    cutOff: "14:00 CET AIRWAY UPLINK",
  },
  {
    id: "apac",
    label: "ASIA-PACIFIC & US",
    hubs: "TOKYO / SEOUL / NEW YORK / SF",
    window: "4 – 7 BUSINESS DAYS",
    carrier: "FEDEX INTERNATIONAL PRIORITY",
    duties: "DDP (CUSTOMS PRE-CLEARED)",
    cutOff: "18:00 JST CARGO FLIGHT",
  },
];

export default function ShippingLogisticsPage() {
  const [activeMilestone, setActiveMilestone] = useState<number>(2); // Defaults to '03 // SHIPPED'
  const [selectedZone, setSelectedZone] = useState<string>("metro");
  const [trackingInput, setTrackingInput] = useState<string>("VVL-8849-RED-S");
  const [trackingQueried, setTrackingQueried] = useState<boolean>(false);

  const currentZone =
    TRANSIT_ZONES.find((z) => z.id === selectedZone) || TRANSIT_ZONES[0];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setTrackingQueried(true);
  };

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] text-[var(--vault-ink)] transition-colors duration-300">
      {/* Breadcrumb Navigation */}
      <div className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)]/60 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)]"
          >
            <Link
              href="/"
              className="hover:text-[var(--vault-accent)] transition-colors"
            >
              Vault Vogue
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <Link
              href="/help"
              className="hover:text-[var(--vault-accent)] transition-colors"
            >
              Help Center
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <span className="text-[var(--vault-accent)] font-semibold">
              Shipping Information
            </span>
          </nav>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Editorial Header Block */}
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--vault-accent)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)] font-semibold flex items-center gap-1.5">
                Logistics &amp; Dispatch Protocol
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
              // GLOBAL AIR-FREIGHT TELEMETRY
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-none">
                Delivery &amp;{" "}
                <span className="italic text-[var(--vault-accent)]">
                  Shipping
                </span>
                <br />
                Services.
              </h1>
              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
                Everything you need to know about atelier dispatch timelines,
                climate-sealed garment crating, regional delivery windows, and
                live GPS waybill coordinates.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">
                  DISPATCH WINDOW:
                </span>
                <span className="text-[var(--vault-accent)] font-bold">
                  3 – 7 BUSINESS DAYS
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">
                  INSURANCE COVER:
                </span>
                <span className="text-emerald-500 font-bold">
                  100% VALUED TRANSIT
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">
                  PACKAGING SPEC:
                </span>
                <span className="font-bold">TYVEK® ARCHIVE SEAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Service Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--vault-line)] bg-[var(--vault-panel)] divide-y md:divide-y-0 md:divide-x divide-[var(--vault-line)] mb-12 shadow-sm">
          {/* Pillar 01 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 transition hover:bg-[var(--vault-accent)]/5 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--vault-accent)] font-bold">
                  01 // TRANSIT WINDOW
                </span>
                <PlaneTakeoff className="w-4 h-4 text-[var(--vault-muted)] group-hover:text-[var(--vault-accent)] transition" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
                Standard Atelier Delivery
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-sans">
                Delivered in <strong>3 to 7 business days</strong> worldwide.
                Every parcel is climate-sealed, NFC-tagged, and insured from our
                vault to your doorstep.
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--vault-line)] flex items-center justify-between font-mono text-[10px]">
              <span className="text-[var(--vault-muted)] uppercase">
                Complimentary Tier
              </span>
              <span className="px-2 py-0.5 border border-[var(--vault-accent)]/30 bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] font-bold">
                COMPLIMENTARY OVER ₹10,000
              </span>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 transition hover:bg-[var(--vault-accent)]/5 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--vault-accent)] font-bold">
                  02 // LIVE TELEMETRY
                </span>
                <Radar className="w-4 h-4 text-[var(--vault-muted)] group-hover:text-[var(--vault-accent)] transition" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
                Real-Time Tracking
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-sans">
                Live waypoint monitoring via dedicated airway carriers. Instant
                notifications pushed upon flight departure, customs clearance,
                and local courier dispatch.
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--vault-line)] flex items-center justify-between font-mono text-[10px]">
              <span className="text-[var(--vault-muted)] uppercase">
                Telemetry Frequency
              </span>
              <span className="text-[var(--vault-accent)] font-bold">
                HOURLY WAYBILL SYNC
              </span>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 transition hover:bg-[var(--vault-accent)]/5 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--vault-accent)] font-bold">
                  03 // CUSTODY CHAIN
                </span>
                <ShieldCheck className="w-4 h-4 text-[var(--vault-muted)] group-hover:text-[var(--vault-accent)] transition" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
                Verified Checkpoints
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-sans">
                Curated telemetry across all four milestones:{" "}
                <strong>Confirmed</strong>, <strong>Packed</strong>,
                <strong> Shipped</strong>, and <strong>Delivered</strong>—backed
                by cryptographic NFC verification.
              </p>
            </div>
            <div className="pt-4 border-t border-[var(--vault-line)] flex items-center justify-between font-mono text-[10px]">
              <span className="text-[var(--vault-muted)] uppercase">
                Verification
              </span>
              <span className="text-emerald-500 font-bold">
                4 STAGES VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Interactive 4-Stage Shipping Stepper + Zone Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left 7 Cols: Interactive 4-Milestone Pipeline */}
          <div className="lg:col-span-7 border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--vault-line)] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vault-accent)] block font-semibold">
                  INTERACTIVE CHAIN OF CUSTODY
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
                  Inspect Shipping Milestones
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[var(--vault-muted)] uppercase">
                CLICK STAGE TO INSPECT
              </span>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DISPATCH_MILESTONES.map((m, idx) => {
                const isActive = activeMilestone === idx;
                const isPassed = idx <= activeMilestone;
                return (
                  <button
                    key={m.step}
                    type="button"
                    onClick={() => setActiveMilestone(idx)}
                    className={`p-3 border text-left font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold shadow-md"
                        : isPassed
                          ? "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-ink)]"
                          : "border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-muted)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-80">
                      <span>STEP {m.step}</span>
                      {isPassed && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                    <div className="text-xs font-bold mt-1 truncate">
                      {m.title.split(" ")[0].toUpperCase()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Milestone Detail Box */}
            <div className="p-5 border border-[var(--vault-line)] bg-[var(--vault-bg)] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span className="text-[var(--vault-accent)] font-bold">
                  {DISPATCH_MILESTONES[activeMilestone].code}
                </span>
                <span className="px-2 py-0.5 border border-[var(--vault-line)] text-[10px] text-[var(--vault-muted)]">
                  TIMEFRAME: {DISPATCH_MILESTONES[activeMilestone].window}
                </span>
              </div>

              <h5 className="font-serif text-lg font-light uppercase text-[var(--vault-ink)]">
                {DISPATCH_MILESTONES[activeMilestone].title}
              </h5>

              <p className="text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-sans">
                {DISPATCH_MILESTONES[activeMilestone].desc}
              </p>

              <div className="pt-3 flex items-center justify-between text-[11px] font-mono border-t border-[var(--vault-line)]">
                <span className="text-emerald-500 font-bold">
                  ● {DISPATCH_MILESTONES[activeMilestone].telemetry}
                </span>
                <span className="text-[var(--vault-muted)]">
                  STAGE 0{activeMilestone + 1} OF 04
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Regional Transit Zone Calculator */}
          <div className="lg:col-span-5 border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--vault-accent)] block font-semibold">
                GLOBAL DISPATCH ZONES
              </span>
              <h4 className="font-serif text-lg sm:text-xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
                Regional Delivery Windows
              </h4>

              {/* Zone Selector Tabs */}
              <div className="grid grid-cols-3 gap-1.5 pt-2">
                {TRANSIT_ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSelectedZone(z.id)}
                    className={`py-2 px-2 border font-mono text-[10px] uppercase transition truncate cursor-pointer ${
                      selectedZone === z.id
                        ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                        : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                    }`}
                  >
                    {z.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Zone Spec Sheet */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 border border-[var(--vault-line)] bg-[var(--vault-bg)]">
                <span className="text-[10px] block text-[var(--vault-muted)]">
                  ACTIVE CORRIDOR HUBS
                </span>
                <strong className="text-xs text-[var(--vault-ink)]">
                  {currentZone.hubs}
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 border border-[var(--vault-line)] bg-[var(--vault-bg)]">
                  <span className="text-[10px] block text-[var(--vault-muted)]">
                    ESTIMATED WINDOW
                  </span>
                  <strong className="text-[var(--vault-accent)]">
                    {currentZone.window}
                  </strong>
                </div>
                <div className="p-3.5 border border-[var(--vault-line)] bg-[var(--vault-bg)]">
                  <span className="text-[10px] block text-[var(--vault-muted)]">
                    CUSTOMS &amp; DUTIES
                  </span>
                  <strong className="text-emerald-500">
                    {currentZone.duties}
                  </strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-[var(--vault-muted)]">
                <span>CARRIER: {currentZone.carrier}</span>
                <span>{currentZone.cutOff}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Consignment Waybill Simulator Bar */}
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--vault-accent)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>TEST ARCHIVE WAYBILL TELEMETRY</span>
            </div>
            <p className="text-xs text-[var(--vault-muted)] font-mono">
              Enter a Vault Vogue dispatch code or SKU to simulate live carrier
              coordinates.
            </p>
          </div>

          <form
            onSubmit={handleTrackSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
          >
            <div className="flex items-center border border-[var(--vault-line)] bg-[var(--vault-bg)] px-3.5 py-2.5 font-mono text-xs">
              <Search className="w-3.5 h-3.5 mr-2 text-[var(--vault-muted)]" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => {
                  setTrackingInput(e.target.value.toUpperCase());
                  setTrackingQueried(false);
                }}
                placeholder="VVL-8849-RED-S"
                className="bg-transparent focus:outline-none w-44 font-bold uppercase text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)]"
              />
            </div>

            <button
              type="submit"
              className="btn-primary px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer"
            >
              Locate Parcel
            </button>
          </form>
        </div>

        {/* Simulated Waybill Output Banner */}
        {trackingQueried && (
          <div className="mt-4 p-4 border border-[var(--vault-accent)] bg-[var(--vault-panel)] font-mono text-xs flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--vault-ink)]">
                WAYBILL <strong>{trackingInput}</strong> // STATUS:{" "}
                <strong className="text-emerald-500">
                  IN TRANSIT (AIR-FREIGHT UPLINK)
                </strong>
              </span>
            </div>
            <div className="text-[var(--vault-muted)]">
              LAST HUB: INDORE / PARIS AIRPORT &rarr; EST. DELIVERY: 3 BUSINESS
              DAYS
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

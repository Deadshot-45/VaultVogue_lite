"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Ruler, HelpCircle, ArrowRight, Check } from "lucide-react";

type GenderTab = "men" | "women" | "kids";
type Unit = "cm" | "in";

interface SizeRow {
  size: string;
  intl: string;
  chest: { cm: string; in: string };
  shoulder: { cm: string; in: string };
  waist: { cm: string; in: string };
  sleeve: { cm: string; in: string };
  length: { cm: string; in: string };
}

const MEN_MEASUREMENTS: SizeRow[] = [
  {
    size: "XS",
    intl: "EU 44 / UK 34",
    chest: { cm: "94 - 98", in: "37 - 38.5" },
    shoulder: { cm: "46", in: "18.1" },
    waist: { cm: "76 - 80", in: "30 - 31.5" },
    sleeve: { cm: "63", in: "24.8" },
    length: { cm: "70", in: "27.5" },
  },
  {
    size: "S",
    intl: "EU 46 / UK 36",
    chest: { cm: "99 - 104", in: "39 - 41" },
    shoulder: { cm: "48", in: "18.9" },
    waist: { cm: "81 - 86", in: "32 - 34" },
    sleeve: { cm: "64.5", in: "25.4" },
    length: { cm: "72", in: "28.3" },
  },
  {
    size: "M",
    intl: "EU 48 / UK 38",
    chest: { cm: "105 - 110", in: "41.5 - 43.3" },
    shoulder: { cm: "50", in: "19.7" },
    waist: { cm: "87 - 92", in: "34.5 - 36" },
    sleeve: { cm: "66", in: "26.0" },
    length: { cm: "74", in: "29.1" },
  },
  {
    size: "L",
    intl: "EU 50 / UK 40",
    chest: { cm: "111 - 116", in: "43.7 - 45.6" },
    shoulder: { cm: "52", in: "20.5" },
    waist: { cm: "93 - 98", in: "36.5 - 38.5" },
    sleeve: { cm: "67.5", in: "26.6" },
    length: { cm: "76", in: "29.9" },
  },
  {
    size: "XL",
    intl: "EU 52 / UK 42",
    chest: { cm: "117 - 124", in: "46 - 48.8" },
    shoulder: { cm: "54", in: "21.3" },
    waist: { cm: "99 - 106", in: "39 - 41.7" },
    sleeve: { cm: "69", in: "27.2" },
    length: { cm: "78", in: "30.7" },
  },
  {
    size: "XXL",
    intl: "EU 54 / UK 44",
    chest: { cm: "125 - 132", in: "49.2 - 52" },
    shoulder: { cm: "56", in: "22.0" },
    waist: { cm: "107 - 114", in: "42 - 45" },
    sleeve: { cm: "70.5", in: "27.8" },
    length: { cm: "80", in: "31.5" },
  },
];

const WOMEN_MEASUREMENTS: SizeRow[] = [
  {
    size: "XS",
    intl: "EU 34 / UK 6 / US 2",
    chest: { cm: "82 - 86", in: "32.2 - 33.8" },
    shoulder: { cm: "40", in: "15.7" },
    waist: { cm: "62 - 66", in: "24.4 - 26" },
    sleeve: { cm: "59", in: "23.2" },
    length: { cm: "62", in: "24.4" },
  },
  {
    size: "S",
    intl: "EU 36 / UK 8 / US 4",
    chest: { cm: "87 - 91", in: "34.2 - 35.8" },
    shoulder: { cm: "42", in: "16.5" },
    waist: { cm: "67 - 71", in: "26.3 - 28" },
    sleeve: { cm: "60.5", in: "23.8" },
    length: { cm: "64", in: "25.2" },
  },
  {
    size: "M",
    intl: "EU 38 / UK 10 / US 6",
    chest: { cm: "92 - 96", in: "36.2 - 37.8" },
    shoulder: { cm: "44", in: "17.3" },
    waist: { cm: "72 - 76", in: "28.3 - 30" },
    sleeve: { cm: "62", in: "24.4" },
    length: { cm: "66", in: "26.0" },
  },
  {
    size: "L",
    intl: "EU 40 / UK 12 / US 8",
    chest: { cm: "97 - 102", in: "38.2 - 40.1" },
    shoulder: { cm: "46", in: "18.1" },
    waist: { cm: "77 - 82", in: "30.3 - 32.2" },
    sleeve: { cm: "63.5", in: "25.0" },
    length: { cm: "68", in: "26.8" },
  },
  {
    size: "XL",
    intl: "EU 42 / UK 14 / US 10",
    chest: { cm: "103 - 109", in: "40.5 - 42.9" },
    shoulder: { cm: "48", in: "18.9" },
    waist: { cm: "83 - 89", in: "32.6 - 35" },
    sleeve: { cm: "65", in: "25.6" },
    length: { cm: "70", in: "27.5" },
  },
];

const KIDS_MEASUREMENTS: SizeRow[] = [
  {
    size: "4Y - 5Y",
    intl: "104 - 110 cm",
    chest: { cm: "56 - 58", in: "22 - 22.8" },
    shoulder: { cm: "28", in: "11.0" },
    waist: { cm: "53 - 55", in: "20.8 - 21.6" },
    sleeve: { cm: "38", in: "15.0" },
    length: { cm: "44", in: "17.3" },
  },
  {
    size: "6Y - 7Y",
    intl: "116 - 122 cm",
    chest: { cm: "60 - 63", in: "23.6 - 24.8" },
    shoulder: { cm: "30", in: "11.8" },
    waist: { cm: "56 - 58", in: "22 - 22.8" },
    sleeve: { cm: "42", in: "16.5" },
    length: { cm: "48", in: "18.9" },
  },
  {
    size: "8Y - 9Y",
    intl: "128 - 134 cm",
    chest: { cm: "64 - 68", in: "25.2 - 26.8" },
    shoulder: { cm: "33", in: "13.0" },
    waist: { cm: "59 - 61", in: "23.2 - 24" },
    sleeve: { cm: "47", in: "18.5" },
    length: { cm: "53", in: "20.8" },
  },
  {
    size: "10Y - 11Y",
    intl: "140 - 146 cm",
    chest: { cm: "70 - 74", in: "27.5 - 29.1" },
    shoulder: { cm: "36", in: "14.2" },
    waist: { cm: "62 - 65", in: "24.4 - 25.6" },
    sleeve: { cm: "52", in: "20.5" },
    length: { cm: "58", in: "22.8" },
  },
  {
    size: "12Y - 14Y",
    intl: "152 - 158 cm",
    chest: { cm: "76 - 82", in: "29.9 - 32.2" },
    shoulder: { cm: "38", in: "15.0" },
    waist: { cm: "66 - 70", in: "26 - 27.5" },
    sleeve: { cm: "56", in: "22.0" },
    length: { cm: "63", in: "24.8" },
  },
];

const MEASURING_GUIDE = [
  {
    step: "01",
    title: "Chest / Bust",
    description:
      "Wrap the measuring tape horizontally around the fullest part of your chest, keeping the tape level under the armpits.",
  },
  {
    step: "02",
    title: "Shoulder Span",
    description:
      "Measure straight across the back from the outer edge of one acromion shoulder bone to the opposite shoulder tip.",
  },
  {
    step: "03",
    title: "Sleeve Length",
    description:
      "Place the tape at the center back of your neck, guide it across the shoulder point, and down to your wrist bone.",
  },
  {
    step: "04",
    title: "Natural Waist",
    description:
      "Measure around your natural waistline, typically the narrowest point of your torso above the belly button.",
  },
];

export default function SizeGuidePage() {
  const [activeGender, setActiveGender] = useState<GenderTab>("men");
  const [unit, setUnit] = useState<Unit>("cm");

  const rows =
    activeGender === "men"
      ? MEN_MEASUREMENTS
      : activeGender === "women"
        ? WOMEN_MEASUREMENTS
        : KIDS_MEASUREMENTS;

  return (
    <div className="min-h-screen bg-[var(--vault-bg)] text-[var(--vault-ink)] transition-colors duration-300">
      {/* ── Breadcrumb Bar ── */}
      <div className="border-b border-[var(--vault-line)] bg-[var(--vault-panel)]/50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <nav
            className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--vault-muted)]"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-[var(--vault-ink)] transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/help"
              className="hover:text-[var(--vault-ink)] transition-colors"
            >
              Client Care
            </Link>
            <span>/</span>
            <span className="text-[var(--vault-accent)] font-semibold">
              Size Guide
            </span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        {/* ── Header ── */}
        <div className="max-w-3xl space-y-4 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--vault-accent)]/20 bg-[var(--vault-accent)]/5 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
            Precision Patterning
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[var(--vault-ink)]">
            Architectural Sizing Matrix
          </h1>
          <p className="text-sm sm:text-base text-[var(--vault-muted)] font-light leading-relaxed">
            VAULT VOGUE garments are engineered with relaxed, architectural
            proportions. Compare your exact measurements with our master chart
            below to determine your intended silhouette drape.
          </p>
        </div>

        {/* ── Controls: Gender & Units ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
          {/* Gender division selector */}
          <div className="flex items-center gap-2">
            {(["men", "women", "kids"] as GenderTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveGender(tab)}
                className={`rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeGender === tab
                    ? "bg-[var(--vault-accent)] text-white shadow-sm"
                    : "border border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-muted)] hover:text-[var(--vault-ink)] hover:border-[var(--vault-accent)]/40"
                }`}
              >
                {tab === "kids" ? "Kids / Youth" : tab}
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-2 rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--vault-muted)] px-3">
              Unit:
            </span>
            <button
              onClick={() => setUnit("cm")}
              className={`rounded-lg px-3 py-1 font-mono text-xs transition-colors ${
                unit === "cm"
                  ? "bg-[var(--vault-accent)] text-white font-bold"
                  : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              onClick={() => setUnit("in")}
              className={`rounded-lg px-3 py-1 font-mono text-xs transition-colors ${
                unit === "in"
                  ? "bg-[var(--vault-accent)] text-white font-bold"
                  : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* ── Dimension Matrix Table ── */}
        <div className="overflow-hidden rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--vault-line)] bg-[var(--vault-bg)]/50 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vault-muted)]">
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Equivalence</th>
                  <th className="px-6 py-4">Chest ({unit})</th>
                  <th className="px-6 py-4">Shoulder ({unit})</th>
                  <th className="px-6 py-4">Waist ({unit})</th>
                  <th className="px-6 py-4">Sleeve ({unit})</th>
                  <th className="px-6 py-4">Garment Length ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--vault-line)]">
                {rows.map((row) => (
                  <tr
                    key={row.size}
                    className="hover:bg-[var(--vault-accent)]/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm font-bold text-[var(--vault-accent)]">
                      {row.size}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--vault-ink)]">
                      {row.intl}
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--vault-muted)]">
                      {row.chest[unit]}
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--vault-muted)]">
                      {row.shoulder[unit]}
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--vault-muted)]">
                      {row.waist[unit]}
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--vault-muted)]">
                      {row.sleeve[unit]}
                    </td>
                    <td className="px-6 py-4 font-mono text-[var(--vault-muted)]">
                      {row.length[unit]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Fit Philosophy & Drape Advice ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[var(--vault-accent)]">
              <Check className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--vault-ink)]">
                Tailored Drop Shoulders
              </h3>
            </div>
            <p className="text-xs text-[var(--vault-muted)] font-light leading-relaxed">
              Outerwear and hoodies feature an intentional dropped seam. Order
              your true size for a contemporary streetwear drape; size down for
              a classic fitted silhouette.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[var(--vault-accent)]">
              <Check className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--vault-ink)]">
                Pre-Shrunk Heavyweight Weaves
              </h3>
            </div>
            <p className="text-xs text-[var(--vault-muted)] font-light leading-relaxed">
              All 480GSM Wakayama terry and virgin wool garments undergo enzyme
              scouring before assembly, guaranteeing less than 1% dimensional
              change following cold hand washing.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 space-y-3">
            <div className="flex items-center gap-2 text-[var(--vault-accent)]">
              <Check className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--vault-ink)]">
                Between Two Sizes?
              </h3>
            </div>
            <p className="text-xs text-[var(--vault-muted)] font-light leading-relaxed">
              For structured trousers and shirts, prioritize waist and chest
              measurements. For oversized tees and bombers, select the larger
              size to accentuate the architectural box cut.
            </p>
          </div>
        </div>

        {/* ── Step-by-Step How To Measure ── */}
        <section className="space-y-8">
          <div className="border-b border-[var(--vault-line)] pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
              Protocol
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[var(--vault-ink)] mt-1">
              How to Measure with Precision
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MEASURING_GUIDE.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--vault-accent)]">
                    {item.step}
                  </span>
                  <Ruler className="h-4 w-4 text-[var(--vault-muted)]" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--vault-ink)]">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--vault-muted)] font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Concierge Help Banner ── */}
        <div className="rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--vault-accent)]">
              <HelpCircle className="h-4 w-4" />
              <span>Need bespoke sizing guidance?</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--vault-muted)] font-light max-w-xl">
              Our atelier styling concierge can assist with specific body
              dimensions or custom alterations before dispatch.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact-us"
              className="rounded-xl bg-[var(--vault-accent)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Contact Concierge
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] transition-all"
            >
              Shop Collection
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

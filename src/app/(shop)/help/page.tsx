"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  Mail,
  Phone,
  Package,
  RotateCcw,
  Shield,
  Truck,
  CreditCard,
  ArrowUpRight,
  Search,
  Ruler,
  BookOpen,
  FileText,
  ChevronRight,
} from "lucide-react";

const HELP_TOPICS = [
  {
    num: "01",
    code: "WAYBILL // TELEMETRY",
    title: "Orders & Live Tracking",
    description:
      "Inspect dispatch milestones, track active air-cargo waybills, or download authenticated PDF purchase receipts.",
    icon: Package,
    href: "/orders",
  },
  {
    num: "02",
    code: "TRANSIT // DISPATCH",
    title: "Shipping & Freight Logistics",
    description:
      "Regional arrival windows (2–7 days), climate-sealed Tyvek® crating specs, and worldwide DDP customs protocols.",
    icon: Truck,
    href: "/shipping",
  },
  {
    num: "03",
    code: "CHAIN // ALTERATIONS",
    title: "Returns & Exchanges",
    description:
      "Complimentary 7-day pickup service, garment sizing adjustments, and pristine atelier inspection requirements.",
    icon: RotateCcw,
    href: "/returns",
  },
  {
    num: "04",
    code: "SETTLEMENT // ESCROW",
    title: "Refund Policy & Guarantees",
    description:
      "Full reimbursement timelines (3–5 banking days), cancellation rights, and non-refundable archive piece details.",
    icon: CreditCard,
    href: "/refund-policy",
  },
  {
    num: "05",
    code: "DIMENSIONS // METRIC",
    title: "Silhouette Size Guide",
    description:
      "Exact body and garment measurements across Men, Women, and Kids collections in both centimeters and inches.",
    icon: Ruler,
    href: "/size-guide",
  },
  {
    num: "06",
    code: "HERITAGE // MANIFESTO",
    title: "Maison Archive & Philosophy",
    description:
      "Discover our design ethos, European and Japanese mill textile sourcing, and sustainable architectural craft.",
    icon: BookOpen,
    href: "/about",
  },
  {
    num: "07",
    code: "CIPHER // ISO-27001",
    title: "Privacy & Data Protection",
    description:
      "End-to-end tokenized transactions, strict zero-data-reselling commitment, and NFC provenance cryptography.",
    icon: Shield,
    href: "/privacy-policy",
  },
  {
    num: "08",
    code: "KNOWLEDGE // ATELIER",
    title: "Maison FAQs",
    description:
      "Detailed responses addressing courier partners, sizing recommendations, NFC authentication, and fabric care.",
    icon: HelpCircle,
    href: "/faqs",
  },
  {
    num: "09",
    code: "COVENANT // PROTOCOL",
    title: "Terms & Conditions",
    description:
      "The contractual charter governing client rights, authenticity guarantees, dispute forums, and intellectual property.",
    icon: FileText,
    href: "/terms-and-conditions",
  },
];

const DIRECT_CHANNELS = [
  {
    title: "Concierge Email Desk",
    subtitle: "Inquiries, alterations & acquisitions",
    value: "concierge@vaultvogue.com",
    href: "mailto:concierge@vaultvogue.com",
    icon: Mail,
  },
  {
    title: "Direct Client Line",
    subtitle: "Mon–Sat, 10:00 – 19:00 UTC",
    value: "+1 (555) 902-1920",
    href: "tel:+15559021920",
    icon: Phone,
  },
];

export default function HelpPage() {
  const [searchFilter, setSearchFilter] = useState("");

  const filteredTopics = HELP_TOPICS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.code.toLowerCase().includes(searchFilter.toLowerCase()),
  );

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
            <span className="text-[var(--vault-accent)] font-semibold">
              Help Center &amp; Directory
            </span>
          </nav>
        </div>
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        {/* Editorial Hero Block */}
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--vault-accent)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)] font-semibold flex items-center gap-1.5">
                Vault Vogue Assistance Hub
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
              CLIENT DIRECTORY · NAVIGATION MATRIX
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-none">
                How May We{" "}
                <span className="italic text-[var(--vault-accent)]">
                  Assist
                </span>
                <br />
                Your Acquisition?
              </h1>
              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
                Explore guidance across order waybills, air-freight milestones,
                garment care, or reach our human concierge team directly.
              </p>
            </div>

            <div className="lg:col-span-4 w-full">
              <div className="flex items-center border border-[var(--vault-line)] bg-[var(--vault-bg)] px-4 py-3 font-mono text-xs">
                <Search className="h-4 w-4 mr-2 text-[var(--vault-muted)]" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search topics (e.g. shipping, sizing)..."
                  className="w-full bg-transparent focus:outline-none uppercase text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)] font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Spatial Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredTopics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="group relative flex flex-col justify-between border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--vault-accent)] hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[var(--vault-accent)] font-bold tracking-wider">
                    {topic.code}
                  </span>
                  <span className="font-serif italic text-xl text-[var(--vault-muted)] opacity-60">
                    {topic.num}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--vault-accent)]/30 bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] transition-transform duration-300 group-hover:scale-110">
                    <topic.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] font-bold">
                    {topic.title}
                  </h3>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-[var(--vault-muted)] font-sans">
                  {topic.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--vault-line)] flex items-center justify-between font-mono text-[10px] uppercase text-[var(--vault-muted)]">
                <span>View Directive</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 text-[var(--vault-accent)]" />
              </div>
            </Link>
          ))}
        </div>

        {/* Direct Contact Channels Strip */}
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--vault-line)] pb-6 mb-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] block font-semibold">
                // ESCALATION DESK
              </span>
              <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
                Direct Atelier Access
              </h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
              Our curators respond personally to every dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DIRECT_CHANNELS.map((ch) => (
              <Link
                key={ch.title}
                href={ch.href}
                className="group flex items-start gap-5 border border-[var(--vault-line)] bg-[var(--vault-bg)] p-6 transition-all duration-300 hover:border-[var(--vault-accent)] hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--vault-accent)]/30 bg-[var(--vault-accent)]/10 text-[var(--vault-accent)]">
                  <ch.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] font-bold">
                      {ch.title}
                    </h4>
                    <ArrowUpRight
                      size={14}
                      className="text-[var(--vault-accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <p className="mt-1 text-xs text-[var(--vault-muted)] font-sans">
                    {ch.subtitle}
                  </p>
                  <p className="mt-2 font-mono text-xs font-semibold text-[var(--vault-accent)]">
                    {ch.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

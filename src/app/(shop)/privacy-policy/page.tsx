"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Database,
  Lock,
  Key,
  Server,
  ArrowRight,
  EyeOff,
  ChevronRight,
} from "lucide-react";

const PRIVACY_SECTIONS = [
  {
    num: "01",
    code: "DATA // COLLECTION",
    title: "Client Records & Identity Telemetry",
    summary:
      "We collect strictly required client credentials during account creation, atelier purchases, and concierge communications. This includes encrypted email hashes, verified shipping coordinates, and order size specifications.",
    items: [
      "No unsolicited background data harvesting or cross-site tracking cookies.",
      "Profile measurements and custom sizing preferences are stored securely in your private vault.",
      "Optional newsletter subscriptions can be revoked with a single click at any time.",
    ],
    icon: Database,
  },
  {
    num: "02",
    code: "CIPHER // ENCRYPTION",
    title: "Payment Processing & Financial Non-Storage",
    summary:
      "All monetary transactions are processed through certified PCI-DSS Level 1 payment infrastructure (Stripe and Razorpay). Vault Vogue never captures, views, or stores your raw credit card numbers or UPI PINs on our servers.",
    items: [
      "256-bit TLS end-to-end transport encryption across every transaction boundary.",
      "Tokenized card credentials managed directly by banking gateways.",
      "Cryptographic verification preventing duplicate checkout charges or unauthorized debiting.",
    ],
    icon: Lock,
  },
  {
    num: "03",
    code: "FREIGHT // CARRIERS",
    title: "Air-Courier Logistics & Waybill Sharing",
    summary:
      "To fulfill physical consignments, essential delivery coordinates (recipient name, telephone, destination address) are transmitted via secure API endpoints exclusively to our contracted priority logistics carriers (DHL Express, FedEx, Blue Dart).",
    items: [
      "Carriers are strictly prohibited from utilizing recipient data for external promotional campaigns.",
      "Live GPS coordinates and waybills expire automatically 30 days after signed delivery.",
      "Customs declarations comply precisely with international DDP duty standards.",
    ],
    icon: Server,
  },
  {
    num: "04",
    code: "JURISDICTION // RIGHTS",
    title: "Global Client Rights (GDPR / CCPA / Digital Rights)",
    summary:
      "Regardless of geographic location, Vault Vogue extends comprehensive client sovereignty over personal data. You maintain unalienable rights to view, export, adjust, or completely purge your client profile from our active database.",
    items: [
      "Right to Erasure: Request permanent deletion of all non-statutory accounting records.",
      "Data Portability: Export your complete order history in standardized JSON format.",
      "Zero Data Resale: Vault Vogue does not, has never, and will never sell client data to third parties.",
    ],
    icon: Key,
  },
  {
    num: "05",
    code: "STORAGE // SESSIONS",
    title: "Session Storage & Local Authentication",
    summary:
      "We utilize secure, HttpOnly session cookies and encrypted local storage tokens solely to maintain your signed-in state, remember bag contents, and preserve your chosen Light/Dark interface theme preference.",
    items: [
      "Authentication tokens feature automatic expiration and rotation.",
      "Theme and cart state persisted client-side for instantaneous navigation.",
      "No third-party advertising network beacons are embedded on any page.",
    ],
    icon: EyeOff,
  },
];

export default function PrivacyPolicyPage() {
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
              Legal &amp; Policy
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <span className="text-[var(--vault-accent)] font-semibold">
              Privacy Policy
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
                Legal Compliance &amp; Client Rights
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
              FRAMEWORK // GDPR · CCPA · ISO-27001
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-none">
                Privacy &amp;{" "}
                <span className="italic text-[var(--vault-accent)]">
                  Archival
                </span>
                <br />
                Data Governance.
              </h1>
              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
                An unyielding commitment to client sovereignty, tokenized
                transaction security, and absolute discretion across all Vault
                Vogue physical and digital touchpoints.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">
                  EFFECTIVE DATE:
                </span>
                <span className="font-bold">OCTOBER 2026</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">DATA RESALE:</span>
                <span className="text-emerald-500 font-bold">
                  STRICTLY PROHIBITED (0%)
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">DPO OFFICER:</span>
                <span className="font-bold text-[var(--vault-accent)]">
                  privacy@vaultvogue.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Sections List */}
        <div className="space-y-6 mb-16">
          {PRIVACY_SECTIONS.map((sec) => (
            <article
              key={sec.title}
              className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-10 transition-all duration-300 hover:border-[var(--vault-accent)] hover:shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[var(--vault-line)] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--vault-accent)]/30 bg-[var(--vault-accent)]/10 text-[var(--vault-accent)]">
                    <sec.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-accent)] block font-semibold">
                      {sec.num} // {sec.code}
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)] mt-0.5">
                      {sec.title}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] mb-5 max-w-4xl font-sans">
                {sec.summary}
              </p>

              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-[11px] text-[var(--vault-muted)]">
                {sec.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="border border-[var(--vault-line)] bg-[var(--vault-bg)] p-3.5 space-y-1"
                  >
                    <span className="text-[var(--vault-accent)] font-bold text-[9px] block">
                      [ CLAUSE {sec.num}.{idx + 1} ]
                    </span>
                    <p className="text-[var(--vault-ink)]">{item}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Privacy Officer Contact Strip */}
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--vault-accent)]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--vault-accent)] font-bold">
                Data Privacy Officer (DPO) Contact
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Inquire About Your Stored Records or Exercise Data Rights
            </h3>
            <p className="text-xs text-[var(--vault-muted)] font-mono">
              Direct requests for profile exports or permanent ledger purges are
              processed within 48 business hours.
            </p>
          </div>

          <Link
            href="/contact-us"
            className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold whitespace-nowrap"
          >
            Contact Privacy Desk <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

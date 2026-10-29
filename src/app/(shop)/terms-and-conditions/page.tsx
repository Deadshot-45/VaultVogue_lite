"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Shield,
  CreditCard,
  Scale,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const TERMS_SECTIONS = [
  {
    num: "01",
    code: "CHARTER // FORMATION",
    title: "Maison Scope & Acceptance of Protocols",
    summary:
      "By accessing the Vault Vogue web platform, browsing the archival collection, or acquiring physical garments, clients enter into a binding covenant governed by international commercial laws and the stipulations codified within this document.",
    clauses: [
      "Accessing atelier services denotes full and unconditional acceptance of these terms.",
      "Vault Vogue reserves the right to rotate, alter, or update terms at each seasonal release.",
      "All acquisitions represent private collectors' covenants protected by digital transaction provenance.",
    ],
    icon: FileText,
  },
  {
    num: "02",
    code: "SECURITY // VERIFICATION",
    title: "Cryptographic Authenticity & NFC Serial Keying",
    summary:
      "Every genuine Vault Vogue garment incorporates an unforgeable, high-frequency NFC serial tag embedded in the care label. This tag links cryptographically to our decentralized provenance ledger, establishing immutable proof of artisan creation and ownership.",
    clauses: [
      "Physical tampering, removal, or replication of the woven NFC tag voids all atelier warranties.",
      "Ownership certificates can be reviewed and digitally transferred upon authenticated secondary sale.",
      "Vault Vogue assumes zero warranty liability for garments acquired via unauthorized secondary channels.",
    ],
    icon: Shield,
  },
  {
    num: "03",
    code: "FINANCIAL // ESCROW",
    title: "Pricing, Currency & Payment Authorization",
    summary:
      "All prices are denominated in INR (Indian Rupee) or converted dynamically to international currencies based on real-time foreign exchange indices. Purchases undergo strict cardholder verification, 3D-Secure biometric authorization, and tokenized settlement.",
    clauses: [
      "Orders are billed upon checkout authorization prior to climate-sealed crating.",
      "Customs duties and import levies (DDP) are pre-cleared for all international destinations.",
      "Fraudulent chargebacks or bad-faith payment disputes prompt immediate blacklisting from future archives.",
    ],
    icon: CreditCard,
  },
  {
    num: "04",
    code: "INTELLECTUAL // RIGHTS",
    title: "Intellectual Property & Silhouettes",
    summary:
      "All silhouette cuts, technical fabric weaves, typographic wordmarks, visual assets, and software code are the proprietary intellectual property of Vault Vogue®. Unauthorized industrial duplication, reverse engineering, or commercial counterfeit production will be prosecuted under international copyright conventions.",
    clauses: [
      "Digital assets, editorial lookbooks, and campaign footage are protected under global IP treaties.",
      "Commercial reproduction of garment silhouettes or branding elements is strictly forbidden.",
      "Clients acquire physical garments for personal wardrobe collection, not for unauthorized commercial sublicensing.",
    ],
    icon: Scale,
  },
  {
    num: "05",
    code: "ARBITRATION // FORUM",
    title: "Governing Law & Dispute Resolution",
    summary:
      "These terms are governed exclusively by and construed in accordance with the substantive laws of India and international commercial arbitration rules. Any irreconcilable controversy arising under this covenant shall be submitted to confidential, binding arbitration in Paris or Mumbai.",
    clauses: [
      "Parties agree to attempt good-faith informal mediation with our concierge desk prior to litigation.",
      "Arbitral awards are final, legally binding, and enforceable in any court of competent jurisdiction.",
      "Class action waivers apply to all claims arising under this acquisition contract.",
    ],
    icon: CheckCircle2,
  },
];

export default function TermsAndConditionsPage() {
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
              Terms &amp; Conditions
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
                Maison Charter &amp; Legal Framework
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
              TERMS REVISION // 2026.10
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-none">
                Terms &amp;{" "}
                <span className="italic text-[var(--vault-accent)]">
                  Conditions
                </span>
                <br />
                of Service.
              </h1>
              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
                The contractual charter governing client engagements, archival
                acquisitions, cryptographic authenticity keying, and dispute
                resolution on Vault Vogue®.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">
                  LEGAL JURISDICTION:
                </span>
                <span className="font-bold">PARIS / INDORE</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">AUTHENTICITY:</span>
                <span className="text-emerald-500 font-bold">
                  100% KEYED &amp; SEALED
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--vault-muted)]">
                  LEGAL INQUIRIES:
                </span>
                <span className="font-bold text-[var(--vault-accent)]">
                  legal@vaultvogue.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Sections List */}
        <div className="space-y-6 mb-16">
          {TERMS_SECTIONS.map((sec) => (
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
                {sec.clauses.map((clause, idx) => (
                  <li
                    key={idx}
                    className="border border-[var(--vault-line)] bg-[var(--vault-bg)] p-3.5 space-y-1"
                  >
                    <span className="text-[var(--vault-accent)] font-bold text-[9px] block">
                      [ CLAUSE {sec.num}.{idx + 1} ]
                    </span>
                    <p className="text-[var(--vault-ink)]">{clause}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Legal Counsel Desk Strip */}
        <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[var(--vault-accent)]" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--vault-accent)] font-bold">
                Legal Counsel &amp; Corporate Inquiries
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Contact the Vault Vogue Legal &amp; Compliance Office
            </h3>
            <p className="text-xs text-[var(--vault-muted)] font-mono">
              For trademark licensing, institutional contracts, or press
              verification requests.
            </p>
          </div>

          <Link
            href="/contact-us"
            className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold whitespace-nowrap"
          >
            Contact Legal Desk <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FileText, ShoppingBag, AlertTriangle, ShieldCheck, Scale, ArrowRight, BookOpen } from "lucide-react";

const TERMS_SECTIONS = [
  {
    num: "01",
    code: "CHARTER // JURISDICTION",
    title: "Platform Engagement & Archival Scope",
    summary:
      "By accessing, browsing, or completing acquisitions on Vault Vogue® (vault-vogue-lite), you enter into a legally binding agreement governed by these Terms of Service and applicable international e-commerce standards.",
    clauses: [
      "Access to curated drops and private salon archives is granted for personal, non-commercial acquisition.",
      "Users must be of legal age in their home jurisdiction to enter binding commercial transactions.",
      "Automated extraction, bot scraping, or unauthorized reverse-engineering of catalog APIs is strictly prohibited.",
    ],
    icon: BookOpen,
  },
  {
    num: "02",
    code: "VALUATION // CURRENCY",
    title: "Pricing, Currency Conversion & Inventory Locks",
    summary:
      "All pricing is displayed transparently in selected baseline currencies. For cross-border orders, currency conversions are locked at real-time interbank rates during the checkout session.",
    clauses: [
      "Taxes and applicable DDP import tariffs are calculated and itemized prior to final payment confirmation.",
      "In the rare event of an inadvertent technical pricing discrepancy, the Maison reserves the right to void the order with immediate 100% reimbursement.",
      "Allocations are guaranteed only upon completed settlement and issuance of an official order reference code.",
    ],
    icon: ShoppingBag,
  },
  {
    num: "03",
    code: "AUTHENTICITY // LEDGER",
    title: "Authenticity & Cryptographic Keying",
    summary:
      "Every piece released by Vault Vogue is authenticated and variant-keyed with an embedded cryptographic NFC serial tag. We guarantee 100% authenticity for the entire lifecycle of the garment.",
    clauses: [
      "Tampering with, severing, or duplicating the physical NFC authentication tag voids the atelier return guarantee.",
      "Provenance records stored in the Vault Vogue ledger serve as verifiable proof of authenticity.",
      "Secondary market collectors may verify garment provenance using any compatible NFC-enabled smartphone.",
    ],
    icon: ShieldCheck,
  },
  {
    num: "04",
    code: "COPYRIGHT // ATELIER",
    title: "Intellectual Property & Archival Photography",
    summary:
      "All digital assets, photographic compositions, typography, custom codebases, and trademarked insignias associated with Vault Vogue® are the exclusive intellectual property of Vault Vogue Maison.",
    clauses: [
      "Reproduction or republication of editorial lookbooks without prior written consent is strictly forbidden.",
      "Vault Vogue® and associated logos are registered trademarks protected by international copyright treaties.",
      "Editorial media outlets may request high-resolution press assets via our dedicated press concierge.",
    ],
    icon: FileText,
  },
  {
    num: "05",
    code: "DISPUTES // ARBITRATION",
    title: "Limitation of Liability & Dispute Resolution",
    summary:
      "Vault Vogue is committed to client satisfaction. Any grievances or discrepancies are resolved through informal mediation followed by binding commercial arbitration in accordance with standard international trade chambers.",
    clauses: [
      "Liability for transit delays caused by force majeure or customs clearance delays is limited to the purchase price.",
      "Claims regarding delivery discrepancies must be lodged within 7 calendar days of carrier delivery signature.",
      "These terms are governed in accordance with international commercial law principles.",
    ],
    icon: Scale,
  },
];

export default function TermsAndConditionsPage() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 sm:py-20 text-[var(--vault-ink)]">
      {/* Editorial Header Block */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 backdrop-blur-md mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]">
              Maison Charter &amp; Legal Framework
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            TERMS REVISION // 2026.10
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Terms &amp; <span className="font-serif italic text-[var(--gold)]">Conditions</span>
              <br />
              of Service.
            </h1>
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
              The contractual charter governing client engagements, archival acquisitions,
              cryptographic authenticity keying, and dispute resolution on Vault Vogue®.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">LEGAL JURISDICTION:</span>
              <span className="font-bold">PARIS / INDORE</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">AUTHENTICITY:</span>
              <span className="text-emerald-500 font-bold">100% KEYED &amp; SEALED</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">LEGAL INQUIRIES:</span>
              <span className="font-bold text-[var(--gold)]">legal@vaultvogue.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Sections List */}
      <div className="space-y-6 mb-16">
        {TERMS_SECTIONS.map((sec) => (
          <article
            key={sec.title}
            className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-10 backdrop-blur-md transition-all duration-300 hover:border-[var(--gold-soft)] hover:shadow-xl"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[var(--vault-line)] pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--gold-faint)] bg-[var(--gold-glow)] text-[var(--gold)]">
                  <sec.icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--gold)] block">
                    {sec.num} // {sec.code}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)] mt-0.5">
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
                  className="border border-[var(--vault-line)] bg-[var(--vault-canvas)] p-3.5 space-y-1"
                >
                  <span className="text-[var(--gold)] font-bold text-[9px] block">
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
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">
              Legal Counsel &amp; Corporate Inquiries
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Contact the Vault Vogue Legal &amp; Compliance Office
          </h3>
          <p className="text-xs text-[var(--vault-muted)] font-mono">
            For trademark licensing, institutional contracts, or press verification requests.
          </p>
        </div>

        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 border border-[var(--gold)] bg-[var(--gold)] text-white px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold transition hover:opacity-90 whitespace-nowrap"
        >
          Contact Legal Desk <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

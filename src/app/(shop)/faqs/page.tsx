"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Sparkles, ShieldCheck, ArrowRight, Compass } from "lucide-react";

interface FAQItem {
  id: string;
  category: "shipping" | "garments" | "auth" | "orders";
  question: string;
  answer: string;
  telemetry: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    id: "faq-01",
    category: "shipping",
    question: "What are the global dispatch timelines and courier partners?",
    answer:
      "All archival creations are dispatched within 24 to 48 hours following atelier quality inspection. Domestic metropolitan orders arrive within 2–4 business days via Blue Dart Air Priority. International shipments reach Western Europe, the US, and East Asia within 3–7 business days via DHL Express Worldwide or FedEx Priority, with customs duty pre-cleared (DDP).",
    telemetry: "AIR-FREIGHT SLA // 3–7 DAYS",
  },
  {
    id: "faq-02",
    category: "orders",
    question: "Can I adjust or cancel my order after booking an archive piece?",
    answer:
      "Orders can be modified or canceled free of charge during the initial 2-hour buffer window before our crating team applies the climate seal and issues the unique air waybill. Once dispatched onto the courier manifest, items must proceed through our complimentary 7-day return protocol.",
    telemetry: "CANCELLATION WINDOW // T+02:00 HRS",
  },
  {
    id: "faq-03",
    category: "garments",
    question: "How do I ensure the correct sizing across structured and oversized silhouettes?",
    answer:
      "Every piece on Vault Vogue contains exact dimensional measurements (chest width, shoulder drop, sleeve length, and total garment drape) measured in centimeters. We recommend cross-referencing our interactive Size Selector against your best-fitting archival layer, or contacting our concierge for custom fitting guidance.",
    telemetry: "SIZE ACCURACY // 1:1 ATELIER METRIC",
  },
  {
    id: "faq-04",
    category: "auth",
    question: "How are Vault Vogue pieces authenticated and variant-keyed?",
    answer:
      "Every piece features an embedded cryptographic NFC serial tag woven into the inner care label. Scanning the tag with any smartphone verifies the garment's edition sequence, provenance record, artisan batch, and cryptographic ownership certificate in the Vault Vogue ledger.",
    telemetry: "PROVENANCE // NFC CIPHER VERIFIED",
  },
  {
    id: "faq-05",
    category: "garments",
    question: "What textile sustainability and fiber standards are upheld?",
    answer:
      "We source exclusively from heritage European and Japanese mills. Silks are untreated grade-6A Mulberry; wools are certified mulesing-free Italian merino and Mongolian cashmere; and technical outerwear shells utilize recyclable breathable Tyvek® and high-density waterproof nylon membranes.",
    telemetry: "RAW MATERIAL // 100% ETHICAL TRACEABLE",
  },
  {
    id: "faq-06",
    category: "shipping",
    question: "Is complimentary white-glove shipping offered?",
    answer:
      "Yes. All acquisitions over $150 automatically receive complimentary expedited air-freight delivery. Orders are packaged in weather-resistant Tyvek® garment sleeves, placed in custom rigid archive boxes, and accompanied by embossed dust covers.",
    telemetry: "COMPLIMENTARY TIER // ORDERS > $150",
  },
  {
    id: "faq-07",
    category: "orders",
    question: "What payment gateways and currencies are supported?",
    answer:
      "Vault Vogue supports credit/debit cards (Visa, MasterCard, American Express) via Stripe, Razorpay UPI/Netbanking for India, Apple Pay, and Google Pay. All transactions are protected by PCI-DSS Level 1 compliance and end-to-end tokenization.",
    telemetry: "TRANSACTION // 256-BIT TOKENIZED",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Inquiries" },
  { id: "shipping", label: "Shipping & Telemetry" },
  { id: "orders", label: "Orders & Payments" },
  { id: "garments", label: "Silhouettes & Fabrics" },
  { id: "auth", label: "NFC Authentication" },
];

export default function FaqsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "faq-01": true });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = FAQS_DATA.filter(
    (item) => activeCategory === "all" || item.category === activeCategory,
  );

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 sm:py-20 text-[var(--vault-ink)]">
      {/* Editorial Header Block */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 backdrop-blur-md mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]">
              Maison Knowledge Repository
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            VERSION 4.2 · UPDATED MONTHLY
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Frequently Asked <span className="font-serif italic text-[var(--gold)]">Inquiries.</span>
            </h1>
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
              Comprehensive guidelines detailing archival acquisition, international air-courier transit,
              cryptographic NFC authentication, and bespoke garment sizing.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">RECORD COUNT:</span>
              <span className="font-bold">{FAQS_DATA.length} VERIFIED ANSWERS</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">SPECIALIST DESK:</span>
              <span className="text-[var(--gold)] font-bold">24-HOUR RESOLUTION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[var(--vault-line)]">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)] mr-2 flex items-center gap-1.5">
          <Compass size={13} className="text-[var(--gold)]" /> Filter:
        </span>
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                active
                  ? "border-[var(--gold)] bg-[var(--gold)] text-white shadow-sm"
                  : "border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-muted)] hover:text-[var(--vault-ink)] hover:border-[var(--vault-ink)]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 mb-16">
        {filteredFaqs.map((faq, index) => {
          const isOpen = !!openItems[faq.id];
          return (
            <article
              key={faq.id}
              className={`border transition-all duration-300 backdrop-blur-md ${
                isOpen
                  ? "border-[var(--gold-soft)] bg-[var(--vault-panel)] shadow-lg"
                  : "border-[var(--vault-line)] bg-[var(--vault-panel)]/60 hover:border-[var(--vault-line)] hover:bg-[var(--vault-panel)]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full text-left p-6 sm:p-7 flex items-start justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase">
                    <span className="text-[var(--gold)] font-bold">
                      0{index + 1} //
                    </span>
                    <span className="text-[var(--vault-muted)] tracking-wider">
                      {faq.telemetry}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-light uppercase tracking-tight text-[var(--vault-ink)] pt-1">
                    {faq.question}
                  </h3>
                </div>

                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-transform duration-300 ${
                    isOpen
                      ? "border-[var(--gold)] bg-[var(--gold-glow)] text-[var(--gold)] rotate-180"
                      : "border-[var(--vault-line)] text-[var(--vault-muted)]"
                  }`}
                >
                  <ChevronDown size={15} />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-7 sm:px-7 sm:pb-8 pt-0 border-t border-[var(--vault-line)]/50 mt-2">
                  <p className="text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-sans pt-4 max-w-4xl">
                    {faq.answer}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Still Need Assistance Strip */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--gold)]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold">
              Require Bespoke Consultation?
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
            Our atelier curators are ready to help.
          </h2>
          <p className="text-xs text-[var(--vault-muted)] max-w-md font-mono">
            Direct coordination for custom measurements, private showroom visits, or wholesale queries.
          </p>
        </div>

        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 border border-[var(--gold)] bg-[var(--gold)] text-white px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold transition hover:opacity-90"
        >
          Contact Atelier Desk <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
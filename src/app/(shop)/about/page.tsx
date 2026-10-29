import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  ShieldCheck,
  Globe,
  Layers,
  Feather,
  Recycle,
} from "lucide-react";

export const metadata = {
  title: "About Maison | VAULT VOGUE",
  description:
    "Discover the architectural philosophy, fiber integrity, and cryptographic provenance behind VAULT VOGUE.",
};

const PILLARS = [
  {
    icon: Layers,
    title: "Pure Architectural Cut",
    subtitle: "STRUCTURAL FORM & DRAPE",
    description:
      "Every silhouette is engineered with volumetric precision. We combine dropped geometric shoulders with ergonomic tapering to deliver outerwear and tailoring that moves effortlessly between runway brutalism and everyday comfort.",
  },
  {
    icon: Feather,
    title: "Zero-Compromise Fiber Sourcing",
    subtitle: "HERITAGE MILLS & HIGH-DENSITY WEAVES",
    description:
      "From 480 GSM Wakayama loopback terry to double-faced Italian virgin wool and Japanese cupro linings, every fiber is selected for generational tactile weight and resilience against seasonal obsolescence.",
  },
  {
    icon: ShieldCheck,
    title: "Cryptographic Provenance",
    subtitle: "IMMUTABLE NFC ATELIER VERIFICATION",
    description:
      "Each garment houses a concealed waterproof NFC microchip. Tapping your smartphone unlocks its verifiable manufacturing batch number, fiber origin certificates, and limited-edition authenticity ledger.",
  },
  {
    icon: Recycle,
    title: "Circular Responsibility",
    subtitle: "UNBLEACHED PACKAGING & CARBON EFFICIENCY",
    description:
      "All orders ship in 100% compostable unbleached FSC pulp cartons sealed with natural vegetable resin. Our zero-air fulfillment strategy minimizes carbon expenditure without compromising transit integrity.",
  },
];

const ATELIERS = [
  {
    city: "Paris",
    district: "1er Arrondissement",
    coordinates: "48.8606° N, 2.3376° E",
    role: "Haute Couture Patterning & Creative Direction",
  },
  {
    city: "Indore",
    district: "Central Heritage Quarter",
    coordinates: "22.7196° N, 75.8577° E",
    role: "Digital Engineering & South Asian Logistics Hub",
  },
  {
    city: "Tokyo",
    district: "Minato-ku",
    coordinates: "35.6586° N, 139.7454° E",
    role: "Technical Textiles & Loom Innovation",
  },
  {
    city: "Milan",
    district: "Quadrilatero della Moda",
    coordinates: "45.4642° N, 9.1900° E",
    role: "Luxury Tailoring & Wool Fabric Weaving",
  },
];

export default function AboutPage() {
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
            <span className="text-[var(--vault-muted)]">
              Heritage & Philosophy
            </span>
            <span>/</span>
            <span className="text-[var(--vault-accent)] font-semibold">
              About Us
            </span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-24">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-14 lg:p-20 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-[var(--vault-accent)]/5 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--vault-accent)]/20 bg-[var(--vault-accent)]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
              Maison Archive · Established 2024
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[var(--vault-ink)] leading-[1.1]">
              The Architecture of <br className="hidden sm:inline" />
              <span className="italic font-normal text-[var(--vault-accent)]">
                Contemporary
              </span>{" "}
              Expression.
            </h1>

            <p className="text-base sm:text-lg text-[var(--vault-muted)] leading-relaxed font-light">
              VAULT VOGUE was established at the intersection of high fashion
              editorial sensibility and utilitarian street culture. We challenge
              transient fast-fashion cycles with permanent silhouettes
              engineered to outlive trends.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[var(--vault-accent)] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
              >
                <span>Explore the Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] transition-all"
              >
                Client Care Directives
              </Link>
            </div>
          </div>
        </section>

        {/* ── Brand Manifesto ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--vault-accent)]">
              The Vault Vogue Manifesto
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[var(--vault-ink)] leading-snug">
              “Timeless Fashion. <br />
              <span className="italic font-normal">Modern Expression.”</span>
            </h2>
            <div className="h-0.5 w-16 bg-[var(--vault-accent)] mt-3" />
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-[var(--vault-muted)] leading-relaxed font-light">
            <p>
              We view fashion as functional sculpture. In an era dominated by
              synthetic obsolescence, VAULT VOGUE curates a focused wardrobe for
              the discerning global citizen. Every garment is cut to command
              presence without unnecessary ostentation.
            </p>
            <p>
              Our design process starts with fiber physics: how heavy a jersey
              rests on the collarbone, how Japanese technical twill drapes over
              high-top boots, and how Italian wool breathes across shifting
              climates.
            </p>
          </div>
        </section>

        {/* ── 4 Core Pillars Bento Grid ── */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--vault-line)] pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
                The Four Tenets
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[var(--vault-ink)] mt-1">
                Atelier Craftsmanship Standards
              </h2>
            </div>
            <span className="font-mono text-xs text-[var(--vault-muted)]">
              STD-SPEC // 004-VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-3xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-10 transition-all duration-300 hover:border-[var(--vault-accent)]/50 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] transition-colors group-hover:bg-[var(--vault-accent)] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[var(--vault-muted)]">
                      0{idx + 1}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--vault-accent)] mb-2">
                    {pillar.subtitle}
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl font-light text-[var(--vault-ink)] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--vault-muted)] leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Global Ateliers & Coordinates ── */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[var(--vault-line)] pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
                Presence & Reach
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-[var(--vault-ink)] mt-1">
                Global Atelier Coordinates
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--vault-muted)] font-mono">
              <Globe className="h-4 w-4 text-[var(--vault-accent)]" />
              <span>4 TIME ZONES · 1 CONVICTION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ATELIERS.map((atelier, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 space-y-4 hover:border-[var(--vault-accent)]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-light text-[var(--vault-ink)]">
                    {atelier.city}
                  </span>
                  <Compass className="h-4 w-4 text-[var(--vault-accent)]" />
                </div>
                <p className="text-xs font-medium text-[var(--vault-muted)]">
                  {atelier.district}
                </p>
                <div className="pt-2 border-t border-[var(--vault-line)] space-y-1">
                  <p className="font-mono text-[10px] text-[var(--vault-accent)]">
                    {atelier.coordinates}
                  </p>
                  <p className="text-[11px] text-[var(--vault-muted)] font-light">
                    {atelier.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Client Directives Banner ── */}
        <section className="rounded-3xl border border-[var(--vault-line)] bg-gradient-to-r from-[var(--vault-panel)] to-[var(--vault-panel)]/70 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[var(--vault-ink)]">
              Experience the Craftsmanship Firsthand
            </h3>
            <p className="text-xs sm:text-sm text-[var(--vault-muted)] max-w-xl font-light">
              Discover our permanent menswear, womenswear, and youth archives
              with complimentary insured domestic courier dispatch on qualifying
              orders.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-[var(--vault-accent)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Browse Full Archive
            </Link>
            <Link
              href="/size-guide"
              className="rounded-xl border border-[var(--vault-line)] bg-[var(--vault-panel)] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] transition-all"
            >
              Size Guide
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

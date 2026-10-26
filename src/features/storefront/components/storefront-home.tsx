"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowDownRight, ArrowUpRight, Flame, Sparkles, Compass } from "lucide-react";
import { VARIANT_PRODUCTS } from "../data/catalog";
import { formatCurrency } from "../lib/variant-utils";
import type { VariantProduct } from "../types/variant";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { CATEGORIES, type Category } from "@/assets/data/homeSection";
import { Newsletter } from "./newsletter";

/* -------------------------------------------------------------------------- */
/*                               CATEGORIES DATA                              */


/* -------------------------------------------------------------------------- */
/*                         PRODUCT SHOWCASE CARD COMPONENT                    */
/* -------------------------------------------------------------------------- */
interface ShowcaseCardProps {
  product: VariantProduct;
  badge?: string;
  badgeType?: "trending" | "suggestion" | "launch";
  highlightText?: string;
  priority?: boolean;
  imageAspect?: string;
  imagePosition?: string;
}

function ProductShowcaseCard({
  product,
  badge,
  badgeType = "launch",
  highlightText,
  priority = false,
  imageAspect = "h-56 sm:h-64 md:h-72 max-h-[290px] aspect-[16/10]",
  imagePosition = "object-top",
}: ShowcaseCardProps) {
  const primaryImage = product.colors[0]?.image || "";

  const badgeStyles = {
    trending: "bg-[#DC2626] text-white",
    suggestion: "bg-[var(--gold)] text-white shadow-sm",
    launch: "bg-[var(--vault-ink)] text-[var(--vault-canvas)]",
  };

  return (
    <article className="showcase-card group relative flex flex-col justify-between border border-[var(--vault-line)] bg-[var(--vault-panel)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold-soft)] hover:shadow-xl">
      {/* Top Media Area */}
      <div className={`relative w-full overflow-hidden bg-black/5 ${imageAspect}`}>
        {badge && (
          <div
            className={`absolute left-3 top-3 z-10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest ${badgeStyles[badgeType]}`}
          >
            {badge}
          </div>
        )}

        <Image
          src={primaryImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover ${imagePosition} transition-transform duration-700 ease-out group-hover:scale-105`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--vault-muted)]">
            <span>
              {product.code} · {product.category}
            </span>
            <span>{product.leadTime}</span>
          </div>

          <h3 className="text-xl font-light uppercase tracking-tight text-[var(--vault-ink)] group-hover:text-[var(--gold)] transition-colors sm:text-2xl">
            {product.name}
          </h3>

          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--vault-muted)]">
            {product.description}
          </p>

          {highlightText && (
            <p className="pt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--gold)]">
              {highlightText}
            </p>
          )}
        </div>

        {/* Footer & CTA */}
        <div className="mt-6 flex items-center justify-between border-t border-[var(--vault-line)] pt-4">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
              Price
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--vault-ink)]">
              {formatCurrency(product.price, "USD")}
            </span>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.14em] transition-all hover:scale-[1.02]"
          >
            Explore Piece <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                             MAIN STOREFRONT HOME                           */
/* -------------------------------------------------------------------------- */
export function StorefrontHome() {
  const heroRef = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Background Image Subtle Zoom In
      if (heroImgRef.current) {
        gsap.fromTo(
          heroImgRef.current,
          { scale: 1.08, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" },
        );
      }

      // Hero Content Staggered Reveal
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll(".hero-animate");
        if (heroElements.length > 0) {
          gsap.fromTo(
            heroElements,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: "power3.out",
              delay: 0.1,
            },
          );
        }
      }

      // Showcase Cards Stagger
      if (sectionsRef.current) {
        const cards = sectionsRef.current.querySelectorAll(".showcase-card, .category-card");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.25,
            },
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  // Filter curated showcase subsets
  const trendingPieces = [VARIANT_PRODUCTS[0], VARIANT_PRODUCTS[2]];
  const suggestedPieces = [VARIANT_PRODUCTS[1], VARIANT_PRODUCTS[3]];
  const latestLaunches = VARIANT_PRODUCTS;

  return (
    <main>
      {/* ================================================================== */}
      {/* 1. EDITORIAL HERO SECTION                                          */}
      {/* ================================================================== */}
      <section
        ref={heroRef}
        className="relative isolate min-h-[640px] overflow-hidden border-b border-[var(--vault-line)]"
      >
        <div ref={heroImgRef} className="absolute inset-0 -z-20 h-full w-full">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=85"
            alt="Editorial fashion collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/45 to-black/15" />
        <div className="mx-auto flex min-h-[640px] max-w-[1440px] flex-col justify-end px-5 pb-12 pt-24 text-white sm:px-10 sm:pb-16 lg:px-16">
          <p className="hero-animate font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]">
            Archive / 001 — Autumn, 2026
          </p>
          <h1 className="hero-animate mt-5 max-w-4xl text-5xl font-light uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Form follows
            <br />
            <span className="italic font-serif">feeling.</span>
          </h1>
          <div className="hero-animate mt-7 flex max-w-2xl flex-col justify-between gap-6 border-t border-white/35 pt-5 sm:flex-row sm:items-end">
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              A study in permanence, material and motion. Explore curated silhouettes,
              trending radar picks, and the newest seasonal drops.
            </p>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--gold)] transition hover:translate-x-1"
            >
              Explore Showcase <ArrowDownRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <div ref={sectionsRef}>
        {/* ================================================================== */}
        {/* 2. CATEGORIES SHOWCASE                                             */}
        {/* ================================================================== */}
        <section
          id="categories"
          className="mx-auto max-w-[1440px] border-b border-[var(--vault-line)] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[var(--vault-line)] pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
                <Compass size={14} /> Maison Directory
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl">
                Shop by Categories
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-wider text-[var(--vault-muted)]">
              Curated archives tailored by silhouette, form, and purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat:Category) => (
              <Link
                key={cat.slug}
                href={cat.href}
                className="category-card group relative aspect-[3/4] overflow-hidden border border-[var(--vault-line)] bg-black/10 transition-all duration-300 hover:border-[var(--gold-soft)] hover:shadow-xl"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--gold)]">
                      {cat.kicker}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/70">
                      {cat.count}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/60">
                      {cat.subtitle}
                    </span>
                    <h3 className="mt-1 text-2xl font-light uppercase tracking-tight text-white group-hover:text-[var(--gold)] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">
                      {cat.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--gold)]">
                      Explore {cat.title} <ArrowUpRight size={13} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. TRENDING NOW SHOWCASE                                           */}
        {/* ================================================================== */}
        <section
          id="trending"
          className="mx-auto max-w-[1440px] border-b border-[var(--vault-line)] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[var(--vault-line)] pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#DC2626]">
                <Flame size={14} className="text-[#DC2626]" /> Atelier Radar — Velocity Picks
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl">
                These are Trending
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-wider text-[var(--vault-muted)]">
              Real-time velocity pieces capturing highest demand across flagships.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ProductShowcaseCard
              product={trendingPieces[0]}
              badge="#1 TRENDING VELOCITY"
              badgeType="trending"
              highlightText="3L bonded nylon · Articulated storm construction"
              priority
            />
            <ProductShowcaseCard
              product={trendingPieces[1]}
              badge="#2 TRENDING PICK"
              badgeType="trending"
              highlightText="Cordura ballistic ripstop · 10 modular compartments"
            />
          </div>
        </section>

        {/* ================================================================== */}
        {/* 4. CURATED SUGGESTIONS SHOWCASE                                   */}
        {/* ================================================================== */}
        <section
          id="suggestions"
          className="mx-auto max-w-[1440px] border-b border-[var(--vault-line)] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[var(--vault-line)] pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
                <Sparkles size={14} /> Creative Direction
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl">
                These are Suggestions
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-wider text-[var(--vault-muted)]">
              Curated pairings recommended by the atelier for architectural wardrobes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ProductShowcaseCard
              product={suggestedPieces[0]}
              badge="STYLIST SUGGESTION"
              badgeType="suggestion"
              highlightText="Schoeller dryskin · Laser-cut raw-edge lapel"
            />
            <ProductShowcaseCard
              product={suggestedPieces[1]}
              badge="CURATED CORE ESSENTIAL"
              badgeType="suggestion"
              highlightText="620gsm loopback combed cotton · Contoured balaclava collar"
            />
          </div>
        </section>

        {/* ================================================================== */}
        {/* 5. LATEST LAUNCHES SHOWCASE                                        */}
        {/* ================================================================== */}
        <section
          id="launches"
          className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 sm:py-24"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[var(--vault-line)] pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">
                Autumn / Winter 2026 Drops
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl">
                These are the Latest Launches
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono uppercase tracking-wider"
              >
                Browse Full Catalog <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latestLaunches.map((item, idx) => (
              <ProductShowcaseCard
                key={item.id}
                product={item}
                badge={idx === 0 ? "JUST DROPPED" : idx === 1 ? "LIMITED RUN" : "NEW SILHOUETTE"}
                badgeType="launch"
                highlightText={item.fabric}
                imageAspect="h-60 sm:h-68 md:h-76 max-h-[300px] aspect-[3/4]"
              />
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* 6. NEWSLETTER / ATELIER DISPATCH SECTION                           */}
        {/* ================================================================== */}
        <Newsletter />
      </div>
    </main>
  );
}

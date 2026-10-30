"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDownRight,
  ArrowUpRight,
  Heart,
  Plus,
  Compass,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "../lib/variant-utils";
import type { VariantProduct, VariantSize, VariantColor } from "../types/variant";
import { useStorefront } from "../context/storefront-context";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { Newsletter } from "./newsletter";
import { useGetProducts } from "@/lib/queries/useGetProducts";
import { useLandingPage } from "@/lib/queries/useLandingPage";
import { mapApiProductToVariantProduct } from "@/lib/utility/category-adapter";
import { resolveUiProductImage } from "@/lib/utility/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/*                         INTERACTIVE PRODUCT CARD COMPONENT                  */
/* -------------------------------------------------------------------------- */
interface ProductCardItemProps {
  product: VariantProduct;
  badge?: string;
  badgeType?: "new" | "bestseller" | "sale";
  priority?: boolean;
}

function ProductCardItem({
  product,
  badge,
  badgeType = "new",
  priority = false,
}: ProductCardItemProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStorefront();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<VariantSize>("M");
  const [isHovered, setIsHovered] = useState(false);
  const heartBtnRef = useRef<HTMLButtonElement>(null);

  const fallbackColor: VariantColor = {
    id: "default-obsidian",
    name: "Classic Obsidian",
    code: "BLK",
    hex: "#080B12",
    pantone: "PMS 19-4005",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    stockBySize: { XS: 10, S: 10, M: 10, L: 10, XL: 10 },
  };

  const colors =
    product.colors && product.colors.length > 0 ? product.colors : [fallbackColor];
  const activeColor = colors[selectedColorIdx] || colors[0] || fallbackColor;
  const alternateColor =
    colors.length > 1
      ? colors[(selectedColorIdx + 1) % colors.length]
      : activeColor;

  const inWishlist = isInWishlist(product.id);

  const badgeClass =
    badgeType === "new"
      ? "bg-[var(--vault-accent)] text-white"
      : badgeType === "bestseller"
        ? "bg-[var(--vault-ink)] text-[var(--vault-canvas)]"
        : "bg-[#DC2626] text-white";

  const handleQuickAdd = () => {
    const success = addToCart(product, activeColor, selectedSize);
    if (success) {
      toast.success(`Added ${product.name}`, {
        description: `Color: ${activeColor.name} · Size: ${selectedSize}`,
      });
    } else {
      toast.error("Item currently out of stock in this size");
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (heartBtnRef.current && !isReducedMotion()) {
      gsap.fromTo(
        heartBtnRef.current,
        { scale: 0.8 },
        {
          scale: 1.3,
          duration: 0.18,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
      );
    }

    toggleWishlist(product);
    if (!inWishlist) {
      toast.success("Saved to Archive Wishlist", {
        description: product.name,
      });
    }
  };

  const productLink = `/products/${product.slug || product.id}`;

  return (
    <article
      className="product-grid-card group relative flex flex-col justify-between border border-[var(--vault-line)] bg-[var(--vault-panel)] transition-all duration-300 hover:border-[var(--vault-accent)] hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5">
        {badge && (
          <div
            className={`absolute left-3 top-3 z-10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-widest shadow-sm ${badgeClass}`}
          >
            {badge}
          </div>
        )}

        {/* Wishlist Heart Action */}
        <button
          ref={heartBtnRef}
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--vault-line)] bg-[var(--vault-panel)]/90 text-[var(--vault-ink)] backdrop-blur-md transition hover:scale-110 hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
        >
          <Heart
            size={14}
            className={
              inWishlist
                ? "fill-[var(--vault-accent)] text-[var(--vault-accent)]"
                : ""
            }
          />
        </button>

        {/* Main Product Image with Alternate Crossfade */}
        <Link
          href={productLink}
          className="block h-full w-full relative"
        >
          <Image
            src={activeColor.image || fallbackColor.image}
            alt={`${product.name} in ${activeColor.name}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <Image
            src={alternateColor.image || activeColor.image || fallbackColor.image}
            alt={`${product.name} alternate angle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        </Link>

        {/* Desktop Quick Add Action */}
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="btn-primary w-full py-2.5 font-mono text-[10px] uppercase font-bold tracking-wider shadow-lg flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Quick Add ({selectedSize})
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category & Code */}
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
            <span className="truncate max-w-[120px]">{product.category}</span>
            <span>{product.code}</span>
          </div>

          {/* Title */}
          <Link href={productLink}>
            <h3 className="mt-1 font-serif text-lg font-light uppercase tracking-tight text-[var(--vault-ink)] transition-colors hover:text-[var(--vault-accent)] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing in INR */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold text-[var(--vault-ink)]">
              {formatCurrency(product.price, "INR")}
            </span>
            <span className="font-mono text-[10px] line-through text-[var(--vault-muted)]">
              {formatCurrency(Math.round(product.price * 1.3), "INR")}
            </span>
          </div>

          {/* Color Swatches */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {colors.slice(0, 4).map((c, idx) => (
              <button
                key={c.id || idx}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                aria-label={`Select ${c.name}`}
                className={`h-4 w-4 rounded-full border transition-transform ${
                  selectedColorIdx === idx
                    ? "scale-125 border-[var(--vault-accent)] ring-1 ring-[var(--vault-accent)]"
                    : "border-black/20 hover:scale-110"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <span className="ml-1 font-mono text-[9px] uppercase text-[var(--vault-muted)] truncate max-w-[120px]">
              {activeColor.name}
            </span>
          </div>

          {/* Size Pills */}
          <div className="mt-3 flex items-center gap-1">
            {(["XS", "S", "M", "L", "XL"] as VariantSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`h-6 w-7 border font-mono text-[9px] uppercase transition-colors ${
                  selectedSize === sz
                    ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                    : "border-[var(--vault-line)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)] hover:text-[var(--vault-ink)]"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-4 pt-3 border-t border-[var(--vault-line)] sm:hidden">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="btn-primary max-sm:rounded-md! text-wrap w-full py-2 max-sm:px-2! font-mono text-[9px] uppercase tracking-wider"
          >
            Quick Add
          </button>
        </div>
      </div>

    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN STOREFRONT HOME                         */
/* -------------------------------------------------------------------------- */
export function StorefrontHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLAnchorElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  type ProductSectionTab = "new-arrivals" | "trending" | "bestsellers";
  const [activeTab, setActiveTab] = useState<ProductSectionTab>("new-arrivals");

  // Fetch live products from backend API
  const {
    data: apiProductsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useGetProducts({
    limit: 20,
    label: "storefront-home",
    sortBy: "createdAt",
    order: "desc",
  });

  // Fetch landing CMS data
  const { data: landingData } = useLandingPage();

  const rawApiProducts = useMemo(() => {
    return apiProductsData?.pages.flatMap((page) => page) || [];
  }, [apiProductsData]);

  const apiVariantProducts = useMemo(() => {
    return rawApiProducts.map(mapApiProductToVariantProduct);
  }, [rawApiProducts]);

  const isUsingLiveData = apiVariantProducts.length > 0;

  // Base pool of products: live API products if available, else curated archive fallback
  const baseProducts = useMemo(() => {
    return isUsingLiveData ? apiVariantProducts : [];
  }, [isUsingLiveData, apiVariantProducts]);

  // Filter products based on selected tab
  const displayedProducts = useMemo(() => {
    if (activeTab === "trending") {
      const trending = baseProducts.filter(
        (p) =>
          p.leadTime?.toLowerCase().includes("demand") ||
          rawApiProducts.find((r) => r.id === p.id)?.trending,
      );
      return trending.length >= 4 ? trending.slice(0, 8) : baseProducts.slice(0, 8);
    }
    if (activeTab === "bestsellers") {
      const best = baseProducts.filter(
        (p) =>
          p.leadTime?.toLowerCase().includes("bestseller") ||
          rawApiProducts.find((r) => r.id === p.id)?.bestseller,
      );
      return best.length >= 4 ? best.slice(0, 8) : baseProducts.slice(0, 8);
    }
    return baseProducts.slice(0, 8);
  }, [baseProducts, activeTab, rawApiProducts]);

  // Dynamic trending categories combining backend categories with fallback editorial categories
  const categoriesList = useMemo(() => {
    if (landingData?.categories && landingData.categories.length > 0) {
      return landingData.categories.map((cat) => {
        const count = baseProducts.filter(
          (p) =>
            p.category?.toLowerCase().includes(cat.name.toLowerCase()) ||
            p.name?.toLowerCase().includes(cat.name.toLowerCase()),
        ).length;
        return {
          title: cat.name,
          subtitle: `${cat.name} Atelier Cuts`,
          count: count > 0 ? `${count} Silhouettes` : "Archival Edition",
          image: cat.image ? resolveUiProductImage(cat.image) : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
          href: `/products?category=${encodeURIComponent(cat.name)}`,
        };
      });
    }

    const defaults = [
      {
        title: "Oversized Tees",
        subtitle: "340gsm Dropped Shoulder Cuts",
        catKey: "tee",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Oversized+Tees",
      },
      {
        title: "Tailored Trousers",
        subtitle: "Double-Pleat & Modular Cargo",
        catKey: "trouser",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Tailored+Trousers",
      },
      {
        title: "Outerwear",
        subtitle: "Bonded Shells & Shearling Bombers",
        catKey: "outerwear",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Outerwear",
      },
      {
        title: "Knitwear",
        subtitle: "620gsm Balaclava Collars",
        catKey: "knit",
        image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Knitwear",
      },
      {
        title: "Accessories",
        subtitle: "Calfskin Holsters & Jewelry",
        catKey: "access",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Accessories",
      },
    ];

    return defaults.map((d) => {
      const count = baseProducts.filter(
        (p) =>
          p.category?.toLowerCase().includes(d.catKey) ||
          p.name?.toLowerCase().includes(d.catKey),
      ).length;
      return {
        title: d.title,
        subtitle: d.subtitle,
        count: count > 0 ? `${count} Silhouettes` : "Archival Edition",
        image: d.image,
        href: d.href,
      };
    });
  }, [landingData, baseProducts]);

  // Recalculate ScrollTrigger once product grid updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, [displayedProducts.length, isProductsLoading]);

  // GSAP Initial Entrance Timeline & ScrollTrigger Orchestration
  useEffect(() => {
    if (isReducedMotion() || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial Hero Master Timeline
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Step 1: Subtle background opacity transition
      heroTl.fromTo(
        heroBgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: "power2.inOut" },
      );

      // Step 2: Reveal brand campaign image with clipping / mask expansion
      if (heroImgRef.current) {
        heroTl.fromTo(
          heroImgRef.current,
          {
            clipPath: "polygon(0 15%, 100% 15%, 100% 85%, 0 85%)",
            scale: 1.12,
            opacity: 0.6,
          },
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "power2.out",
          },
          "-=0.6",
        );
      }

      // Step 3: Animate seasonal tag
      heroTl.fromTo(
        ".hero-seasonal-tag",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.7",
      );

      // Step 4: Line-by-line staggered upward headline reveal
      heroTl.fromTo(
        ".hero-headline-line",
        { y: "115%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.85,
          stagger: 0.16,
          ease: "power4.out",
        },
        "-=0.4",
      );

      // Step 5: Fade in supporting text
      heroTl.fromTo(
        ".hero-supporting-text",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3",
      );

      // Step 6: Reveal primary and secondary CTA buttons
      heroTl.fromTo(
        ".hero-cta-btn",
        { opacity: 0, scale: 0.94, y: 15 },
        { opacity: 1, scale: 1, y: 0, stagger: 0.12, duration: 0.55 },
        "-=0.25",
      );

      // Step 7: Introduce scroll indicator with looping movement
      if (scrollIndicatorRef.current) {
        heroTl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            onComplete: () => {
              gsap.to(scrollIndicatorRef.current, {
                y: 6,
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
              });
            },
          },
          "-=0.1",
        );
      }

      // 2. ScrollTrigger: Hero Scroll Parallax
      if (heroImgRef.current && heroRef.current) {
        gsap.to(heroImgRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 3. ScrollTrigger: Featured Collections Cards Reveal
      const collectionCards = document.querySelectorAll(".collection-card");
      if (collectionCards.length > 0) {
        collectionCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        });
      }

      // 4. ScrollTrigger: New Arrivals Product Grid Stagger
      const productGrid = document.querySelector("#new-arrivals-grid");
      if (productGrid) {
        const items = productGrid.querySelectorAll(".product-grid-card");
        gsap.fromTo(
          items,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: productGrid,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // 5. ScrollTrigger: Editorial Section Reveal & Parallax
      const editorialSection = document.querySelector("#editorial-campaign");
      const editorialImg = document.querySelector(".editorial-img-container");
      if (editorialSection && editorialImg) {
        gsap.fromTo(
          editorialSection.querySelectorAll(".editorial-reveal"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: editorialSection,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );

        gsap.to(editorialImg, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: editorialSection,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 6. ScrollTrigger: Brand Philosophy Entrance
      const brandSection = document.querySelector("#brand-philosophy");
      if (brandSection) {
        gsap.fromTo(
          brandSection.querySelectorAll(".philosophy-reveal"),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.14,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: brandSection,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Subtle Mouse Movement Parallax on Desktop (Disabled on touch & small viewports)
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (
      isReducedMotion() ||
      typeof window === "undefined" ||
      window.innerWidth < 1024
    )
      return;
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 16;
    const yPos = (clientY / window.innerHeight - 0.5) * 16;
    if (heroImgRef.current) {
      gsap.to(heroImgRef.current, {
        x: xPos,
        y: yPos,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const scrollCategories = (direction: "left" | "right") => {
    if (categoriesScrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      categoriesScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={containerRef}>
      <main>
        {/* ================================================================== */}
        {/* 1. CINEMATIC HERO SECTION                                          */}
        {/* ================================================================== */}
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          className="relative isolate min-h-[85vh] sm:min-h-[92vh] lg:min-h-screen overflow-hidden border-b border-[var(--vault-line)] flex flex-col justify-end"
        >
          {/* Subtle Background Layer */}
          <div
            ref={heroBgRef}
            className="absolute inset-0 -z-30 bg-[var(--vault-canvas)]"
          />

          {/* Masked Hero Campaign Image */}
          <div
            ref={heroImgRef}
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full -z-20 will-change-transform"
          >
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=88"
              alt="VAULT VOGUE Contemporary Streetwear Campaign"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Ambient Editorial Gradients */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--vault-canvas)] via-[var(--vault-canvas)]/40 to-transparent opacity-95" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--vault-canvas)]/85 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 -z-10 bg-gradient-to-b from-[var(--vault-canvas)]/60 via-transparent to-transparent pointer-events-none hidden lg:block" />

          <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 text-[var(--vault-ink)] sm:px-10 lg:px-16 lg:pt-44 lg:pb-20">
            {/* Seasonal Tag */}
            <div className="hero-seasonal-tag flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--vault-accent)] font-semibold">
                AUTUMN / WINTER 2026 · EDITION 01
              </span>
              <span className="h-px w-10 bg-[var(--vault-accent)]" />
              <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-[var(--vault-muted)]">
                INDORE · PARIS · TOKYO
              </span>
            </div>

            {/* Line-by-Line Masked Headline */}
            <div className="mt-6 max-w-4xl">
              <div className="overflow-hidden">
                <h1 className="hero-headline-line font-serif text-5xl font-light uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-9xl">
                  OWN YOUR
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="hero-headline-line font-serif text-5xl font-normal italic uppercase leading-[0.92] tracking-tight sm:text-7xl lg:text-9xl text-[var(--vault-accent)]">
                  EDGE.
                </h1>
              </div>
            </div>

            {/* Supporting Text & CTAs */}
            <div className="mt-8 flex max-w-3xl flex-col justify-between gap-8 border-t border-[var(--vault-line)] pt-6 md:flex-row md:items-end">
              <p className="hero-supporting-text max-w-md text-sm sm:text-base leading-relaxed text-[var(--vault-muted)] font-light">
                Designed for movement. Built for expression. A synthesis of
                luxury tailoring, architectural streetwear, and uncompromised
                contemporary craftsmanship.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/#new-arrivals"
                  className="hero-cta-btn btn-primary px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-[0.18em] transition-all hover:scale-[1.02] shadow-[0_4px_18px_rgba(183,110,121,0.35)] hover:shadow-[0_6px_25px_rgba(183,110,121,0.5)]"
                >
                  SHOP THE COLLECTION
                </Link>
                <Link
                  href="/#editorial-campaign"
                  className="hero-cta-btn btn-secondary group px-6 py-3.5 font-mono text-xs uppercase tracking-[0.16em] inline-flex items-center gap-2"
                >
                  EXPLORE THE EDIT{" "}
                  <ArrowUpRight
                    size={14}
                    className="text-[var(--vault-cobalt)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Bottom Understated Details & Looping Scroll Indicator */}
            <div className="mt-12 flex items-center justify-between border-t border-[var(--vault-line)]/50 pt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vault-muted)]">
              <span>VAULT VOGUE ARCHIVE RUN 01</span>
              <a
                ref={scrollIndicatorRef}
                href="#featured-collections"
                className="inline-flex items-center gap-1.5 text-[var(--vault-ink)] hover:text-[var(--vault-accent)] transition-colors will-change-transform"
              >
                SCROLL TO DISCOVER{" "}
                <ArrowDownRight
                  size={13}
                  className="text-[var(--vault-accent)]"
                />
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 2. FEATURED COLLECTIONS                                            */}
        {/* ================================================================== */}
        <section
          id="featured-collections"
          className="mx-auto max-w-[1440px] border-b border-[var(--vault-line)] px-4 py-20 sm:px-8 sm:py-28"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[var(--vault-line)] pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)]">
                <Compass size={14} /> Curated Silhouettes
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl">
                Featured Collections
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-wider text-[var(--vault-muted)]">
              Three distinct architectural narratives tailored for contemporary
              life.
            </p>
          </div>

          {/* 3 Asymmetrical Cards with ScrollTrigger */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Card 1: URBAN ESSENTIALS (Span 5) */}
            <div className="collection-card group relative aspect-[4/5] overflow-hidden border border-[var(--vault-line)] bg-black/10 lg:col-span-5">
              <Image
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85"
                alt="URBAN ESSENTIALS"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 text-white">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-accent)]">
                  Collection 01
                </span>
                <div>
                  <h3 className="font-serif text-3xl font-light uppercase tracking-tight sm:text-4xl">
                    URBAN ESSENTIALS
                  </h3>
                  <p className="mt-2 text-xs text-white/75 leading-relaxed max-w-sm">
                    Engineered streetwear for transitional climates. Oversized
                    silhouettes built from bonded technical cottons and
                    articulated seams.
                  </p>
                  <Link
                    href="/products?collection=urban-essentials"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-accent)] hover:underline"
                  >
                    Explore Collection{" "}
                    <ArrowUpRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 & 3: ELEVATED BASICS and AFTER HOURS (Span 7) */}
            <div className="flex flex-col gap-8 lg:col-span-7">
              {/* Card 2: ELEVATED BASICS */}
              <div className="collection-card group relative aspect-[16/9] overflow-hidden border border-[var(--vault-line)] bg-black/10">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                  alt="ELEVATED BASICS"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 text-white">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-accent)]">
                    Collection 02
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl font-light uppercase tracking-tight sm:text-3xl">
                      ELEVATED BASICS
                    </h3>
                    <p className="mt-1 text-xs text-white/75 leading-relaxed max-w-md">
                      Understated luxury daily wear crafted from 620gsm combed
                      Peruvian cotton and heavyweight looped terry.
                    </p>
                    <Link
                      href="/products?collection=elevated-basics"
                      className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-accent)] hover:underline"
                    >
                      Explore Collection{" "}
                      <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Card 3: AFTER HOURS */}
              <div className="collection-card group relative aspect-[16/9] overflow-hidden border border-[var(--vault-line)] bg-black/10">
                <Image
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
                  alt="AFTER HOURS"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 text-white">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-accent)]">
                    Collection 03
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl font-light uppercase tracking-tight sm:text-3xl">
                      AFTER HOURS
                    </h3>
                    <p className="mt-1 text-xs text-white/75 leading-relaxed max-w-md">
                      Nocturnal tailoring and reflective hardware designed for
                      after-dark contemporary expression.
                    </p>
                    <Link
                      href="/products?collection=after-hours"
                      className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-accent)] hover:underline"
                    >
                      Explore Collection{" "}
                      <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 3. NEW ARRIVALS (4 Columns Desktop / 2 Columns Mobile)             */}
        {/* ================================================================== */}
        <section
          id="new-arrivals"
          className="mx-auto max-w-[1440px] border-b border-[var(--vault-line)] px-4 py-20 sm:px-8 sm:py-28"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[var(--vault-line)] pb-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)]">
                  Seasonal Release
                </span>
                {isUsingLiveData ? (
                  <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live API Data ({baseProducts.length})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 border border-[var(--vault-line)] bg-[var(--vault-panel)] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--vault-accent)]" />
                    Curated Archive ({baseProducts.length})
                  </span>
                )}
                {isProductsError && (
                  <button
                    type="button"
                    onClick={() => refetchProducts()}
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-[var(--vault-accent)] hover:underline"
                  >
                    <RotateCcw size={10} /> Retry
                  </button>
                )}
              </div>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl">
                New Arrivals
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Category Mode Tabs */}
              <div className="flex items-center gap-1 border border-[var(--vault-line)] bg-[var(--vault-panel)] p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("new-arrivals")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    activeTab === "new-arrivals"
                      ? "bg-[var(--vault-accent)] text-white font-bold"
                      : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                  }`}
                >
                  All Releases
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("trending")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    activeTab === "trending"
                      ? "bg-[var(--vault-accent)] text-white font-bold"
                      : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                  }`}
                >
                  Trending
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("bestsellers")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    activeTab === "bestsellers"
                      ? "bg-[var(--vault-accent)] text-white font-bold"
                      : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                  }`}
                >
                  Bestsellers
                </button>
              </div>

              <Link
                href="/products"
                className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono uppercase tracking-wider"
              >
                View Full Catalog <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>

          {/* 4 columns desktop / 2 columns mobile */}
          {isProductsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse border border-[var(--vault-line)] bg-[var(--vault-panel)] p-4 flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] w-full bg-[var(--vault-line)]/50 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 w-1/3 bg-[var(--vault-line)]/60" />
                    <div className="h-4 w-3/4 bg-[var(--vault-line)]/70" />
                    <div className="h-3 w-1/4 bg-[var(--vault-line)]/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              id="new-arrivals-grid"
              className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
            >
              {displayedProducts.map((product, idx) => (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  badge={
                    idx === 0 || idx === 4
                      ? "NEW ARRIVAL"
                      : idx === 1 || idx === 6
                        ? "BESTSELLER"
                        : undefined
                  }
                  badgeType={
                    idx === 0 || idx === 4
                      ? "new"
                      : idx === 1 || idx === 6
                        ? "bestseller"
                        : "new"
                  }
                  priority={idx < 4}
                />
              ))}
            </div>
          )}
        </section>

        {/* ================================================================== */}
        {/* 4. EDITORIAL CAMPAIGN: FASHION WITHOUT THE FILTER                  */}
        {/* ================================================================== */}
        <section
          id="editorial-campaign"
          className="border-b border-[var(--vault-line)] bg-[var(--vault-panel)] px-4 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Photographic Spread with Parallax Container */}
              <div className="editorial-img-container relative aspect-[4/5] overflow-hidden border border-[var(--vault-line)] lg:col-span-7">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=88"
                  alt="Editorial Campaign: Fashion Without The Filter"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 font-mono text-[9px] uppercase tracking-widest text-white/90">
                  Editorial Vol. IV — Styled in Shibuya &amp; Montmartre
                </div>
              </div>

              {/* Right Editorial Copy */}
              <div className="space-y-6 lg:col-span-5 lg:pl-6">
                <div className="editorial-reveal flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--vault-cobalt)]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--vault-cobalt)] font-semibold">
                    Editorial Manifesto
                  </span>
                </div>

                <h2 className="editorial-reveal font-serif text-4xl font-light uppercase leading-[1.05] tracking-tight sm:text-6xl text-[var(--vault-ink)]">
                  FASHION
                  <br />
                  WITHOUT
                  <br />
                  THE FILTER.
                </h2>

                <p className="editorial-reveal text-sm leading-relaxed text-[var(--vault-muted)] font-light">
                  Everyday essentials. Uncompromising expression. We reject
                  digital artificiality and transient fashion cycles. Every
                  VAULT VOGUE piece is designed around tactile truth — authentic
                  heavyweight cottons, laser-bonded membranes, and architectural
                  cuts that command presence in the physical world.
                </p>

                <div className="editorial-reveal border-l-2 border-[var(--vault-accent)] pl-4 py-1">
                  <p className="font-serif italic text-lg text-[var(--vault-ink)]">
                    &ldquo;A silhouette is not an image on a screen; it is
                    geometry experienced in motion.&rdquo;
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--vault-muted)]">
                    Atelier Creative Direction
                  </p>
                </div>

                <div className="editorial-reveal pt-4 flex items-center gap-4">
                  <Link
                    href="/products"
                    className="btn-primary px-7 py-3.5 font-mono text-[10px] uppercase font-bold tracking-widest"
                  >
                    DISCOVER THE COLLECTION
                  </Link>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-cobalt)]">
                    Journal Edition →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 5. TRENDING CATEGORIES (Horizontal Gallery / Carousel)              */}
        {/* ================================================================== */}
        <section
          id="trending-categories"
          className="mx-auto max-w-[1440px] border-b border-[var(--vault-line)] px-4 py-20 sm:px-8 sm:py-28"
        >
          <div className="mb-10 flex items-end justify-between border-b border-[var(--vault-line)] pb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)]">
                Silhouette Catalog
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl">
                Trending Categories
              </h2>
            </div>
            {/* Carousel Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCategories("left")}
                aria-label="Scroll categories left"
                className="flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)]"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories("right")}
                aria-label="Scroll categories right"
                className="flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Horizontal scroll container */}
          <div
            ref={categoriesScrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
          >
            {categoriesList.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative h-[380px] w-[260px] flex-shrink-0 overflow-hidden border border-[var(--vault-line)] bg-black/10 transition hover:border-[var(--vault-accent)]"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-accent)]">
                    {cat.count}
                  </span>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                      {cat.subtitle}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl font-light uppercase tracking-tight text-white group-hover:text-[var(--vault-accent)] transition-colors">
                      {cat.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-[var(--vault-accent)]">
                      Explore Category{" "}
                      <ArrowUpRight
                        size={12}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================================================================== */}
        {/* 6. BRAND PHILOSOPHY: LESS NOISE. MORE EXPRESSION.                  */}
        {/* ================================================================== */}
        <section
          id="brand-philosophy"
          className="mx-auto max-w-[1440px] border-b border-[var(--vault-line)] px-4 py-20 sm:px-8 sm:py-28"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-6">
              <span className="philosophy-reveal font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)]">
                Brand Philosophy
              </span>
              <h2 className="philosophy-reveal font-serif text-3xl font-light uppercase leading-tight tracking-tight sm:text-5xl text-[var(--vault-ink)]">
                LESS NOISE.
                <br />
                <span className="italic text-[var(--vault-accent)]">
                  MORE EXPRESSION.
                </span>
              </h2>
              <p className="philosophy-reveal text-sm leading-relaxed text-[var(--vault-muted)] font-light">
                In an era dominated by rapid algorithm-driven fashion and
                disposable garments, VAULT VOGUE takes an architectural stand.
                We distill each silhouette down to its functional and emotional
                core — prioritizing structural integrity, heavyweight natural
                fibers, and intentional cuts over loud logos.
              </p>
              <p className="philosophy-reveal text-sm leading-relaxed text-[var(--vault-muted)] font-light">
                Every stitch is considered. Every pocket is placed with
                anatomical purpose. This is clothing built to become an
                extension of your presence.
              </p>
              <div className="philosophy-reveal pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--vault-accent)] hover:underline"
                >
                  DISCOVER OUR STORY{" "}
                  <ArrowUpRight
                    size={14}
                    className="text-[var(--vault-cobalt)]"
                  />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden border border-[var(--vault-line)] lg:col-span-6">
              <Image
                src="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=85"
                alt="Atelier Tailoring Process"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* 7. NEWSLETTER SECTION                                              */}
        {/* ================================================================== */}
        <Newsletter />
      </main>
    </div>
  );
}

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
import type {
  VariantProduct,
  VariantSize,
  VariantColor,
} from "../types/variant";
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
  isSelector?: boolean;
}

function ProductCardItem({
  product,
  badge,
  badgeType = "new",
  priority = false,
  isSelector = false,
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
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
    stockBySize: { XS: 10, S: 10, M: 10, L: 10, XL: 10 },
  };

  const colors =
    product.colors && product.colors.length > 0
      ? product.colors
      : [fallbackColor];
  const activeColor = colors[selectedColorIdx] || colors[0] || fallbackColor;
  const alternateColor =
    colors.length > 1
      ? colors[(selectedColorIdx + 1) % colors.length]
      : activeColor;

  const inWishlist = isInWishlist(product.id);

  const badgeClass =
    badgeType === "new"
      ? "bg-(--vault-accent) text-white"
      : badgeType === "bestseller"
        ? "bg-(--vault-ink) text-(--vault-canvas)"
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
      className="product-grid-card group relative flex flex-col justify-between border border-(--vault-line) bg-(--vault-panel) transition-[border-color,box-shadow] duration-300 hover:border-(--vault-accent) hover:shadow-xl"
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
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-(--vault-line) bg-(--vault-panel)/90 text-(--vault-ink) backdrop-blur-md transition hover:scale-110 hover:border-(--vault-accent) hover:text-(--vault-accent) touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Heart
            size={14}
            aria-hidden="true"
            className={
              inWishlist
                ? "fill-(--vault-accent) text-(--vault-accent)"
                : ""
            }
          />
        </button>

        {/* Main Product Image with Alternate Crossfade */}
        <Link href={productLink} className="block h-full w-full relative focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none">
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
            src={
              alternateColor.image || activeColor.image || fallbackColor.image
            }
            alt={`${product.name} alternate angle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-top transition-all duration-700 ease-out group-hover:scale-105 ${
              isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        </Link>

        {/* Desktop Quick Add Action */}
        {isSelector && (
          <div className="absolute inset-x-3 bottom-3 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="btn-primary w-full py-2.5 font-mono text-[10px] uppercase font-bold tracking-wider shadow-lg flex items-center justify-center gap-1.5 touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Plus size={14} aria-hidden="true" /> Quick Add ({selectedSize})
            </button>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Category & Code */}
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
            <span className="truncate max-w-[120px]">{product.category}</span>
            {/*<span>{product.code}</span>*/}
          </div>

          {/* Title */}
          <Link href={productLink} className="focus-visible:ring-1 focus-visible:ring-(--vault-accent) focus-visible:outline-none">
            <h3 className="mt-1 font-serif text-lg font-light uppercase tracking-tight text-(--vault-ink) transition-colors hover:text-(--vault-accent) line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Pricing in INR */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-sm font-semibold tabular-nums text-(--vault-ink)">
              {formatCurrency(product.price, "INR")}
            </span>
            <span className="font-mono text-[10px] line-through tabular-nums text-(--vault-muted)">
              {formatCurrency(Math.round(product.price * 1.3), "INR")}
            </span>
          </div>

          {/* Color Swatches */}
          {isSelector && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              {colors.slice(0, 4).map((c, idx) => (
                <button
                  key={c.id || idx}
                  type="button"
                  onClick={() => setSelectedColorIdx(idx)}
                  aria-label={`Select ${c.name}`}
                  className={`h-4 w-4 rounded-full border transition-transform touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none focus-visible:ring-offset-1 ${
                    selectedColorIdx === idx
                      ? "scale-125 border-(--vault-accent) ring-1 ring-(--vault-accent)"
                      : "border-black/20 hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              <span className="ml-1 font-mono text-[9px] uppercase text-(--vault-muted) truncate max-w-[120px]">
                {activeColor.name}
              </span>
            </div>
          )}

          {/* Size Pills */}
          {isSelector && (
            <div className="mt-3 flex items-center gap-1">
              {(["XS", "S", "M", "L", "XL"] as VariantSize[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  aria-label={`Select size ${sz}`}
                  className={`h-6 w-7 border font-mono text-[9px] uppercase transition-colors touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none ${
                    selectedSize === sz
                      ? "border-(--vault-accent) bg-(--vault-accent) text-white font-bold"
                      : "border-(--vault-line) text-(--vault-muted) hover:border-(--vault-ink) hover:text-(--vault-ink)"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-4 pt-3 border-t border-(--vault-line) sm:hidden">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="btn-primary max-sm:rounded-md! text-wrap w-full py-2 max-sm:px-2! font-mono text-[9px] uppercase tracking-wider touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
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
      return trending.length >= 4
        ? trending.slice(0, 8)
        : baseProducts.slice(0, 8);
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
          image: cat.image
            ? resolveUiProductImage(cat.image)
            : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
          href: `/products?category=${encodeURIComponent(cat.name)}`,
        };
      });
    }

    const defaults = [
      {
        title: "Oversized Tees",
        subtitle: "340gsm Dropped Shoulder Cuts",
        catKey: "tee",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Oversized+Tees",
      },
      {
        title: "Tailored Trousers",
        subtitle: "Double-Pleat & Modular Cargo",
        catKey: "trouser",
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Tailored+Trousers",
      },
      {
        title: "Outerwear",
        subtitle: "Bonded Shells & Shearling Bombers",
        catKey: "outerwear",
        image:
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Outerwear",
      },
      {
        title: "Knitwear",
        subtitle: "620gsm Balaclava Collars",
        catKey: "knit",
        image:
          "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=800&q=85",
        href: "/products?category=Knitwear",
      },
      {
        title: "Accessories",
        subtitle: "Calfskin Holsters & Jewelry",
        catKey: "access",
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
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
      <main id="main-content">
        {/* ================================================================== */}
        {/* 1. CINEMATIC ASYMMETRIC HERO SECTION (Design-Taste-Frontend)       */}
        {/* ================================================================== */}
        {/* 1. CINEMATIC ASYMMETRIC HERO SECTION (Full Bleed Background Behind Navbar) */}
        {/* ================================================================== */}
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          className="relative isolate min-h-[100dvh] w-full overflow-hidden border-b border-(--vault-line) flex flex-col justify-between pt-28 pb-8 sm:pt-32 sm:pb-12 lg:pt-36 lg:pb-14"
        >
          {/* Hero Background Image Asset with Parallax Scaling extending behind the navbar */}
          <div
            ref={heroBgRef}
            className="absolute inset-0 -z-30 overflow-hidden bg-(--vault-canvas)"
          >
            <div
              ref={heroImgRef}
              className="absolute inset-x-0 -top-[10%] h-[120%] w-full will-change-transform"
            >
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=88"
                alt="VAULT VOGUE Atelier Campaign Model"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center filter brightness-[0.85] contrast-[1.04]"
              />
              {/* Luxury Gradient Scrims: left-to-right text readability & top navbar protection */}
              <div className="absolute inset-0 bg-gradient-to-r from-(--vault-canvas)/95 via-(--vault-canvas)/75 to-(--vault-canvas)/25 lg:from-(--vault-canvas)/92 lg:via-(--vault-canvas)/55 lg:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-(--vault-canvas) via-(--vault-canvas)/30 to-transparent opacity-95" />
              <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-(--vault-canvas)/75 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
          <div className="absolute top-1/4 -left-32 -z-20 h-96 w-96 rounded-full bg-(--vault-accent)/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 -z-20 h-96 w-96 rounded-full bg-(--vault-cobalt)/8 blur-[100px] pointer-events-none" />

          {/* Main Asymmetric Grid Container */}
          <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-16 flex-1 flex flex-col justify-center my-auto">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Left Column: Bold Asymmetric Typography & Tactile Action Suite (Span 7) */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
                {/* Floating Atelier Live Drop Indicator with Perpetual Pulse */}
                <div className="hero-seasonal-tag inline-flex items-center gap-2.5 self-start px-3.5 py-1.5 border border-(--vault-line) bg-(--vault-panel)/80 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] mb-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--vault-accent) animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-(--vault-accent) font-semibold">
                    DROP 01 LIVE · LIMITED RUN OF 500 SILHOUETTES
                  </span>
                  <span className="h-2.5 w-px bg-(--vault-line) mx-1" />
                  <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-(--vault-muted)">
                    TOKYO · PARIS · INDORE
                  </span>
                </div>

                {/* Line-by-Line Staggered Masked Headline */}
                <div className="text-wrap">
                  <div className="">
                    <h1 className="hero-headline-line font-serif text-5xl font-light uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl text-(--vault-ink) text-balance">
                      TIMELESS
                    </h1>
                  </div>
                  <div className="">
                    <h1 className="hero-headline-line font-serif text-5xl font-light uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl text-(--vault-ink) text-balance">
                      ARCHITECTURE.
                    </h1>
                  </div>
                  <div className=" mt-1 sm:mt-2">
                    <h1 className="hero-headline-line font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal italic uppercase leading-[0.92] tracking-tight text-(--vault-accent) text-balance">
                      MODERN EXPRESSION.
                    </h1>
                  </div>
                </div>

                {/* Supporting Narrative with strict line measure */}
                <p className="hero-supporting-text mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-(--vault-muted) font-light text-pretty">
                  Engineered for anatomical movement. Sculpted for physical presence. A synthesis of luxury tailoring, heavyweight custom-milled textiles, and uncompromised contemporary craftsmanship.
                </p>

                {/* Tactile Push Action Suite */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href="/#new-arrivals"
                    className="hero-cta-btn btn-primary px-8 py-4 font-mono text-xs uppercase font-bold tracking-[0.18em] transition-[transform,box-shadow,background-color] duration-200 active:scale-[0.98] active:-translate-y-[1px] shadow-[0_6px_24px_rgba(183,110,121,0.35)] hover:shadow-[0_8px_30px_rgba(183,110,121,0.5)] touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    SHOP SILHOUETTES
                  </Link>
                  <Link
                    href="/#editorial-campaign"
                    className="hero-cta-btn inline-flex items-center gap-2 border border-(--vault-line) bg-(--vault-panel)/70 px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-(--vault-ink) backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[border-color,transform,color] duration-200 hover:border-(--vault-accent) hover:text-(--vault-accent) active:scale-[0.98] touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
                  >
                    EXPLORE THE EDIT{" "}
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                      className="text-(--vault-cobalt) transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>

                {/* Atelier Specifications Strip (Tabular Numerals) */}
                <div className="hero-supporting-text mt-10 grid grid-cols-3 gap-4 border-t border-(--vault-line)/70 pt-6">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">Fabric Weight</p>
                    <p className="mt-1 font-mono text-xs sm:text-sm font-semibold tabular-nums text-(--vault-ink)">380–620 GSM</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">Production Run</p>
                    <p className="mt-1 font-mono text-xs sm:text-sm font-semibold tabular-nums text-(--vault-ink)">01 / 500 Numbered</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">Dispatch Time</p>
                    <p className="mt-1 font-mono text-xs sm:text-sm font-semibold tabular-nums text-(--vault-ink)">Within 24 Hours</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Liquid Glass Atelier Pill & Lookbook Spec (Span 5 or 4) */}
              <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col justify-end items-end self-end mb-4">
                <div className="border border-(--vault-line) bg-(--vault-panel)/70 backdrop-blur-md p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] max-w-xs text-right">
                  <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-(--vault-accent) font-semibold">Atelier Lookbook 01</span>
                  <h4 className="font-serif text-lg uppercase tracking-wide mt-1 text-(--vault-ink)">SHIBUYA NOIR CUT</h4>
                  <p className="mt-2 text-xs text-(--vault-muted) leading-relaxed font-light">
                    Heavyweight structured silhouette tailored with articulated raglan sleeves and modular pocket geometry.
                  </p>
                  <div className="mt-4 pt-3 border-t border-(--vault-line)/60 flex items-center justify-between font-mono text-[9px] uppercase text-(--vault-muted)">
                    <span>Coordinates</span>
                    <span className="text-(--vault-accent) tabular-nums font-mono">35.6580° N, 139.7016° E</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Understated Details & Looping Scroll Indicator */}
            <div className="mt-10 flex items-center justify-between border-t border-(--vault-line)/50 pt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-(--vault-muted)">
              <span>VAULT VOGUE ARCHIVE RUN 01</span>
              <a
                ref={scrollIndicatorRef}
                href="#featured-collections"
                aria-label="Scroll to featured collections"
                className="inline-flex items-center gap-1.5 text-(--vault-ink) hover:text-(--vault-accent) transition-colors will-change-transform touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
              >
                SCROLL TO DISCOVER{" "}
                <ArrowDownRight
                  size={13}
                  aria-hidden="true"
                  className="text-(--vault-accent)"
                />
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* ATELIER KINETIC MARQUEE                                            */}
        {/* ================================================================== */}
        <div className="border-b border-(--vault-line) bg-(--vault-panel) py-3.5 overflow-hidden select-none">
          <div className="animate-marquee items-center gap-8 font-mono text-[9px] uppercase tracking-[0.24em] text-(--vault-muted)">
            <span className="text-(--vault-ink) font-semibold">AUTUMN / WINTER 2026 ARCHIVE</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>380GSM COMBED PERUVIAN COTTON</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>LASER-BONDED SEAM MEMBRANES</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>NUMBERED EDITIONS 01 / 500</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>PARIS · TOKYO · INDORE ATELIERS</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>COMPLIMENTARY INSURED GLOBAL DISPATCH</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span className="text-(--vault-ink) font-semibold">AUTUMN / WINTER 2026 ARCHIVE</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>380GSM COMBED PERUVIAN COTTON</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>LASER-BONDED SEAM MEMBRANES</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>NUMBERED EDITIONS 01 / 500</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>PARIS · TOKYO · INDORE ATELIERS</span>
            <span className="text-(--vault-accent) font-bold">·</span>
            <span>COMPLIMENTARY INSURED GLOBAL DISPATCH</span>
            <span className="text-(--vault-accent) font-bold">·</span>
          </div>
        </div>

        {/* ================================================================== */}
        {/* 2. FEATURED COLLECTIONS (Asymmetric Bento 2.0 Showcase)            */}
        {/* ================================================================== */}
        <section
          id="featured-collections"
          className="mx-auto max-w-[1440px] border-b border-(--vault-line) px-4 py-20 sm:px-8 sm:py-28 scroll-mt-20 lg:scroll-mt-24"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-(--vault-line) pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-(--vault-accent) font-semibold">
                <Compass size={14} aria-hidden="true" /> Curated Silhouettes · Bento 01
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-balance text-(--vault-ink) sm:text-5xl lg:text-6xl">
                Featured Collections
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-wider text-(--vault-muted) text-pretty">
              Three distinct architectural narratives tailored for contemporary physical life.
            </p>
          </div>

          {/* Asymmetric Bento Grid (Span 7 + Span 5 Stack) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
            {/* Tile 1: URBAN ESSENTIALS (Span 7 Primary Anchor) */}
            <div className="collection-card group relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[580px] overflow-hidden border border-(--vault-line) bg-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 text-white transition-[border-color,box-shadow] duration-500 hover:border-(--vault-accent)">
              <Image
                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=88"
                alt="URBAN ESSENTIALS"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Top Glass Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 border border-white/20 bg-black/40 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-(--vault-accent) backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-(--vault-accent)" />
                  Collection 01 · Primary Archive
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/70">
                  340GSM Bonded
                </span>
              </div>

              {/* Bottom Content Area with Refraction Glass */}
              <div className="relative z-10 mt-auto pt-16">
                <h3 className="font-serif text-3xl font-light uppercase tracking-tight sm:text-5xl">
                  URBAN ESSENTIALS
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg text-pretty font-light">
                  Engineered streetwear for transitional climates. Oversized architectural silhouettes built from bonded technical cottons, laser-welded pocket envelopes, and articulated seams.
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <Link
                    href="/products?collection=urban-essentials"
                    className="inline-flex items-center gap-2 border border-(--vault-accent) bg-(--vault-accent) px-5 py-2.5 font-mono text-[10px] uppercase font-bold tracking-widest text-white transition-[transform,background-color] duration-200 hover:bg-(--vault-accent-hover) active:scale-[0.98] touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Explore Collection{" "}
                    <ArrowUpRight
                      size={13}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                    Numbered Run
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column Stack: AFTER HOURS (Span 5) & ELEVATED BASICS (Span 5) */}
            <div className="flex flex-col gap-8 lg:col-span-5 justify-between">
              {/* Tile 2: AFTER HOURS */}
              <div className="collection-card group relative aspect-[16/9] min-h-[275px] overflow-hidden border border-(--vault-line) bg-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col justify-between p-6 sm:p-7 text-white transition-[border-color,box-shadow] duration-500 hover:border-(--vault-accent)">
                <Image
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
                  alt="AFTER HOURS"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-(--vault-accent) backdrop-blur-md">
                    Collection 02
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                    Nocturnal Edition
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-light uppercase tracking-tight sm:text-3xl">
                    AFTER HOURS
                  </h3>
                  <p className="mt-1 text-xs text-white/75 leading-relaxed max-w-sm text-pretty">
                    Nocturnal tailoring and reflective hardware designed for after-dark contemporary expression.
                  </p>
                  <Link
                    href="/products?collection=after-hours"
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-(--vault-accent) hover:underline touch-manipulation focus-visible:ring-1 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
                  >
                    Explore Collection{" "}
                    <ArrowUpRight
                      size={12}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>

              {/* Tile 3: ELEVATED BASICS */}
              <div className="collection-card group relative aspect-[16/9] min-h-[275px] overflow-hidden border border-(--vault-line) bg-black/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col justify-between p-6 sm:p-7 text-white transition-[border-color,box-shadow] duration-500 hover:border-(--vault-accent)">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                  alt="ELEVATED BASICS"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-(--vault-accent) backdrop-blur-md">
                    Collection 03
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                    620GSM Peruvian Terry
                  </span>
                </div>

                <div className="relative z-10">
                  <h3 className="font-serif text-2xl font-light uppercase tracking-tight sm:text-3xl">
                    ELEVATED BASICS
                  </h3>
                  <p className="mt-1 text-xs text-white/75 leading-relaxed max-w-sm text-pretty">
                    Understated daily wear crafted from combed Peruvian cotton and heavyweight looped terry.
                  </p>
                  <Link
                    href="/products?collection=elevated-basics"
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-(--vault-accent) hover:underline touch-manipulation focus-visible:ring-1 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
                  >
                    Explore Collection{" "}
                    <ArrowUpRight
                      size={12}
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
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
          className="mx-auto max-w-[1440px] border-b border-(--vault-line) px-4 py-20 sm:px-8 sm:py-28 scroll-mt-20 lg:scroll-mt-24"
        >
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-(--vault-line) pb-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-(--vault-accent)">
                  Seasonal Release
                </span>
                {isUsingLiveData ? (
                  <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live API Data ({baseProducts.length})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 border border-(--vault-line) bg-(--vault-panel) px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--vault-accent)" />
                    Curated Archive ({baseProducts.length})
                  </span>
                )}
                {isProductsError && (
                  <button
                    type="button"
                    onClick={() => refetchProducts()}
                    className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-(--vault-accent) hover:underline touch-manipulation focus-visible:ring-1 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
                  >
                    <RotateCcw size={10} aria-hidden="true" /> Retry
                  </button>
                )}
              </div>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-balance text-(--vault-ink) sm:text-5xl">
                New Arrivals
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Category Mode Tabs */}
              <div
                role="tablist"
                aria-label="New arrivals view mode"
                className="flex items-center gap-1 border border-(--vault-line) bg-(--vault-panel) p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "new-arrivals"}
                  onClick={() => setActiveTab("new-arrivals")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none ${
                    activeTab === "new-arrivals"
                      ? "bg-(--vault-accent) text-white font-bold"
                      : "text-(--vault-muted) hover:text-(--vault-ink)"
                  }`}
                >
                  All Releases
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "trending"}
                  onClick={() => setActiveTab("trending")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none ${
                    activeTab === "trending"
                      ? "bg-(--vault-accent) text-white font-bold"
                      : "text-(--vault-muted) hover:text-(--vault-ink)"
                  }`}
                >
                  Trending
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "bestsellers"}
                  onClick={() => setActiveTab("bestsellers")}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none ${
                    activeTab === "bestsellers"
                      ? "bg-(--vault-accent) text-white font-bold"
                      : "text-(--vault-muted) hover:text-(--vault-ink)"
                  }`}
                >
                  Bestsellers
                </button>
              </div>

              <Link
                href="/products"
                className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono uppercase tracking-wider touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
              >
                View Full Catalog <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* 4 columns desktop / 2 columns mobile */}
          {isProductsLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse border border-(--vault-line) bg-(--vault-panel) p-4 flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] w-full bg-(--vault-line)/50 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 w-1/3 bg-(--vault-line)/60" />
                    <div className="h-4 w-3/4 bg-(--vault-line)/70" />
                    <div className="h-3 w-1/4 bg-(--vault-line)/60" />
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
                  isSelector={false}
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
          className="border-b border-(--vault-line) bg-(--vault-panel) px-4 py-20 sm:px-8 sm:py-28 scroll-mt-20 lg:scroll-mt-24"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Photographic Spread with Parallax Container */}
              <div className="editorial-img-container relative aspect-[4/5] overflow-hidden border border-(--vault-line) lg:col-span-7">
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
                  <span className="h-2 w-2 rounded-full bg-(--vault-cobalt)" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--vault-cobalt) font-semibold">
                    Editorial Manifesto
                  </span>
                </div>

                <h2 className="editorial-reveal font-serif text-4xl font-light uppercase leading-[1.05] tracking-tight text-balance sm:text-6xl text-(--vault-ink)">
                  FASHION
                  <br />
                  WITHOUT
                  <br />
                  THE FILTER.
                </h2>

                <p className="editorial-reveal text-sm leading-relaxed text-(--vault-muted) font-light text-pretty">
                  Everyday essentials. Uncompromising expression. We reject
                  digital artificiality and transient fashion cycles. Every
                  VAULT VOGUE piece is designed around tactile truth — authentic
                  heavyweight cottons, laser-bonded membranes, and architectural
                  cuts that command presence in the physical world.
                </p>

                <div className="editorial-reveal border-l-2 border-(--vault-accent) pl-4 py-1">
                  <p className="font-serif italic text-lg text-(--vault-ink)">
                    &ldquo;A silhouette is not an image on a screen; it is
                    geometry experienced in motion.&rdquo;
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-(--vault-muted)">
                    Atelier Creative Direction
                  </p>
                </div>

                <div className="editorial-reveal pt-4 flex items-center gap-4">
                  <Link
                    href="/products"
                    className="btn-primary px-7 py-3.5 font-mono text-[10px] uppercase font-bold tracking-widest touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    DISCOVER THE COLLECTION
                  </Link>
                  <Link
                    href="/products"
                    className="font-mono text-[10px] uppercase tracking-wider text-(--vault-cobalt) hover:underline touch-manipulation focus-visible:ring-1 focus-visible:ring-(--vault-cobalt) focus-visible:outline-none"
                  >
                    Journal Edition →
                  </Link>
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
          className="mx-auto max-w-[1440px] border-b border-(--vault-line) px-4 py-20 sm:px-8 sm:py-28 scroll-mt-20 lg:scroll-mt-24"
        >
          <div className="mb-10 flex items-end justify-between border-b border-(--vault-line) pb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-(--vault-accent)">
                Silhouette Catalog
              </span>
              <h2 className="mt-2 text-3xl font-light uppercase tracking-tight text-balance text-(--vault-ink) sm:text-5xl">
                Trending Categories
              </h2>
            </div>
            {/* Carousel Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCategories("left")}
                aria-label="Scroll categories left"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-(--vault-line) text-(--vault-ink) transition hover:border-(--vault-accent) touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories("right")}
                aria-label="Scroll categories right"
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-(--vault-line) text-(--vault-ink) transition hover:border-(--vault-accent) touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Horizontal scroll container */}
          <div
            ref={categoriesScrollRef}
            className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth overscroll-x-contain pb-4"
          >
            {categoriesList.map((cat) => (
              <Link
                key={cat.title}
                href={cat.href}
                className="group flex-1 relative h-[380px] w-[260px] flex-shrink-0 overflow-hidden border border-(--vault-line) bg-black/10 transition hover:border-(--vault-accent) touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
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
                  <span className="font-mono text-[9px] uppercase tracking-widest text-(--vault-accent) tabular-nums">
                    {cat.count}
                  </span>
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                      {cat.subtitle}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl font-light uppercase tracking-tight text-white group-hover:text-(--vault-accent) transition-colors">
                      {cat.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-(--vault-accent)">
                      Explore Category{" "}
                      <ArrowUpRight
                        size={12}
                        aria-hidden="true"
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
          className="mx-auto max-w-[1440px] border-b border-(--vault-line) px-4 py-20 sm:px-8 sm:py-28 scroll-mt-20 lg:scroll-mt-24"
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-6">
              <span className="philosophy-reveal font-mono text-[10px] uppercase tracking-[0.24em] text-(--vault-accent)">
                Brand Philosophy
              </span>
              <h2 className="philosophy-reveal font-serif text-3xl font-light uppercase leading-tight tracking-tight text-balance sm:text-5xl text-(--vault-ink)">
                LESS NOISE.
                <br />
                <span className="italic text-(--vault-accent)">
                  MORE EXPRESSION.
                </span>
              </h2>
              <p className="philosophy-reveal text-sm leading-relaxed text-(--vault-muted) font-light text-pretty">
                In an era dominated by rapid algorithm-driven fashion and
                disposable garments, VAULT VOGUE takes an architectural stand.
                We distill each silhouette down to its functional and emotional
                core — prioritizing structural integrity, heavyweight natural
                fibers, and intentional cuts over loud logos.
              </p>
              <p className="philosophy-reveal text-sm leading-relaxed text-(--vault-muted) font-light text-pretty">
                Every stitch is considered. Every pocket is placed with
                anatomical purpose. This is clothing built to become an
                extension of your presence.
              </p>
              <div className="philosophy-reveal pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-(--vault-accent) hover:underline touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:outline-none"
                >
                  DISCOVER OUR STORY{" "}
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="text-(--vault-cobalt)"
                  />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden border border-(--vault-line) lg:col-span-6">
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

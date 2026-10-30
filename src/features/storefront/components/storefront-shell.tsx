"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Sun,
  Moon,
  Search,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useStorefront } from "../context/storefront-context";
import { StorefrontCart } from "./storefront-cart";
import { StorefrontWishlist } from "./storefront-wishlist";
import { StorefrontSearchOverlay } from "./storefront-search-overlay";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { getAuthCookie } from "@/lib/auth";

export function StorefrontChrome({
  children,
  overlapHeader = false,
}: {
  children: React.ReactNode;
  overlapHeader?: boolean;
}) {
  const pathname = usePathname();
  const shouldOverlap = overlapHeader || pathname === "/";
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    theme,
    toggleTheme,
    cartCount,
    wishlistCount,
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
  } = useStorefront();

  const headerRef = useRef<HTMLElement>(null);
  const themeIconRef = useRef<HTMLSpanElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const bagBadgeRef = useRef<HTMLSpanElement>(null);
  const prevCartCountRef = useRef(cartCount);

  useEffect(() => {
    setIsAuthed(!!getAuthCookie());
  }, []);

  // Header scroll detection for solid / compact state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Shopping bag badge pop animation when cart quantity changes
  useEffect(() => {
    if (cartCount !== prevCartCountRef.current && bagBadgeRef.current && !isReducedMotion()) {
      gsap.fromTo(
        bagBadgeRef.current,
        { scale: 1.45, rotate: -8 },
        { scale: 1, rotate: 0, duration: 0.35, ease: "back.out(2)" },
      );
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // GSAP Coordinated Header Entrance Animation
  useEffect(() => {
    if (!headerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Logo fades in and moves upward slightly on load
      tl.fromTo(
        ".header-logo",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
      )
        // Navigation links appear sequentially with subtle stagger
        .fromTo(
          ".header-nav-link",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.45 },
          "-=0.3",
        )
        // Icons fade in with small scale transition
        .fromTo(
          ".header-action-icon",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, stagger: 0.05, duration: 0.4 },
          "-=0.25",
        );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // GSAP Mega Menu Animation
  useEffect(() => {
    const el = megaMenuRef.current;
    if (!el || isReducedMotion()) return;

    if (megaMenuOpen) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" },
      );
    }
  }, [megaMenuOpen]);

  // GSAP Mobile Menu Animation
  useEffect(() => {
    const menuEl = mobileMenuRef.current;
    if (!menuEl || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (mobileMenuOpen) {
        gsap.fromTo(
          menuEl,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        );
        const links = menuEl.querySelectorAll(".mobile-nav-link");
        if (links.length) {
          gsap.fromTo(
            links,
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" },
          );
        }
      }
    }, menuEl);

    return () => ctx.revert();
  }, [mobileMenuOpen]);

  // GSAP Theme Switcher Icon Rotation (Rotates only the inner icon 360deg upright, never the button or text)
  const handleToggleTheme = () => {
    if (themeIconRef.current && !isReducedMotion()) {
      gsap.killTweensOf(themeIconRef.current);
      gsap.fromTo(
        themeIconRef.current,
        { rotate: 0, scale: 0.85, transformOrigin: "50% 50%" },
        {
          rotate: 360,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
          onComplete: () => {
            if (themeIconRef.current) {
              gsap.set(themeIconRef.current, { clearProps: "all" });
            }
          },
        },
      );
    }
    toggleTheme();
  };

  return (
    <div className="min-h-screen w-full bg-[var(--vault-canvas)] text-[var(--vault-ink)] transition-colors duration-300">
      {/* Dynamic Header: Overlaps hero banner on large screens; becomes solid and compact when scrolling */}
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "h-16 border-b border-[var(--vault-line)] bg-[var(--vault-canvas)]/95 shadow-md backdrop-blur-md bg-none"
            : shouldOverlap
              ? "h-20 border-b border-[var(--vault-line)] bg-[var(--vault-canvas)]/90 backdrop-blur-md lg:border-transparent lg:bg-transparent lg:bg-gradient-to-b lg:from-[var(--vault-canvas)]/85 lg:via-[var(--vault-canvas)]/35 lg:to-transparent lg:shadow-none lg:backdrop-blur-none"
              : "h-20 border-b border-[var(--vault-line)] bg-[var(--vault-canvas)]/90 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-2 sm:px-8">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-[var(--vault-ink)] hover:text-[var(--vault-accent)] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo with upwards fade entrance */}
          <Link
            href="/"
            className="header-logo flex items-center gap-2 text-left font-serif text-lg sm:text-2xl font-light uppercase sm:tracking-[0.22em] text-[var(--vault-ink)]"
          >
            <span>VAULT VOGUE</span>
            <span className="h-1.5 w-1.5 max-sm:hidden rounded-full bg-[var(--vault-accent)] inline-block" />
          </Link>

          {/* Desktop Navigation Links with sequential reveal */}
          <nav
            aria-label="Store navigation"
            className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--vault-muted)] lg:flex [&>a]:cursor-pointer"
          >
            {/* Collections with Mega Menu Trigger */}
            <div
              className="header-nav-link relative py-5"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex items-center gap-1 transition hover:text-[var(--vault-ink)]"
              >
                Collections <ChevronDown size={12} className={`transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div
                  ref={megaMenuRef}
                  className="absolute left-0 top-[100%] w-[680px] -translate-x-12 border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 shadow-2xl"
                >
                  <div className="grid grid-cols-3 gap-6">
                    {/* Col 1 */}
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vault-accent)] border-b border-[var(--vault-line)] pb-2 mb-3">
                        Curated Collections
                      </p>
                      <ul className="space-y-2 text-[10px] font-mono uppercase tracking-wider text-[var(--vault-ink)]">
                        <li>
                          <Link
                            href="/#featured-collections"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            Urban Essentials
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/#featured-collections"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            Elevated Basics
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/#featured-collections"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            After Hours
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/products"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 text-[var(--vault-cobalt)] hover:underline"
                          >
                            Browse All Pieces →
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Col 2 */}
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vault-accent)] border-b border-[var(--vault-line)] pb-2 mb-3">
                        Silhouettes
                      </p>
                      <ul className="space-y-2 text-[10px] font-mono uppercase tracking-wider text-[var(--vault-ink)]">
                        <li>
                          <Link
                            href="/#trending-categories"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            Oversized Tees
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/#trending-categories"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            Tailored Trousers
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/#trending-categories"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            Outerwear
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/#trending-categories"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            Knitwear
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/#trending-categories"
                            onClick={() => setMegaMenuOpen(false)}
                            className="block py-1 hover:text-[var(--vault-accent)] transition-colors"
                          >
                            Accessories
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Col 3: Editorial preview */}
                    <div className="relative aspect-[3/4] overflow-hidden border border-[var(--vault-line)] bg-black/10">
                      <Image
                        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
                        alt="Editorial preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-4 flex flex-col justify-end text-white">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-[var(--vault-accent)]">
                          Lookbook
                        </span>
                        <p className="font-serif text-sm uppercase leading-tight mt-1">
                          Fashion Without The Filter
                        </p>
                        <Link
                          href="/#editorial-campaign"
                          onClick={() => setMegaMenuOpen(false)}
                          className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-white/90 hover:text-[var(--vault-accent)]"
                        >
                          Explore <ArrowUpRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/men" className="header-nav-link transition hover:text-[var(--vault-ink)]">
              Men
            </Link>
            <Link href="/women" className="header-nav-link transition hover:text-[var(--vault-ink)]">
              Women
            </Link>
            <Link href="/kids" className="header-nav-link transition hover:text-[var(--vault-ink)]">
              Kids
            </Link>
            <Link href="/#new-arrivals" className="header-nav-link transition hover:text-[var(--vault-ink)]">
              New Arrivals
            </Link>
            <Link href="/#editorial-campaign" className="header-nav-link transition hover:text-[var(--vault-ink)]">
              Editorial
            </Link>
          </nav>

          {/* Action Icons Suite */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search catalog"
              className="header-action-icon flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-canvas)]/40 backdrop-blur-md text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
            >
              <Search size={16} />
            </button>

            {/* Account */}
            <Link
              href={isAuthed ? "/account" : "/login"}
              aria-label="Account Profile"
              className="header-action-icon hidden sm:flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-canvas)]/40 backdrop-blur-md text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
            >
              <User size={16} />
            </Link>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => setWishlistOpen(true)}
              aria-label={`Open wishlist, ${wishlistCount} items`}
              className="header-action-icon relative flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-canvas)]/40 backdrop-blur-md text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
            >
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--vault-accent)] font-mono text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label={`Switch to ${theme === "obsidian" ? "Light" : "Dark"} theme`}
              className="header-action-icon flex h-10 items-center gap-2 border border-[var(--vault-line)] bg-[var(--vault-canvas)]/40 backdrop-blur-md px-3 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] cursor-pointer transform-none !rotate-0"
            >
              <span ref={themeIconRef} className="inline-flex items-center justify-center origin-center will-change-transform">
                {theme === "obsidian" ? (
                  <Sun size={15} className="text-[var(--vault-accent)]" />
                ) : (
                  <Moon size={15} className="text-[var(--vault-accent)]" />
                )}
              </span>
              <span className="hidden md:inline select-none">
                {theme === "obsidian" ? "Light" : "Dark"}
              </span>
            </button>

            {/* Shopping Bag Drawer Trigger with Animated Badge */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping bag, ${cartCount} items`}
              className="header-action-icon relative flex h-10 items-center gap-2 border border-[var(--vault-line)] bg-[var(--vault-canvas)]/40 backdrop-blur-md px-3.5 transition hover:border-[var(--vault-accent)]"
            >
              <ShoppingBag size={16} />
              <span className="font-mono text-[10px] uppercase hidden sm:inline">Bag</span>
              <span
                ref={bagBadgeRef}
                className="font-mono text-[10px] font-bold text-[var(--vault-accent)] inline-block"
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="border-t border-[var(--vault-line)] bg-[var(--vault-panel)] px-6 py-6 lg:hidden"
          >
            <nav className="flex flex-col gap-4 font-mono text-xs uppercase tracking-widest text-[var(--vault-ink)]">
              <Link
                href="/#featured-collections"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Collections
              </Link>
              <Link
                href="/men"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Men
              </Link>
              <Link
                href="/women"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Women
              </Link>
              <Link
                href="/kids"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Kids
              </Link>
              <Link
                href="/#new-arrivals"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                New Arrivals
              </Link>
              <Link
                href="/#editorial-campaign"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Editorial
              </Link>
              <div className="my-2 border-t border-[var(--vault-line)]" />
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setWishlistOpen(true);
                }}
                className="mobile-nav-link flex items-center justify-between py-1 text-[var(--vault-muted)] hover:text-[var(--vault-ink)] text-left"
              >
                <span className="flex items-center gap-2">
                  <Heart size={14} /> Wishlist
                </span>
                <span className="font-bold text-[var(--vault-accent)]">{wishlistCount}</span>
              </button>
              <Link
                href={isAuthed ? "/account" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link flex items-center gap-2 py-1 text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
              >
                <User size={14} /> {isAuthed ? "My Account" : "Sign In / Register"}
              </Link>
              <button
                type="button"
                onClick={handleToggleTheme}
                className="mobile-nav-link flex items-center justify-between py-1 text-[var(--vault-muted)] hover:text-[var(--vault-ink)] text-left cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {theme === "obsidian" ? <Sun size={14} className="text-[var(--vault-accent)]" /> : <Moon size={14} className="text-[var(--vault-accent)]" />}
                  Theme
                </span>
                <span className="font-mono text-[10px] uppercase text-[var(--vault-accent)]">
                  {theme === "obsidian" ? "Light" : "Dark"}
                </span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <div className={`flex-1 min-h-[calc(100vh-8rem)] ${shouldOverlap ? "lg:-mt-20" : ""}`}>
        {children}
      </div>

      {/* Structured Closing Footer */}
      <footer className="border-t border-[var(--vault-line)] bg-[var(--vault-canvas)] px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-[1440px]">
          {/* Top Features Strip */}
          <div className="grid grid-cols-2 gap-6 pb-12 border-b border-[var(--vault-line)] sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-[var(--vault-accent)]" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider font-semibold">Worldwide Delivery</p>
                <p className="text-[11px] text-[var(--vault-muted)]">Insured dispatch in 24h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[var(--vault-accent)]" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider font-semibold">Archival Authenticity</p>
                <p className="text-[11px] text-[var(--vault-muted)]">100% genuine garment proof</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-[var(--vault-accent)]" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider font-semibold">Complimentary Returns</p>
                <p className="text-[11px] text-[var(--vault-muted)]">14-day return concierge</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-[var(--vault-accent)]" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider font-semibold">Encrypted Checkout</p>
                <p className="text-[11px] text-[var(--vault-muted)]">Visa, Mastercard, UPI, INR</p>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 border-b border-[var(--vault-line)]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Shop Collections
              </p>
              <ul className="mt-4 space-y-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--vault-muted)]">
                <li>
                  <Link href="/#new-arrivals" className="hover:text-[var(--vault-ink)] transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/men" className="hover:text-[var(--vault-ink)] transition-colors">
                    Men&apos;s Streetwear
                  </Link>
                </li>
                <li>
                  <Link href="/women" className="hover:text-[var(--vault-ink)] transition-colors">
                    Women&apos;s Editorial
                  </Link>
                </li>
                <li>
                  <Link href="/kids" className="hover:text-[var(--vault-ink)] transition-colors">
                    Kids&apos; Junior Archive
                  </Link>
                </li>
                <li>
                  <Link href="/#featured-collections" className="hover:text-[var(--vault-ink)] transition-colors">
                    Urban Essentials
                  </Link>
                </li>
                <li>
                  <Link href="/#featured-collections" className="hover:text-[var(--vault-ink)] transition-colors">
                    After Hours
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Client Support
              </p>
              <ul className="mt-4 space-y-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--vault-muted)]">
                <li>
                  <Link href="/shipping" className="hover:text-[var(--vault-ink)] transition-colors">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-[var(--vault-ink)] transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[var(--vault-ink)] transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="hover:text-[var(--vault-ink)] transition-colors">
                    Sizing Matrix Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-[var(--vault-ink)] transition-colors">
                    Client Care & Help
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-[var(--vault-ink)] transition-colors">
                    Atelier Concierge
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-[var(--vault-ink)] transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Brand Heritage
              </p>
              <ul className="mt-4 space-y-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--vault-muted)]">
                <li>
                  <Link href="/about" className="hover:text-[var(--vault-ink)] transition-colors">
                    About Maison
                  </Link>
                </li>
                <li>
                  <Link href="/#brand-story" className="hover:text-[var(--vault-ink)] transition-colors">
                    Brand Philosophy
                  </Link>
                </li>
                <li>
                  <Link href="/#editorial-campaign" className="hover:text-[var(--vault-ink)] transition-colors">
                    Fashion Without The Filter
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-[var(--vault-ink)] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[var(--vault-ink)] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Flagship Hubs
              </p>
              <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed text-[var(--vault-muted)]">
                Mumbai · Paris · Tokyo · New York
                <br />
                Global dispatches in sustainable unbleached fiber packaging.
              </p>
              <div className="mt-4 flex gap-3 text-xs font-mono uppercase tracking-widest text-[var(--vault-cobalt)]">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:underline">
                  IG
                </a>
                <span>·</span>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:underline">
                  X
                </a>
                <span>·</span>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:underline">
                  TT
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Legal Bar with exact Tagline */}
          <div className="mt-8 flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--vault-muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>VAULT VOGUE® · TIMELESS FASHION. MODERN EXPRESSION. · {new Date().getFullYear()}</span>
            <span>Rose Gold &amp; Midnight Black Editions · All Rights Reserved</span>
          </div>
        </div>
      </footer>

      {/* Centralized Cart Drawer */}
      <StorefrontCart open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Centralized Wishlist Drawer */}
      <StorefrontWishlist open={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* Centralized Search Overlay */}
      <StorefrontSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

export function StorefrontShell({
  children,
  overlapHeader = false,
}: {
  children: React.ReactNode;
  overlapHeader?: boolean;
}) {
  return <StorefrontChrome overlapHeader={overlapHeader}>{children}</StorefrontChrome>;
}

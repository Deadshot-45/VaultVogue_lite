"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Sun, Moon, Search, User, Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useStorefront } from "../context/storefront-context";
import { StorefrontCart } from "./storefront-cart";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { getAuthCookie } from "@/lib/auth";

export function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);

  const { theme, toggleTheme, cartCount } = useStorefront();

  const headerRef = useRef<HTMLElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthed(!!getAuthCookie());
  }, []);

  // GSAP Header Entrance Animation
  useEffect(() => {
    if (!headerRef.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

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

  // GSAP Theme Switcher Icon Rotation
  const handleToggleTheme = () => {
    if (themeBtnRef.current && !isReducedMotion()) {
      gsap.fromTo(
        themeBtnRef.current,
        { rotate: 0, scale: 0.9 },
        { rotate: 180, scale: 1, duration: 0.4, ease: "back.out(1.5)" },
      );
    }
    toggleTheme();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--vault-canvas)] text-[var(--vault-ink)] transition-colors duration-300">
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-[var(--vault-line)] bg-[var(--vault-canvas)]/95 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 sm:hidden text-[var(--vault-ink)] hover:text-[var(--vault-accent)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-sm font-black uppercase tracking-[0.14em] text-[var(--vault-ink)]"
          >
            Vault Vogue<span className="ml-1 text-[var(--vault-accent)]">®</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Store navigation"
            className="hidden items-center gap-7 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--vault-muted)] sm:flex [&>a]:cursor-pointer"
          >
            <Link href="/" className="transition hover:text-[var(--vault-ink)]">
              Collection
            </Link>
            <Link href="/women" className="transition hover:text-[var(--vault-ink)]">
              Women
            </Link>
            <Link href="/men" className="transition hover:text-[var(--vault-ink)]">
              Men
            </Link>
            <Link href="/kids" className="transition hover:text-[var(--vault-ink)]">
              Kids
            </Link>
            <Link href="/sale" className="transition hover:text-[var(--vault-accent)]">
              Sale
            </Link>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search Catalog"
              className="flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
            >
              <Search size={15} />
            </button>

            {/* Account Link */}
            <Link
              href={isAuthed ? "/account" : "/login"}
              aria-label="Account Profile"
              className="hidden sm:flex h-10 w-10 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)]"
            >
              <User size={15} />
            </Link>

            {/* Centralized Theme Toggle */}
            <button
              ref={themeBtnRef}
              type="button"
              onClick={handleToggleTheme}
              aria-label={`Switch to ${theme === "obsidian" ? "Alabaster" : "Obsidian"} theme`}
              className="flex h-10 items-center gap-2 border border-[var(--vault-line)] px-3 font-mono text-[9px] uppercase tracking-wider transition hover:border-[var(--vault-accent)]"
            >
              {theme === "obsidian" ? <Sun size={14} /> : <Moon size={14} />}
              <span className="hidden md:inline">
                {theme === "obsidian" ? "Alabaster" : "Obsidian"}
              </span>
            </button>

            {/* Cart Bag Drawer Toggle */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open archive bag, ${cartCount} items`}
              className="relative flex h-10 items-center gap-2 border border-[var(--vault-line)] px-3 transition hover:border-[var(--vault-accent)]"
            >
              <ShoppingBag size={16} />
              <span className="font-mono text-[10px] uppercase hidden sm:inline">Bag</span>
              <span className="font-mono text-[10px] font-bold text-[var(--vault-accent)]">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* In-Header Search Bar dropdown */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="border-t border-[var(--vault-line)] bg-[var(--vault-panel)] px-4 py-3 sm:px-8"
          >
            <div className="mx-auto flex max-w-[1440px] items-center gap-3">
              <Search size={16} className="text-[var(--vault-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive pieces, materials, silhouettes..."
                autoFocus
                className="flex-1 bg-transparent font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)] focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-accent)] hover:opacity-80"
              >
                Search <ArrowRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="border-t border-[var(--vault-line)] bg-[var(--vault-panel)] px-6 py-6 sm:hidden"
          >
            <nav className="flex flex-col gap-4 font-mono text-xs uppercase tracking-widest text-[var(--vault-ink)]">
              <Link
                href="/#collection"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Collection
              </Link>
              <Link
                href="/women"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Women
              </Link>
              <Link
                href="/men"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Men
              </Link>
              <Link
                href="/kids"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 hover:text-[var(--vault-accent)]"
              >
                Kids
              </Link>
              <Link
                href="/sale"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link py-1 text-[var(--vault-accent)]"
              >
                Sale
              </Link>
              <div className="my-2 border-t border-[var(--vault-line)]" />
              <Link
                href={isAuthed ? "/account" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-link flex items-center gap-2 py-1 text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
              >
                <User size={14} /> {isAuthed ? "My Account" : "Sign In / Register"}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <div className="flex-1 min-h-[calc(100vh-8rem)]">{children}</div>

      {/* Unified Footer */}
      <footer className="border-t border-[var(--vault-line)] bg-[var(--vault-canvas)] px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-2 gap-8 pb-10 sm:grid-cols-4 border-b border-[var(--vault-line)]">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Archive Catalog
              </p>
              <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
                <li>
                  <Link href="/women" className="hover:text-[var(--vault-ink)]">
                    Women
                  </Link>
                </li>
                <li>
                  <Link href="/men" className="hover:text-[var(--vault-ink)]">
                    Men
                  </Link>
                </li>
                <li>
                  <Link href="/kids" className="hover:text-[var(--vault-ink)]">
                    Kids
                  </Link>
                </li>
                <li>
                  <Link href="/sale" className="hover:text-[var(--vault-accent)]">
                    Seasonal Archive
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Client Care
              </p>
              <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
                <li>
                  <Link href="/shipping" className="hover:text-[var(--vault-ink)]">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-[var(--vault-ink)]">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-[var(--vault-ink)]">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-[var(--vault-ink)]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="hover:text-[var(--vault-ink)]">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-[var(--vault-ink)]">
                    Atelier Concierge
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Heritage
              </p>
              <ul className="mt-3 space-y-2 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
                <li>
                  <Link href="/#collection" className="hover:text-[var(--vault-ink)]">
                    Current Edition
                  </Link>
                </li>
                <li>
                  <Link href="/sell" className="hover:text-[var(--vault-accent)]">
                    Partner with Maison
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-[var(--vault-ink)]">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-[var(--vault-ink)]">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--vault-accent)]">
                Dispatch Locations
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed text-[var(--vault-muted)]">
                Indore / Paris / Tokyo
                <br />
                Worldwide insured shipping on all archival garments.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--vault-muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>Vault Vogue Lite · Independent archival fashion · {new Date().getFullYear()}</span>
            <span>All pieces authenticated & variant-keyed</span>
          </div>
        </div>
      </footer>

      {/* Centralized Bag Drawer */}
      <StorefrontCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  return <StorefrontChrome>{children}</StorefrontChrome>;
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "../lib/variant-utils";
import { useStorefront } from "../context/storefront-context";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import type { VariantProduct } from "../types/variant";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function StorefrontWishlist({ open, onClose }: Props) {
  const { wishlist, removeFromWishlist, addToCart } = useStorefront();
  const backdropRef = useRef<HTMLButtonElement>(null);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      }
      if (asideRef.current) {
        gsap.fromTo(asideRef.current, { x: "100%" }, { x: "0%", duration: 0.4, ease: "power3.out" });
        const items = asideRef.current.querySelectorAll("article");
        if (items.length > 0) {
          gsap.fromTo(
            items,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, stagger: 0.05, duration: 0.35, ease: "power2.out", delay: 0.1 },
          );
        }
      }
    });

    return () => ctx.revert();
  }, [open]);

  const handleClose = () => {
    if (isReducedMotion() || !asideRef.current || !backdropRef.current) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(asideRef.current, { x: "100%", duration: 0.25, ease: "power3.in" })
      .to(backdropRef.current, { opacity: 0, duration: 0.2 }, "<0.05");
  };

  const handleMoveToBag = (product: VariantProduct) => {
    const defaultColor = product.colors[0];
    const defaultSize = "M";
    if (defaultColor) {
      addToCart(product, defaultColor, defaultSize);
      removeFromWishlist(product.id);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        ref={backdropRef}
        type="button"
        aria-label="Close wishlist"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full bg-black/65 backdrop-blur-sm"
      />
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishlist-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-[var(--vault-line)] bg-[var(--vault-canvas)] text-[var(--vault-ink)] shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-[var(--vault-line)] px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-muted)]">
              Curated Selection
            </p>
            <h2 id="wishlist-title" className="mt-1 text-2xl font-light">
              Saved Pieces ({wishlist.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="border border-[var(--vault-line)] p-2 transition hover:border-[var(--vault-accent)]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {wishlist.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-accent)]">
                <ShoppingBag size={28} strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-serif text-2xl uppercase tracking-tight text-[var(--vault-ink)]">
                Your Wishlist is Empty
              </h3>
              <p className="mt-2 max-w-xs font-mono text-xs uppercase tracking-wider text-[var(--vault-muted)]">
                Save pieces as you explore the contemporary wardrobe archive.
              </p>
              <Link
                href="/products"
                onClick={handleClose}
                className="btn-primary mt-6 px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold"
              >
                Explore The Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 border border-[var(--vault-line)] bg-[var(--vault-panel)] p-4 transition hover:border-[var(--vault-accent)]"
                >
                  <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden bg-black/5">
                    <Image
                      src={item.colors[0]?.image || ""}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                          {item.code} · {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.id)}
                          aria-label={`Remove ${item.name} from wishlist`}
                          className="text-[var(--vault-muted)] hover:text-[#DC2626]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={handleClose}
                        className="mt-1 font-medium text-sm hover:text-[var(--vault-accent)] line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="font-mono text-xs font-semibold text-[var(--vault-ink)] mt-1">
                        {formatCurrency(item.price, "INR")}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveToBag(item)}
                        className="btn-primary flex-1 py-1.5 px-3 text-[10px] font-mono uppercase tracking-wider"
                      >
                        Add to Bag
                      </button>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={handleClose}
                        className="btn-secondary py-1.5 px-3 text-[10px] font-mono uppercase tracking-wider inline-flex items-center gap-1"
                      >
                        View <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}


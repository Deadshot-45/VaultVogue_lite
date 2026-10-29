"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { formatCurrency } from "../lib/variant-utils";
import { useStorefront } from "../context/storefront-context";
import { isReducedMotion } from "@/lib/animations/gsap-utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function StorefrontCart({ open, onClose }: Props) {
  const { cart, removeFromCart, setCartQuantity } = useStorefront();
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
      }
    });

    return () => ctx.revert();
  }, [open]);

  const handleClose = useCallback(() => {
    if (isReducedMotion()) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ onComplete: onClose });
    if (asideRef.current) {
      tl.to(asideRef.current, { x: "100%", duration: 0.3, ease: "power3.in" });
    }
    if (backdropRef.current) {
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, "<0.1");
    }
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, handleClose]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        ref={backdropRef}
        type="button"
        aria-label="Close bag overlay"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full bg-gold/60 backdrop-blur-sm"
      />
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-[var(--vault-line)] bg-gold text-[var(--vault-ink)] shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-[var(--vault-line)] px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-muted)]">Atelier Dispatch</p>
            <h2 className="mt-1 font-serif text-2xl uppercase tracking-tight">Shopping Bag ({cart.length})</h2>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close bag" className="p-2 transition hover:text-[var(--vault-accent)]">
            <X size={20} />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-panel)] text-[var(--vault-accent)]">
              <ShoppingBag size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl uppercase tracking-tight text-[var(--vault-ink)]">
              Your Bag is Empty
            </h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--vault-muted)] max-w-xs">
              Explore the contemporary archive and add your desired silhouettes.
            </p>
            <Link
              href="/products"
              onClick={handleClose}
              className="btn-primary mt-2 px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold"
            >
              Discover The Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {cart.map((item) => (
                <article key={item.variantKey} className="grid grid-cols-[92px_1fr] gap-4 border-b border-[var(--vault-line)] pb-5">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--vault-panel)]">
                    <Image src={item.image} alt={`${item.productName}, ${item.colorName}`} fill sizes="92px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] text-[var(--vault-muted)]">{item.sku}</p>
                        <h3 className="mt-1 text-sm font-semibold uppercase">{item.productName}</h3>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.variantKey)} aria-label={`Remove ${item.productName}`} className="p-1 text-[var(--vault-muted)] hover:text-[var(--vault-accent)]">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="mt-2 font-mono text-[10px] uppercase text-[var(--vault-muted)]">
                      <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: item.colorHex }} />
                      {item.colorName} · Size {item.size}
                    </p>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div className="flex items-center border border-[var(--vault-line)]">
                        <button type="button" aria-label="Decrease quantity" onClick={() => setCartQuantity(item.variantKey, item.quantity - 1)} className="p-2 hover:text-[var(--vault-accent)]"><Minus size={12} /></button>
                        <span className="min-w-8 text-center font-mono text-xs">{item.quantity}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => setCartQuantity(item.variantKey, item.quantity + 1)} className="p-2 hover:text-[var(--vault-accent)]"><Plus size={12} /></button>
                      </div>
                      <span className="font-mono text-sm font-semibold">{formatCurrency(item.price * item.quantity, "INR")}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="space-y-4 border-t border-[var(--vault-line)] px-6 py-5">
              <div className="flex items-center justify-between font-mono text-xs uppercase">
                <span>Subtotal</span>
                <span className="font-bold text-[var(--vault-ink)]">{formatCurrency(subtotal, "INR")}</span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--vault-muted)]">Your selected color, size and quantity are saved in this browser.</p>
              <div className="flex flex-col gap-2">
                <Link href="/checkout" onClick={handleClose} className="block btn-primary px-5 py-3.5 text-center font-mono text-xs font-bold uppercase tracking-widest">
                  Proceed to Checkout
                </Link>
                <Link href="/products" onClick={handleClose} className="block btn-secondary px-5 py-3 text-center font-mono text-xs uppercase tracking-wider">
                  Continue Exploring
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

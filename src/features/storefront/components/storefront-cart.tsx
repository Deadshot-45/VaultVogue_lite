"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Minus, Plus, X } from "lucide-react";
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

  if (!open) return null;
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        ref={backdropRef}
        type="button"
        aria-label="Close shopping bag"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full bg-black/65 backdrop-blur-sm"
      />
      <aside
        ref={asideRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-[var(--vault-line)] bg-[var(--vault-canvas)] text-[var(--vault-ink)] shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-[var(--vault-line)] px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-muted)]">
              Variant keyed
            </p>
            <h2 id="cart-title" className="mt-1 text-2xl font-light">Archive bag</h2>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close bag" className="p-2 transition hover:text-[var(--vault-accent)]">
            <X size={20} />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--vault-muted)]">Your bag is clear.</p>
            <button type="button" onClick={handleClose} className="border border-[var(--vault-line)] px-5 py-3 font-mono text-xs uppercase tracking-wider transition hover:border-[var(--vault-accent)]">
              Continue exploring
            </button>
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
                      <span className="font-mono text-sm">{formatCurrency(item.price * item.quantity, "USD")}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="space-y-4 border-t border-[var(--vault-line)] px-6 py-5">
              <div className="flex items-center justify-between font-mono text-xs uppercase">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, "USD")}</span>
              </div>
              <p className="text-xs leading-relaxed text-[var(--vault-muted)]">Your selected color, size and quantity are saved in this browser.</p>
              <Link href="/#collection" onClick={handleClose} className="block bg-[var(--vault-accent)] px-5 py-4 text-center font-mono text-xs font-bold uppercase tracking-widest text-[var(--vault-accent-ink)] transition hover:opacity-85">
                Continue exploring
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

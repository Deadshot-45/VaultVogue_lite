"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import { isReducedMotion } from "@/lib/animations/gsap-utils";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "focused" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email address to receive invitations.");
      triggerErrorShake();
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please provide a valid email format (e.g., atelier@vaultvogue.com).");
      triggerErrorShake();
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    window.setTimeout(() => {
      setStatus("success");
      toast.success("Welcome to VAULT VOGUE", {
        description: "Your atelier dispatch invitation has been verified.",
      });
    }, 800);
  };

  const triggerErrorShake = () => {
    if (!inputContainerRef.current || isReducedMotion()) return;
    gsap.fromTo(
      inputContainerRef.current,
      { x: -6 },
      { x: 6, duration: 0.08, repeat: 4, yoyo: true, ease: "power1.inOut" },
    );
  };

  return (
    <section className="border-t border-(--vault-line) bg-(--vault-canvas) text-(--vault-ink) px-4 py-20 sm:px-8 sm:py-28 transition-colors duration-300">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden border border-(--vault-line) bg-(--vault-panel) p-8 sm:p-14 lg:p-16">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-(--vault-accent)/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-(--vault-cobalt)/10 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Narrative */}
            <div className="space-y-4 lg:col-span-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-(--vault-accent) font-semibold">
                Private Archive Access
              </span>
              <h2 className="font-serif text-3xl font-light uppercase tracking-tight text-balance text-(--vault-ink) sm:text-5xl lg:text-6xl">
                BE FIRST TO KNOW.
              </h2>
              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-(--vault-muted) font-light">
                Discover new collections, exclusive releases, and the latest from VAULT VOGUE.
                Curated seasonal styling dispatches delivered directly from our Paris &amp; Tokyo ateliers.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[10px] font-mono uppercase tracking-wider text-(--vault-muted)">
                <ShieldCheck size={14} aria-hidden="true" className="text-(--vault-accent)" />
                <span>Strict privacy · No spam · Instant one-click unsubscription</span>
              </div>
            </div>

            {/* Right Interactive Form with Micro-States */}
            <div className="lg:col-span-5">
              {status === "success" ? (
                <div className="border border-(--vault-line) bg-(--vault-canvas) p-6 space-y-3 transition-[opacity,transform] duration-300">
                  <div className="flex items-center gap-2 text-(--vault-accent)">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span className="font-mono text-xs uppercase font-bold tracking-wider">
                      Membership Verified
                    </span>
                  </div>
                  <p className="text-xs text-(--vault-muted) leading-relaxed">
                    You are now registered for private drops and editorial dispatches. Check your inbox for the welcome edition.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setEmail("");
                    }}
                    className="font-mono text-[10px] uppercase tracking-wider text-(--vault-cobalt) hover:underline pt-1 block touch-manipulation focus-visible:ring-1 focus-visible:ring-(--vault-cobalt) focus-visible:outline-none"
                  >
                    Register another address →
                  </button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-3"
                >
                  <div
                    ref={inputContainerRef}
                    className={`relative flex flex-col sm:flex-row gap-2 border transition-[border-color,box-shadow,background-color] duration-200 ${
                      status === "error"
                        ? "border-[#DC2626] bg-[#DC2626]/5"
                        : status === "focused"
                          ? "border-(--vault-accent) ring-1 ring-(--vault-accent)"
                          : "border-(--vault-line) bg-(--vault-canvas)"
                    }`}
                  >
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address for archive dispatches
                    </label>
                    <div className="relative flex-1 flex items-center">
                      <Mail aria-hidden="true" className="absolute left-4 h-4 w-4 text-(--vault-muted) pointer-events-none" />
                      <input
                        id="newsletter-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        spellCheck={false}
                        inputMode="email"
                        placeholder="ENTER YOUR EMAIL…"
                        value={email}
                        onFocus={() => {
                          if (status !== "error") setStatus("focused");
                        }}
                        onBlur={() => {
                          if (status === "focused") setStatus("idle");
                        }}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") {
                            setStatus("idle");
                            setErrorMessage("");
                          }
                        }}
                        disabled={status === "submitting"}
                        className="h-12 w-full bg-transparent pl-11 pr-4 font-mono text-xs uppercase tracking-wider text-(--vault-ink) placeholder:text-(--vault-muted) focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-primary flex h-12 items-center justify-center gap-2 px-7 font-mono text-[10px] uppercase font-bold tracking-[0.18em] transition-[transform,opacity,background-color] duration-200 disabled:opacity-50 shrink-0 touch-manipulation focus-visible:ring-2 focus-visible:ring-(--vault-accent) focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 size={14} aria-hidden="true" className="animate-spin" /> Verifying…
                        </>
                      ) : (
                        <>
                          Subscribe <ArrowRight size={13} aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Validation Error Message with visual indicator */}
                  {status === "error" && errorMessage && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="flex items-center gap-2 text-[#DC2626] font-mono text-[11px] pt-1"
                    >
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <p className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
                    By subscribing, you agree to receive editorial releases and archive updates.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      toast.success("Welcome to the Atelier", {
        description: "You have been registered for private seasonal drop dispatches.",
      });
      setEmail("");
    }, 700);
  };

  return (
    <section className="border-t border-[var(--vault-line)] bg-[var(--vault-canvas)] text-[var(--vault-ink)] px-4 py-16 sm:px-8 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden border border-[var(--vault-line)] bg-[var(--vault-panel)] p-8 sm:p-14 lg:p-16">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[var(--vault-accent)]/8 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-[var(--vault-line)]/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="space-y-4 lg:col-span-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--vault-accent)]">
                Private Archive Access
              </span>
              <h2 className="text-3xl font-light uppercase tracking-tight text-[var(--vault-ink)] sm:text-5xl lg:text-6xl">
                Join the Atelier
              </h2>
              <p className="max-w-xl text-xs leading-relaxed text-[var(--vault-muted)] sm:text-sm">
                Receive private dispatches on limited-run drops, advance invitations to seasonal
                vault sales, and architectural styling guides curated by our Paris &amp; Tokyo ateliers.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[10px] font-mono uppercase tracking-wider text-[var(--vault-muted)]">
                <ShieldCheck size={14} className="text-[var(--vault-accent)]" />
                <span>Strict privacy · No solicitations · Instant unsubscription</span>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="border border-[var(--vault-line)] bg-[var(--vault-canvas)] p-6 text-center space-y-2">
                  <p className="font-mono text-xs uppercase font-bold text-[var(--vault-accent)]">
                    Access Granted
                  </p>
                  <p className="text-xs text-[var(--vault-muted)]">
                    Your invitation has been dispatched. Watch your inbox before the next archive release.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--vault-muted)]" />
                    <input
                      type="email"
                      placeholder="ENTER EMAIL FOR ACCESS"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] pl-11 pr-4 font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)] focus:border-[var(--vault-accent)] focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex h-12 items-center justify-center gap-2 px-6 font-mono text-[10px] uppercase font-bold tracking-[0.16em] text-[var(--vault-accent-ink)] bg-[var(--vault-accent)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shrink-0"
                  >
                    {loading ? "Registering..." : (
                      <>
                        Subscribe <ArrowRight size={13} />
                      </>
                    )}
                  </button>
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

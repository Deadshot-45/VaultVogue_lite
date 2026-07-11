"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Welcome to the Maison", {
        description: "You have successfully subscribed to the Vault-Vogue newsletter.",
      });
      setEmail("");
    }, 1000);
  };

  return (
    <section className="py-20 bg-[var(--background)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Gradient Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-tr from-[var(--gold)] via-[var(--brand-text)] to-[var(--brand-text)] px-8 py-16 text-center text-white shadow-2xl"
        >
          {/* Subtle light orb */}
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[var(--gold)]/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
              Newsletter Subscription
            </span>

            <h2 className="font-cormorant text-4xl font-light tracking-wide text-white md:text-5xl">
              Join the Maison
            </h2>

            <div className="gold-divider mx-auto" />

            <p className="text-sm text-white/75 leading-relaxed max-w-md mx-auto">
              Subscribe to receive early access to new collections, exclusive private sale invitations, and editorial styling guides.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-full border border-white/20 bg-white/10 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-white/15 backdrop-blur-md transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)] transition-transform hover:scale-[1.02] active:scale-98 disabled:opacity-75 shadow-lg hover:shadow-xl shrink-0"
              >
                {loading ? "Joining..." : "Subscribe"}
              </button>
            </form>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

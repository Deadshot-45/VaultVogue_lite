"use client";

import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Database, Lock } from "lucide-react";

const privacySections = [
  {
    title: "Information We Collect",
    detail:
      "We collect details you provide during account creation, checkout, and client care requests, including contact and delivery information.",
    icon: Database,
  },
  {
    title: "How We Use Your Data",
    detail:
      "Your information is used to process orders, improve client care services, send delivery milestones, and tailor your digital experience.",
    icon: ShieldCheck,
  },
  {
    title: "Data Protection",
    detail:
      "We employ high-grade security protocols and encryption to safeguard your account and transaction details at all times.",
    icon: Lock,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
      {/* Header */}
      <div className="text-center rounded-[2rem] border border-[var(--gold-soft)] bg-card/45 p-8 sm:p-12 shadow-xl backdrop-blur-md">
        <Badge className="rounded-full px-3 py-1 badge-gold">Legal</Badge>

        <h1 className="mt-6 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
          Atelier Privacy Policy
        </h1>
        <div className="gold-divider mx-auto mt-4" />

        <p className="mx-auto mt-6 max-w-xl text-xs text-muted-foreground leading-relaxed">
          An overview of how StyleHub Maison collects, uses, and safeguards your client records.
        </p>
      </div>

      {/* Sections */}
      <div className="mt-12 space-y-4">
        {privacySections.map((section) => (
          <div
            key={section.title}
            className="flex gap-5 rounded-2xl border border-border/40 bg-card/25 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[var(--gold-soft)] hover:shadow-md"
          >
            {/* Icon */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--gold-faint)]">
              <section.icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-sm font-semibold text-[var(--brand-text)]">
                {section.title}
              </h2>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {section.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

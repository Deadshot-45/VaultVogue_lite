"use client";

import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Database, Lock } from "lucide-react";

const privacySections = [
  {
    title: "Information We Collect",
    detail:
      "We collect details you provide during account creation, checkout, and support requests, including contact and delivery information.",
    icon: Database,
  },
  {
    title: "How We Use Your Data",
    detail:
      "Your information is used to process orders, improve shopping experience, share delivery updates, and provide customer support.",
    icon: ShieldCheck,
  },
  {
    title: "Data Protection",
    detail:
      "We use standard security practices to help protect your account and order information during use of the platform.",
    icon: Lock,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="sale-theme mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div
        className="text-center rounded-[2rem] border border-border/50 bg-background/70 p-8 shadow-sm backdrop-blur-sm
                      dark:border-white/10 dark:bg-gradient-to-br dark:from-[#2a0c0f] dark:to-[#140607] dark:shadow-lg"
      >
        <Badge className="rounded-full px-3 py-1 sale-primary">Legal</Badge>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground dark:text-white">
          Privacy Policy
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          A simple overview of how Vault Vogue collects, uses, and protects your
          information.
        </p>
      </div>

      {/* Sections */}
      <div className="mt-10 space-y-4">
        {privacySections.map((section) => (
          <div
            key={section.title}
            className="flex gap-4 rounded-[1.5rem] border border-border/50 bg-background/70 p-6 backdrop-blur-sm transition-all
                       hover:-translate-y-1 hover:shadow-md
                       dark:border-white/10 dark:bg-[#1a0a0c] dark:hover:bg-[#221012] dark:hover:shadow-lg"
          >
            {/* Icon */}
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl 
                            bg-primary/10 text-primary
                            dark:bg-white/5 dark:text-red-400"
            >
              <section.icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-lg font-semibold text-foreground dark:text-white">
                {section.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {section.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  Mail,
  MessageCircle,
  Package,
  RotateCcw,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";

const helpTopics = [
  {
    num: "01",
    title: "Orders & Tracking",
    description:
      "Check your order status, track shipments, or manage recent purchases from your account.",
    icon: Package,
    href: "/orders",
  },
  {
    num: "02",
    title: "Shipping & Delivery",
    description:
      "Delivery timelines, shipping charges, and the regions we currently serve.",
    icon: Truck,
    href: "/shipping",
  },
  {
    num: "03",
    title: "Returns & Exchanges",
    description:
      "Initiate a return, check eligibility windows, or request an exchange on any order.",
    icon: RotateCcw,
    href: "/returns",
  },
  {
    num: "04",
    title: "Refund Policy",
    description:
      "How refunds are processed, expected timelines, and partial refund scenarios.",
    icon: CreditCard,
    href: "/refund-policy",
  },
  {
    num: "05",
    title: "Privacy & Security",
    description:
      "How we protect your data, manage cookies, and handle your privacy preferences.",
    icon: Shield,
    href: "/privacy-policy",
  },
  {
    num: "06",
    title: "FAQs",
    description:
      "Quick answers to the most common questions about shopping on Vault Vogue.",
    icon: HelpCircle,
    href: "/faqs",
  },
];

const contactOptions = [
  {
    title: "Email Us",
    subtitle: "Response within 24 hours",
    value: "support@vaultvogue.com",
    icon: Mail,
  },
  {
    title: "Live Chat",
    subtitle: "Mon – Sat, 10 AM – 7 PM",
    value: "Start a conversation",
    icon: MessageCircle,
  },
];

export default function HelpPage() {
  return (
    <section className="sale-theme mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

      {/* ─── HERO ─── */}
      <div className="mb-20">
        <p
          className="text-sm font-medium tracking-[0.2em] uppercase"
          style={{ color: "var(--gold)" }}
        >
          Help Center
        </p>

        {/* Gold divider — the memorable anchor */}
        <div
          className="mt-4 h-px w-16"
          style={{ background: "var(--gold-soft)" }}
        />

        <h1 className="mt-6 font-cormorant text-5xl font-light leading-[1.1] text-foreground sm:text-6xl lg:text-7xl">
          How can we
          <br />
          <span className="italic" style={{ color: "var(--gold)" }}>
            help you?
          </span>
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          Browse the topics below or reach out directly — our team is here to
          make every Vault&nbsp;Vogue experience effortless.
        </p>
      </div>

      {/* ─── TOPIC GRID ─── */}
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden border border-border/40">
        {helpTopics.map((topic) => (
          <Link key={topic.title} href={topic.href} className="group">
            <div className="relative h-full bg-background/80 backdrop-blur-sm p-7 transition-all duration-300 hover:bg-muted/30">
              {/* Number */}
              <span
                className="block font-cormorant text-3xl font-light italic opacity-30"
                style={{ color: "var(--gold)" }}
              >
                {topic.num}
              </span>

              {/* Icon + Title row */}
              <div className="mt-4 flex items-center gap-3">
                <topic.icon
                  className="h-5 w-5 shrink-0 transition-colors duration-300"
                  style={{ color: "var(--gold)" }}
                />
                <h2 className="text-base font-semibold text-foreground">
                  {topic.title}
                </h2>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {topic.description}
              </p>

              {/* Arrow */}
              <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
            </div>
          </Link>
        ))}
      </div>

      {/* ─── CONTACT STRIP ─── */}
      <div className="mt-20">
        <div
          className="h-px w-full mb-10"
          style={{ background: "var(--gold-faint)" }}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="text-sm font-medium tracking-[0.15em] uppercase"
              style={{ color: "var(--gold)" }}
            >
              Still need help?
            </p>
            <h2 className="mt-2 font-cormorant text-3xl font-light text-foreground sm:text-4xl">
              Get in touch
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {contactOptions.map((opt) => (
            <div
              key={opt.title}
              className="group flex items-start gap-5 rounded-2xl border border-border/40 bg-background/70 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-md hover:border-border/80"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
                style={{ background: "var(--gold-faint)" }}
              >
                <opt.icon
                  className="h-5 w-5"
                  style={{ color: "var(--gold)" }}
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground">
                  {opt.title}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {opt.subtitle}
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "var(--gold)" }}
                >
                  {opt.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

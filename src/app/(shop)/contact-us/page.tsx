"use client";

import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

const contactCards = [
  {
    title: "Email Concierge",
    value: "atelier@stylehub.com",
    icon: Mail,
    description: "Best for order help, returns, and account support. Response within 24 hours.",
  },
  {
    title: "Call Us",
    value: "+1 (555) 902-1920",
    icon: Phone,
    description: "Available Monday to Saturday, 10:00 AM to 7:00 PM.",
  },
  {
    title: "Maison Address",
    value: "Fifth Avenue, New York",
    icon: MapPin,
    description: "For registered business correspondence and brand inquiries.",
  },
];

export default function ContactUsPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)] space-y-8">
      {/* Hero */}
      <div className="text-center rounded-[2rem] border border-[var(--gold-soft)] bg-card/45 p-8 sm:p-14 shadow-xl backdrop-blur-md">
        <Badge className="rounded-full px-3 py-1 badge-gold">Client Care</Badge>

        <h1 className="mt-6 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
          Contact StyleHub Maison
        </h1>
        <div className="gold-divider mx-auto mt-4" />

        <p className="mx-auto mt-6 max-w-xl text-xs text-muted-foreground leading-relaxed">
          Reach out for order updates, product questions, account support, or help with your next creation.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="btn-primary"
            onClick={() => toast.success("Email concierge started", { description: "Our team will respond within 24 hours." })}
          >
            Email Concierge
          </button>
          <button
            className="btn-secondary py-3 px-6 text-xs font-semibold uppercase tracking-wider border-[var(--gold-soft)] text-[var(--gold)]"
            onClick={() => toast.info("Live chat starting…")}
          >
            Live Chat
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {contactCards.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[var(--gold-soft)] hover:shadow-md hover:-translate-y-1"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold-glow)] text-[var(--gold)] border border-[var(--gold-faint)]">
              <item.icon className="h-5 w-5" />
            </div>

            <div className="mt-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--brand-text)]">
                {item.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-[var(--gold)]">{item.value}</p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-md p-8 sm:p-12">
        <div className="mb-10">
          <p className="section-label">Send a Message</p>
          <div className="gold-divider" />
          <h2 className="mt-5 font-cormorant text-3xl font-light text-[var(--brand-text)]">
            Write to Our Atelier
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full h-12 rounded-xl border border-border/40 bg-background/50 px-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[var(--gold-soft)] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full h-12 rounded-xl border border-border/40 bg-background/50 px-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[var(--gold-soft)] transition-all"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Message</label>
            <textarea
              placeholder="How can we help you?"
              rows={5}
              className="w-full rounded-xl border border-border/40 bg-background/50 px-4 py-3 text-xs font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-[var(--gold-soft)] transition-all resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              onClick={() => toast.success("Message sent", {
                description: "Our atelier team will be in touch within 24 hours."
              })}
              className="btn-primary"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

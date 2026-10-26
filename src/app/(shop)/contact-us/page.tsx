"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Clock, Send, Sparkles, MessageSquare, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const CONTACT_CHANNELS = [
  {
    code: "01 // CONCIERGE",
    title: "Email Atelier",
    value: "concierge@vaultvogue.com",
    icon: Mail,
    sla: "REPLY IN < 24 HRS",
    description: "Dedicated assistance for archival acquisition, variant availability, order logistics, and styling consults.",
  },
  {
    code: "02 // TELEMETRY",
    title: "Direct Client Line",
    value: "+1 (555) 902-1920",
    icon: Phone,
    sla: "MON – SAT, 10:00 – 19:00 UTC",
    description: "Real-time client care for urgent delivery rerouting, payment assistance, and authenticated cancellations.",
  },
  {
    code: "03 // GLOBAL ATELIERS",
    title: "Maison Coordinates",
    value: "Indore · Paris · Tokyo · Milan",
    icon: MapPin,
    sla: "BY APPOINTMENT ONLY",
    description: "Flagship archive galleries and bespoke fitting rooms. Coordinate with concierge for private showroom entry.",
  },
];

const INQUIRY_TOPICS = [
  "Archival Order Status",
  "Garment Sizing & Tailoring",
  "Private Atelier Appointment",
  "Return or Alteration Request",
  "Seller / Label Partnership",
  "Press & Editorial",
];

export default function ContactUsPage() {
  const [selectedTopic, setSelectedTopic] = useState(INQUIRY_TOPICS[0]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Inquiry Dispatched", {
        description: `Thank you, ${fullName}. Vault Vogue Concierge has received your request regarding ${selectedTopic}.`,
      });
      setFullName("");
      setEmail("");
      setMessage("");
    }, 700);
  };

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 sm:py-20 text-[var(--vault-ink)]">
      {/* Editorial Header Block */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 backdrop-blur-md mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--vault-line)] pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]">
              Client Care &amp; Private Atelier Inquiries
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            SLA: RESPONSE WITHIN 24 HOURS
          </span>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Form &amp; <span className="font-serif italic text-[var(--gold)]">Dialogue.</span>
              <br />
              Contact Concierge.
            </h1>
            <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-[var(--vault-muted)] font-mono">
              Whether arranging a private salon appointment, requesting garment alterations,
              or tracking worldwide air-freight consignments, the Vault Vogue atelier desk is at your service.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-xs border-t lg:border-t-0 lg:border-l border-[var(--vault-line)] lg:pl-8 pt-4 lg:pt-0">
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">CENTRAL DISPATCH:</span>
              <span className="font-bold">PARIS / INDORE</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">TIMEZONE COVERAGE:</span>
              <span className="text-[var(--gold)] font-bold">24 / 7 TELEMETRY</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--vault-muted)]">ENCRYPTION:</span>
              <span className="font-bold">END-TO-END VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {CONTACT_CHANNELS.map((item) => (
          <article
            key={item.title}
            className="group relative flex flex-col justify-between border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gold-soft)] hover:shadow-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[var(--gold)] font-bold tracking-wider">{item.code}</span>
                <span className="px-2 py-0.5 border border-[var(--vault-line)] text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                  {item.sla}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex h-11 w-11 items-center justify-center border border-[var(--gold-faint)] bg-[var(--gold-glow)] text-[var(--gold)] transition-transform duration-300 group-hover:scale-105">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] font-bold">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-[var(--gold)] tracking-tight">
                    {item.value}
                  </p>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[var(--vault-muted)] pt-2">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--vault-line)] flex items-center justify-between font-mono text-[10px] uppercase text-[var(--vault-muted)]">
              <span>Channel Active</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[var(--gold)]" />
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Contact / Message Form */}
      <div className="border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-12 backdrop-blur-md">
        <div className="mb-8 border-b border-[var(--vault-line)] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] block">
              // SECURE DISPATCH DESK
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)]">
              Transmit an Atelier Request
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)]">
            Every ticket is routed directly to a human curator.
          </p>
        </div>

        {/* Topic Pills */}
        <div className="mb-8 space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)] block">
            Select Inquiry Classification
          </label>
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TOPICS.map((topic) => {
              const active = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? "border-[var(--gold)] bg-[var(--gold)] text-white shadow-sm"
                      : "border-[var(--vault-line)] bg-transparent text-[var(--vault-muted)] hover:text-[var(--vault-ink)] hover:border-[var(--vault-ink)]"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)] block">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Camille Laurent"
              className="w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] px-4 py-3 font-mono text-xs uppercase text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)] focus:border-[var(--gold)] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)] block">
              Client Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="c.laurent@atelier.com"
              className="w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] px-4 py-3 font-mono text-xs uppercase text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)] focus:border-[var(--gold)] focus:outline-none transition-colors"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)] block">
              Inquiry Dossier / Message *
            </label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Detail your request, SKU reference, or required appointment timeframe..."
              className="w-full border border-[var(--vault-line)] bg-[var(--vault-canvas)] p-4 font-mono text-xs uppercase text-[var(--vault-ink)] placeholder:text-[var(--vault-muted)] focus:border-[var(--gold)] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="font-mono text-[10px] text-[var(--vault-muted)] uppercase tracking-wider">
              Protected by Vault Vogue® Archival Client Integrity Protocols
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[var(--gold)] bg-[var(--gold)] text-white px-8 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] font-bold transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Send size={13} />
              {isSubmitting ? "Transmitting..." : "Send Atelier Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

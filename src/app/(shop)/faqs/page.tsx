"use client";

import { useRouter } from "next/navigation";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Most atelier creations are delivered within 3 to 7 business days depending on your region. Express delivery is available for select metropolitan areas.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "You can request a cancellation before the order moves into packed or shipped status. Please reach out to our concierge team promptly.",
  },
  {
    question: "How do I choose the right size?",
    answer:
      "Use the size options shown on each product page and reference the tailoring specifications before checkout. Our client care team can also assist with fittings.",
  },
  {
    question: "Do I need an account to place an order?",
    answer:
      "You can browse freely, but signing in gives you faster checkout, saved client details, and access to your full order history.",
  },
  {
    question: "What materials are used in Maison pieces?",
    answer:
      "Our curated collections feature natural materials including cashmere, silk, fine merino wool, and premium cotton sourced from sustainable ateliers.",
  },
  {
    question: "Is complimentary shipping available?",
    answer:
      "Yes — all orders above $150 qualify for complimentary delivery. Expedited and white-glove delivery options are available at an additional cost.",
  },
];

export default function FaqsPage() {
  const router = useRouter();

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
      {/* Editorial Heading */}
      <div className="mb-16 text-center">
        <p className="section-label inline-block">Support Desk</p>
        <div className="gold-divider mx-auto mt-4" />
        <h1 className="mt-6 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-6xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-muted-foreground">
          Everything you need to know about shopping, shipping, and Maison membership benefits.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-border/40 bg-card/35 backdrop-blur-sm transition-all duration-300 open:border-[var(--gold-soft)] open:bg-card/60 open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-xs font-bold uppercase tracking-wider text-[var(--brand-text)]">
              <span className="max-w-[85%] normal-case text-sm font-medium text-foreground">{faq.question}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-open:rotate-180 group-open:border-[var(--gold-soft)] group-open:bg-[var(--gold-glow)] group-open:text-[var(--gold)]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                >
                  <path
                    d="M1 4.5L6 9.5L11 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </summary>

            <div className="px-6 pb-8">
              <div className="gold-divider mb-4 w-8" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* Contact Strip */}
      <div className="mt-20 flex flex-col items-center gap-6 rounded-3xl border border-[var(--gold-soft)] bg-card/40 backdrop-blur-md p-10 text-center shadow-lg">
        <span className="section-label">Still Have Questions?</span>
        <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)]">
          Our concierge team is here for you.
        </h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          Available Monday through Friday. We typically respond within 24 hours.
        </p>
        <button
          className="btn-primary"
          onClick={() => router.push("/contact-us")}
        >
          Contact Concierge
        </button>
      </div>
    </section>
  );
}
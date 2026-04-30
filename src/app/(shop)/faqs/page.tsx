"use client";

import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Most orders are delivered within 3 to 7 business days depending on your location.",
  },
  {
    question: "Can I cancel my order after placing it?",
    answer:
      "You can request a cancellation before the order moves into packed or shipped status.",
  },
  {
    question: "How do I choose the right size?",
    answer:
      "Use the size options shown on each product card and refer to the product details before checkout.",
  },
  {
    question: "Do I need an account to place an order?",
    answer:
      "You can browse freely, but signing in gives you faster checkout, saved details, and order tracking.",
  },
];

export default function FaqsPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Editorial Heading */}
      <div className="mb-16 text-center">
        <p className="section-label inline-block">Support Desk</p>
        <div className="gold-divider mx-auto mt-4" />
        <h1 className="mt-6 font-cormorant text-4xl font-light text-foreground lg:text-6xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
          Everything you need to know about shopping, shipping, and members-only benefits at Vault Vogue.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-6">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-border/40 bg-background/50 transition-all duration-300 open:bg-muted/10 open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-base font-medium text-foreground sm:text-lg">
              <span className="max-w-[85%]">{faq.question}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 transition-transform duration-300 group-open:rotate-180 group-open:bg-foreground group-open:text-background">
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
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* Contact Strip */}
      <div className="mt-20 flex flex-col items-center gap-6 rounded-3xl border border-border/40 bg-muted/20 p-10 text-center">
        <h3 className="font-cormorant text-2xl font-light">Still have questions?</h3>
        <p className="text-sm text-muted-foreground">Our concierge team is available Monday through Friday to assist you.</p>
        <button
          className="rounded-full px-8 py-2.5 text-sm font-medium text-white transition-transform active:scale-95"
          style={{ background: "var(--gold)" }}
        >
          Contact Support
        </button>
      </div>
    </section>
  );
}
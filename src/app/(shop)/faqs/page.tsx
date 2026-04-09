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
    <section className="sale-theme mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center">
        <Badge className="rounded-full px-3 py-1 sale-primary">
          Help Center
        </Badge>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Quick answers to the most common questions about shopping on Vault
          Vogue.
        </p>
      </div>

      {/* FAQ */}
      <div className="mt-10 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-[1.5rem] border border-border/50 bg-background/70 backdrop-blur-sm p-5 transition-all open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-foreground">
              {faq.question}

              {/* Icon */}
              <span className="ml-4 transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
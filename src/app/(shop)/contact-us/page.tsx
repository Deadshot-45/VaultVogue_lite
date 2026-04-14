"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

const contactCards = [
  {
    title: "Email Support",
    value: "support@vaultvogue.com",
    icon: Mail,
    description: "Best for order help, returns, and account support.",
  },
  {
    title: "Call Us",
    value: "+91 98765 43210",
    icon: Phone,
    description: "Available Monday to Saturday, 10:00 AM to 7:00 PM.",
  },
  {
    title: "Studio Address",
    value: "MG Road, Bengaluru",
    icon: MapPin,
    description: "For registered business correspondence and brand inquiries.",
  },
];

export default function ContactUsPage() {
  return (
    <section className="sale-theme mx-auto w-full max-w-6xl px-4 py-12 space-y-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="rounded-[2rem] border border-white/10 bg-background dark:bg-gradient-to-br from-[#2a0c0f] to-[#140607] p-8 shadow-lg">
        {" "}
        <Badge className="rounded-full px-3 py-1 sale-primary">Support</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Contact Vault Vogue
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Reach out for order updates, product questions, account support, or
          help with your next purchase.
        </p>
        <Button className="mt-6 rounded-full bg-red-500 hover:bg-red-600 text-white">
          Email Support
        </Button>
      </div>

      {/* Cards */}
      <div className="rounded-[1.5rem] space-y-4 border border-white/10 bg-muted/70 dark:bg-[#1a0a0c] p-6 transition-all">
        {contactCards.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.5rem] border border-border/50 bg-background p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-red-400">
              {" "}
              <item.icon className="h-5 w-5" />
            </div>

            <div className="mt-4">
              <h2 className="text-lg font-semibold text-foreground">
                {item.title}
              </h2>

              <p className="mt-2 font-medium text-foreground">{item.value}</p>

              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

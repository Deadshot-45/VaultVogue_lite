"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
};

export function AuthShell({
  title,
  description,
  children,
  footerText,
  footerLink,
  footerLinkLabel,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 h-96 w-96 bg-blue/20 blur-3xl rounded-full"></div>
      <div className="absolute top-1/2 -right-40 h-96 w-96 bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative mx-auto flex max-lg:min-h-[95dvh]  min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-stretch">
        
        {/* LEFT PANEL */}
        <div className="relative hidden overflow-hidden rounded-[2rem] border bg-gradient-to-br from-foreground to-foreground/80 px-8 py-8 text-background shadow-2xl lg:sticky lg:top-10 lg:flex lg:h-[calc(100vh-5rem)] lg:w-[52%] lg:flex-col lg:justify-between">
          
          {/* subtle overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_40%)]" />

          <div className="relative z-10 max-w-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-background/60">
              Vault Vogue
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-background/75 sm:text-base">
              {description}
            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: "24/7", desc: "Shop anytime, anywhere." },
              { title: "Fast", desc: "Smooth checkout flow." },
              { title: "Curated", desc: "Premium collections." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-4 hover:bg-white/20 transition"
              >
                <p className="text-2xl font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-background/70">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center max-sm:min-h-[85dvh] max-lg:h-full lg:h-[calc(100vh-5rem)] lg:w-[48%] lg:overflow-y-auto lg:pr-1 no-scrollbar">
          <Card className="w-full max-w-md rounded-[2rem] border bg-background/80 p-6 max-lgshadow-2xl backdrop-blur-xl sm:p-8 max-lg:border-none max-lg:rounded-none max-lg:bg-transparent max-lg:shadow-none">
            
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Welcome
                </p>
                <h2 className="mt-2 text-2xl font-bold">{title}</h2>
              </div>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Home</Link>
              </Button>
            </div>

            {/* Form */}
            {children}

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Footer */}
            <p className="text-sm text-muted-foreground">
              {footerText}{" "}
              <Link href={footerLink} className="font-medium text-foreground">
                {footerLinkLabel}
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

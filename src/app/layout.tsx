import "@/index.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Vault Vogue",
  description: "Modern E-commerce Experience",
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      data-vault-theme="obsidian"
      className={`${cormorant.variable} ${montserrat.variable} vault-storefront dark`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="vault-storefront antialiased selection:bg-[var(--vault-accent)] selection:text-[var(--vault-accent-ink)]">
        <Analytics />
        {/* <SpeedInsights /> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

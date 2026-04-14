import "@/index.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Vault Vogue Lite",
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
      className={`${cormorant.variable} ${montserrat.variable}`}
    >
      <body className="sale-theme">
        <Analytics />
        {/* <SpeedInsights /> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Vault Vogue",
  description:
    "Sign in or create your Vault Vogue account for faster checkout, saved favorites, and order tracking.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--gold) 1px, transparent 1px), linear-gradient(to bottom, var(--gold) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Warm top-left glow */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full blur-[120px] opacity-20"
        style={{ background: "var(--gold)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

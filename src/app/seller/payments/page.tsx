"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Building,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  History,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface PayoutLog {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "completed" | "processing" | "failed";
}

const DEFAULT_PAYOUTS: PayoutLog[] = [
  { id: "PAY-90412", date: "2026-07-01", amount: 185000, method: "Stripe Connect", status: "completed" },
  { id: "PAY-90398", date: "2026-06-15", amount: 320000, method: "Direct Bank Transfer", status: "completed" },
  { id: "PAY-90382", date: "2026-06-01", amount: 98000, method: "Stripe Connect", status: "completed" },
  { id: "PAY-90367", date: "2026-05-15", amount: 145000, method: "PayPal Account", status: "completed" },
];

export default function SellerPaymentsPage() {
  const [mounted, setMounted] = useState(false);
  
  // Payment Options States
  const [bankDetails, setBankDetails] = useState({
    accountName: "StyleHub Atelier Private Limited",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200049281729",
    ifscCode: "HDFC0000240",
    payoutFrequency: "monthly",
  });

  const [stripeEmail, setStripeEmail] = useState("atelier@stylehub.com");
  const [stripeConnected, setStripeConnected] = useState(true);

  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalActive, setPaypalActive] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedSettings = localStorage.getItem("vault_vogue_seller_payment_settings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.bankDetails) setBankDetails(parsed.bankDetails);
      if (parsed.stripeEmail) setStripeEmail(parsed.stripeEmail);
      if (parsed.stripeConnected !== undefined) setStripeConnected(parsed.stripeConnected);
      if (parsed.paypalEmail) setPaypalEmail(parsed.paypalEmail);
      if (parsed.paypalActive !== undefined) setPaypalActive(parsed.paypalActive);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      bankDetails,
      stripeEmail,
      stripeConnected,
      paypalEmail,
      paypalActive,
    };
    localStorage.setItem("vault_vogue_seller_payment_settings", JSON.stringify(settings));
    toast.success("Payment preferences saved successfully");
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* Configuration column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Method 1: Stripe Connect */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <CreditCard className="h-4 w-4 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-[var(--brand-text)]">
                  Stripe Instant Payouts
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Connect your Stripe Account to receive funds instantly upon order dispatch.
                </p>
              </div>
            </div>
            {/* Connection Toggle */}
            <button
              onClick={() => setStripeConnected(!stripeConnected)}
              className={`py-1 px-3.5 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                stripeConnected
                  ? "text-green-500 bg-green-500/5 border border-green-500/20"
                  : "text-neutral-500 bg-neutral-500/5 border border-neutral-500/20"
              }`}
            >
              {stripeConnected ? "Connected" : "Disconnected"}
            </button>
          </div>

          {stripeConnected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-3 pt-2"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Stripe Connected Email
                </label>
                <input
                  type="email"
                  value={stripeEmail}
                  onChange={(e) => setStripeEmail(e.target.value)}
                  className="input-field py-2 text-xs"
                  placeholder="stripe-account@domain.com"
                />
              </div>
              <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-indigo-500" />
                Payments processed under this connection will incur standard Stripe merchant fees (2.9% + ₹20).
              </p>
            </motion.div>
          )}
        </div>

        {/* Method 2: Direct Bank Transfer */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b border-border/10 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--gold-faint)] border border-[var(--gold-soft)]">
              <Building className="h-4 w-4 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-[var(--brand-text)]">
                Direct Bank Transfer (NEFT/RTGS)
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Set up direct deposits for periodic platform settlements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Account Holder Name
              </label>
              <input
                type="text"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails((p) => ({ ...p, accountName: e.target.value }))}
                className="input-field py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Bank Name
              </label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails((p) => ({ ...p, bankName: e.target.value }))}
                className="input-field py-2 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Account Number
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails((p) => ({ ...p, accountNumber: e.target.value }))}
                className="input-field py-2 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                IFSC Code
              </label>
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails((p) => ({ ...p, ifscCode: e.target.value.toUpperCase() }))}
                className="input-field py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Payout Frequency
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="radio"
                  name="payoutFrequency"
                  value="weekly"
                  checked={bankDetails.payoutFrequency === "weekly"}
                  onChange={() => setBankDetails((p) => ({ ...p, payoutFrequency: "weekly" }))}
                  className="accent-[var(--gold)]"
                />
                Weekly (Every Wednesday)
              </label>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="radio"
                  name="payoutFrequency"
                  value="monthly"
                  checked={bankDetails.payoutFrequency === "monthly"}
                  onChange={() => setBankDetails((p) => ({ ...p, payoutFrequency: "monthly" }))}
                  className="accent-[var(--gold)]"
                />
                Monthly (1st of each month)
              </label>
            </div>
          </div>
        </div>

        {/* Method 3: PayPal Business */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="text-[11px] font-bold text-blue-500 font-mono">PP</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-[var(--brand-text)]">
                  PayPal Business Checkout
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Accept PayPal and credit card payments directly into your balance.
                </p>
              </div>
            </div>
            {/* Activation Switch */}
            <button
              onClick={() => setPaypalActive(!paypalActive)}
              className={`py-1 px-3.5 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                paypalActive
                  ? "text-green-500 bg-green-500/5 border border-green-500/20"
                  : "text-neutral-500 bg-neutral-500/5 border border-neutral-500/20"
              }`}
            >
              {paypalActive ? "Active" : "Inactive"}
            </button>
          </div>

          {paypalActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-3 pt-2"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  PayPal Merchant Email
                </label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="input-field py-2 text-xs"
                  placeholder="paypal-merchant@domain.com"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Save Preferences Trigger */}
        <div className="flex justify-end pt-2">
          <button onClick={saveSettings} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1.5">
            <Save className="h-4 w-4" />
            Save Payout Preferences
          </button>
        </div>
      </div>

      {/* Payout Logs History column */}
      <div className="space-y-6">
        <div className="card flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2 border-b border-border/10 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--gold-faint)] border border-[var(--gold-soft)]">
                <History className="h-4 w-4" style={{ color: "var(--gold)" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-[var(--brand-text)]">
                  Payouts Ledger
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Log of past platform-to-seller clearances.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4 overflow-y-auto no-scrollbar max-h-[480px]">
              {DEFAULT_PAYOUTS.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-border/20 bg-background/20 space-y-2 hover:border-[var(--gold-faint)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[var(--gold)]">
                      {log.id}
                    </span>
                    <span className="text-[10px] text-green-500 font-semibold bg-green-500/5 px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Paid
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-medium text-[var(--brand-text)]">₹{log.amount.toLocaleString("en-IN")}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Cleared via {log.method}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {new Date(log.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-6 border-t border-[var(--gold-faint)] text-center">
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-[var(--gold)]" />
              Payout queries? Contact our Boutique Support.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

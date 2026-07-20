"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Building,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { sellerService } from "@/lib/services/sellerService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Validation Schemas ---
const step1Schema = z.object({
  businessName: z.string().min(2, "Business name required"),
  ownerName: z.string().min(2, "Owner name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid GSTIN format (e.g. 27AAAAA1111A1Z1)",
    ),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

const step2Schema = z.object({
  bankName: z.string().min(2, "Bank name required"),
  accountHolder: z.string().min(2, "Account holder name required"),
  accountNumber: z.string().min(8, "Valid account number required"),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code (e.g., HDFC0000240)"),
  accountType: z.enum(["savings", "current"]),
});

const CATEGORIES = [
  "Handbags",
  "Apparel",
  "Accessories",
  "Jewellery",
  "Footwear",
  "Fragrances",
];

export default function PublicSellerOnboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [form, setForm] = useState({
    businessInfo: {
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      category: CATEGORIES[0],
      description: "",
      website: "",
      gstNumber: "",
    },
    bankDetails: {
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "savings" as "savings" | "current",
    },
    agreedToTerms: false,
  });

  const [errors1, setErrors1] = useState<Record<string, string>>({});
  const [errors2, setErrors2] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    // Autofill logged in user details if available
    if (user) {
      setForm((prev) => ({
        ...prev,
        businessInfo: {
          ...prev.businessInfo,
          ownerName: user.fullName || "",
          email: user.email || "",
        },
      }));
    }
  }, [user]);

  if (!mounted) return null;

  const handleTextChange =
    (section: "businessInfo" | "bankDetails", field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const val = e.target.value;
      setForm((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: val,
        },
      }));
      // Clear validation error when typing
      if (section === "businessInfo")
        setErrors1((p) => ({ ...p, [field]: "" }));
      else setErrors2((p) => ({ ...p, [field]: "" }));
    };

  const handleGoStep = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const handleNext = () => {
    if (step === 1) {
      const res = step1Schema.safeParse(form.businessInfo);
      if (!res.success) {
        const errs: Record<string, string> = {};
        res.error.issues.forEach((i) => {
          if (i.path[0]) errs[i.path[0] as string] = i.message;
        });
        setErrors1(errs);
        toast.error("Please correct the details in Step 1");
        return;
      }
      setErrors1({});
      handleGoStep(2);
    } else if (step === 2) {
      const res = step2Schema.safeParse(form.bankDetails);
      if (!res.success) {
        const errs: Record<string, string> = {};
        res.error.issues.forEach((i) => {
          if (i.path[0]) errs[i.path[0] as string] = i.message;
        });
        setErrors2(errs);
        toast.error("Please correct the details in Step 2");
        return;
      }
      setErrors2({});
      handleGoStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agreedToTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Try to register with backend API
      await sellerService.onboard({
        businessName: form.businessInfo.businessName,
        ownerName: form.businessInfo.ownerName,
        email: form.businessInfo.email,
        phone: form.businessInfo.phone,
        category: form.businessInfo.category,
        description: form.businessInfo.description,
        website: form.businessInfo.website || undefined,
        gstNumber: form.businessInfo.gstNumber,
        bankDetails: {
          bankName: form.bankDetails.bankName,
          accountHolder: form.bankDetails.accountHolder,
          accountNumber: form.bankDetails.accountNumber,
          ifscCode: form.bankDetails.ifscCode,
          accountType: form.bankDetails.accountType,
        },
        ownerUserId: user?.id,
      });

      toast.success("Onboarding application sent to backend!");
    } catch (apiErr) {
      console.warn(
        "Backend API onboarding failed, saving to localStorage as fallback:",
        apiErr,
      );

      // 2. Fallback to LocalStorage
      let localSellers = localStorage.getItem("vault_vogue_admin_sellers");
      let sellersList = localSellers
        ? JSON.parse(localSellers)
        : [
            {
              id: "SEL-001",
              businessName: "Luxe Collections Pvt Ltd",
              ownerName: "Rohan Mehta",
              email: "rohan@luxecollections.com",
              category: "Handbags",
              joinedAt: "2024-02-20",
              status: "approved",
              revenue: 480000,
              products: 14,
            },
            {
              id: "SEL-002",
              businessName: "Artisan Atelier",
              ownerName: "Meera Iyer",
              email: "meera@artisanatelier.in",
              category: "Jewellery",
              joinedAt: "2024-04-01",
              status: "approved",
              revenue: 210000,
              products: 8,
            },
            {
              id: "SEL-003",
              businessName: "Heritage Craft Studio",
              ownerName: "Suresh Pillai",
              email: "suresh@heritagecraft.in",
              category: "Accessories",
              joinedAt: "2024-05-15",
              status: "pending",
              revenue: 0,
              products: 0,
            },
            {
              id: "SEL-004",
              businessName: "Couture House Mumbai",
              ownerName: "Divya Reddy",
              email: "divya@couturehouse.com",
              category: "Apparel",
              joinedAt: "2024-06-22",
              status: "approved",
              revenue: 920000,
              products: 32,
            },
            {
              id: "SEL-005",
              businessName: "The Leather Workshop",
              ownerName: "Kabir Das",
              email: "kabir@leatherworkshop.in",
              category: "Footwear",
              joinedAt: "2024-07-08",
              status: "rejected",
              revenue: 0,
              products: 0,
            },
            {
              id: "SEL-006",
              businessName: "Silk Route Emporium",
              ownerName: "Nandita Bose",
              email: "nandita@silkroute.in",
              category: "Accessories",
              joinedAt: "2024-08-14",
              status: "approved",
              revenue: 156000,
              products: 6,
            },
          ];

      const newSellerId = `SEL-0${Math.floor(10 + Math.random() * 90)}`;
      const newSellerRow = {
        id: newSellerId,
        businessName: form.businessInfo.businessName,
        ownerName: form.businessInfo.ownerName,
        email: form.businessInfo.email,
        category: form.businessInfo.category,
        joinedAt: new Date().toISOString().split("T")[0],
        status: "pending" as const,
        revenue: 0,
        products: 0,
        gstNumber: form.businessInfo.gstNumber,
        website: form.businessInfo.website,
        description: form.businessInfo.description,
        bankDetails: {
          bankName: form.bankDetails.bankName,
          accountHolder: form.bankDetails.accountHolder,
          accountNumber: form.bankDetails.accountNumber,
          ifscCode: form.bankDetails.ifscCode,
          accountType: form.bankDetails.accountType,
        },
      };

      sellersList = [newSellerRow, ...sellersList];
      localStorage.setItem(
        "vault_vogue_admin_sellers",
        JSON.stringify(sellersList),
      );
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      toast.success(
        "Onboarding request sent! Application status: PENDING REVIEW",
      );
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center p-8 md:p-12 flex flex-col items-center space-y-6"
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border shadow-sm"
            style={{
              background: "var(--gold-faint)",
              borderColor: "var(--gold-soft)",
            }}
          >
            <Clock
              className="h-7 w-7 animate-pulse"
              style={{ color: "var(--gold)" }}
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-cormorant text-3xl font-light text-[var(--brand-text)]">
              Application Under Curation Review
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Thank you for applying to Vault Vogue. Your boutique profile is
              currently pending validation by our curation officers.
            </p>
          </div>

          <div className="w-full max-w-sm rounded-xl p-4 border border-[var(--gold-faint)] bg-[var(--gold-glow)] text-left text-xs space-y-2 text-muted-foreground">
            <p className="font-semibold text-[var(--brand-text)] flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[var(--gold)]" />
              What happens next?
            </p>
            <p>
              1. Curation team checks brand eligibility and GST credentials.
            </p>
            <p>
              2. Once verified, account status will be changed to{" "}
              <strong>Approved</strong>.
            </p>
            <p>
              3. You can then log into your <strong>Seller Atelier</strong> to
              manage inventory and list items.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-semibold"
          >
            Return to Boutique
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      {/* Intro Header */}
      <div className="text-center mb-8 space-y-2">
        <h2 className="font-cormorant text-4xl font-light text-[var(--brand-text)]">
          Partner with Vault Vogue
        </h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Expand your luxury brand reach. Onboard your label and start listing
          items on the boutique floor.
        </p>
      </div>

      {/* Stepper Steps Header */}
      <div className="flex items-center justify-center gap-2 mb-10 text-xs">
        <button
          onClick={() => step > 1 && handleGoStep(1)}
          className={`flex items-center gap-1.5 font-semibold transition-all ${
            step >= 1 ? "text-[var(--gold)]" : "text-muted-foreground"
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px] border-[var(--gold)]">
            1
          </span>
          Business Details
        </button>
        <div className="w-8 border-t border-[var(--gold-faint)]" />
        <button
          onClick={() => step > 2 && handleGoStep(2)}
          className={`flex items-center gap-1.5 font-semibold transition-all ${
            step >= 2 ? "text-[var(--gold)]" : "text-muted-foreground"
          }`}
          disabled={step < 2}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px] border-border">
            2
          </span>
          Payout Bank
        </button>
        <div className="w-8 border-t border-[var(--gold-faint)]" />
        <span
          className={`flex items-center gap-1.5 font-semibold transition-all ${
            step === 3 ? "text-[var(--gold)]" : "text-muted-foreground"
          }`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px] border-border">
            3
          </span>
          Review Apply
        </span>
      </div>

      {/* Main Form container */}
      <div className="card overflow-hidden min-h-[380px] flex flex-col justify-between p-6 md:p-8">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex-1"
          >
            {/* STEP 1: Business Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-border/10 pb-2">
                  <Building className="h-4 w-4 text-[var(--gold)]" />
                  <h3 className="font-cormorant text-lg font-light text-[var(--brand-text)]">
                    Atelier & Brand Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Business / Label Name
                    </label>
                    <input
                      type="text"
                      value={form.businessInfo.businessName}
                      onChange={handleTextChange(
                        "businessInfo",
                        "businessName",
                      )}
                      className="input-field py-2 text-xs"
                      placeholder="e.g. Maison de Bijoux"
                    />
                    {errors1.businessName && (
                      <p className="text-[10px] text-red-500">
                        {errors1.businessName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Owner Full Name
                    </label>
                    <input
                      type="text"
                      value={form.businessInfo.ownerName}
                      onChange={handleTextChange("businessInfo", "ownerName")}
                      className="input-field py-2 text-xs"
                      placeholder="e.g. Jean Dupont"
                    />
                    {errors1.ownerName && (
                      <p className="text-[10px] text-red-500">
                        {errors1.ownerName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={form.businessInfo.email}
                      onChange={handleTextChange("businessInfo", "email")}
                      className="input-field py-2 text-xs"
                      placeholder="atelier@label.com"
                    />
                    {errors1.email && (
                      <p className="text-[10px] text-red-500">
                        {errors1.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.businessInfo.phone}
                      onChange={handleTextChange("businessInfo", "phone")}
                      className="input-field py-2 text-xs"
                      placeholder="e.g. 9876543210"
                    />
                    {errors1.phone && (
                      <p className="text-[10px] text-red-500">
                        {errors1.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Brand Category
                    </label>
                    <Select
                      value={form.businessInfo.category}
                      onValueChange={(val) => {
                        setForm((prev) => ({
                          ...prev,
                          businessInfo: { ...prev.businessInfo, category: val },
                        }));
                        setErrors1((p) => ({ ...p, category: "" }));
                      }}
                    >
                      <SelectTrigger className="input-field py-2 text-xs h-auto bg-transparent">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      GSTIN Registration Number
                    </label>
                    <input
                      type="text"
                      value={form.businessInfo.gstNumber}
                      onChange={handleTextChange("businessInfo", "gstNumber")}
                      className="input-field py-2 text-xs font-mono uppercase"
                      placeholder="e.g. 27AAAAA1111A1Z1"
                    />
                    {errors1.gstNumber && (
                      <p className="text-[10px] text-red-500">
                        {errors1.gstNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Atelier Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={form.businessInfo.website}
                    onChange={handleTextChange("businessInfo", "website")}
                    className="input-field py-2 text-xs"
                    placeholder="https://www.maisondebijoux.com"
                  />
                  {errors1.website && (
                    <p className="text-[10px] text-red-500">
                      {errors1.website}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    About the Atelier / Brand Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.businessInfo.description}
                    onChange={handleTextChange("businessInfo", "description")}
                    className="input-field py-2 text-xs"
                    placeholder="Briefly describe your craftsmanship process, materials, or brand heritage (min 20 characters)..."
                  />
                  {errors1.description && (
                    <p className="text-[10px] text-red-500">
                      {errors1.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Bank Payout details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-border/10 pb-2">
                  <CreditCard className="h-4 w-4 text-[var(--gold)]" />
                  <h3 className="font-cormorant text-lg font-light text-[var(--brand-text)]">
                    Payout Bank Account Details
                  </h3>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={form.bankDetails.accountHolder}
                    onChange={handleTextChange("bankDetails", "accountHolder")}
                    className="input-field py-2 text-xs"
                    placeholder="Exact name as in passbook"
                  />
                  {errors2.accountHolder && (
                    <p className="text-[10px] text-red-500">
                      {errors2.accountHolder}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={form.bankDetails.bankName}
                      onChange={handleTextChange("bankDetails", "bankName")}
                      className="input-field py-2 text-xs"
                      placeholder="e.g. HDFC Bank"
                    />
                    {errors2.bankName && (
                      <p className="text-[10px] text-red-500">
                        {errors2.bankName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Account Type
                    </label>
                    <Select
                      value={form.bankDetails.accountType}
                      onValueChange={(val: "savings" | "current") => {
                        setForm((prev) => ({
                          ...prev,
                          bankDetails: {
                            ...prev.bankDetails,
                            accountType: val,
                          },
                        }));
                        setErrors2((p) => ({ ...p, accountType: "" }));
                      }}
                    >
                      <SelectTrigger className="input-field py-2 text-xs h-auto bg-transparent">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="current">Current Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={form.bankDetails.accountNumber}
                      onChange={handleTextChange(
                        "bankDetails",
                        "accountNumber",
                      )}
                      className="input-field py-2 text-xs font-mono"
                      placeholder="e.g. 502000281928"
                    />
                    {errors2.accountNumber && (
                      <p className="text-[10px] text-red-500">
                        {errors2.accountNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={form.bankDetails.ifscCode}
                      onChange={handleTextChange("bankDetails", "ifscCode")}
                      className="input-field py-2 text-xs font-mono uppercase"
                      placeholder="e.g. HDFC0000240"
                    />
                    {errors2.ifscCode && (
                      <p className="text-[10px] text-red-500">
                        {errors2.ifscCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Review and agree */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-border/10 pb-2">
                  <FileText className="h-4 w-4 text-[var(--gold)]" />
                  <h3 className="font-cormorant text-lg font-light text-[var(--brand-text)]">
                    Review Registration Profile
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs mt-2">
                  {/* Summary Business */}
                  <div className="space-y-2.5 p-4 rounded-xl border border-border/15 bg-background/20">
                    <p className="font-semibold text-[var(--brand-text)] uppercase tracking-wider text-[10px] border-b border-border/10 pb-1 flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-[var(--gold)]" />
                      Atelier Info
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Label Name:
                      </strong>{" "}
                      {form.businessInfo.businessName}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Owner Name:
                      </strong>{" "}
                      {form.businessInfo.ownerName}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Contact:
                      </strong>{" "}
                      {form.businessInfo.email} | {form.businessInfo.phone}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        GSTIN Code:
                      </strong>{" "}
                      {form.businessInfo.gstNumber}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Collection:
                      </strong>{" "}
                      {form.businessInfo.category}
                    </p>
                  </div>

                  {/* Summary Bank */}
                  <div className="space-y-2.5 p-4 rounded-xl border border-border/15 bg-background/20">
                    <p className="font-semibold text-[var(--brand-text)] uppercase tracking-wider text-[10px] border-b border-border/10 pb-1 flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5 text-[var(--gold)]" />
                      Payout Account
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Bank Name:
                      </strong>{" "}
                      {form.bankDetails.bankName}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">Holder:</strong>{" "}
                      {form.bankDetails.accountHolder}
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        Account Number:
                      </strong>{" "}
                      {form.bankDetails.accountNumber} (
                      {form.bankDetails.accountType})
                    </p>
                    <p>
                      <strong className="text-muted-foreground">
                        IFSC Code:
                      </strong>{" "}
                      {form.bankDetails.ifscCode}
                    </p>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-[var(--gold)] mt-0.5 rounded"
                      checked={form.agreedToTerms}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          agreedToTerms: e.target.checked,
                        }))
                      }
                    />
                    <span>
                      I declare that all bank and GST details provided are true
                      and belong to the registered legal entity. I agree to
                      Vault Vogue's luxury seller margin commissions (15%
                      platform commission cut).
                    </span>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Stepper Footer Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-border/10 mt-6 shrink-0">
          <div>
            {step > 1 && (
              <button
                onClick={() => handleGoStep(step - 1)}
                className="btn-ghost py-2 px-4 text-xs flex items-center gap-1"
                disabled={submitting}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="btn-secondary py-2 px-5 text-xs flex items-center gap-1"
              >
                Next Step
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
              >
                {submitting ? (
                  <>
                    <Clock className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SellerStepsIndicator } from "@/components/admin/seller/SellerStepsIndicator";
import { Step1BusinessInfo } from "@/components/admin/seller/Step1BusinessInfo";
import { Step2BankDetails } from "@/components/admin/seller/Step2BankDetails";
import { Step3ProductListing } from "@/components/admin/seller/Step3ProductListing";
import { Step4Review } from "@/components/admin/seller/Step4Review";
import type {
  SellerOnboardingStep,
  SellerOnboardingForm,
  BusinessInfo,
  BankDetails,
  ProductListing,
} from "@/types/admin";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

// ── Validation schemas ────────────────────────────────────────────────────────
const step1Schema = z.object({
  businessName: z.string().min(2, "Business name required"),
  ownerName: z.string().min(2, "Owner name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

const step2Schema = z.object({
  bankName: z.string().min(2, "Bank name required"),
  accountHolder: z.string().min(2, "Account holder name required"),
  accountNumber: z.string().min(8, "Valid account number required"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  accountType: z.enum(["savings", "current"]),
});

const step3Schema = z.object({
  productName: z.string().min(3, "Product name required"),
  sku: z.string().min(2, "SKU required"),
  price: z.string().min(1, "Price required"),
  category: z.string().min(1, "Category required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

// ── Initial state ─────────────────────────────────────────────────────────────
const INIT_FORM: SellerOnboardingForm = {
  businessInfo: {
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    category: "",
    description: "",
    website: "",
    gstNumber: "",
  },
  bankDetails: {
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "savings",
  },
  productListing: {
    productName: "",
    sku: "",
    price: "",
    category: "",
    description: "",
    moq: "1",
  },
  agreedToTerms: false,
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function SellerOnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<SellerOnboardingStep>(1);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<SellerOnboardingForm>(INIT_FORM);
  const [errors1, setErrors1] = useState<
    Partial<Record<keyof BusinessInfo, string>>
  >({});
  const [errors2, setErrors2] = useState<
    Partial<Record<keyof BankDetails, string>>
  >({});
  const [errors3, setErrors3] = useState<
    Partial<Record<keyof ProductListing, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const go = (next: SellerOnboardingStep) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const validateAndNext = () => {
    if (step === 1) {
      const r = step1Schema.safeParse(form.businessInfo);
      if (!r.success) {
        const e: typeof errors1 = {};
        r.error.issues.forEach((i) => {
          if (i.path[0]) e[i.path[0] as keyof BusinessInfo] = i.message;
        });
        setErrors1(e);
        return;
      }
      setErrors1({});
      go(2);
    } else if (step === 2) {
      const r = step2Schema.safeParse(form.bankDetails);
      if (!r.success) {
        const e: typeof errors2 = {};
        r.error.issues.forEach((i) => {
          if (i.path[0]) e[i.path[0] as keyof BankDetails] = i.message;
        });
        setErrors2(e);
        return;
      }
      setErrors2({});
      go(3);
    } else if (step === 3) {
      const r = step3Schema.safeParse(form.productListing);
      if (!r.success) {
        const e: typeof errors3 = {};
        r.error.issues.forEach((i) => {
          if (i.path[0]) e[i.path[0] as keyof ProductListing] = i.message;
        });
        setErrors3(e);
        return;
      }
      setErrors3({});
      go(4);
    }
  };

  const handleSubmit = async () => {
    if (!form.agreedToTerms) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    setSubmitting(true);
    
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    
    try {
      // 1. Save new seller profile to admin sellers list
      let localSellers = localStorage.getItem("vault_vogue_admin_sellers");
      let sellersList = localSellers ? JSON.parse(localSellers) : [
        { id: 'SEL-001', businessName: 'Luxe Collections Pvt Ltd',  ownerName: 'Rohan Mehta',      email: 'rohan@luxecollections.com',  category: 'Handbags',    joinedAt: '2024-02-20', status: 'approved',  revenue: 480000,  products: 14 },
        { id: 'SEL-002', businessName: 'Artisan Atelier',           ownerName: 'Meera Iyer',        email: 'meera@artisanatelier.in',    category: 'Jewellery',   joinedAt: '2024-04-01', status: 'approved',  revenue: 210000,  products: 8  },
        { id: 'SEL-003', businessName: 'Heritage Craft Studio',     ownerName: 'Suresh Pillai',     email: 'suresh@heritagecraft.in',    category: 'Accessories', joinedAt: '2024-05-15', status: 'pending',   revenue: 0,       products: 0  },
        { id: 'SEL-004', businessName: 'Couture House Mumbai',      ownerName: 'Divya Reddy',       email: 'divya@couturehouse.com',     category: 'Apparel',     joinedAt: '2024-06-22', status: 'approved',  revenue: 920000,  products: 32 },
        { id: 'SEL-005', businessName: 'The Leather Workshop',      ownerName: 'Kabir Das',         email: 'kabir@leatherworkshop.in',   category: 'Footwear',    joinedAt: '2024-07-08', status: 'rejected',  revenue: 0,       products: 0  },
        { id: 'SEL-006', businessName: 'Silk Route Emporium',       ownerName: 'Nandita Bose',      email: 'nandita@silkroute.in',       category: 'Accessories', joinedAt: '2024-08-14', status: 'approved',  revenue: 156000,  products: 6  },
        { id: 'SEL-007', businessName: 'Precious Gems & Co',        ownerName: 'Vikram Singh',      email: 'vikram@preciousgems.com',    category: 'Jewellery',   joinedAt: '2024-09-01', status: 'suspended', revenue: 88000,   products: 4  },
        { id: 'SEL-008', businessName: 'Fine Fragrance Boutique',   ownerName: 'Aisha Khan',        email: 'aisha@finefragrance.com',    category: 'Fragrances',  joinedAt: '2024-11-10', status: 'pending',   revenue: 0,       products: 0  },
      ];

      const newSellerId = `SEL-0${Math.floor(10 + Math.random() * 90)}`;
      const newSellerRow = {
        id: newSellerId,
        businessName: form.businessInfo.businessName,
        ownerName: form.businessInfo.ownerName,
        email: form.businessInfo.email,
        category: form.businessInfo.category || "General",
        joinedAt: new Date().toISOString().split("T")[0],
        status: "approved" as const,
        revenue: 0,
        products: 1,
      };

      sellersList = [newSellerRow, ...sellersList];
      localStorage.setItem("vault_vogue_admin_sellers", JSON.stringify(sellersList));

      // 2. Also register the product listing item in boutique floor catalog
      let localProducts = localStorage.getItem("vault_vogue_seller_products");
      let productsList = localProducts ? JSON.parse(localProducts) : [];
      
      const newProduct = {
        sku: form.productListing.sku || `VV-SL-${Math.floor(100 + Math.random() * 900)}`,
        name: form.productListing.productName,
        price: Number(form.productListing.price) || 25000,
        category: form.productListing.category || "General",
        stock: 10,
        status: "active" as const,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80",
        description: form.productListing.description,
      };

      productsList = [newProduct, ...productsList];
      localStorage.setItem("vault_vogue_seller_products", JSON.stringify(productsList));

      setSubmitting(false);
      setSubmitted(true);
      toast.success("Seller onboarding completed and catalog item published!");
    } catch (err) {
      setSubmitting(false);
      toast.error("Failed to onboard seller.");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full mb-6"
          style={{
            background: "var(--gold-faint)",
            border: "2px solid var(--gold-soft)",
          }}
        >
          <CheckCircle2
            className="h-10 w-10"
            style={{ color: "var(--gold)" }}
          />
        </div>
        <h2
          className="font-cormorant text-4xl font-light"
          style={{ color: "var(--brand-text)" }}
        >
          Application Submitted
        </h2>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          The seller application has been submitted for review. You will receive
          a confirmation email within 2–3 business days.
        </p>
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push("/admin/sellers")}
            className="btn-primary py-2.5 px-6 text-xs"
          >
            Back to Sellers
          </button>
          <button
            onClick={() => {
              setForm(INIT_FORM);
              setStep(1);
              setSubmitted(false);
            }}
            className="btn-secondary py-2.5 px-6 text-xs"
          >
            Onboard Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto ">
      {/* Steps Indicator */}
      <SellerStepsIndicator current={step} />

      {/* Form Card */}
      <div
        className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: "color-mix(in oklch, var(--background) 90%, transparent)",
          border: "1px solid var(--gold-faint)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
        }}
      >
        {/* Gold accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--gold-soft), transparent)",
          }}
        />

        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {step === 1 && (
              <Step1BusinessInfo
                data={form.businessInfo}
                onChange={(d) => setForm((p) => ({ ...p, businessInfo: d }))}
                errors={errors1}
              />
            )}
            {step === 2 && (
              <Step2BankDetails
                data={form.bankDetails}
                onChange={(d) => setForm((p) => ({ ...p, bankDetails: d }))}
                errors={errors2}
              />
            )}
            {step === 3 && (
              <Step3ProductListing
                data={form.productListing}
                onChange={(d) => setForm((p) => ({ ...p, productListing: d }))}
                errors={errors3}
              />
            )}
            {step === 4 && (
              <Step4Review
                form={form}
                onAgreementChange={(agreed) =>
                  setForm((p) => ({ ...p, agreedToTerms: agreed }))
                }
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div
          className="mt-8 flex items-center justify-between"
          style={{
            borderTop: "1px solid var(--gold-faint)",
            paddingTop: "1.5rem",
          }}
        >
          <button
            onClick={() => go((step - 1) as SellerOnboardingStep)}
            disabled={step === 1}
            className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-2 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: s === step ? "24px" : "6px",
                  background: s <= step ? "var(--gold)" : "var(--border)",
                }}
              />
            ))}
          </div>

          {step < 4 ? (
            <button
              onClick={validateAndNext}
              className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary py-2.5 px-6 text-xs disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

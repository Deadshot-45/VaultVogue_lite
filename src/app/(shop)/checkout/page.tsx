"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Lock,
  Truck,
  Percent,
  Check,
  AlertCircle,
  Building,
  Wallet,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import ProtectedPage from "@/components/auth/ProtectedPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/query/useCart";
import { useAppSelector } from "@/lib/store/hooks";
import { usePlaceOrderMutation } from "@/lib/query/useCheckout";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 700'%3E%3Crect width='600' height='700' fill='%23f5f0ea'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%238a6a42' font-family='Arial, sans-serif' font-size='20'%3EAtelier Piece%3C/text%3E%3C/svg%3E";

interface FormErrors {
  email?: string;
  phone?: string;
  fullName?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardName?: string;
}

export default function Page() {
  return (
    <ProtectedPage>
      <Elements stripe={stripePromise}>
        <CheckoutPage />
      </Elements>
    </ProtectedPage>
  );
}

function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.auth.user);

  const stripe = useStripe();
  const elements = useElements();
  const placeOrderMutation = usePlaceOrderMutation();

  // Cart Details
  const { data: cartItems = [], isLoading: isCartLoading } = useCart(true);

  // Form States
  const [formData, setFormData] = useState({
    email: user?.email || "",
    phone: "",
    fullName: user?.fullName || user?.name || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const [shippingMethod, setShippingMethod] = useState<
    "standard" | "express" | "vip"
  >("standard");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "cod" | "upi" |  "razorpay"
  >("card");

  // Simulated Card State
  const [cardData, setCardData] = useState({
    number: "1234567891234567",
    expiry: "12/25",
    cvv: "123",
    name: "Maison Client",
  });

  // Stripe Card Details State
  const [stripeCardDetails, setStripeCardDetails] = useState({
    brand: "visa",
    complete: true,
  });

  // Mock Payment Modals State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayStage, setRazorpayStage] = useState<
    "select" | "qrcode" | "loading"
  >("select");

  // Promo Code States
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Page States
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [successOrderData, setSuccessOrderData] = useState<{
    id: string;
    items: typeof cartItems;
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
    date: string;
    shippingAddress: typeof formData;
  } | null>(null);

  // Detect card type based on number
  const getCardType = (num: string) => {
    const cleanNum = num.replace(/\D/g, "");
    if (cleanNum.startsWith("4")) return "visa";
    if (/^5[1-5]/.test(cleanNum)) return "mastercard";
    if (/^3[47]/.test(cleanNum)) return "amex";
    if (cleanNum.startsWith("6011") || cleanNum.startsWith("65"))
      return "discover";
    return "unknown";
  };

  // Auto-fill mock address if user wants to test quickly
  const handleAutoFillMock = () => {
    setFormData({
      email: user?.email || "clarence@atelier.com",
      phone: "9876543210",
      fullName: user?.fullName || user?.name || "Clarence de Maison",
      addressLine1: "15 Marine Drive, Wing A, Suite 402",
      addressLine2: "Beside Oberoi Hotel",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400021",
      country: "India",
    });
    setCardData({
      number: "4242 4242 4242 4242",
      expiry: "12/29",
      cvv: "345",
      name: "CLARENCE DE MAISON",
    });
    toast.success("Maison test credentials auto-filled.");
  };

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );

  const getShippingCost = () => {
    if (shippingMethod === "vip") return 500;
    if (shippingMethod === "express") return 250;
    // Standard is free if subtotal >= 999
    return subtotal >= 999 ? 0 : 99;
  };

  const shippingCost = getShippingCost();
  const taxAmount = subtotal * 0.08;
  const totalAmount = Math.max(
    0,
    subtotal + shippingCost + taxAmount - discountAmount,
  );

  // Handle inputs
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "number") {
      const clean = value.replace(/\D/g, "").slice(0, 16);
      formattedValue = clean.replace(/(.{4})/g, "$1 ").trim();
    } else if (name === "expiry") {
      const clean = value.replace(/\D/g, "").slice(0, 4);
      if (clean.length > 2) {
        formattedValue = `${clean.slice(0, 2)}/${clean.slice(2)}`;
      } else {
        formattedValue = clean;
      }
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    } else if (name === "name") {
      formattedValue = value.toUpperCase();
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Promo Code applying
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME10") {
      const disc = subtotal * 0.1;
      setDiscountAmount(disc);
      setAppliedPromo("WELCOME10 (10% Off)");
      toast.success("Promo code applied: 10% Maison discount.");
    } else if (code === "ATELIER5") {
      const disc = Math.min(500, subtotal);
      setDiscountAmount(disc);
      setAppliedPromo("ATELIER5 (Rs. 500 Off)");
      toast.success("Promo code applied: Rs. 500 flat discount.");
    } else if (code === "VIPCOMP") {
      const disc = subtotal * 0.15;
      setDiscountAmount(disc);
      setAppliedPromo("VIPCOMP (15% Off)");
      setShippingMethod("standard"); // force complimentary standard
      toast.success("Promo code applied: 15% VIP discount.");
    } else {
      toast.error("Invalid promo code. Please enter a valid Atelier coupon.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    setPromoCode("");
    toast.info("Promo code removed.");
  };

  // Validate form
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};

    // Address checks
    if (!formData.fullName.trim())
      tempErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (
      !formData.phone.trim() ||
      formData.phone.replace(/\D/g, "").length < 10
    ) {
      tempErrors.phone = "Valid 10-digit phone number is required";
    }
    if (!formData.addressLine1.trim())
      tempErrors.addressLine1 = "Shipping address is required";
    if (!formData.city.trim()) tempErrors.city = "City is required";
    if (!formData.state.trim()) tempErrors.state = "State is required";
    if (
      !formData.zipCode.trim() ||
      formData.zipCode.replace(/\D/g, "").length < 6
    ) {
      tempErrors.zipCode = "Valid 6-digit postal ZIP code is required";
    }

    // Card checks if card is selected (Stripe integration)
    if (paymentMethod === "card") {
      if (!stripeCardDetails.complete) {
        tempErrors.cardNumber = "Please complete the card details.";
      }

      if (!cardData.name.trim()) {
        tempErrors.cardName = "Cardholder name is required";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Place order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please resolve the errors in the checkout form.");
      return;
    }

    if (paymentMethod === "razorpay") {
      setShowRazorpayModal(true);
      setRazorpayStage("select");
      return;
    }

    executeCheckoutMutation();
  };

  const executeCheckoutMutation = async () => {
    setIsSubmitting(true);
    console.log("cardData", cardData);

    try {
      // Simulate API lag
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const generatedId = `AT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      // Extract address fields (exclude email)
      const { email, ...addressData } = formData;

      const response = await placeOrderMutation.mutateAsync({
        address: addressData,
        shippingMethod,
        paymentMethod,
        tax: taxAmount,
        subtotal,
        shippingFee: shippingCost,
        promoCode: appliedPromo || undefined,
      });

      console.log("checkoutResponse", response);

      if (paymentMethod === "card" && response?.url) {
        toast.info("Redirecting to secure Stripe checkout...");
        window.location.href = response.url;
        return;
      }

      const orderId = response?.data?._id || response?.razorpay?.orderId || generatedId;

      // Save order context for display
      setSuccessOrderData({
        id: orderId,
        items: [...cartItems],
        subtotal,
        shipping: shippingCost,
        tax: taxAmount,
        discount: discountAmount,
        total: totalAmount,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        shippingAddress: { ...formData },
      });

      setOrderPlaced(true);
      toast.success("Order Placed Successfully!", {
        description: `Ref ID: ${orderId}. Confirmation email sent.`,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Order placement failed", err);
      toast.error("Failed to complete transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to home if cart is empty and order is not placed
  useEffect(() => {
    if (!isCartLoading && cartItems.length === 0 && !orderPlaced) {
      // wait a tiny bit to check
      const timer = setTimeout(() => {
        if (cartItems.length === 0 && !orderPlaced) {
          router.replace("/");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, isCartLoading, orderPlaced, router]);

  // Page title dynamic header
  if (orderPlaced && successOrderData) {
    return (
      <ProtectedPage>
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Elegant Confetti Visual */}
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold-glow)] text-[var(--gold)] border-2 border-[var(--gold)]"
            >
              <CheckCircle2 className="h-10 w-10" />
            </motion.div>

            <p className="section-label mt-8">Order Confirmed</p>
            <h1 className="mt-2 font-cormorant text-4xl font-light text-[var(--brand-text)] sm:text-5xl">
              Thank You for Your Order
            </h1>
            <p className="mt-4 text-xs text-muted-foreground max-w-md">
              Your transaction was processed successfully. A confirmation
              summary and shipment tracking credentials have been sent to{" "}
              <span className="font-semibold text-[var(--brand-text)]">
                {successOrderData.shippingAddress.email}
              </span>
              .
            </p>

            {/* Receipt Summary Card */}
            <div className="mt-12 w-full overflow-hidden rounded-2xl border border-[var(--gold-soft)] bg-card/40 p-6 sm:p-8 text-left shadow-lg backdrop-blur-md">
              <div className="flex flex-col justify-between border-b border-border/40 pb-5 sm:flex-row">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--gold)]">
                    Atelier Receipt
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-[var(--brand-text)]">
                    Order Ref: {successOrderData.id}
                  </h3>
                </div>
                <div className="mt-3 text-left sm:mt-0 sm:text-right">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Order Placed
                  </p>
                  <h3 className="mt-1 text-xs text-[var(--brand-text)]">
                    {successOrderData.date}
                  </h3>
                </div>
              </div>

              {/* Items List */}
              <div className="py-6 space-y-4 border-b border-border/40 max-h-60 overflow-y-auto no-scrollbar">
                {successOrderData.items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 items-center">
                    <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-border/30 bg-muted">
                      <Image
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold line-clamp-1 text-[var(--brand-text)]">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Quantity: {item.quantity}{" "}
                        {item.size && `| Size: ${item.size}`}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[var(--gold)]">
                      Rs. {((item.price ?? 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="py-6 border-b border-border/40 grid gap-6 sm:grid-cols-2 text-xs">
                <div>
                  <h5 className="font-semibold uppercase tracking-wider text-[var(--gold)] text-[10px] mb-2">
                    Shipping Destination
                  </h5>
                  <p className="text-[var(--brand-text)] font-medium">
                    {successOrderData.shippingAddress.fullName}
                  </p>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    {successOrderData.shippingAddress.addressLine1}
                    {successOrderData.shippingAddress.addressLine2 &&
                      `, ${successOrderData.shippingAddress.addressLine2}`}
                    <br />
                    {successOrderData.shippingAddress.city},{" "}
                    {successOrderData.shippingAddress.state} -{" "}
                    {successOrderData.shippingAddress.zipCode}
                    <br />
                    {successOrderData.shippingAddress.country}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Phone: {successOrderData.shippingAddress.phone}
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold uppercase tracking-wider text-[var(--gold)] text-[10px] mb-2">
                    Delivery Milestone
                  </h5>
                  <div className="flex gap-3 items-center bg-[var(--gold-glow)] rounded-xl border border-[var(--gold-faint)] p-3">
                    <Truck className="h-5 w-5 text-[var(--gold)]" />
                    <div>
                      <p className="font-semibold text-[var(--brand-text)]">
                        {shippingMethod === "vip"
                          ? "Maison Express VIP"
                          : "Standard Premium"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Estimated:{" "}
                        {shippingMethod === "vip"
                          ? "1-2 Business Days"
                          : "3-5 Business Days"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Totals */}
              <div className="pt-5 space-y-2.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Maison Subtotal</span>
                  <span>Rs. {successOrderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span>
                    {successOrderData.shipping === 0
                      ? "Complimentary"
                      : `Rs. ${successOrderData.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Atelier Duty / Tax (8%)</span>
                  <span>Rs. {successOrderData.tax.toFixed(2)}</span>
                </div>
                {successOrderData.discount > 0 && (
                  <div className="flex justify-between text-red-500 font-medium">
                    <span>Applied Benefits</span>
                    <span>- Rs. {successOrderData.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-sm font-bold text-[var(--brand-text)]">
                  <span>Maison Total Charge</span>
                  <span className="text-[var(--gold)]">
                    Rs. {successOrderData.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button
                onClick={() => router.push("/orders")}
                className="btn-primary w-full sm:w-auto px-8"
              >
                Track Orders
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="btn-secondary w-full sm:w-auto px-8 border-[var(--gold-soft)] hover:bg-[var(--gold-glow)] text-[var(--gold)]"
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </section>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <div className="mx-auto max-w-7xl w-full px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
        {/* Header Breadcrumbs */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="section-label">Maison Checkout</p>
            <div className="gold-divider" />
            <h1 className="mt-5 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
              Complete Your Order
            </h1>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-[var(--brand-text)] transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>
        </div>

        {isCartLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--gold)]"></div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Retrieving Atelier Bag...
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-6">
            <ShoppingBag className="h-12 w-12 text-[var(--gold-soft)]" />
            <div>
              <h3 className="font-cormorant text-3xl font-light text-[var(--brand-text)]">
                Your Atelier Bag is Empty
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                There are no items currently queued for checkout. Return to the
                catalogs to make a selection.
              </p>
            </div>
            <Button onClick={() => router.push("/")} className="btn-primary">
              Continue Browsing
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid gap-10 lg:grid-cols-[1fr_400px]"
          >
            {/* Left Column: Forms */}
            <div className="space-y-8">
              {/* Dev Test Tooltip Banner */}
              <div className="flex flex-col justify-between sm:flex-row gap-4 items-start sm:items-center rounded-2xl border border-[var(--gold-soft)] bg-[var(--gold-glow)] p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-[var(--gold)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[var(--brand-text)]">
                      Atelier Demo Mode
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Quickly test the complete checkout process with verified
                      mock address details.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAutoFillMock}
                  className="btn-primary shrink-0 py-2 px-4 text-[10px] font-semibold uppercase tracking-wider h-8"
                >
                  Autofill Sandbox Info
                </Button>
              </div>

              {/* Step 1: Customer Contact & Shipping Address */}
              <div className="rounded-2xl border border-border/40 bg-card/45 p-6 backdrop-blur-md shadow-md">
                <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)] mb-6">
                  1. Shipping Information
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.email ? "border-red-500" : ""}`}
                      placeholder="client@domain.com"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      Client Full Name
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="Full Name"
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.phone ? "border-red-500" : ""}`}
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="addressLine1"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleFormChange}
                      className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.addressLine1 ? "border-red-500" : ""}`}
                      placeholder="Avenue / Street / House Name"
                    />
                    {errors.addressLine1 && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="addressLine2"
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Apartment, Suite, Unit, etc. (Optional)
                    </Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleFormChange}
                      className="mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg"
                      placeholder="Apartment, suite number, or landmarks"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="city"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.city ? "border-red-500" : ""}`}
                      placeholder="City Name"
                    />
                    {errors.city && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="state"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      State
                    </Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.state ? "border-red-500" : ""}`}
                      placeholder="State Name"
                    />
                    {errors.state && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="zipCode"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      ZIP / Postal Code
                    </Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleFormChange}
                      className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.zipCode ? "border-red-500" : ""}`}
                      placeholder="6-digit PIN code"
                    />
                    {errors.zipCode && (
                      <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="country"
                      className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                    >
                      Country
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      disabled
                      className="mt-1.5 h-11 text-xs border-[var(--gold-faint)] bg-muted/30 cursor-not-allowed rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Options */}
              <div className="rounded-2xl border border-border/40 bg-card/45 p-6 backdrop-blur-md shadow-md">
                <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)] mb-6">
                  2. Shipping Method
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Standard */}
                  <label
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer hover:border-[var(--gold-soft)] transition-all ${shippingMethod === "standard" ? "border-[var(--gold)] bg-[var(--gold-glow)]" : "border-border/40"}`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={shippingMethod === "standard"}
                      onChange={() => setShippingMethod("standard")}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-[var(--brand-text)] uppercase tracking-wider">
                        Standard
                      </span>
                      <span className="text-xs font-bold text-[var(--gold)]">
                        {subtotal >= 999 ? "Complimentary" : "Rs. 99.00"}
                      </span>
                    </div>
                    <span className="block text-[10px] text-muted-foreground mt-4">
                      Delivery in 3 to 5 business days. Complimentary above Rs.
                      999.
                    </span>
                  </label>

                  {/* Express */}
                  <label
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer hover:border-[var(--gold-soft)] transition-all ${shippingMethod === "express" ? "border-[var(--gold)] bg-[var(--gold-glow)]" : "border-border/40"}`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === "express"}
                      onChange={() => setShippingMethod("express")}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-[var(--brand-text)] uppercase tracking-wider">
                        Express
                      </span>
                      <span className="text-xs font-bold text-[var(--gold)]">
                        Rs. 250.00
                      </span>
                    </div>
                    <span className="block text-[10px] text-muted-foreground mt-4">
                      Expedited routing. Delivery in 1 to 2 business days.
                    </span>
                  </label>

                  {/* VIP Maison Courier */}
                  <label
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer hover:border-[var(--gold-soft)] transition-all ${shippingMethod === "vip" ? "border-[var(--gold)] bg-[var(--gold-glow)]" : "border-border/40"}`}
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="vip"
                      checked={shippingMethod === "vip"}
                      onChange={() => setShippingMethod("vip")}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-[var(--brand-text)] uppercase tracking-wider">
                        Maison VIP
                      </span>
                      <span className="text-xs font-bold text-[var(--gold)]">
                        Rs. 500.00
                      </span>
                    </div>
                    <span className="block text-[10px] text-muted-foreground mt-4">
                      Premium courier service. Same-day / next-day delivery.
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment Options */}
              <div className="rounded-2xl border border-border/40 bg-card/45 p-6 backdrop-blur-md shadow-md">
                <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)] mb-6">
                  3. Secure Payment
                </h3>

                {/* Method selector grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                  {/* Stripe Card */}
                  <label
                    onClick={() => setPaymentMethod("card")}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer hover:border-[var(--gold-soft)] transition-all ${paymentMethod === "card" ? "border-[var(--gold)] bg-[var(--gold-glow)]" : "border-border/40"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-[var(--gold)]" />
                        <span className="text-[11px] font-bold text-[var(--brand-text)] uppercase tracking-wider">
                          Maison Card
                        </span>
                      </div>
                      {paymentMethod === "card" && (
                        <Check className="h-3 w-3 text-[var(--gold)]" />
                      )}
                    </div>
                    <span className="block text-[9px] text-muted-foreground mt-4">
                      Secure payment via Stripe.
                    </span>
                  </label>


                  {/* Razorpay */}
                  <label
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer hover:border-[var(--gold-soft)] transition-all ${paymentMethod === "razorpay" ? "border-[var(--gold)] bg-[var(--gold-glow)]" : "border-border/40"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                        <span className="text-[11px] font-bold text-[var(--brand-text)] uppercase tracking-wider">
                          Razorpay
                        </span>
                      </div>
                      {paymentMethod === "razorpay" && (
                        <Check className="h-3 w-3 text-[var(--gold)]" />
                      )}
                    </div>
                    <span className="block text-[9px] text-muted-foreground mt-4">
                      UPI, Cards & Netbanking.
                    </span>
                  </label>

                  {/* UPI / Bank */}
                  <label
                    onClick={() => setPaymentMethod("upi")}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer hover:border-[var(--gold-soft)] transition-all ${paymentMethod === "upi" ? "border-[var(--gold)] bg-[var(--gold-glow)]" : "border-border/40"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-[var(--gold)]" />
                        <span className="text-[11px] font-bold text-[var(--brand-text)] uppercase tracking-wider">
                          Bank Wire
                        </span>
                      </div>
                      {paymentMethod === "upi" && (
                        <Check className="h-3 w-3 text-[var(--gold)]" />
                      )}
                    </div>
                    <span className="block text-[9px] text-muted-foreground mt-4">
                      Manual HDFC bank wire / UPI QR.
                    </span>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer hover:border-[var(--gold-soft)] transition-all ${paymentMethod === "cod" ? "border-[var(--gold)] bg-[var(--gold-glow)]" : "border-border/40"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[var(--gold)]" />
                        <span className="text-[11px] font-bold text-[var(--brand-text)] uppercase tracking-wider">
                          Doorstep COD
                        </span>
                      </div>
                      {paymentMethod === "cod" && (
                        <Check className="h-3 w-3 text-[var(--gold)]" />
                      )}
                    </div>
                    <span className="block text-[9px] text-muted-foreground mt-4">
                      Cashless / card doorstep collection.
                    </span>
                  </label>
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === "card" && (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Premium Interactive Credit Card */}
                      <div className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1917] to-[#44403c] p-6 text-white shadow-xl">
                        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-[var(--gold-soft)] opacity-20 blur-xl"></div>
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest text-slate-400">
                                Vault Vogue Atelier
                              </p>
                              <div className="mt-1 h-7 w-10 rounded bg-[#d4b796]/10 border border-[#d4b796]/30 flex items-center justify-center">
                                <Lock className="h-3.5 w-3.5 text-[var(--gold)]" />
                              </div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#d4b796]">
                              {(stripeCardDetails.brand === "visa" ||
                                getCardType(cardData.number) === "visa") &&
                                "Visa"}
                              {(stripeCardDetails.brand === "mastercard" ||
                                getCardType(cardData.number) ===
                                  "mastercard") &&
                                "MasterCard"}
                              {(stripeCardDetails.brand === "amex" ||
                                getCardType(cardData.number) === "amex") &&
                                "Amex"}
                              {stripeCardDetails.brand === "unknown" &&
                                getCardType(cardData.number) === "unknown" &&
                                "Maison Card"}
                            </span>
                          </div>

                          <div>
                            <p className="font-mono text-lg tracking-widest sm:text-xl">
                              {stripeCardDetails.brand !== "unknown"
                                ? "•••• •••• •••• ••••"
                                : cardData.number || "•••• •••• •••• ••••"}
                            </p>
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-[7px] uppercase tracking-wider text-slate-400">
                                Cardholder
                              </p>
                              <p className="font-mono text-xs tracking-wider line-clamp-1">
                                {cardData.name || "MAISON CLIENT"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[7px] uppercase tracking-wider text-slate-400">
                                Expires
                              </p>
                              <p className="font-mono text-xs tracking-wider">
                                {stripeCardDetails.brand !== "unknown"
                                  ? "MM/YY"
                                  : cardData.expiry || "MM/YY"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Input fields */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]">
                            Card Details (Stripe Secure)
                          </Label>
                          <div className="mt-1.5 border border-[var(--gold-faint)] focus-within:border-[var(--gold)] rounded-lg px-3 py-3.5 bg-white">
                            <CardElement
                              onChange={(event) => {
                                setStripeCardDetails({
                                  brand: event.brand || "unknown",
                                  complete: event.complete,
                                });
                                if (errors.cardNumber) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    cardNumber: undefined,
                                  }));
                                }
                              }}
                              options={{
                                style: {
                                  base: {
                                    color: "#0f172a", // slate 900
                                    fontFamily: "Inter, sans-serif",
                                    fontSmoothing: "antialiased",
                                    fontSize: "14px",
                                    "::placeholder": {
                                      color: "#94a3b8", // slate 400
                                    },
                                  },
                                  invalid: {
                                    color: "#ef4444", // red 500
                                    iconColor: "#ef4444",
                                  },
                                },
                              }}
                            />
                          </div>
                          <span className="text-[9px] text-muted-foreground mt-1 block">
                            Tip: For testing, use card number{" "}
                            <span className="font-mono font-semibold">
                              4242 4242 4242 4242
                            </span>{" "}
                            with any future expiry and CVV.
                          </span>
                          {errors.cardNumber && (
                            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.cardNumber}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <Label
                            htmlFor="cardName"
                            className="text-xs font-medium uppercase tracking-wider text-[var(--brand-text)]"
                          >
                            Cardholder Name
                          </Label>
                          <Input
                            id="cardName"
                            name="name"
                            value={cardData.name}
                            onChange={handleCardChange}
                            className={`mt-1.5 h-11 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg ${errors.cardName ? "border-red-500" : ""}`}
                            placeholder="NAME AS PRINTED ON CARD"
                          />
                          {errors.cardName && (
                            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.cardName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-center rounded-xl bg-muted/30 border border-border/30 p-3 text-[10px] text-muted-foreground">
                        <Lock className="h-3.5 w-3.5 text-[var(--gold)] shrink-0" />
                        <span>
                          Protected by 256-bit SSL encryption. Stripe secure
                          tokenization is simulated for sandbox testing.
                        </span>
                      </div>
                    </motion.div>
                  )}


                  {paymentMethod === "razorpay" && (
                    <motion.div
                      key="razorpay"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-3"
                    >
                      <h4 className="text-xs font-bold text-[var(--brand-text)] flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                        Razorpay Secure Gateway
                      </h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Select from UPI (GPay, PhonePe), netbanking, or popular
                        Indian mobile wallets. The secure payment collection
                        overlay will initialize when you click{" "}
                        <strong className="text-[var(--gold)] font-medium">
                          Place Order
                        </strong>
                        .
                      </p>
                    </motion.div>
                  )}

                  {paymentMethod === "cod" && (
                    <motion.div
                      key="cod"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="rounded-xl border border-[var(--gold-soft)] bg-[var(--gold-glow)] p-5 space-y-3"
                    >
                      <h4 className="text-xs font-bold text-[var(--brand-text)]">
                        Cash on Delivery Policy
                      </h4>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        To maintain secure and contactless handovers, our
                        courier captains accept cashless payouts (Credit Cards,
                        UPI, or Wallet QR Codes) at your doorstep. Please ensure
                        that an authorized recipient is present at the shipping
                        destination.
                      </p>
                      <p className="text-[10px] font-semibold text-[var(--gold)]">
                        No additional processing fee is levied on COD orders
                        above Rs. 999.
                      </p>
                    </motion.div>
                  )}

                  {paymentMethod === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="rounded-xl border border-border/30 bg-muted/10 p-5 space-y-3 text-center">
                        <Building className="h-8 w-8 mx-auto text-[var(--gold)]" />
                        <h4 className="text-xs font-semibold text-[var(--brand-text)]">
                          Maison Direct Bank Transfer / UPI
                        </h4>
                        <p className="text-[10px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                          Scan the dynamic Maison QR code or execute a bank wire
                          transfer after order submission. Payment instructions
                          will be dispatched to your email.
                        </p>
                      </div>

                      <div className="rounded-lg border border-border/40 p-4 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Account Holder:
                          </span>
                          <span className="font-semibold text-[var(--brand-text)]">
                            VAULT VOGUE PVT LTD
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Maison Bank:
                          </span>
                          <span className="font-semibold text-[var(--brand-text)]">
                            HDFC Premium Banking
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Account Number:
                          </span>
                          <span className="font-mono font-semibold text-[var(--brand-text)]">
                            50200088921820
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            IFSC Code:
                          </span>
                          <span className="font-mono font-semibold text-[var(--brand-text)]">
                            HDFC0000060
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Summary & Promo Code */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="rounded-2xl border border-border/40 bg-card/45 p-6 backdrop-blur-md shadow-md sticky top-24">
                <h3 className="font-cormorant text-2xl font-light text-[var(--brand-text)] mb-6">
                  Order Summary
                </h3>

                {/* Items preview list */}
                <div className="space-y-4 max-h-48 overflow-y-auto pr-1 no-scrollbar mb-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-3 items-center text-xs"
                    >
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md border border-border/30 bg-muted">
                        <Image
                          src={item.image || FALLBACK_IMAGE}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-[var(--brand-text)] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Qty: {item.quantity}{" "}
                          {item.size && `| Sz: ${item.size}`}
                        </p>
                      </div>
                      <span className="font-bold text-[var(--gold)]">
                        Rs. {((item.price ?? 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-5" />

                {/* Promo Code Fields */}
                <div className="space-y-3">
                  <Label
                    htmlFor="promo"
                    className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-semibold"
                  >
                    Maison Promo / Voucher Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="h-10 text-xs border-[var(--gold-faint)] focus-visible:border-[var(--gold)] rounded-lg"
                      disabled={!!appliedPromo}
                    />
                    {appliedPromo ? (
                      <Button
                        type="button"
                        onClick={handleRemovePromo}
                        variant="destructive"
                        className="h-10 text-xs px-4"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleApplyPromo}
                        className="btn-secondary h-10 text-xs px-5 border-[var(--gold)] text-[var(--gold)]"
                      >
                        Apply
                      </Button>
                    )}
                  </div>

                  {/* Applied info */}
                  {appliedPromo && (
                    <p className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-1">
                      <Check className="h-3 w-3" /> Benefit Applied:{" "}
                      {appliedPromo}
                    </p>
                  )}

                  {/* Suggested codes preview */}
                  {!appliedPromo && (
                    <div className="text-[9px] text-muted-foreground leading-relaxed mt-2.5">
                      Available:{" "}
                      <span className="font-mono font-semibold text-[var(--gold)]">
                        WELCOME10
                      </span>{" "}
                      (10% Off) or{" "}
                      <span className="font-mono font-semibold text-[var(--gold)]">
                        ATELIER5
                      </span>{" "}
                      (Rs. 500 Off)
                    </div>
                  )}
                </div>

                <Separator className="my-5" />

                {/* Calculation breakdown */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Maison Subtotal</span>
                    <span className="font-medium text-[var(--brand-text)]">
                      Rs. {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping Fee</span>
                    <span className="font-medium text-[var(--brand-text)]">
                      {shippingCost === 0
                        ? "Complimentary"
                        : `Rs. ${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Atelier Duty / Tax (8%)</span>
                    <span className="font-medium text-[var(--brand-text)]">
                      Rs. {taxAmount.toFixed(2)}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-500 font-medium">
                      <span>Applied Benefits</span>
                      <span>- Rs. {discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator className="my-3" />

                  <div className="flex justify-between text-sm font-bold text-[var(--brand-text)]">
                    <span>Total Charge</span>
                    <span className="text-[var(--gold)] text-base font-bold">
                      Rs. {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="btn-primary w-full mt-6 py-4 h-12 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <Lock className="h-3.5 w-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Mock Razorpay Sheet */}
      <AnimatePresence>
        {showRazorpayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-sm bg-[#121624] rounded-2xl shadow-2xl overflow-hidden border border-slate-800 text-white"
            >
              {/* Header */}
              <div className="bg-[#1a2139] px-5 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-blue-500 flex items-center justify-center font-bold text-xs text-white">
                    R
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold tracking-wide">
                      Vault Vogue Atelier
                    </h4>
                    <p className="text-[9px] text-slate-400">
                      Total: Rs. {totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRazorpayModal(false)}
                  className="text-slate-400 hover:text-white text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="p-5 space-y-5">
                {razorpayStage === "select" && (
                  <div className="space-y-4">
                    <h5 className="text-[10px] uppercase tracking-wider text-slate-400 font-bold text-left">
                      Select Payment Option
                    </h5>

                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => setRazorpayStage("qrcode")}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <Check className="h-4 w-4 text-green-500" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">
                              UPI (Google Pay, PhonePe)
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              Pay instantly via QR or UPI ID
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setRazorpayStage("loading");
                          setTimeout(() => executeCheckoutMutation(), 2000);
                        }}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">
                              Netbanking / Wallets
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              All major Indian banks supported
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {razorpayStage === "qrcode" && (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 py-3">
                    <p className="text-xs font-semibold text-slate-300">
                      Scan QR Code to Payout
                    </p>
                    <div className="bg-white p-3.5 rounded-xl">
                      {/* Generated QR Code placeholder using inline svg */}
                      <svg className="h-32 w-32" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="white" />
                        <rect
                          x="10"
                          y="10"
                          width="20"
                          height="20"
                          fill="black"
                        />
                        <rect
                          x="15"
                          y="15"
                          width="10"
                          height="10"
                          fill="white"
                        />
                        <rect
                          x="70"
                          y="10"
                          width="20"
                          height="20"
                          fill="black"
                        />
                        <rect
                          x="75"
                          y="15"
                          width="10"
                          height="10"
                          fill="white"
                        />
                        <rect
                          x="10"
                          y="70"
                          width="20"
                          height="20"
                          fill="black"
                        />
                        <rect
                          x="15"
                          y="75"
                          width="10"
                          height="10"
                          fill="white"
                        />
                        <rect
                          x="40"
                          y="40"
                          width="20"
                          height="20"
                          fill="black"
                        />
                        <rect
                          x="45"
                          y="45"
                          width="10"
                          height="10"
                          fill="white"
                        />
                        {/* some random blocks */}
                        <rect
                          x="40"
                          y="15"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="15"
                          y="40"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="70"
                          y="40"
                          width="10"
                          height="10"
                          fill="black"
                        />
                        <rect
                          x="75"
                          y="75"
                          width="15"
                          height="15"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <p className="text-[9px] text-slate-400">
                      Total charge: Rs. {totalAmount.toFixed(2)}
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        setRazorpayStage("loading");
                        setTimeout(() => executeCheckoutMutation(), 2000);
                      }}
                      className="btn-primary w-full h-10 text-xs font-bold"
                    >
                      Simulate Payment Success
                    </Button>
                  </div>
                )}

                {razorpayStage === "loading" && (
                  <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <div>
                      <h4 className="text-sm font-semibold">
                        Processing Razorpay Transaction...
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Please do not refresh the page
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ProtectedPage>
  );
}

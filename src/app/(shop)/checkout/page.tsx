"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Lock, ShoppingBag, Loader2 } from "lucide-react";

import ProtectedPage from "@/features/auth/components/ProtectedPage";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { useCart } from "@/lib/queries/useCart";
import { useAppSelector } from "@/lib/store/hooks";
import { usePlaceOrderMutation } from "@/lib/queries/useCheckout";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Import modular components
import {
  AddressSelector,
  Address,
} from "@/features/checkout/components/AddressSelector";
import { ShippingMethodSelector } from "@/features/checkout/components/ShippingMethodSelector";
import { PaymentSelector } from "@/features/checkout/components/PaymentSelector";
import { CouponBox } from "@/features/checkout/components/CouponBox";
import { OrderSummary } from "@/features/checkout/components/OrderSummary";
import { SuccessModal } from "@/features/checkout/components/SuccessModal";
import { openRazorpayCheckout } from "@/lib/services/razorpay";
import { ApiService } from "@/lib/services/apiservices";
import { paymentTrackingApi } from "@/features/payment-tracking";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

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
  const placeOrderMutation = usePlaceOrderMutation();

  // Cart Details
  const { data: cartItems = [], isLoading: isCartLoading } = useCart(true);

  // Stepper State
  const [activeStep, setActiveStep] = useState<
    "cart" | "shipping" | "payment" | "review"
  >("shipping");

  // Multi-Addresses Mock Data
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      fullName: user?.fullName || user?.name || "Aurora de Maison",
      phone: "9876543210",
      email: user?.email || "aurora@atelier.com",
      addressLine1: "21 Marine Drive, Tower B, Penthouse 2",
      addressLine2: "Near Taj Palace Hotel",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400021",
    },
    {
      id: "addr-2",
      fullName: "Clarence de Atelier",
      phone: "9123456789",
      email: user?.email || "clarence@atelier.com",
      addressLine1: "15 Malabar Hill, Wing A, Suite 402",
      addressLine2: "Beside Governor House",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      zipCode: "400006",
    },
  ]);

  // Mandatory states from guidelines
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr-1");
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [selectedPayment, setSelectedPayment] = useState<
    "stripe" | "razorpay" | "cod"
  >("stripe");
  const [coupon, setCoupon] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  // Prevents cart-empty redirect while Razorpay modal is open
  const [isRazorpayOpen, setIsRazorpayOpen] = useState<boolean>(false);
  // Prevents cart-empty redirect while browser is navigating to Stripe
  const [isStripeRedirecting, setIsStripeRedirecting] = useState<boolean>(false);
  const [isAddressCompleted, setIsAddressCompleted] = useState<boolean>(true);
  const [isShippingCompleted, setIsShippingCompleted] =
    useState<boolean>(false);

  // Promo Code Applied State
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Success screen details
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  // Pricing calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );

  const getShippingCost = () => {
    if (shippingMethod === "vip") return 500;
    if (shippingMethod === "express") return 250;
    return subtotal > 999 ? 0 : 99;
  };

  const shippingCost = getShippingCost();
  const taxAmount = subtotal * 0.08;
  const totalAmount = Math.max(
    0,
    subtotal + shippingCost + taxAmount - discountAmount,
  );

  // Promo Coupon box Handlers
  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    if (code === "WELCOME10") {
      setDiscountAmount(subtotal * 0.1);
      setAppliedPromo("WELCOME10 (10% Off)");
      toast.success("Promo applied: 10% Maison discount.");
    } else if (code === "ATELIER5") {
      setDiscountAmount(Math.min(500, subtotal));
      setAppliedPromo("ATELIER5 (₹500 Off)");
      toast.success("Promo applied: ₹500 flat discount.");
    } else if (code === "VIPCOMP") {
      setDiscountAmount(subtotal * 0.15);
      setAppliedPromo("VIPCOMP (15% Off)");
      toast.success("Promo applied: 15% VIP discount.");
    } else {
      toast.error("Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    setCoupon("");
    toast.info("Promo code removed.");
  };

  // Multiple Addresses Helpers
  const handleAddAddress = (newAddr: Omit<Address, "id">) => {
    const id = `addr-${Date.now()}`;
    const created: Address = { ...newAddr, id };
    setAddresses((prev) => [...prev, created]);
    setSelectedAddressId(id);
    toast.success("New address saved.");
  };

  const handleUpdateAddress = (updatedAddr: Address) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === updatedAddr.id ? updatedAddr : addr)),
    );
    toast.success("Address details updated.");
  };

  // Get active address
  const activeAddress = addresses.find((a) => a.id === selectedAddressId);

  // Place Order Action Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId || !activeAddress) {
      toast.error("Please select a shipping destination.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const generatedId = `VV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const { email, id, ...addressData } = activeAddress!;

      const response = await placeOrderMutation.mutateAsync({
        address: addressData,
        shippingMethod: shippingMethod as any,
        paymentMethod: selectedPayment === "stripe" ? "card" : ("upi" as any),
        tax: taxAmount,
        subtotal,
        shippingFee: shippingCost,
        promoCode: appliedPromo || undefined,
      });

      // Stripe redirect check
      if (selectedPayment === "stripe" && response?.url) {
        toast.info("Redirecting to Stripe checkout portal...");
        setIsStripeRedirecting(true); // Guard: prevent cart-empty redirect from firing
        window.location.href = response.url;
        return; // setLoading stays true — page is navigating away
      } else if (selectedPayment === "razorpay" && response?.razorpay) {
        // Razorpay Checkout Modal handling
        toast.info("Opening Razorpay payment gateway...");
        const rzpData = response.razorpay;

        // Mark gateway as open — prevents cart-empty redirect
        setIsRazorpayOpen(true);
        try {
          await openRazorpayCheckout({
            keyId: rzpData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            orderId: rzpData.orderId,
            amount: rzpData.amount,
            currency: rzpData.currency || "INR",
            customerName: activeAddress.fullName,
            customerPhone: activeAddress.phone,
            onSuccess: async (paymentRes) => {
              try {
                // 1. Verify Payment signature on backend
                await ApiService.post("/api/payments/verify", {
                  razorpay_order_id: paymentRes.razorpay_order_id,
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  razorpay_signature: paymentRes.razorpay_signature,
                });

                const realOrderId = response?.data?._id || rzpData.orderId;
                setPlacedOrderId(realOrderId);
                setOrderPlaced(true);
                setActiveStep("review");
                toast.success("Payment verified and order placed successfully!");
                // Navigate to success page with order and payment IDs
                router.push(
                  `/success?order_id=${realOrderId}&payment_intent=${paymentRes.razorpay_payment_id}`,
                );
              } catch (verErr: any) {
                console.error("Razorpay verification failed:", verErr);
                toast.error(verErr?.message || "Payment verification failed.");
              }
            },
            onDismiss: () => {
              toast.warning("Payment cancelled. You can retry checkout anytime.");
            },
          });
        } finally {
          // Always clear the guard so the cart-empty redirect can work normally
          setIsRazorpayOpen(false);
          setLoading(false);
        } 
        return;
      } else {
        const orderId =
          response?.data?._id || response?.razorpay?.orderId || generatedId;
        setPlacedOrderId(orderId);
        setOrderPlaced(true);
      }

      // Update step status to review
      setActiveStep("review");

      toast.success("Checkout Authorized Successfully!");
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err?.message || "Failed to complete transaction.");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if bag is empty — but NOT while Razorpay gateway or Stripe redirect is active
  useEffect(() => {
    if (!isCartLoading && cartItems.length === 0 && !orderPlaced && !isRazorpayOpen && !isStripeRedirecting) {
      const timer = setTimeout(() => {
        if (cartItems.length === 0 && !orderPlaced && !isRazorpayOpen && !isStripeRedirecting) {
          router.replace("/");
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, isCartLoading, orderPlaced, isRazorpayOpen, isStripeRedirecting, router]);

  return (
    <>
      <div className="mx-auto max-w-7xl w-full px-4 py-16 sm:px-6 lg:px-8 bg-[var(--background)]">
        {/* Amazon-Inspired Stepper/Breadcrumb Header */}
        <div className="mb-12 border-b border-border/40 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-[var(--gold)] uppercase tracking-[0.25em]">
                Secure Dispatch Zone
              </span>
              <Lock className="h-3 w-3 text-[var(--gold)]" />
            </div>
            <h1 className="mt-2 font-cormorant text-4xl font-light text-[var(--brand-text)] lg:text-5xl">
              Checkout Gateway
            </h1>
          </div>

          {/* Stepper progress stepper */}
          <div className="flex items-center gap-2.5 text-[11px] font-semibold text-slate-400">
            <span className="text-[var(--gold)] font-bold">Cart</span>
            <span className="h-[1px] w-6 bg-slate-200"></span>
            <span
              className={
                activeStep === "shipping"
                  ? "text-blue-600 font-bold"
                  : isAddressCompleted
                    ? "text-[var(--gold)]"
                    : ""
              }
            >
              Shipping
            </span>
            <span className="h-[1px] w-6 bg-slate-200"></span>
            <span
              className={
                activeStep === "payment" ? "text-blue-600 font-bold" : ""
              }
            >
              Payment
            </span>
            <span className="h-[1px] w-6 bg-slate-200"></span>
            <span
              className={
                activeStep === "review" ? "text-green-600 font-bold" : ""
              }
            >
              Review
            </span>
          </div>
        </div>

        {isCartLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-[var(--gold)]" />
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
                There are no items currently queued for checkout.
              </p>
            </div>
            <Button onClick={() => router.push("/")} className="btn-primary">
              Continue Browsing
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] items-start">
            {/* Left Section: Modular Accordion Stepper */}
            <div className="space-y-10">
              {/* Stepper Page Navigation */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveStep("shipping")}
                  className={`h-9 px-4 rounded-lg text-xs font-semibold ${
                    activeStep === "shipping"
                      ? "border-blue-500 bg-blue-500/5 text-blue-700"
                      : "border-slate-200"
                  }`}
                >
                  1. Shipping Setup
                </Button>
                <Button
                  type="button"
                  disabled={!isAddressCompleted}
                  onClick={() => setActiveStep("payment")}
                  className={`h-9 px-4 rounded-lg text-xs font-semibold ${
                    activeStep === "payment"
                      ? "border-blue-500 bg-blue-500/5 text-blue-700"
                      : "border-slate-200"
                  }`}
                  variant="outline"
                >
                  2. Secure Payment
                </Button>
              </div>

              {activeStep === "shipping" ? (
                <div className="space-y-10">
                  {/* Address Selector Component */}
                  <AddressSelector
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={(id) => {
                      setSelectedAddressId(id);
                      setIsAddressCompleted(true);
                    }}
                    addresses={addresses}
                    onAddAddress={handleAddAddress}
                    onUpdateAddress={handleUpdateAddress}
                  />

                  <Separator className="border-slate-100" />

                  {/* Shipping Method Component */}
                  <ShippingMethodSelector
                    selectedMethodId={shippingMethod}
                    onSelectMethod={(id) => {
                      setShippingMethod(id);
                      setIsShippingCompleted(true);
                    }}
                    subtotal={subtotal}
                  />

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="button"
                      disabled={!isAddressCompleted}
                      onClick={() => setActiveStep("payment")}
                      className="btn-primary h-11 px-8 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 transition-all text-slate-100"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Payment Selector Component */}
                  <PaymentSelector
                    selectedPayment={selectedPayment}
                    onChangePayment={setSelectedPayment}
                  />

                  <div className="pt-2 flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveStep("shipping")}
                      className="h-11 px-4 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-1 text-slate-500"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Shipping
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky order summary */}
            <div className="space-y-6 lg:sticky lg:top-24">
              {/* Order Summary Component */}
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shippingCost={shippingCost}
                discountAmount={discountAmount}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
                selectedPayment={selectedPayment}
                isSubmitting={loading}
                onPlaceOrder={handlePlaceOrder}
                couponBoxNode={
                  <CouponBox
                    coupon={coupon}
                    onCouponChange={setCoupon}
                    appliedPromo={appliedPromo}
                    onApplyCoupon={handleApplyCoupon}
                    onRemoveCoupon={handleRemoveCoupon}
                  />
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* SUCCESS UX MODAL */}
      <SuccessModal
        isOpen={orderPlaced}
        orderId={placedOrderId}
        onContinueShopping={() => {
          setOrderPlaced(false);
          router.push("/");
        }}
        onViewOrders={() => {
          setOrderPlaced(false);
          if (placedOrderId) {
            router.push(`/orders/${placedOrderId}/track`);
          } else {
            router.push("/orders");
          }
        }}
      />
    </>
  );
}

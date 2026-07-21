import { ApiService } from "./apiservices";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export interface RazorpayOptions {
  keyId?: string;
  orderId: string;
  amount: number; // in paise
  currency?: string;
  name?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (paymentResult: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<void> | void;
  onDismiss?: () => void;
}

export const openRazorpayCheckout = (options: RazorpayOptions): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const loaded = await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {
      reject(new Error("Razorpay SDK failed to load. Please check your internet connection."));
      return;
    }

    const razorpayKey =
      options.keyId ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      "rzp_test_TFnjdkFu74wVJr";

    const razorpayInstance = new window.Razorpay({
      key: razorpayKey,
      amount: options.amount,
      currency: options.currency || "INR",
      name: options.name || "Vault Vogue Lite",
      description: options.description || "Luxury Purchase Checkout",
      order_id: options.orderId,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          await options.onSuccess(response);
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      prefill: {
        name: options.customerName || "",
        email: options.customerEmail || "",
        contact: options.customerPhone || "",
      },
      theme: {
        color: "#C5A880", // Gold theme accent
      },
      modal: {
        ondismiss: () => {
          options.onDismiss?.();
          resolve(); // Resolve (not reject) on dismiss so finally still runs cleanly
        },
      },
    });

    razorpayInstance.open();
  });
};

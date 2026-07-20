export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // If already loaded, return true
    if ("Razorpay" in window) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://razorpay.com";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

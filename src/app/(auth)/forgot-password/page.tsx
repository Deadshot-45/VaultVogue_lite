"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, KeyRound, ArrowRight, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/apiservices";

type ApiResponse = {
  success: boolean;
  message: string;
  data: any;
  token?: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email or phone number.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("email : ", email);
      const response = await api.post<ApiResponse>(
        "/api/authController/forgot-password",
        {
          email: email,
        },
      );

      console.log("response : ", response);
      if (response.data?.success) {
        toast.success("Verification code sent successfully.");
        setStep(2);
      } else {
        toast.error(response.data?.message || "Failed to send code.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to send code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // NOTE: Depending on your backend API, you would verify the OTP here
      // or redirect to a reset password page passing the email/OTP along.
      // Example: await ApiService.post("/authController/verify-otp", { email, otp });

      const response = await api.post<ApiResponse>(
        "/api/ekycController/verify-otp",
        {
          identifier: email,
          otp: otp,
        },
      );

      console.log("response : ", response.data.token);

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      toast.success(response.data.message || "Code verified successfully.");
      setStep(3);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Invalid verification code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post<ApiResponse>(
        "/api/authController/reset-password",
        {
          confirmPassword: confirmPassword,
          password: password,
          identifier:email
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success(response.data.message || "Password changed successfully.");
      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to reset password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Reset Security Key"
      description={
        step === 1
          ? "Enter your registered email address or phone number to receive a secure 6-digit verification code."
          : step === 2
          ? `We've sent a 6-digit verification code to ${email}.`
          : "Create a new strong security key for your account."
      }
      footerText="Remember your key?"
      footerLink="/login"
      footerLinkLabel="Sign In"
    >
      {step === 1 && (
        <form className="space-y-6" onSubmit={handleSendOtp}>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]"
            >
              Atelier Email / Number
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="text"
                placeholder="you@domain.com or +123456789"
                className="h-12 pl-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          <button
            className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Code..." : "Send Verification Code"}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="space-y-6" onSubmit={handleVerifyOtp}>
          <div className="space-y-2">
            <Label
              htmlFor="otp"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]"
            >
              6-Digit Verification Code
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                className="h-12 pl-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)] tracking-[0.75em] text-center font-medium"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^A-Za-z0-9]/g, ""));
                  setError("");
                }}
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          <button
            className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider mt-2 disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-[var(--gold)] transition-colors flex items-center justify-center gap-1 mx-auto"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
            >
              <ArrowLeft className="h-3 w-3" />
              Use a different email/number
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form className="space-y-6" onSubmit={handleResetPassword}>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]"
            >
              New Security Key
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new security key"
                className="h-12 pl-11 pr-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]"
            >
              Confirm Security Key
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new security key"
                className="h-12 pl-11 pr-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          <button
            className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Security Key"}
            {!isSubmitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

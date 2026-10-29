"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { setCookieWithExpiry } from "@/lib/auth";
import { authService } from "@/lib/services/authServices";
import { handleGoogleLogin } from "@/lib/utility/socialAuth";
import { backupRecovery } from "@/lib/utility/backupRecovery";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import { gsap } from "gsap";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowUpRight,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

export type AuthMode = "signin" | "signup";

export interface AuthPageProps {
  initialMode?: AuthMode;
}

// ── Validation Schemas ──────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters."),
    email: z.string().trim().email("Enter a valid email address."),
    phoneNumber: z
      .string()
      .trim()
      .min(8, "Phone number must be at least 8 digits.")
      .max(15, "Phone number is too long.")
      .regex(/^[0-9+ -]+$/, "Enter numbers and telephone format only."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z
      .string()
      .min(6, "Please confirm your password."),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms & Conditions and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

interface FormState {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  termsAccepted: boolean;
}

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
  termsAccepted: false,
};

const getSafeRedirect = (redirectParam: string | null) => {
  if (!redirectParam) return null;
  const decoded = decodeURIComponent(redirectParam);
  if (decoded.startsWith("/") && !decoded.startsWith("//")) {
    return decoded;
  }
  if (!decoded.startsWith("/") && !decoded.includes(":") && !decoded.startsWith("//")) {
    return `/${decoded}`;
  }
  return null;
};

export function AuthPage({ initialMode = "signin" }: AuthPageProps) {
  const searchParams = useSearchParams();
  const redirect = searchParams ? searchParams.get("redirect") : null;
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Entrance GSAP animation
  useEffect(() => {
    if (isReducedMotion() || !formCardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        formCardRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [mode]);

  // Handle in-page tab switching between Sign In and Create Account
  const handleSwitchMode = useCallback(
    (newMode: AuthMode) => {
      if (isSubmitting || newMode === mode) return;

      setMode(newMode);
      setFieldErrors({});
      setGeneralError("");

      // Preserve entered email, reset passwords for security
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      // Smoothly reset the right side scroll position to the top
      if (rightPanelRef.current) {
        rightPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Synchronize browser address bar smoothly without reloading or leaving the page
      const basePath = newMode === "signin" ? "/login" : "/register";
      const targetUrl = redirect
        ? `${basePath}?redirect=${encodeURIComponent(redirect)}`
        : basePath;

      if (typeof window !== "undefined") {
        window.history.pushState(null, "", targetUrl);
      }
    },
    [isSubmitting, mode, redirect]
  );

  const handleFieldChange =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val =
        field === "rememberMe" || field === "termsAccepted"
          ? e.target.checked
          : e.target.value;

      setForm((prev) => ({ ...prev, [field]: val }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      setGeneralError("");
    };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError("");
    setFieldErrors({});

    if (mode === "signin") {
      const parsed = loginSchema.safeParse({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });

      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as string;
          if (!errors[key]) errors[key] = issue.message;
        }
        setFieldErrors(errors);
        setGeneralError("Please verify the required fields.");
        return;
      }

      setIsSubmitting(true);

      try {
        const signInPromise = authService.signIn(
          parsed.data.email,
          parsed.data.password
        );

        toast.promise(signInPromise, {
          loading: "Authenticating Maison credentials...",
          success: "Welcome back to VAULT VOGUE",
          error: (err: any) => err?.message || "Sign in failed",
        });

        const response = await signInPromise;
        const loggedInUser = response?.data?.user ?? null;
        const token = response?.data?.token ?? "";

        if (loggedInUser?.email) {
          backupRecovery.createBackup(loggedInUser.email);
        }

        dispatch(
          setCredentials({
            token,
            user: loggedInUser,
          })
        );

        await queryClient.invalidateQueries({ queryKey: ["cart"] });

        setCookieWithExpiry(
          process.env.AUTH_COOKIE_KEY || "vault_vogue_token",
          token,
          form.rememberMe ? 30 : 2,
          form.rememberMe ? "days" : "hours"
        );

        const targetPath = getSafeRedirect(redirect);
        if (targetPath) {
          window.location.href = targetPath;
        } else if (loggedInUser?.role === "seller") {
          window.location.href = "/seller/dashboard";
        } else {
          window.location.href = "/";
        }
      } catch (err: any) {
        setGeneralError(
          err?.message || "Invalid credentials. Please re-check and try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Create Account (Sign Up)
      const parsed = signupSchema.safeParse({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        confirmPassword: form.confirmPassword,
        termsAccepted: form.termsAccepted,
      });

      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as string;
          if (!errors[key]) errors[key] = issue.message;
        }
        setFieldErrors(errors);
        setGeneralError("Please resolve the highlighted fields.");
        return;
      }

      setIsSubmitting(true);

      try {
        const signUpPromise = authService.signUp({
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          phoneNumber: parsed.data.phoneNumber,
          password: parsed.data.password,
        });

        toast.promise(signUpPromise, {
          loading: "Creating your VAULT VOGUE account...",
          success: "Maison account registered successfully",
          error: (err: any) => err?.message || "Registration failed",
        });

        const response = await signUpPromise;

        const user = response?.data?.user;
        const token = response?.data?.token;

        if (user && token) {
          dispatch(setCredentials({ token, user }));
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
          setCookieWithExpiry(
            process.env.AUTH_COOKIE_KEY || "vault_vogue_token",
            token,
            2,
            "hours"
          );
          const targetPath = getSafeRedirect(redirect);
          window.location.href = targetPath || "/";
        } else {
          // Switch to sign in tab in place with toast notification
          toast.success("Account created. Please sign in with your credentials.");
          handleSwitchMode("signin");
        }
      } catch (err: any) {
        setGeneralError(
          err?.message || "Registration failed. An account with this email may already exist."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Google Social Login handler
  const handleSocialGoogle = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setGeneralError("");

    try {
      const loginPromise = handleGoogleLogin();

      toast.promise(loginPromise, {
        loading: "Connecting with Google...",
        success: "Welcome to VAULT VOGUE",
        error: (err: any) => {
          if (
            err?.code === "auth/popup-closed-by-user" ||
            err?.code === "auth/cancelled-popup-request"
          ) {
            return "Google sign-in was cancelled.";
          }
          return "Google authentication failed.";
        },
      });

      const response = await loginPromise;
      const token = response?.data?.token ?? response?.token;
      const user = response?.data?.user ?? response?.user;

      if (token && user) {
        if (user.email) {
          backupRecovery.createBackup(user.email);
        }
        dispatch(setCredentials({ token, user }));
        await queryClient.invalidateQueries({ queryKey: ["cart"] });
        setCookieWithExpiry(
          process.env.AUTH_COOKIE_KEY || "vault_vogue_token",
          token,
          2,
          "hours"
        );

        const targetPath = getSafeRedirect(redirect);
        if (targetPath) {
          window.location.href = targetPath;
        } else if (user.role === "seller") {
          window.location.href = "/seller/dashboard";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err: any) {
      if (
        err?.code !== "auth/popup-closed-by-user" &&
        err?.code !== "auth/cancelled-popup-request"
      ) {
        setGeneralError(err?.message || "Google sign-in failed. Please try email login.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen lg:h-screen w-full bg-[var(--vault-bg)] text-[var(--vault-ink)] overflow-hidden transition-colors duration-300"
    >
      <div className="grid min-h-screen lg:h-screen w-full grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* ─── LEFT: Editorial Fashion Campaign Panel (Exact screen height, fixed) ─── */}
        <div className="relative hidden lg:col-span-5 xl:col-span-6 lg:flex flex-col justify-between h-screen overflow-hidden p-10 xl:p-14 border-r border-[var(--vault-line)] bg-[var(--vault-panel)] select-none">
          {/* Background image */}
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85"
            alt="VAULT VOGUE Editorial Campaign"
            fill
            priority
            sizes="(max-width: 1280px) 45vw, 50vw"
            className="object-cover object-center"
          />

          {/* Luxury contrast gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080B12]/95 via-[#080B12]/60 to-[#080B12]/35" />

          {/* Top Brand Bar */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <span className="font-serif text-2xl font-light tracking-[0.2em] text-white uppercase group-hover:text-[var(--vault-accent)] transition-colors">
                VAULT VOGUE
              </span>
            </Link>
            <div className="inline-flex items-center gap-2 border border-white/20 bg-black/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--vault-accent)] backdrop-blur-md">
              <ShieldCheck className="h-3 w-3 text-[var(--vault-accent)]" />
              Authenticated Gateway
            </div>
          </div>

          {/* Middle Storytelling Block */}
          <div className="relative z-10 max-w-lg space-y-6 my-auto py-12">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--vault-accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--vault-accent)]" />
              Maison Portal · Architecture &amp; Expression
            </div>

            <h1 className="font-serif text-4xl xl:text-5xl 2xl:text-6xl font-light uppercase tracking-tight text-white leading-[1.08]">
              YOUR STYLE. <br />
              <span className="italic text-[var(--vault-accent)] font-normal">
                YOUR WORLD.
              </span>
            </h1>

            <p className="font-sans text-sm xl:text-base font-light text-white/80 leading-relaxed max-w-md">
              Step into a world of timeless essentials and modern expression.
              Access your personal archive, bespoke orders, and private releases.
            </p>

            {/* Value Tenets Strip */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/15">
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-accent)] font-semibold">
                  01 // Provenance
                </p>
                <p className="text-xs text-white/70 font-light">
                  NFC cryptographic garment authenticity.
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-accent)] font-semibold">
                  02 // Private Archive
                </p>
                <p className="text-xs text-white/70 font-light">
                  Priority access to limited collection capsules.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Coordinates & Direct Link */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-6 text-white/60 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span>PARIS · INDORE · TOKYO · MILAN</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-[var(--vault-accent)] transition-colors"
            >
              <span>Storefront</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* ─── RIGHT: Authentication Panel (Independent Scroll, Full Screen Height) ─── */}
        <div
          ref={rightPanelRef}
          className="lg:col-span-7 xl:col-span-6 h-screen overflow-y-auto overflow-x-hidden flex flex-col px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--vault-line)] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[var(--vault-accent)]"
        >
          <div
            ref={formCardRef}
            className="mx-auto my-auto w-full max-w-md py-10 sm:py-14 space-y-7"
          >
            {/* Mobile Brand Header */}
            <div className="flex items-center justify-between lg:hidden border-b border-[var(--vault-line)] pb-5">
              <Link href="/" className="font-serif text-xl font-light tracking-[0.2em] text-[var(--vault-ink)] uppercase">
                VAULT VOGUE
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)] hover:text-[var(--vault-accent)]"
              >
                Storefront <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Segmented Mode Switcher Tabs */}
            <div className="space-y-3">
              <div
                role="tablist"
                aria-label="Authentication Mode"
                className="grid grid-cols-2 p-1 rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-bg)]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signin"}
                  disabled={isSubmitting}
                  onClick={() => handleSwitchMode("signin")}
                  className={`rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === "signin"
                      ? "bg-[var(--vault-accent)] text-white shadow-sm"
                      : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signup"}
                  disabled={isSubmitting}
                  onClick={() => handleSwitchMode("signup")}
                  className={`rounded-xl py-2.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    mode === "signup"
                      ? "bg-[var(--vault-accent)] text-white shadow-sm"
                      : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Dynamic Header Titles */}
              <div className="text-left pt-1">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
                  {mode === "signin" ? "Maison Member Access" : "Join The Collective"}
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[var(--vault-ink)] mt-1.5">
                  {mode === "signin" ? "Welcome Back" : "Create Your Account"}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[var(--vault-muted)] mt-1.5 font-light">
                  {mode === "signin"
                    ? "Sign in to continue your VAULT VOGUE experience."
                    : "Join VAULT VOGUE and discover your next icon."}
                </p>
              </div>
            </div>

            {/* Social Authentication: Google */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleSocialGoogle}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] hover:border-[var(--vault-accent)]/50 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-[var(--vault-ink)] transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <FcGoogle className="h-5 w-5" />
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-[var(--vault-line)]" />
                <span className="flex-shrink mx-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--vault-muted)]">
                  Or with Atelier Credentials
                </span>
                <div className="flex-grow border-t border-[var(--vault-line)]" />
              </div>
            </div>

            {/* ── Form Section ── */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Full Name (Sign Up only) */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-fullName"
                    className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vault-muted)]"
                  >
                    Full Name <span className="text-[var(--vault-accent)]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--vault-muted)]" />
                    <input
                      id="auth-fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="Alexandra Chen"
                      value={form.fullName}
                      onChange={handleFieldChange("fullName")}
                      aria-invalid={!!fieldErrors.fullName}
                      className="w-full rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] pl-11 pr-4 py-3 text-xs sm:text-sm text-[var(--vault-ink)] font-medium focus:border-[var(--vault-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vault-accent)] transition-colors"
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-email"
                  className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vault-muted)]"
                >
                  Email Address <span className="text-[var(--vault-accent)]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--vault-muted)]" />
                  <input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={form.email}
                    onChange={handleFieldChange("email")}
                    aria-invalid={!!fieldErrors.email}
                    className="w-full rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] pl-11 pr-4 py-3 text-xs sm:text-sm text-[var(--vault-ink)] font-medium focus:border-[var(--vault-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vault-accent)] transition-colors"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Number (Sign Up only) */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-phone"
                    className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vault-muted)]"
                  >
                    Telephone / WhatsApp <span className="text-[var(--vault-accent)]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--vault-muted)]" />
                    <input
                      id="auth-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                      value={form.phoneNumber}
                      onChange={handleFieldChange("phoneNumber")}
                      aria-invalid={!!fieldErrors.phoneNumber}
                      className="w-full rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] pl-11 pr-4 py-3 text-xs sm:text-sm text-[var(--vault-ink)] font-medium focus:border-[var(--vault-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vault-accent)] transition-colors"
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">
                      {fieldErrors.phoneNumber}
                    </p>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth-password"
                    className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vault-muted)]"
                  >
                    Security Key / Password <span className="text-[var(--vault-accent)]">*</span>
                  </label>
                  {mode === "signin" && (
                    <Link
                      href="/forgot-password"
                      className="font-mono text-[10px] text-[var(--vault-accent)] hover:underline uppercase tracking-wider"
                    >
                      Forgot key?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--vault-muted)]" />
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleFieldChange("password")}
                    aria-invalid={!!fieldErrors.password}
                    className="w-full rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] pl-11 pr-11 py-3 text-xs sm:text-sm text-[var(--vault-ink)] font-medium focus:border-[var(--vault-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vault-accent)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--vault-muted)] hover:text-[var(--vault-ink)] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password (Sign Up only) */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="auth-confirmPassword"
                    className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--vault-muted)]"
                  >
                    Confirm Security Key <span className="text-[var(--vault-accent)]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--vault-muted)]" />
                    <input
                      id="auth-confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleFieldChange("confirmPassword")}
                      aria-invalid={!!fieldErrors.confirmPassword}
                      className="w-full rounded-2xl border border-[var(--vault-line)] bg-[var(--vault-panel)] pl-11 pr-11 py-3 text-xs sm:text-sm text-[var(--vault-ink)] font-medium focus:border-[var(--vault-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--vault-accent)] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--vault-muted)] hover:text-[var(--vault-ink)] transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Options & Policies */}
              {mode === "signin" ? (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 text-xs text-[var(--vault-muted)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.rememberMe}
                      onChange={handleFieldChange("rememberMe")}
                      className="h-4 w-4 rounded border-[var(--vault-line)] accent-[var(--vault-accent)] cursor-pointer"
                    />
                    <span>Remember my details for 30 days</span>
                  </label>
                </div>
              ) : (
                <div className="pt-2 space-y-1">
                  <label className="flex items-start gap-2.5 text-xs text-[var(--vault-muted)] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.termsAccepted}
                      onChange={handleFieldChange("termsAccepted")}
                      aria-invalid={!!fieldErrors.termsAccepted}
                      className="h-4 w-4 mt-0.5 rounded border-[var(--vault-line)] accent-[var(--vault-accent)] cursor-pointer"
                    />
                    <span className="leading-relaxed">
                      I accept the{" "}
                      <Link
                        href="/terms-and-conditions"
                        target="_blank"
                        className="text-[var(--vault-accent)] underline hover:opacity-80"
                      >
                        Terms &amp; Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        className="text-[var(--vault-accent)] underline hover:opacity-80"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {fieldErrors.termsAccepted && (
                    <p className="text-[11px] text-rose-500 font-medium">
                      {fieldErrors.termsAccepted}
                    </p>
                  )}
                </div>
              )}

              {/* General Error Banner */}
              {generalError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-500 text-center">
                  {generalError}
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--vault-accent)] hover:brightness-110 py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-white shadow-md active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{mode === "signin" ? "Signing In..." : "Creating Account..."}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "signin" ? "Sign In to Maison" : "Create Account"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Mode Switch Link */}
            <div className="pt-2 text-center border-t border-[var(--vault-line)]">
              {mode === "signin" ? (
                <p className="text-xs text-[var(--vault-muted)]">
                  New to VAULT VOGUE?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode("signup")}
                    disabled={isSubmitting}
                    className="font-semibold text-[var(--vault-accent)] uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-[var(--vault-muted)]">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode("signin")}
                    disabled={isSubmitting}
                    className="font-semibold text-[var(--vault-accent)] uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Sign in to Maison
                  </button>
                </p>
              )}
            </div>

            {/* Microcopy disclaimer */}
            <p className="font-mono text-[10px] text-[var(--vault-muted)]/70 text-center uppercase tracking-wider">
              Encrypted via 256-Bit SSL · All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

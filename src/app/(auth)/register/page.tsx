"use client";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/services/authServices";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { handleGoogleLogin } from "@/lib/utility/socialAuth";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { setCookieWithExpiry } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";

const stringField = (schema: z.ZodString) =>
  z.preprocess((value) => (typeof value === "string" ? value : ""), schema);

const signupSchema = z
  .object({
    fullName: stringField(
      z.string().trim().min(2, "Full name must be at least 2 characters."),
    ),
    email: stringField(z.string().trim().email("Enter a valid email address.")),
    phoneNumber: stringField(
      z
        .string()
        .trim()
        .min(8, "Phone number must be at least 8 digits.")
        .max(15, "Phone number is too long.")
        .regex(/^[0-9]+$/, "Only numbers are allowed."),
    ),
    password: stringField(
      z.string().min(6, "Password must be at least 6 characters."),
    ),
    confirmPassword: stringField(z.string().min(6, "Confirm your password.")),
    termsAccepted: z.boolean().refine((value) => value, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const initialState: SignupFormState = {
  fullName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

export default function CreateAccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SignupFormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SignupFormState, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: keyof SignupFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "termsAccepted"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;

      setForm((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      setError("");
    };

  const handleSignup: React.FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();

    const normalizedForm = {
      fullName: form.fullName ?? "",
      email: form.email ?? "",
      phoneNumber: form.phoneNumber ?? "",
      password: form.password ?? "",
      confirmPassword: form.confirmPassword ?? "",
      termsAccepted: !!form.termsAccepted,
    };

    const parsed = signupSchema.safeParse(normalizedForm);

    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof SignupFormState, string>> = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof SignupFormState | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }

      setFieldErrors(nextErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await toast.promise(
        authService.signUp({
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          password: parsed.data.password,
          phoneNumber: parsed.data.phoneNumber,
        }),
        {
          loading: "Creating your Maison account...",
          success: (res) => {
            if (!res.success) {
              throw new Error(res.message);
            }
            router.push("/login");
            return res.message || "Maison account created successfully";
          },
          error: (err) => err.message || "Signup failed",
        },
      );
    } catch (err) {
      console.log(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider === "Google") {
      setIsSubmitting(true);
      setError("");
      try {
        const loginPromise = handleGoogleLogin();
        
        toast.promise(loginPromise, {
          loading: "Signing you up with Google...",
          success: "Welcome back to Vault-Vogue Maison",
          error: (err: any) => {
            if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
              return "Google sign-in was cancelled.";
            }
            return "Google registration failed.";
          },
        });

        const response = await loginPromise;

        // Support nested or direct payloads
        const token = response?.data?.token ?? response?.token;
        const user = response?.data?.user ?? response?.user;

        if (token && user) {
          dispatch(
            setCredentials({
              token,
              user,
            }),
          );
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
          setCookieWithExpiry(
            process.env.AUTH_COOKIE_KEY || "vault_vogue_token",
            token,
            2,
            "hours",
          );
          router.push("/");
        } else {
          setError("OAuth payload format is incorrect or incomplete.");
        }
      } catch (err: any) {
        if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
          // Do not display hard page error for user cancellation
          console.log("Google sign-in cancelled by user.");
        } else {
          setError(err instanceof Error ? err.message : "Google signup failed");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.success(`Redirecting to ${provider} authentication...`);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      description="Join Vault-Vogue Maison to receive complimentary shipping, track your catalog orders, and get early private sale access."
      footerText="Already registered?"
      footerLink="/login"
      footerLinkLabel="Sign in"
    >
      <form className="space-y-5" onSubmit={handleSignup}>
        
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Full Name
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="e.g. Aarav Shah"
              className="h-11 pl-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              value={form.fullName}
              onChange={handleChange("fullName")}
              aria-invalid={!!fieldErrors.fullName}
            />
          </div>
          {fieldErrors.fullName && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@domain.com"
              className="h-11 pl-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              value={form.email}
              onChange={handleChange("email")}
              aria-invalid={!!fieldErrors.email}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <Label htmlFor="phoneNumber" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Phone Number
          </Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="9876543210"
              className="h-11 pl-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              value={form.phoneNumber}
              onChange={handleChange("phoneNumber")}
              aria-invalid={!!fieldErrors.phoneNumber}
            />
          </div>
          {fieldErrors.phoneNumber && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.phoneNumber}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Create Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              className="h-11 pl-11 pr-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              value={form.password}
              onChange={handleChange("password")}
              aria-invalid={!!fieldErrors.password}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className="h-11 pl-11 pr-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              aria-invalid={!!fieldErrors.confirmPassword}
            />
          </div>
          {fieldErrors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 accent-[var(--gold)] rounded"
            checked={form.termsAccepted}
            onChange={handleChange("termsAccepted")}
          />
          <span>
            I agree to the{" "}
            <Link
              href="#"
              className="font-medium text-[var(--gold)] hover:opacity-85 transition-opacity"
            >
              Terms and Conditions
            </Link>{" "}
            and Privacy Policy.
          </span>
        </label>
        {fieldErrors.termsAccepted && (
          <p className="text-xs text-red-500 font-medium">{fieldErrors.termsAccepted}</p>
        )}

        {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

        {/* Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Maison Account"}
          </button>
          <button
            type="button"
            className="rounded-xl border border-border/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted py-3 transition-colors cursor-pointer"
            onClick={() => {
              setForm(initialState);
              setFieldErrors({});
              setError("");
            }}
          >
            Reset Details
          </button>
        </div>

        {/* Social Connects */}
        <div className="space-y-3 pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/20"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Or Register With
            </span>
            <div className="flex-grow border-t border-border/20"></div>
          </div>

          <div className="flex justify-center items-center gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center px-2 justify-center gap-2 rounded-xl border border-border/40 bg-background/40 hover:bg-muted py-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)] transition-colors cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.664 0-8.384-3.666-8.384-8.299 0-4.632 3.72-8.3 8.384-8.3 2.215 0 4.115.82 5.602 2.225l3.14-3.14A12.44 12.44 0 0012.24 0C5.556 0 0 5.4 0 12.083 0 18.767 5.556 24 12.24 24c6.72 0 11.238-4.7 11.238-11.4 0-.766-.08-1.503-.228-2.315H12.24z"
                />
              </svg>
              Google
            </button>
            {/* <button
              type="button"
              onClick={() => handleSocialLogin("Apple")}
              className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-background/40 hover:bg-muted py-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)] transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.62.71-1.16 1.85-1.02 2.96 1.11.09 2.24-.57 2.95-1.4"
                />
              </svg>
              Apple
            </button> */}
          </div>
        </div>

      </form>
    </AuthShell>
  );
}

"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/api/authServices";
import { setCookieWithExpiry } from "@/lib/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean(),
});

type LoginFormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const initialState: LoginFormState = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<LoginFormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof LoginFormState, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (field: keyof LoginFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "rememberMe"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;

      setForm((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      setError("");
    };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(form);

    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof LoginFormState, string>> = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LoginFormState | undefined;
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
      const signInPromise = authService.signIn(
        parsed.data.email,
        parsed.data.password,
      );

      toast.promise(signInPromise, {
        loading: "Signing you into the Maison...",
        success: "Welcome back to Vault-Vogue Maison",
        error: "Sign in failed",
      });

      const response = await signInPromise;

      dispatch(
        setCredentials({
          token: response?.data?.token ?? "",
          user: response?.data?.user ?? null,
        }),
      );
      await queryClient.invalidateQueries({ queryKey: ["cart"] });
      setCookieWithExpiry(
        process.env.AUTH_COOKIE_KEY || "vault_vogue_token",
        response?.data?.token ?? "",
        2,
        "hours",
      );
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`Redirecting to ${provider} authentication...`);
  };

  return (
    <AuthShell
      title="Welcome Back"
      description="Sign in to your Vault-Vogue Maison account to access your orders, saved items, and personalized edits."
      footerText="New to the Maison?"
      footerLink="/register"
      footerLinkLabel="Create an account"
    >
      <form className="space-y-6" onSubmit={handleLogin}>
        
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Atelier Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@domain.com"
              className="h-12 pl-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              value={form.email}
              onChange={handleChange("email")}
              aria-invalid={!!fieldErrors.email}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)]">
            Security Key / Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your security key"
              className="h-12 pl-11 pr-11 rounded-xl border-border/40 bg-background/50 focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
              value={form.password}
              onChange={handleChange("password")}
              aria-invalid={!!fieldErrors.password}
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
          {fieldErrors.password && (
            <p className="text-xs text-red-500 font-medium">{fieldErrors.password}</p>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              className="accent-[var(--gold)] rounded"
              checked={form.rememberMe}
              onChange={handleChange("rememberMe")}
            />
            Remember my details
          </label>

          <Link
            href="#"
            className="font-medium text-[var(--gold)] hover:opacity-85 transition-opacity"
          >
            Forgot security key?
          </Link>
        </div>

        {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

        {/* Sign In Button */}
        <button
          className="btn-primary w-full py-3.5 text-xs font-semibold uppercase tracking-wider mt-2 disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In to Maison"}
        </button>

        {/* Google & Apple Social Login */}
        <div className="space-y-3 pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/20"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Or Connect With
            </span>
            <div className="flex-grow border-t border-border/20"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-background/40 hover:bg-muted py-3 text-xs font-semibold uppercase tracking-wider text-[var(--brand-text)] transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.664 0-8.384-3.666-8.384-8.299 0-4.632 3.72-8.3 8.384-8.3 2.215 0 4.115.82 5.602 2.225l3.14-3.14A12.44 12.44 0 0012.24 0C5.556 0 0 5.4 0 12.083 0 18.767 5.556 24 12.24 24c6.72 0 11.238-4.7 11.238-11.4 0-.766-.08-1.503-.228-2.315H12.24z"
                />
              </svg>
              Google
            </button>
            <button
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
            </button>
          </div>
        </div>

      </form>
    </AuthShell>
  );
}

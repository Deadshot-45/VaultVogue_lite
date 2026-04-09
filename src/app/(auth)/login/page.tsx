"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/api/authServices";
import { setCookieWithExpiry } from "@/lib/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";
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
        loading: "Signing you in...",
        success: "Login successful",
        error: "Sign in failed",
      });

      const response = await signInPromise;

      dispatch(
        setCredentials({
          token: response?.data?.token ?? "",
          user: response?.data?.user ?? null,
        }),
      );
      await queryClient.invalidateQueries({ queryKey: ["cart-details"] });
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

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your shopping experience."
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkLabel="Create one"
    >
      <form className="space-y-5" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-11 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/40"
            value={form.email}
            onChange={handleChange("email")}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email ? (
            <p className="text-sm text-destructive">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-11 rounded-lg pr-11 focus-visible:ring-2 focus-visible:ring-primary/40"
              value={form.password}
              onChange={handleChange("password")}
              aria-invalid={!!fieldErrors.password}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {fieldErrors.password ? (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="accent-primary"
              checked={form.rememberMe}
              onChange={handleChange("rememberMe")}
            />
            Remember me
          </label>

          <Link href="#" className="text-sm font-medium text-primary">
            Forgot password?
          </Link>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button
          className="h-11 w-full rounded-xl text-base font-semibold shadow-md transition hover:shadow-lg"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </AuthShell>
  );
}

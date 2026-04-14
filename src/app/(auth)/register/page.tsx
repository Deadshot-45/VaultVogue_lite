"use client";

import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/api/authServices";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

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
          loading: "Creating your account...",

          success: (res) => {
            if (!res.success) {
              throw new Error(res.message);
            }
            router.push("/login");
            return res.message || "Account created successfully";
          },

          error: (err) => err.message || "Signup failed",
        },
      );
    } catch (err) {
      // ❗ This only triggers if YOU throw manually (as above)
      console.log(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      description="Join Vault Vogue to track orders, save favorites, and shop curated drops faster."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkLabel="Sign in"
    >
      <form className="space-y-5" onSubmit={handleSignup}>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Aarav Shah"
            value={form.fullName}
            onChange={handleChange("fullName")}
            aria-invalid={!!fieldErrors.fullName}
          />
          {fieldErrors.fullName ? (
            <p className="text-sm text-destructive">{fieldErrors.fullName}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email ? (
            <p className="text-sm text-destructive">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="9876543210"
            value={form.phoneNumber}
            onChange={handleChange("phoneNumber")}
            aria-invalid={!!fieldErrors.phoneNumber}
          />
          {fieldErrors.phoneNumber ? (
            <p className="text-sm text-destructive">
              {fieldErrors.phoneNumber}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="pr-11"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              className="pr-11"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              aria-invalid={!!fieldErrors.confirmPassword}
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
          {fieldErrors.confirmPassword ? (
            <p className="text-sm text-destructive">
              {fieldErrors.confirmPassword}
            </p>
          ) : null}
        </div>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 accent-primary"
            checked={form.termsAccepted}
            onChange={handleChange("termsAccepted")}
          />
          <span>
            I agree to the{" "}
            <Link href="#" className="font-medium text-primary">
              Terms and Conditions
            </Link>
          </span>
        </label>
        {fieldErrors.termsAccepted ? (
          <p className="text-sm text-destructive">
            {fieldErrors.termsAccepted}
          </p>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
        <Button
          type="reset"
          variant="outline"
          className="w-full"
          onClick={() => {
            setForm(initialState);
            setFieldErrors({});
            setError("");
          }}
        >
          Reset
        </Button>
      </form>
    </AuthShell>
  );
}

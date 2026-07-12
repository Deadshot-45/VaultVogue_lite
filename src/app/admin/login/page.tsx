"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/slices/authSlice";
import { setCookieWithExpiry } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Gem } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Demo admin credentials (replace with real API call)
const DEMO_EMAIL    = 'admin@vaultvogue.com';
const DEMO_PASSWORD = 'admin123';

const schema = z.object({
  email:    z.string().trim().email('Enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  const [form,          setForm]          = useState({ email: '', password: '' });
  const [errors,        setErrors]        = useState<Partial<Record<'email' | 'password', string>>>({});
  const [globalError,   setGlobalError]   = useState('');
  const [showPassword,  setShowPassword]  = useState(false);
  const [isSubmitting,  setIsSubmitting]  = useState(false);

  const handleChange = (field: 'email' | 'password') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: undefined }));
      setGlobalError('');
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { if (i.path[0]) errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    if (parsed.data.email === DEMO_EMAIL && parsed.data.password === DEMO_PASSWORD) {
      dispatch(setCredentials({
        token: 'admin-demo-token-vault-vogue',
        user: { id: 'admin-001', email: DEMO_EMAIL, fullName: 'Vault Admin', role: 'admin' },
      }));
      setCookieWithExpiry('vault_vogue_token', 'admin-demo-token', 8, 'hours');
      toast.success('Welcome to the Admin Console');
      router.push('/admin/dashboard');
    } else {
      setGlobalError('Invalid credentials. Use demo credentials below.');
      toast.error('Authentication failed');
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="flex min-h-screen mx-auto items-center justify-center px-4 py-12"
      style={{ background: 'var(--background)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: 'color-mix(in oklch, var(--background) 90%, transparent)',
            border: '1px solid var(--gold-faint)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.10)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Top accent */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, var(--gold-soft), transparent)' }}
          />

          {/* Logo + Badge */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'var(--gold-faint)', border: '1px solid var(--gold-soft)' }}
              >
                <Gem className="h-5 w-5" style={{ color: 'var(--gold)' }} />
              </div>
              <div>
                <p className="section-label text-[10px]">Vault Vogue</p>
                <p className="text-xs text-muted-foreground">Admin Console</p>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest"
              style={{ border: '1px solid var(--gold-faint)', background: 'var(--gold-glow)', color: 'var(--gold)' }}
            >
              <ShieldCheck className="h-3 w-3" />
              Secure
            </div>
          </div>

          <h1
            className="font-cormorant text-4xl font-light tracking-tight"
            style={{ color: 'var(--brand-text)' }}
          >
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the Vault Vogue administration console.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-text)' }}>
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@vaultvogue.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  className="h-11 pl-10 rounded-xl"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-text)' }}>
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={form.password}
                  onChange={handleChange('password')}
                  className="h-11 pl-10 pr-10 rounded-xl"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {globalError && (
              <p className="text-center text-xs text-destructive font-medium">{globalError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-xs font-semibold uppercase tracking-widest mt-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Access Console'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div
            className="mt-6 rounded-xl p-4"
            style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-faint)' }}
          >
            <p className="section-label text-[9px] mb-2">Demo Credentials</p>
            <p className="text-xs text-muted-foreground"><span className="font-medium" style={{ color: 'var(--brand-text)' }}>Email:</span> admin@vaultvogue.com</p>
            <p className="text-xs text-muted-foreground mt-0.5"><span className="font-medium" style={{ color: 'var(--brand-text)' }}>Password:</span> admin123</p>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: 'var(--gold-faint)' }} />
            <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Admin Access Only</span>
            <div className="h-px flex-1" style={{ background: 'var(--gold-faint)' }} />
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Not an admin?{' '}
            <Link href="/" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--gold)' }}>
              Return to storefront
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

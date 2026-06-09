"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = ["Wholesale", "Retail"] as const;

type Step1 = { name: string; email: string; phone: string };
type Step2 = { role: string; password: string; confirm: string };
type Errors = Partial<Record<string, string>>;

// ─── Step progress bar ────────────────────────────────────────────────────────

function StepBar({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {([1, 2] as const).map((s, idx) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
              ${step > s
                ? "bg-amber-400 border-amber-400 text-zinc-950"
                : step === s
                ? "bg-amber-400 border-amber-400 text-zinc-950"
                : "bg-white border-zinc-300 text-zinc-400"}`}
          >
            {step > s ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : s}
          </div>
          {idx < 1 && (
            <div className={`w-16 sm:w-24 h-0.5 transition-all ${step >= 2 ? "bg-amber-400" : "bg-zinc-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────

function Field({
  label, name, type = "text", placeholder, value, onChange, error, autoComplete,
}: {
  label: string; name: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; error?: string; autoComplete?: string;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-zinc-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={isPassword ? (showPwd ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full border rounded-xl px-4 py-3 text-sm text-zinc-900 bg-zinc-50 placeholder:text-zinc-400 outline-none transition-all
            focus:ring-2 focus:ring-amber-400 focus:border-amber-400 focus:bg-amber-50/30
            ${isPassword ? "pr-11" : ""}
            ${error ? "border-red-400 bg-red-50/30" : "border-zinc-200"}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label="Toggle password"
          >
            {showPwd ? (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [s1, setS1] = useState<Step1>({ name: "", email: "", phone: "" });
  const [s2, setS2] = useState<Step2>({ role: "Retail", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});

  const setS1f = (k: keyof Step1) => (v: string) => {
    setS1((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const setS2f = (k: keyof Step2) => (v: string) => {
    setS2((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const validateStep1 = () => {
    const e: Errors = {};
    if (!s1.name.trim())                               e.name  = "Full name is required";
    if (!s1.email.trim())                              e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(s1.email))          e.email = "Enter a valid email";
    if (!s1.phone.trim())                              e.phone = "Phone is required";
    else if (s1.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e: Errors = {};
    if (!s2.password)                  e.password = "Password is required";
    else if (s2.password.length < 6)   e.password = "Minimum 6 characters";
    if (!s2.confirm)                   e.confirm  = "Please confirm your password";
    else if (s2.confirm !== s2.password) e.confirm = "Passwords do not match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400)); // replace with real API
    setLoading(false);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8 sm:p-10">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-md shadow-amber-200 shrink-0">
              <svg className="w-5 h-5 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-black text-zinc-900 leading-none tracking-tight">
                VOLTA<span className="text-amber-400">ZONE</span>
              </p>
              
            </div>
          </div>

          <h2 className="text-xl font-bold text-zinc-900 text-center mb-1">Create account</h2>
          <p className="text-sm text-zinc-400 text-center mb-7">
            {step === 1 ? "Enter your personal details" : "Set your role & password"}
          </p>

          <StepBar step={step} />

          {/* ── Step 1 ── */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5" noValidate>
              <Field label="Full name"      name="name"  placeholder="Arijit Kumar"        value={s1.name}  onChange={setS1f("name")}  error={errors.name}  autoComplete="name" />
              <Field label="Email address"  name="email" type="email" placeholder="you@voltazone.in" value={s1.email} onChange={setS1f("email")} error={errors.email} autoComplete="email" />
              <Field label="Phone number"   name="phone" type="tel"  placeholder="+91 98300 00000"   value={s1.phone} onChange={setS1f("phone")} error={errors.phone} autoComplete="tel" />

              <button
                type="submit"
                className="w-full bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-md hover:shadow-amber-200 active:scale-[0.98]"
              >
                Next
              </button>
            </form>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-5" noValidate>

              {/* Role selector */}
              <div>
                <label className="block text-sm font-semibold text-zinc-600 mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setS2((p) => ({ ...p, role: r }))}
                      className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all
                        ${s2.role === r
                          ? "bg-amber-400 border-amber-400 text-zinc-950"
                          : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-amber-300"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Password"         name="password" type="password" placeholder="Min. 6 characters"      value={s2.password} onChange={setS2f("password")} error={errors.password} autoComplete="new-password" />
              <Field label="Confirm password" name="confirm"  type="password" placeholder="Re-enter your password" value={s2.confirm}  onChange={setS2f("confirm")}  error={errors.confirm}  autoComplete="new-password" />

              {/* Terms */}
              <p className="text-xs text-zinc-400 text-center leading-relaxed">
                By registering you agree to VoltaZone's{" "}
                <span className="text-amber-500 font-semibold cursor-pointer hover:underline">Terms of Service</span>
                {" "}and{" "}
                <span className="text-amber-500 font-semibold cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-md hover:shadow-amber-200 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Creating account…
                  </span>
                ) : "Create account ✓"}
              </button>

              <button
                type="button"
                onClick={() => { setStep(1); setErrors({}); }}
                className="w-full text-sm text-zinc-400 hover:text-zinc-600 py-2 transition-colors"
              >
                Back
              </button>
            </form>
          )}

          {/* Login link */}
          <p className="text-center text-sm text-zinc-400 mt-7">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-500 hover:text-amber-600 font-bold transition-colors">
              Sign in
            </Link>
          </p>

        </div>

        <p className="text-center text-xs text-zinc-400 mt-5">
          © 2025 VoltaZone 
        </p>

      </div>
    </main>
  );
}

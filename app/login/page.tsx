"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim())                     e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Enter a valid email";
    if (!password)                         e.password = "Password is required";
    else if (password.length < 6)         e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // replace with real API call
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#F53827] shadow-sm p-8 sm:p-10">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            
            
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 text-center mb-8">Sign in to your account</h2>
          

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-zinc-600 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="admin@voltazone.in"
                className={`w-full border rounded-xl px-4 py-3 text-sm text-zinc-900 bg-zinc-50 placeholder:text-zinc-400 outline-none transition-all
                  focus:ring-2 focus:ring-[#42BD00] focus:border-[#42BD00] focus:bg-amber-50/30
                  ${errors.email ? "border-red-400 bg-red-50/30" : "border-[#42BD00]"}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-zinc-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="Enter your password"
                  className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-zinc-900 bg-zinc-50 placeholder:text-zinc-400 outline-none transition-all
                    focus:ring-2 focus:ring-[#42BD00] focus:border-[#42BD00] focus:bg-amber-50/30
                    ${errors.password ? "border-red-400 bg-red-50/30" : "border-[#42BD00]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? (
                    <svg className="w-4.5 h-4.5 w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                className="text-xs font-semibold text-[#F53827] hover:text-[#F53827] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F53827] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:bg-[#42BD00] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-xs text-zinc-400">or</span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            {/* Demo fill */}
            {/* <button
              type="button"
              onClick={() => { setEmail("admin@voltazone.in"); setPassword("admin123"); }}
              className="w-full border border-zinc-200 hover:border-[#F53827] text-zinc-500 hover:text-[#F53827] font-semibold py-3 rounded-xl text-sm transition-all bg-zinc-50 hover:bg-amber-50/40"
            >
              ⚡ Fill demo credentials
            </button> */}

          </form>

          {/* Register link */}
          <p className="text-center text-sm text-zinc-400 mt-7">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#F53827] hover:text-[#42BD00] font-bold transition-colors">
              Register
            </Link>
          </p>

        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-zinc-400 mt-5">
          © 2026 Hopper Enterprise 
        </p>

      </div>
    </main>
  );
}

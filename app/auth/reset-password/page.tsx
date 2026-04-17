"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const SERVER = process.env.NEXT_PUBLIC_API_URL ?? "";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type PageStatus = "validating" | "invalid" | "ready" | "success";

interface Props {
  params: Promise<{ token: string }>;
}

// ---------------------------------------------------------------------------
// Password strength
// ---------------------------------------------------------------------------
function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const map: Record<number, { label: string; color: string }> = {
    0: { label: "Too short", color: "bg-red-400" },
    1: { label: "Weak", color: "bg-orange-400" },
    2: { label: "Fair", color: "bg-yellow-400" },
    3: { label: "Good", color: "bg-lime-500" },
    4: { label: "Strong", color: "bg-emerald-500" },
  };

  return { score, ...map[score] };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ResetPasswordPage({ params }: Props) {
  // Next.js 15+ passes params as a Promise
  const { token } = use(params);

  const [pageStatus, setPageStatus] = useState<PageStatus>("validating");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Validate token on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setPageStatus("invalid");
      return;
    }

    axios
      .get(`${SERVER}/login/forget_password/validate_token/${token}`)
      .then(({ data }) => {
        setPageStatus(data.message === "success" ? "ready" : "invalid");
      })
      .catch(() => {
        setPageStatus("invalid");
        toast.error("Network error — could not validate reset link.");
      });
  }, [token]);

  // ── Submit handler ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pwd = newPassword.trim();

    if (pwd.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (pwd !== confirmPassword.trim()) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.patch(
        `${SERVER}/login/forget_password/change_password`,
        { token, password: pwd }
      );

      if (data.message === "success") {
        setPageStatus("success");
      } else {
        toast.error("Invalid or expired reset token. Please request a new link.");
      }
    } catch {
      toast.error("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(newPassword);

  const inputClass =
    "w-full py-4 pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-slate-900 dark:text-white outline-none focus:border-[#010427]/50 focus:ring-2 focus:ring-[#010427]/10 dark:focus:border-slate-500 placeholder:text-slate-400 transition-all duration-200";
  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010427] dark:group-focus-within:text-white transition-colors duration-200";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

      {/* ── Hero ── */}
      <div
        className="w-full md:w-1/2 min-h-[300px] md:min-h-[650px] bg-cover bg-center bg-no-repeat flex items-center justify-center p-10 md:p-16 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(1,4,39,0.72), rgba(1,4,39,0.72)), url('/images/login/bg1.webp')",
        }}
      >
        <div className="text-center max-w-sm">
          <div className="flex justify-center mb-5">
            <Image
              src="/images/login/slts-white2.png"
              alt="SLTS Logo"
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            Strict Liability Traffic System
          </h1>
          <p className="mt-4 text-base font-light text-slate-300">
            Choose a strong password to protect your account.
          </p>
        </div>
      </div>

      {/* ── Form panel ── */}
      <div className="w-full md:w-1/2 min-h-[650px] flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">

          {/* Validating */}
          {pageStatus === "validating" && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p className="font-medium">Validating reset link…</p>
            </div>
          )}

          {/* Invalid token */}
          {pageStatus === "invalid" && (
            <div className="text-center py-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#02073d] dark:text-white mb-3">
                Link Invalid or Expired
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                This password reset link is no longer valid. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block px-8 py-3 bg-[#010427] dark:bg-slate-800 text-white rounded-2xl font-bold hover:bg-[#02073d] transition-all"
              >
                Request New Link
              </Link>
            </div>
          )}

          {/* Success */}
          {pageStatus === "success" && (
            <div className="text-center py-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-[#02073d] dark:text-white mb-3">
                Password Updated!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Your password has been reset successfully. You can now sign in with
                your new password.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#010427] dark:bg-slate-800 text-white rounded-2xl font-bold hover:bg-[#02073d] transition-all"
              >
                Sign In Now
              </Link>
            </div>
          )}

          {/* Form */}
          {pageStatus === "ready" && (
            <>
              <div className="mb-8 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-[#02073d] dark:text-white mb-1">
                  Set New Password
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Must be at least 6 characters.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* New password */}
                <div className="mb-5">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative group">
                    <span className={iconClass}>
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      id="new-password"
                      type={showNew ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      aria-label={showNew ? "Hide password" : "Show password"}
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {newPassword && (
                    <div className="mt-2 px-1">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score
                                ? strength.color
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="mb-7">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <span className={iconClass}>
                      <Lock className="w-5 h-5" />
                    </span>
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${inputClass} ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                          : ""
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="mt-1.5 ml-1 text-sm text-red-500">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#010427] dark:bg-slate-800 text-white rounded-2xl text-base font-bold shadow-lg hover:bg-[#02073d] hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center mb-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <Link
                  href="/login"
                  className="w-full py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </form>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-center gap-6 mt-10 pt-5 border-t border-slate-100 dark:border-slate-800">
            {["Privacy", "Terms", "Compliance"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs font-medium text-slate-400 hover:text-[#010427] dark:hover:text-slate-300 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
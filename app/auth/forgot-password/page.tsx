"use client";

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/authService";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await authService.forgotPassword(email.trim())

            toast.success("Reset code sent to your email!")
            setSent(true)
            setTimeout(() => {
                router.push(`/auth/verify-forgot-password?email=${encodeURIComponent(email.trim())}`)
            }, 1500)
        } catch (error: unknown) {
            const e = error as { response?: { data?: { message?: string } } }
            setError(e.response?.data?.message ?? "Network error — please check your connection and try again.")
        } finally {
            setLoading(false)
        }
    }

    // Shared style tokens
    const inputBase =
        "w-full py-4 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-slate-900 dark:text-white outline-none focus:border-[#010427]/50 focus:ring-2 focus:ring-[#010427]/10 dark:focus:border-slate-500 placeholder:text-slate-400 transition-all duration-200"

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

            {/* ── Hero ── */}
            <div
                className="w-full md:w-1/2 min-h-75 md:min-h-162.5 bg-cover bg-center bg-no-repeat flex items-center justify-center p-10 md:p-16 text-white"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(1,4,39,0.72), rgba(1,4,39,0.72)), url('/images/login/bg1.webp')",
                }}
            >
                <div className="flex flex-col items-center text-center">
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
                        Use your registered email to reset your password.
                    </p>
                </div>
            </div>

            {/* ── Form ── */}
            <div className="w-full md:w-1/2 min-h-162.5 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">

                    {!sent ? (
                        <>
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl md:text-4xl font-bold text-[#02073d] dark:text-white mb-1">
                                    Forgot Password?
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    No worries — we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
                                {error && (
                                    <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>
                                )}
                                {/* Email */}
                                <div className="mb-6">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010427] dark:group-focus-within:text-white transition-colors duration-200">
                                            <Mail className="w-5 h-5" />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError("");
                                            }}
                                            className={inputBase}
                                            placeholder="admin@slts.com.ng"
                                        />
                                    </div>

                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-[#010427] dark:bg-slate-800 text-white rounded-2xl text-base font-bold shadow-lg hover:bg-[#02073d] dark:hover:bg-slate-700 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center mb-4"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Sending…
                                        </>
                                    ) : (
                                        "Send Reset Code"
                                    )}
                                </button>

                                {/* Back */}
                                <Link
                                    href="/auth/login"
                                    className="w-full py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Sign In
                                </Link>
                            </form>
                        </>
                    ) : (
                        /* ── Success state ── */
                        <div className="text-center py-8">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-[#02073d] dark:text-white mb-3">
                                Code Sent!
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-2">
                                We sent a password reset link to
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 break-all">
                                {email}
                            </p>
                            <p className="text-sm text-slate-400 mb-6">
                                Didn't receive it? Check your spam folder, or{" "}
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-[#010427] dark:text-blue-400 font-semibold hover:underline"
                                >
                                    try another email
                                </button>
                                .
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-[#010427] dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Return to Sign In
                            </Link>
                        </div>
                    )}

                    {/* ── Footer ── */}
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
"use client"

import React, { useState, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/services/authService"

// ---------------------------------------------------------------------------
// Step 3 (final) of the forgot-password flow.
//
// What this page does:
//   1. Reads reset_token from ?reset_token= URL param (set by verify page)
//   2. Collects new password + confirmation
//   3. Calls POST /auth/set-forgot-password
//   4. On success → redirects to /auth/login
// ---------------------------------------------------------------------------

function getStrength(pwd: string): { score: number; label: string; color: string } {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const map: Record<number, { label: string; color: string }> = {
        0: { label: "Too short", color: "bg-red-400" },
        1: { label: "Weak", color: "bg-orange-400" },
        2: { label: "Fair", color: "bg-yellow-400" },
        3: { label: "Good", color: "bg-lime-500" },
        4: { label: "Strong", color: "bg-emerald-500" },
    }
    return { score, ...map[score] }
}

function SetForgotPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") ?? ""
    const otp = searchParams.get("otp") ?? ""

    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPwd, setShowPwd] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [done, setDone] = useState(false)

    const strength = getStrength(password)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password.length < 6) { setError("Password must be at least 6 characters."); return }
        if (password !== confirm) { setError("Passwords do not match."); return }

        setLoading(true)

        try {
            await authService.setForgotPassword({
                email: email,
                otp: otp,
                password,
                password_confirmation: confirm,
            })
            setDone(true)
            setTimeout(() => router.push("/auth/login"), 2000)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setError(e.response?.data?.message ?? "Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const inputBase =
        "w-full py-4 pl-12 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-slate-900 dark:text-white outline-none focus:border-[#010427]/50 focus:ring-2 focus:ring-[#010427]/10 dark:focus:border-slate-500 placeholder:text-slate-400 transition-all duration-200"
    const iconBase =
        "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010427] dark:group-focus-within:text-white transition-colors duration-200"
    const primaryBtn =
        "w-full py-4 bg-[#010427] dark:bg-slate-800 text-white rounded-2xl text-base font-bold shadow-lg hover:bg-[#02073d] dark:hover:bg-slate-700 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div
                className="w-full md:w-1/2 min-h-100 md:min-h-162.5  bg-cover bg-center bg-no-repeat flex items-center justify-center p-10 md:p-16 text-white"
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
                            style={{ height: "2.5rem", width: "auto" }}
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

            <div className="w-full md:w-1/2 min-h-162.5 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">
                    {!done ? (
                        <>
                            <div className="mb-8 flex flex-col items-center text-center">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#02073d] dark:text-white mb-1">Set New Password</h2>
                                <p className="text-slate-500 dark:text-slate-400">Must be at least 6 characters.</p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
                                {error && (
                                    <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>
                                )}

                                {/* New password */}
                                <div className="mb-5">
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                                    <div className="relative group">
                                        <span className={iconBase}><Lock className="w-5 h-5" /></span>
                                        <input id="password" type={showPwd ? "text" : "password"} required autoComplete="new-password"
                                            value={password} onChange={(e) => setPassword(e.target.value)} className={inputBase} placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                            {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="mt-2 px-1">
                                            <div className="flex gap-1 mb-1">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-slate-200 dark:bg-slate-700"}`} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500">{strength.label}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm password */}
                                <div className="mb-7">
                                    <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                                    <div className="relative group">
                                        <span className={iconBase}><Lock className="w-5 h-5" /></span>
                                        <input id="confirm" type={showConfirm ? "text" : "password"} required autoComplete="new-password"
                                            value={confirm} onChange={(e) => setConfirm(e.target.value)}
                                            className={`${inputBase} ${confirm && confirm !== password ? "border-red-400 focus:border-red-400" : ""}`}
                                            placeholder="••••••••" />
                                        <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {confirm && confirm !== password && (
                                        <p className="mt-1.5 ml-1 text-sm text-red-500">Passwords do not match.</p>
                                    )}
                                </div>

                                <button type="submit" disabled={loading} className={`${primaryBtn} mb-4`}>
                                    {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Updating…</> : "Set Password"}
                                </button>

                                <Link href="/auth/login" className="w-full py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all">
                                    Back to Sign In
                                </Link>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#02073d] dark:text-white mb-2">Password Updated!</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Redirecting you to sign in…</p>
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
    )
}

export default function SetForgotPasswordPage() {
    return (
        <Suspense>
            <SetForgotPasswordContent />
        </Suspense>
    )
}
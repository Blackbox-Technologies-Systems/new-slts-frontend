"use client"

import { COOKIE_KEYS, COOKIE_OPTIONS, ROUTES } from "@/constants"
import { useAppDispatch } from "@/hooks"
import { authService } from "@/services/authService"
import { hydrateAuth, setUser } from "@/store/slices/authSlice"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { toast } from "sonner"
import Cookies from "js-cookie"
import Image from "next/image"
import { Loader2, ShieldCheck } from "lucide-react"

function VerifyLoginOtpContent() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()

    const email = searchParams.get("email") ?? ""

    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleVerify = async () => {
        if (!otp.trim()) {
            toast.error("Please enter the verification code.")
            return
        }
        setError(null)
        setLoading(true)

        try {
            const res = await authService.verifyLoginOtp({ email, otp: otp.trim() })

            //Commit auth: cookie first
            Cookies.set(COOKIE_KEYS.AUTH_TOKEN, res.token, COOKIE_OPTIONS)
            dispatch(hydrateAuth({ token: res.token }))
            dispatch(setUser(res.user as never))

            toast.success("Welcome back!")
            router.push(ROUTES.DASHBOARD)
        } catch (error: unknown) {
            const e = error as { response?: { data?: { message?: string } } }
            setError(
                e.response?.data?.message ?? "Invalid code. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    // ---------------------------------------------------------------------------
    // Shared style tokens
    // ---------------------------------------------------------------------------
    const inputBase =
        "w-full py-4 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-base text-slate-900 dark:text-white outline-none focus:border-[#010427]/50 focus:ring-2 focus:ring-[#010427]/10 dark:focus:border-slate-500 placeholder:text-slate-400 transition-all duration-200"

    const iconBase =
        "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#010427] dark:group-focus-within:text-white transition-colors duration-200"

    const primaryBtn =
        "w-full py-4 bg-[#010427] dark:bg-slate-800 text-white rounded-2xl text-base font-bold shadow-lg hover:bg-[#02073d] dark:hover:bg-slate-700 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"

    const secondaryBtn =
        "w-full py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md-flex-row">
            {/* Hero */}
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
                    <p className="mt-1 text-base font-light text-slate-300">
                        Automated highway infrastructure monitoring.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 min-h-162.5 flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">

                    {/* ── Heading ── */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#010427]/10 dark:bg-slate-800 mb-4">
                            <ShieldCheck className="w-7 h-7 text-[#010427] dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-[#02073d] dark:text-white mb-1">
                            Verify Identity
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Enter the code sent to{" "}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {email}
                            </span>
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <div>
                        <div className="mb-6">
                            <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Authentication Code
                            </label>
                            <div className="relative group">
                                <span className={iconBase}><ShieldCheck className="w-5 h-5" /></span>
                                <input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={8}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                                    className={inputBase}
                                    placeholder="Enter 6-digit code"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            className={`${primaryBtn} mb-3`}
                        >
                            {loading
                                ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying…</>
                                : "Verify & Continue"
                            }
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/auth/login")}
                            className={secondaryBtn}
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default function VerifyLoginOtpPage() {
    return (
        <Suspense>
            <VerifyLoginOtpContent />
        </Suspense>
    )
}
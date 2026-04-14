"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, Building, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/useRedux"
import { setUser, hydrateAuth } from "@/store/slices/authSlice"
import { authService } from "@/services/authService"
import { ROUTES, COOKIE_KEYS, COOKIE_OPTIONS } from "@/constants"
import Cookies from "js-cookie"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AuthStep = "LOGIN" | "TWO_FA"

interface LoginForm {
  email: string
  password: string
}

interface PendingAuth {
  token: string
  user: unknown
}

// ---------------------------------------------------------------------------
// Dev OTP — delete once real backend OTP endpoint (/login/admin) is wired up
// ---------------------------------------------------------------------------
const DEV_OTP = "111222"

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // auth-flow
  const [step, setStep] = useState<AuthStep>("LOGIN")
  const [emailForOtp, setEmailForOtp] = useState("")
  const [otpToken, setOtpToken] = useState("")
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null)

  // form
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // Step 1 — validate credentials only.
  //
  // We call authService.login() directly instead of dispatching loginUser(),
  // because loginUser() immediately writes the token to the auth cookie and
  // Redux state — which causes the middleware to redirect to the dashboard
  // before the OTP screen can appear.
  //
  // The validated token + user are held in local state (pendingAuth) until
  // the OTP check in Step 2 passes.
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await authService.login(form)
      // Credentials valid — stash the result but don't commit it anywhere yet.
      setPendingAuth({ token: response.token, user: response.user })
      setEmailForOtp(form.email)
      setStep("TWO_FA")
      toast.info(`(Dev) Enter OTP: ${DEV_OTP}`)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string }
      setError(e.response?.data?.message ?? e.message ?? "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Step 2 — verify OTP, then commit auth to Redux + cookie and redirect.
  //
  // ── DEV MODE ────────────────────────────────────────────────────────────────
  // Accepts DEV_OTP ("111222"). Once correct, the pending token/user from
  // Step 1 is written to Redux and the cookie — exactly what loginUser() would
  // have done, just deferred until now.
  //
  // ── REAL MODE (uncomment when /login/admin is ready) ─────────────────────
  // Replace the DEV mock block with a real POST to /login/admin. On success,
  // use data.token / data.userData instead of pendingAuth.
  // ---------------------------------------------------------------------------
  const handleVerifyOtp = async () => {
    if (!otpToken.trim()) {
      toast.error("Please enter the verification code.")
      return
    }

    setLoading(true)

    // ── DEV MOCK — delete from here ──────────────────────────────────────────
    await new Promise((r) => setTimeout(r, 400))

    if (otpToken.trim() !== DEV_OTP) {
      toast.error(`Incorrect code. Use ${DEV_OTP} for now.`)
      setLoading(false)
      return
    }

    // OTP passed — now safe to commit. Write cookie first (middleware reads
    // it on navigation), then hydrate Redux, then redirect.
    if (pendingAuth) {
      Cookies.set(COOKIE_KEYS.AUTH_TOKEN, pendingAuth.token, COOKIE_OPTIONS)
      dispatch(hydrateAuth({ token: pendingAuth.token }))
      dispatch(setUser(pendingAuth.user as Parameters<typeof setUser>[0]))
    }

    toast.success("Welcome back!")
    router.push(ROUTES.DASHBOARD)
    setLoading(false)
    // ── to here ──────────────────────────────────────────────────────────────

    // ── REAL (uncomment when backend OTP endpoint is ready) ──────────────────
    // import axios from "axios"
    // try {
    //   const { data } = await axios.post(
    //     `${process.env.NEXT_PUBLIC_API_URL}/login/admin`,
    //     { email_address: emailForOtp, otp_token: otpToken.trim() }
    //   )
    //   if (data.message === "success") {
    //     const token = data.token ?? pendingAuth?.token
    //     const user  = data.userData ?? pendingAuth?.user
    //     if (token) {
    //       Cookies.set(COOKIE_KEYS.AUTH_TOKEN, token, COOKIE_OPTIONS)
    //       dispatch(hydrateAuth({ token }))
    //     }
    //     if (user) dispatch(setUser(user))
    //     toast.success("Welcome back!")
    //     router.push(ROUTES.DASHBOARD)
    //   } else {
    //     toast.error(data.message ?? "Invalid code. Please try again.")
    //   }
    // } catch {
    //   toast.error("Network error — please try again.")
    // } finally {
    //   setLoading(false)
    // }
    // ─────────────────────────────────────────────────────────────────────────
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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

      {/* ── Hero ── */}
      <div
        className="w-full md:w-1/2 min-h-[400px] md:min-h-[650px] bg-cover bg-center bg-no-repeat flex items-center justify-center p-10 md:p-16 text-white"
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

      {/* ── Form panel ── */}
      <div className="w-full md:w-1/2 min-h-[650px] flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md">

          {/* ── Heading ── */}
          <div className="mb-8 flex flex-col items-center text-center">
            {step === "LOGIN" ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-[#02073d] dark:text-white mb-1">
                  Welcome
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Sign in to access the dashboard
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#010427]/10 dark:bg-slate-800 mb-4">
                  <ShieldCheck className="w-7 h-7 text-[#010427] dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-[#02073d] dark:text-white mb-1">
                  Verify Identity
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Enter the code sent to{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {emailForOtp}
                  </span>
                </p>
              </>
            )}
          </div>

          {/* ── Step 1: credentials ── */}
          {step === "LOGIN" && (
            <form onSubmit={handleLoginSubmit} noValidate>

              {error && (
                <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <span className={iconBase}><Mail className="w-5 h-5" /></span>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputBase}
                    placeholder="admin@blackbox.dev"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <span className={iconBase}><Lock className="w-5 h-5" /></span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`${inputBase} pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex justify-between items-center mb-7">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-[#010427]" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Keep me logged in</span>
                </label>
                <Link href="/forgot-password" className="text-sm font-semibold text-[#010427] dark:text-blue-400 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className={`${primaryBtn} mb-6`}>
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Signing in…</> : "Sign In"}
              </button>

              <div className="relative text-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-slate-200 dark:bg-slate-700" />
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Or continue with
                </span>
              </div>

              <button type="button" className={secondaryBtn}>
                <Building className="w-5 h-5 text-[#010427] dark:text-blue-400" />
                Enterprise SSO
              </button>
            </form>
          )}

          {/* ── Step 2: OTP ── */}
          {step === "TWO_FA" && (
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
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyOtp()}
                    className={inputBase}
                    placeholder="Enter 6-digit code"
                    autoFocus
                  />
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={loading} className={`${primaryBtn} mb-3`}>
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying…</> : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={() => { setStep("LOGIN"); setOtpToken(""); setError(null) }}
                className={secondaryBtn}
              >
                ← Back to Login
              </button>
            </div>
          )}

          {/* ── Footer ── */}
          <p className="mt-8 text-sm text-center text-slate-500 dark:text-slate-400">
            Need assistance?{" "}
            <a href="#" className="font-bold text-[#010427] dark:text-blue-400 hover:underline">Contact Support</a>
          </p>
          <div className="flex justify-center gap-6 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            {["Privacy", "Terms", "Compliance"].map((label) => (
              <a key={label} href="#" className="text-xs font-medium text-slate-400 hover:text-[#010427] dark:hover:text-slate-300 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
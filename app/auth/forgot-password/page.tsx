"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const SERVER = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Naive browser-side email check — real validation is on the server. */
const isValidEmail = (value: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

/** Cryptographically random token — replaces the old `generate_token(50)` helper. */
function generateToken(length = 50): string {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => chars[byte % chars.length]).join("");
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            setEmailError("Please enter your email address.");
            return false;
        }
        if (!isValidEmail(email)) {
            setEmailError("Please enter a valid email address.");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            const { data } = await axios.patch(
                `${SERVER}/login/forget_password/add_token`,
                {
                    email_address: email.trim(),
                    token: generateToken(50),
                }
            );

            if (data.message === "success") {
                setSubmitted(true);
            } else {
                toast.error(data.message ?? "Something went wrong. Please try again.");
            }
        } catch {
            toast.error("Network error — please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

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
                        Use your registered email to reset your password.
                    </p>
                </div>
            </div>

            {/* ── Form ── */}
            <div className="w-full md:w-1/2 min-h-[650px] flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">

                    {!submitted ? (
                        <>
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#02073d] dark:text-white mb-1">
                                    Forgot Password?
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400">
                                    No worries — we&apos;ll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate>
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
                                                if (emailError) setEmailError("");
                                            }}
                                            className={`w-full py-4 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-base text-slate-900 dark:text-white outline-none focus:ring-2 placeholder:text-slate-400 transition-all duration-200 ${emailError
                                                    ? "border-red-400 focus:border-red-400 focus:ring-red-200 dark:focus:ring-red-900/30"
                                                    : "border-slate-200 dark:border-slate-700 focus:border-[#010427]/50 focus:ring-[#010427]/10"
                                                }`}
                                            placeholder="admin@slts.com.ng"
                                        />
                                    </div>
                                    {emailError && (
                                        <p className="mt-1.5 ml-1 text-sm text-red-500">{emailError}</p>
                                    )}
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
                                        "Send Reset Instructions"
                                    )}
                                </button>

                                {/* Back */}
                                <Link
                                    href="/login"
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
                                Check your inbox
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-2">
                                We sent a password reset link to
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-8 break-all">
                                {email}
                            </p>
                            <p className="text-sm text-slate-400 mb-6">
                                Didn&apos;t receive it? Check your spam folder, or{" "}
                                <button
                                    onClick={() => setSubmitted(false)}
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
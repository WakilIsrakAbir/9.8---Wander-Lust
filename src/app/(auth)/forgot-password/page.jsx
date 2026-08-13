"use client";

import { useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const { data, error } = await authClient.requestPasswordReset({
                email,
                redirectTo: "/reset-password"
            });

            if (error) {
                setError(error.message || "Failed to send reset email.");
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[500px] text-center mb-8">
                <h2 className="text-[36px] font-bold text-[#0f172a] tracking-tight">Forgot Password</h2>
                <p className="mt-2 text-[16px] text-[#64748b]">Enter your email to receive a reset link</p>
            </div>

            <div className="w-full max-w-[500px] bg-white p-8 md:p-10 shadow-sm border border-gray-100 rounded-2xl">
                {!success ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <Input
                                required
                                aria-label="Email Address"
                                placeholder="Enter your email"
                                type="email"
                                radius="full"
                                variant="bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12"
                            />
                        </div>

                        {error && <p className="text-[14px] text-red-500 text-center font-medium mt-2">{error}</p>}

                        <Button
                            type="submit"
                            radius="full"
                            className="w-full font-semibold bg-[#17a2b8] text-white h-12 mt-4 text-[15px]"
                            isLoading={loading}
                        >
                            Send Reset Link
                        </Button>
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="mb-4 text-green-500 text-5xl">✓</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Check your email</h3>
                        <p className="text-gray-600 mb-6 text-[15px]">We have sent a password reset link to <strong>{email}</strong>.</p>
                    </div>
                )}

                <p className="mt-6 text-center text-[14px] text-gray-500">
                    Remember your password?{" "}
                    <Link href="/login" className="font-semibold text-[#17a2b8] hover:underline text-[14px]">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

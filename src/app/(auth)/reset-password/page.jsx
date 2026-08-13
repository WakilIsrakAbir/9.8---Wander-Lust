"use client";

import { useState, Suspense } from "react";
import { Button, Input, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        
        setLoading(true);
        setError("");

        try {
            const { data, error } = await authClient.resetPassword({
                newPassword: password,
                token: token || undefined,
            });

            if (error) {
                setError(error.message || "Failed to reset password.");
            } else {
                router.push("/login");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[500px] bg-white p-8 md:p-10 shadow-sm border border-gray-100 rounded-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4">
                    <Input
                        required
                        aria-label="New Password"
                        placeholder="Enter new password"
                        type="password"
                        radius="full"
                        variant="bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12"
                    />

                    <Input
                        required
                        aria-label="Confirm Password"
                        placeholder="Confirm new password"
                        type="password"
                        radius="full"
                        variant="bordered"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Reset Password
                </Button>
            </form>

            <p className="mt-6 text-center text-[14px] text-gray-500">
                Back to{" "}
                <Link href="/login" className="font-semibold text-[#17a2b8] hover:underline text-[14px]">
                    Sign In
                </Link>
            </p>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[500px] text-center mb-8">
                <h2 className="text-[36px] font-bold text-[#0f172a] tracking-tight">Set New Password</h2>
                <p className="mt-2 text-[16px] text-[#64748b]">Please enter your new password below</p>
            </div>

            <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}

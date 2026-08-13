"use client";

import { useState } from "react";
import { Button, Input, Link } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
            });

            if (error) {
                setError(error.message || "Registration failed.");
            } else {
                router.push("/");
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (err) {
            setError("Failed to signup with Google.");
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fc] py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[500px] text-center mb-8">
                <h2 className="text-[36px] font-bold text-[#0f172a] tracking-tight">Create Account</h2>
                <p className="mt-2 text-[16px] text-[#64748b]">Start your adventure with Wanderlust</p>
            </div>

            <div className="w-full max-w-[500px] bg-white p-8 md:p-10 shadow-sm border border-gray-100 rounded-2xl">
                <form className="space-y-6" onSubmit={handleRegister}>
                    
                    {/* Inputs in a Column Layout */}
                    <div className="flex flex-col gap-4">
                        <Input
                            required
                            aria-label="Full Name"
                            placeholder="Enter your name"
                            type="text"
                            radius="full"
                            variant="bordered"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12"
                        />

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

                        <Input
                            required
                            aria-label="Password"
                            placeholder="Create a password"
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
                            placeholder="Confirm your password"
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
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative bg-white px-4 text-[14px] text-gray-500">
                        Or sign up with
                    </div>
                </div>

                <div className="mt-6">
                    <Button
                        variant="bordered"
                        radius="full"
                        className="w-full font-semibold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 h-12 text-[15px]"
                        startContent={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                        isLoading={googleLoading}
                    >
                        Sign Up With Google
                    </Button>
                </div>

                <p className="mt-6 text-center text-[14px] text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-[#17a2b8] hover:underline text-[14px]">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

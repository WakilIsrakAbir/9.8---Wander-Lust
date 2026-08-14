"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const isAdmin = session?.user?.email === 'admin@wanderlust.com';

    
    // Helper function for active link styling
    const getLinkStyle = (path) => {
        const isActive = pathname === path;
        return `text-sm font-medium ${
            isActive 
                ? 'text-[#0891b2] underline underline-offset-[6px] decoration-2' 
                : 'text-gray-700 hover:text-black'
        }`;
    };

    return (
        <header className="w-full bg-white border-b border-gray-100 flex items-center justify-center h-16 relative z-50">
            <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
                
                {/* Mobile Menu Toggle Button */}
                <div className="flex sm:hidden">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="text-gray-700 hover:text-black focus:outline-none p-1"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Left side: Navigation Links */}
                <div className="hidden sm:flex items-center gap-8">
                    <Link href="/" className={getLinkStyle("/")}>
                        Home
                    </Link>
                    <Link href="/destinations" className={getLinkStyle("/destinations")}>
                        Destinations
                    </Link>
                    {isAdmin && (
                        <Link href="/add-destinations" className={getLinkStyle("/add-destinations")}>
                            Add Destinations
                        </Link>
                    )}
                    {session && (
                        <Link href="/my-bookings" className={getLinkStyle("/my-bookings")}>
                            My Bookings
                        </Link>
                    )}
                </div>

                {/* Center: Brand Logo */}
                <div className="flex-1 flex justify-end sm:justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <Link href="/" className="font-bold text-2xl tracking-wide text-[#0891b2]">
                        Wanderlast
                    </Link>
                </div>

                {/* Right side: Auth Links (Hidden on very small mobile, visible in dropdown) */}
                <div className="hidden sm:flex items-center gap-8 ml-auto sm:ml-0">
                    {session && (
                        <Link href="/profile" className={`hidden lg:flex items-center gap-1.5 ${getLinkStyle("/profile")}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            Profile
                        </Link>
                    )}
                    {isPending ? (
                        <div className="text-sm text-gray-500">Loading...</div>
                    ) : session ? (
                        <button 
                            onClick={async () => {
                                await authClient.signOut();
                                window.location.reload();
                            }} 
                            className="text-sm font-medium text-red-500 hover:text-red-700 cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className={`hidden lg:flex ${getLinkStyle("/login")}`}>
                                Login
                            </Link>
                            <Link href="/register" className={getLinkStyle("/register")}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg px-4 py-4 flex flex-col gap-4 z-40">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={getLinkStyle("/")}>Home</Link>
                    <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} className={getLinkStyle("/destinations")}>Destinations</Link>
                    {isAdmin && (
                        <Link href="/add-destinations" onClick={() => setIsMobileMenuOpen(false)} className={getLinkStyle("/add-destinations")}>Add Destinations</Link>
                    )}
                    {session && (
                        <>
                            <Link href="/my-bookings" onClick={() => setIsMobileMenuOpen(false)} className={getLinkStyle("/my-bookings")}>My Bookings</Link>
                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className={getLinkStyle("/profile")}>Profile</Link>
                        </>
                    )}
                    <hr className="border-gray-100" />
                    {isPending ? (
                        <div className="text-sm text-gray-500">Loading...</div>
                    ) : session ? (
                        <button 
                            onClick={async () => {
                                setIsMobileMenuOpen(false);
                                await authClient.signOut();
                                window.location.reload();
                            }} 
                            className="text-left text-sm font-medium text-red-500 hover:text-red-700 cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className={getLinkStyle("/login")}>Login</Link>
                            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className={getLinkStyle("/register")}>Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
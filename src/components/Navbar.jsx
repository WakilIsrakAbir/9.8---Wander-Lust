"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    
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
        <header className="w-full bg-white border-b border-gray-100 flex items-center justify-center h-16">
            <nav className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
                {/* Left side: Navigation Links */}
                <div className="hidden sm:flex items-center gap-8">
                    <Link href="/" className={getLinkStyle("/")}>
                        Home
                    </Link>
                    <Link href="/destinations" className={getLinkStyle("/destinations")}>
                        Destinations
                    </Link>
                    <Link href="/my-bookings" className={getLinkStyle("/my-bookings")}>
                        My Bookings
                    </Link>
                    <Link href="/admin" className={getLinkStyle("/admin")}>
                        Admin
                    </Link>
                </div>

                {/* Center: Brand Logo */}
                <div className="flex-1 flex justify-start sm:justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <Link href="/" className="font-bold text-2xl tracking-wide text-[#0891b2]">
                        Wanderlast
                    </Link>
                </div>

                {/* Right side: Auth Links */}
                <div className="flex items-center gap-8 ml-auto sm:ml-0">
                    <Link href="/profile" className={`hidden lg:flex items-center gap-1.5 ${getLinkStyle("/profile")}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Profile
                    </Link>
                    <Link href="/login" className={`hidden lg:flex ${getLinkStyle("/login")}`}>
                        Login
                    </Link>
                    <Link href="/signup" className={getLinkStyle("/signup")}>
                        Sign Up
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
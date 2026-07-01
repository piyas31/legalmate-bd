"use client"; // 💡 এটিকে একটি ক্লায়েন্ট সেফ কম্পোনেন্ট বানালাম

import Link from "next/link";
import { Scale, Menu } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs"; // 💡 ক্লার্কের ক্লায়েন্ট হুক ও বাটন

export default function Navbar() {
  // ১. ক্লার্কের হুক দিয়ে লগইন স্ট্যাটাস ও ইউজারের ডাটা নিলাম
  const { isSignedIn, user, isLoaded } = useUser();

  // ২. মেটাডেটা থেকে রোল বের করা (ডাটাবেজ বা সার্ভার কলের কোনো ঝামেলাই নেই)
  const userRole = user?.unsafeMetadata?.requestedRole || "client";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight text-gray-900">
          <Scale className="h-6 w-6 text-indigo-600" />
          <span>Legal<span className="text-indigo-600">Sphere</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/lawyers" className="hover:text-indigo-600 transition-colors">Find Lawyers</Link>
          
          {/* 💡 জাস্ট রিঅ্যাক্ট কন্ডিশনাল রেন্ডারিং - কোনো SignedIn ট্যাগ লাগবে না */}
          {isLoaded && isSignedIn && (
            <>
              {userRole === "client" ? (
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Client Dashboard</Link>
              ) : (
                <Link href="/lawyer-dashboard" className="hover:text-indigo-600 transition-colors">Lawyer Portal</Link>
              )}
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* ক্লার্কের ডাটা লোড হওয়া পর্যন্ত ছোট ব্ল্যাঙ্ক স্টেট (ফ্লিকারিং এড়াতে) */}
          {!isLoaded ? (
            <div className="h-8 w-8 animate-pulse bg-gray-100 rounded-full" />
          ) : !isSignedIn ? (
            /* ❌ ইউজার লগআউট থাকলে এই বাটনগুলো দেখাবে */
            <>
              <Link href="/sign-in" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors mr-2">
                Sign In
              </Link>
              
              <Link href="/sign-up?role=client" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                Join as Client
              </Link>
              
              <Link href="/sign-up?role=lawyer" className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-all shadow-sm">
                Join as Professional
              </Link>
            </>
          ) : (
            /*  ইউজার লগইন থাকলে জিমেইল প্রোফাইল আইকন */
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 border border-gray-100 hover:scale-105 transition-transform"
                }
              }}
            />
          )}
          
        </div>

        {/* Mobile Menu Button */}
        <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
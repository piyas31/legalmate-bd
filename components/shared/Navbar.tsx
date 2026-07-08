"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale, Menu } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { checkAndSyncUser } from "@/db/sync-user"; // 💡 লাইভ ডাটাবেজ থেকে রোল সিঙ্ক করার ফাংশন

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const [dbRole, setDbRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      // ইউজার লগইন থাকলে সরাসরি ডাটাবেজ থেকে তার আসল লাইভ রোল নিয়ে আসা হবে
      if (isSignedIn) {
        try {
          const dbUser = (await checkAndSyncUser()) as any;
          if (dbUser && dbUser.role) {
            setDbRole(dbUser.role); // 'admin', 'lawyer', বা 'client' সেট হবে
          }
        } catch (err) {
          console.error("💥 Failed to fetch live navbar role:", err);
        }
      }
    };

    fetchUserRole();
  }, [isSignedIn]);

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
          
          {/* 🚀 রোল অনুযায়ী ডাইনামিক ড্যাশবোর্ড লিঙ্ক জেনারেশন */}
          {isLoaded && isSignedIn && dbRole && (
            <>
              {dbRole === "admin" && (
                <Link href="/admin/dashboard" className="text-rose-600 font-semibold hover:text-rose-700 transition-colors flex items-center gap-1">
                  Admin Dashboard
                </Link>
              )}
              {dbRole === "lawyer" && (
                <Link href="/lawyer-dashboard" className="hover:text-indigo-600 transition-colors">
                  Lawyer Portal
                </Link>
              )}
              {dbRole === "client" && (
                <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Client Dashboard
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* ক্লার্ক লোড হওয়ার আগে ফ্লিকারিং বন্ধের ছোট পালস অ্যানিমেশন */}
          {!isLoaded ? (
            <div className="h-8 w-8 animate-pulse bg-gray-100 rounded-full" />
          ) : !isSignedIn ? (
            /* ❌ লগআউট থাকা অবস্থায় হুবহু আগের মতোই থাকবে */
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
            /* ✅ লগইন থাকলে ক্লার্ক প্রোফাইল বাটন */
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
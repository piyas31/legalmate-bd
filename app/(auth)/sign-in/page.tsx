"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Later integrated with Clerk: signIn.create({...})
    alert("Sign In submitted (Mock)");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#FAFAFA] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md text-center">
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2 font-semibold text-2xl tracking-tight text-gray-900 mb-6">
          <Scale className="h-7 w-7 text-indigo-600" />
          <span>Legal<span className="text-indigo-600">Sphere</span></span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Or{" "}
          <Link href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 shadow-sm sm:rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
                <Link href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm mt-2"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Micro-copy for Defense Evaluation */}
          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <span className="text-[11px] text-gray-400">
              Developed by Raisul Hasan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
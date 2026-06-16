"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Mail, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const [role, setRole] = useState<"client" | "lawyer">("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Later integrated with Clerk: signUp.create({...})
    alert(`Signing up as ${role} (Mock)`);
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
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-100 shadow-sm sm:rounded-2xl sm:px-10">
          
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 text-center">
              Registering As A
            </label>
            <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${
                  role === "client"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Seeker (Client)
              </button>
              <button
                type="button"
                onClick={() => setRole("lawyer")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${
                  role === "lawyer"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Advocate (Lawyer)
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

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
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Lawyer specific conditional note for defense integrity */}
            {role === "lawyer" && (
              <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-100 flex gap-2 items-start text-xs text-amber-800 leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Note: Upon submission, your profile remains in pending state until manual Bar Council license vetting is complete.</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm mt-4"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
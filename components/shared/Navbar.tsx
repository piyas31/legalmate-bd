import Link from "next/link";
import { Scale, Menu } from "lucide-react";

export default function Navbar() {
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
          <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Client Dashboard</Link>
          <Link href="/lawyer-dashboard" className="hover:text-indigo-600 transition-colors">Lawyer Portal</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-all shadow-sm">
            Join as Professional
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
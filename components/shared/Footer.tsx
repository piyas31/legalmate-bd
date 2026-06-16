import Link from "next/link";
import { Scale } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-lg text-gray-900">
            <Scale className="h-5 w-5 text-indigo-600" />
            <span>LegalSphere</span>
          </div>
          <p className="text-center text-xs text-gray-500 sm:text-left">
            &copy; {new Date().getFullYear()} LegalSphere. All rights reserved.
            (Developed by Raisul Hasan)
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="/lawyers" className="hover:text-indigo-600">
              Find Attorneys
            </Link>
            <Link href="#" className="hover:text-indigo-600">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-indigo-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

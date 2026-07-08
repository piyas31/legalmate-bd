"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { checkAndSyncUser } from "@/db/sync-user";
import { getPendingLawyers, approveLawyerProfile, declineLawyerProfile } from "@/app/actions/admin"; // 💡 declineLawyerProfile যোগ হলো
import { Check, ShieldCheck, Loader2, RefreshCw, X } from "lucide-react"; // 💡 X আইকন যোগ হলো


export default function AdminDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  // লয়ার ডিক্লাইন করার হ্যান্ডলার
  const handleDecline = async (profileId: string) => {
    // নিশ্চিত হওয়ার জন্য একটা কনফার্মেশন পপআপ
    const confirmDecline = confirm("Are you sure you want to decline this lawyer? This will wipe their current application form data.");
    if (!confirmDecline) return;

    setActionLoading(profileId);
    const result = await declineLawyerProfile(profileId);
    if (result.success) {
      // রিয়েল-টাইম লিস্ট থেকে রিমুভ করা
      setLawyers((prev) => prev.filter((l) => l.profileId !== profileId));
    } else {
      alert("Failed to decline lawyer profile.");
    }
    setActionLoading(null);
  };

  // ডাটাবেজ থেকে পেন্ডিং লয়ারদের লিস্ট লোড করার ফাংশন
  const fetchLawyers = async () => {
    const result = await getPendingLawyers();
    if (result.success && result.data) {
      setLawyers(result.data);
    }
  };

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (isLoaded && isSignedIn) {
        try {
          // ১. সরাসরি ডাটাবেজ থেকে কারেন্ট ইউজারের লাইভ অবজেক্ট আনা
          const dbUser = (await checkAndSyncUser()) as any;
          
          // 🚀 বসের মতো চেক: রোল যদি "admin" না হয়, সোজা হোমপেজে কিক আউট!
          if (!dbUser || dbUser.role !== "admin") {
            router.push("/");
            return;
          }

          // ২. ইউজার ১০০% এডমিন হলে পেন্ডিং লয়ারদের ডাটা ফেচ করা
          await fetchLawyers();
        } catch (err) {
          console.error("💥 Admin verification failed:", err);
          router.push("/");
        } finally {
          setLoading(false);
        }
      } else if (isLoaded && !isSignedIn) {
        // সাইন-ইন করা না থাকলে সোজা হোমপেজে ফেরত পাঠানো
        router.push("/");
      }
    };

    verifyAdminAccess();
  }, [isLoaded, isSignedIn]);

  // লয়ার এপ্রুভ করার হ্যান্ডলার
  const handleApprove = async (profileId: string) => {
    setActionLoading(profileId);
    const result = await approveLawyerProfile(profileId);
    if (result.success) {
      // এপ্রুভ হওয়ার সাথে সাথে রিয়েল-টাইম লিস্ট থেকে ওই লয়ারকে রিমুভ করা
      setLawyers((prev) => prev.filter((l) => l.profileId !== profileId));
    } else {
      alert("Failed to approve lawyer profile. Please try again.");
    }
    setActionLoading(null);
  };

  // ১. গ্লোবাল লোডিং ও প্রটেকশন স্ক্রিন
  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
        <p className="text-xs text-gray-500 mt-2 font-medium animate-pulse">
          Verifying secure admin credentials...
        </p>
      </div>
    );
  }

  // ২. আসল প্রিমিয়াম অ্যাডমিন প্যানেল UI
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Top Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gray-900" /> Admin Command Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review professional credentials and activate registered advocate portals.
            </p>
          </div>
          <button 
            onClick={fetchLawyers}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600"
            title="Refresh Applications"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Pending Lawyers Request Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Pending Applications ({lawyers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {lawyers.map((lawyer) => (
              <div 
                key={lawyer.profileId} 
                className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50/10 transition-colors"
              >
                {/* Lawyer Information Meta Box */}
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex items-center gap-3">
                    {lawyer.userImage ? (
                      <img src={lawyer.userImage} alt="" className="h-10 w-10 rounded-full border border-gray-100 object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
                        {lawyer.userName?.[0] || "L"}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{lawyer.userName || "Counsel"}</h3>
                      <p className="text-xs text-gray-400">{lawyer.userEmail}</p>
                    </div>
                  </div>

                  {/* Grid Data Items */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/60 p-3 rounded-xl border border-gray-100 text-xs">
                    <div>
                      <span className="block text-gray-400 font-medium">Bar Council No</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">{lawyer.barCouncilNo}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Specialty</span>
                      <span className="font-semibold text-indigo-600 mt-0.5 block">{lawyer.specialty}</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Experience</span>
                      <span className="font-semibold text-gray-900 mt-0.5 block">{lawyer.experienceYrs} Years</span>
                    </div>
                    <div>
                      <span className="block text-gray-400 font-medium">Hourly Rate</span>
                      <span className="font-semibold text-emerald-700 mt-0.5 block">{lawyer.hourlyRate} BDT</span>
                    </div>
                  </div>

                  {/* Bio Description Box */}
                  <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                    <span className="font-semibold text-gray-800 block mb-1">Professional Bio:</span>
                    <p className="leading-relaxed italic">"{lawyer.bio}"</p>
                  </div>
                </div>

                {/* Approve Button Action */}
               {/* Action Buttons (Decline & Approve) */}
                <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-gray-50 flex items-center justify-end gap-2">
                  
                  {/* 🛑 Decline Button */}
                  <button
                    disabled={actionLoading === lawyer.profileId}
                    onClick={() => handleDecline(lawyer.profileId)}
                    className="w-full md:w-auto bg-white text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-50/50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading === lawyer.profileId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    Decline
                  </button>

                  {/* ✅ Approve Button */}
                  <button
                    disabled={actionLoading === lawyer.profileId}
                    onClick={() => handleApprove(lawyer.profileId)}
                    className="w-full md:w-auto bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-gray-950 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {actionLoading === lawyer.profileId ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Approve
                  </button>
                  
                </div>

              </div>
            ))}

            {/* Empty State Screen */}
            {lawyers.length === 0 && (
              <div className="p-16 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  ✨
                </div>
                <p className="text-sm font-medium text-gray-900">All caught up!</p>
                <p className="text-xs text-gray-400">No pending lawyer verification requests found.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
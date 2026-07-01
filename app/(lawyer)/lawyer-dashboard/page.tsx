"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { checkAndSyncUser } from "@/db/sync-user";
import { createLawyerProfile, getLawyerProfileStatus } from "@/app/actions/lawyer"; // 🚀 getLawyerProfileStatus অ্যাকশনটি যুক্ত করা হলো
import { Calendar, Users, Clock, Check, X, FolderOpen, ShieldAlert, User, AlertCircle, Loader2 } from "lucide-react";

export default function LawyerDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [dbUserObj, setDbUserObj] = useState<any>(null);

  // অনবোর্ডিং ফর্ম স্টেট
  const [formData, setFormData] = useState({
    barCouncilNo: "",
    specialty: "Corporate",
    experienceYrs: 1,
    hourlyRate: 500,
    bio: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ডায়নামিক অ্যাপয়েন্টমেন্ট স্টেট
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const initLawyerWorkspace = async () => {
      if (isLoaded && isSignedIn) {
        try {
          // ১. ইউজার সিঙ্ক করা (ইউজার আইডি পাওয়ার জন্য)
          const dbUser = (await checkAndSyncUser()) as any;
          
          if (dbUser) {
            setDbUserObj(dbUser);
            
            // 🚀 আসল ট্রিক: ক্যাশ এড়াতে সার্ভার অ্যাকশনের মাধ্যমে সরাসরি লাইভ ডাটাবেজ স্ট্যাটাস চেক
            const profileStatus = await getLawyerProfileStatus(dbUser.id);
            
            if (profileStatus && profileStatus.exists) {
              setHasProfile(true);
              setIsVerified(profileStatus.isVerified);
              
              // ডাটা অবজেক্টে প্রোফাইল ডাটা রি-ম্যাপ করে রাখা হলো
              setDbUserObj((prev: any) => ({
                ...prev,
                lawyerProfile: profileStatus.profile,
              }));
            } else {
              setHasProfile(false);
              setIsVerified(false);
            }
          }
        } catch (err) {
          console.error("💥 Failed to initialize lawyer dashboard:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    initLawyerWorkspace();
  }, [isLoaded, isSignedIn]);

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const result = await createLawyerProfile(formData);
    if (result.success) {
      // 🚀 ডাটাবেজে সেভ হওয়ার সাথে সাথে ক্লায়েন্ট স্টেট আপডেট করে পেন্ডিং স্ক্রিন লক করা হলো
      setHasProfile(true);
      setIsVerified(false);
      
      // ডাটাবেজ ক্যাশ পুরোপুরি ব্রেক করার জন্য একবার ফ্রেশ রিলোড
      window.location.reload();
    } else {
      setSubmitError(result.error || "Failed to submit profile. Please try again.");
      setSubmitting(false);
    }
  };

  // অ্যাপয়েন্টমেন্ট অ্যাকশন হ্যান্ডলার
  const handleAppointmentAction = (id: string, actionType: "Approved" | "Rejected") => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: actionType } : app));
  };

  // ১. গ্লোবাল লোডিং স্টেট
  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <p className="text-xs text-gray-400 mt-2 font-medium animate-pulse">Setting up your secure portal...</p>
      </div>
    );
  }

  // ২. অনবোর্ডিং প্রোফাইল ফর্ম স্ক্রিন
  if (!hasProfile) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-12">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Complete Professional Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Provide your verified credentials. Admin will review these details before public listing.</p>
            
            <form onSubmit={handleOnboardingSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Bar Council Reg No.</label>
                <input 
                  required 
                  type="text" 
                  className="mt-1.5 w-full p-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-950 transition-colors" 
                  placeholder="e.g. BC/2026/7845" 
                  onChange={e => setFormData({...formData, barCouncilNo: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Legal Specialty</label>
                  <select 
                    className="mt-1.5 w-full p-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-900 focus:outline-none focus:border-gray-950 transition-colors"
                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                  >
                    <option value="Corporate" className="text-gray-900">Corporate & Business Law</option>
                    <option value="Criminal" className="text-gray-900">Criminal Defense</option>
                    <option value="Civil" className="text-gray-900">Civil Litigation</option>
                    <option value="Family" className="text-gray-900">Family & Marriage Law</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Years of Experience</label>
                  <input 
                    required 
                    type="number" 
                    min="0" 
                    className="mt-1.5 w-full p-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-950 transition-colors" 
                    placeholder="e.g. 5"
                    onChange={e => setFormData({...formData, experienceYrs: parseInt(e.target.value) || 0})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Hourly Consultation Fee (BDT)</label>
                <input 
                  required 
                  type="number" 
                  min="100" 
                  className="mt-1.5 w-full p-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-950 transition-colors" 
                  placeholder="e.g. 1500"
                  onChange={e => setFormData({...formData, hourlyRate: parseInt(e.target.value) || 0})} 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">Professional Bio</label>
                <textarea 
                  required 
                  rows={4} 
                  className="mt-1.5 w-full p-3 rounded-xl border border-gray-200 text-sm bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-950 transition-colors" 
                  placeholder="Briefly summarize your legal expertise and core values..." 
                  onChange={e => setFormData({...formData, bio: e.target.value})} 
                />
              </div>

              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {submitError}
                </div>
              )}

              <button type="submit" disabled={submitting} className="w-full bg-gray-900 text-white p-3.5 rounded-xl font-medium text-sm hover:bg-gray-950 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Profile for Review
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ৩. প্রোফাইল সাবমিট করা আছে কিন্তু এডমিন এখনো এপ্রুভ করেনি (পেন্ডিং স্ক্রিন)
  if (hasProfile && !isVerified) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center bg-white border border-amber-100 p-8 rounded-2xl shadow-sm space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-bold text-xl animate-pulse">⏳</div>
            <h2 className="text-xl font-bold text-gray-900">Verification Pending</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your professional information and Bar Council registration number have been successfully submitted to the admin panel. Once your information has been verified and your account has been activated, this portal will become available to you. Please wait while we complete the verification process.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ৪. প্রোফাইল ১০০% অ্যাপ্রুভড (মেন ডায়নামিক পোর্টাল)
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Profile Header Status */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advocate Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {dbUserObj?.name || "Counsel"}. Manage your slots and client requests.</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Profile Status: Active & Verified
          </div>
        </div>

        {/* Analytical Counter Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Pending Approvals</span>
              <span className="text-xl font-bold text-gray-900">
                {appointments.filter(r => r.status === "pending").length}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Active Sessions</span>
              <span className="text-xl font-bold text-gray-900">
                {appointments.filter(r => r.status === "accepted").length}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Consultation Rate</span>
              <span className="text-xl font-bold text-gray-900">
                {dbUserObj?.lawyerProfile?.hourlyRate ? `${dbUserObj.lawyerProfile.hourlyRate} BDT/hr` : "0 BDT"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Area: Client Booking Requests */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Incoming Booking Requests</h2>
              </div>

              <div className="divide-y divide-gray-50">
                {appointments.map((req) => (
                  <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/30 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-base">{req.client?.name || "Anonymous Client"}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">Consultation</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(req.scheduledAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {new Date(req.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-medium text-indigo-600">• Payment: {req.paymentStatus}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-gray-50">
                      {req.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAppointmentAction(req.id, "Approved")}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="Accept Consultation"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAppointmentAction(req.id, "Rejected")}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Decline Request"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          req.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {appointments.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-sm text-gray-400 italic">No incoming consultation requests found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right Sidebar Area: Compliance & Info Monitor */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" /> Professional Credentials
              </h3>
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Bar Council No:</span>
                  <span className="font-semibold text-gray-900">{dbUserObj?.lawyerProfile?.barCouncilNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Specialty:</span>
                  <span className="font-semibold text-indigo-600">{dbUserObj?.lawyerProfile?.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="font-semibold text-gray-900">{dbUserObj?.lawyerProfile?.experienceYrs} Years</span>
                </div>
              </div>
            </div>

            {/* Anti-Circumvention Module */}
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-widest flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> Platform Integrity
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  To protect users from external middleman fraud and bypass loops, all communication tokens and video scheduling are strictly auditable on-platform via Server Actions.
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 text-gray-800/20 pointer-events-none">
                <User className="h-24 w-24" />
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
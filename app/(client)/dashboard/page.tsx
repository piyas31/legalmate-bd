"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { checkAndSyncUser } from "@/db/sync-user";
import { 
  Calendar, 
  Video, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  User, 
  ExternalLink, 
  Loader2 
} from "lucide-react";
import { getClientAppointments } from "@/app/actions/appointment";
import { cancelAppointment } from "@/app/actions/lawyer"; // নতুন অ্যাকশন ইম্পোর্ট

export default function ClientDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointmentsData = async () => {
    try {
      const liveAppointments = await getClientAppointments();
      
      if (liveAppointments && liveAppointments.length > 0) {
        setAppointments(liveAppointments);
        
        // ক্র্যাশ প্রোটেকশনসহ ক্যালকুলেশন ফিক্স (Hourly Rate চেক করা)
        const spent = liveAppointments
          .filter((a: any) => a.paymentStatus?.toLowerCase() === "paid")
          .reduce((sum: number, a: any) => sum + (Number(a.hourlyRate || a.lawyerProfile?.hourlyRate) || 0), 0);
        setTotalSpent(spent);
      } else {
        setAppointments([]);
        setTotalSpent(0);
      }
    } catch (err: any) {
      console.error("💥 Error loading appointments query:", err);
      setError("Failed to load appointments from database.");
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      if (isLoaded && isSignedIn) {
        try {
          const dbUser = (await checkAndSyncUser()) as any;

          if (!dbUser) {
            setError("Failed to sync user data.");
            setLoading(false);
            return;
          }

          if (dbUser.role === "lawyer") {
            router.replace("/lawyer-dashboard");
            return;
          }

          await fetchAppointmentsData();

        } catch (err: any) {
          console.error("💥 Dashboard Sync Error:", err);
          setError(err.message || "An error occurred during session sync");
        } finally {
          setLoading(false);
        }
      }
    };

    initializeDashboard();
  }, [isLoaded, isSignedIn, router]);

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this consultation booking?")) {
      setLoading(true);
      const res = await cancelAppointment(id);
      if (res.success) {
        alert("Appointment successfully cancelled!");
        await fetchAppointmentsData(); // ডাটা রি-লোডের মাধ্যমে স্টেট আপডেট করা
      } else {
        alert("Failed to cancel: " + res.error);
      }
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        <p className="text-xs text-gray-400 mt-2 font-medium animate-pulse">Loading your client console...</p>
      </div>
    );
  }
  const handleBkashPayment = async (appointmentId: string, amount: number) => {
  try {
    setLoading(true);
    
    // আমাদের এপিআই রুটে রিকোয়েস্ট পাঠানো
    const res = await fetch("/api/bkash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, appointmentId }),
    });

    const data = await res.json();

    if (data.bkashURL) {
      // 🚀 বিকাশ পেমেন্ট গেটওয়ে পেজে রিডাইরেক্ট করে দেওয়া ভাই!
      window.location.href = data.bkashURL;
    } else {
      alert("Failed to initiate bKash payment. Try again.");
      setLoading(false);
    }
  } catch (err) {
    console.error("Payment error:", err);
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" /> Sync Error: {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Client"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active legal consultations and case schedules.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Total Bookings</span>
              <span className="text-xl font-bold text-gray-900">{appointments.length}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Active Consultations</span>
              <span className="text-xl font-bold text-gray-900">
                {appointments.filter(a => a.status === "Confirmed" || a.status === "Approved").length}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Total Spent</span>
              <span className="text-xl font-bold text-gray-900">BDT {totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Your Legal Consultations</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Case / Lawyer</th>
                  <th className="px-6 py-3">Schedule</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50/40 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 block">
                            {appointment.lawyerName || appointment.lawyer?.name || "Premium Lawyer"}
                          </span>
                          <span className="text-xs text-gray-400 block">{appointment.specialty || "Legal Advisor"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1 text-gray-900">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" /> 
                          {new Date(appointment.date || appointment.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3.5 w-3.5 text-gray-300" /> 
                          {appointment.time || new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>

                   {/* Status badge */}
<td className="px-6 py-4">
  {appointment.status?.toLowerCase() === "confirmed" || 
   appointment.status?.toLowerCase() === "approved" || 
   appointment.status?.toLowerCase() === "accepted" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
      <CheckCircle className="h-3 w-3" /> Approved
    </span>
  ) : appointment.status?.toLowerCase() === "cancelled" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
      Cancelled
    </span>
  ) : appointment.status?.toLowerCase() === "completed" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
      Completed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/10">
      <AlertCircle className="h-3 w-3" /> Pending
    </span>
  )}
</td>

                 <td className="px-6 py-4">
  <div className="flex flex-col gap-1.5">
    <span className={`text-xs font-semibold uppercase ${
      appointment.paymentStatus?.toLowerCase() === "paid" ? "text-emerald-600" : "text-amber-600"
    }`}>
      {appointment.paymentStatus || "unpaid"}
    </span>
    
    {/* 🔥 যদি আনপেইড থাকে এবং লয়ার এপ্রুভ করে, তবেই পে বাটন আসবে */}
    {appointment.paymentStatus?.toLowerCase() !== "paid" && 
     (appointment.status?.toLowerCase() === "accepted" || 
      appointment.status?.toLowerCase() === "approved" || 
      appointment.status?.toLowerCase() === "confirmed") && (
      <button
        onClick={() => {
          // লয়ারের hourlyRate অথবা অ্যাপয়েন্টমেন্টের নির্দিষ্ট অ্যামাউন্ট পাস করুন (ডিফল্ট ৫০০ টাকা ধরা হয়েছে ফলব্যাক হিসেবে)
          const amount = Number(appointment.hourlyRate || appointment.lawyerProfile?.hourlyRate) || 500;
          handleBkashPayment(appointment.id, amount);
        }}
        className="inline-flex items-center justify-center gap-1 rounded-lg bg-pink-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-pink-700 transition-colors shadow-sm"
      >
        <CreditCard className="h-3 w-3" /> Pay Now
      </button>
    )}
  </div>
</td>

                   {/* Dynamic Action button */}
<td className="px-6 py-4 text-right space-x-2">
  {(appointment.status?.toLowerCase() === "confirmed" || 
    appointment.status?.toLowerCase() === "approved" || 
    appointment.status?.toLowerCase() === "accepted") && appointment.meetingUrl ? (
    <a
      href={appointment.meetingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
    >
      Join Call <ExternalLink className="h-3 w-3" />
    </a>
  ) : (
    <>
      <button
        disabled
        className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed"
      >
        Details
      </button>
      
      {/* স্ট্যাটাস পেন্ডিং থাকলেই কেবল ক্যানসেল বাটন জ্বলবে */}
      {appointment.status?.toLowerCase() === "pending" && (
        <button
          onClick={() => handleCancel(appointment.id)}
          className="inline-flex items-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 text-xs font-medium transition-colors"
        >
          Cancel
        </button>
      )}
    </>
  )}
</td>
                  </tr>
                ))}

                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <p className="text-sm text-gray-400 italic">You don't have any booked legal consultations yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
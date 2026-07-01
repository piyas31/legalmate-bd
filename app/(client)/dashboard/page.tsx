// "use client";

// import { useState } from "react";
// import Navbar from "@/components/shared/Navbar";
// import Footer from "@/components/shared/Footer";
// import { Calendar, Video, Clock, CheckCircle, AlertCircle, CreditCard, User, ExternalLink } from "lucide-react";

// // Mock data for client dashboard simulation
// const MOCK_APPOINTMENTS = [
//   {
//     id: "APT-1042",
//     lawyerName: "Barrister Rafiqul Islam",
//     specialty: "Criminal Law",
//     date: "June 18, 2026",
//     time: "11:30 AM",
//     status: "Confirmed", // Confirmed, Pending, Completed
//     paymentStatus: "Paid",
//     meetingUrl: "https://100ms.live/mock-room-id-1",
//   },
//   {
//     id: "APT-0981",
//     lawyerName: "Advocate Nusrat Jahan",
//     specialty: "Family & Civil Law",
//     date: "May 24, 2026",
//     time: "04:00 PM",
//     status: "Completed",
//     paymentStatus: "Paid",
//     meetingUrl: null,
//   },
//   {
//     id: "APT-1105",
//     lawyerName: "Tariqul Anam",
//     specialty: "Corporate Law",
//     date: "July 02, 2026",
//     time: "02:00 PM",
//     status: "Pending Approval",
//     paymentStatus: "Processing",
//     meetingUrl: null,
//   }
// ];

// export default function ClientDashboard() {
//   const [appointments] = useState(MOCK_APPOINTMENTS);

//   return (
//     <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
//       <Navbar />

//       <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         {/* Header Summary */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Welcome back, Client</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage your active legal consultations and case schedules.</p>
//         </div>

//         {/* Analytics/Status Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
//             <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
//               <Calendar className="h-5 w-5" />
//             </div>
//             <div>
//               <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Total Bookings</span>
//               <span className="text-xl font-bold text-gray-900">{appointments.length}</span>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
//             <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
//               <Video className="h-5 w-5" />
//             </div>
//             <div>
//               <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Active Consultations</span>
//               <span className="text-xl font-bold text-gray-900">
//                 {appointments.filter(a => a.status === "Confirmed").length}
//               </span>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
//             <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
//               <CreditCard className="h-5 w-5" />
//             </div>
//             <div>
//               <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Total Spent</span>
//               <span className="text-xl font-bold text-gray-900">BDT 3,500</span>
//             </div>
//           </div>
//         </div>

//         {/* Appointments Table Section */}
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-50">
//             <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Your Legal Consultations</h2>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   <th className="px-6 py-3">Case / Lawyer</th>
//                   <th className="px-6 py-3">Schedule</th>
//                   <th className="px-6 py-3">Status</th>
//                   <th className="px-6 py-3">Payment</th>
//                   <th className="px-6 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
//                 {appointments.map((appointment) => (
//                   <tr key={appointment.id} className="hover:bg-gray-50/40 transition-colors">
//                     {/* Lawyer details */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
//                           <User className="h-4 w-4" />
//                         </div>
//                         <div>
//                           <span className="font-medium text-gray-900 block">{appointment.lawyerName}</span>
//                           <span className="text-xs text-gray-400 block">{appointment.specialty}</span>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Schedule info */}
//                     <td className="px-6 py-4">
//                       <div className="space-y-0.5">
//                         <span className="flex items-center gap-1 text-gray-900"><Calendar className="h-3.5 w-3.5 text-gray-400" /> {appointment.date}</span>
//                         <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="h-3.5 w-3.5 text-gray-300" /> {appointment.time}</span>
//                       </div>
//                     </td>

//                     {/* Status badge */}
//                     <td className="px-6 py-4">
//                       {appointment.status === "Confirmed" ? (
//                         <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
//                           <CheckCircle className="h-3 w-3" /> Confirmed
//                         </span>
//                       ) : appointment.status === "Completed" ? (
//                         <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
//                           Completed
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/10">
//                           <AlertCircle className="h-3 w-3" /> Pending
//                         </span>
//                       )}
//                     </td>

//                     {/* Payment badge */}
//                     <td className="px-6 py-4">
//                       <span className={`text-xs font-semibold ${appointment.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
//                         {appointment.paymentStatus}
//                       </span>
//                     </td>

//                     {/* Action button */}
//                     <td className="px-6 py-4 text-right">
//                       {appointment.status === "Confirmed" && appointment.meetingUrl ? (
//                         <a
//                           href={appointment.meetingUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
//                         >
//                           Join Call <ExternalLink className="h-3 w-3" />
//                         </a>
//                       ) : (
//                         <button
//                           disabled
//                           className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 cursor-not-allowed"
//                         >
//                           Details
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { checkAndSyncUser } from "@/db/sync-user"; // 💡 আপনার রুট ফাইলের সঠিক পাথ

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncAndRedirect = async () => {
      if (isLoaded && isSignedIn) {
        try {
          console.log("⏳ Syncing user using root sync-user.ts...");
          
          // 🚀 আপনার রুট ফাইলের ফাংশনটি কল হলো
          const dbUser = await checkAndSyncUser();

          if (!dbUser) {
            setError("Failed to sync user or unauthorized");
            return;
          }

          console.log("✅ User synced successfully! Role in DB:", dbUser.role);

          // 🎯 ডাটাবেজ থেকে আসা রিয়েল রোল অনুযায়ী রিডাইরেক্ট
          if (dbUser.role === "lawyer") {
            router.replace("/lawyer-dashboard");
          }
        } catch (err: any) {
          console.error("💥 Sync Error:", err);
          setError(err.message || "An error occurred during sync");
        }
      }
    };

    syncAndRedirect();
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse text-sm">Initializing dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="text-2xl font-bold text-gray-950">Client Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome back! Manage your cases and consultations here.</p>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-xs font-mono border border-red-100">
          Sync Error: {error}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Calendar, Users, Clock, Check, X, Video, ShieldAlert, FolderOpen, User } from "lucide-react";

// Mock data representing incoming client slots for the lawyer dashboard
const MOCK_REQUESTS = [
  {
    id: "REQ-9901",
    clientName: "Mahmudul Hasan",
    caseType: "Property Dispute",
    date: "June 19, 2026",
    time: "10:00 AM",
    status: "Pending", // Pending, Approved, Rejected
    fee: "2,000 BDT"
  },
  {
    id: "REQ-9902",
    clientName: "Naila Zaman",
    caseType: "Breach of Contract",
    date: "June 21, 2026",
    time: "03:30 PM",
    status: "Pending",
    fee: "2,000 BDT"
  }
];

const MOCK_ACTIVE_CASES = [
  {
    id: "CASE-404",
    clientName: "Arifur Rahman",
    category: "Criminal Allegation",
    nextHearing: "July 05, 2026",
    documentStatus: "Verified"
  }
];

export default function LawyerDashboard() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [activeCases] = useState(MOCK_ACTIVE_CASES);

  // Handle action to approve/reject requests
  const handleAction = (id: string, newStatus: "Approved" | "Rejected") => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile Header Status */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advocate Portal</h1>
            <p className="text-sm text-gray-500 mt-1">Manage client schedule requests, case repositories, and hearings.</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-xs font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Profile Status: Active & Listed
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
                {requests.filter(r => r.status === "Pending").length}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Active Clients</span>
              <span className="text-xl font-bold text-gray-900">{activeCases.length}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Total Earnings</span>
              <span className="text-xl font-bold text-gray-900">42,000 BDT</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Action Area: Client Requests */}
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Incoming Booking Requests</h2>
              </div>

              <div className="divide-y divide-gray-50">
                {requests.map((req) => (
                  <div key={req.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/30 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-base">{req.clientName}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">{req.caseType}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {req.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {req.time}</span>
                        <span className="font-medium text-indigo-600">• Retainer: {req.fee}</span>
                      </div>
                    </div>

                    {/* Action conditional toggling buttons */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-gray-50">
                      {req.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleAction(req.id, "Approved")}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="Accept Consultation"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAction(req.id, "Rejected")}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            title="Decline Request"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          req.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {requests.length === 0 && (
                  <p className="text-sm text-gray-400 italic p-6 text-center">No active requests found.</p>
                )}
              </div>
            </div>
          </section>

          {/* Right Sidebar Area: Case Repository & Compliance Monitor */}
          <aside className="space-y-6">
            {/* Active Management */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-gray-400" /> Active Case Files
              </h3>
              {activeCases.map(c => (
                <div key={c.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-semibold text-gray-900 block">{c.clientName}</span>
                      <span className="text-xs text-gray-400 block">{c.category}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {c.documentStatus}
                    </span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Next Hearing:</span>
                    <span className="font-medium text-gray-800">{c.nextHearing}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Anti-Circumvention / Compliance Advisory for Defense Presentation */}
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
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ShieldCheck, MapPin, Briefcase, Star, Calendar, Clock, CheckCircle, CreditCard } from "lucide-react";

// Mock dataset for single profile view routing
const LAWYER_DETAILS: Record<string, any> = {
  "1": {
    name: "Barrister Rafiqul Islam",
    specialty: "Criminal Law",
    location: "Dhaka (Supreme Court Office)",
    experience: "12 Years",
    fee: 2000,
    rating: 4.9,
    bio: "Specialized in white-collar crimes, constitutional litigation, and high-profile criminal defense. Practicing at the Supreme Court of Bangladesh with a history of landmark judgments.",
    education: ["LL.B (Hons) - University of London", "Bar Professional Training Course (BPTC) - Lincoln's Inn, UK"],
    availableDays: ["Monday", "Wednesday", "Thursday"],
    slots: ["10:00 AM", "11:30 AM", "03:00 PM", "04:30 PM"],
  },
  "2": {
    name: "Advocate Nusrat Jahan",
    specialty: "Family & Civil Law",
    location: "Chittagong Court Complex",
    experience: "8 Years",
    fee: 1500,
    rating: 4.8,
    bio: "Dedicated family practitioner dealing with property disputes, divorce settlements, and child custody laws with empathy and extreme legal precision.",
    education: ["LL.B (Hons) - University of Dhaka", "LL.M - University of Dhaka"],
    availableDays: ["Sunday", "Tuesday", "Wednesday"],
    slots: ["11:00 AM", "12:30 PM", "04:00 PM"],
  },
  "3": {
    name: "Tariqul Anam",
    specialty: "Corporate Law",
    location: "Gulshan-2, Dhaka",
    experience: "15 Years",
    fee: 3500,
    rating: 5.0,
    bio: "Corporate legal strategist advising top tech startups, multinational corporations, and venture capital firms across mergers, acquisitions, and IP licensing.",
    education: ["LL.B (Hons) - Rajshahi University", "LL.M (Corporate Law) - National University of Singapore"],
    availableDays: ["Sunday", "Monday", "Thursday"],
    slots: ["02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"],
  }
};

export default function LawyerProfile() {
  const { id } = useParams();
  const lawyer = LAWYER_DETAILS[id as string] || LAWYER_DETAILS["1"]; // Fallback to 1

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedSlot) return;
    setIsBooked(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Lawyer Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{lawyer.name}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {lawyer.specialty}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {lawyer.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg text-sm text-amber-700 font-semibold">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{lawyer.rating} Ratings</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Professional Summary</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{lawyer.bio}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Credentials & Education</h2>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pl-1">
                  {lawyer.education.map((edu: string, idx: number) => (
                    <li key={idx}>{edu}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Booking Widget */}
          <div className="w-full">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="mb-4">
                <span className="block text-xs text-gray-400 uppercase tracking-wider">Consultation Fee</span>
                <span className="text-3xl font-bold text-gray-900">BDT {lawyer.fee}</span>
                <span className="text-xs text-gray-500 block mt-1">Includes 30 mins virtual legal consultation</span>
              </div>

              <hr className="border-gray-100 my-4" />

              {!isBooked ? (
                <form onSubmit={handleBooking} className="space-y-4">
                  {/* Step 1: Select Day */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" /> 1. Choose Day
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {lawyer.availableDays.map((day: string) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => { setSelectedDay(day); setSelectedSlot(""); }}
                          className={`py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                            selectedDay === day
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                              : "border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select Time Slot */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gray-400" /> 2. Available Slots
                    </label>
                    {selectedDay ? (
                      <div className="grid grid-cols-2 gap-2">
                        {lawyer.slots.map((slot: string) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                              selectedSlot === slot
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Select a day first to view active slots</p>
                    )}
                  </div>

                  {/* Submit Checkout Button */}
                  <button
                    type="submit"
                    disabled={!selectedDay || !selectedSlot}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    Proceed to Payment
                  </button>
                </form>
              ) : (
                /* Post-Booking Interface / Checkout simulation */
                <div className="text-center py-6 space-y-4">
                  <div className="mx-auto bg-emerald-50 text-emerald-600 rounded-full h-12 w-12 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Slot Reserved Successfully</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Booking for <span className="font-medium text-gray-800">{selectedDay} at {selectedSlot}</span>
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-left space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Simulated Gateway payment</p>
                    <button 
                      onClick={() => setIsBooked(false)} 
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-500 transition-colors"
                    >
                      Pay via bKash / SSLCommerz
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
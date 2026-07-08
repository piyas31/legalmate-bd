"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ShieldCheck, MapPin, Briefcase, Star, Calendar, Clock, CheckCircle, CreditCard, Loader2 } from "lucide-react";
import { getLawyerById, createAppointment } from "@/app/actions/lawyer";

// ডাইনামিক বুকিং স্লট টাইমিং ট্র্যাকিং
const AVAILABLE_SLOTS = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
const AVAILABLE_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function LawyerProfile() {
  const { id } = useParams();
  const router = useRouter();
  
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (id) {
        const data = await getLawyerById(id as string);
        setLawyer(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedSlot || !lawyer) return;

    setBookingLoading(true);
    setErrorMessage("");

    // স্লট ও দিনকে একত্রিত করে একটি ভ্যালিড JavaScript Date অবজেক্ট তৈরি করা
    const today = new Date();
    const scheduledDate = new Date(today.toDateString() + " " + selectedSlot);

    const response = await createAppointment({
      lawyerProfileId: lawyer.id,
      scheduledAt: scheduledDate,
    });

    setBookingLoading(false);

    if (response.success) {
      setIsBooked(true);
    } else {
      setErrorMessage(response.error || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-gray-500">
          Professional profile not found or unverified.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Lawyer Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4 items-start">
                  {lawyer.image && (
                    <img src={lawyer.image} alt={lawyer.name} className="w-16 h-16 rounded-full border object-cover" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">{lawyer.name}</h1>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {lawyer.specialty}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Bangladesh Supreme Court</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Bar Council No: {lawyer.barCouncilNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-lg text-sm text-amber-700 font-semibold">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{lawyer.rating || "0.0"} Ratings</span>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Professional Summary</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lawyer.bio || `${lawyer.name} is an expert in ${lawyer.specialty} with over ${lawyer.experienceYrs} years of consistent legal practice.`}
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Experience & Practice</h2>
                <p className="text-sm text-gray-600">Active member with {lawyer.experienceYrs} years of litigation and consultation history.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Booking Widget */}
          <div className="w-full">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <div className="mb-4">
                <span className="block text-xs text-gray-400 uppercase tracking-wider">Consultation Fee</span>
                <span className="text-3xl font-bold text-gray-900">BDT {Number(lawyer.hourlyRate).toFixed(0)}</span>
                <span className="text-xs text-gray-500 block mt-1">Includes 30 mins virtual legal consultation</span>
              </div>

              <hr className="border-gray-100 my-4" />

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs mb-4">{errorMessage}</div>
              )}

              {!isBooked ? (
                <form onSubmit={handleBooking} className="space-y-4">
                  {/* Step 1: Select Day */}
                  <div>
                    <label className=" text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" /> 1. Choose Day
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {AVAILABLE_DAYS.map((day: string) => (
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
                        {AVAILABLE_SLOTS.map((slot: string) => (
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
                    disabled={!selectedDay || !selectedSlot || bookingLoading}
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {bookingLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Proceed to Payment
                      </>
                    )}
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
                      onClick={() => router.push("/dashboard")} 
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-500 transition-colors"
                    >
                      Go to Dashboard to Pay via bKash
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
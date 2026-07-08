"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Search, MapPin, Briefcase, Star, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { getLawyers } from "@/app/actions/lawyer";

export default function LawyersDirectory() {
  const [lawyersList, setLawyersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  useEffect(() => {
    async function fetchLiveLawyers() {
      const data = await getLawyers();
      setLawyersList(data);
      setLoading(false);
    }
    fetchLiveLawyers();
  }, []);

  // লাইভ ডাটার ওপর ক্লায়েন্ট-সাইড ফিল্টারিং
  const filteredLawyers = lawyersList.filter((lawyer) => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || 
      lawyer.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">Filter Options</h2>
            
            {/* Search Input */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 mb-2">Search Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Rafiqul"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
                />
              </div>
            </div>

            {/* Specialty Filter */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-500 mb-2">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 text-gray-700"
              >
                <option value="All">All Specialties</option>
                <option value="Criminal">Criminal Law</option>
                <option value="Civil">Civil Law</option>
                <option value="Corporate">Corporate Law</option>
              </select>
            </div>
          </aside>

          {/* Directory Listings */}
          <section className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">{filteredLawyers.length}</span> verified specialists
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredLawyers.map((lawyer) => (
                  <div 
                    key={lawyer.id} 
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-gray-200 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {lawyer.image && (
                          <img src={lawyer.image} alt={lawyer.name} className="w-10 h-10 rounded-full border object-cover" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">{lawyer.name}</h3>
                          {lawyer.isVerified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                              <ShieldCheck className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {lawyer.specialty}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Supreme Court Office</span>
                        <span>• {lawyer.experienceYrs} Yrs Experience</span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                        <Star className="h-4 w-4 fill-current" />
                        <span>{lawyer.rating || "0.0"}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                      <div className="text-left sm:text-right">
                        <span className="block text-xs text-gray-400">Consultation Fee</span>
                        <span className="text-xl font-bold text-gray-900">BDT {Number(lawyer.hourlyRate).toFixed(0)}</span>
                      </div>
                      <Link
                        href={`/lawyers/${lawyer.id}`}
                        className="rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        View Profile & Book
                      </Link>
                    </div>
                  </div>
                ))}

                {filteredLawyers.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">No lawyers found matching your selected criteria.</p>
                  </div>
                )}
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
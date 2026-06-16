import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  CheckCircle2,
  Video,
  Search,
  Shield,
  Users,
} from "lucide-react";

const FEATURED_LAWYERS = [
  {
    name: "Barrister Rafiqul Islam",
    specialty: "Criminal Law & Constitutional Litigation",
    rating: "4.9 (120+ reviews)",
    location: "Dhaka (Supreme Court)",
    experience: "12+ Yrs Experience",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256",
  },
  {
    name: "Tariqul Anam",
    specialty: "Corporate Strategy & IP Law",
    rating: "5.0 (95+ reviews)",
    location: "Gulshan Corporate District",
    experience: "15+ Yrs Experience",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256",
  },
  {
    name: "Advocate Nusrat Jahan",
    specialty: "Family Legislation & Civil disputes",
    rating: "4.8 (140+ reviews)",
    location: "Chittagong Court Complex",
    experience: "8+ Yrs Experience",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Next-Level Interactive Hero Section */}
        <section className="relative px-4 pt-16 pb-28 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/40 via-white to-[#FAFAFA] overflow-hidden">
          {/* Decorative Mesh Gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-[120px] pointer-events-none"></div>
          <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-200/20 blur-[100px] pointer-events-none"></div>

          <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Premium Text & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100/80 px-3.5 py-1.5 text-xs font-bold text-indigo-700 shadow-sm mx-auto lg:mx-0">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Trusted by 10,000+ Clients Nationwide
              </div>

              <h1 className="text-4xl font-black text-gray-950 sm:text-6xl tracking-tight leading-[1.08] lg:max-w-xl">
                Smart Legal Counsel. <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Zero Middlemen.
                </span>
              </h1>

              <p className="text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with Bar Council verified advocates instantly. Secure
                direct appointments, manage case documentation, and consultation
                slots via an encrypted portal.
              </p>

              {/* Dynamic Action Controls */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/lawyers"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Find an Advocate <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:border-gray-300"
                >
                  Join as Practitioner
                </Link>
              </div>

              {/* Micro Trust Checklist */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Shield className="h-4 w-4 text-emerald-600" /> Verified
                  License Check
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <Video className="h-4 w-4 text-emerald-600" /> 1-on-1
                  Encrypted Video
                </span>
              </div>
            </div>

            {/* Right Column: Interactive UI Visual Simulation Showcase */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-sm bg-white border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.08)] p-6 space-y-5 backdrop-blur-sm bg-white/90">
                {/* Search Bar Simulation */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    Quick Directory Filter
                  </span>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <div className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-400 flex justify-between items-center select-none">
                      <span>Search Corporate, Civil Law...</span>
                      <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                        Find
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Simulated Consultant Widget */}
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    Available Now
                  </span>
                  <div className="flex gap-3 items-center bg-indigo-50/40 border border-indigo-50 p-3 rounded-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120"
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                      alt="Visual Placeholder"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        Advocate Nusrat Jahan
                      </h4>
                      <p className="text-[11px] text-indigo-600 font-medium">
                        Family Legislation
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Star className="h-2.5 w-2.5 fill-current" /> 4.8
                      </span>
                    </div>
                  </div>

                  {/* Simulated Dynamic Slot Button */}
                  <div className="bg-gray-950 text-white rounded-xl p-3 text-center text-xs font-bold shadow-md shadow-gray-950/10 cursor-pointer hover:bg-gray-900 transition-all select-none">
                    Confirm Video Consultation Slot
                  </div>
                </div>
              </div>

              {/* Floating Metrics Badge for Aesthetic depth */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-gray-100 shadow-xl rounded-2xl p-3 hidden sm:flex items-center gap-3 animate-bounce-slow">
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-xs font-black text-gray-900">
                    250+ Online
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Verified Advocates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Premium About & Platform Integrity Section */}
        <section className="bg-white border-b border-gray-100 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-md">
                  Re-engineering Advocacy
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
                  Democratizing the Legal Architecture of Bangladesh
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  Traditional pipelines are fundamentally broken—clogged with
                  rent-seeking brokers and extreme lack of rate visibility.
                  LegalSphere acts as a secure, audited technical bridge. We
                  grant citizens direct access to authenticated litigation
                  experts with a zero-circumvention protocol.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Vetted License Ecosystem
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Strict manual verification matching Bar Council
                        databases.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Escrowed Retention
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Fees are held securely until the consult concludes
                        successfully.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Feature Teaser Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:12px_12px]"></div>
                <div className="relative z-10 space-y-6">
                  <div className="h-10 w-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Integrated Video Consultation
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Powered by high-definition 100ms video feeds. No phone
                      numbers swapped, keeping your operational identity
                      completely anonymous and safe.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex justify-between items-center text-xs">
                    <span className="text-slate-300">Encryption Standard</span>
                    <span className="text-emerald-400 font-mono">
                      AES-256 Bit
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Micro-Stats Section */}
        <section className="bg-[#FAFAFA] py-16 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Advocates", val: "250+" },
              { label: "Consultation Hours", val: "4,800+" },
              { label: "Rating Average", val: "4.92" },
              { label: "Bypassed Middlemen", val: "100%" },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center md:text-left md:border-l md:border-gray-200 md:pl-6 first:border-0"
              >
                <span className="block text-3xl font-black text-gray-900 font-mono tracking-tight">
                  {item.val}
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1 block">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. High-End Featured Lawyers */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Top-Tier Legal Partners
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Book instant consultations with our highest-rated legal
                consultants this week.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {FEATURED_LAWYERS.map((lawyer, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-20 w-20 mx-auto mb-6">
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="h-full w-full object-cover rounded-full ring-4 ring-indigo-50"
                      />
                      <span
                        className="absolute bottom-0 right-1 bg-emerald-500 border-2 border-white h-4 w-4 rounded-full"
                        title="Verified Practitioner"
                      ></span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 text-center">
                      {lawyer.name}
                    </h4>
                    <span className="block text-xs font-medium text-indigo-600 text-center mt-1 bg-indigo-50/50 px-2.5 py-1 rounded-md mx-auto w-fit">
                      {lawyer.specialty}
                    </span>

                    <div className="space-y-2 mt-6 border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Briefcase className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{lawyer.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <span>{lawyer.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-amber-600 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-current shrink-0" />
                        <span>{lawyer.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/lawyers"
                      className="block text-center w-full py-2.5 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl text-xs font-bold text-gray-700 transition-all border border-gray-100"
                    >
                      Check Availability
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Sleek Final Call-to-Action Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-gray-950 via-slate-900 to-indigo-950 rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Take Control of Your Legal Resolution
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
                  Sign up now to explore the direct legal marketplace. Instant
                  onboarding for both corporate and private clients.
                </p>
                <div className="pt-4">
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-lg text-sm"
                  >
                    Get Started Instantly{" "}
                    <ArrowRight className="h-4 w-4 text-indigo-600" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

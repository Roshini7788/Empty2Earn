import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Truck, UserCheck, ShieldCheck, Leaf, TrendingDown, DollarSign, ArrowRight, MapPin, CheckCircle, Navigation, Sparkles } from 'lucide-react';

export const LandingPage = () => {
  const { setCurrentView, loginCustomerDemo, loginDriverDemo } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo size="normal" onClick={() => setCurrentView('landing')} />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-emerald-600 transition-colors">Benefits</a>
            <a href="#about" className="hover:text-emerald-600 transition-colors">About Us</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('customer-login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all"
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('customer-login')}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Sustainable Logistics</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                Turn Empty Returns into <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">Smart Deliveries.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Empty2Earn connects available drivers with matching shipments on their return routes, reducing empty kilometres, cutting transportation costs, and significantly lowering carbon emissions.
              </p>

              {/* Two Prominent Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('customer-login')}
                  className="flex-1 sm:flex-none px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-98 text-base"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>I'm a Customer</span>
                </button>

                <button
                  onClick={() => setCurrentView('driver-login')}
                  className="flex-1 sm:flex-none px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-98 text-base"
                >
                  <Truck className="w-5 h-5" />
                  <span>I'm a Driver</span>
                </button>
              </div>

              {/* Quick Demo Preview Badges */}
              <div className="pt-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Instant Demo Access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Shared Live State
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Zero Setup Needed
                </span>
              </div>
            </div>

            {/* Right Column Illustration matching Reference Screen #1 */}
            <div className="lg:col-span-6">
              <div className="relative bg-gradient-to-b from-sky-50 via-emerald-50/50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl overflow-hidden">
                
                {/* Background Map Graphic SVG */}
                <div className="relative w-full h-[320px] sm:h-[380px] flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 350" fill="none">
                    {/* Soft Green Landscape Hill */}
                    <path d="M0 260 Q 150 200 300 240 T 500 220 L 500 350 L 0 350 Z" fill="#e6f4ea" />
                    <path d="M0 290 Q 200 250 380 300 T 500 280 L 500 350 L 0 350 Z" fill="#ceead6" />
                    
                    {/* Winding Route Path */}
                    <path 
                      d="M 60 270 Q 160 120 280 180 T 440 100" 
                      stroke="#cbd5e1" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                    <path 
                      d="M 60 270 Q 160 120 280 180 T 440 100" 
                      stroke="#0284c7" 
                      strokeWidth="4" 
                      strokeDasharray="8 6" 
                      strokeLinecap="round" 
                      fill="none" 
                    />

                    {/* Trees & Eco Pins */}
                    <circle cx="120" cy="220" r="14" fill="#34d399" opacity="0.6" />
                    <circle cx="340" cy="250" r="18" fill="#10b981" opacity="0.5" />

                    {/* Start Pin */}
                    <g transform="translate(50, 240)">
                      <circle cx="10" cy="10" r="16" fill="#0284c7" opacity="0.2" />
                      <circle cx="10" cy="10" r="8" fill="#0284c7" />
                      <text x="10" y="34" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Bhimavaram / NY</text>
                    </g>

                    {/* End Pin */}
                    <g transform="translate(430, 70)">
                      <circle cx="10" cy="10" r="16" fill="#10b981" opacity="0.2" />
                      <circle cx="10" cy="10" r="8" fill="#10b981" />
                      <text x="10" y="34" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">Vijayawada / Boston</text>
                    </g>

                    {/* Moving Delivery Truck Graphic */}
                    <g transform="translate(220, 140)" className="animate-drive">
                      <rect x="0" y="0" width="70" height="42" rx="6" fill="#2563eb" />
                      <polygon points="70,16 92,16 102,28 102,42 70,42" fill="#1d4ed8" />
                      {/* Truck Cab Window */}
                      <polygon points="74,20 88,20 94,28 74,28" fill="#93c5fd" />
                      {/* Wheels */}
                      <circle cx="20" cy="42" r="10" fill="#0f172a" />
                      <circle cx="20" cy="42" r="4" fill="#94a3b8" />
                      <circle cx="82" cy="42" r="10" fill="#0f172a" />
                      <circle cx="82" cy="42" r="4" fill="#94a3b8" />
                      {/* Eco Leaf Branding on Truck */}
                      <path d="M 25 15 C 35 10, 45 25, 35 30 C 25 30, 20 20, 25 15 Z" fill="#4ade80" />
                    </g>
                  </svg>
                </div>

                {/* Floating Stats Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Smart Match Score</div>
                    <div className="text-sm font-bold text-slate-900">92% Route Efficiency</div>
                  </div>
                </div>

                {/* Floating Distance Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Empty Kilometres Saved</div>
                    <div className="text-sm font-bold text-slate-900">42 km per return trip</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3 Benefit Cards matching Reference Screen #1 */}
        <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Why Choose Empty2Earn?</h2>
            <p className="mt-3 text-slate-600">Maximizing logistics efficiency while eliminating empty return trips.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Less Empty Kilometres</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Maximize vehicle capacity by monetizing return leg journeys that would otherwise run completely empty.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <DollarSign className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lower Costs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Customers get discounted transport rates while drivers earn extra revenues to offset fuel and operational expenses.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Greener Planet</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Directly reduce overall carbon emissions, diesel fuel consumption, and unnecessary highway congestion.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900">How Empty2Earn Works</h2>
              <p className="mt-3 text-slate-600">3 simple steps to connect shippers and return journey drivers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md">1</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Request Pickup</h4>
                <p className="text-sm text-slate-600">Customers enter pickup & destination details along with package dimensions and weight.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md">2</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Smart Route Matching</h4>
                <p className="text-sm text-slate-600">Our engine matches your parcel with verified drivers returning along the same corridor.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md">3</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Track & Deliver</h4>
                <p className="text-sm text-slate-600">Driver accepts, picks up package, and provides real-time progress until delivery completion.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="normal" />
          <p className="text-xs text-slate-500">
            © 2026 Empty2Earn Logistics Inc. All rights reserved. • Turn Empty Returns into Smart Deliveries.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

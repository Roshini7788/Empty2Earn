import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { 
  Truck, 
  UserCheck, 
  Leaf, 
  DollarSign, 
  ArrowRight, 
  LogIn
} from 'lucide-react';

export const LandingPage = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* 1. Header - Top Left: Project Name & Logo Image (No "E2E" word). Top Right: How It Works & Benefits */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Top Left: Logo & Project Name */}
          <Logo size="normal" onClick={() => setCurrentView('landing')} />

          {/* Top Right: How It Works & Benefits Navigation Links */}
          <nav className="flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#2874f0] transition-colors py-1">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-[#2874f0] transition-colors py-1">
              Benefits
            </a>
          </nav>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1">
        
        {/* 2. Hero Section - Full Viewport Height so "How It Works" appears ONLY WHEN YOU SCROLL */}
        <section className="min-h-[calc(100vh-4.5rem)] py-10 sm:py-16 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200 flex flex-col justify-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 w-full">
            
            {/* Minimal Title */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                Turn Empty Returns into <span className="text-[#2874f0]">Smart Deliveries</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500">
                Connect shippers with drivers returning on empty routes.
              </p>
            </div>

            {/* ENLARGED, PROMINENT & ATTRACTIVE LOGIN PORTAL CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* CUSTOMER LOGIN PORTAL (ENLARGED) */}
              <div className="bg-white rounded-3xl border border-slate-200 border-t-8 border-t-[#2874f0] shadow-md hover:shadow-xl transition-all duration-300 p-8 sm:p-10 text-center flex flex-col items-center justify-between space-y-8 group hover:-translate-y-1">
                
                <div className="space-y-5 flex flex-col items-center w-full">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                    <UserCheck className="w-9 h-9 sm:w-10 sm:h-10" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Customer Login</h2>
                    <p className="text-sm sm:text-base font-semibold text-[#2874f0]">
                      For Shippers & Businesses
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('customer-login')}
                  className="w-full py-4 px-6 bg-[#2874f0] hover:bg-[#1a62d6] text-white font-extrabold rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-3 text-base sm:text-lg transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login as Customer</span>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </button>

              </div>

              {/* CARRIER LOGIN PORTAL (ENLARGED) */}
              <div className="bg-white rounded-3xl border border-slate-200 border-t-8 border-t-[#ff9f00] shadow-md hover:shadow-xl transition-all duration-300 p-8 sm:p-10 text-center flex flex-col items-center justify-between space-y-8 group hover:-translate-y-1">
                
                <div className="space-y-5 flex flex-col items-center w-full">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-amber-50 text-slate-900 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                    <Truck className="w-9 h-9 sm:w-10 sm:h-10 text-slate-900" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Carrier Login</h2>
                    <p className="text-sm sm:text-base font-semibold text-amber-700">
                      For Drivers & Fleet Owners
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('driver-login')}
                  className="w-full py-4 px-6 bg-[#0f172a] hover:bg-[#1e293b] text-white font-extrabold rounded-2xl shadow-md shadow-slate-900/20 flex items-center justify-center gap-3 text-base sm:text-lg transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-[#ffe500]" />
                  <span>Login as Carrier</span>
                  <ArrowRight className="w-5 h-5 ml-auto text-[#ffe500]" />
                </button>

              </div>

            </div>

          </div>
        </section>

        {/* 3. How It Works Section - APPEARS ONLY WHEN SCROLLING DOWN */}
        <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900">How It Works</h2>
              <p className="mt-2 text-sm text-slate-500">Streamlined 3-step freight matching process.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#0f172a] text-white font-bold text-base flex items-center justify-center mx-auto mb-5 shadow-xs">1</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Submit Order</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Enter cargo dimensions, weight, and pickup destination.</p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#2874f0] text-white font-bold text-base flex items-center justify-center mx-auto mb-5 shadow-xs">2</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Route Match</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Pairs orders with verified drivers operating on return legs.</p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full bg-[#ff9f00] text-slate-950 font-bold text-base flex items-center justify-center mx-auto mb-5 shadow-xs">3</div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Track & Deliver</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">Driver picks up shipment with real-time tracking until drop-off.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Platform Benefits Section */}
        <section id="benefits" className="py-20 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900">Platform Benefits</h2>
              <p className="mt-2 text-sm text-slate-500">Designed for logistics efficiency and cost savings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2874f0] flex items-center justify-center mb-5">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Zero Empty Kilometres</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Eliminate empty return runs by filling truck capacity on return routes.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#d97706] flex items-center justify-center mb-5">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Lower Transportation Costs</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Shippers save on freight costs while carriers monetize idle transit capacity.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-200 bg-white hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Reduced Carbon Footprint</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lower fuel consumption and greenhouse emissions per freight unit.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 py-10 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <Logo size="small" light={true} />
          <p className="text-slate-500">
            © 2026 Empty2Earn Logistics Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

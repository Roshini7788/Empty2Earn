import React from 'react';
import { useApp } from '../context/AppContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { Truck, MapPin, ArrowRight, Leaf, ChevronRight, Clock } from 'lucide-react';

export const CustomerDashboardPage = () => {
  const { currentUser, shipments, setCurrentView, setActiveShipmentId } = useApp();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">In Transit</span>;
      case 'Delivered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Delivered</span>;
      case 'Picked Up':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">Picked Up</span>;
      case 'Accepted':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700">Accepted</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Pending</span>;
    }
  };

  // Take only top 2 recent items for a very compact view
  const recentShipments = shipments.slice(0, 2);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Customer Dashboard</h1>
            <p className="text-xs text-slate-500">Quick pickup requests & live shipment tracking</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              PS
            </div>
            <div className="text-left text-xs">
              <span className="font-bold text-slate-900 block">{currentUser?.name || 'Priya Sharma'}</span>
              <span className="text-[10px] text-slate-500">Customer</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Welcome Greeting Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Good morning, {currentUser?.name?.split(' ')[0] || 'Priya'}!
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Let's make your deliveries more efficient and eco-friendly today.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cleaner Deliveries • Greener Tomorrow</span>
            </div>
          </div>

          {/* TWO MAIN LARGE ACTION CARDS: Request Your Pickup & Track Your Request */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Card 1: Request Your Pickup */}
            <div 
              onClick={() => setCurrentView('request-pickup')}
              className="group bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  Save up to 40%
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Request Your Pickup
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Find empty return journey trucks for your cargo & reduce freight logistics costs.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Start Pickup Wizard →</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Action Card 2: Track Your Request */}
            <div 
              onClick={() => setCurrentView('track-request')}
              className="group bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#2874f0] shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold group-hover:bg-[#2874f0] group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  Live Dynamic GPS
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                  Track Your Request
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Check live shipment progress, driver coordinates, and secure delivery handover OTP.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2874f0]">
                <span>View Live Tracking →</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* COMPACT RECENT REQUESTS SECTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Activity</span>
              <button
                onClick={() => setCurrentView('track-request')}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                View all
              </button>
            </div>

            {/* Ultra-compact mini list */}
            <div className="space-y-2">
              {recentShipments.map((req) => (
                <div
                  key={req.id}
                  onClick={() => {
                    setActiveShipmentId(req.id);
                    setCurrentView('track-request');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{req.id}</span>
                    <span className="text-slate-600 font-medium">
                      {req.pickupLocation.split(',')[0]} → {req.deliveryDestination.split(',')[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(req.status)}
                    <span className="text-[10px] text-slate-400">{req.pickupDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

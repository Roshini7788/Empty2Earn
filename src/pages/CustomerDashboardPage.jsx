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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Good morning, {currentUser?.name?.split(' ')[0] || 'Priya'}!
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Let's make your deliveries more efficient and eco-friendly today.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-emerald-800 text-xs font-semibold">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Cleaner deliveries, Greener tomorrow</span>
            </div>
          </div>

          {/* TWO MAIN LARGE ACTION CARDS: Request Your Pickup & Track Your Request */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Card 1: Request Your Pickup */}
            <div 
              onClick={() => setCurrentView('request-pickup')}
              className="group bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-8 rounded-3xl border border-emerald-200/90 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8" />
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Request Your Pickup
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Find the best return journey drivers for your shipment & save up to 40% on shipping.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-100/80 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span>Start Pickup Request</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action Card 2: Track Your Request */}
            <div 
              onClick={() => setCurrentView('track-request')}
              className="group bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 p-8 rounded-3xl border border-blue-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Track Your Request
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Check live shipment status, driver details, and interactive simulated GPS route map.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-100/80 flex items-center gap-2 text-xs font-bold text-blue-700">
                <span>View Live Tracking</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* VERY SMALL & COMPACT RECENT REQUESTS SECTION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
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

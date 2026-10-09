import React from 'react';
import { useApp } from '../context/AppContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { GoogleMapsTrackingView } from '../components/GoogleMapsTrackingView';
import { Truck, MapPin, Navigation, Clock, ShieldCheck, Star, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

export const CustomerTrackingPage = () => {
  const { shipments, activeShipmentId, setActiveShipmentId, setCurrentView } = useApp();

  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">In Transit</span>;
      case 'Delivered':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'Picked Up':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">Picked Up</span>;
      case 'Accepted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200">Accepted</span>;
      case 'Requested':
      case 'Pending Driver Confirmation':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Pending Driver Confirmation</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Track Your Request</h1>
            <p className="text-xs text-slate-500">Live route tracking and driver progress update</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500">Select Order:</label>
            <select
              value={activeShipmentId}
              onChange={(e) => setActiveShipmentId(e.target.value)}
              className="bg-slate-100 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {shipments.map(s => (
                <option key={s.id} value={s.id}>{s.id} ({s.pickupLocation.split(',')[0]} → {s.deliveryDestination.split(',')[0]})</option>
              ))}
            </select>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full space-y-6">
          
          {/* Main Tracking Details Card matching Reference Screen #10 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            {/* Header Row: Request ID & Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Request ID</div>
                <div className="text-2xl font-extrabold text-slate-900">{activeShipment?.id}</div>
              </div>
              <div>
                {getStatusBadge(activeShipment?.status)}
              </div>
            </div>

            {/* Assigned Driver Card matching Screen #10 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
              
              {/* Driver Avatar & Name */}
              <div className="md:col-span-7 flex items-center gap-4">
                <img
                  src={activeShipment?.driverAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                  alt={activeShipment?.driverName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{activeShipment?.driverName || 'Ramesh Varma'}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Verified Driver
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {activeShipment?.driverRating || 4.8}
                    </span>
                    <span>•</span>
                    <span>{activeShipment?.driverDeliveries || 124} deliveries</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{activeShipment?.vehicleType || 'Truck • Eicher (18m³)'}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Arrival Banner */}
              <div className="md:col-span-5 bg-white p-4 rounded-xl border border-slate-200 text-right md:text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase">Estimated Arrival</div>
                <div className="text-xl font-extrabold text-slate-900">{activeShipment?.estimatedArrival || '2:15 PM (in ~10 min)'}</div>
                <div className="text-[11px] text-emerald-600 font-semibold">On time • Driver en route</div>
              </div>
            </div>

            {/* Pickup & Destination Bar matching Screen #10 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-800/20 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-950/20">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-emerald-900 font-extrabold block uppercase text-[10px] tracking-wider">Pickup Location</span>
                  <span className="font-extrabold text-slate-950 text-sm">{activeShipment?.pickupLocation}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-blue-900/20 shadow-sm flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold shadow-md shadow-blue-950/20">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-blue-900 font-extrabold block uppercase text-[10px] tracking-wider">Delivery Destination</span>
                  <span className="font-extrabold text-slate-950 text-sm">{activeShipment?.deliveryDestination}</span>
                </div>
              </div>
            </div>

            {/* DYNAMIC REAL-TIME GOOGLE MAPS TRACKING VIEW */}
            <GoogleMapsTrackingView shipment={activeShipment} />

            {/* View Delivery Completion CTA if Delivered */}
            {activeShipment?.status === 'Delivered' && (
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('completion')}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
                >
                  View Delivery Completed Screen & Impact →
                </button>
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};

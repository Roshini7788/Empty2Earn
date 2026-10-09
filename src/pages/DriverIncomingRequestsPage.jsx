import React from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { Package, MapPin, Calendar, Clock, Sparkles, Navigation, DollarSign, Leaf, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const DriverIncomingRequestsPage = () => {
  const { shipments, acceptShipmentRequest, rejectShipmentRequest, setCurrentView } = useApp();

  // Pending incoming requests
  const pendingRequests = shipments.filter(s => s.status === 'Requested' || s.status === 'Pending Driver Confirmation' || s.status === 'In Transit' || s.status === 'Accepted');

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Incoming Shipment Requests</h1>
            <p className="text-xs text-slate-500">Review & accept matching shipment pick-ups along your return corridor</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-xs">
              {pendingRequests.filter(r => r.status === 'Requested' || r.status === 'Pending Driver Confirmation').length} Pending Requests
            </span>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full space-y-6">
          
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Matching Customer Requests</h2>
              <p className="text-xs text-slate-500">Ranked by route efficiency, extra detour distance, and vehicle capacity compatibility</p>
            </div>
          </div>

          {/* Cards List matching Reference Screen #8 */}
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">All Requests Addressed!</h3>
                <p className="text-xs text-slate-500">No pending shipment requests right now. Check back soon.</p>
              </div>
            ) : (
              pendingRequests.map((req) => {
                const isPending = req.status === 'Requested' || req.status === 'Pending Driver Confirmation';
                const isAccepted = req.status === 'Accepted' || req.status === 'In Transit' || req.status === 'Heading to Pickup' || req.status === 'Picked Up';
                
                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-3xl border p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                      isAccepted ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-200 hover:shadow-md'
                    }`}
                  >
                    {/* Left Details */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-base text-slate-900">{req.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {req.packageType}
                        </span>
                        {isAccepted && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Accepted ({req.status})
                          </span>
                        )}
                      </div>

                      {/* Route Location */}
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{req.pickupLocation}</span>
                        <span className="text-slate-400 font-normal">→</span>
                        <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{req.deliveryDestination}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Required Capacity</span>
                          <span className="font-bold text-slate-800">{req.requiredCapacity || 6} m³ ({req.weight} kg)</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Requested Window</span>
                          <span className="font-semibold text-slate-800">{req.pickupDate}, {req.pickupTimeWindow}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Customer</span>
                          <span className="font-semibold text-slate-800">{req.customerName || 'Sarah Johnson'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Metrics & Accept/Reject Actions matching Screen #8 */}
                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-4 min-w-[200px]">
                      
                      {/* Compatibility Badge & Detour */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full border-4 border-emerald-500 text-emerald-700 font-extrabold text-xs flex items-center justify-center bg-emerald-50">
                          {req.matchScore || 86}%
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-emerald-600">+{req.extraDistanceKm || 15} km</div>
                          <div className="text-[10px] text-slate-400">Detour distance</div>
                        </div>
                      </div>

                      {/* Earnings & Empty KM Avoided */}
                      <div className="text-right space-y-0.5">
                        <div className="text-2xl font-extrabold text-slate-900">₹{req.price * 80 || '14,400'}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
                          <Leaf className="w-3 h-3" /> {req.emptyKmAvoided || 42} km empty avoided
                        </div>
                      </div>

                      {/* Accept & Reject Buttons */}
                      {isPending ? (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <button
                            onClick={() => acceptShipmentRequest(req.id)}
                            className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectShipmentRequest(req.id)}
                            className="px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCurrentView('delivery-status')}
                          className="w-full md:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                        >
                          Update Status Flow →
                        </button>
                      )}

                    </div>
                  </div>
                );
              })
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

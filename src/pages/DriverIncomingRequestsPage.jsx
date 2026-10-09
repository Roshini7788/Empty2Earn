import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  Navigation, 
  IndianRupee, 
  Leaf, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Truck, 
  Radio, 
  Power, 
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const DriverIncomingRequestsPage = () => {
  const { 
    currentUser, 
    driverTrip, 
    setDriverTrip, 
    shipments, 
    acceptShipmentRequest, 
    rejectShipmentRequest, 
    setCurrentView 
  } = useApp();

  const [acceptedJustNow, setAcceptedJustNow] = useState(null);

  const currentDriverId = currentUser?.id || 'd1';
  const currentDriverName = currentUser?.name || 'Ramesh Varma';
  const isTruckDeployed = Boolean(driverTrip.isAvailable);

  // ONLY show pending incoming requests specifically submitted for THIS driver
  const pendingRequests = shipments.filter(s => {
    const isTargetDriver = s.driverId === currentDriverId || s.driverName === currentDriverName;
    const isPending = s.status === 'Requested' || s.status === 'Pending Driver Confirmation';
    return isTargetDriver && isPending;
  });

  const handleAccept = (reqId) => {
    acceptShipmentRequest(reqId);
    setAcceptedJustNow(reqId);
  };

  const handleDeployToggle = () => {
    setDriverTrip(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Incoming Shipment Requests</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and accept dynamic customer ride requests matched to your deployed truck
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Deployment Status Pill */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold">Truck Deployment:</span>
              <button
                onClick={handleDeployToggle}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isTruckDeployed 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isTruckDeployed ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
                {isTruckDeployed ? 'Online & Available' : 'Truck Offline'}
              </button>
            </div>

            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full font-extrabold text-xs">
              {pendingRequests.length} Pending
            </span>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full space-y-6">

          {/* Success Banner if accepted an order recently */}
          {acceptedJustNow && (
            <div className="bg-emerald-50 border-2 border-emerald-500/40 p-5 rounded-3xl flex items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Shipment {acceptedJustNow} Accepted!</h4>
                  <p className="text-xs text-emerald-800">
                    The ride is confirmed. Capacity allocated and route queued in Delivery Status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('delivery-status')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                Go to Delivery Status <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          
          {/* Active Deployed Truck Info Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#2874f0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                isTruckDeployed ? 'bg-[#2874f0]' : 'bg-slate-400'
              }`}>
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">
                    {driverTrip.origin} <span className="text-slate-400">→</span> {driverTrip.destination}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isTruckDeployed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isTruckDeployed ? 'Active Deployed Route' : 'Offline / Inactive'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {driverTrip.vehicleType} • {driverTrip.availableCapacity} m³ free space available for customer booking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('driver-dashboard')}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2874f0] text-xs font-bold rounded-xl transition-all border border-blue-200 cursor-pointer"
              >
                Edit Route in Dashboard
              </button>
            </div>
          </div>

          {/* TRUCK OFFLINE NOTICE (If driver has not deployed truck) */}
          {!isTruckDeployed && (
            <div className="bg-amber-50 border border-amber-300 p-8 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Power className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-amber-900">Truck Currently Offline (Not Deployed)</h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto">
                Your truck is set to unavailable. Customers cannot book pickups for this truck until you deploy it online.
              </p>
              <button
                onClick={handleDeployToggle}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <Power className="w-4 h-4" /> Deploy Truck & Go Online Now
              </button>
            </div>
          )}

          {/* DYNAMIC REQUESTS LIST */}
          {isTruckDeployed && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                /* LIVE RADAR WAITING STATE */
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
                  <div className="relative w-16 h-16 mx-auto">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
                    <div className="relative w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                      <Radio className="w-8 h-8 text-emerald-600 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Waiting for Customer Requests</h3>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 leading-relaxed">
                      Your truck is actively deployed and listening for requests along the{' '}
                      <strong className="text-slate-800">{driverTrip.origin} → {driverTrip.destination}</strong> corridor.
                      As soon as a customer (e.g. your friend logged in as customer) submits a pickup request selecting you, it will appear here instantly!
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Real-time WebSocket & Cross-Tab Sync Active
                  </div>
                </div>
              ) : (
                /* REAL DYNAMIC REQUESTS */
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-[#2874f0] p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Left Details */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-base text-slate-900">{req.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {req.packageType}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Pending Confirmation
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" /> Dynamic Request
                        </span>
                      </div>

                      {/* Route Location with High Contrast Badges */}
                      <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-900">
                        <div className="flex items-center gap-1.5 bg-emerald-100/90 border border-emerald-300 text-emerald-950 px-2.5 py-1 rounded-xl">
                          <MapPin className="w-4 h-4 text-emerald-900 shrink-0" />
                          <span>{req.pickupLocation}</span>
                        </div>
                        <span className="text-slate-400 font-normal">→</span>
                        <div className="flex items-center gap-1.5 bg-blue-100/90 border border-blue-300 text-blue-950 px-2.5 py-1 rounded-xl">
                          <Navigation className="w-4 h-4 text-blue-900 shrink-0" />
                          <span>{req.deliveryDestination}</span>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Required Cargo Space</span>
                          <span className="font-extrabold text-slate-800">{req.requiredCapacity || 5} m³ ({req.weight} kg)</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Requested Window</span>
                          <span className="font-semibold text-slate-800">{req.pickupDate}, {req.pickupTimeWindow}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Requested By Customer</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                            {req.customerName || 'Priya Sharma'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Price & Actions */}
                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-4 min-w-[200px]">
                      
                      {/* Match & Detour */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full border-4 border-emerald-500 text-emerald-800 font-extrabold text-xs flex items-center justify-center bg-emerald-50">
                          {req.matchScore || 92}%
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-emerald-700">+{req.extraDistanceKm || 12} km</div>
                          <div className="text-[10px] text-slate-400 font-medium">Extra Detour</div>
                        </div>
                      </div>

                      {/* Price in ₹ INR */}
                      <div className="text-right space-y-0.5">
                        <div className="text-2xl font-extrabold text-slate-900 flex items-center justify-end">
                          <IndianRupee className="w-5 h-5 inline text-emerald-700" />
                          {(req.price && req.price > 500 ? req.price : (req.price || 180) * 80).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                          <Leaf className="w-3 h-3" /> {req.emptyKmAvoided || 42} km empty avoided
                        </div>
                      </div>

                      {/* Accept & Reject Buttons */}
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button
                          onClick={() => handleAccept(req.id)}
                          className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                        >
                          Accept Ride
                        </button>
                        <button
                          onClick={() => rejectShipmentRequest(req.id)}
                          className="px-4 py-2.5 border border-rose-300 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all"
                        >
                          Decline
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

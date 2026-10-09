import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  AlertCircle,
  Key,
  Lock,
  PackageCheck,
  Radio,
  FileCheck2,
  X,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DriverDeliveryStatusPage = () => {
  const { 
    shipments, 
    activeShipmentId, 
    setActiveShipmentId, 
    updateDeliveryStatus, 
    setCurrentView 
  } = useApp();

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  const STAGES = [
    { key: 'Requested', label: 'Requested', time: activeShipment?.requestedAt || 'Apr 26, 2025 • 08:30 AM', desc: 'Customer submitted ride request' },
    { key: 'Matched', label: 'Matched', time: activeShipment?.matchedAt || 'Apr 26, 2025 • 09:00 AM', desc: 'Corridor matched with empty return truck' },
    { key: 'Accepted', label: 'Accepted', time: activeShipment?.acceptedAt || 'Apr 26, 2025 • 09:15 AM', desc: 'Carrier accepted the freight order' },
    { key: 'Heading to Pickup', label: 'Heading to Pickup', time: activeShipment?.headingToPickupAt || 'Apr 26, 2025 • 10:20 AM', desc: 'Maps route guidance active to pickup hub' },
    { key: 'Picked Up', label: 'Picked Up', time: activeShipment?.pickedUpAt || 'Apr 26, 2025 • 10:45 AM', desc: 'Cargo physically loaded and verified' },
    { key: 'In Transit', label: 'In Transit', time: activeShipment?.inTransitAt || 'Apr 26, 2025 • 01:30 PM', desc: 'Highway transit active according to maps' },
    { key: 'Delivered', label: 'Delivered', time: activeShipment?.deliveredAt || 'Apr 26, 2025 • 04:15 PM', desc: 'Completed after customer OTP verification' },
  ];

  // Stage index mapping as specified:
  // 0: Requested
  // 1: Matched
  // 2: Accepted
  // 3: Heading to Pickup
  // 4: Picked Up
  // 5: In Transit
  // 6: Delivered
  const getStageIndex = (status) => {
    switch (status) {
      case 'Requested':
      case 'Pending Driver Confirmation':
        return 0;
      case 'Matched':
        return 1;
      case 'Accepted':
        return 2;
      case 'Heading to Pickup':
        return 3;
      case 'Picked Up':
        return 4;
      case 'In Transit':
        return 5;
      case 'Delivered':
        return 6;
      default:
        return 0;
    }
  };

  const effectiveIndex = getStageIndex(activeShipment?.status);

  const handleStageAction = (targetStage) => {
    if (!activeShipment) return;

    if (targetStage === 'Delivered') {
      // Delivery can ONLY be marked by carrier after entering OTP from customer
      setEnteredOtp('');
      setOtpError('');
      setOtpSuccess(false);
      setOtpModalOpen(true);
      return;
    }

    updateDeliveryStatus(activeShipment.id, targetStage);
  };

  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length !== 4) {
      setOtpError('Please enter a valid 4-digit Delivery OTP.');
      return;
    }

    const expectedOtp = (activeShipment?.deliveryOtp || '4829').trim();
    if (enteredOtp.trim() === expectedOtp) {
      setOtpSuccess(true);
      setOtpError('');
      updateDeliveryStatus(activeShipment.id, 'Delivered');

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        setOtpModalOpen(false);
        setOtpSuccess(false);
      }, 1400);
    } else {
      setOtpError(`Invalid OTP code entered. Ask customer ${activeShipment?.customerName || 'Priya Sharma'} for their secret 4-digit Delivery OTP.`);
    }
  };

  const renderActionButton = () => {
    switch (effectiveIndex) {
      case 0: // Requested
        return (
          <button
            onClick={() => handleStageAction('Matched')}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
          >
            <span>Match Corridor with Truck</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      case 1: // Matched
        return (
          <button
            onClick={() => handleStageAction('Accepted')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
          >
            <span>Accept Shipment Ride</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      case 2: // Accepted
        return (
          <button
            onClick={() => handleStageAction('Heading to Pickup')}
            className="px-6 py-3 bg-[#2874f0] hover:bg-[#1a62d6] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>Start Maps Navigation: Heading to Pickup</span>
          </button>
        );
      case 3: // Heading to Pickup
        return (
          <button
            onClick={() => handleStageAction('Picked Up')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Mark as Picked Up & Loaded</span>
          </button>
        );
      case 4: // Picked Up
        return (
          <button
            onClick={() => handleStageAction('In Transit')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Depart in Transit (Google Maps Routing)</span>
          </button>
        );
      case 5: // In Transit
        return (
          <button
            onClick={() => handleStageAction('Delivered')}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-700/30 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer ring-2 ring-emerald-400"
          >
            <Key className="w-4 h-4" />
            <span>Complete Delivery (Enter Customer OTP)</span>
          </button>
        );
      case 6: // Delivered
        return (
          <button
            onClick={() => setCurrentView('completion')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Delivery Completed • View Receipt →</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Delivery Status Management</h1>
            <p className="text-xs text-slate-500">Update active shipment progression step-by-step for the customer</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Active Order:</span>
            <select
              value={activeShipmentId}
              onChange={(e) => setActiveShipmentId(e.target.value)}
              className="font-extrabold text-xs text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2874f0] cursor-pointer"
            >
              {shipments.map(s => (
                <option key={s.id} value={s.id}>
                  {s.id} • {s.pickupLocation.split(',')[0]} → {s.deliveryDestination.split(',')[0]} ({s.status})
                </option>
              ))}
            </select>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full space-y-6">
          
          {/* Active Order Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-extrabold text-slate-900">{activeShipment?.id}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeShipment?.status === 'Delivered' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-100 text-[#2874f0]'
                  }`}>
                    {activeShipment?.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeShipment?.pickupLocation} → {activeShipment?.deliveryDestination} ({activeShipment?.packageType})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
              {renderActionButton()}
            </div>
          </div>

          {/* VISUAL PROGRESS TIMELINE matching Reference Screen & User Specifications */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Delivery Status Flow</h3>
              <span className="text-xs text-slate-500 font-semibold">
                Progress: <strong className="text-slate-900">{effectiveIndex + 1} of 7 Steps</strong>
              </span>
            </div>

            <div className="relative max-w-4xl mx-auto py-6 px-4">
              
              {/* Desktop 7-Node Stepper Layout */}
              <div className="grid grid-cols-7 gap-2 relative">
                {/* Connecting Line behind nodes */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-slate-200 -z-0"></div>
                <div 
                  className="absolute top-6 left-6 h-1 bg-emerald-500 transition-all duration-500 -z-0"
                  style={{ width: `${(effectiveIndex / 6) * 92}%` }}
                ></div>

                {STAGES.map((stage, idx) => {
                  const isCompleted = idx <= effectiveIndex;
                  const isCurrent = idx === effectiveIndex;

                  return (
                    <div key={stage.key} className="flex flex-col items-center text-center relative z-10 space-y-2">
                      {/* Node circle: Marked tick when completed */}
                      <div className={`w-12 h-12 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110 shadow-lg shadow-emerald-600/30'
                          : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}>
                        {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
                      </div>

                      {/* Stage Label */}
                      <div className="space-y-0.5">
                        <span className={`block text-xs font-bold ${
                          isCurrent ? 'text-emerald-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {stage.label}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          {isCompleted ? stage.time : 'Pending'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Current Stage Context Guidance Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Active Stage Action Guide:
                </span>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {STAGES[effectiveIndex]?.label} Phase
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Milestone</span>
                  <span className="font-extrabold text-slate-900">{STAGES[effectiveIndex]?.label}</span>
                  <p className="text-[11px] text-slate-500 mt-1">{STAGES[effectiveIndex]?.desc}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Handover Customer</span>
                  <span className="font-extrabold text-slate-900 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" /> {activeShipment?.customerName || 'Priya Sharma'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">Delivery OTP required at destination</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Next Required Action</span>
                  <span className="font-extrabold text-[#2874f0]">
                    {effectiveIndex === 5 ? 'Verify Customer OTP' : (effectiveIndex === 6 ? 'View Proof of Delivery' : `Advance to ${STAGES[effectiveIndex + 1]?.label}`)}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {effectiveIndex === 5 ? 'Collect 4-digit code upon arrival' : 'Advance to keep customer in sync'}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Stage Simulation Toolbar for Rapid Prototype Testing */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Prototype Test (Jump Stage):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {STAGES.map((s, idx) => (
                  <button
                    key={s.key}
                    onClick={() => handleStageAction(s.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      effectiveIndex === idx 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time sync note */}
            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <p className="font-medium">
                <strong>Status updates are sent to the customer in real-time.</strong> Simulated updates trigger instant live sync on customer's tracking screen via BroadcastChannel.
              </p>
            </div>
          </div>

        </main>
      </div>

      {/* CUSTOMER DELIVERY OTP VERIFICATION MODAL */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Customer OTP Verification</h3>
                  <p className="text-[11px] text-slate-500">Required before marking order as Delivered</p>
                </div>
              </div>
              <button 
                onClick={() => setOtpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Customer:</span>
                  <strong className="text-slate-900">{activeShipment?.customerName || 'Priya Sharma'}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Destination:</span>
                  <strong className="text-slate-900">{activeShipment?.deliveryDestination}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipment Order:</span>
                  <strong className="text-slate-900">{activeShipment?.id}</strong>
                </div>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 text-center">
                    Enter 4-Digit Handover OTP from Customer:
                  </label>
                  
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value.replace(/\D/g, ''));
                      setOtpError('');
                    }}
                    placeholder="• • • •"
                    className="w-full text-center py-3 text-2xl font-mono font-extrabold tracking-widest border-2 border-slate-300 rounded-2xl focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 bg-slate-50"
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-400 text-center mt-1">
                    Ask customer for the code displayed on their live tracking screen
                  </p>
                </div>

                {otpError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                {otpSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OTP Verified! Marking shipment as Delivered...</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEnteredOtp(activeShipment?.deliveryOtp || '4829')}
                    className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Auto-fill Demo OTP ({activeShipment?.deliveryOtp || '4829'})
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpModalOpen(false)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Verify & Deliver
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { Truck, CheckCircle2, Clock, MapPin, Navigation, ArrowRight, ShieldCheck, Sparkles, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DriverDeliveryStatusPage = () => {
  const { shipments, activeShipmentId, updateDeliveryStatus, setCurrentView } = useApp();

  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  const STAGES = [
    { key: 'Requested', label: 'Requested', time: activeShipment?.requestedAt || 'Apr 26, 09:00 AM' },
    { key: 'Matched', label: 'Matched', time: 'Apr 26, 09:30 AM' },
    { key: 'Accepted', label: 'Accepted', time: activeShipment?.acceptedAt || 'Apr 26, 10:00 AM' },
    { key: 'Heading to Pickup', label: 'Heading to Pickup', time: 'Apr 26, 10:20 AM' },
    { key: 'Picked Up', label: 'Picked Up', time: activeShipment?.pickedUpAt || 'Apr 26, 11:05 AM' },
    { key: 'In Transit', label: 'In Transit', time: 'Apr 26, 01:30 PM' },
    { key: 'Delivered', label: 'Delivered', time: 'Apr 26, 04:15 PM' },
  ];

  const currentStageIndex = STAGES.findIndex(s => s.key === activeShipment?.status);
  const effectiveIndex = currentStageIndex === -1 ? 2 : currentStageIndex;

  const handleNextStatus = () => {
    if (!activeShipment) return;
    const nextIndex = effectiveIndex + 1;

    if (nextIndex < STAGES.length) {
      const nextStatus = STAGES[nextIndex].key;
      updateDeliveryStatus(activeShipment.id, nextStatus);

      if (nextStatus === 'Delivered') {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          setCurrentView('completion');
        }, 1500);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Delivery Status Management</h1>
            <p className="text-xs text-slate-500">Update active shipment progression step-by-step for the customer</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Active Order:</span>
            <span className="font-extrabold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
              {activeShipment?.id}
            </span>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {/* Active Order Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{activeShipment?.id}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {activeShipment?.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeShipment?.pickupLocation} → {activeShipment?.deliveryDestination} ({activeShipment?.packageType})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleNextStatus}
                disabled={effectiveIndex >= STAGES.length - 1}
                className={`px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
                  effectiveIndex >= STAGES.length - 1
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-105'
                }`}
              >
                <span>
                  {effectiveIndex >= STAGES.length - 1 ? 'Delivery Completed' : `Advance Status to: ${STAGES[effectiveIndex + 1]?.label}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VISUAL PROGRESS TIMELINE matching Reference Screen #9 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Delivery Status Flow</h3>

            <div className="relative max-w-4xl mx-auto py-6 px-4">
              
              {/* Desktop Timeline Layout matching Screen #9 */}
              <div className="grid grid-cols-7 gap-2 relative">
                {/* Connecting Line behind nodes */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-slate-200 -z-0"></div>
                <div 
                  className="absolute top-6 left-6 h-1 bg-emerald-500 transition-all duration-500 -z-0"
                  style={{ width: `${(effectiveIndex / (STAGES.length - 1)) * 92}%` }}
                ></div>

                {STAGES.map((stage, idx) => {
                  const isCompleted = idx <= effectiveIndex;
                  const isCurrent = idx === effectiveIndex;

                  return (
                    <div key={stage.key} className="flex flex-col items-center text-center relative z-10 space-y-2">
                      {/* Node circle */}
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
                        <span className={`block text-xs font-bold ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
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

            {/* Bottom Real-time Demo Notice Banner matching Screen #9 */}
            <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <p className="font-medium">
                <strong>Status updates are sent to the customer in real-time.</strong> (Demo mode — simulated updates trigger instant live sync on customer's tracking screen)
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { CheckCircle2, Leaf, Receipt, Navigation, Award, Sparkles, FileText, ArrowRight } from 'lucide-react';

export const DeliveryCompletedPage = () => {
  const { shipments, activeShipmentId, setCurrentView } = useApp();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-8 max-w-3xl mx-auto w-full my-auto space-y-8">
          
          {/* Main Success Card matching Reference Screen #11 */}
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl text-center space-y-8">
            
            {/* Green Success Icon */}
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900">Delivery Completed!</h1>
              <p className="text-sm text-slate-600">Your shipment has been successfully delivered to the destination.</p>
            </div>

            {/* Shipment Summary Grid matching Screen #11 */}
            <div className="grid grid-cols-2 gap-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Request ID</span>
                <span className="text-base font-extrabold text-slate-900">{activeShipment?.id}</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Driver</span>
                <span className="text-base font-extrabold text-slate-900">{activeShipment?.driverName || 'Ramesh Varma'}</span>
              </div>

              <div className="col-span-2 border-t border-slate-200/80 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Delivered At</span>
                <span className="text-xs font-bold text-slate-900">{activeShipment?.pickedUpAt ? 'Apr 26, 2025 • 04:15 PM' : 'Apr 26, 2025 • 04:15 PM'}</span>
              </div>
            </div>

            {/* Action Buttons matching Screen #11 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowReceiptModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>View Receipt</span>
              </button>

              <button
                onClick={() => setCurrentView('track-request')}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Track Another Request</span>
              </button>
            </div>

            {/* Sustainability Impact Message Box matching Screen #11 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 rounded-2xl border border-emerald-200/80 space-y-4 text-left">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <span>Thank you for using Empty2Earn!</span>
              </div>
              <p className="text-xs text-slate-600">
                By matching your parcel with an existing return route, you helped eliminate empty vehicle kilometres and directly reduced greenhouse gas emissions.
              </p>

              {/* Impact Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="text-lg font-extrabold text-emerald-700">{activeShipment?.emptyKmAvoided || 42} km</div>
                  <div className="text-[10px] text-slate-500 font-semibold">Empty KM Avoided</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="text-lg font-extrabold text-teal-700">{activeShipment?.fuelSavedLiters || 3.5} L</div>
                  <div className="text-[10px] text-slate-500 font-semibold">Diesel Saved</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="text-lg font-extrabold text-emerald-700">{activeShipment?.co2SavedKg || 8.8} kg</div>
                  <div className="text-[10px] text-slate-500 font-semibold">CO₂ Emissions Cut</div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Shipment Receipt</h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">PAID</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Order ID</span>
                <span className="font-bold text-slate-900">{activeShipment?.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Base Transport Fee</span>
                <span className="font-semibold text-slate-800">₹{((activeShipment?.price && activeShipment.price > 500 ? activeShipment.price : (activeShipment?.price || 180) * 80) - 500).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Eco-Matching Fee</span>
                <span className="font-semibold text-slate-800">₹500</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm text-slate-900 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-emerald-600">₹{(activeShipment?.price && activeShipment.price > 500 ? activeShipment.price : (activeShipment?.price || 180) * 80).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

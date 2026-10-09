import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Truck, RotateCcw, Monitor, ChevronUp, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DemoSwitcher = () => {
  const { 
    currentUser, 
    currentView, 
    setCurrentView, 
    loginCustomerDemo, 
    loginDriverDemo, 
    logout, 
    resetDemoData,
    shipments
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Expanded Quick Switcher Box */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">Demo Mode Switcher</h4>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulated shared state across roles</span>
            </div>

            {/* Quick Switch Buttons */}
            <button
              onClick={() => {
                loginCustomerDemo();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                currentUser?.role === 'customer'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  PS
                </div>
                <div className="text-left">
                  <div className="font-semibold">Priya Sharma (Customer)</div>
                  <div className="text-[10px] text-slate-500">Request & Track Shipments</div>
                </div>
              </div>
              {currentUser?.role === 'customer' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              onClick={() => {
                loginDriverDemo();
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all ${
                currentUser?.role === 'driver'
                  ? 'bg-blue-50 border-blue-300 text-blue-800 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50/50 hover:border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  RV
                </div>
                <div className="text-left">
                  <div className="font-semibold">Ramesh Varma (Delivery Partner)</div>
                  <div className="text-[10px] text-slate-500">Accept Requests & Update Status</div>
                </div>
              </div>
              {currentUser?.role === 'driver' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
            </button>

            <button
              onClick={() => {
                logout();
                setCurrentView('landing');
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl border text-xs font-medium text-slate-600 hover:bg-slate-100 ${
                currentView === 'landing' ? 'border-slate-300 bg-slate-100' : 'border-slate-200 bg-white'
              }`}
            >
              <Monitor className="w-4 h-4 text-slate-500" />
              <span>Landing Page</span>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Active REQs: {shipments.length}</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo state to initial defaults?')) {
                  resetDemoData();
                  setIsOpen(false);
                }
              }}
              className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2.5 rounded-full shadow-xl hover:bg-slate-800 transition-all border border-slate-700 hover:scale-105 active:scale-95"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <span className="text-xs font-semibold">Demo Role Switcher</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};

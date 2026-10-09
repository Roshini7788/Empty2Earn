import React from 'react';
import { useApp } from '../context/AppContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { DriverSidebar } from '../components/DriverSidebar';
import { User, Mail, Phone, MapPin, ShieldCheck, Leaf, Truck } from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser } = useApp();
  const SidebarComponent = currentUser?.role === 'driver' ? DriverSidebar : CustomerSidebar;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <SidebarComponent />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">User Profile</h1>
            <p className="text-xs text-slate-500">Manage account information & preferences</p>
          </div>
        </header>

        <main className="p-8 max-w-3xl mx-auto w-full space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('') : 'E2E'}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name || 'Sarah Johnson'}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{currentUser?.email || 'customer@empty2earn.demo'}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Demo Account
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Account Role</span>
                <span className="font-bold text-slate-900 capitalize">{currentUser?.role || 'Customer'}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Location</span>
                <span className="font-bold text-slate-900">Bhimavaram / Vijayawada Corridor</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

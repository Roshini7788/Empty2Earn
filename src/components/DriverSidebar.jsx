import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { LayoutDashboard, Route, PackageCheck, Truck, CircleDollarSign, User, LogOut, CheckCircle2 } from 'lucide-react';

export const DriverSidebar = () => {
  const { currentView, setCurrentView, logout, currentUser, shipments } = useApp();
  
  const currentDriverId = currentUser?.id || 'd1';
  const currentDriverName = currentUser?.name || 'Ramesh Varma';

  // Pending requests for this specific driver
  const pendingCount = shipments.filter(s => 
    (s.driverId === currentDriverId || s.driverName === currentDriverName) && 
    (s.status === 'Requested' || s.status === 'Pending Driver Confirmation')
  ).length;

  const navItems = [
    { id: 'driver-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-trips', label: 'My Trips', icon: Route },
    { id: 'shipment-requests', label: 'Shipment Requests', icon: PackageCheck, badge: pendingCount },
    { id: 'delivery-status', label: 'Delivery Status', icon: Truck },
    { id: 'earnings', label: 'Earnings', icon: CircleDollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 font-sans z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <Logo size="normal" onClick={() => setCurrentView('driver-dashboard')} />
        </div>

        {/* User Profile Card */}
        <div className="p-4 mx-4 my-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2874f0] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'RV'}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-extrabold text-slate-900 truncate">{currentUser?.name || 'Ramesh Varma'}</h4>
            <span className="inline-flex items-center gap-1 text-[10px] text-[#2874f0] font-extrabold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              <CheckCircle2 className="w-2.5 h-2.5" /> Verified Driver
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-[#2874f0] shadow-xs border border-blue-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#2874f0]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-[#2874f0] text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

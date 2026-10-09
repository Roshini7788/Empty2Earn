import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { LayoutDashboard, PackagePlus, Navigation, Bell, User, LogOut, Leaf } from 'lucide-react';

export const CustomerSidebar = () => {
  const { currentView, setCurrentView, logout, currentUser, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'customer-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'request-pickup', label: 'Request Pickup', icon: PackagePlus },
    { id: 'track-request', label: 'Track Request', icon: Navigation },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 font-sans z-30">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <Logo size="normal" onClick={() => setCurrentView('customer-dashboard')} />
        </div>

        {/* User Card matching Screen #3 */}
        <div className="p-4 mx-4 my-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
            CS
          </div>
          <div className="truncate">
            <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || 'Sarah Johnson'}</h4>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
              <Leaf className="w-2.5 h-2.5" /> Customer
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-200/80'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
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
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

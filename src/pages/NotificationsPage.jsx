import React from 'react';
import { useApp } from '../context/AppContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { DriverSidebar } from '../components/DriverSidebar';
import { Bell, CheckCircle2, Info, AlertTriangle, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const { currentUser, notifications, setNotifications } = useApp();

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const SidebarComponent = currentUser?.role === 'driver' ? DriverSidebar : CustomerSidebar;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <SidebarComponent />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
            <p className="text-xs text-slate-500">Real-time alerts and shipment status updates</p>
          </div>

          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-emerald-600 hover:underline"
          >
            Mark all as read
          </button>
        </header>

        <main className="p-8 max-w-4xl mx-auto w-full space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                !notif.read ? 'bg-white border-emerald-300 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-600">{notif.message}</p>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

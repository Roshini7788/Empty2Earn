import React from 'react';
import { useApp } from '../context/AppContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { Truck, MapPin, ArrowRight, Leaf, Clock, CheckCircle2, ChevronRight, Sparkles, Navigation } from 'lucide-react';

export const CustomerDashboardPage = () => {
  const { currentUser, shipments, setCurrentView, setActiveShipmentId } = useApp();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">In Transit</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'Picked Up':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">Picked Up</span>;
      case 'Accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200">Accepted</span>;
      case 'Requested':
      case 'Pending Driver Confirmation':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">Pending</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Customer Dashboard</h1>
            <p className="text-xs text-slate-500">Manage your eco-friendly logistics requests</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                CS
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-slate-900 block">{currentUser?.name || 'Sarah Johnson'}</span>
                <span className="text-[10px] text-slate-500">Customer Account</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Welcome Header + Sustainability Banner matching Screen #3 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Good morning, {currentUser?.name?.split(' ')[0] || 'Sarah'}!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Let's make your deliveries more efficient and eco-friendly today.
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-emerald-800 text-xs font-semibold self-start md:self-auto">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="font-bold">Cleaner deliveries</div>
                <div className="text-[10px] text-emerald-600">Greener tomorrow</div>
              </div>
            </div>
          </div>

          {/* Two Large Action Cards matching Screen #3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Card 1: Request Your Pickup */}
            <div 
              onClick={() => setCurrentView('request-pickup')}
              className="group bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-6 rounded-3xl border border-emerald-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Truck className="w-7 h-7" />
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Request Your Pickup
                </h3>
                <p className="text-xs text-slate-600">
                  Find the best return journey drivers for your shipment & save up to 40%.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <span>Start pickup wizard</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Action Card 2: Track Your Request */}
            <div 
              onClick={() => setCurrentView('track-request')}
              className="group bg-gradient-to-br from-blue-50/70 via-white to-sky-50/50 p-6 rounded-3xl border border-blue-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Track Your Request
                </h3>
                <p className="text-xs text-slate-600">
                  Check live status, driver route timeline, and simulated real-time GPS map.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100 flex items-center gap-2 text-xs font-semibold text-blue-700">
                <span>View live tracking map</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Recent Requests Table matching Screen #3 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Requests</h3>
                <p className="text-xs text-slate-500">Overview of your active and past shipment orders</p>
              </div>
              <button 
                onClick={() => setCurrentView('track-request')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Request ID</th>
                    <th className="px-6 py-4">From → To</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{req.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {req.pickupLocation} <span className="text-slate-400 font-normal">→</span> {req.deliveryDestination}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-6 py-4 text-slate-500">{req.pickupDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setActiveShipmentId(req.id);
                            setCurrentView('track-request');
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg font-semibold transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

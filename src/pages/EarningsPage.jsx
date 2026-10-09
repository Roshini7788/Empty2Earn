import React from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MOCK_EARNINGS_DATA = [
  { day: 'Mon', earnings: 2800, co2Saved: 18 },
  { day: 'Tue', earnings: 3400, co2Saved: 26 },
  { day: 'Wed', earnings: 2900, co2Saved: 20 },
  { day: 'Thu', earnings: 4200, co2Saved: 35 },
  { day: 'Fri', earnings: 3100, co2Saved: 22 },
  { day: 'Sat', earnings: 3800, co2Saved: 30 },
  { day: 'Sun', earnings: 2800, co2Saved: 19 },
];

export const EarningsPage = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Earnings & Sustainability Impact</h1>
            <p className="text-xs text-slate-500">Track return leg revenue and carbon offset performance</p>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Total Revenue (This Month)</span>
              <div className="text-3xl font-extrabold text-slate-900">₹23,000</div>
              <span className="text-[11px] text-emerald-600 font-bold">+24% vs last month</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Total Empty KM Avoided</span>
              <div className="text-3xl font-extrabold text-slate-900">412 km</div>
              <span className="text-[11px] text-teal-600 font-bold">14 return trips</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-semibold">CO₂ Emissions Reduced</span>
              <div className="text-3xl font-extrabold text-slate-900">170 kg</div>
              <span className="text-[11px] text-emerald-600 font-bold">Verified Eco Contribution</span>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Weekly Earnings Trend (₹)</h3>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_EARNINGS_DATA}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2874f0" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2874f0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Earnings']} />
                  <Area type="monotone" dataKey="earnings" stroke="#2874f0" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

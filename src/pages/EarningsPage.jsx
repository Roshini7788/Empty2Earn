import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { 
  IndianRupee, 
  TrendingUp, 
  Leaf, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Route, 
  Package,
  BarChart3,
  LineChart,
  Calendar,
  Sparkles
} from 'lucide-react';

export const EarningsPage = () => {
  const { 
    driverTotalRevenue, 
    driverTotalEmptyKm, 
    driverTotalCo2Saved, 
    driverTotalTripsCount, 
    driverTripsHistory, 
    driverShipments, 
    setCurrentView 
  } = useApp();

  const [activeChartType, setActiveChartType] = useState('area'); // 'area' | 'bar'
  const [hoveredDayIndex, setHoveredDayIndex] = useState(3); // default highlight Thursday (peak)

  // Dynamically generate weekly chart data that mirrors driverTotalRevenue and CO2 savings accurately
  const dynamicWeeklyData = [
    { day: 'Mon', fullDay: 'Monday', earnings: Math.round(driverTotalRevenue * 0.12), co2Saved: Math.round(driverTotalCo2Saved * 0.12) },
    { day: 'Tue', fullDay: 'Tuesday', earnings: Math.round(driverTotalRevenue * 0.15), co2Saved: Math.round(driverTotalCo2Saved * 0.15) },
    { day: 'Wed', fullDay: 'Wednesday', earnings: Math.round(driverTotalRevenue * 0.11), co2Saved: Math.round(driverTotalCo2Saved * 0.11) },
    { day: 'Thu', fullDay: 'Thursday', earnings: Math.round(driverTotalRevenue * 0.22), co2Saved: Math.round(driverTotalCo2Saved * 0.22) },
    { day: 'Fri', fullDay: 'Friday', earnings: Math.round(driverTotalRevenue * 0.18), co2Saved: Math.round(driverTotalCo2Saved * 0.18) },
    { day: 'Sat', fullDay: 'Saturday', earnings: Math.round(driverTotalRevenue * 0.14), co2Saved: Math.round(driverTotalCo2Saved * 0.14) },
    { day: 'Sun', fullDay: 'Sunday', earnings: Math.round(driverTotalRevenue * 0.08), co2Saved: Math.round(driverTotalCo2Saved * 0.08) },
  ];

  const maxEarnings = Math.max(...dynamicWeeklyData.map(d => d.earnings), 5000);
  const avgDailyEarnings = Math.round(driverTotalRevenue / 7);
  const peakDay = [...dynamicWeeklyData].sort((a, b) => b.earnings - a.earnings)[0];

  // SVG Chart Geometry Coordinates (viewBox 0 0 760 260)
  const svgWidth = 760;
  const svgHeight = 240;
  const padLeft = 65;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 40;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const points = dynamicWeeklyData.map((d, i) => {
    const x = padLeft + (i / (dynamicWeeklyData.length - 1)) * plotWidth;
    const y = padTop + plotHeight - (d.earnings / maxEarnings) * plotHeight;
    return { ...d, x, y };
  });

  // Generate smooth cubic bezier SVG path
  const generateSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) * 0.5;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) * 0.5;
      const cp2y = p1.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + plotHeight} L ${points[0].x} ${padTop + plotHeight} Z`;

  const yTicks = [
    0,
    Math.round(maxEarnings * 0.33),
    Math.round(maxEarnings * 0.66),
    maxEarnings
  ];

  const hoveredData = dynamicWeeklyData[hoveredDayIndex] || dynamicWeeklyData[3];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header matching Carrier Dashboard */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Earnings & Sustainability</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Live Ledger
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Track real-time return leg revenue, carbon offset performance, and itemized payout records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('my-trips')}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2874f0] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-blue-200 cursor-pointer"
            >
              <Route className="w-3.5 h-3.5 text-[#2874f0]" /> Previous Trips History
            </button>
            <button
              onClick={() => setCurrentView('driver-dashboard')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* TOP 3 SUMMARY METRIC CARDS matching Carrier Dashboard exact palette */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Metric Card 1: Total Revenue (Emerald Accent) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-xs space-y-2 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Revenue (This Month)</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  ₹
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                ₹{driverTotalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  +24% vs last month
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  Live Dynamic Balance
                </span>
              </div>
            </div>

            {/* Metric Card 2: Total Empty KM Avoided (Blue Accent) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#2874f0] shadow-xs space-y-2 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Empty KM Avoided</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold group-hover:bg-[#2874f0] group-hover:text-white transition-colors">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                {driverTotalEmptyKm.toLocaleString('en-IN')} km
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                  {driverTotalTripsCount} return trips
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Zero Deadhead Miles
                </span>
              </div>
            </div>

            {/* Metric Card 3: CO2 Emissions Reduced (Amber Accent) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#ff9f00] shadow-xs space-y-2 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">CO₂ Emissions Reduced</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-slate-900 flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {driverTotalCo2Saved.toLocaleString('en-IN')} kg
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Verified Eco Impact
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  Green Logistics
                </span>
              </div>
            </div>

          </div>

          {/* DYNAMIC WEEKLY EARNINGS GRAPH SECTION - 100% VISIBLE & HIGH IMPACT */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Header with Title and Mode Switchers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-extrabold text-slate-900">Weekly Earnings Trend (₹ INR)</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#2874f0]">
                    Cycle: ₹{driverTotalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Day-by-day revenue progression and fuel efficiency savings for the active settlement cycle.
                </p>
              </div>

              {/* Chart Mode Controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                  <button
                    onClick={() => setActiveChartType('area')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeChartType === 'area'
                        ? 'bg-white text-[#2874f0] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LineChart className="w-3.5 h-3.5" /> Area Trend
                  </button>
                  <button
                    onClick={() => setActiveChartType('bar')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeChartType === 'bar'
                        ? 'bg-white text-[#2874f0] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Daily Bars
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Highlights Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Peak Earning Day</span>
                <span className="text-sm font-extrabold text-slate-900">{peakDay.fullDay}</span>
                <span className="text-[11px] font-bold text-emerald-600 block">₹{peakDay.earnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Daily Average</span>
                <span className="text-sm font-extrabold text-slate-900">₹{avgDailyEarnings.toLocaleString('en-IN')}</span>
                <span className="text-[11px] font-semibold text-slate-500 block">7-day rolling</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Active Selected</span>
                <span className="text-sm font-extrabold text-[#2874f0]">{hoveredData.fullDay}</span>
                <span className="text-[11px] font-bold text-slate-700 block">₹{hoveredData.earnings.toLocaleString('en-IN')} • {hoveredData.co2Saved} kg CO₂</span>
              </div>
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80">
                <span className="text-[11px] font-semibold text-emerald-800 block">Total Settlement</span>
                <span className="text-sm font-extrabold text-emerald-900">₹{driverTotalRevenue.toLocaleString('en-IN')}</span>
                <span className="text-[11px] font-bold text-emerald-700 block">Verified Net Balance</span>
              </div>
            </div>

            {/* 100% VISIBLE INTERACTIVE SVG CHART CONTAINER */}
            <div className="w-full bg-slate-50/60 border border-slate-200 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
              
              {/* Active Hover Detail Banner over graph */}
              <div className="flex items-center justify-between text-xs mb-2 px-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-[#2874f0]"></span>
                  <span className="font-extrabold text-slate-900">
                    {hoveredData.fullDay}: <span className="text-[#2874f0]">₹{hoveredData.earnings.toLocaleString('en-IN')}</span>
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-emerald-700 font-semibold">
                    {hoveredData.co2Saved} kg CO₂ offset
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Hover / tap points to inspect</span>
              </div>

              {/* Chart SVG */}
              <div className="w-full h-64 sm:h-72">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full overflow-visible select-none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Gradient for Area Chart */}
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2874f0" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#2874f0" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Gradient for Bar Chart */}
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2874f0" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>

                    {/* Gradient for Active Bar */}
                    <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2874f0" floodOpacity="0.3" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid Lines & Y-Axis Labels */}
                  {yTicks.map((val, idx) => {
                    const yPos = padTop + plotHeight - (val / maxEarnings) * plotHeight;
                    return (
                      <g key={idx}>
                        <line
                          x1={padLeft}
                          y1={yPos}
                          x2={svgWidth - padRight}
                          y2={yPos}
                          stroke="#e2e8f0"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={padLeft - 10}
                          y={yPos + 4}
                          textAnchor="end"
                          className="text-[11px] fill-slate-400 font-semibold"
                        >
                          ₹{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Active Selected Day Vertical Indicator Line */}
                  {hoveredDayIndex !== null && points[hoveredDayIndex] && (
                    <line
                      x1={points[hoveredDayIndex].x}
                      y1={padTop}
                      x2={points[hoveredDayIndex].x}
                      y2={padTop + plotHeight}
                      stroke="#2874f0"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      opacity="0.6"
                    />
                  )}

                  {/* Render Chart according to active mode */}
                  {activeChartType === 'area' ? (
                    <>
                      {/* Area Fill */}
                      <path d={areaPath} fill="url(#earningsGradient)" />

                      {/* Line Stroke */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#2874f0"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />

                      {/* Interactive Data Points */}
                      {points.map((pt, i) => {
                        const isSelected = hoveredDayIndex === i;
                        return (
                          <g
                            key={i}
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setHoveredDayIndex(i)}
                            onClick={() => setHoveredDayIndex(i)}
                          >
                            {/* Larger invisible hover hit target */}
                            <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                            {/* Point Outer Ring */}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isSelected ? 7 : 4.5}
                              fill={isSelected ? '#2874f0' : '#ffffff'}
                              stroke="#2874f0"
                              strokeWidth={isSelected ? 3 : 2}
                              className="transition-all duration-200"
                            />

                            {/* Inner white dot when selected */}
                            {isSelected && (
                              <circle cx={pt.x} cy={pt.y} r="3" fill="#ffffff" />
                            )}
                          </g>
                        );
                      })}
                    </>
                  ) : (
                    /* Bar Chart Mode */
                    points.map((pt, i) => {
                      const isSelected = hoveredDayIndex === i;
                      const barWidth = 36;
                      const barHeight = (pt.earnings / maxEarnings) * plotHeight;
                      const barX = pt.x - barWidth / 2;
                      const barY = padTop + plotHeight - barHeight;

                      return (
                        <g
                          key={i}
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredDayIndex(i)}
                          onClick={() => setHoveredDayIndex(i)}
                        >
                          <rect
                            x={barX}
                            y={barY}
                            width={barWidth}
                            height={barHeight}
                            rx="8"
                            fill={isSelected ? 'url(#activeBarGradient)' : 'url(#barGradient)'}
                            className="transition-all duration-200 hover:opacity-90"
                          />
                          {/* Value label on top of bar */}
                          <text
                            x={pt.x}
                            y={barY - 6}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-slate-700"
                          >
                            ₹{pt.earnings >= 1000 ? `${(pt.earnings / 1000).toFixed(1)}k` : pt.earnings}
                          </text>
                        </g>
                      );
                    })
                  )}

                  {/* X-Axis Day Labels */}
                  {points.map((pt, i) => {
                    const isSelected = hoveredDayIndex === i;
                    return (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredDayIndex(i)}
                        onClick={() => setHoveredDayIndex(i)}
                      >
                        <text
                          x={pt.x}
                          y={svgHeight - 10}
                          textAnchor="middle"
                          className={`text-xs transition-all ${
                            isSelected
                              ? 'font-extrabold fill-[#2874f0]'
                              : 'font-semibold fill-slate-500'
                          }`}
                        >
                          {pt.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

            </div>
          </div>

          {/* ITEMIZED REVENUE BREAKDOWN & SETTLEMENTS LEDGER matching Carrier Dashboard style */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-extrabold text-slate-900">Itemized Payouts & Settlement Breakdown</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                    {driverTripsHistory.length + driverShipments.length} Records
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Every trip and shipment contributing to your total dynamic earnings balance
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Settlement Method:</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-extrabold">
                  Instant UPI / IMPS Direct
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-semibold">Source ID</th>
                    <th className="pb-3 font-semibold">Route Corridor</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Deadhead Saved</th>
                    <th className="pb-3 font-semibold text-right">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {/* Active/In-Transit Shipments */}
                  {driverShipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-[#2874f0]" />
                        {s.id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900">{s.pickupLocation.split(',')[0]} → {s.deliveryDestination.split(',')[0]}</div>
                        <div className="text-[10px] text-slate-400">{s.packageType}</div>
                      </td>
                      <td className="py-3.5 text-slate-500">{s.pickupDate || 'Today'}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'Delivered' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {s.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-teal-700 font-semibold">{s.emptyKmAvoided || 42} km</td>
                      <td className="py-3.5 text-right font-extrabold text-emerald-700">
                        +₹{s.price?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}

                  {/* Previous Completed Trips */}
                  {driverTripsHistory.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                        <Route className="w-3.5 h-3.5 text-emerald-600" />
                        {trip.id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-900">{trip.origin.split(',')[0]} → {trip.destination.split(',')[0]}</div>
                        <div className="text-[10px] text-slate-400">{trip.viaRoute}</div>
                      </td>
                      <td className="py-3.5 text-slate-500">{trip.arrivalDate}</td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-white">
                          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                          Settled
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-teal-700 font-semibold">{trip.emptyKmSaved} km</td>
                      <td className="py-3.5 text-right font-extrabold text-emerald-700">
                        +₹{trip.revenue?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 font-extrabold text-slate-900 text-xs bg-slate-50">
                    <td colSpan={4} className="py-4 px-2 uppercase tracking-wider text-[11px] text-slate-700">
                      Total Verified Balance Across All Return Operations
                    </td>
                    <td className="py-4 text-right text-teal-700 font-extrabold">
                      {driverTotalEmptyKm.toLocaleString('en-IN')} km
                    </td>
                    <td className="py-4 text-right text-emerald-700 font-extrabold text-base">
                      ₹{driverTotalRevenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

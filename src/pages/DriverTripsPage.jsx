import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { 
  Route, 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  Truck, 
  IndianRupee, 
  CheckCircle2, 
  Leaf, 
  ArrowRight, 
  Plus, 
  Search, 
  FileText, 
  Star, 
  ShieldCheck, 
  ExternalLink, 
  RotateCcw, 
  TrendingUp,
  X,
  Package
} from 'lucide-react';

export const DriverTripsPage = () => {
  const { 
    driverTripsHistory, 
    driverTotalRevenue,
    driverTotalEmptyKm,
    driverTotalCo2Saved,
    driverTotalTripsCount,
    repeatRouteAsActiveTrip, 
    setCurrentView 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeModalTrip, setActiveModalTrip] = useState(null);

  // Filter previous trips
  const filteredTrips = driverTripsHistory.filter(trip => {
    const matchesSearch = 
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.viaRoute.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'vijayawada') return trip.origin.toLowerCase().includes('vijayawada') || trip.destination.toLowerCase().includes('vijayawada');
    if (selectedFilter === 'rajahmundry') return trip.origin.toLowerCase().includes('rajahmundry') || trip.destination.toLowerCase().includes('rajahmundry');
    if (selectedFilter === 'guntur') return trip.origin.toLowerCase().includes('guntur') || trip.destination.toLowerCase().includes('guntur');
    if (selectedFilter === 'visakhapatnam') return trip.origin.toLowerCase().includes('visakhapatnam') || trip.destination.toLowerCase().includes('visakhapatnam');

    return true;
  });

  // Calculate overall metrics matching Dashboard & Earnings
  const totalCompletedTrips = driverTotalTripsCount;
  const totalRevenue = driverTotalRevenue;
  const totalEmptyKmSaved = driverTotalEmptyKm;
  const totalCo2Saved = driverTotalCo2Saved;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Route className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">My Trips & Route History</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your previous return trips, earnings breakdown, cargo utilization, and active journey
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('driver-dashboard')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Plan / Edit Active Trip
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Metric 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Completed Return Trips
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                {totalCompletedTrips} <span className="text-sm font-normal text-slate-500">trips</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">100% on-time delivery rate</span>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                Total Return Revenue
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +24% extra return income
              </span>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-teal-600" />
                Empty KM Avoided
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                {totalEmptyKmSaved} <span className="text-sm font-normal text-slate-500">km</span>
              </div>
              <span className="text-[11px] text-teal-600 font-bold">Zero deadhead miles</span>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                CO₂ Emissions Reduced
              </span>
              <div className="text-2xl font-extrabold text-slate-900">
                {Math.round(totalCo2Saved)} <span className="text-sm font-normal text-slate-500">kg</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">Verified Green Logistics</span>
            </div>
          </div>


          {/* PREVIOUS TRIPS HISTORY SECTION */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Previous Trips History</h2>
                <p className="text-xs text-slate-500">All completed return trips with itemized cargo and earnings</p>
              </div>

              {/* Filters and Search */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search trips by route or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 shadow-sm"
                  />
                </div>

                {/* Corridor Filter Tabs */}
                <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({driverTripsHistory.length})
                  </button>
                  <button
                    onClick={() => setSelectedFilter('vijayawada')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedFilter === 'vijayawada' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Vijayawada
                  </button>
                  <button
                    onClick={() => setSelectedFilter('rajahmundry')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedFilter === 'rajahmundry' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Rajahmundry
                  </button>
                  <button
                    onClick={() => setSelectedFilter('guntur')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedFilter === 'guntur' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Guntur
                  </button>
                </div>
              </div>
            </div>

            {/* List of Previous Trips */}
            <div className="space-y-4">
              {filteredTrips.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                  <Route className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No Trips Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No completed trips match your filter criteria. Try resetting your search query.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredTrips.map((trip) => {
                  const loadPercentage = Math.round((trip.utilizedCapacity / trip.totalCapacity) * 100);

                  return (
                    <div 
                      key={trip.id}
                      className="bg-white rounded-3xl border border-slate-200 hover:border-blue-300 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
                    >
                      {/* Top Header of Trip Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-base text-slate-900">
                            {trip.id}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-900 text-white shadow-sm">
                            <CheckCircle2 className="w-3 h-3 text-emerald-300" /> {trip.status}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            • Completed on {trip.arrivalDate}
                          </span>
                        </div>

                        {/* Revenue Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">Earned:</span>
                          <span className="text-lg font-extrabold text-emerald-700 flex items-center">
                            <IndianRupee className="w-4 h-4 inline" />
                            {trip.revenue.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Route Details */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Origin -> Destination */}
                        <div className="md:col-span-6 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-950/20">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div className="truncate">
                              <span className="text-[10px] text-emerald-900 font-extrabold uppercase tracking-wider block">Pickup / Start</span>
                              <h4 className="font-extrabold text-slate-900 text-sm truncate">{trip.origin}</h4>
                              <span className="text-[11px] text-slate-500">{trip.originHub}</span>
                            </div>
                          </div>

                          <div className="pl-5 border-l-2 border-dashed border-slate-300 my-1 py-1 text-[11px] text-slate-500 font-medium flex items-center gap-2">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-700">
                              {trip.viaRoute}
                            </span>
                            <span>•</span>
                            <span>{trip.distanceKm} km transit</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold shadow-md shadow-blue-950/20">
                              <Navigation className="w-5 h-5 text-white" />
                            </div>
                            <div className="truncate">
                              <span className="text-blue-900 font-extrabold uppercase tracking-wider block text-[10px]">Destination Hub</span>
                              <h4 className="font-extrabold text-slate-900 text-sm truncate">{trip.destination}</h4>
                              <span className="text-[11px] text-slate-500">{trip.destinationHub}</span>
                            </div>
                          </div>
                        </div>

                        {/* Utilization & Sustainability Column */}
                        <div className="md:col-span-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Empty KM Saved</span>
                              <span className="font-extrabold text-teal-700 text-xs block mt-0.5">{trip.emptyKmSaved} km</span>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] text-slate-400 font-semibold block uppercase">CO₂ Offset</span>
                              <span className="font-extrabold text-emerald-700 text-xs block mt-0.5">{trip.co2SavedKg} kg</span>
                            </div>

                            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Shipments</span>
                              <span className="font-extrabold text-blue-700 text-xs block mt-0.5">{trip.shipmentsCount} Delivered</span>
                            </div>
                          </div>

                          {/* Cargo capacity progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                              <span>Cargo Utilized: {trip.utilizedCapacity} m³ / {trip.totalCapacity} m³</span>
                              <span className="text-blue-700 font-bold">{loadPercentage}% load factor</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 rounded-full" 
                                style={{ width: `${loadPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Cargo Manifest Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {trip.shipments.map(s => (
                              <span 
                                key={s.id} 
                                className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[10px] font-semibold text-slate-700"
                              >
                                <Package className="w-2.5 h-2.5 text-blue-600" />
                                {s.item} ({s.weight})
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Departed: <strong>{trip.departureTime}</strong> • Arrived: <strong>{trip.arrivalTime}</strong>
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> {trip.deliveryProof}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveModalTrip(trip)}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all flex items-center gap-1.5 text-xs shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-600" /> View Trip Summary
                          </button>
                          
                          <button
                            onClick={() => repeatRouteAsActiveTrip(trip)}
                            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-all flex items-center gap-1.5 text-xs border border-blue-200/80"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Book Return Route Again
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* TRIP DETAILS & SUMMARY MODAL */}
      {activeModalTrip && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-400">
                    Trip Summary & Verified Settlement
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-200 border border-emerald-700">
                    {activeModalTrip.status}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold mt-1">
                  Trip #{activeModalTrip.id} • {activeModalTrip.origin.split(',')[0]} → {activeModalTrip.destination.split(',')[0]}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTrip(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
              
              {/* Route Timeline */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Journey Route Information</h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Origin Hub</span>
                    <strong className="text-slate-900 block">{activeModalTrip.origin}</strong>
                    <span className="text-slate-500 text-[11px]">{activeModalTrip.originHub}</span>
                    <span className="text-[11px] text-slate-600 block mt-1">
                      Departure: {activeModalTrip.departureDate} at {activeModalTrip.departureTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Destination Hub</span>
                    <strong className="text-slate-900 block">{activeModalTrip.destination}</strong>
                    <span className="text-slate-500 text-[11px]">{activeModalTrip.destinationHub}</span>
                    <span className="text-[11px] text-slate-600 block mt-1">
                      Arrival: {activeModalTrip.arrivalDate} at {activeModalTrip.arrivalTime}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600 flex justify-between">
                  <span>Corridor: <strong>{activeModalTrip.viaRoute}</strong></span>
                  <span>Vehicle: <strong>{activeModalTrip.vehicleType}</strong></span>
                </div>
              </div>

              {/* Hauled Shipments Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hauled Return Cargo Manifest</h4>
                <div className="space-y-2">
                  {activeModalTrip.shipments.map((s) => (
                    <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{s.item}</div>
                          <div className="text-[11px] text-slate-500">Shipper: {s.customer} • {s.weight}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-emerald-700">₹{s.payment.toLocaleString('en-IN')}</span>
                        <div className="text-[10px] text-emerald-600 font-semibold">Settled</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settlement and Sustainability Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[11px] text-emerald-800 font-bold block uppercase">Net Trip Revenue</span>
                  <div className="text-2xl font-extrabold text-emerald-900">
                    ₹{activeModalTrip.revenue.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-emerald-700 font-medium">Credited to Bank Account • Direct Deposit</p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                  <span className="text-[11px] text-teal-800 font-bold block uppercase">Green Logistics Score</span>
                  <div className="text-2xl font-extrabold text-teal-900">
                    {activeModalTrip.co2SavedKg} kg CO₂
                  </div>
                  <p className="text-[10px] text-teal-700 font-medium">{activeModalTrip.emptyKmSaved} km deadhead journey eliminated</p>
                </div>
              </div>

              {/* Digital POD Verification */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs">
                <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Proof of Delivery Authenticated</div>
                  <div className="text-slate-500 text-[11px]">
                    Customer signatures and OTP deliveries verified. Zero reported damages or route discrepancies.
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  repeatRouteAsActiveTrip(activeModalTrip);
                  setActiveModalTrip(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Set as Next Active Return Trip
              </button>

              <button
                onClick={() => setActiveModalTrip(null)}
                className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

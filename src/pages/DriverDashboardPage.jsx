import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { Truck, Route, PackageCheck, CircleDollarSign, CheckCircle2, Edit3, Plus, ArrowRight, MapPin, Calendar, Clock, Calculator, Scale, Navigation, RotateCcw } from 'lucide-react';

export const DriverDashboardPage = () => {
  const { 
    currentUser, 
    driverTrip, 
    setDriverTrip, 
    updateDriverTrip, 
    toggleDriverAvailability, 
    shipments, 
    driverTotalRevenue, 
    setCurrentView,
    resetDemoData,
    loginSuccessMessage,
    setLoginSuccessMessage
  } = useApp();

  useEffect(() => {
    if (loginSuccessMessage) {
      const timer = setTimeout(() => {
        setLoginSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccessMessage, setLoginSuccessMessage]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for creating or editing trip with Distance & Weight based formula
  const [tripForm, setTripForm] = useState({
    origin: driverTrip?.origin || 'Bhimavaram',
    destination: driverTrip?.destination || 'Vijayawada',
    distanceKm: driverTrip?.distanceKm || 120,
    departureDate: driverTrip?.departureDate || '2026-10-10',
    departureTime: driverTrip?.departureTime || '08:00 AM',
    returnDate: driverTrip?.returnDate || '2026-10-10',
    returnTime: driverTrip?.returnTime || '06:00 PM',
    vehicleType: driverTrip?.vehicleType || 'Truck • Eicher 19ft',
    totalCapacity: driverTrip?.totalCapacity || 18,
    availableCapacity: driverTrip?.availableCapacity || 10,
    maxWeightKg: driverTrip?.maxWeightKg || 500, // Max acceptable parcel weight in kg
    ratePerKm: driverTrip?.ratePerKm || 12,  // ₹12 / km
    ratePerKg: driverTrip?.ratePerKg || 5     // ₹5 / kg
  });

  const currentDriverId = currentUser?.id || 'd1';
  const currentDriverName = currentUser?.name || 'Ramesh Varma';

  const pendingRequests = shipments.filter(s => 
    (s.driverId === currentDriverId || s.driverName === currentDriverName) &&
    (s.status === 'Requested' || s.status === 'Pending Driver Confirmation')
  );
  const activeDelivery = shipments.find(s => 
    (s.driverId === currentDriverId || s.driverName === currentDriverName) &&
    ['Accepted', 'Heading to Pickup', 'Picked Up', 'In Transit'].includes(s.status)
  );

  const toggleAvailability = () => {
    if (toggleDriverAvailability) {
      toggleDriverAvailability();
    } else {
      setDriverTrip(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setTripForm({
      origin: '',
      destination: '',
      distanceKm: 120,
      departureDate: new Date().toISOString().split('T')[0],
      departureTime: '09:00 AM',
      returnDate: new Date().toISOString().split('T')[0],
      returnTime: '06:00 PM',
      vehicleType: 'Truck • Eicher 19ft',
      totalCapacity: 18,
      availableCapacity: 12,
      maxWeightKg: 500,
      ratePerKm: 12,
      ratePerKg: 5
    });
    setShowModal(true);
  };

  const handleOpenEditModal = () => {
    setIsEditing(true);
    setTripForm({
      origin: driverTrip.origin || '',
      destination: driverTrip.destination || '',
      distanceKm: driverTrip.distanceKm || 120,
      departureDate: driverTrip.departureDate || '',
      departureTime: driverTrip.departureTime || '08:00 AM',
      returnDate: driverTrip.returnDate || '',
      returnTime: driverTrip.returnTime || '06:00 PM',
      vehicleType: driverTrip.vehicleType || '',
      totalCapacity: driverTrip.totalCapacity || 18,
      availableCapacity: driverTrip.availableCapacity || 10,
      maxWeightKg: driverTrip.maxWeightKg || 500,
      ratePerKm: driverTrip.ratePerKm || 12,
      ratePerKg: driverTrip.ratePerKg || 5
    });
    setShowModal(true);
  };

  const handleSaveTrip = (e) => {
    e.preventDefault();
    const totalCap = parseInt(tripForm.totalCapacity) || 18;
    const availCap = parseInt(tripForm.availableCapacity) || 10;
    const occCap = Math.max(0, totalCap - availCap);
    const distKm = parseInt(tripForm.distanceKm) || 120;
    const maxW = parseInt(tripForm.maxWeightKg) || 500;
    const rKm = parseInt(tripForm.ratePerKm) || 12;
    const rKg = parseInt(tripForm.ratePerKg) || 5;

    const payload = {
      ...driverTrip,
      id: driverTrip?.id || `trip-${Date.now()}`,
      driverId: currentDriverId,
      driverName: currentDriverName,
      phone: currentUser?.phone || '+91 98480 12345',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      origin: tripForm.origin,
      destination: tripForm.destination,
      distanceKm: distKm,
      departureDate: tripForm.departureDate,
      departureTime: tripForm.departureTime,
      returnDate: tripForm.returnDate,
      returnTime: tripForm.returnTime,
      vehicleType: tripForm.vehicleType,
      totalCapacity: totalCap,
      availableCapacity: availCap,
      occupiedCapacity: occCap,
      maxWeightKg: maxW,
      ratePerKm: rKm,
      ratePerKg: rKg,
      isAvailable: true,
      isCreated: true,
      loadingStatus: occCap === 0 ? 'Empty' : (availCap === 0 ? 'Full' : 'Partially Loaded')
    };

    if (updateDriverTrip) {
      updateDriverTrip(payload);
    } else {
      setDriverTrip(payload);
    }

    setShowModal(false);
  };

  const isTripCreated = driverTrip?.isCreated !== false && driverTrip?.origin;

  // Formula Sample Calculation (50kg parcel over trip distance)
  const calcSamplePrice = (dist, rKm, rKg, weight = 50) => {
    return (dist * rKm) + (weight * rKg);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      <DriverSidebar />

      {/* Floating Login Success Toast */}
      {loginSuccessMessage && (
        <div className="fixed top-5 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0 animate-bounce" />
          <span className="text-xs font-bold">{loginSuccessMessage}</span>
          <button 
            onClick={() => setLoginSuccessMessage(null)}
            className="text-white/80 hover:text-white font-bold text-sm ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Carrier Dashboard</h1>
            <p className="text-xs text-slate-500">Manage return journeys & accept matching freight orders</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Reset App to Beginning Button */}
            <button
              onClick={resetDemoData}
              title="Reset all data and return to starting page"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Start</span>
            </button>

            {/* Availability Toggle */}
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Status:</span>
              <button
                onClick={toggleAvailability}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  driverTrip?.isAvailable
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${driverTrip?.isAvailable ? 'bg-white animate-pulse' : 'bg-slate-500'}`}></span>
                {driverTrip?.isAvailable ? 'Available for Pickups' : 'Unavailable'}
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric Card 1: Current Trip Route */}
            <div 
              onClick={() => setCurrentView('my-trips')}
              className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#2874f0] shadow-xs space-y-2 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Current Trip Route</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2874f0] group-hover:bg-[#2874f0] group-hover:text-white flex items-center justify-center font-bold transition-colors">
                  <Route className="w-5 h-5" />
                </div>
              </div>
              <div className="text-lg font-extrabold text-slate-900 truncate group-hover:text-[#2874f0] transition-colors">
                {isTripCreated ? `${driverTrip.origin} → ${driverTrip.destination}` : 'No Active Trip'}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isTripCreated ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                  {isTripCreated ? 'Active Return Leg' : 'Pending Trip Setup'}
                </span>
                <span className="text-[11px] font-semibold text-[#2874f0] group-hover:underline">
                  {isTripCreated ? `${driverTrip.distanceKm || 120} km • History →` : 'History →'}
                </span>
              </div>
            </div>

            {/* Metric Card 2: Cargo Capacity */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#ff9f00] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Available Cargo Space</span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-slate-900 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5 text-slate-900" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {isTripCreated ? `${driverTrip.availableCapacity} m³` : '0 m³'} <span className="text-xs font-normal text-slate-400">/ {isTripCreated ? `${driverTrip.totalCapacity} m³` : '0 m³'}</span>
              </div>
              <p className="text-[11px] text-slate-500">{isTripCreated ? `${driverTrip.loadingStatus} • Max ${driverTrip.maxWeightKg || 500} kg` : 'Create trip to set capacity'}</p>
            </div>

            {/* Metric Card 3: Pending Requests */}
            <div 
              onClick={() => setCurrentView('shipment-requests')}
              className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-[#2874f0] shadow-xs space-y-2 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Requests</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold">
                  <PackageCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 group-hover:text-[#2874f0] transition-colors">
                {pendingRequests.length} <span className="text-xs font-normal text-slate-400">requests</span>
              </div>
              <p className="text-[11px] text-[#2874f0] font-semibold flex items-center gap-1">
                View & Accept →
              </p>
            </div>

            {/* Metric Card 4: Total Earnings in Indian Rupees (₹) */}
            <div 
              onClick={() => setCurrentView('earnings')}
              className="bg-white p-6 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-xs space-y-2 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Earnings</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  ₹
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                ₹{driverTotalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-600 font-semibold">+18% this month</span>
                <span className="text-[#2874f0] font-semibold group-hover:underline">View Analytics →</span>
              </div>
            </div>
          </div>

          {/* MAIN TRIP MANAGEMENT SECTION */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-extrabold text-slate-900">Trip & Pricing Configuration</h2>
                  {isTripCreated ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Active Return Trip</span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">First Time • Setup Needed</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Configure distance (km), weight limit (kg), and pricing formula parameters for automatic parcel calculation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('my-trips')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
                >
                  <Route className="w-3.5 h-3.5 text-[#2874f0]" /> Previous Trips History
                </button>
                {!isTripCreated ? (
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-5 py-2.5 bg-[#2874f0] hover:bg-[#1a62d6] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Create a Trip
                  </button>
                ) : (
                  <button
                    onClick={handleOpenEditModal}
                    className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#ffe500]" /> Edit Trip Details
                  </button>
                )}
              </div>
            </div>

            {/* Trip Details Card */}
            {isTripCreated ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50 p-6 rounded-xl border border-slate-200">
                
                {/* Left Side Route & Distance/Weight Formula */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#2874f0] text-white flex items-center justify-center font-bold text-base shadow-xs">
                      <Route className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {driverTrip.origin} <span className="text-slate-400 font-normal">→</span> {driverTrip.destination}
                      </h3>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                        <span>Departure: <strong className="text-slate-700">{driverTrip.departureDate} ({driverTrip.departureTime})</strong></span>
                        <span>•</span>
                        <span>Return: <strong className="text-slate-700">{driverTrip.returnDate} ({driverTrip.returnTime})</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* FORMULA PRICING BREAKDOWN BOX */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Calculator className="w-4 h-4 text-[#2874f0]" /> Freight Pricing Formula
                      </span>
                      <span className="text-[10px] font-extrabold bg-blue-50 text-[#2874f0] px-2 py-0.5 rounded border border-blue-100">
                        Distance + Weight
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 text-[10px] block font-semibold">Distance Rate</span>
                        <span className="font-extrabold text-slate-900">₹{driverTrip.ratePerKm || 12} / km</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">({driverTrip.distanceKm || 120} km trip)</span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-slate-500 text-[10px] block font-semibold">Weight Rate</span>
                        <span className="font-extrabold text-slate-900">₹{driverTrip.ratePerKg || 5} / kg</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">(Max parcel {driverTrip.maxWeightKg || 500} kg)</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/80 mt-2 flex items-center justify-between font-medium">
                      <span>Formula: <strong>(Km × ₹{driverTrip.ratePerKm || 12}) + (Kg × ₹{driverTrip.ratePerKg || 5})</strong></span>
                      <span className="text-slate-900 font-bold">
                        Sample (50kg): ₹{calcSamplePrice(driverTrip.distanceKm || 120, driverTrip.ratePerKm || 12, driverTrip.ratePerKg || 5, 50)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side Capacity & Trip Status Visualizer */}
                <div className="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Vehicle & Parcel Limits</span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                      {driverTrip.loadingStatus}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-extrabold text-slate-900">{driverTrip.vehicleType}</div>
                    <div className="text-slate-500 flex justify-between">
                      <span>Total Volume: <strong>{driverTrip.totalCapacity} m³</strong></span>
                      <span>Max Parcel Weight: <strong className="text-slate-900">{driverTrip.maxWeightKg || 500} kg</strong></span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-[#2874f0] h-full transition-all duration-500" 
                        style={{ width: `${((driverTrip.totalCapacity - driverTrip.availableCapacity) / driverTrip.totalCapacity) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-500" 
                        style={{ width: `${(driverTrip.availableCapacity / driverTrip.totalCapacity) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-[#2874f0]">{driverTrip.totalCapacity - driverTrip.availableCapacity} m³ loaded</span>
                      <span className="text-emerald-600">{driverTrip.availableCapacity} m³ free space</span>
                    </div>
                  </div>

                  {/* Trip Availability Action */}
                  <div className="pt-2">
                    <button
                      onClick={toggleAvailability}
                      className={`w-full py-2.5 font-extrabold text-xs rounded-xl transition-all cursor-pointer ${
                        driverTrip.isAvailable
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {driverTrip.isAvailable ? 'Deactivate Trip Availability' : 'Activate Trip Availability'}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* EMPTY FIRST-TIME CREATE TRIP PROMPT */
              <div className="bg-gradient-to-b from-blue-50/80 to-slate-50 border-2 border-dashed border-blue-200 p-8 sm:p-10 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-[#2874f0] text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <Route className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">No Return Trip Configured</h3>
                  <p className="text-xs text-slate-600">
                    Create your return trip to define your route, vehicle capacity, parcel weight limit, and formula rates.
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateModal}
                  className="px-6 py-3 bg-[#2874f0] hover:bg-[#1a62d6] text-white font-extrabold text-sm rounded-xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Your First Trip
                </button>
              </div>
            )}

            {/* Active Delivery Status Banner */}
            {activeDelivery && (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Active Delivery: {activeDelivery.id}</h4>
                    <p className="text-xs text-slate-600">
                      From {activeDelivery.pickupLocation} to {activeDelivery.deliveryDestination} • Total Payout: <strong className="text-emerald-700">₹{activeDelivery.price * 80 || '14,400'}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('delivery-status')}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  Manage Status Timeline →
                </button>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* CREATE / EDIT TRIP MODAL - CONTAINS PARCEL WEIGHT FIELD */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2874f0] flex items-center justify-center font-bold">
                  {isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {isEditing ? 'Edit Return Trip Parameters' : 'Create New Return Trip'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure route, departure times, parcel weight limit & formula rates</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTrip} className="space-y-4 text-xs">
              
              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Origin City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={tripForm.origin}
                      onChange={(e) => setTripForm({ ...tripForm, origin: e.target.value })}
                      placeholder="e.g. Bhimavaram"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination City</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={tripForm.destination}
                      onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                      placeholder="e.g. Vijayawada"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2874f0]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Departure Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Departure Date</span>
                  </label>
                  <input
                    type="date"
                    value={tripForm.departureDate}
                    onChange={(e) => setTripForm({ ...tripForm, departureDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Departure Time</span>
                  </label>
                  <input
                    type="text"
                    value={tripForm.departureTime}
                    onChange={(e) => setTripForm({ ...tripForm, departureTime: e.target.value })}
                    placeholder="e.g. 08:00 AM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Return Date</span>
                  </label>
                  <input
                    type="date"
                    value={tripForm.returnDate}
                    onChange={(e) => setTripForm({ ...tripForm, returnDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Return Time</span>
                  </label>
                  <input
                    type="text"
                    value={tripForm.returnTime}
                    onChange={(e) => setTripForm({ ...tripForm, returnTime: e.target.value })}
                    placeholder="e.g. 06:00 PM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>
              </div>

              {/* Vehicle Type & Total Capacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={tripForm.vehicleType}
                    onChange={(e) => setTripForm({ ...tripForm, vehicleType: e.target.value })}
                    placeholder="e.g. Truck • Eicher 19ft"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Vehicle Capacity (m³)</label>
                  <input
                    type="number"
                    value={tripForm.totalCapacity}
                    onChange={(e) => setTripForm({ ...tripForm, totalCapacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>
              </div>

              {/* Free Capacity & Max Parcel Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Available Free Space (m³)</label>
                  <input
                    type="number"
                    value={tripForm.availableCapacity}
                    onChange={(e) => setTripForm({ ...tripForm, availableCapacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>

                {/* PARCEL WEIGHT INPUT FIELD */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max Parcel Weight (kg)</span>
                  </label>
                  <input
                    type="number"
                    value={tripForm.maxWeightKg}
                    onChange={(e) => setTripForm({ ...tripForm, maxWeightKg: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                    required
                  />
                </div>
              </div>

              {/* Trip Distance (km) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-slate-400" />
                  <span>Trip Distance (km)</span>
                </label>
                <input
                  type="number"
                  value={tripForm.distanceKm}
                  onChange={(e) => setTripForm({ ...tripForm, distanceKm: e.target.value })}
                  placeholder="e.g. 120"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#2874f0]"
                  required
                />
              </div>

              {/* FORMULA RATE INPUTS: DISTANCE RATE & WEIGHT RATE */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                  <Calculator className="w-4 h-4 text-[#2874f0]" />
                  <span>Freight Pricing Formula Inputs</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Distance Rate (₹ / km)</label>
                    <input
                      type="number"
                      value={tripForm.ratePerKm}
                      onChange={(e) => setTripForm({ ...tripForm, ratePerKm: e.target.value })}
                      placeholder="e.g. 12"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#2874f0]"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Parcel Weight Rate (₹ / kg)</label>
                    <input
                      type="number"
                      value={tripForm.ratePerKg}
                      onChange={(e) => setTripForm({ ...tripForm, ratePerKg: e.target.value })}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-[#2874f0]"
                      required
                    />
                  </div>
                </div>

                {/* Instant Calculation Formula Live Preview */}
                <div className="p-3 bg-white rounded-lg border border-blue-100 text-[11px] text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Live Price Calculation Preview:</div>
                  <div className="flex justify-between text-slate-600">
                    <span>Formula: (Distance × ₹/km) + (Weight × ₹/kg)</span>
                    <span className="font-bold text-[#2874f0]">
                      Total: ₹{calcSamplePrice(parseInt(tripForm.distanceKm) || 120, parseInt(tripForm.ratePerKm) || 12, parseInt(tripForm.ratePerKg) || 5, 50)} (for 50kg parcel)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2874f0] hover:bg-[#1a62d6] text-white rounded-xl font-extrabold shadow-xs transition-colors cursor-pointer"
                >
                  {isEditing ? 'Save Modified Trip Parameters' : 'Create Return Trip'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

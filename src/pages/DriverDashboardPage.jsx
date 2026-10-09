import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DriverSidebar } from '../components/DriverSidebar';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { Truck, Route, PackageCheck, CircleDollarSign, CheckCircle2, AlertCircle, Edit3, Power, Plus, ShieldCheck } from 'lucide-react';

export const DriverDashboardPage = () => {
  const { currentUser, driverTrip, setDriverTrip, shipments, setCurrentView } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ ...driverTrip });

  const pendingRequests = shipments.filter(s => s.status === 'Requested' || s.status === 'Pending Driver Confirmation');
  const activeDelivery = shipments.find(s => ['Accepted', 'Heading to Pickup', 'Picked Up', 'In Transit'].includes(s.status));

  const toggleAvailability = () => {
    setDriverTrip(prev => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  const handleSaveTrip = (e) => {
    e.preventDefault();
    setDriverTrip(editForm);
    setShowEditModal(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <DriverSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Driver Dashboard</h1>
            <p className="text-xs text-slate-500">Manage return journeys & accept lucrative pickup requests</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Availability Toggle matching Screen #7 */}
            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Status:</span>
              <button
                onClick={toggleAvailability}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  driverTrip.isAvailable
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${driverTrip.isAvailable ? 'bg-white animate-pulse' : 'bg-slate-500'}`}></span>
                {driverTrip.isAvailable ? 'Available for Pickups' : 'Unavailable'}
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Current Trip Status</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Route className="w-4 h-4" />
                </span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">
                {driverTrip.origin} → {driverTrip.destination}
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Active Return Leg
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Available Cargo Capacity</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {driverTrip.availableCapacity} m³ <span className="text-xs font-normal text-slate-400">/ {driverTrip.totalCapacity} m³</span>
              </div>
              <p className="text-[11px] text-slate-500">{driverTrip.loadingStatus}</p>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => setCurrentView('shipment-requests')}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 cursor-pointer hover:border-blue-300 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Pending Requests</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <PackageCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {pendingRequests.length} <span className="text-xs font-normal text-slate-400">requests</span>
              </div>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                View & Accept →
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Earnings</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CircleDollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">$1,420</div>
              <p className="text-[11px] text-emerald-600 font-semibold">+18% this month</p>
            </div>
          </div>

          {/* TRIP MANAGEMENT CARD matching Reference Screen #7 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Trip Management</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Configure your planned route and return journey parameters</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Create / Edit Trip
                </button>
              </div>
            </div>

            {/* Current Trip Breakdown Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {/* Left Route & Vehicle Info */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {driverTrip.origin} <span className="text-slate-400 font-normal">→</span> {driverTrip.destination}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                      <span>Departure: <strong className="text-slate-700">{driverTrip.departureDate} at {driverTrip.departureTime}</strong></span>
                      <span>•</span>
                      <span>Return: <strong className="text-slate-700">{driverTrip.returnDate} at {driverTrip.returnTime}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900">{driverTrip.vehicleType}</div>
                  <div className="text-slate-500">Capacity breakdown: Total {driverTrip.totalCapacity} m³ | Occupied {driverTrip.occupiedCapacity} m³ | Free {driverTrip.availableCapacity} m³</div>
                </div>
              </div>

              {/* Right Capacity Visualizer Progress Bar matching Screen #7 */}
              <div className="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Vehicle Cargo Capacity</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                    {driverTrip.loadingStatus}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-500" 
                      style={{ width: `${(driverTrip.occupiedCapacity / driverTrip.totalCapacity) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-500" 
                      style={{ width: `${(driverTrip.availableCapacity / driverTrip.totalCapacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span className="text-blue-600">6 m³ occupied ({Math.round((driverTrip.occupiedCapacity / driverTrip.totalCapacity) * 100)}%)</span>
                    <span className="text-emerald-600">10 m³ free space available</span>
                  </div>
                </div>

                {/* Trip Actions Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={toggleAvailability}
                    className={`px-4 py-2 font-semibold text-xs rounded-xl transition-all ${
                      driverTrip.isAvailable
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {driverTrip.isAvailable ? 'Deactivate Trip' : 'Activate Trip'}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Delivery Status Banner if driver accepted shipment */}
            {activeDelivery && (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Active Delivery: {activeDelivery.id}</h4>
                    <p className="text-xs text-slate-600">
                      From {activeDelivery.pickupLocation} to {activeDelivery.deliveryDestination} • Status: <strong className="text-emerald-700">{activeDelivery.status}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('delivery-status')}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-emerald-700 transition-all"
                >
                  Manage Status Timeline →
                </button>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* Edit Trip Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Edit Return Trip Details</h3>
            <form onSubmit={handleSaveTrip} className="space-y-3 text-xs">
              <LocationAutocomplete
                label="Origin City"
                value={editForm.origin}
                onChange={(val) => setEditForm(prev => ({ ...prev, origin: val }))}
                onSelect={(item) => setEditForm(prev => ({ ...prev, origin: item.name, originState: item.state ? item.state.slice(0, 2).toUpperCase() : 'AP' }))}
                placeholder="Enter origin city (e.g. Bhimavaram)"
                iconType="pin"
                required
              />

              <LocationAutocomplete
                label="Destination City"
                value={editForm.destination}
                onChange={(val) => setEditForm(prev => ({ ...prev, destination: val }))}
                onSelect={(item) => setEditForm(prev => ({ ...prev, destination: item.name, destinationState: item.state ? item.state.slice(0, 2).toUpperCase() : 'AP' }))}
                placeholder="Enter destination city (e.g. Vijayawada, Bhimadole)"
                iconType="navigation"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={editForm.vehicleType}
                    onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Capacity (m³)</label>
                  <input
                    type="number"
                    value={editForm.totalCapacity}
                    onChange={(e) => setEditForm({ ...editForm, totalCapacity: parseInt(e.target.value) || 18 })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

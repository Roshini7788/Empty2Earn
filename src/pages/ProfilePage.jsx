import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { DriverSidebar } from '../components/DriverSidebar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  Truck, 
  Edit3, 
  CheckCircle2, 
  Save, 
  X, 
  CreditCard, 
  Building2, 
  Sparkles,
  Camera
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useApp();
  const SidebarComponent = currentUser?.role === 'driver' ? DriverSidebar : CustomerSidebar;
  const isDriver = currentUser?.role === 'driver';

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || (isDriver ? 'Ramesh Varma' : 'Priya Sharma'),
    email: currentUser?.email || (isDriver ? 'driver@empty2earn.in' : 'customer@empty2earn.in'),
    phone: currentUser?.phone || '+91 98480 22334',
    location: currentUser?.location || 'Bhimavaram / Vijayawada Corridor, AP',
    company: currentUser?.company || (isDriver ? 'Varma Express Freight' : 'Sharma Agro Traders'),
    vehicleType: currentUser?.vehicleType || 'Truck • Eicher 19ft (18m³)',
    licenseNumber: currentUser?.licenseNumber || 'AP-37-2021-0084920',
    upiId: currentUser?.upiId || (isDriver ? 'ramesh.varma@oksbi' : 'priya.sharma@okaxis')
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const updatedUser = {
      ...currentUser,
      ...formData
    };

    setCurrentUser(updatedUser);
    api.updateUserProfile(updatedUser).catch(() => {});
    setSaveSuccess(true);
    setIsEditing(false);

    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || (isDriver ? 'Ramesh Varma' : 'Priya Sharma'),
      email: currentUser?.email || (isDriver ? 'driver@empty2earn.in' : 'customer@empty2earn.in'),
      phone: currentUser?.phone || '+91 98480 22334',
      location: currentUser?.location || 'Bhimavaram / Vijayawada Corridor, AP',
      company: currentUser?.company || (isDriver ? 'Varma Express Freight' : 'Sharma Agro Traders'),
      vehicleType: currentUser?.vehicleType || 'Truck • Eicher 19ft (18m³)',
      licenseNumber: currentUser?.licenseNumber || 'AP-37-2021-0084920',
      upiId: currentUser?.upiId || (isDriver ? 'ramesh.varma@oksbi' : 'priya.sharma@okaxis')
    });
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <SidebarComponent />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header matching Carrier Dashboard style */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">User Profile</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isDriver ? 'bg-blue-100 text-[#2874f0]' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isDriver ? 'Carrier Account' : 'Customer Account'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage personal credentials, corridor preferences, and direct payout details
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              isEditing
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5" /> Close Editor
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile Details
              </>
            )}
          </button>
        </header>

        <main className="p-8 max-w-4xl mx-auto w-full space-y-6">

          {/* Success Notification Alert */}
          {saveSuccess && (
            <div className="bg-emerald-50 border-2 border-emerald-400/50 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Profile Updated Successfully!</h4>
                  <p className="text-[11px] text-emerald-800">
                    Your profile information, contact numbers, and payout preferences have been saved.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSaveSuccess(false)}
                className="text-emerald-700 hover:text-emerald-900 p-1 text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* MAIN PROFILE OVERVIEW CARD matching Carrier Dashboard */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 border-t-4 border-t-[#2874f0] shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-2xl font-extrabold text-2xl flex items-center justify-center text-white shadow-sm ${
                    isDriver ? 'bg-[#2874f0]' : 'bg-gradient-to-tr from-emerald-500 to-teal-600'
                  }`}>
                    {currentUser?.name 
                      ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                      : (isDriver ? 'RV' : 'PS')}
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-xs cursor-pointer"
                    title="Change Avatar"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.name || formData.name}</h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Member
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser?.email || formData.email}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {currentUser?.phone || formData.phone}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {currentUser?.company || formData.company}
                    </span>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2874f0] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-blue-200 self-start sm:self-auto cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              )}
            </div>

            {/* Account Details Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Account Role</span>
                <span className="font-extrabold text-slate-900 capitalize block">{currentUser?.role || 'Customer'}</span>
                <span className="text-[10px] text-emerald-600 font-bold">100% Identity Verified</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Primary Corridor</span>
                <span className="font-extrabold text-slate-900 truncate block">{currentUser?.location || formData.location}</span>
                <span className="text-[10px] text-blue-600 font-bold">Active Route Hub</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                  {isDriver ? 'Vehicle Registered' : 'Business Category'}
                </span>
                <span className="font-extrabold text-slate-900 truncate block">
                  {isDriver ? (currentUser?.vehicleType || formData.vehicleType) : 'Verified Freight Customer'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Commercial Approved</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Settlement UPI</span>
                <span className="font-extrabold text-slate-900 truncate block">{currentUser?.upiId || formData.upiId}</span>
                <span className="text-[10px] text-emerald-600 font-bold">Instant Payouts</span>
              </div>
            </div>

          </div>

          {/* EDIT PROFILE SECTION - Beautiful Form Card */}
          {isEditing && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 shadow-xs space-y-6 animate-in fade-in slide-in-from-top-3">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900">Edit Profile & Credentials</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Live Editable
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your contact details, enterprise profile, and corridor settings
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@empty2earn.in"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+91 98480 22334"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Company / Enterprise Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Company / Business Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="Logistics Agency or Enterprise name"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  {/* Operating Corridor / Hub Location */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Operating Logistics Corridor / Base City</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="e.g. Bhimavaram / Vijayawada Corridor, AP"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                  {/* Role Specific Fields */}
                  {isDriver ? (
                    <>
                      {/* Vehicle Type */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Vehicle Type & Spec</label>
                        <div className="relative">
                          <Truck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={formData.vehicleType}
                            onChange={(e) => handleChange('vehicleType', e.target.value)}
                            placeholder="Truck • Eicher 19ft (18m³)"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                          />
                        </div>
                      </div>

                      {/* Commercial Driving License */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">Driving License / Commercial Permit</label>
                        <div className="relative">
                          <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={formData.licenseNumber}
                            onChange={(e) => handleChange('licenseNumber', e.target.value)}
                            placeholder="AP-37-2021-0084920"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                          />
                        </div>
                      </div>
                    </>
                  ) : null}

                  {/* UPI ID for Direct Payout / Invoicing */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">UPI ID for Instant Settlements & Invoicing</label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) => handleChange('upiId', e.target.value)}
                        placeholder="yourname@upi or yourname@oksbi"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white text-slate-900 transition-all"
                      />
                    </div>
                  </div>

                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Profile Changes
                  </button>
                </div>

              </form>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

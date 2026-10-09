import React from 'react';
import { useApp } from '../context/AppContext';
import { CustomerSidebar } from '../components/CustomerSidebar';
import { MapPin, Calendar, Clock, Package, Scale, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Star, Navigation, Sparkles, FileText, Upload, ShieldAlert, AlertCircle, XCircle, Lock, Car } from 'lucide-react';

export const PickupRequestWizard = () => {
  const { 
    pickupFormStep, 
    setPickupFormStep, 
    pickupFormData, 
    setPickupFormData, 
    availableDrivers, 
    submitPickupRequest, 
    uploadDocument,
    updateDocumentVerificationStatus,
    setCurrentView 
  } = useApp();

  const handleInputChange = (field, value) => {
    setPickupFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSpecialHandling = (item) => {
    setPickupFormData(prev => {
      const current = prev.specialHandling || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, specialHandling: updated };
    });
  };

  const handleFileUpload = (docKey, e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDocument(docKey, file);
    }
  };

  const handleSelectDriver = (driver) => {
    setPickupFormData(prev => ({ ...prev, selectedDriver: driver }));
    setPickupFormStep(3);
  };

  const handleFinalSubmit = () => {
    const newId = submitPickupRequest();
    setCurrentView('track-request');
  };

  const isAutomobile = pickupFormData.packageType === 'Automobiles';
  const docs = pickupFormData.documents || {};
  const docStatus = pickupFormData.documentStatus || 'DOCUMENTS_REQUIRED';
  const allDocsUploaded = Boolean(docs.identityDoc && docs.vehicleRC && docs.ownershipProof);

  // For Automobiles, blocking driver search until status is APPROVED
  const isDriverSearchDisabled = isAutomobile && docStatus !== 'APPROVED';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <CustomerSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Request Your Pickup</h1>
            <p className="text-xs text-slate-500">Fill in package details and match with return drivers</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Step {pickupFormStep} of 3</span>
          </div>
        </header>

        <main className="p-8 max-w-4xl mx-auto w-full space-y-8">
          
          {/* Step Progress Timeline Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 -z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                  pickupFormStep >= 1 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-200 text-slate-500'
                }`}>
                  1
                </div>
                <span className={`text-xs font-semibold ${pickupFormStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Pickup Details</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                  pickupFormStep >= 2 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-200 text-slate-500'
                }`}>
                  2
                </div>
                <span className={`text-xs font-semibold ${pickupFormStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Find Drivers</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                  pickupFormStep >= 3 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-200 text-slate-500'
                }`}>
                  3
                </div>
                <span className={`text-xs font-semibold ${pickupFormStep >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Select Driver</span>
              </div>
            </div>
          </div>

          {/* STEP 1: PICKUP & PACKAGE DETAILS FORM */}
          {pickupFormStep === 1 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">Request Your Pickup</h2>

              <div className="space-y-4">
                {/* Pickup Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={pickupFormData.pickupLocation}
                      onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                      placeholder="Enter pickup address or select on map"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Destination */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Destination</label>
                  <div className="relative">
                    <Navigation className="w-4 h-4 text-blue-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={pickupFormData.deliveryDestination}
                      onChange={(e) => handleInputChange('deliveryDestination', e.target.value)}
                      placeholder="Enter delivery address or select on map"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Preferred Pickup Date & Time Window */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Pickup Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="date"
                        value={pickupFormData.pickupDate}
                        onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Pickup Time</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={pickupFormData.pickupTimeWindow}
                        onChange={(e) => handleInputChange('pickupTimeWindow', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      >
                        <option>08:00 AM - 10:00 AM</option>
                        <option>10:00 AM - 12:00 PM</option>
                        <option>12:00 PM - 02:00 PM</option>
                        <option>02:00 PM - 04:00 PM</option>
                        <option>04:00 PM - 06:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Package Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Package Type</label>
                      <select
                        value={pickupFormData.packageType}
                        onChange={(e) => handleInputChange('packageType', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
                      >
                        <option>Electronics</option>
                        <option value="Automobiles">Automobiles & Vehicles</option>
                        <option>Apparel & Textiles</option>
                        <option>Auto Spare Parts</option>
                        <option>Machinery & Hardware</option>
                        <option>Documents & Parcels</option>
                        <option>Furniture</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        value={pickupFormData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                        placeholder="5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Dimensions (L × W × H cm)</label>
                      <div className="grid grid-cols-3 gap-1">
                        <input
                          type="number"
                          value={pickupFormData.length}
                          onChange={(e) => handleInputChange('length', e.target.value)}
                          className="px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center focus:ring-1 focus:ring-emerald-500"
                          placeholder="30"
                        />
                        <input
                          type="number"
                          value={pickupFormData.width}
                          onChange={(e) => handleInputChange('width', e.target.value)}
                          className="px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center focus:ring-1 focus:ring-emerald-500"
                          placeholder="20"
                        />
                        <input
                          type="number"
                          value={pickupFormData.height}
                          onChange={(e) => handleInputChange('height', e.target.value)}
                          className="px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center focus:ring-1 focus:ring-emerald-500"
                          placeholder="15"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* HIGH-VALUE SHIPMENT DOCUMENT VERIFICATION (Displayed dynamically ONLY for Automobiles) */}
                {isAutomobile && (
                  <div className="pt-4 space-y-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
                    
                    {/* Security Notice Banner */}
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900">
                        <div className="font-extrabold flex items-center gap-2">
                          <Car className="w-4 h-4 text-amber-700" />
                          <span>High-Value Automobile Verification Required</span>
                        </div>
                        <p className="mt-1 text-amber-800 leading-relaxed">
                          For safety, legal compliance, and anti-theft verification, all vehicle shipments require document review. Please upload valid copies of the 3 required documents below.
                        </p>
                      </div>
                    </div>

                    {/* Status Badge Indicator */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700">Verification Status:</span>
                      {docStatus === 'APPROVED' && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold flex items-center gap-1.5 border border-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> APPROVED (Vehicle Verified)
                        </span>
                      )}
                      {docStatus === 'PENDING_REVIEW' && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold flex items-center gap-1.5 border border-amber-300">
                          <Clock className="w-4 h-4 text-amber-600" /> PENDING_REVIEW (Under Manual Inspection)
                        </span>
                      )}
                      {docStatus === 'REJECTED' && (
                        <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold flex items-center gap-1.5 border border-rose-300">
                          <XCircle className="w-4 h-4 text-rose-600" /> REJECTED (Documents Invalid)
                        </span>
                      )}
                      {docStatus === 'DOCUMENTS_REQUIRED' && (
                        <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full font-bold flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-slate-500" /> DOCUMENTS_REQUIRED (Upload 3 Files)
                        </span>
                      )}
                    </div>

                    {/* 3 Upload Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      
                      {/* 1. Identity Document */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        docs.identityDoc ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className={`w-4 h-4 ${docs.identityDoc ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <label className="text-xs font-bold text-slate-800">1. Govt Identity Card</label>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-3">Aadhaar / Passport / DL (PDF, JPG, PNG)</p>

                        {docs.identityDoc ? (
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                            <div className="truncate pr-2">
                              <div className="font-bold text-emerald-900 truncate">{docs.identityDoc.name}</div>
                              <span className="text-[10px] text-slate-400">{docs.identityDoc.size}</span>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer transition-all hover:bg-emerald-50/50">
                            <Upload className="w-4 h-4 text-slate-400" />
                            <span>Upload Govt ID</span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload('identityDoc', e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* 2. Vehicle Registration Certificate (RC) */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        docs.vehicleRC ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Car className={`w-4 h-4 ${docs.vehicleRC ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <label className="text-xs font-bold text-slate-800">2. Vehicle Registration (RC)</label>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-3">Official Vehicle RC Copy (PDF, JPG, PNG)</p>

                        {docs.vehicleRC ? (
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                            <div className="truncate pr-2">
                              <div className="font-bold text-emerald-900 truncate">{docs.vehicleRC.name}</div>
                              <span className="text-[10px] text-slate-400">{docs.vehicleRC.size}</span>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer transition-all hover:bg-emerald-50/50">
                            <Upload className="w-4 h-4 text-slate-400" />
                            <span>Upload Vehicle RC</span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload('vehicleRC', e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* 3. Ownership / Authorization Proof */}
                      <div className={`p-4 rounded-2xl border transition-all ${
                        docs.ownershipProof ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className={`w-4 h-4 ${docs.ownershipProof ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <label className="text-xs font-bold text-slate-800">3. Ownership / Authorization</label>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-3">Invoice or Transport Letter (PDF, JPG, PNG)</p>

                        {docs.ownershipProof ? (
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                            <div className="truncate pr-2">
                              <div className="font-bold text-emerald-900 truncate">{docs.ownershipProof.name}</div>
                              <span className="text-[10px] text-slate-400">{docs.ownershipProof.size}</span>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          </div>
                        ) : (
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 text-xs font-semibold text-slate-600 cursor-pointer transition-all hover:bg-emerald-50/50">
                            <Upload className="w-4 h-4 text-slate-400" />
                            <span>Upload Ownership Proof</span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => handleFileUpload('ownershipProof', e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                    </div>

                    {/* Manual Review Mechanism (MVP Demo Reviewer Action) */}
                    {allDocsUploaded && (
                      <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900 flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-blue-600" />
                            Admin Document Inspection Panel (Manual Review Demo)
                          </span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                            Manual Verification Mode
                          </span>
                        </div>
                        <p className="text-blue-800 text-[11px]">
                          Documents are saved securely. For this prototype, simulate the manual admin review step below:
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => updateDocumentVerificationStatus('APPROVED')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all"
                          >
                            ✓ Approve Documents (Unlock Drivers)
                          </button>
                          <button
                            type="button"
                            onClick={() => updateDocumentVerificationStatus('REJECTED')}
                            className="px-4 py-2 border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 font-semibold rounded-xl transition-all"
                          >
                            Reject Documents
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* Special Handling Requirements */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Special Handling Requirements (optional)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {['Fragile', 'Temperature controlled', 'Hazardous', 'Other'].map((item) => (
                      <label
                        key={item}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          pickupFormData.specialHandling?.includes(item)
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={pickupFormData.specialHandling?.includes(item)}
                          onChange={() => toggleSpecialHandling(item)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description (optional)</label>
                  <textarea
                    rows={2}
                    value={pickupFormData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add any additional information for the driver..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Submit Button Step 1 */}
              <div className="pt-4 space-y-2">
                {isDriverSearchDisabled && (
                  <p className="text-xs text-rose-600 font-semibold text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Automobile shipments require approved vehicle & identity documents before finding drivers.
                  </p>
                )}

                <button
                  onClick={() => setPickupFormStep(2)}
                  disabled={isDriverSearchDisabled}
                  className={`w-full py-3.5 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-base ${
                    isDriverSearchDisabled
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:scale-[1.01]'
                  }`}
                >
                  <span>Find Available Drivers</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: AVAILABLE DRIVERS LIST */}
          {pickupFormStep === 2 && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Available Drivers for Your Shipment</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    We found <span className="font-bold text-emerald-600">3 drivers</span> who match your requirements based on route, timing, capacity, and compatibility score.
                  </p>
                </div>

                <button
                  onClick={() => setPickupFormStep(1)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl hover:bg-slate-200 transition-all self-start md:self-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Edit Request Details
                </button>
              </div>

              {/* Route Summary Chips */}
              <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-100/70 p-3 rounded-2xl border border-slate-200">
                <div className="bg-white px-3 py-1.5 rounded-xl font-semibold text-slate-800 border border-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pickup: {pickupFormData.pickupDate}, {pickupFormData.pickupTimeWindow}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl font-semibold text-slate-800 border border-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>From: {pickupFormData.pickupLocation}</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl font-semibold text-slate-800 border border-slate-200 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>To: {pickupFormData.deliveryDestination}</span>
                </div>
                {isAutomobile && (
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl font-bold border border-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Documents Approved</span>
                  </div>
                )}
              </div>

              {/* Driver Cards */}
              <div className="space-y-4">
                {availableDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    {/* Left: Driver Profile & Route info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20 shadow-sm"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{driver.name}</h3>
                          {driver.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {driver.rating}
                          </span>
                          <span>•</span>
                          <span>{driver.completedDeliveries} deliveries</span>
                        </div>

                        <div className="text-xs font-semibold text-slate-700 pt-1">
                          {driver.vehicleType} <span className="text-emerald-600">({driver.availableCapacity}m³ available)</span>
                        </div>

                        <div className="text-xs text-slate-500">
                          Route: <span className="font-medium text-slate-800">{driver.route}</span>
                        </div>

                        <div className="text-xs text-slate-500">
                          Expected Pickup: <span className="font-semibold text-slate-900">{driver.plannedDeparture}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Compatibility Score, Price & Select Button */}
                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 gap-4 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 text-emerald-700 font-extrabold text-xs flex items-center justify-center bg-emerald-50">
                          {driver.matchScore}%
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-emerald-600 font-semibold">+{driver.extraDistanceKm} km</div>
                          <div className="text-[10px] text-slate-400">Extra detour</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-slate-900">${driver.estimatedPrice} <span className="text-xs font-normal text-slate-400">(est.)</span></div>
                      </div>

                      <button
                        onClick={() => handleSelectDriver(driver)}
                        className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                      >
                        Select Driver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION SUMMARY */}
          {pickupFormStep === 3 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 pb-2 border-b border-slate-100">Confirm Driver & Send Request</h2>

              {/* Selected Driver Summary */}
              {pickupFormData.selectedDriver && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={pickupFormData.selectedDriver.avatar}
                      alt={pickupFormData.selectedDriver.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{pickupFormData.selectedDriver.name}</h4>
                      <div className="text-xs text-slate-500">{pickupFormData.selectedDriver.vehicleType} • {pickupFormData.selectedDriver.route}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-emerald-600">${pickupFormData.selectedDriver.estimatedPrice}</div>
                    <span className="text-[10px] text-slate-400">Estimated Total</span>
                  </div>
                </div>
              )}

              {/* Shipment Details Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Pickup Location</span>
                  <p className="font-bold text-slate-900">{pickupFormData.pickupLocation}</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Delivery Destination</span>
                  <p className="font-bold text-slate-900">{pickupFormData.deliveryDestination}</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Pickup Time</span>
                  <p className="font-bold text-slate-900">{pickupFormData.pickupDate} ({pickupFormData.pickupTimeWindow})</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 font-semibold block uppercase text-[10px] mb-1">Package Specs</span>
                  <p className="font-bold text-slate-900">{pickupFormData.packageType} • {pickupFormData.weight} kg</p>
                </div>
              </div>

              {/* Notice */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Pending Driver Confirmation:</span> Submitting will send an instant request notification to driver {pickupFormData.selectedDriver?.name}. Status will be updated once accepted.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setPickupFormStep(2)}
                  className="px-6 py-3 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl font-semibold text-xs transition-all"
                >
                  Change Driver
                </button>

                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] text-sm"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Send Request to Driver</span>
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

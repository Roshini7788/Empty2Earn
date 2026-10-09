import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Truck, 
  CheckCircle2,
  Clock,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

// Known coordinates for common South Indian and major logistics hubs for high accuracy
const CITY_COORDINATES = {
  'bhimavaram': { lat: 16.5449, lng: 81.5212, name: 'Bhimavaram' },
  'bhimadole': { lat: 16.8208, lng: 81.2588, name: 'Bhimadole' },
  'bhimunipatnam': { lat: 17.8924, lng: 83.4542, name: 'Bhimunipatnam' },
  'vijayawada': { lat: 16.5062, lng: 80.6480, name: 'Vijayawada' },
  'eluru': { lat: 16.7107, lng: 81.0952, name: 'Eluru' },
  'tadepalligudem': { lat: 16.8142, lng: 81.5267, name: 'Tadepalligudem' },
  'tanuku': { lat: 16.7570, lng: 81.6811, name: 'Tanuku' },
  'palakollu': { lat: 16.5244, lng: 81.7344, name: 'Palakollu' },
  'rajahmundry': { lat: 17.0005, lng: 81.8040, name: 'Rajahmundry' },
  'kakinada': { lat: 16.9891, lng: 82.2475, name: 'Kakinada' },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam' },
  'guntur': { lat: 16.3067, lng: 80.4365, name: 'Guntur' },
  'amaravati': { lat: 16.5417, lng: 80.5158, name: 'Amaravati' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
  'tirupati': { lat: 13.6288, lng: 79.4192, name: 'Tirupati' },
  'ongole': { lat: 15.5057, lng: 80.0499, name: 'Ongole' },
  'nellore': { lat: 14.4426, lng: 79.9865, name: 'Nellore' },
  'kurnool': { lat: 15.8281, lng: 78.0373, name: 'Kurnool' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
  'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
  'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
  'delhi': { lat: 28.6139, lng: 77.2090, name: 'Delhi' }
};

const resolveCoordinates = (addressStr, defaultCoord = { lat: 16.5449, lng: 81.5212 }) => {
  if (!addressStr) return defaultCoord;
  const lower = addressStr.toLowerCase();
  for (const [key, coord] of Object.entries(CITY_COORDINATES)) {
    if (lower.includes(key)) {
      return coord;
    }
  }
  return defaultCoord;
};

// True Dynamic Milestone Mapping based on driver's actual status updates
const STAGE_MILESTONES = {
  'Requested': {
    percent: 15,
    stageTitle: 'Pickup Requested',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    stepNumber: 'Step 1 of 5'
  },
  'Pending Driver Confirmation': {
    percent: 20,
    stageTitle: 'Pending Confirmation',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    stepNumber: 'Step 1 of 5'
  },
  'Accepted': {
    percent: 35,
    stageTitle: 'Accepted by Driver',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    stepNumber: 'Step 2 of 5'
  },
  'Heading to Pickup': {
    percent: 55,
    stageTitle: 'Heading to Pickup Hub',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    stepNumber: 'Step 3 of 5'
  },
  'Picked Up': {
    percent: 75,
    stageTitle: 'Cargo Picked Up & Loaded',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    stepNumber: 'Step 4 of 5'
  },
  'In Transit': {
    percent: 88,
    stageTitle: 'In Transit along Corridor',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
    stepNumber: 'Step 4 of 5'
  },
  'Delivered': {
    percent: 100,
    stageTitle: 'Delivered to Destination',
    badgeClass: 'bg-emerald-900 text-white border-emerald-950',
    stepNumber: 'Completed'
  }
};

export const GoogleMapsTrackingView = ({ shipment }) => {
  const pickupLocation = shipment?.pickupLocation || 'Bhimavaram, AP';
  const deliveryDestination = shipment?.deliveryDestination || 'Vijayawada, AP';
  const driverName = shipment?.driverName || 'Ramesh Varma';
  const vehicleType = shipment?.vehicleType || 'Truck • Eicher (18m³)';
  const currentStatus = shipment?.status || 'In Transit';

  // Dynamic stage milestone based purely on shipment's current status
  const milestone = STAGE_MILESTONES[currentStatus] || STAGE_MILESTONES['In Transit'];
  const progressPercent = milestone.percent;

  const pickupCoord = resolveCoordinates(pickupLocation, { lat: 16.5449, lng: 81.5212 });
  const deliveryCoord = resolveCoordinates(deliveryDestination, { lat: 16.5062, lng: 80.6480 });

  // Route corridor distance
  const totalEstimatedKm = Math.round(
    Math.sqrt(
      Math.pow((deliveryCoord.lat - pickupCoord.lat) * 111, 2) +
      Math.pow((deliveryCoord.lng - pickupCoord.lng) * 111, 2)
    ) * 1.25
  ) || 115;

  const apiKey = localStorage.getItem('GMP_API_KEY') || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Google Maps Dynamic Driving Directions Embed URL
  const googleMapsEmbedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(apiKey)}&origin=${encodeURIComponent(pickupLocation)}&destination=${encodeURIComponent(deliveryDestination)}&mode=driving`
    : `https://maps.google.com/maps?saddr=${encodeURIComponent(pickupLocation)}&daddr=${encodeURIComponent(deliveryDestination)}&output=embed`;

  return (
    <div className="relative rounded-3xl border border-slate-300 overflow-hidden shadow-lg bg-slate-900 h-[440px] transition-all">
      {/* Clean Dynamic Google Map Frame */}
      <iframe
        title="Live Google Map Route"
        src={googleMapsEmbedUrl}
        className="w-full h-full border-0 filter saturate-105"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* DYNAMIC DELIVERY STAGE CARD (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-2xl space-y-3 max-w-xl mx-auto sm:mx-0">
          
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block">{driverName}</span>
                <span className="text-[11px] text-slate-500 font-medium">{vehicleType}</span>
              </div>
            </div>

            {/* Dynamic Stage Badge & Corridor Distance */}
            <div className="text-right space-y-0.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${milestone.badgeClass}`}>
                {currentStatus === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {milestone.stageTitle}
              </span>
              <div className="text-[10px] text-slate-400 font-medium">
                Route Distance: <strong className="text-slate-700">{totalEstimatedKm} km</strong>
              </div>
            </div>
          </div>

          {/* Dynamic Milestone Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-950 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-emerald-900" />
                {pickupLocation.split(',')[0]}
              </span>
              <span className="text-[10px] bg-slate-900 px-2.5 py-0.5 rounded-full text-white font-bold">
                {milestone.stepNumber}: {milestone.stageTitle}
              </span>
              <span className="flex items-center gap-1.5 text-blue-950 bg-blue-100/90 border border-blue-300 px-2 py-0.5 rounded-lg">
                <Navigation className="w-3.5 h-3.5 text-blue-900" />
                {deliveryDestination.split(',')[0]}
              </span>
            </div>

            {/* Progress Bar reflecting actual delivery milestone */}
            <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  currentStatus === 'Delivered' 
                    ? 'bg-emerald-600' 
                    : 'bg-gradient-to-r from-emerald-500 to-blue-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

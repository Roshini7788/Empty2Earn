import React from 'react';

export const GoogleMapsTrackingView = ({ shipment }) => {
  const pickupLocation = shipment?.pickupLocation || 'Bhimavaram, AP';
  const deliveryDestination = shipment?.deliveryDestination || 'Vijayawada, AP';

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
    </div>
  );
};

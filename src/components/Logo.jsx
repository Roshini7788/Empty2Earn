import React from 'react';

export const Logo = ({ size = 'normal', onClick }) => {
  const sizeClasses = {
    small: 'text-lg',
    normal: 'text-xl font-bold',
    large: 'text-2xl font-extrabold'
  };

  const iconSizes = {
    small: 'w-6 h-6',
    normal: 'w-8 h-8',
    large: 'w-10 h-10'
  };

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group transition-all duration-200`}
    >
      <div className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform`}>
        {/* Modern Leaf & Delivery Truck Hybrid Icon */}
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Truck Body */}
          <rect x="1" y="3" width="14" height="13" rx="2" />
          <polygon points="15 8 19 8 22 12 22 16 15 16 15 8" />
          {/* Wheels */}
          <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" className="text-slate-900" />
          <circle cx="17.5" cy="18.5" r="2.5" fill="currentColor" className="text-slate-900" />
          {/* Leaf / Eco arrow motif */}
          <path d="M7 8c2.5 0 4-1.5 5-3.5 0 2.5 1.5 4 4 4" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className={`flex items-center ${sizeClasses[size]} tracking-tight font-sans`}>
        <span className="text-slate-900 font-extrabold">Empty</span>
        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-extrabold">2Earn</span>
      </div>
    </div>
  );
};

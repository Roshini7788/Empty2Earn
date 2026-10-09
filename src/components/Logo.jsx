import React from 'react';

export const Logo = ({ size = 'normal', onClick, light = false }) => {
  const sizeClasses = {
    small: 'text-lg',
    normal: 'text-2xl font-black',
    large: 'text-3xl font-black'
  };

  const imageSizes = {
    small: 'h-8 w-auto',
    normal: 'h-10 w-auto',
    large: 'h-12 w-auto'
  };

  return (
    <div 
      onClick={onClick}
      className="inline-flex items-center gap-3 cursor-pointer select-none group transition-all duration-150"
    >
      <img 
        src="/logo.png" 
        alt="Empty2Earn Logo" 
        className={`${imageSizes[size]} rounded-lg object-contain group-hover:scale-105 transition-transform`}
      />

      <div className={`flex items-center ${sizeClasses[size]} tracking-tight font-sans`}>
        <span className={light ? "text-white" : "text-slate-900"}>Empty</span>
        <span className="text-[#2874f0]">2Earn</span>
      </div>
    </div>
  );
};

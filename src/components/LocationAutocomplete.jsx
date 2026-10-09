import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X, Building2, Check } from 'lucide-react';

// Comprehensive dataset of Andhra Pradesh, Telangana, logistics hubs, and Indian cities
const SUGGESTIONS_DATABASE = [
  // West Godavari, Eluru & nearby AP hubs (Primary region for Empty2Earn demo)
  { name: 'Bhimavaram', district: 'West Godavari', state: 'Andhra Pradesh', type: 'Major Commercial Hub' },
  { name: 'Bhimadole', district: 'Eluru District', state: 'Andhra Pradesh', type: 'Highway Junction Town' },
  { name: 'Bhimunipatnam (Bheemili)', district: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'Coastal Town' },
  { name: 'Bhiwandi', district: 'Thane', state: 'Maharashtra', type: 'Major Logistics & Warehousing Hub' },
  { name: 'Bhilai', district: 'Durg', state: 'Chhattisgarh', type: 'Industrial & Steel City' },
  { name: 'Bhilwara', district: 'Bhilwara', state: 'Rajasthan', type: 'Textile Hub City' },
  { name: 'Bhiwani', district: 'Bhiwani', state: 'Haryana', type: 'Commercial City' },
  { name: 'Bhind', district: 'Bhind', state: 'Madhya Pradesh', type: 'City' },
  { name: 'Tadepalligudem', district: 'West Godavari', state: 'Andhra Pradesh', type: 'Commercial & Agro Hub' },
  { name: 'Tanuku', district: 'West Godavari', state: 'Andhra Pradesh', type: 'Industrial Town' },
  { name: 'Palakollu', district: 'West Godavari', state: 'Andhra Pradesh', type: 'Agro Trade Center' },
  { name: 'Narsapur', district: 'West Godavari', state: 'Andhra Pradesh', type: 'Port Town' },
  { name: 'Eluru', district: 'Eluru District', state: 'Andhra Pradesh', type: 'District Headquarters' },
  { name: 'Jangareddygudem', district: 'Eluru District', state: 'Andhra Pradesh', type: 'Agricultural Hub' },
  { name: 'Rajahmundry', district: 'East Godavari', state: 'Andhra Pradesh', type: 'Cultural & Logistics City' },
  { name: 'Kakinada', district: 'Kakinada District', state: 'Andhra Pradesh', type: 'Deepwater Port City' },
  { name: 'Vijayawada', district: 'NTR District', state: 'Andhra Pradesh', type: 'Major Transport & Rail Junction' },
  { name: 'Guntur', district: 'Guntur District', state: 'Andhra Pradesh', type: 'Commercial & Spice Hub' },
  { name: 'Amaravati', district: 'Guntur District', state: 'Andhra Pradesh', type: 'Capital Region' },
  { name: 'Mangalagiri', district: 'Guntur District', state: 'Andhra Pradesh', type: 'IT & Commercial Town' },
  { name: 'Tenali', district: 'Guntur District', state: 'Andhra Pradesh', type: 'Agricultural Town' },
  { name: 'Machilipatnam', district: 'Krishna District', state: 'Andhra Pradesh', type: 'Port City' },
  { name: 'Gudivada', district: 'Krishna District', state: 'Andhra Pradesh', type: 'Commercial Center' },
  { name: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', type: 'Major Seaport & Industrial Metro' },
  { name: 'Anakapalle', district: 'Anakapalli', state: 'Andhra Pradesh', type: 'Jaggery Market & Transport Hub' },
  { name: 'Vizianagaram', district: 'Vizianagaram', state: 'Andhra Pradesh', type: 'Rail Junction City' },
  { name: 'Srikakulam', district: 'Srikakulam', state: 'Andhra Pradesh', type: 'Coastal District Center' },
  { name: 'Ongole', district: 'Prakasam', state: 'Andhra Pradesh', type: 'Granite & Transport Hub' },
  { name: 'Nellore', district: 'SPSR Nellore', state: 'Andhra Pradesh', type: 'Coastal Highway Hub' },
  { name: 'Tirupati', district: 'Tirupati District', state: 'Andhra Pradesh', type: 'Spiritual Metro & Airport Hub' },
  { name: 'Kurnool', district: 'Kurnool', state: 'Andhra Pradesh', type: 'Highway Transit City' },
  { name: 'Kadapa', district: 'YSR Kadapa', state: 'Andhra Pradesh', type: 'Mineral & Commercial City' },
  { name: 'Anantapur', district: 'Anantapur', state: 'Andhra Pradesh', type: 'Trade & Automobile Corridor' },
  { name: 'Chittoor', district: 'Chittoor', state: 'Andhra Pradesh', type: 'Industrial Gateway' },

  // Telangana
  { name: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', type: 'Mega IT & Logistics Hub' },
  { name: 'Secunderabad', district: 'Hyderabad', state: 'Telangana', type: 'Rail & Freight Center' },
  { name: 'Warangal', district: 'Warangal', state: 'Telangana', type: 'Industrial City' },
  { name: 'Khammam', district: 'Khammam', state: 'Telangana', type: 'Trade & Transit Hub' },
  { name: 'Nalgonda', district: 'Nalgonda', state: 'Telangana', type: 'Highway Junction' },
  { name: 'Karimnagar', district: 'Karimnagar', state: 'Telangana', type: 'Granite & Agro Center' },
  { name: 'Nizamabad', district: 'Nizamabad', state: 'Telangana', type: 'Turmeric & Agro Hub' },

  // Key Pan-India Hubs
  { name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', type: 'Tech & Freight Hub' },
  { name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', type: 'Major Port & Automotive Hub' },
  { name: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', type: 'Financial & Port Metropolis' },
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', type: 'Manufacturing & Tech Hub' },
  { name: 'New Delhi', district: 'Delhi', state: 'Delhi NCR', type: 'National Capital Territory' },
  { name: 'Kolkata', district: 'Kolkata', state: 'West Bengal', type: 'Eastern Port Metropolis' },
  { name: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', type: 'Industrial & Trade Center' },
  { name: 'Surat', district: 'Surat', state: 'Gujarat', type: 'Textile & Diamond Hub' },
  { name: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', type: 'Central Logistics Multimodal Hub' }
];

export const LocationAutocomplete = ({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Enter city or address...',
  label,
  iconType = 'pin', // 'pin' | 'navigation'
  required = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [liveResults, setLiveResults] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Filter local suggestions instantaneously based on input
  useEffect(() => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed) {
      // When empty, show top popular local hubs
      setFilteredSuggestions(SUGGESTIONS_DATABASE.slice(0, 6));
      setLiveResults([]);
      return;
    }

    const matched = SUGGESTIONS_DATABASE.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(trimmed);
      const districtMatch = item.district?.toLowerCase().includes(trimmed);
      const stateMatch = item.state?.toLowerCase().includes(trimmed);
      return nameMatch || districtMatch || stateMatch;
    }).sort((a, b) => {
      // Prioritize startsWith matches
      const aStarts = a.name.toLowerCase().startsWith(trimmed);
      const bStarts = b.name.toLowerCase().startsWith(trimmed);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });

    setFilteredSuggestions(matched);
    setHighlightedIndex(-1);
  }, [value]);

  // Optional background fetch for live real-world global address search if query > 2 chars
  useEffect(() => {
    const query = value.trim();
    if (query.length < 3) {
      setLiveResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=in&limit=4&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map(item => ({
            name: item.name || item.display_name.split(',')[0],
            district: item.address?.state_district || item.address?.county || '',
            state: item.address?.state || item.display_name.split(',').slice(-2).join(','),
            type: item.type ? item.type.replace('_', ' ') : 'Location',
            fullAddress: item.display_name,
            isOnline: true
          }));
          setLiveResults(formatted);
        }
      } catch (err) {
        // Silently fail if offline or rate limited; local suggestions remain instant
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    const locationString = item.state ? `${item.name}, ${item.state}` : item.name;
    onChange(locationString);
    if (onSelect) onSelect(item);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    const allItems = [...filteredSuggestions, ...liveResults];
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < allItems.length) {
        e.preventDefault();
        handleSelect(allItems[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <span>
        {text.slice(0, index)}
        <span className="font-bold text-emerald-700 underline decoration-emerald-300">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </span>
    );
  };

  const IconComponent = iconType === 'navigation' ? Navigation : MapPin;
  const iconColor = iconType === 'navigation' ? 'text-blue-600' : 'text-emerald-600';

  const combinedSuggestions = [...filteredSuggestions];
  // Filter duplicates from live results
  liveResults.forEach(liveItem => {
    if (!combinedSuggestions.some(c => c.name.toLowerCase() === liveItem.name.toLowerCase())) {
      combinedSuggestions.push(liveItem);
    }
  });

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <IconComponent className={`w-4 h-4 ${iconColor} absolute left-3.5 top-3.5 pointer-events-none transition-colors`} />

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium transition-all shadow-inner"
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-full hover:bg-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3.5 py-2 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>{value.trim() ? `Suggestions matching "${value}"` : 'Popular Nearby Hubs'}</span>
            <span className="text-[10px] text-slate-400 font-normal">Use ↑↓ keys to navigate</span>
          </div>

          {combinedSuggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching locations found. You can still type your full custom address.
            </div>
          ) : (
            combinedSuggestions.map((item, idx) => {
              const isSelected = value.toLowerCase().includes(item.name.toLowerCase());
              const isHighlighted = idx === highlightedIndex;

              return (
                <button
                  key={`${item.name}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    isHighlighted ? 'bg-emerald-50/90 text-emerald-950' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                    item.type?.includes('Hub') ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.type?.includes('Hub') ? (
                      <Building2 className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate text-slate-900">
                        {highlightMatch(item.name, value.trim())}
                      </span>
                      {item.type && (
                        <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md truncate">
                          {item.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {[item.district, item.state].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 self-center" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

// Default initial state for realistic demo workflow
const INITIAL_DRIVER_TRIP = {
  id: 'trip-101',
  origin: 'Bhimavaram',
  originState: 'AP',
  destination: 'Vijayawada',
  destinationState: 'AP',
  departureDate: '2025-04-26',
  departureTime: '08:00 AM',
  returnDate: '2025-04-26',
  returnTime: '06:00 PM',
  vehicleType: 'Truck • Eicher 19ft',
  totalCapacity: 18, // m³
  occupiedCapacity: 8, // m³
  availableCapacity: 10, // m³
  isAvailable: true,
  loadingStatus: 'Partially Loaded' // 'Empty' | 'Partially Loaded' | 'Full'
};

const INITIAL_SHIPMENTS = [
  {
    id: 'REQ-1003',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    pickupLocation: 'Bhimavaram, AP',
    deliveryDestination: 'Vijayawada, AP',
    pickupDate: '2025-04-26',
    pickupTimeWindow: '10:00 AM - 12:00 PM',
    packageType: 'Electronics & Spare Parts',
    weight: 120, // kg
    dimensions: { length: 120, width: 80, height: 100 },
    requiredCapacity: 6, // m³
    specialHandling: ['Fragile'],
    description: 'Pallet of boxed electronics components',
    status: 'In Transit', // 'Requested' | 'Accepted' | 'Heading to Pickup' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Rejected'
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    driverVerified: true,
    driverRating: 4.8,
    driverDeliveries: 124,
    vehicleType: 'Truck • Eicher (18m³)',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    matchScore: 92,
    extraDistanceKm: 12,
    price: 2450,
    requestedAt: 'Apr 26, 2025 • 08:30 AM',
    acceptedAt: 'Apr 26, 2025 • 09:15 AM',
    pickedUpAt: 'Apr 26, 2025 • 10:45 AM',
    estimatedArrival: '2:15 PM (in ~10 min)',
    co2SavedKg: 18.5,
    fuelSavedLiters: 7.2,
    emptyKmAvoided: 42
  },
  {
    id: 'REQ-1002',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    pickupLocation: 'Bhimavaram, AP',
    deliveryDestination: 'Visakhapatnam, AP',
    pickupDate: '2025-04-24',
    pickupTimeWindow: '01:00 PM - 03:00 PM',
    packageType: 'Machinery Components',
    weight: 250,
    requiredCapacity: 8,
    status: 'Delivered',
    driverId: 'd2',
    driverName: 'Suresh Reddy',
    vehicleType: 'Truck • Tata 22ft (20m³)',
    price: 3200,
    requestedAt: 'Apr 24, 2025',
    co2SavedKg: 24.2,
    fuelSavedLiters: 9.5,
    emptyKmAvoided: 58
  },
  {
    id: 'REQ-1001',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    pickupLocation: 'Tadepalligudem, AP',
    deliveryDestination: 'Rajahmundry, AP',
    pickupDate: '2025-04-22',
    pickupTimeWindow: '09:00 AM - 11:00 AM',
    packageType: 'Retail Goods',
    weight: 95,
    requiredCapacity: 4,
    status: 'Delivered',
    driverId: 'd3',
    driverName: 'Venkatesh Rao',
    vehicleType: 'Van • Bolero Maxi (10m³)',
    price: 1850,
    requestedAt: 'Apr 22, 2025',
    co2SavedKg: 15.0,
    fuelSavedLiters: 5.8,
    emptyKmAvoided: 35
  }
];

const INITIAL_AVAILABLE_DRIVERS = [
  {
    id: 'd1',
    name: 'Ramesh Varma',
    verified: true,
    rating: 4.8,
    completedDeliveries: 124,
    vehicleType: 'Truck • Eicher 18m³ capacity',
    occupiedCapacity: 8,
    availableCapacity: 10,
    route: 'Bhimavaram → Vijayawada (via NH16)',
    plannedDeparture: '10:15 AM',
    matchScore: 92,
    extraDistanceKm: 12,
    estimatedPrice: 2450,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98480 12345'
  },
  {
    id: 'd2',
    name: 'Suresh Reddy',
    verified: true,
    rating: 4.9,
    completedDeliveries: 96,
    vehicleType: 'Truck • Tata 20m³ capacity',
    occupiedCapacity: 5,
    availableCapacity: 15,
    route: 'Bhimavaram → Vijayawada (via State Hwy 43)',
    plannedDeparture: '10:30 AM',
    matchScore: 88,
    extraDistanceKm: 18,
    estimatedPrice: 2850,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 94401 54321'
  },
  {
    id: 'd3',
    name: 'Venkatesh Rao',
    verified: true,
    rating: 4.6,
    completedDeliveries: 78,
    vehicleType: 'Van • Bolero 10m³ capacity',
    occupiedCapacity: 4,
    availableCapacity: 6,
    route: 'Bhimavaram → Vijayawada (via Direct Express)',
    plannedDeparture: '10:45 AM',
    matchScore: 81,
    extraDistanceKm: 25,
    estimatedPrice: 1950,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 89785 67890'
  }
];

const INITIAL_DRIVER_TRIPS_HISTORY = [
  {
    id: 'TRP-1048',
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    origin: 'Vijayawada, AP',
    originHub: 'Auto Nagar Logistics Hub',
    destination: 'Bhimavaram, AP',
    destinationHub: 'Somavaram Industrial Estate',
    viaRoute: 'NH16 via Eluru & Gundugolanu',
    departureDate: '2025-04-25',
    departureTime: '07:30 AM',
    arrivalDate: '2025-04-25',
    arrivalTime: '01:45 PM',
    distanceKm: 118,
    emptyKmSaved: 110,
    co2SavedKg: 24.5,
    fuelSavedLiters: 9.8,
    revenue: 3850,
    status: 'Completed',
    vehicleType: 'Truck • Eicher 19ft (18m³)',
    totalCapacity: 18,
    utilizedCapacity: 15,
    shipmentsCount: 2,
    shipments: [
      { id: 'REQ-1002', item: 'Machinery Components', customer: 'Priya Sharma', weight: '250 kg', payment: 2100 },
      { id: 'REQ-0994', item: 'Agro Machinery Spare Parts', customer: 'Kiran Kumar', weight: '180 kg', payment: 1750 }
    ],
    rating: 4.9,
    deliveryProof: 'Digital POD Signed & Verified'
  },
  {
    id: 'TRP-1042',
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    origin: 'Rajahmundry, AP',
    originHub: 'Morampudi Industrial Zone',
    destination: 'Bhimavaram, AP',
    destinationHub: 'Undi Road Commercial Yard',
    viaRoute: 'SH43 via Tanuku & Tadepalligudem',
    departureDate: '2025-04-23',
    departureTime: '09:00 AM',
    arrivalDate: '2025-04-23',
    arrivalTime: '03:15 PM',
    distanceKm: 82,
    emptyKmSaved: 76,
    co2SavedKg: 17.2,
    fuelSavedLiters: 6.9,
    revenue: 2900,
    status: 'Completed',
    vehicleType: 'Truck • Eicher 19ft (18m³)',
    totalCapacity: 18,
    utilizedCapacity: 12,
    shipmentsCount: 1,
    shipments: [
      { id: 'REQ-0988', item: 'Textile Rolls & Ceramic Ware', customer: 'Sita Lakshmi Textiles', weight: '310 kg', payment: 2900 }
    ],
    rating: 4.8,
    deliveryProof: 'Digital POD Signed & Verified'
  },
  {
    id: 'TRP-1037',
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    origin: 'Guntur, AP',
    originHub: 'Chilakaluripet Highway Depot',
    destination: 'Bhimavaram, AP',
    destinationHub: 'Bhimavaram Goods Shed',
    viaRoute: 'NH16 via Amaravati & Hanuman Junction',
    departureDate: '2025-04-20',
    departureTime: '06:15 AM',
    arrivalDate: '2025-04-20',
    arrivalTime: '01:10 PM',
    distanceKm: 142,
    emptyKmSaved: 135,
    co2SavedKg: 31.8,
    fuelSavedLiters: 12.5,
    revenue: 4600,
    status: 'Completed',
    vehicleType: 'Truck • Eicher 19ft (18m³)',
    totalCapacity: 18,
    utilizedCapacity: 17,
    shipmentsCount: 2,
    shipments: [
      { id: 'REQ-0975', item: 'Packaged Spices & Dry Chillies', customer: 'Andhra Agro Export', weight: '420 kg', payment: 2600 },
      { id: 'REQ-0972', item: 'Electrical Hardware & Pipes', customer: 'Vijaya Builders', weight: '220 kg', payment: 2000 }
    ],
    rating: 5.0,
    deliveryProof: 'Digital POD Signed & Verified'
  },
  {
    id: 'TRP-1029',
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    origin: 'Visakhapatnam, AP',
    originHub: 'Gajuwaka Industrial Hub',
    destination: 'Bhimavaram, AP',
    destinationHub: 'Bhimavaram Main Gate',
    viaRoute: 'NH16 Coastal Express Corridor',
    departureDate: '2025-04-17',
    departureTime: '05:00 AM',
    arrivalDate: '2025-04-17',
    arrivalTime: '03:45 PM',
    distanceKm: 228,
    emptyKmSaved: 215,
    co2SavedKg: 48.6,
    fuelSavedLiters: 19.2,
    revenue: 5400,
    status: 'Completed',
    vehicleType: 'Truck • Eicher 19ft (18m³)',
    totalCapacity: 18,
    utilizedCapacity: 16,
    shipmentsCount: 2,
    shipments: [
      { id: 'REQ-0960', item: 'Automotive Engine Parts', customer: 'Vizag Auto Spares', weight: '380 kg', payment: 3200 },
      { id: 'REQ-0958', item: 'Retail Consumer Packaging', customer: 'Coastal Retail Ltd', weight: '190 kg', payment: 2200 }
    ],
    rating: 4.9,
    deliveryProof: 'Digital POD Signed & Verified'
  },
  {
    id: 'TRP-1018',
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    origin: 'Eluru, AP',
    originHub: 'Sanivarapupeta Depot',
    destination: 'Bhimavaram, AP',
    destinationHub: 'Bhimavaram Rural Hub',
    viaRoute: 'SH44 via Kaikaluru & Akividu',
    departureDate: '2025-04-14',
    departureTime: '08:30 AM',
    arrivalDate: '2025-04-14',
    arrivalTime: '12:40 PM',
    distanceKm: 58,
    emptyKmSaved: 54,
    co2SavedKg: 12.4,
    fuelSavedLiters: 4.8,
    revenue: 2150,
    status: 'Completed',
    vehicleType: 'Truck • Eicher 19ft (18m³)',
    totalCapacity: 18,
    utilizedCapacity: 11,
    shipmentsCount: 1,
    shipments: [
      { id: 'REQ-0941', item: 'Paddy Seeds & Irrigation Filters', customer: 'Godavari Agri Co-op', weight: '340 kg', payment: 2150 }
    ],
    rating: 4.7,
    deliveryProof: 'Digital POD Signed & Verified'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Shipment REQ-1003 Status Updated',
    message: 'Delivery partner Ramesh Varma updated status to "In Transit".',
    time: '10 min ago',
    type: 'info',
    read: false
  },
  {
    id: 'n2',
    title: 'Driver Accepted Request',
    message: 'Ramesh Varma accepted your pickup request for REQ-1003.',
    time: '45 min ago',
    type: 'success',
    read: true
  },
  {
    id: 'n3',
    title: 'Pickup Request Submitted',
    message: 'Your shipment request REQ-1003 was sent to matching return drivers.',
    time: '2 hours ago',
    type: 'info',
    read: true
  }
];

export const AppProvider = ({ children }) => {
  // Always default to landing page on fresh reload
  const [currentUser, setCurrentUser] = useState(() => {
    const sessionSaved = sessionStorage.getItem('e2e_user');
    if (sessionSaved) {
      try { return JSON.parse(sessionSaved); } catch {}
    }
    const saved = localStorage.getItem('e2e_user') || localStorage.getItem('e2e_user_backup');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.name === 'Mike Davis') return { ...parsed, name: 'Ramesh Varma', email: 'driver@empty2earn.in' };
      if (parsed.name === 'Sarah Johnson') return { ...parsed, name: 'Priya Sharma', email: 'customer@empty2earn.in' };
      return parsed;
    } catch {
      return null;
    }
  });

  // Always start at landing page when reloaded
  const [currentView, setCurrentView] = useState('landing');

  const [driverTrip, setDriverTrip] = useState(() => {
    const saved = localStorage.getItem('e2e_driver_trip');
    return saved ? JSON.parse(saved) : INITIAL_DRIVER_TRIP;
  });

  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('e2e_shipments');
    if (!saved) return INITIAL_SHIPMENTS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(s => {
        if (s.driverName === 'Mike Davis' || s.price < 500) {
          return {
            ...s,
            driverName: s.driverName === 'Mike Davis' ? 'Ramesh Varma' : s.driverName,
            customerName: s.customerName === 'Sarah Johnson' ? 'Priya Sharma' : s.customerName,
            price: s.price < 500 ? (s.price === 180 ? 2450 : s.price === 210 ? 3200 : 1850) : s.price
          };
        }
        return s;
      });
    } catch {
      return INITIAL_SHIPMENTS;
    }
  });

  const [activeShipmentId, setActiveShipmentId] = useState('REQ-1003');

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('e2e_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [driverTripsHistory, setDriverTripsHistory] = useState(() => {
    const saved = localStorage.getItem('e2e_driver_trips_history');
    return saved ? JSON.parse(saved) : INITIAL_DRIVER_TRIPS_HISTORY;
  });

  // Multi-step Pickup Form state
  const [pickupFormStep, setPickupFormStep] = useState(1);
  const [pickupFormData, setPickupFormData] = useState({
    pickupLocation: 'Bhimavaram, AP',
    deliveryDestination: 'Vijayawada, AP',
    pickupDate: '2025-04-28',
    pickupTimeWindow: '10:00 AM - 12:00 PM',
    packageType: 'Electronics',
    weight: '5',
    length: '30',
    width: '20',
    height: '15',
    specialHandling: ['Fragile'],
    description: 'High value sample electronics kit for rapid delivery',
    selectedDriver: null,
    // High-Value Shipment Document Verification
    documents: {
      identityDoc: null,      // { name, size, type, uploadedAt }
      vehicleRC: null,        // { name, size, type, uploadedAt }
      ownershipProof: null   // { name, size, type, uploadedAt }
    },
    documentStatus: 'DOCUMENTS_REQUIRED' // 'DOCUMENTS_REQUIRED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
  });

  // Sync state to localStorage & BroadcastChannel for instant cross-tab updates
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('e2e_user', JSON.stringify(currentUser));
      localStorage.setItem('e2e_user_backup', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('e2e_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('e2e_shipments', JSON.stringify(shipments));
    try {
      const bc = new BroadcastChannel('e2e_sync_bus');
      bc.postMessage({ type: 'SYNC_SHIPMENTS', data: shipments });
      bc.close();
    } catch {}
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('e2e_driver_trip', JSON.stringify(driverTrip));
    try {
      const bc = new BroadcastChannel('e2e_sync_bus');
      bc.postMessage({ type: 'SYNC_DRIVER_TRIP', data: driverTrip });
      bc.close();
    } catch {}
  }, [driverTrip]);

  useEffect(() => {
    localStorage.setItem('e2e_driver_trips_history', JSON.stringify(driverTripsHistory));
  }, [driverTripsHistory]);

  useEffect(() => {
    localStorage.setItem('e2e_notifications', JSON.stringify(notifications));
    try {
      const bc = new BroadcastChannel('e2e_sync_bus');
      bc.postMessage({ type: 'SYNC_NOTIFICATIONS', data: notifications });
      bc.close();
    } catch {}
  }, [notifications]);

  // Real-time cross-tab & cross-window synchronization listener
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('e2e_sync_bus');
      bc.onmessage = (event) => {
        if (!event.data) return;
        if (event.data.type === 'SYNC_SHIPMENTS' && Array.isArray(event.data.data)) {
          setShipments(event.data.data);
        }
        if (event.data.type === 'SYNC_DRIVER_TRIP' && event.data.data) {
          setDriverTrip(event.data.data);
        }
        if (event.data.type === 'SYNC_NOTIFICATIONS' && Array.isArray(event.data.data)) {
          setNotifications(event.data.data);
        }
      };
    } catch {}

    const handleStorageChange = (e) => {
      if (e.key === 'e2e_shipments' && e.newValue) {
        try { setShipments(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'e2e_driver_trip' && e.newValue) {
        try { setDriverTrip(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'e2e_notifications' && e.newValue) {
        try { setNotifications(JSON.parse(e.newValue)); } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Auth helper methods
  const loginCustomerDemo = () => {
    const user = {
      id: 'c1',
      name: 'Priya Sharma',
      email: 'customer@empty2earn.in',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(user);
    setCurrentView('customer-dashboard');
  };

  const loginDriverDemo = () => {
    const user = {
      id: 'd1',
      name: 'Ramesh Varma',
      email: 'driver@empty2earn.in',
      role: 'driver',
      rating: 4.8,
      deliveries: 124,
      vehicle: 'Truck • Eicher 19ft (18m³)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(user);
    setCurrentView('driver-dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  // Driver action helpers
  const acceptShipmentRequest = (shipmentId) => {
    const targetShipment = shipments.find(s => s.id === shipmentId);
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          status: 'Accepted',
          acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return s;
    }));

    // Dynamically adjust driver vehicle capacity for active haul
    if (targetShipment?.requiredCapacity) {
      setDriverTrip(prev => {
        const addedOccupied = Math.min(prev.totalCapacity, prev.occupiedCapacity + (targetShipment.requiredCapacity || 5));
        const freeCap = Math.max(0, prev.totalCapacity - addedOccupied);
        return {
          ...prev,
          occupiedCapacity: addedOccupied,
          availableCapacity: freeCap,
          loadingStatus: freeCap === 0 ? 'Full' : 'Partially Loaded'
        };
      });
    }

    setActiveShipmentId(shipmentId);

    // Add notification
    const newNotif = {
      id: `n-${Date.now()}`,
      title: `Driver Accepted Request ${shipmentId}`,
      message: `Driver accepted shipment from ${targetShipment?.pickupLocation || 'Pickup'} to ${targetShipment?.deliveryDestination || 'Destination'}.`,
      time: 'Just now',
      type: 'success',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const rejectShipmentRequest = (shipmentId) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return { ...s, status: 'Rejected' };
      }
      return s;
    }));

    const newNotif = {
      id: `n-${Date.now()}`,
      title: `Request ${shipmentId} Declined`,
      message: `Driver unavailable for ${shipmentId}. You can select another driver.`,
      time: 'Just now',
      type: 'warning',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateDeliveryStatus = (shipmentId, newStatus) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));

    const newNotif = {
      id: `n-${Date.now()}`,
      title: `Shipment ${shipmentId} Status Updated`,
      message: `Shipment status is now "${newStatus}".`,
      time: 'Just now',
      type: newStatus === 'Delivered' ? 'success' : 'info',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Submit pickup form to create shipment
  const submitPickupRequest = () => {
    const newId = `REQ-${1000 + shipments.length + 1}`;
    const newShipment = {
      id: newId,
      customerId: currentUser?.id || 'c1',
      customerName: currentUser?.name || 'Priya Sharma',
      pickupLocation: pickupFormData.pickupLocation,
      deliveryDestination: pickupFormData.deliveryDestination,
      pickupDate: pickupFormData.pickupDate,
      pickupTimeWindow: pickupFormData.pickupTimeWindow,
      packageType: pickupFormData.packageType,
      weight: parseFloat(pickupFormData.weight) || 5,
      dimensions: {
        length: parseFloat(pickupFormData.length) || 30,
        width: parseFloat(pickupFormData.width) || 20,
        height: parseFloat(pickupFormData.height) || 15
      },
      requiredCapacity: 5,
      specialHandling: pickupFormData.specialHandling,
      description: pickupFormData.description,
      status: 'Requested', // Pending Driver Confirmation
      driverId: pickupFormData.selectedDriver?.id || 'd1',
      driverName: pickupFormData.selectedDriver?.name || 'Ramesh Varma',
      driverVerified: true,
      driverRating: pickupFormData.selectedDriver?.rating || 4.8,
      driverDeliveries: pickupFormData.selectedDriver?.completedDeliveries || 124,
      vehicleType: pickupFormData.selectedDriver?.vehicleType || 'Truck • Eicher (18m³)',
      driverAvatar: pickupFormData.selectedDriver?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      matchScore: pickupFormData.selectedDriver?.matchScore || 92,
      extraDistanceKm: pickupFormData.selectedDriver?.extraDistanceKm || 12,
      price: pickupFormData.selectedDriver?.estimatedPrice || 2450,
      requestedAt: 'Just now',
      estimatedArrival: 'Tomorrow 2:00 PM',
      co2SavedKg: 19.4,
      fuelSavedLiters: 7.8,
      emptyKmAvoided: 45
    };

    setShipments(prev => [newShipment, ...prev]);
    setActiveShipmentId(newId);

    // Add notification
    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        title: `Pickup Request ${newId} Created`,
        message: `Your request was sent to driver ${newShipment.driverName}. Status: Pending Confirmation.`,
        time: 'Just now',
        type: 'info',
        read: false
      },
      ...prev
    ]);

    // Reset pickup form step
    setPickupFormStep(1);
    return newId;
  };

  // High-Value Shipment Document Verification handlers
  const uploadDocument = (docKey, file) => {
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    const docMetadata = {
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      type: file.type,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setPickupFormData(prev => {
      const updatedDocs = {
        ...prev.documents,
        [docKey]: docMetadata
      };

      // Check if all 3 required documents are present
      const allUploaded = updatedDocs.identityDoc && updatedDocs.vehicleRC && updatedDocs.ownershipProof;

      return {
        ...prev,
        documents: updatedDocs,
        documentStatus: allUploaded ? 'PENDING_REVIEW' : 'DOCUMENTS_REQUIRED'
      };
    });
  };

  const updateDocumentVerificationStatus = (newStatus) => {
    setPickupFormData(prev => ({
      ...prev,
      documentStatus: newStatus
    }));

    if (newStatus === 'APPROVED') {
      setNotifications(prev => [
        {
          id: `n-${Date.now()}`,
          title: 'Automobile Documents Approved',
          message: 'Your vehicle identity and RC documents have been verified. You can now select matching drivers.',
          time: 'Just now',
          type: 'success',
          read: false
        },
        ...prev
      ]);
    }
  };

  const repeatRouteAsActiveTrip = (trip) => {
    setDriverTrip(prev => ({
      ...prev,
      origin: trip.origin.split(',')[0],
      destination: trip.destination.split(',')[0],
      availableCapacity: prev.totalCapacity,
      occupiedCapacity: 0,
      loadingStatus: 'Empty',
      isAvailable: true
    }));
    setCurrentView('driver-dashboard');
  };

  const resetDemoData = () => {
    localStorage.removeItem('e2e_user');
    localStorage.removeItem('e2e_view');
    localStorage.removeItem('e2e_shipments');
    localStorage.removeItem('e2e_driver_trip');
    localStorage.removeItem('e2e_driver_trips_history');
    localStorage.removeItem('e2e_notifications');
    setShipments(INITIAL_SHIPMENTS);
    setDriverTrip(INITIAL_DRIVER_TRIP);
    setDriverTripsHistory(INITIAL_DRIVER_TRIPS_HISTORY);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveShipmentId('REQ-1003');
    setPickupFormStep(1);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  // Dynamically compute available drivers matching driver's deployed truck in real time
  const dynamicAvailableDrivers = INITIAL_AVAILABLE_DRIVERS.map(driver => {
    if (driver.id === 'd1' || driver.name === 'Ramesh Varma') {
      return {
        ...driver,
        route: `${driverTrip.origin} → ${driverTrip.destination}`,
        vehicleType: driverTrip.vehicleType,
        availableCapacity: driverTrip.availableCapacity,
        totalCapacity: driverTrip.totalCapacity,
        occupiedCapacity: driverTrip.occupiedCapacity,
        plannedDeparture: `${driverTrip.departureDate} at ${driverTrip.departureTime || '10:15 AM'}`,
        isAvailable: Boolean(driverTrip.isAvailable),
        loadingStatus: driverTrip.loadingStatus
      };
    }
    return driver;
  });

  const currentDriverId = currentUser?.id || 'd1';
  const currentDriverName = currentUser?.name || 'Ramesh Varma';

  // Dynamic Driver Analytics (computed from trips history + current active/delivered shipments)
  const driverShipments = shipments.filter(s => 
    (s.driverId === currentDriverId || s.driverName === currentDriverName) &&
    ['Accepted', 'In Transit', 'Heading to Pickup', 'Picked Up', 'Delivered'].includes(s.status)
  );

  const historyRevenue = driverTripsHistory.reduce((sum, t) => sum + (Number(t.revenue) || 0), 0);
  const activeShipmentsRevenue = driverShipments.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const driverTotalRevenue = historyRevenue + activeShipmentsRevenue;

  const historyEmptyKm = driverTripsHistory.reduce((sum, t) => sum + (Number(t.emptyKmSaved) || 0), 0);
  const activeShipmentsEmptyKm = driverShipments.reduce((sum, s) => sum + (Number(s.emptyKmAvoided) || 0), 0);
  const driverTotalEmptyKm = historyEmptyKm + activeShipmentsEmptyKm;

  const historyCo2 = driverTripsHistory.reduce((sum, t) => sum + (Number(t.co2SavedKg) || 0), 0);
  const activeShipmentsCo2 = driverShipments.reduce((sum, s) => sum + (Number(s.co2SavedKg) || 0), 0);
  const driverTotalCo2Saved = Math.round(historyCo2 + activeShipmentsCo2);

  const driverTotalTripsCount = driverTripsHistory.length + driverShipments.filter(s => s.status === 'Delivered').length;

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      currentView,
      setCurrentView,
      driverTrip,
      setDriverTrip,
      driverTripsHistory,
      setDriverTripsHistory,
      repeatRouteAsActiveTrip,
      driverTotalRevenue,
      driverTotalEmptyKm,
      driverTotalCo2Saved,
      driverTotalTripsCount,
      driverShipments,
      shipments,
      setShipments,
      activeShipmentId,
      setActiveShipmentId,
      activeShipment,
      notifications,
      setNotifications,
      pickupFormStep,
      setPickupFormStep,
      pickupFormData,
      setPickupFormData,
      availableDrivers: dynamicAvailableDrivers,
      loginCustomerDemo,
      loginDriverDemo,
      logout,
      acceptShipmentRequest,
      rejectShipmentRequest,
      updateDeliveryStatus,
      submitPickupRequest,
      uploadDocument,
      updateDocumentVerificationStatus,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

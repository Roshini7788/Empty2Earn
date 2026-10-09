import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

// Default initial state for realistic demo workflow
const INITIAL_DRIVER_TRIP = {
  id: 'trip-101',
  driverId: 'd1',
  driverName: 'Ramesh Varma',
  origin: 'Bhimavaram',
  originState: 'AP',
  destination: 'Vijayawada',
  destinationState: 'AP',
  distanceKm: 120,
  departureDate: '2026-10-10',
  departureTime: '08:00 AM',
  returnDate: '2026-10-10',
  returnTime: '06:00 PM',
  vehicleType: 'Truck • Eicher 19ft',
  totalCapacity: 18, // m³
  occupiedCapacity: 8, // m³
  availableCapacity: 10, // m³
  maxWeightKg: 500,
  ratePerKm: 12,
  ratePerKg: 5,
  isAvailable: true,
  isCreated: true,
  loadingStatus: 'Partially Loaded' // 'Empty' | 'Partially Loaded' | 'Full'
};

const INITIAL_SHIPMENTS = [
  {
    id: 'REQ-1003',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    pickupLocation: 'Bhimavaram, AP',
    deliveryDestination: 'Vijayawada, AP',
    pickupDate: '2026-10-10',
    pickupTimeWindow: '10:00 AM - 12:00 PM',
    packageType: 'Electronics & Spare Parts',
    weight: 120, // kg
    dimensions: { length: 120, width: 80, height: 100 },
    requiredCapacity: 6, // m³
    specialHandling: ['Fragile'],
    description: 'Pallet of boxed electronics components',
    status: 'In Transit', // 'Requested' | 'Matched' | 'Accepted' | 'Heading to Pickup' | 'Picked Up' | 'In Transit' | 'Delivered'
    deliveryOtp: '4829', // 4-digit customer verification OTP for secure handover
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
    requestedAt: '10:00 AM',
    matchedAt: '10:15 AM',
    acceptedAt: '10:30 AM',
    headingToPickupAt: '11:00 AM',
    pickedUpAt: '11:45 AM',
    inTransitAt: '01:30 PM',
    deliveredAt: '',
    estimatedArrival: 'Tomorrow 2:00 PM',
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
    pickupDate: '2026-10-08',
    pickupTimeWindow: '01:00 PM - 03:00 PM',
    packageType: 'Machinery Components',
    weight: 250,
    requiredCapacity: 8,
    status: 'Delivered',
    deliveryOtp: '7193',
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    vehicleType: 'Truck • Eicher (18m³)',
    price: 3200,
    requestedAt: '08:00 AM',
    deliveredAt: '04:15 PM',
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
    pickupDate: '2026-10-05',
    pickupTimeWindow: '09:00 AM - 11:00 AM',
    packageType: 'Retail Goods',
    weight: 95,
    requiredCapacity: 4,
    status: 'Delivered',
    deliveryOtp: '3341',
    driverId: 'd1',
    driverName: 'Ramesh Varma',
    vehicleType: 'Truck • Eicher (18m³)',
    price: 1850,
    requestedAt: '09:00 AM',
    deliveredAt: '01:30 PM',
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
    departureDate: '2026-10-09',
    arrivalDate: '2026-10-09',
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
    departureDate: '2026-10-07',
    arrivalDate: '2026-10-07',
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
    departureDate: '2026-10-04',
    arrivalDate: '2026-10-04',
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
    departureDate: '2026-10-01',
    arrivalDate: '2026-10-01',
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
    departureDate: '2026-09-28',
    arrivalDate: '2026-09-28',
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
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('landing');
  const [dbConnected, setDbConnected] = useState(false);

  const [driverTrip, setDriverTrip] = useState(() => {
    const saved = localStorage.getItem('e2e_driver_trip');
    return saved ? JSON.parse(saved) : INITIAL_DRIVER_TRIP;
  });

  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('e2e_shipments');
    if (!saved) return INITIAL_SHIPMENTS;
    try {
      return JSON.parse(saved);
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
    pickupDate: '2026-10-10',
    pickupTimeWindow: '10:00 AM - 12:00 PM',
    packageType: 'Electronics',
    weight: '50',
    length: '30',
    width: '20',
    height: '15',
    specialHandling: ['Fragile'],
    description: 'High value sample electronics kit for rapid delivery',
    selectedDriver: null,
    documents: {
      identityDoc: null,
      vehicleRC: null,
      ownershipProof: null
    },
    documentStatus: 'DOCUMENTS_REQUIRED'
  });

  // 1. Initial Load from Backend & Database Verification
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        const health = await api.checkHealth().catch(() => null);
        if (health && isMounted) {
          setDbConnected(health.database?.includes('Connected') || true);
        }

        const [tripsData, shipmentsData, historyData, notifsData] = await Promise.allSettled([
          api.fetchTrips(),
          api.fetchShipments(),
          api.fetchTripHistory(),
          api.fetchNotifications()
        ]);

        if (!isMounted) return;

        if (tripsData.status === 'fulfilled' && Array.isArray(tripsData.value) && tripsData.value.length) {
          const userObj = currentUser || JSON.parse(sessionStorage.getItem('e2e_user') || localStorage.getItem('e2e_user') || 'null');
          const myId = userObj?.id;
          const myName = userObj?.name;
          const active = tripsData.value.find(t => (myId && t.driverId === myId) || (myName && t.driverName === myName))
            || tripsData.value.find(t => t.driverId === 'd1')
            || tripsData.value[0];
          if (active) setDriverTrip(active);
        }

        if (shipmentsData.status === 'fulfilled' && Array.isArray(shipmentsData.value) && shipmentsData.value.length) {
          setShipments(shipmentsData.value);
        }

        if (historyData.status === 'fulfilled' && Array.isArray(historyData.value) && historyData.value.length) {
          setDriverTripsHistory(historyData.value);
        }

        if (notifsData.status === 'fulfilled' && Array.isArray(notifsData.value) && notifsData.value.length) {
          setNotifications(notifsData.value);
        }
      } catch (err) {
        console.warn('[Empty2Earn] Backend initial load:', err.message);
      }
    }

    loadBackendData();
    return () => { isMounted = false; };
  }, []);

  // 2. Sync state to localStorage & BroadcastChannel for instant cross-tab updates
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('e2e_user', JSON.stringify(currentUser));
      localStorage.setItem('e2e_user_backup', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('e2e_user');
      localStorage.removeItem('e2e_token');
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
  }, [notifications]);

  // Real-time cross-tab synchronization listener
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
      };
    } catch {}

    return () => {
      if (bc) bc.close();
    };
  }, []);

  // 3. User Authentication Methods with Backend Persistence
  const loginUser = async (email, password, role = 'customer') => {
    try {
      const res = await api.login(email, password, role);
      if (res?.user) {
        setCurrentUser(res.user);
        if (role === 'driver') {
          api.fetchTrips().then(trips => {
            if (Array.isArray(trips) && trips.length) {
              const myTrip = trips.find(t => t.driverId === res.user.id || t.driverName === res.user.name);
              if (myTrip) {
                setDriverTrip(myTrip);
              } else {
                setDriverTrip({
                  id: `trip-${Date.now()}`,
                  driverId: res.user.id,
                  driverName: res.user.name,
                  phone: res.user.phone || '+91 98480 12345',
                  avatar: res.user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  origin: '',
                  destination: '',
                  distanceKm: 120,
                  departureDate: new Date().toISOString().split('T')[0],
                  departureTime: '08:00 AM',
                  returnDate: new Date().toISOString().split('T')[0],
                  returnTime: '06:00 PM',
                  vehicleType: res.user.vehicleType || 'Truck • Eicher 19ft (18m³)',
                  totalCapacity: 18,
                  availableCapacity: 18,
                  occupiedCapacity: 0,
                  maxWeightKg: 500,
                  ratePerKm: 12,
                  ratePerKg: 5,
                  isAvailable: true,
                  isCreated: false,
                  loadingStatus: 'Empty'
                });
              }
            }
          }).catch(() => {});
        }
        setCurrentView(role === 'driver' ? 'driver-dashboard' : 'customer-dashboard');
        return res.user;
      }
    } catch (err) {
      console.warn('API login notice:', err.message);
    }

    // Client-side fallback
    const safeName = email.trim().split('@')[0]?.replace(/[._-]/g, ' ') || 'User';
    const fallbackUser = {
      id: role === 'driver' ? 'd1' : 'c1',
      name: safeName.charAt(0).toUpperCase() + safeName.slice(1),
      email: email.trim(),
      role,
      avatar: role === 'driver' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(fallbackUser);
    setCurrentView(role === 'driver' ? 'driver-dashboard' : 'customer-dashboard');
    return fallbackUser;
  };

  const loginCustomerDemo = () => {
    loginUser('customer@empty2earn.in', 'demo123', 'customer');
  };

  const loginDriverDemo = () => {
    loginUser('driver@empty2earn.in', 'demo123', 'driver');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('e2e_token');
    sessionStorage.removeItem('e2e_user');
    setCurrentView('landing');
  };

  // 4. Carrier Return Trip Management with Backend Sync
  const updateDriverTrip = async (updatedTripData) => {
    setDriverTrip(updatedTripData);
    try {
      await api.saveTrip(updatedTripData);
    } catch (err) {
      console.warn('Backend save trip notice:', err.message);
    }
  };

  const toggleDriverAvailability = async () => {
    const newStatus = !driverTrip?.isAvailable;
    setDriverTrip(prev => ({ ...prev, isAvailable: newStatus }));
    try {
      await api.toggleTripAvailability(driverTrip?.driverId || 'd1');
    } catch (err) {
      console.warn('Backend toggle availability notice:', err.message);
    }
  };

  // 5. Booking Actions with Backend Persistence
  const acceptShipmentRequest = async (shipmentId) => {
    const targetShipment = shipments.find(s => s.id === shipmentId);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return {
          ...s,
          status: 'Accepted',
          acceptedAt: nowStr
        };
      }
      return s;
    }));

    // Dynamically adjust driver vehicle capacity for active haul
    if (targetShipment?.requiredCapacity) {
      setDriverTrip(prev => {
        const addedOccupied = Math.min(prev.totalCapacity, prev.occupiedCapacity + (targetShipment.requiredCapacity || 5));
        const freeCap = Math.max(0, prev.totalCapacity - addedOccupied);
        const updated = {
          ...prev,
          occupiedCapacity: addedOccupied,
          availableCapacity: freeCap,
          loadingStatus: freeCap === 0 ? 'Full' : 'Partially Loaded'
        };
        api.saveTrip(updated).catch(() => {});
        return updated;
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

    // Backend call
    try {
      await api.acceptShipment(shipmentId);
    } catch (err) {
      console.warn('Backend accept shipment notice:', err.message);
    }
  };

  const rejectShipmentRequest = async (shipmentId) => {
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

    try {
      await api.rejectShipment(shipmentId);
    } catch (err) {
      console.warn('Backend reject shipment notice:', err.message);
    }
  };

  const updateDeliveryStatus = async (shipmentId, newStatus) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        return { 
          ...s, 
          status: newStatus,
          ...(newStatus === 'Requested' && !s.requestedAt ? { requestedAt: nowStr } : {}),
          ...(newStatus === 'Matched' ? { matchedAt: nowStr } : {}),
          ...(newStatus === 'Accepted' ? { acceptedAt: nowStr } : {}),
          ...(newStatus === 'Heading to Pickup' ? { headingToPickupAt: nowStr } : {}),
          ...(newStatus === 'Picked Up' ? { pickedUpAt: nowStr } : {}),
          ...(newStatus === 'In Transit' ? { inTransitAt: nowStr } : {}),
          ...(newStatus === 'Delivered' ? { deliveredAt: nowStr } : {})
        };
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

    try {
      await api.updateShipmentStatus(shipmentId, newStatus);
    } catch (err) {
      console.warn('Backend update status notice:', err.message);
    }
  };

  const verifyDeliveryOtp = async (shipmentId, enteredOtp) => {
    const targetShipment = shipments.find(s => s.id === shipmentId);
    const expectedOtp = (targetShipment?.deliveryOtp || '4829').trim();

    if (enteredOtp && enteredOtp.trim() === expectedOtp) {
      updateDeliveryStatus(shipmentId, 'Delivered');

      // Sync with backend OTP verification
      try {
        await api.verifyDeliveryOtp(shipmentId, enteredOtp);
      } catch (err) {
        console.warn('Backend OTP verification notice:', err.message);
      }

      return { success: true };
    }
    return { success: false, expectedOtp };
  };

  // Submit pickup form to create shipment with Backend Persistence
  const submitPickupRequest = async () => {
    const newId = `REQ-${1000 + shipments.length + 1}`;
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newShipment = {
      id: newId,
      customerId: currentUser?.id || 'c1',
      customerName: currentUser?.name || 'Priya Sharma',
      pickupLocation: pickupFormData.pickupLocation,
      deliveryDestination: pickupFormData.deliveryDestination,
      pickupDate: pickupFormData.pickupDate,
      pickupTimeWindow: pickupFormData.pickupTimeWindow,
      packageType: pickupFormData.packageType,
      weight: parseFloat(pickupFormData.weight) || 50,
      dimensions: {
        length: parseFloat(pickupFormData.length) || 30,
        width: parseFloat(pickupFormData.width) || 20,
        height: parseFloat(pickupFormData.height) || 15
      },
      requiredCapacity: 5,
      specialHandling: pickupFormData.specialHandling,
      description: pickupFormData.description,
      status: 'Requested',
      deliveryOtp: generatedOtp,
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

    setPickupFormStep(1);

    // Backend persistent call
    try {
      await api.createShipment(newShipment);
    } catch (err) {
      console.warn('Backend create shipment notice:', err.message);
    }

    return newId;
  };

  // High-Value Shipment Document Verification handlers
  const uploadDocument = (docKey, file) => {
    if (!file) return;

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
    const newActive = {
      ...driverTrip,
      origin: trip.origin.split(',')[0],
      destination: trip.destination.split(',')[0],
      availableCapacity: driverTrip.totalCapacity,
      occupiedCapacity: 0,
      loadingStatus: 'Empty',
      isAvailable: true
    };
    setDriverTrip(newActive);
    api.saveTrip(newActive).catch(() => {});
    setCurrentView('driver-dashboard');
  };

  const resetDemoData = () => {
    localStorage.removeItem('e2e_user');
    localStorage.removeItem('e2e_token');
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

  // Dynamic Driver Analytics computed from trips history + current active/delivered shipments
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
      dbConnected,
      driverTrip,
      setDriverTrip: updateDriverTrip,
      toggleDriverAvailability,
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
      loginUser,
      loginCustomerDemo,
      loginDriverDemo,
      logout,
      acceptShipmentRequest,
      rejectShipmentRequest,
      updateDeliveryStatus,
      verifyDeliveryOtp,
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

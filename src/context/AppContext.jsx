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
    customerName: 'Sarah Johnson',
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
    driverName: 'Mike Davis',
    driverVerified: true,
    driverRating: 4.8,
    driverDeliveries: 124,
    vehicleType: 'Truck (18m³)',
    driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    matchScore: 92,
    extraDistanceKm: 12,
    price: 180,
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
    customerName: 'Sarah Johnson',
    pickupLocation: 'Chicago, IL',
    deliveryDestination: 'Detroit, MI',
    pickupDate: '2025-04-24',
    pickupTimeWindow: '01:00 PM - 03:00 PM',
    packageType: 'Machinery Components',
    weight: 250,
    requiredCapacity: 8,
    status: 'Delivered',
    driverId: 'd2',
    driverName: 'Michael Carter',
    vehicleType: 'Truck (20m³)',
    price: 210,
    requestedAt: 'Apr 24, 2025',
    co2SavedKg: 24.2,
    fuelSavedLiters: 9.5,
    emptyKmAvoided: 58
  },
  {
    id: 'REQ-1001',
    customerId: 'c1',
    customerName: 'Sarah Johnson',
    pickupLocation: 'San Francisco, CA',
    deliveryDestination: 'Los Angeles, CA',
    pickupDate: '2025-04-22',
    pickupTimeWindow: '09:00 AM - 11:00 AM',
    packageType: 'Retail Goods',
    weight: 95,
    requiredCapacity: 4,
    status: 'Delivered',
    driverId: 'd3',
    driverName: 'Robert Wilson',
    vehicleType: 'Van (10m³)',
    price: 160,
    requestedAt: 'Apr 22, 2025',
    co2SavedKg: 15.0,
    fuelSavedLiters: 5.8,
    emptyKmAvoided: 35
  }
];

const INITIAL_AVAILABLE_DRIVERS = [
  {
    id: 'd1',
    name: 'Mike Davis',
    verified: true,
    rating: 4.8,
    completedDeliveries: 124,
    vehicleType: 'Truck • 18m³ capacity',
    occupiedCapacity: 8,
    availableCapacity: 10,
    route: 'Bhimavaram → Vijayawada (via NH16)',
    plannedDeparture: '10:15 AM',
    matchScore: 92,
    extraDistanceKm: 12,
    estimatedPrice: 180,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'd2',
    name: 'Emily Davis',
    verified: true,
    rating: 4.9,
    completedDeliveries: 96,
    vehicleType: 'Truck • 20m³ capacity',
    occupiedCapacity: 5,
    availableCapacity: 15,
    route: 'Bhimavaram → Vijayawada (via State Hwy 43)',
    plannedDeparture: '10:30 AM',
    matchScore: 88,
    extraDistanceKm: 18,
    estimatedPrice: 220,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 876-5432'
  },
  {
    id: 'd3',
    name: 'Robert Wilson',
    verified: true,
    rating: 4.6,
    completedDeliveries: 78,
    vehicleType: 'Van • 10m³ capacity',
    occupiedCapacity: 4,
    availableCapacity: 6,
    route: 'Bhimavaram → Vijayawada (via Direct Express)',
    plannedDeparture: '10:45 AM',
    matchScore: 81,
    extraDistanceKm: 25,
    estimatedPrice: 160,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Shipment REQ-1003 Status Updated',
    message: 'Driver Mike Davis updated status to "In Transit".',
    time: '10 min ago',
    type: 'info',
    read: false
  },
  {
    id: 'n2',
    title: 'Driver Accepted Request',
    message: 'Mike Davis accepted your pickup request for REQ-1003.',
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
    const saved = localStorage.getItem('e2e_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Always start at landing page when reloaded
  const [currentView, setCurrentView] = useState('landing');

  const [driverTrip, setDriverTrip] = useState(() => {
    const saved = localStorage.getItem('e2e_driver_trip');
    return saved ? JSON.parse(saved) : INITIAL_DRIVER_TRIP;
  });

  const [shipments, setShipments] = useState(() => {
    const saved = localStorage.getItem('e2e_shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [activeShipmentId, setActiveShipmentId] = useState('REQ-1003');

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('e2e_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
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

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('e2e_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('e2e_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('e2e_driver_trip', JSON.stringify(driverTrip));
  }, [driverTrip]);

  useEffect(() => {
    localStorage.setItem('e2e_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth helper methods
  const loginCustomerDemo = () => {
    const user = {
      id: 'c1',
      name: 'Sarah Johnson',
      email: 'customer@empty2earn.demo',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    };
    setCurrentUser(user);
    setCurrentView('customer-dashboard');
  };

  const loginDriverDemo = () => {
    const user = {
      id: 'd1',
      name: 'Mike Davis',
      email: 'driver@empty2earn.demo',
      role: 'driver',
      rating: 4.8,
      deliveries: 124,
      vehicle: 'Truck (18m³)',
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

    // Add notification
    const newNotif = {
      id: `n-${Date.now()}`,
      title: `Driver Accepted Request ${shipmentId}`,
      message: `Mike Davis accepted the shipment from ${shipments.find(s => s.id === shipmentId)?.pickupLocation} to ${shipments.find(s => s.id === shipmentId)?.deliveryDestination}.`,
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
      customerName: currentUser?.name || 'Sarah Johnson',
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
      driverName: pickupFormData.selectedDriver?.name || 'Mike Davis',
      driverVerified: true,
      driverRating: pickupFormData.selectedDriver?.rating || 4.8,
      driverDeliveries: pickupFormData.selectedDriver?.completedDeliveries || 124,
      vehicleType: pickupFormData.selectedDriver?.vehicleType || 'Truck (18m³)',
      driverAvatar: pickupFormData.selectedDriver?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      matchScore: pickupFormData.selectedDriver?.matchScore || 92,
      extraDistanceKm: pickupFormData.selectedDriver?.extraDistanceKm || 12,
      price: pickupFormData.selectedDriver?.estimatedPrice || 180,
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

  const resetDemoData = () => {
    localStorage.removeItem('e2e_user');
    localStorage.removeItem('e2e_view');
    localStorage.removeItem('e2e_shipments');
    localStorage.removeItem('e2e_driver_trip');
    localStorage.removeItem('e2e_notifications');
    setShipments(INITIAL_SHIPMENTS);
    setDriverTrip(INITIAL_DRIVER_TRIP);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveShipmentId('REQ-1003');
    setPickupFormStep(1);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      currentView,
      setCurrentView,
      driverTrip,
      setDriverTrip,
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
      availableDrivers: INITIAL_AVAILABLE_DRIVERS,
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

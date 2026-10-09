import mongoose from 'mongoose';

// Initial realistic South India corridors seed data for Empty2Earn
export const SEED_DATA = {
  users: [
    {
      id: 'd1',
      name: 'Ramesh Varma',
      email: 'driver@empty2earn.in',
      role: 'driver',
      phone: '+91 98480 22334',
      company: 'Varma Freight Logistics',
      location: 'Bhimavaram / Vijayawada Corridor, AP',
      vehicleType: 'Truck • Eicher 19ft (18m³)',
      licenseNumber: 'AP-37-2021-0084920',
      upiId: 'ramesh.varma@oksbi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      deliveries: 124
    },
    {
      id: 'd2',
      name: 'Suresh Reddy',
      email: 'suresh.reddy@empty2earn.in',
      role: 'driver',
      phone: '+91 94401 54321',
      company: 'Reddy Highway Express',
      location: 'Bhimavaram / Vijayawada Corridor, AP',
      vehicleType: 'Truck • Tata 20m³ capacity',
      licenseNumber: 'AP-37-2020-0043128',
      upiId: 'suresh.reddy@oksbi',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      deliveries: 96
    },
    {
      id: 'd3',
      name: 'Venkatesh Rao',
      email: 'venkatesh.rao@empty2earn.in',
      role: 'driver',
      phone: '+91 89785 67890',
      company: 'Rao Coastal Logistics',
      location: 'Bhimavaram / Vijayawada Corridor, AP',
      vehicleType: 'Van • Bolero 10m³ capacity',
      licenseNumber: 'AP-37-2022-0091845',
      upiId: 'venkatesh.rao@oksbi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      rating: 4.6,
      deliveries: 78
    },
    {
      id: 'c1',
      name: 'Priya Sharma',
      email: 'customer@empty2earn.in',
      role: 'customer',
      phone: '+91 94401 88992',
      company: 'Sharma Agro Traders',
      location: 'Bhimavaram / Vijayawada Corridor, AP',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      upiId: 'priya.sharma@okaxis'
    }
  ],
  trips: [
    {
      id: 'trip-101',
      driverId: 'd1',
      driverName: 'Ramesh Varma',
      origin: 'Bhimavaram',
      destination: 'Vijayawada',
      distanceKm: 120,
      departureDate: '2026-10-10',
      departureTime: '08:00 AM',
      returnDate: '2026-10-10',
      returnTime: '06:00 PM',
      vehicleType: 'Truck • Eicher 19ft (18m³)',
      totalCapacity: 18,
      occupiedCapacity: 8,
      availableCapacity: 10,
      maxWeightKg: 500,
      ratePerKm: 12,
      ratePerKg: 5,
      isAvailable: true,
      isCreated: true,
      loadingStatus: 'Partially Loaded'
    },
    {
      id: 'trip-102',
      driverId: 'd2',
      driverName: 'Suresh Reddy',
      origin: 'Bhimavaram',
      destination: 'Vijayawada',
      distanceKm: 125,
      departureDate: '2026-10-10',
      departureTime: '10:30 AM',
      returnDate: '2026-10-10',
      returnTime: '07:00 PM',
      vehicleType: 'Truck • Tata 20m³ capacity',
      totalCapacity: 20,
      occupiedCapacity: 5,
      availableCapacity: 15,
      maxWeightKg: 600,
      ratePerKm: 14,
      ratePerKg: 6,
      isAvailable: true,
      isCreated: true,
      loadingStatus: 'Partially Loaded'
    },
    {
      id: 'trip-103',
      driverId: 'd3',
      driverName: 'Venkatesh Rao',
      origin: 'Bhimavaram',
      destination: 'Vijayawada',
      distanceKm: 118,
      departureDate: '2026-10-10',
      departureTime: '01:00 PM',
      returnDate: '2026-10-10',
      returnTime: '08:00 PM',
      vehicleType: 'Van • Bolero 10m³ capacity',
      totalCapacity: 10,
      occupiedCapacity: 4,
      availableCapacity: 6,
      maxWeightKg: 350,
      ratePerKm: 10,
      ratePerKg: 4,
      isAvailable: true,
      isCreated: true,
      loadingStatus: 'Partially Loaded'
    }
  ],
  shipments: [
    {
      id: 'REQ-1003',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      pickupLocation: 'Bhimavaram, AP',
      deliveryDestination: 'Vijayawada, AP',
      pickupDate: '2026-10-10',
      pickupTimeWindow: '10:00 AM - 12:00 PM',
      packageType: 'Electronics & Spare Parts',
      weight: 120,
      dimensions: { length: 120, width: 80, height: 100 },
      requiredCapacity: 6,
      specialHandling: ['Fragile'],
      description: 'Pallet of boxed electronics components',
      status: 'In Transit',
      deliveryOtp: '4829',
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
  ],
  driverTripsHistory: [
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
  ],
  notifications: [
    {
      id: 'n1',
      userId: 'c1',
      title: 'Shipment REQ-1003 Status Updated',
      message: 'Delivery partner Ramesh Varma updated status to "In Transit".',
      time: '10 min ago',
      type: 'info',
      read: false
    },
    {
      id: 'n2',
      userId: 'c1',
      title: 'Driver Accepted Request',
      message: 'Ramesh Varma accepted your pickup request for REQ-1003.',
      time: '45 min ago',
      type: 'success',
      read: true
    },
    {
      id: 'n3',
      userId: 'c1',
      title: 'Pickup Request Submitted',
      message: 'Your shipment request REQ-1003 was sent to matching return drivers.',
      time: '2 hours ago',
      type: 'info',
      read: true
    }
  ]
};

// Global in-memory storage fallback with deep copy
export const memoryStore = {
  users: JSON.parse(JSON.stringify(SEED_DATA.users)),
  trips: JSON.parse(JSON.stringify(SEED_DATA.trips)),
  shipments: JSON.parse(JSON.stringify(SEED_DATA.shipments)),
  driverTripsHistory: JSON.parse(JSON.stringify(SEED_DATA.driverTripsHistory)),
  notifications: JSON.parse(JSON.stringify(SEED_DATA.notifications))
};

// Serverless Mongoose connection caching
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    // Graceful offline/demo mode without crashing
    return { isConnected: false, mode: 'memory' };
  }

  if (cached.conn) {
    return { isConnected: true, mode: 'mongodb', conn: cached.conn };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      return m;
    }).catch(err => {
      console.warn('[MongoDB Atlas] Connection failed, falling back to persistent memoryStore:', err.message);
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    if (cached.conn) {
      return { isConnected: true, mode: 'mongodb', conn: cached.conn };
    }
  } catch (e) {
    cached.promise = null;
  }

  return { isConnected: false, mode: 'memory' };
}

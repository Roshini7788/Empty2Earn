import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase, memoryStore, SEED_DATA } from './db.js';
import { User, Trip, Shipment, TripHistory, Notification } from './models.js';

const JWT_SECRET = process.env.JWT_SECRET || 'empty2earn_super_secure_jwt_secret_key_2026';

// Helper to parse JSON body from request
async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (req.body && typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

// Auto-seed MongoDB Atlas if connected and empty
let dbSeeded = false;
async function ensureDbSeeded() {
  if (dbSeeded) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB Atlas] Empty database detected. Seeding initial Empty2Earn records...');
      await User.insertMany(SEED_DATA.users);
      await Trip.insertMany(SEED_DATA.trips);
      await Shipment.insertMany(SEED_DATA.shipments);
      await TripHistory.insertMany(SEED_DATA.driverTripsHistory);
      await Notification.insertMany(SEED_DATA.notifications);
      console.log('[MongoDB Atlas] Seed completed successfully!');
    }
    dbSeeded = true;
  } catch (err) {
    console.warn('[MongoDB Atlas] Seed check failed or skipped:', err.message);
  }
}

export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // 2. Connect to database
  const dbStatus = await connectToDatabase();
  if (dbStatus.isConnected) {
    await ensureDbSeeded();
  }

  // 3. Parse URL and Route
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const parsedUrl = new URL(req.url, `${protocol}://${host}`);
  let pathname = parsedUrl.pathname;

  // Normalize /api prefix
  if (pathname.startsWith('/api')) {
    pathname = pathname.slice(4) || '/';
  }

  // Helper response sender
  const json = (data, status = 200) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  const body = req.method !== 'GET' ? await parseBody(req) : {};

  // Extract Auth Token
  const authHeader = req.headers.authorization || '';
  let authUser = null;
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      authUser = jwt.verify(token, JWT_SECRET);
    } catch {}
  }

  try {
    // -------------------------------------------------------------
    // ROUTE: GET /health
    // -------------------------------------------------------------
    if (pathname === '/health' && req.method === 'GET') {
      return json({
        status: 'ok',
        database: dbStatus.isConnected ? 'MongoDB Atlas (Connected)' : 'In-Memory Store (Active)',
        mode: dbStatus.mode,
        timestamp: new Date().toISOString()
      });
    }

    // -------------------------------------------------------------
    // ROUTE: POST /auth/register
    // -------------------------------------------------------------
    if (pathname === '/auth/register' && req.method === 'POST') {
      const { name, email, password, role, phone, company, location, vehicleType, licenseNumber, upiId } = body;
      if (!name || !email) {
        return json({ error: 'Name and email are required.' }, 400);
      }

      const existingInDb = dbStatus.isConnected ? await User.findOne({ email: email.toLowerCase() }) : null;
      const existingInMem = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingInDb || existingInMem) {
        return json({ error: 'An account with this email already exists.' }, 400);
      }

      const id = `${role === 'driver' ? 'd' : 'c'}-${Date.now()}`;
      const passwordHash = password ? await bcrypt.hash(password, 10) : '';

      const newUser = {
        id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role: role || 'customer',
        phone: phone || '',
        company: company || '',
        location: location || 'Bhimavaram / Vijayawada Corridor, AP',
        vehicleType: vehicleType || (role === 'driver' ? 'Truck • Eicher 19ft (18m³)' : ''),
        licenseNumber: licenseNumber || '',
        upiId: upiId || '',
        avatar: role === 'driver' 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        deliveries: 0,
        createdAt: new Date()
      };

      if (dbStatus.isConnected) {
        await User.create(newUser);
      }
      memoryStore.users.unshift(newUser);

      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
      return json({ user: newUser, token });
    }

    // -------------------------------------------------------------
    // ROUTE: POST /auth/login
    // -------------------------------------------------------------
    if (pathname === '/auth/login' && req.method === 'POST') {
      const { email, password, role } = body;
      if (!email) {
        return json({ error: 'Email or phone number is required.' }, 400);
      }

      const cleanEmail = email.trim().toLowerCase();
      let user = null;

      if (dbStatus.isConnected) {
        user = await User.findOne({ email: cleanEmail });
      }
      if (!user) {
        user = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
      }

      // If user doesn't exist, create demo account dynamically so user is never blocked
      if (!user) {
        const safeName = cleanEmail.split('@')[0]?.replace(/[._-]/g, ' ') || 'User';
        user = {
          id: `${role === 'driver' ? 'd' : 'c'}-${Date.now()}`,
          name: safeName.charAt(0).toUpperCase() + safeName.slice(1),
          email: cleanEmail,
          role: role || 'customer',
          phone: '+91 98480 12345',
          company: role === 'driver' ? 'Varma Freight Logistics' : 'Sharma Agro Traders',
          location: 'Bhimavaram / Vijayawada Corridor, AP',
          vehicleType: role === 'driver' ? 'Truck • Eicher 19ft (18m³)' : '',
          licenseNumber: role === 'driver' ? 'AP-37-2021-0084920' : '',
          upiId: `${cleanEmail.split('@')[0]}@oksbi`,
          avatar: role === 'driver'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          rating: 4.8,
          deliveries: 124,
          createdAt: new Date()
        };

        if (password) {
          user.passwordHash = await bcrypt.hash(password, 10);
        }

        if (dbStatus.isConnected) {
          try { await User.create(user); } catch {}
        }
        memoryStore.users.push(user);
      } else if (password && user.passwordHash) {
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
          return json({ error: 'Invalid password credentials entered.' }, 401);
        }
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return json({ user, token });
    }

    // -------------------------------------------------------------
    // ROUTE: GET /auth/me
    // -------------------------------------------------------------
    if (pathname === '/auth/me' && req.method === 'GET') {
      if (!authUser) {
        return json({ error: 'Unauthorized. No active session token.' }, 401);
      }
      let user = null;
      if (dbStatus.isConnected) {
        user = await User.findOne({ id: authUser.id });
      }
      if (!user) {
        user = memoryStore.users.find(u => u.id === authUser.id);
      }
      return json({ user: user || authUser });
    }

    // -------------------------------------------------------------
    // ROUTE: GET /trips (Active return trips)
    // -------------------------------------------------------------
    if (pathname === '/trips' && req.method === 'GET') {
      let trips = [];
      if (dbStatus.isConnected) {
        trips = await Trip.find({ isAvailable: true }).sort({ createdAt: -1 });
      }
      if (!trips.length) {
        trips = memoryStore.trips.filter(t => t.isAvailable);
      }
      return json(trips);
    }

    // -------------------------------------------------------------
    // ROUTE: GET /trips/my-trip
    // -------------------------------------------------------------
    if (pathname === '/trips/my-trip' && req.method === 'GET') {
      const driverId = authUser?.id || parsedUrl.searchParams.get('driverId') || 'd1';
      let trip = null;
      if (dbStatus.isConnected) {
        trip = await Trip.findOne({ driverId });
      }
      if (!trip) {
        trip = memoryStore.trips.find(t => t.driverId === driverId) || memoryStore.trips[0];
      }
      return json(trip);
    }

    // -------------------------------------------------------------
    // ROUTE: POST /trips (Create or Update active trip)
    // -------------------------------------------------------------
    if (pathname === '/trips' && req.method === 'POST') {
      const tripData = body;
      const driverId = authUser?.id || tripData.driverId || 'd1';
      const driverName = authUser?.name || tripData.driverName || 'Ramesh Varma';

      const totalCap = parseInt(tripData.totalCapacity) || 18;
      const availCap = parseInt(tripData.availableCapacity) || 10;
      const occCap = Math.max(0, totalCap - availCap);

      const tripPayload = {
        id: tripData.id || `trip-${Date.now()}`,
        driverId,
        driverName,
        origin: tripData.origin || 'Bhimavaram',
        destination: tripData.destination || 'Vijayawada',
        distanceKm: parseInt(tripData.distanceKm) || 120,
        departureDate: tripData.departureDate || new Date().toISOString().split('T')[0],
        departureTime: tripData.departureTime || '08:00 AM',
        returnDate: tripData.returnDate || new Date().toISOString().split('T')[0],
        returnTime: tripData.returnTime || '06:00 PM',
        vehicleType: tripData.vehicleType || 'Truck • Eicher 19ft',
        totalCapacity: totalCap,
        availableCapacity: availCap,
        occupiedCapacity: occCap,
        maxWeightKg: parseInt(tripData.maxWeightKg) || 500,
        ratePerKm: parseInt(tripData.ratePerKm) || 12,
        ratePerKg: parseInt(tripData.ratePerKg) || 5,
        isAvailable: tripData.isAvailable !== false,
        isCreated: true,
        loadingStatus: occCap === 0 ? 'Empty' : (availCap === 0 ? 'Full' : 'Partially Loaded'),
        updatedAt: new Date()
      };

      if (dbStatus.isConnected) {
        await Trip.findOneAndUpdate({ driverId }, tripPayload, { upsert: true, new: true });
      }

      const existingIndex = memoryStore.trips.findIndex(t => t.driverId === driverId);
      if (existingIndex >= 0) {
        memoryStore.trips[existingIndex] = { ...memoryStore.trips[existingIndex], ...tripPayload };
      } else {
        memoryStore.trips.push(tripPayload);
      }

      return json(tripPayload);
    }

    // -------------------------------------------------------------
    // ROUTE: PUT /trips/toggle-availability
    // -------------------------------------------------------------
    if (pathname === '/trips/toggle-availability' && req.method === 'PUT') {
      const driverId = authUser?.id || body.driverId || 'd1';
      let trip = memoryStore.trips.find(t => t.driverId === driverId) || memoryStore.trips[0];
      const newStatus = !trip.isAvailable;
      trip.isAvailable = newStatus;

      if (dbStatus.isConnected) {
        await Trip.findOneAndUpdate({ driverId }, { isAvailable: newStatus });
      }

      return json({ isAvailable: newStatus });
    }

    // -------------------------------------------------------------
    // ROUTE: GET /trips/history (Completed Return Trips)
    // -------------------------------------------------------------
    if (pathname === '/trips/history' && req.method === 'GET') {
      let history = [];
      if (dbStatus.isConnected) {
        history = await TripHistory.find().sort({ departureDate: -1 });
      }
      if (!history.length) {
        history = memoryStore.driverTripsHistory;
      }
      return json(history);
    }

    // -------------------------------------------------------------
    // ROUTE: GET /matching/drivers (Rule-based Corridor Matching)
    // -------------------------------------------------------------
    if (pathname === '/matching/drivers' && req.method === 'GET') {
      const pickup = (parsedUrl.searchParams.get('pickup') || parsedUrl.searchParams.get('from') || '').toLowerCase();
      const destination = (parsedUrl.searchParams.get('destination') || parsedUrl.searchParams.get('to') || '').toLowerCase();
      const weight = parseFloat(parsedUrl.searchParams.get('weight')) || 50;
      const reqCapacity = parseFloat(parsedUrl.searchParams.get('capacity')) || 5;

      let allTrips = [];
      if (dbStatus.isConnected) {
        allTrips = await Trip.find({ isAvailable: true });
      }
      if (!allTrips.length) {
        allTrips = memoryStore.trips;
      }

      // Base driver list enhanced with live trips from database
      const drivers = [
        {
          id: 'd1',
          name: 'Ramesh Varma',
          verified: true,
          rating: 4.8,
          completedDeliveries: 124,
          vehicleType: 'Truck • Eicher 18m³ capacity',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          phone: '+91 98480 12345',
          origin: allTrips[0]?.origin || 'Bhimavaram',
          destination: allTrips[0]?.destination || 'Vijayawada',
          availableCapacity: allTrips[0]?.availableCapacity || 10,
          totalCapacity: allTrips[0]?.totalCapacity || 18,
          ratePerKm: allTrips[0]?.ratePerKm || 12,
          ratePerKg: allTrips[0]?.ratePerKg || 5,
          distanceKm: allTrips[0]?.distanceKm || 120
        },
        {
          id: 'd2',
          name: 'Suresh Reddy',
          verified: true,
          rating: 4.9,
          completedDeliveries: 96,
          vehicleType: 'Truck • Tata 20m³ capacity',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          phone: '+91 94401 54321',
          origin: 'Bhimavaram',
          destination: 'Vijayawada',
          availableCapacity: 15,
          totalCapacity: 20,
          ratePerKm: 14,
          ratePerKg: 6,
          distanceKm: 125
        },
        {
          id: 'd3',
          name: 'Venkatesh Rao',
          verified: true,
          rating: 4.6,
          completedDeliveries: 78,
          vehicleType: 'Van • Bolero 10m³ capacity',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          phone: '+91 89785 67890',
          origin: 'Bhimavaram',
          destination: 'Vijayawada',
          availableCapacity: 6,
          totalCapacity: 10,
          ratePerKm: 10,
          ratePerKg: 4,
          distanceKm: 118
        }
      ];

      // Calculate rule-based match score and price formula
      const matched = drivers.map((driver, index) => {
        let score = 80;
        const driverOrigin = driver.origin.toLowerCase();
        const driverDest = driver.destination.toLowerCase();

        if (pickup.includes(driverOrigin) || driverOrigin.includes(pickup)) score += 10;
        if (destination.includes(driverDest) || driverDest.includes(destination)) score += 8;
        if (driver.availableCapacity >= reqCapacity) score += 2;

        const extraDist = index === 0 ? 12 : (index === 1 ? 18 : 25);
        const calculatedPrice = (driver.distanceKm * driver.ratePerKm) + Math.round(weight * driver.ratePerKg);

        return {
          id: driver.id,
          name: driver.name,
          verified: driver.verified,
          rating: driver.rating,
          completedDeliveries: driver.completedDeliveries,
          vehicleType: driver.vehicleType,
          availableCapacity: driver.availableCapacity,
          totalCapacity: driver.totalCapacity,
          route: `${driver.origin} → ${driver.destination} (via NH16)`,
          matchScore: Math.min(98, score),
          extraDistanceKm: extraDist,
          estimatedPrice: Math.max(1450, calculatedPrice),
          avatar: driver.avatar,
          phone: driver.phone
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      return json(matched);
    }

    // -------------------------------------------------------------
    // ROUTE: GET /shipments
    // -------------------------------------------------------------
    if (pathname === '/shipments' && req.method === 'GET') {
      let shipments = [];
      if (dbStatus.isConnected) {
        shipments = await Shipment.find().sort({ createdAt: -1 });
      }
      if (!shipments.length) {
        shipments = memoryStore.shipments;
      }
      return json(shipments);
    }

    // -------------------------------------------------------------
    // ROUTE: POST /shipments (Create Booking Request)
    // -------------------------------------------------------------
    if (pathname === '/shipments' && req.method === 'POST') {
      const data = body;
      const count = dbStatus.isConnected ? await Shipment.countDocuments() : memoryStore.shipments.length;
      const newId = data.id || `REQ-${1000 + count + 1}`;
      const generatedOtp = data.deliveryOtp || Math.floor(1000 + Math.random() * 9000).toString();

      const newShipment = {
        id: newId,
        customerId: authUser?.id || data.customerId || 'c1',
        customerName: authUser?.name || data.customerName || 'Priya Sharma',
        pickupLocation: data.pickupLocation || 'Bhimavaram, AP',
        deliveryDestination: data.deliveryDestination || 'Vijayawada, AP',
        pickupDate: data.pickupDate || '2026-10-10',
        pickupTimeWindow: data.pickupTimeWindow || '10:00 AM - 12:00 PM',
        packageType: data.packageType || 'General Freight',
        weight: parseFloat(data.weight) || 50,
        dimensions: data.dimensions || { length: 30, width: 20, height: 15 },
        requiredCapacity: parseFloat(data.requiredCapacity) || 5,
        specialHandling: data.specialHandling || [],
        description: data.description || 'Verified freight load',
        status: 'Requested',
        deliveryOtp: generatedOtp,
        driverId: data.driverId || 'd1',
        driverName: data.driverName || 'Ramesh Varma',
        driverVerified: true,
        driverRating: 4.8,
        driverDeliveries: 124,
        vehicleType: data.vehicleType || 'Truck • Eicher (18m³)',
        driverAvatar: data.driverAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        matchScore: data.matchScore || 92,
        extraDistanceKm: data.extraDistanceKm || 12,
        price: data.price || 2450,
        requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedArrival: 'Tomorrow 2:00 PM',
        co2SavedKg: 19.4,
        fuelSavedLiters: 7.8,
        emptyKmAvoided: 45,
        createdAt: new Date()
      };

      if (dbStatus.isConnected) {
        await Shipment.create(newShipment);
      }
      memoryStore.shipments.unshift(newShipment);

      // Create notification for carrier
      const notif = {
        id: `n-${Date.now()}`,
        userId: newShipment.driverId,
        title: `New Pickup Request ${newId}`,
        message: `${newShipment.customerName} submitted a shipment request from ${newShipment.pickupLocation} to ${newShipment.deliveryDestination}.`,
        time: 'Just now',
        type: 'info',
        read: false,
        createdAt: new Date()
      };

      if (dbStatus.isConnected) {
        try { await Notification.create(notif); } catch {}
      }
      memoryStore.notifications.unshift(notif);

      return json(newShipment, 201);
    }

    // -------------------------------------------------------------
    // ROUTE: POST /shipments/:id/accept
    // -------------------------------------------------------------
    if (pathname.includes('/accept') && req.method === 'POST') {
      const parts = pathname.split('/');
      const shipmentId = parts[parts.indexOf('accept') - 1];

      let target = null;
      if (dbStatus.isConnected) {
        target = await Shipment.findOne({ id: shipmentId });
      }
      if (!target) {
        target = memoryStore.shipments.find(s => s.id === shipmentId);
      }

      if (!target) {
        return json({ error: 'Shipment not found' }, 404);
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      target.status = 'Accepted';
      target.acceptedAt = nowStr;

      if (dbStatus.isConnected) {
        await Shipment.findOneAndUpdate({ id: shipmentId }, { status: 'Accepted', acceptedAt: nowStr });
      }

      // Deduct driver available capacity dynamically
      const driverId = target.driverId || 'd1';
      let trip = memoryStore.trips.find(t => t.driverId === driverId) || memoryStore.trips[0];
      if (trip) {
        const addedOccupied = Math.min(trip.totalCapacity, trip.occupiedCapacity + (target.requiredCapacity || 5));
        const freeCap = Math.max(0, trip.totalCapacity - addedOccupied);
        trip.occupiedCapacity = addedOccupied;
        trip.availableCapacity = freeCap;
        trip.loadingStatus = freeCap === 0 ? 'Full' : 'Partially Loaded';

        if (dbStatus.isConnected) {
          await Trip.findOneAndUpdate({ driverId }, {
            occupiedCapacity: addedOccupied,
            availableCapacity: freeCap,
            loadingStatus: trip.loadingStatus
          });
        }
      }

      // Create notification for customer
      const notif = {
        id: `n-${Date.now()}`,
        userId: target.customerId,
        title: `Driver Accepted Request ${shipmentId}`,
        message: `${target.driverName} confirmed your booking. Departure is scheduled.`,
        time: 'Just now',
        type: 'success',
        read: false
      };
      if (dbStatus.isConnected) {
        try { await Notification.create(notif); } catch {}
      }
      memoryStore.notifications.unshift(notif);

      return json({ success: true, shipment: target, driverTrip: trip });
    }

    // -------------------------------------------------------------
    // ROUTE: POST /shipments/:id/reject
    // -------------------------------------------------------------
    if (pathname.includes('/reject') && req.method === 'POST') {
      const parts = pathname.split('/');
      const shipmentId = parts[parts.indexOf('reject') - 1];

      if (dbStatus.isConnected) {
        await Shipment.findOneAndUpdate({ id: shipmentId }, { status: 'Rejected' });
      }
      const s = memoryStore.shipments.find(item => item.id === shipmentId);
      if (s) s.status = 'Rejected';

      return json({ success: true, shipmentId, status: 'Rejected' });
    }

    // -------------------------------------------------------------
    // ROUTE: PUT /shipments/:id/status
    // -------------------------------------------------------------
    if (pathname.includes('/status') && req.method === 'PUT') {
      const parts = pathname.split('/');
      const shipmentId = parts[parts.indexOf('status') - 1];
      const newStatus = body.status;

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updateFields = { status: newStatus };
      if (newStatus === 'Matched') updateFields.matchedAt = nowStr;
      if (newStatus === 'Accepted') updateFields.acceptedAt = nowStr;
      if (newStatus === 'Heading to Pickup') updateFields.headingToPickupAt = nowStr;
      if (newStatus === 'Picked Up') updateFields.pickedUpAt = nowStr;
      if (newStatus === 'In Transit') updateFields.inTransitAt = nowStr;
      if (newStatus === 'Delivered') updateFields.deliveredAt = nowStr;

      if (dbStatus.isConnected) {
        await Shipment.findOneAndUpdate({ id: shipmentId }, updateFields);
      }
      const target = memoryStore.shipments.find(s => s.id === shipmentId);
      if (target) {
        Object.assign(target, updateFields);
      }

      return json({ success: true, shipmentId, status: newStatus });
    }

    // -------------------------------------------------------------
    // ROUTE: POST /shipments/:id/verify-otp
    // -------------------------------------------------------------
    if (pathname.includes('/verify-otp') && req.method === 'POST') {
      const parts = pathname.split('/');
      const shipmentId = parts[parts.indexOf('verify-otp') - 1];
      const enteredOtp = (body.enteredOtp || '').trim();

      let target = null;
      if (dbStatus.isConnected) {
        target = await Shipment.findOne({ id: shipmentId });
      }
      if (!target) {
        target = memoryStore.shipments.find(s => s.id === shipmentId);
      }

      if (!target) {
        return json({ error: 'Shipment not found' }, 404);
      }

      const expectedOtp = (target.deliveryOtp || '4829').trim();
      if (enteredOtp !== expectedOtp) {
        return json({ success: false, message: 'Invalid 4-digit Delivery OTP.' }, 400);
      }

      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      target.status = 'Delivered';
      target.deliveredAt = nowStr;

      if (dbStatus.isConnected) {
        await Shipment.findOneAndUpdate({ id: shipmentId }, { status: 'Delivered', deliveredAt: nowStr });
      }

      // Add settled record to TripHistory
      const settledTrip = {
        id: `TRP-${Date.now().toString().slice(-4)}`,
        driverId: target.driverId || 'd1',
        driverName: target.driverName || 'Ramesh Varma',
        origin: target.pickupLocation,
        destination: target.deliveryDestination,
        viaRoute: 'Direct Corridor NH16',
        departureDate: target.pickupDate || new Date().toISOString().split('T')[0],
        arrivalDate: new Date().toISOString().split('T')[0],
        distanceKm: target.extraDistanceKm ? target.extraDistanceKm * 10 : 110,
        emptyKmSaved: target.emptyKmAvoided || 42,
        co2SavedKg: target.co2SavedKg || 18.5,
        fuelSavedLiters: target.fuelSavedLiters || 7.2,
        revenue: target.price || 2450,
        status: 'Completed',
        vehicleType: target.vehicleType || 'Truck • Eicher 19ft (18m³)',
        totalCapacity: 18,
        utilizedCapacity: target.requiredCapacity || 6,
        shipmentsCount: 1,
        rating: 5.0,
        deliveryProof: `OTP ${enteredOtp} Verified Delivery Handover`,
        createdAt: new Date()
      };

      if (dbStatus.isConnected) {
        try { await TripHistory.create(settledTrip); } catch {}
      }
      memoryStore.driverTripsHistory.unshift(settledTrip);

      return json({ success: true, shipment: target, settledTrip });
    }

    // -------------------------------------------------------------
    // ROUTE: GET /notifications
    // -------------------------------------------------------------
    if (pathname === '/notifications' && req.method === 'GET') {
      let notifs = [];
      if (dbStatus.isConnected) {
        notifs = await Notification.find().sort({ createdAt: -1 });
      }
      if (!notifs.length) {
        notifs = memoryStore.notifications;
      }
      return json(notifs);
    }

    // -------------------------------------------------------------
    // ROUTE: PUT /notifications/mark-all-read
    // -------------------------------------------------------------
    if (pathname === '/notifications/mark-all-read' && req.method === 'PUT') {
      if (dbStatus.isConnected) {
        await Notification.updateMany({}, { read: true });
      }
      memoryStore.notifications.forEach(n => { n.read = true; });
      return json({ success: true });
    }

    // -------------------------------------------------------------
    // ROUTE: PUT /users/profile
    // -------------------------------------------------------------
    if (pathname === '/users/profile' && req.method === 'PUT') {
      const updateData = body;
      const userId = authUser?.id || updateData.id || 'd1';

      if (dbStatus.isConnected) {
        await User.findOneAndUpdate({ id: userId }, updateData, { new: true });
      }
      const u = memoryStore.users.find(item => item.id === userId);
      if (u) {
        Object.assign(u, updateData);
      }

      return json({ success: true, user: updateData });
    }

    // Catch-all
    return json({ message: `Empty2Earn API handler: ${req.method} ${pathname} not found` }, 404);

  } catch (err) {
    console.error('[Empty2Earn API Error]:', err);
    return json({ error: 'Internal Server Error', message: err.message }, 500);
  }
}

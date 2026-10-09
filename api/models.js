import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['customer', 'driver', 'admin'], default: 'customer' },
  phone: { type: String },
  company: { type: String },
  location: { type: String },
  vehicleType: { type: String },
  licenseNumber: { type: String },
  upiId: { type: String },
  avatar: { type: String },
  rating: { type: Number, default: 5.0 },
  deliveries: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const TripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  driverId: { type: String, required: true },
  driverName: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  distanceKm: { type: Number, default: 120 },
  departureDate: { type: String },
  departureTime: { type: String },
  returnDate: { type: String },
  returnTime: { type: String },
  vehicleType: { type: String, default: 'Truck • Eicher 19ft' },
  totalCapacity: { type: Number, default: 18 },
  occupiedCapacity: { type: Number, default: 0 },
  availableCapacity: { type: Number, default: 18 },
  maxWeightKg: { type: Number, default: 500 },
  ratePerKm: { type: Number, default: 12 },
  ratePerKg: { type: Number, default: 5 },
  isAvailable: { type: Boolean, default: true },
  isCreated: { type: Boolean, default: true },
  loadingStatus: { type: String, default: 'Empty' },
  phone: { type: String, default: '+91 98480 12345' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  createdAt: { type: Date, default: Date.now }
});

const ShipmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  deliveryDestination: { type: String, required: true },
  pickupDate: { type: String },
  pickupTimeWindow: { type: String },
  packageType: { type: String, default: 'General Freight' },
  weight: { type: Number, default: 10 },
  dimensions: {
    length: { type: Number, default: 30 },
    width: { type: Number, default: 20 },
    height: { type: Number, default: 15 }
  },
  requiredCapacity: { type: Number, default: 5 },
  specialHandling: [{ type: String }],
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Requested', 'Pending Driver Confirmation', 'Matched', 'Accepted', 'Heading to Pickup', 'Picked Up', 'In Transit', 'Delivered', 'Rejected', 'Cancelled'],
    default: 'Requested' 
  },
  deliveryOtp: { type: String, default: '4829' },
  driverId: { type: String },
  driverName: { type: String },
  driverVerified: { type: Boolean, default: true },
  driverRating: { type: Number, default: 4.8 },
  driverDeliveries: { type: Number, default: 124 },
  vehicleType: { type: String },
  driverAvatar: { type: String },
  matchScore: { type: Number, default: 90 },
  extraDistanceKm: { type: Number, default: 10 },
  price: { type: Number, required: true },
  requestedAt: { type: String },
  matchedAt: { type: String },
  acceptedAt: { type: String },
  headingToPickupAt: { type: String },
  pickedUpAt: { type: String },
  inTransitAt: { type: String },
  deliveredAt: { type: String },
  estimatedArrival: { type: String },
  co2SavedKg: { type: Number, default: 15.0 },
  fuelSavedLiters: { type: Number, default: 6.0 },
  emptyKmAvoided: { type: Number, default: 35 },
  createdAt: { type: Date, default: Date.now }
});

const TripHistorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  driverId: { type: String, required: true },
  driverName: { type: String, required: true },
  origin: { type: String, required: true },
  originHub: { type: String },
  destination: { type: String, required: true },
  destinationHub: { type: String },
  viaRoute: { type: String },
  departureDate: { type: String },
  arrivalDate: { type: String },
  distanceKm: { type: Number, default: 100 },
  emptyKmSaved: { type: Number, default: 90 },
  co2SavedKg: { type: Number, default: 20 },
  fuelSavedLiters: { type: Number, default: 8 },
  revenue: { type: Number, default: 3000 },
  status: { type: String, default: 'Completed' },
  vehicleType: { type: String },
  totalCapacity: { type: Number, default: 18 },
  utilizedCapacity: { type: Number, default: 12 },
  shipmentsCount: { type: Number, default: 1 },
  rating: { type: Number, default: 4.8 },
  deliveryProof: { type: String, default: 'Digital POD Signed & Verified' },
  createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
export const Shipment = mongoose.models.Shipment || mongoose.model('Shipment', ShipmentSchema);
export const TripHistory = mongoose.models.TripHistory || mongoose.model('TripHistory', TripHistorySchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

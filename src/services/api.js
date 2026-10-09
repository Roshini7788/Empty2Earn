// Frontend API Client for Empty2Earn Backend & Vercel Serverless Functions

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('e2e_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers
    }
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || errBody.message || `API request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Empty2Earn API] ${endpoint} fetch issue:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  login: async (email, password, role) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
    if (data.token) localStorage.setItem('e2e_token', data.token);
    return data;
  },

  register: async (userData) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) localStorage.setItem('e2e_token', data.token);
    return data;
  },

  getMe: () => request('/auth/me'),

  // Carrier Return Trips
  fetchTrips: () => request('/trips'),
  fetchMyTrip: (driverId) => request(`/trips/my-trip${driverId ? `?driverId=${encodeURIComponent(driverId)}` : ''}`),
  saveTrip: (tripData) => request('/trips', {
    method: 'POST',
    body: JSON.stringify(tripData)
  }),
  toggleTripAvailability: (driverId) => request('/trips/toggle-availability', {
    method: 'PUT',
    body: JSON.stringify({ driverId })
  }),
  fetchTripHistory: () => request('/trips/history'),

  // Rule-based Corridor Matching
  matchDrivers: ({ pickup, destination, weight, capacity }) => {
    const params = new URLSearchParams();
    if (pickup) params.append('pickup', pickup);
    if (destination) params.append('destination', destination);
    if (weight) params.append('weight', weight);
    if (capacity) params.append('capacity', capacity);
    return request(`/matching/drivers?${params.toString()}`);
  },

  // Customer Shipments & Bookings
  fetchShipments: () => request('/shipments'),
  createShipment: (shipmentData) => request('/shipments', {
    method: 'POST',
    body: JSON.stringify(shipmentData)
  }),
  acceptShipment: (id) => request(`/shipments/${id}/accept`, {
    method: 'POST'
  }),
  rejectShipment: (id) => request(`/shipments/${id}/reject`, {
    method: 'POST'
  }),
  updateShipmentStatus: (id, status) => request(`/shipments/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  verifyDeliveryOtp: (id, enteredOtp) => request(`/shipments/${id}/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({ enteredOtp })
  }),

  // Notifications
  fetchNotifications: () => request('/notifications'),
  markNotificationsRead: () => request('/notifications/mark-all-read', {
    method: 'PUT'
  }),

  // User Profile
  updateUserProfile: (profileData) => request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  })
};

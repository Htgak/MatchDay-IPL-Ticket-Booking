export const API_BASE_URL = 'http://localhost:5000/api';

export const fetchWithAuth = async (url, options = {}) => {
  // Try to get supabase session token if we were to implement Supabase auth in the client
  // For now, we assume we pass a token manually or through context
  const token = localStorage.getItem('supabase_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// API Services
export const MatchService = {
  getAll: () => fetchWithAuth('/matches'),
  getById: (id) => fetchWithAuth(`/matches/${id}`),
  getSeats: (id) => fetchWithAuth(`/matches/${id}/seats`),
  getStands: (id) => fetchWithAuth(`/matches/${id}/stands`),
  getBlocks: (id, standId) => fetchWithAuth(`/matches/${id}/stands/${standId}/blocks`),
  getBlockSeats: (id, blockId) => fetchWithAuth(`/matches/${id}/blocks/${blockId}/seats`),
  lockSeat: (id, seatId) => fetchWithAuth(`/matches/${id}/lock-seat`, {
    method: 'POST',
    body: JSON.stringify({ seatId })
  })
};

export const BookingService = {
  getUserBookings: () => fetchWithAuth('/bookings'),
  createBooking: (matchId, seatIds) => fetchWithAuth('/bookings', {
    method: 'POST',
    body: JSON.stringify({ matchId, seatIds })
  })
};

export const PaymentService = {
  createOrder: (bookingId) => fetchWithAuth('/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ bookingId })
  }),
  verifyPayment: (payload) => fetchWithAuth('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

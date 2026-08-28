/**
 * Thin API client for the Express/MongoDB backend.
 * Reads the base URL from the Vite env variable VITE_API_URL
 * (defaults to http://localhost:5000 so local dev works out of the box).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Token helpers (localStorage) ─────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('jwt_token');
}

export function setToken(token) {
  localStorage.setItem('jwt_token', token);
}

export function removeToken() {
  localStorage.removeItem('jwt_token');
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const authApi = {
  /**
   * Register a new user.
   * Returns { message } on success — does NOT auto-login.
   */
  register: (name, email, password, phone) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone }),
    }),

  /**
   * Login. Stores the JWT and returns { token, user }.
   */
  login: async (email, password) => {
    const data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data; // { token, user }
  },

  /**
   * Validate the stored JWT and return the current user.
   * Returns { user } or throws 401.
   */
  me: () => request('/api/auth/me'),

  /** Remove the local token (no server call needed). */
  logout: () => removeToken(),
};

// ── Hotel endpoints ───────────────────────────────────────────────────────────
export const hotelsApi = {
  getAll: (destination = '') =>
    request(`/api/hotels${destination ? `?destination=${encodeURIComponent(destination)}` : ''}`),

  getById: (id) => request(`/api/hotels/${id}`),
};

// ── CSV Hotel endpoints ───────────────────────────────────────────────────────
export const csvHotelsApi = {
  /**
   * Paginated list.
   * @param {object} params — { q, country, city, rating, page, limit }
   */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return request(`/api/csv-hotels${qs ? `?${qs}` : ''}`);
  },

  getById: (hotelCode) => request(`/api/csv-hotels/${hotelCode}`),
};

// ── Booking endpoints ─────────────────────────────────────────────────────────
export const bookingsApi = {
  /** Fetch all bookings for the authenticated user. */
  getAll: () => request('/api/bookings'),

  /**
   * Create a booking.
   * @param {object} payload — { roomId, hotelId, hotelName, roomType, checkIn, checkOut, guests, totalPrice }
   */
  create: (payload) =>
    request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Cancel a booking by its MongoDB _id. */
  cancel: (id) =>
    request(`/api/bookings/${id}/cancel`, { method: 'PUT' }),

  /** Hard-delete a booking. */
  delete: (id) =>
    request(`/api/bookings/${id}`, { method: 'DELETE' }),
};

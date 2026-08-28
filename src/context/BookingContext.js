import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi, bookingsApi, hotelsApi, getToken } from '../lib/api';
import { mockHotels } from '../data/mockData';

const initialState = {
  hotels: mockHotels,
  bookings: [],
  search: {
    destination: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: 2,
    rooms: 1,
  },
  filters: {
    priceRange: [0, 100000],
    starRating: [1, 2, 3, 4, 5],
    amenities: [],
  },
  view: 'home',
  user: null,
  pendingBooking: null,
  authLoading: true,
};

const BookingContext = createContext(undefined);

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: { ...state.search, ...action.payload } };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_HOTELS':
      return { ...state, hotels: action.payload };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        ),
      };
    case 'BOOK_ROOM':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        hotels: state.hotels.map((hotel) => ({
          ...hotel,
          rooms: hotel.rooms.map((room) =>
            room.id === action.payload.roomId ? { ...room, available: false } : room
          ),
        })),
      };
    case 'CANCEL_BOOKING': {
      const bookingToCancel = state.bookings.find((b) => b._id === action.payload);
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b._id === action.payload ? { ...b, status: 'cancelled' } : b
        ),
        hotels: state.hotels.map((hotel) => ({
          ...hotel,
          rooms: hotel.rooms.map((room) =>
            room.id === bookingToCancel?.roomId ? { ...room, available: true } : room
          ),
        })),
      };
    }
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload, authLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, bookings: [], view: 'home', authLoading: false };
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload };
    case 'INITIATE_PAYMENT':
      return { ...state, pendingBooking: action.payload, view: 'payment' };
    case 'COMPLETE_PAYMENT': {
      // payload is the persisted booking returned from the API (has _id)
      const booking = action.payload || state.pendingBooking;
      if (!booking) return state;
      return {
        ...state,
        bookings: [booking, ...state.bookings],
        hotels: state.hotels.map((hotel) => ({
          ...hotel,
          rooms: hotel.rooms.map((room) =>
            room.id === booking.roomId ? { ...room, available: false } : room
          ),
        })),
        pendingBooking: null,
        view: 'my-bookings',
      };
    }
    case 'CANCEL_PAYMENT':
      return { ...state, pendingBooking: null, view: 'home' };
    default:
      return state;
  }
}

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // On mount: validate any stored JWT and restore the session
  useEffect(() => {
    const token = getToken();
    if (!token) {
      dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      return;
    }

    authApi
      .me()
      .then(({ user }) => {
        dispatch({
          type: 'LOGIN',
          payload: { ...user, id: user._id, isLoggedIn: true },
        });
        // Load this user's bookings
        return bookingsApi.getAll();
      })
      .then((bookings) => {
        dispatch({ type: 'SET_BOOKINGS', payload: bookings });
      })
      .catch(() => {
        // Token invalid / expired — clear it
        authApi.logout();
        dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      });
  }, []);

  // Reload hotels from API on mount (falls back to mockData if API is unreachable)
  useEffect(() => {
    hotelsApi
      .getAll()
      .then((hotels) => {
        if (hotels && hotels.length > 0) {
          dispatch({ type: 'SET_HOTELS', payload: hotels });
        }
      })
      .catch(() => {
        // API not reachable — mockData already in state, nothing to do
      });
  }, []);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

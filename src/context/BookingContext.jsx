import React, { createContext, useContext, useReducer } from 'react';
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
};

const BookingContext = createContext(undefined);

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: { ...state.search, ...action.payload } };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
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
    case 'CANCEL_BOOKING':
      const bookingToCancel = state.bookings.find((b) => b.id === action.payload);
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload ? { ...b, status: 'cancelled' } : b
        ),
        hotels: state.hotels.map((hotel) => ({
          ...hotel,
          rooms: hotel.rooms.map((room) =>
            room.id === bookingToCancel?.roomId ? { ...room, available: true } : room
          ),
        })),
      };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload, view: 'home' };
    case 'LOGOUT':
      return { ...state, user: null, view: 'home' };
    case 'INITIATE_PAYMENT':
      return { ...state, pendingBooking: action.payload, view: 'payment' };
    case 'COMPLETE_PAYMENT':
      if (!state.pendingBooking) return state;
      return {
        ...state,
        bookings: [state.pendingBooking, ...state.bookings],
        hotels: state.hotels.map((hotel) => ({
          ...hotel,
          rooms: hotel.rooms.map((room) =>
            room.id === state.pendingBooking?.roomId ? { ...room, available: false } : room
          ),
        })),
        pendingBooking: null,
        view: 'my-bookings',
      };
    case 'CANCEL_PAYMENT':
      return { ...state, pendingBooking: null, view: 'home' };
    default:
      return state;
  }
}

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

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

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Room, Hotel, Booking, SearchState, FilterState, User } from '../types';
import { mockHotels } from '../data/mockData';

interface AppState {
  hotels: Hotel[];
  bookings: Booking[];
  search: SearchState;
  filters: FilterState;
  view: 'home' | 'my-bookings' | 'login' | 'support' | 'payment';
  user: User | null;
  pendingBooking: Booking | null;
}

type AppAction =
  | { type: 'SET_SEARCH'; payload: Partial<SearchState> }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'BOOK_ROOM'; payload: Booking }
  | { type: 'CANCEL_BOOKING'; payload: string }
  | { type: 'SET_VIEW'; payload: AppState['view'] }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'INITIATE_PAYMENT'; payload: Booking }
  | { type: 'COMPLETE_PAYMENT' }
  | { type: 'CANCEL_PAYMENT' };

const initialState: AppState = {
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

const BookingContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

function bookingReducer(state: AppState, action: AppAction): AppState {
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
          b.id === action.payload ? { ...b, status: 'cancelled' as const } : b
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

export const BookingProvider = ({ children }: { children: ReactNode }) => {
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

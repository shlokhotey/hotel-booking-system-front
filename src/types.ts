export interface Room {
  id: string;
  type: string;
  description: string;
  price: number;
  capacity: number;
  available: boolean;
  amenities: string[];
  imageUrl: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  description: string;
  amenities: string[];
  rooms: Room[];
}

export interface Booking {
  id: string;
  roomId: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  bookedAt: string;
}

export interface SearchState {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export interface FilterState {
  priceRange: [number, number];
  starRating: number[];
  amenities: string[];
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext.js';
import { Star, MapPin, ChevronDown, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookingModal } from './BookingModal.js';
import HotelMap from './HotelMap.js';

export const HotelCard = ({ hotel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the minimum price among available rooms
  const minPrice = Math.min(...hotel.rooms.map(r => r.price));

  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg overflow-hidden border border-border-theme flex h-[220px] shadow-sm hover:shadow-md transition-shadow group"
    >
      {/* 1. Image Column */}
      <div className="relative w-[320px] h-full flex-shrink-0">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        {minPrice > 0 && (
           <div className="absolute top-0 left-0 bg-promo-green text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-br">
              TOP RATED
           </div>
        )}
      </div>

      {/* 2. Details Column */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="hotel-header">
          <div className="hotel-title">
            <h3 className="text-xl font-bold text-text-main mb-1">{hotel.name}</h3>
            <div className="flex items-center gap-0.5 text-accent-gold mb-1">
              {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {hotel.location}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-[#003580] text-white px-2 py-1 rounded font-bold text-sm">
              {hotel.rating.toFixed(1)}
            </div>
            <span className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-tighter">
              {hotel.reviews.toLocaleString()} Reviews
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-muted font-bold uppercase tracking-tighter">
          {hotel.amenities.slice(0, 5).map((amenity, i) => (
            <span key={i} className="flex items-center gap-1">
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Pricing Column */}
      <div className="pricing-column w-[200px] border-l border-border-theme p-6 flex flex-col justify-end items-end gap-2 text-right">
        <div className="pricing-info">
          <span className="text-[10px] font-bold text-text-muted uppercase block">Starts from</span>
          <div className="text-2xl font-black text-brand-primary leading-none">₹{minPrice.toLocaleString('en-IN')}</div>
          <p className="text-[9px] font-bold text-text-muted mt-1 uppercase">Recommended for {hotel.rooms[0].capacity} Adults</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-[#0071c2] hover:bg-brand-secondary text-white py-3 rounded font-bold text-sm transition-all uppercase tracking-widest shadow-lg shadow-brand-primary/10"
        >
          View Deal
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <BookingModal hotel={hotel} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const HotelList = () => {
  const { state } = useBooking();
  const [showMap, setShowMap] = useState(false);

  const filteredHotels = state.hotels.filter((hotel) => {
    // Check if any room matches price filter
    const hasMatchingRoom = hotel.rooms.some(r => r.price <= state.filters.priceRange[1]);
    const matchesStars = state.filters.starRating.includes(Math.floor(hotel.rating));
    const matchesSearch = state.search.destination === '' ||
      hotel.location.toLowerCase().includes(state.search.destination.toLowerCase()) ||
      hotel.name.toLowerCase().includes(state.search.destination.toLowerCase());
    
    return hasMatchingRoom && matchesStars && matchesSearch;
  });

  // Build marker objects for hotels that carry valid lat/lng coordinates
  const mapMarkers = filteredHotels
    .filter((h) => typeof h.lat === 'number' && typeof h.lng === 'number')
    .map((h) => ({ id: h.id, name: h.name, location: h.location, lat: h.lat, lng: h.lng }));

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
          Available Properties ({filteredHotels.length})
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMap((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-colors ${
              showMap
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-white text-gray-900 border-gray-100 hover:border-brand-primary shadow-sm'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm cursor-pointer">
            Sort by: Recommended <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* ── Map panel ── */}
      {showMap && filteredHotels.length > 0 && (
        <HotelMap hotels={mapMarkers} height="380px" />
      )}

      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded p-20 text-center border border-dashed border-border-theme">
           <div className="bg-bg-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-text-muted" />
           </div>
           <h3 className="text-xl font-bold text-text-main mb-2">No properties found</h3>
           <p className="text-text-muted max-w-xs mx-auto text-xs font-bold uppercase tracking-widest leading-relaxed">
             Try adjusting your filters or destination.
           </p>
        </div>
      )}
    </div>
  );
};

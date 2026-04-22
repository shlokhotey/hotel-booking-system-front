import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Star, Sliders, ChevronDown } from 'lucide-react';

export const Sidebar = () => {
  const { state, dispatch } = useBooking();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FILTERS', payload: { priceRange: [0, parseInt(e.target.value)] } });
  };

  const handleStarToggle = (star: number) => {
    const currentStars = state.filters.starRating;
    const newStars = currentStars.includes(star)
      ? currentStars.filter((s) => s !== star)
      : [...currentStars, star];
    dispatch({ type: 'SET_FILTERS', payload: { starRating: newStars } });
  };

  return (
    <aside className="w-[240px] flex-shrink-0">
      <div className="bg-white border border-border-theme rounded-lg p-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-widest">
            Filter By
          </h3>
          <button 
            className="text-[10px] font-bold text-brand-primary hover:underline uppercase"
            onClick={() => dispatch({ type: 'SET_FILTERS', payload: { priceRange: [0, 100000], starRating: [1,2,3,4,5] } })}
          >
            Reset
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4 block">Price Range</span>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-brand-primary">₹{state.filters.priceRange[1].toLocaleString('en-IN')} max</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={state.filters.priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-1 bg-bg-light rounded-lg appearance-none cursor-pointer accent-brand-primary"
            />
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-8">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4 block">Star Rating</span>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <label 
                key={star}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={state.filters.starRating.includes(star)}
                  onChange={() => handleStarToggle(star)}
                  className="w-4 h-4 rounded border-border-theme text-brand-primary focus:ring-brand-primary transition-all pointer-events-none"
                />
                <div className="flex items-center gap-0.5 text-accent-gold">
                  {[...Array(star)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Popular Amenities */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4 block">Amenities</span>
          <div className="space-y-2">
            {['Free WiFi', 'Spa Access', 'Pool'].map((amenity) => (
              <label key={amenity} className="flex items-center gap-3 group cursor-pointer">
                 <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border-theme text-brand-primary focus:ring-brand-primary transition-all cursor-pointer"
                />
                <span className="text-xs font-bold text-text-muted group-hover:text-text-main transition-colors uppercase tracking-tight">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

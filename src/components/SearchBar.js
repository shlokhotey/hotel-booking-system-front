import React from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useBooking } from '../context/BookingContext.js';
import { motion } from 'motion/react';

export const SearchBar = () => {
  const { state, dispatch } = useBooking();

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white px-10 py-5 border-b-2 border-brand-primary shadow-sm z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1.5fr_0.5fr] gap-px bg-border-theme border border-border-theme rounded overflow-hidden"
        >
          <div className="bg-white p-3 flex flex-col group hover:bg-gray-50 transition-colors">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Destination</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-primary" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={state.search.destination}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: { destination: e.target.value } })}
                className="bg-transparent border-none p-0 text-sm font-bold text-text-main focus:ring-0 placeholder-gray-300 w-full outline-none"
              />
            </div>
          </div>

          <div className="bg-white p-3 flex flex-col group hover:bg-gray-50 transition-colors relative">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Check-in</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <input
                type="date"
                value={state.search.checkIn}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: { checkIn: e.target.value } })}
                className="bg-transparent border-none p-0 text-sm font-bold text-text-main focus:ring-0 outline-none w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-3 flex flex-col group hover:bg-gray-50 transition-colors relative">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Check-out</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <input
                type="date"
                value={state.search.checkOut}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: { checkOut: e.target.value } })}
                className="bg-transparent border-none p-0 text-sm font-bold text-text-main focus:ring-0 outline-none w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white p-3 flex flex-col group hover:bg-gray-50 transition-colors">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Guests & Rooms</label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-brand-primary" />
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1.5 bg-bg-light px-2 py-1 rounded">
                      <button 
                        type="button"
                        onClick={() => dispatch({ type: 'SET_SEARCH', payload: { guests: Math.max(1, state.search.guests - 1) } })}
                        className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-brand-primary font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-text-main min-w-[2ch] text-center">{state.search.guests} Ad</span>
                      <button 
                        type="button"
                        onClick={() => dispatch({ type: 'SET_SEARCH', payload: { guests: state.search.guests + 1 } })}
                        className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-brand-primary font-bold"
                      >
                        +
                      </button>
                   </div>
                   <div className="flex items-center gap-1.5 bg-bg-light px-2 py-1 rounded">
                      <button 
                        type="button"
                        onClick={() => dispatch({ type: 'SET_SEARCH', payload: { rooms: Math.max(1, state.search.rooms - 1) } })}
                        className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-brand-primary font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-text-main min-w-[2ch] text-center">{state.search.rooms} Rm</span>
                      <button 
                        type="button"
                        onClick={() => dispatch({ type: 'SET_SEARCH', payload: { rooms: state.search.rooms + 1 } })}
                        className="w-4 h-4 flex items-center justify-center text-text-muted hover:text-brand-primary font-bold"
                      >
                        +
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleSearch}
            className="bg-brand-primary hover:bg-brand-secondary text-white flex items-center justify-center transition-colors group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

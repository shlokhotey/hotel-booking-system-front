import React from 'react';
import { useBooking } from '../context/BookingContext';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export const MyBookings = () => {
  const { state, dispatch } = useBooking();

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-text-main leading-tight tracking-tighter uppercase">Your Journeys</h1>
          <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-2 px-1">Manage your current and past reservations</p>
        </div>
        <div className="bg-white p-6 rounded border border-border-theme shadow-sm flex gap-10 px-10">
           <div className="text-center">
             <span className="block text-2xl font-black text-brand-primary leading-none">{state.bookings.filter(b => b.status === 'confirmed').length}</span>
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 block">Active</span>
           </div>
           <div className="h-10 w-px bg-border-theme self-center"></div>
           <div className="text-center">
             <span className="block text-2xl font-black text-border-theme leading-none">{state.bookings.filter(b => b.status === 'cancelled').length}</span>
             <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 block">Cancelled</span>
           </div>
        </div>
      </div>

      {state.bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-24 text-center border border-border-theme shadow-sm">
          <div className="bg-bg-light w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Ticket className="w-10 h-10 text-brand-primary/30" />
          </div>
          <h2 className="text-2xl font-black text-text-main mb-4">No bookings found yet</h2>
          <p className="text-text-muted font-bold tracking-tight max-w-sm mx-auto uppercase text-xs mb-8">
            Your upcoming adventures will appear here once you've secured a room.
          </p>
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="bg-brand-primary hover:bg-brand-secondary text-white px-10 py-4 rounded font-bold transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest"
          >
            Start Exploring
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {state.bookings.map((booking) => (
              <motion.div
                layout
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-lg p-8 border border-border-theme shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className={`absolute top-0 left-0 bottom-0 w-2 ${booking.status === 'confirmed' ? 'bg-brand-primary' : 'bg-gray-200'}`} />

                <div className="flex flex-col md:flex-row gap-8 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-black text-text-main leading-tight">{booking.hotelName}</h3>
                      {booking.status === 'confirmed' ? (
                        <span className="bg-[#008009] text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" />
                          Cancelled
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Room Type</span>
                        <div className="text-sm font-bold text-text-main uppercase tracking-tight">
                          {booking.roomType}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Check-in</span>
                        <div className="text-sm font-bold text-text-main uppercase tracking-tight">
                          {booking.checkIn}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Guests</span>
                        <div className="text-sm font-bold text-text-main uppercase tracking-tight">
                          {booking.guests} Adults
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Total Price</span>
                        <div className="text-sm font-black text-brand-primary">
                          ₹{booking.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-3 w-full md:w-48">
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => dispatch({ type: 'CANCEL_BOOKING', payload: booking.id })}
                        className="w-full bg-white hover:bg-red-50 text-red-500 border border-red-100 px-4 py-3 rounded font-bold text-xs uppercase tracking-widest transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button className="w-full bg-bg-light hover:bg-border-theme text-text-main px-4 py-3 rounded font-bold text-xs uppercase tracking-widest transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

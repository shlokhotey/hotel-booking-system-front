import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext.js';
import { X, ShieldCheck, Ticket, User, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const BookingModal = ({ hotel, onClose }) => {
  const { state, dispatch } = useBooking();
  const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]);

  const handleDateChange = (type, value) => {
    dispatch({ type: 'SET_SEARCH', payload: { [type]: value } });
  };

  const calculateNights = (inDate, outDate) => {
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const taxRate = 0.12;
  const serviceFee = 500; // INR
  const nights = calculateNights(state.search.checkIn, state.search.checkOut);
  const subtotal = selectedRoom.price * nights;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes + serviceFee;

  const handleConfirm = () => {
    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: selectedRoom.id,
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomType: selectedRoom.type,
      checkIn: state.search.checkIn,
      checkOut: state.search.checkOut,
      guests: state.search.guests,
      totalPrice: total,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };

    dispatch({ type: 'INITIATE_PAYMENT', payload: newBooking });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-5xl rounded-xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20 text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Info Column */}
        <div className="flex-1 p-8 bg-bg-light border-r border-border-theme overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-primary rounded shadow-lg shadow-brand-primary/10 flex items-center justify-center">
              <Ticket className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-main leading-tight">{hotel.name}</h2>
              <p className="text-sm text-text-muted font-bold uppercase tracking-widest mt-1">{hotel.location}</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Room Selection */}
            <div>
              <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Choose Your Room Type</h4>
              <div className="grid grid-cols-1 gap-3">
                {hotel.rooms.map((room) => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer flex justify-between items-center ${
                      selectedRoom.id === room.id 
                        ? 'border-brand-primary bg-white shadow-md ring-4 ring-brand-primary/5' 
                        : 'border-white bg-white/50 hover:bg-white hover:border-border-theme'
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <img src={room.imageUrl} className="w-16 h-12 rounded object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h5 className="font-bold text-text-main text-sm">{room.type}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase flex items-center gap-1">
                            <User className="w-3 h-3" /> {room.capacity} Guests
                          </span>
                          <span className="text-[10px] font-bold text-text-muted uppercase">•</span>
                          <span className="text-[10px] font-bold text-promo-green uppercase">Available</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <div className="text-lg font-black text-brand-primary">₹{room.price.toLocaleString('en-IN')}</div>
                        <p className="text-[8px] font-bold text-text-muted uppercase tracking-tighter">Per Night</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                        selectedRoom.id === room.id ? 'bg-brand-primary border-brand-primary' : 'border-gray-200'
                      }`}>
                         {selectedRoom.id === room.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-lg border border-border-theme shadow-sm">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">Check-in</label>
                <input 
                  type="date"
                  value={state.search.checkIn}
                  onChange={(e) => handleDateChange('checkIn', e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-sm font-bold text-text-main focus:ring-0 outline-none"
                />
              </div>
              <div className="bg-white p-5 rounded-lg border border-border-theme shadow-sm">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">Check-out</label>
                <input 
                  type="date"
                  value={state.search.checkOut}
                  onChange={(e) => handleDateChange('checkOut', e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-sm font-bold text-text-main focus:ring-0 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Column */}
        <div className="w-full md:w-[400px] p-10 flex flex-col pt-16 md:pt-10 overflow-y-auto">
          <h3 className="text-lg font-bold text-text-main mb-8 border-b border-border-theme pb-4 uppercase tracking-tighter italic">Order Summary</h3>
          
          <div className="space-y-4 mb-8">
            <div className="bg-bg-light p-4 rounded-lg mb-6 border border-border-theme">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Selected room</p>
              <h5 className="font-bold text-text-main">{selectedRoom.type}</h5>
              <p className="text-[10px] font-bold text-text-muted uppercase mt-1">{nights} Nights • {state.search.guests} Guests</p>
            </div>

            <div className="flex justify-between text-sm font-bold">
              <span className="text-text-muted uppercase tracking-tight">₹{selectedRoom.price.toLocaleString('en-IN')} x {nights} nights</span>
              <span className="text-text-main">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-text-muted uppercase tracking-tight">Taxes & Fees (12%)</span>
              <span className="text-text-main">₹{taxes.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-text-muted uppercase tracking-tight">Service Fee</span>
              <span className="text-text-main">₹{serviceFee.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-6 bg-brand-primary text-white rounded-lg mb-6 shadow-xl shadow-brand-primary/10 text-right">
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Grand Total</span>
              <div className="text-4xl font-black mt-1">₹{total.toLocaleString('en-IN')}</div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-gray-400">
               <ShieldCheck className="w-4 h-4 text-promo-green" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Fast & Secure Booking Process</span>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full bg-text-main hover:bg-black text-white rounded py-5 font-bold transition-all uppercase tracking-[0.2em] text-xs"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

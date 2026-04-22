import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'motion/react';
import { ChevronLeft, CreditCard, Wallet, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export const PaymentPage = () => {
  const { state, dispatch } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  if (!state.pendingBooking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10">
        <h2 className="text-xl font-bold text-text-main">No pending payment</h2>
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className="mt-4 text-brand-primary font-bold uppercase text-xs tracking-widest"
        >
          Return to home
        </button>
      </div>
    );
  }

  const paymentMethods = [
    { id: 'upi', name: 'Add UPI ID', icon: <Wallet className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
    { id: 'card', name: 'Credit/Debit Cards', icon: <CreditCard className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
    { id: 'wallets', name: 'Wallets', icon: <Wallet className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600' },
    { id: 'cod', name: 'Pay on delivery', icon: <Truck className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
  ];

  const handlePayment = () => {
     if (!selectedMethod) return;
     dispatch({ type: 'COMPLETE_PAYMENT' });
  };

  return (
    <div className="flex-1 bg-[#F5F7FA] overflow-y-auto min-h-screen">
      <div className="max-w-[480px] mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col">
        {/* Header */}
        <header className="bg-[#3D1E14] text-white p-6 pt-12 pb-8 flex items-center gap-4">
          <button 
            onClick={() => dispatch({ type: 'CANCEL_PAYMENT' })}
            className="hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Your Order</h1>
        </header>

        {/* Order Summary Card */}
        <div className="px-6 -mt-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-5 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Plan Type</p>
              <h2 className="text-sm font-bold text-gray-800">{state.pendingBooking.roomType} in {state.pendingBooking.hotelName}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{state.pendingBooking.checkIn} to {state.pendingBooking.checkOut}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
              <p className="text-lg font-black text-gray-900">₹{state.pendingBooking.totalPrice.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="p-6 space-y-8">
          {/* Recently Used */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recently Used / Recommended</h3>
            <div 
              onClick={() => setSelectedMethod('upi-saved')}
              className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all cursor-pointer ${
                selectedMethod === 'upi-saved' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-50 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                  <span className="font-black text-xs italic">pe</span>
                </div>
                <span className="font-bold text-gray-800 tracking-tight">9696969696@ybl</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === 'upi-saved' ? 'border-brand-primary bg-brand-primary' : 'border-gray-200'
              }`}>
                {selectedMethod === 'upi-saved' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </div>
          </section>

          {/* Other Options */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Other Options</h3>
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all cursor-pointer bg-white group ${
                  selectedMethod === method.id ? 'border-brand-primary' : 'border-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                    {method.icon}
                  </div>
                  <span className="font-bold text-gray-800 tracking-tight">{method.name}</span>
                </div>
                <ArrowRight className={`w-4 h-4 text-gray-300 group-hover:text-brand-primary transition-colors ${selectedMethod === method.id ? 'text-brand-primary' : ''}`} />
              </div>
            ))}
          </section>
        </div>

        {/* Bottom Bar */}
        <div className="mt-auto p-6 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-gray-400">
            <ShieldCheck className="w-4 h-4 text-promo-green" />
            <span className="text-[10px] font-bold uppercase tracking-wider">100% Safe & Secure Payments</span>
          </div>
          <button 
            onClick={handlePayment}
            disabled={!selectedMethod}
            className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-brand-primary/20 ${
              selectedMethod 
                ? 'bg-brand-primary text-white hover:bg-brand-secondary' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            Pay Now ₹{state.pendingBooking.totalPrice.toLocaleString('en-IN')}
          </button>
        </div>
      </div>
    </div>
  );
};

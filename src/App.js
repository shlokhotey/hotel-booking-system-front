import React from 'react';
import { BookingProvider, useBooking } from './context/BookingContext.js';
import { Header } from './components/Header.js';
import { SearchBar } from './components/SearchBar.js';
import { Sidebar } from './components/Sidebar.js';
import { HotelList } from './components/HotelCard.js';
import { MyBookings } from './components/MyBookings.js';
import { LoginPage } from './components/LoginPage.js';
import { SupportPage } from './components/SupportPage.js';
import { PaymentPage } from './components/PaymentPage.js';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { state } = useBooking();

  return (
    <div className="min-h-screen bg-bg-light font-sans text-text-main selection:bg-brand-primary/20 selection:text-brand-secondary">
      <Header />
      
      <main className="flex flex-col flex-1">
        <AnimatePresence mode="wait">
          {state.view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1"
            >
              <SearchBar />

              <div className="max-w-7xl mx-auto w-full px-10 pt-8 pb-20 flex gap-6">
                <Sidebar />
                <HotelList />
              </div>
            </motion.div>
          ) : state.view === 'my-bookings' ? (
            <motion.div
              key="bookings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {state.user ? <MyBookings /> : <LoginPage />}
            </motion.div>
          ) : state.view === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <LoginPage />
            </motion.div>
          ) : state.view === 'payment' ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {state.user ? <PaymentPage /> : <LoginPage />}
            </motion.div>
          ) : (
            <motion.div
              key="support"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <SupportPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-border-theme py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tighter text-brand-primary">
              Easy<span className="text-brand-secondary">Stay</span>
            </span>
          </div>
          <div className="flex gap-12">
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">About</h5>
              <ul className="text-xs font-bold text-text-muted space-y-2 uppercase">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">How it works</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">Careers</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Support</h5>
              <ul className="text-xs font-bold text-text-muted space-y-2 uppercase">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>
          <p className="text-[10px] font-bold text-border-theme uppercase tracking-widest">
            © 2026 EasyStay Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}

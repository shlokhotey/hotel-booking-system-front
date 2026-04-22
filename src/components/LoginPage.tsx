import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, User as UserIcon } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { dispatch } = useBooking();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      dispatch({ 
        type: 'LOGIN', 
        payload: { name, email, isLoggedIn: true } 
      });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-bg-light min-h-[600px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl border border-border-theme shadow-lg overflow-hidden"
      >
        <div className="p-8 border-b border-border-theme bg-white">
          <div className="w-12 h-12 bg-brand-primary rounded flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/10">
            <LogIn className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-text-main tracking-tight uppercase">Welcome Back</h2>
          <p className="text-xs font-bold text-text-muted mt-1 uppercase tracking-widest">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <UserIcon className="w-3 h-3" /> Full Name
            </label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-bg-light border border-border-theme rounded px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full bg-bg-light border border-border-theme rounded px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-bg-light border border-border-theme rounded px-4 py-3 text-sm focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-4 rounded transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
          >
            Sign In
          </button>

          <div className="text-center">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Don't have an account? <span className="text-brand-primary cursor-pointer hover:underline">Register Now</span>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

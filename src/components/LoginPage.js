import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext.js';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Mail, Lock, User as UserIcon, Phone, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { authApi, bookingsApi } from '../lib/api';

export const LoginPage = () => {
  const { dispatch } = useBooking();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { user } = await authApi.login(email, password);
        dispatch({
          type: 'LOGIN',
          payload: { ...user, id: user._id, isLoggedIn: true },
        });
        // Fetch bookings for newly logged-in user
        const bookings = await bookingsApi.getAll();
        dispatch({ type: 'SET_BOOKINGS', payload: bookings });
        dispatch({ type: 'SET_VIEW', payload: 'home' });
      } else {
        await authApi.register(name, email, password, phone);
        setError('Account created! Please sign in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-bg-light min-h-[700px]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-xl border border-border-theme shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-border-theme bg-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
            <LogIn className="text-brand-primary w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[10px] font-bold text-text-muted mt-3 uppercase tracking-[0.2em]">
            {isLogin ? 'Sign in to access your dashboard' : 'Join EasyStay for exclusive deals'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center gap-3 p-4 rounded text-xs font-bold uppercase tracking-wider ${error.includes('Account created') ? 'bg-promo-green/10 text-promo-green border border-promo-green/20' : 'bg-red-50 text-red-600 border border-red-100'}`}
              >
                {error.includes('Account created') ? <div className="w-2 h-2 rounded-full bg-promo-green" /> : <AlertCircle className="w-4 h-4" />}
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                <UserIcon className="w-3 h-3 text-brand-primary" /> Full Name
              </label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-bg-light border border-border-theme rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300 font-medium"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
              <Mail className="w-3 h-3 text-brand-primary" /> Email Address
            </label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="shlok@easystay.com"
              className="w-full bg-bg-light border border-border-theme rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300 font-medium"
            />
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                <Phone className="w-3 h-3 text-brand-primary" /> Phone Number
              </label>
              <input 
                required
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-bg-light border border-border-theme rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300 font-medium"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
              <Lock className="w-3 h-3 text-brand-primary" /> Password
            </label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-bg-light border border-border-theme rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all placeholder:text-gray-300 font-medium"
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-lg transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-widest flex items-center justify-center gap-3 mt-4 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-brand-primary ml-2 hover:underline focus:outline-none"
              >
                {isLogin ? 'Register Now' : 'Sign In instead'}
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

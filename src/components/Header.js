import React from 'react';
import { useBooking } from '../context/BookingContext.js';
import { User as UserIcon, LogOut } from 'lucide-react';
import { authApi } from '../lib/api';

export const Header = () => {
  const { state, dispatch } = useBooking();

  const handleLogout = () => {
    authApi.logout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <header className="bg-white border-b border-border-theme flex items-center justify-between px-10 h-[60px] sticky top-0 z-50">
      <div 
        className="flex items-center gap-1 cursor-pointer" 
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
      >
        <span className="text-[22px] font-extrabold tracking-tighter text-brand-primary">
          Easy<span className="text-brand-secondary">Stay</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className={`text-sm font-medium transition-colors ${state.view === 'home' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'}`}
        >
          Destinations
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'explore' })}
          className={`text-sm font-medium transition-colors ${state.view === 'explore' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'}`}
        >
          Explore Hotels
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'my-bookings' })}
          className={`text-sm font-medium transition-colors ${state.view === 'my-bookings' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'}`}
        >
          My Bookings
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'support' })}
          className={`text-sm font-medium transition-colors ${state.view === 'support' ? 'text-brand-primary' : 'text-text-muted hover:text-brand-primary'}`}
        >
          Support
        </button>
      </nav>

      <div className="flex items-center gap-4">
        {state.user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-border-theme">
              <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-brand-primary" />
              </div>
              <span className="text-sm font-bold text-text-main">{state.user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-text-muted hover:text-red-500 transition-colors p-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'login' })}
            className="text-sm font-bold text-text-main border border-border-theme px-4 py-1.5 rounded hover:bg-gray-50 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { ArrowLeft, Lock, Mail } from 'lucide-react';

export const DriverAuthPage = () => {
  const { setCurrentView, setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    const safeName = email.trim().split('@')[0]?.replace(/[._-]/g, ' ') || 'Carrier';

    setCurrentUser({
      id: 'd1',
      name: safeName.charAt(0).toUpperCase() + safeName.slice(1),
      email: email.trim(),
      role: 'driver',
      rating: 4.8,
      deliveries: 124,
      vehicle: 'Truck (18m³)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });
    setCurrentView('driver-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans relative">
      <button
        onClick={() => setCurrentView('landing')}
        className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo size="normal" onClick={() => setCurrentView('landing')} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Carrier Login</h2>
          <p className="text-xs text-slate-500">Access the carrier portal, manage return trips, and accept shipments.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Phone</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white transition-all text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0] focus:bg-white transition-all text-slate-900"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[#2874f0] hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2874f0] hover:bg-[#1a62d6] text-white font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-99 text-sm"
          >
            Login as Carrier
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have a driver profile?{' '}
          <a href="#register" onClick={(e) => e.preventDefault()} className="text-[#2874f0] font-bold hover:underline">
            Register as Driver
          </a>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">OR</span>
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={() => setCurrentView('customer-login')}
            className="text-xs text-[#2874f0] hover:text-blue-700 font-semibold hover:underline"
          >
            Are you a customer? Switch to Customer Login →
          </button>
        </div>
      </div>
    </div>
  );
};

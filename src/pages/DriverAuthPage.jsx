import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { ArrowLeft, Lock, Mail, Truck, ShieldAlert } from 'lucide-react';

export const DriverAuthPage = () => {
  const { setCurrentView, loginDriverDemo } = useApp();
  const [email, setEmail] = useState('driver@empty2earn.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginDriverDemo();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans relative">
      {/* Back Link */}
      <button
        onClick={() => setCurrentView('landing')}
        className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Main Login Card matching Reference Screen #7 / #12 */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo size="normal" onClick={() => setCurrentView('landing')} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Driver Login</h2>
          <p className="text-xs text-slate-500">Access driver portal, manage return trips and accept shipments</p>
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
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
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-99 text-sm"
          >
            Login as Driver
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have a driver profile?{' '}
          <a href="#register" onClick={(e) => e.preventDefault()} className="text-blue-600 font-bold hover:underline">
            Register as Driver
          </a>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">OR</span>
        </div>

        {/* Try Demo (Driver) Button matching Reference Screen #7 */}
        <div className="space-y-2">
          <button
            onClick={loginDriverDemo}
            className="w-full py-3 bg-slate-50 hover:bg-blue-50 border-2 border-blue-500/80 text-blue-800 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] text-sm"
          >
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Try Demo (Driver)</span>
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Use demo credentials for a quick preview as driver Mike Davis.
          </p>
        </div>

        {/* Customer Link Switcher */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={() => setCurrentView('customer-login')}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
          >
            Are you a customer? Switch to Customer Login →
          </button>
        </div>
      </div>
    </div>
  );
};

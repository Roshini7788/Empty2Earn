import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { ArrowLeft, Lock, Mail, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

export const CustomerAuthPage = () => {
  const { setCurrentView, loginCustomerDemo } = useApp();
  const [email, setEmail] = useState('customer@empty2earn.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    loginCustomerDemo();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans relative">
      {/* Back to Home Link */}
      <button
        onClick={() => setCurrentView('landing')}
        className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      {/* Main Login Card matching Reference Screen #2 */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-block">
            <Logo size="normal" onClick={() => setCurrentView('landing')} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Customer Login</h2>
          <p className="text-xs text-slate-500">Access your dashboard and manage your shipments</p>
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
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
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
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-99 text-sm"
          >
            Login
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <a href="#register" onClick={(e) => e.preventDefault()} className="text-emerald-600 font-bold hover:underline">
            Register
          </a>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">OR</span>
        </div>

        {/* Try Demo (Customer) Button matching Reference Screen #2 */}
        <div className="space-y-2">
          <button
            onClick={loginCustomerDemo}
            className="w-full py-3 bg-slate-50 hover:bg-emerald-50 border-2 border-emerald-500/80 text-emerald-800 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] text-sm"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Try Demo (Customer)</span>
          </button>

          <p className="text-[11px] text-center text-slate-400">
            Use demo credentials for a quick preview as customer Sarah Johnson.
          </p>
        </div>

        {/* Driver Link Switcher */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={() => setCurrentView('driver-login')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Are you a driver? Switch to Driver Login →
          </button>
        </div>
      </div>
    </div>
  );
};

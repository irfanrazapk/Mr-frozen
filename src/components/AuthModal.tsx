import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { authService } from '../services/AuthService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, showToast, setCurrentView } = useShop();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = authService.login(loginEmail, loginPassword);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast(`Welcome back, ${res.user.fullName}!`, 'success');
      onClose();
      if (res.user.role === 'admin') {
        setCurrentView('admin');
      }
    } else {
      setErrorMsg(res.error || 'Failed to login');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = authService.register(regName, regEmail, regPhone, regPassword);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast('Registration successful! Welcome to Mr. Frozen.', 'success');
      onClose();
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  const handleAdminDemoLogin = () => {
    const res = authService.login('admin@mrfrozen.pk', 'admin123');
    if (res.success && res.user) {
      setCurrentUser(res.user);
      showToast('Logged in as Mr. Frozen Store Admin', 'success');
      onClose();
      setCurrentView('admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-white rounded-3xl p-6 sm:p-8 border border-brand-main shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-brand-muted hover:text-brand-dark cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-xl bg-brand-primary text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-xs">
            MF
          </div>
          <h2 className="text-xl font-extrabold text-brand-dark font-display">
            MR. FROZEN
          </h2>
          <p className="text-xs text-brand-muted">
            Good Food • Frozen Fresh Customer Portal
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-brand-main mb-6">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              tab === 'login' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              tab === 'register' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-dark">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
                <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-dark">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
                />
                <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              Sign In to Mr. Frozen
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-dark">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Sana Tariq"
                className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-dark">Email Address</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="sana@example.com"
                className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-dark">Mobile Number</label>
              <input
                type="tel"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-dark">Password</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-xl border border-brand-main bg-surface-cream text-brand-dark"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold transition-all shadow-xs cursor-pointer"
            >
              Create Account
            </button>
          </form>
        )}

        {/* 1-Click Demo Shortcut */}
        <div className="mt-6 pt-5 border-t border-brand-main text-center">
          <div className="text-[11px] text-brand-muted mb-2 font-medium">
            Development Quick Access:
          </div>
          <button
            type="button"
            onClick={handleAdminDemoLogin}
            className="w-full py-2 px-3 rounded-xl bg-brand-light border border-brand-leaf/40 text-brand-primary text-xs font-bold hover:bg-brand-leaf/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-brand-leaf" />
            <span>Login as Store Admin (1-Click)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

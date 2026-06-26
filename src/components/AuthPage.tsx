import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowLeft, Landmark, Eye, EyeOff } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onAuthSuccess: (user: User, token: string) => void;
  onNavigate: (tab: string) => void;
}

export default function AuthPage({ mode, onAuthSuccess, onNavigate }: AuthPageProps) {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup' | 'forgot'>(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (currentMode === 'login') {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (response.ok) {
          onAuthSuccess(data.user, data.token);
        } else {
          setError(data.error || 'Authentication failed. Review your entries.');
        }
      } else if (currentMode === 'signup') {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        
        if (response.ok) {
          onAuthSuccess(data.user, data.token);
        } else {
          setError(data.error || 'Registration failed. Try a different email.');
        }
      } else if (currentMode === 'forgot') {
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        
        if (response.ok) {
          setSuccessMsg(data.message || 'Reset guidelines dispatched.');
        } else {
          setError(data.error || 'Failed to locate email directory.');
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Network offline or container server is launching. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@finsight.ai', password: 'demo123' }),
      });
      const data = await response.json();
      if (response.ok) {
        onAuthSuccess(data.user, data.token);
      } else {
        setError(data.error || 'Demo session fail.');
      }
    } catch (err) {
      setError("Fallback demo offline. Please reload browser.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Form Container (Left) */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Back button */}
          <button
            onClick={() => onNavigate('home')}
            className="group mb-8 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>

          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/15">
              <Landmark className="h-6 w-6 text-white" />
            </div>
            
            <h2 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {currentMode === 'login' && 'Sign in to your account'}
              {currentMode === 'signup' && 'Create your FinSight account'}
              {currentMode === 'forgot' && 'Reset your password'}
            </h2>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              {currentMode === 'login' && (
                <>
                  New to FinSight?{' '}
                  <button onClick={() => { setCurrentMode('signup'); setError(null); }} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    Sign up for free
                  </button>
                </>
              )}
              {currentMode === 'signup' && (
                <>
                  Already registered?{' '}
                  <button onClick={() => { setCurrentMode('login'); setError(null); }} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    Sign in here
                  </button>
                </>
              )}
              {currentMode === 'forgot' && (
                <button onClick={() => { setCurrentMode('login'); setError(null); }} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 mt-1">
                  Back to login credentials
                </button>
              )}
            </p>
          </div>

          <div className="mt-8">
            {/* Demo Acc Pill */}
            {currentMode === 'login' && (
              <div className="mb-6 rounded-xl border border-indigo-200/55 bg-indigo-50/40 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                      Auditor Portfolio Sandbox Mode
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      Instantly pre-populate a gorgeous dashboard with realistic statement ledger sets (April - June 2026) using the credentials below.
                    </p>
                    <div className="pt-2 text-[11px] font-mono text-indigo-700 dark:text-indigo-300">
                      Email: <span className="font-semibold select-all">demo@finsight.ai</span> <br />
                      Pass: <span className="font-semibold select-all">demo123</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="mt-3.5 w-full flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  Log In as Demo Auditor
                </button>
              </div>
            )}

            {/* Error alerts */}
            {error && (
              <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
                {error}
              </div>
            )}

            {/* Success alerts */}
            {successMsg && (
              <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {currentMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Sterling"
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 shadow-xs placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 shadow-xs placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {currentMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    {currentMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setCurrentMode('forgot'); setError(null); }}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm text-slate-900 shadow-xs placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? 'Processing secure sync...' : (
                    <>
                      {currentMode === 'login' && 'Sign In'}
                      {currentMode === 'signup' && 'Create Free Account'}
                      {currentMode === 'forgot' && 'Send Recovery Link'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative Branding Banner (Right) */}
      <div className="relative hidden w-0 flex-1 lg:block bg-linear-to-tr from-indigo-950 via-slate-950 to-slate-900 overflow-hidden">
        {/* Glow elements */}
        <div className="absolute top-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-[250px] w-[250px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
              <Landmark className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              FinSight<span className="text-indigo-400">.AI</span>
            </span>
          </div>

          <div className="max-w-md space-y-6">
            <div className="inline-flex items-center gap-1 rounded-full bg-indigo-950/50 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-800/40">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Pro Auditing Engine Enabled
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight leading-normal">
              Accelerate parsing accuracy with customized banking schema learning.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              We translate unstructured raw financial transactions into fully categorized balance and cashflow metrics with over 98% accuracy.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono flex items-center justify-between border-t border-slate-900 pt-6">
            <span>✓ Verified AICPA Compliance</span>
            <span>✓ AES-256 Storage Standards</span>
          </div>
        </div>
      </div>
    </div>
  );
}

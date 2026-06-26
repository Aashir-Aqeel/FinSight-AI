import React from 'react';
import { Sparkles, LogOut, User as UserIcon, Shield, Moon, Sun, Menu, X, Landmark } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Navbar({
  user,
  onLogout,
  onNavigate,
  activeTab,
  darkMode,
  setDarkMode,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigationItems = user
    ? [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'upload', label: 'Upload' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'profile', label: 'Profile' },
      ]
    : [
        { id: 'home', label: 'Features' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'faq', label: 'FAQ' },
      ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick(user ? 'dashboard' : 'home')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20">
              <Landmark className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                FinSight<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
              </span>
              <span className="hidden sm:block text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1 font-bold">
                Financial Intelligence
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition-all relative py-1 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="flex items-center gap-2">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 leading-tight">
                      {user.name}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="h-2.5 w-2.5" />
                      {user.subscriptionTier.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-800 dark:hover:bg-rose-950/30 cursor-pointer transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick('login')}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:shadow-indigo-500/10 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 shadow-lg dark:border-slate-800 dark:bg-slate-950 transition-all">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-base font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user ? (
              <div className="border-t border-slate-100 pt-4 mt-4 dark:border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <UserIcon className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="text-base font-semibold text-slate-950 dark:text-white">{user.name}</div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Pro Member</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-4 mt-4 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => handleNavClick('login')}
                  className="block w-full rounded-lg px-3 py-2 text-center text-base font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('signup')}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  <Sparkles className="h-5 w-5" />
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Check, 
  Shield, 
  Sparkles, 
  Key, 
  CreditCard,
  RotateCw,
  Building
} from 'lucide-react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
  token: string;
  onUpdateUser: (updatedUser: User) => void;
}

export default function ProfilePage({ user, token, onUpdateUser }: ProfilePageProps) {
  // Update Profile Name States
  const [name, setName] = useState(user.name);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Update Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileLoading(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      const data = await response.json();

      if (response.ok) {
        setProfileMsg({ type: 'success', text: 'Display profile settings updated.' });
        onUpdateUser(data.user);
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: 'Backend services offline.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await response.json();

      if (response.ok) {
        setPasswordMsg({ type: 'success', text: 'Security credentials synchronized.' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Incorrect current password input.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Backend services offline.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Security & Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your auditor profile settings, API tokens, and subscription tiers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left forms panel (8 Columns) */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Profile Name update card */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white mb-4">Auditor Profile Settings</h3>
            
            {profileMsg && (
              <div className={`mb-4 rounded-lg p-3 text-xs font-semibold border ${
                profileMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/15 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/15'
              }`}>
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Registered Email</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-xs text-slate-400 shadow-xs focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">To edit emails, contact compliance officers.</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  {profileLoading ? <RotateCw className="h-3.5 w-3.5 animate-spin" /> : null}
                  Save display changes
                </button>
              </div>
            </form>
          </div>

          {/* Password update card */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white mb-4">Credentials Synchronizer</h3>
            
            {passwordMsg && (
              <div className={`mb-4 rounded-lg p-3 text-xs font-semibold border ${
                passwordMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/15 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/15'
              }`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Key className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Min. 6 chars"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Key className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  {passwordLoading ? <RotateCw className="h-3.5 w-3.5 animate-spin" /> : null}
                  Sync Security Code
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right side info (4 Columns) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Subscription plan card */}
          <div className="rounded-xl border border-indigo-100 bg-linear-to-tr from-indigo-950 to-slate-950 p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 h-[120px] w-[120px] rounded-full bg-indigo-500/10 blur-xl" />
            
            <div className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                    <Sparkles className="h-2.5 w-2.5" />
                    Active Enterprise Tier
                  </span>
                  <h3 className="font-display text-lg font-black tracking-tight mt-2.5">FinSight Pro Analyst</h3>
                </div>
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <CreditCard className="h-4.5 w-4.5" />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                Your portfolio license is granted. Enjoy complete access to unlimited PDF, CSV OCR statement line parsers, and custom Gemini queries.
              </p>

              <div className="border-t border-slate-800/60 mt-5 pt-4 space-y-2 text-[10px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Billing Interval:</span>
                  <span className="text-white">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span>Token Allocation:</span>
                  <span className="text-white">500,000 / month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Shield card */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 dark:border-slate-800/60 dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Shield className="h-4 w-4 text-emerald-500" /> Auditor Credentials Guard
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Any security code changes trigger immediate session tokens validation. Keep credentials offline and do not share sandbox test tokens.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

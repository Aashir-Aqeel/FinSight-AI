import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import TransactionExplorer from './components/TransactionExplorer';
import UploadModule from './components/UploadModule';
import AnalyticsView from './components/AnalyticsView';
import ProfilePage from './components/ProfilePage';
import { User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // Read initial states from localStorage for robust UX
  useEffect(() => {
    const savedToken = localStorage.getItem('fs_token');
    const savedUserStr = localStorage.getItem('fs_user');
    const savedTab = localStorage.getItem('fs_active_tab');
    const savedTheme = localStorage.getItem('fs_theme');

    if (savedToken && savedUserStr) {
      setToken(savedToken);
      try {
        const parsedUser = JSON.parse(savedUserStr);
        setUser(parsedUser);
        // If authenticated and was on home/login/signup, jump to dashboard
        if (savedTab && !['home', 'login', 'signup'].includes(savedTab)) {
          setActiveTab(savedTab);
        } else {
          setActiveTab('dashboard');
        }
      } catch (e) {
        console.error("Failed to parse user session:", e);
      }
    } else if (savedTab) {
      setActiveTab(savedTab);
    }

    // Force theme to be always Elegant Dark
    setDarkMode(true);
  }, []);

  // Sync theme with HTML DOM element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('fs_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('fs_theme', 'light');
    }
  }, [darkMode]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('fs_active_tab', tab);
  };

  const handleAuthSuccess = (authUser: User, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    localStorage.setItem('fs_token', authToken);
    localStorage.setItem('fs_user', JSON.stringify(authUser));
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fs_token');
    localStorage.removeItem('fs_user');
    localStorage.removeItem('fs_active_tab');
    handleNavigate('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('fs_user', JSON.stringify(updatedUser));
  };

  const handleSelectFileIdForAnalysis = (fileId: string) => {
    setSelectedFileId(fileId);
  };

  const handleClearFileIdSelection = () => {
    setSelectedFileId(null);
  };

  const handleRefreshFeed = () => {
    // This is a callback pass for stats/summary sync alerts on updates
    console.log("Financial statement sync feed updated.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* Global Navigation bar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activeTab={activeTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Viewport Router */}
      <main className="flex-grow">
        {['home', 'pricing', 'faq'].includes(activeTab) && (
          <LandingPage onNavigate={handleNavigate} activeTab={activeTab} />
        )}

        {activeTab === 'login' && (
          <AuthPage
            mode="login"
            onAuthSuccess={handleAuthSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'signup' && (
          <AuthPage
            mode="signup"
            onAuthSuccess={handleAuthSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {/* Authenticated Routes Guard */}
        {user && token && (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                token={token}
                onNavigate={handleNavigate}
                onSelectFileIdForAnalysis={handleSelectFileIdForAnalysis}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionExplorer
                token={token}
                selectedFileId={selectedFileId}
                onClearFileIdSelection={handleClearFileIdSelection}
                onRefreshFeed={handleRefreshFeed}
              />
            )}

            {activeTab === 'upload' && (
              <UploadModule
                token={token}
                onNavigate={handleNavigate}
                onRefreshFeed={handleRefreshFeed}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView token={token} />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                user={user}
                token={token}
                onUpdateUser={handleUpdateUser}
              />
            )}
          </>
        )}
      </main>

      {/* Global Minimalist Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 dark:border-slate-800/80 dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <span>© 2026 FinSight AI. All rights reserved.</span>
          <div className="flex gap-6">
            <span>Security: AES-256 Enabled</span>
            <span>Compliance: SOC-2 Type II</span>
            <span>Model: Gemini 3.5 Flash</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

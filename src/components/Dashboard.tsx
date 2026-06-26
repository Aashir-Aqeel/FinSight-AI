import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  FileText, 
  AlertTriangle, 
  Cpu, 
  ArrowRight, 
  Calendar, 
  Download, 
  RotateCw, 
  CheckCircle2, 
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { AIAnalysisResult, FinancialStats } from '../types';

interface DashboardProps {
  token: string;
  onNavigate: (tab: string) => void;
  onSelectFileIdForAnalysis: (fileId: string) => void;
}

export default function Dashboard({ token, onNavigate, onSelectFileIdForAnalysis }: DashboardProps) {
  // Stats and charts states
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
  const [topMerchants, setTopMerchants] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  
  // AI states
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load dashboard dataset
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setSpendingByCategory(data.spendingByCategory);
        setTopMerchants(data.topMerchants);
        setMonthlyTrends(data.monthlyTrends);
        setRecentUploads(data.recentUploads);
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load existing analysis on load
  const fetchLatestAnalysis = async () => {
    try {
      const response = await fetch('/api/analysis/latest', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data);
      }
    } catch (err) {
      // It is okay if no analysis is initially generated
      console.log("No initial analysis found.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchLatestAnalysis();
  }, [token]);

  // Run Gemini analysis dynamically
  const triggerAIAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch('/api/analysis/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      const data = await response.json();
      if (response.ok) {
        setAiAnalysis(data);
        fetchDashboardData(); // Refresh metrics since anomalies or calculations might sync
      } else {
        setAiError(data.error || "AI Generation limit reached. Contact engineering.");
      }
    } catch (err) {
      setAiError("Database or network socket unavailable. Try shortly.");
    } finally {
      setAiLoading(false);
    }
  };

  // Dynamic pie chart colors
  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RotateCw className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Assembling bank feeds & transaction data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Overview Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time liquidity buffer coverage and AI audits.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Sync Ledger
          </button>
          
          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Upload Statement
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {/* Card 1: Uploaded */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statements</span>
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.totalUploaded}</span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Audit Ledger Files</span>
            </div>
          </div>

          {/* Card 2: Income */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inflows</span>
              <div className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                ${stats.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
                <TrendingUp className="h-3 w-3" /> Fully Parsed
              </span>
            </div>
          </div>

          {/* Card 3: Expenses */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outflows</span>
              <div className="rounded-lg bg-rose-50 p-1.5 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                ${stats.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-0.5 mt-1">
                <TrendingDown className="h-3 w-3" /> Operating Costs
              </span>
            </div>
          </div>

          {/* Card 4: Net cash flow */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Surplus</span>
              <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className={`text-2xl font-extrabold font-mono ${stats.netCashFlow >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-500'}`}>
                ${stats.netCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Cash Inflow - Outflow</span>
            </div>
          </div>

          {/* Card 5: Savings Rate */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Savings Velocity</span>
              <div className="rounded-lg bg-teal-50 p-1.5 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2.5">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{stats.savingsRate}%</span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-1">Capital Accumulation</span>
            </div>
          </div>
        </div>
      )}

      {/* AI Controls & Executive Summary Box */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/35 dark:border-indigo-900/40 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/20 p-6 shadow-sm">
        
        {/* Animated scanning lines during AI generation */}
        {aiLoading && (
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden">
            <div className="w-full h-0.5 bg-indigo-500/80 scanning-line" />
            <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-[0.5px] animate-pulse" />
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-5 border-b border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-md text-white">
              <Cpu className={`h-5.5 w-5.5 ${aiLoading ? 'animate-spin-slow' : ''}`} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30">
                <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                Gemini 3.5 Flash Model Linked
              </span>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Intelligent Financial Statement AI Audit
              </h2>
            </div>
          </div>

          <button
            onClick={triggerAIAnalysis}
            disabled={aiLoading}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
          >
            {aiLoading ? 'Synthesizing Statement Data...' : 'Run Generative AI Analysis'}
            <Sparkles className="h-4 w-4" />
          </button>
        </div>

        {/* AI Output Panels */}
        <div className="mt-6">
          {aiError && (
            <div className="rounded-lg bg-rose-50 p-4 text-xs font-medium text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
              {aiError}
            </div>
          )}

          {aiAnalysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Executive summary block */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Executive Summary</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {aiAnalysis.executiveSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Spend insights */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">Key Expenditure Trends</h4>
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                      {aiAnalysis.spendingInsights.map((insight, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cash flow observations */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-3">Reserves & Liquidity</h4>
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                      {aiAnalysis.cashFlowObservations.map((obs, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Gaps auditing */}
                {aiAnalysis.missingInformation && aiAnalysis.missingInformation.length > 0 && (
                  <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Auditing Gaps Identified
                    </h4>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {aiAnalysis.missingInformation.map((item, idx) => (
                        <li key={idx}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Anomalies Security Panel (Right) */}
              <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-slate-100 lg:pl-6 dark:border-slate-850">
                <div>
                  <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 animate-pulse" /> Anomalies Security Panel
                  </h3>
                  
                  {aiAnalysis.anomalies.length === 0 ? (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4 text-center dark:border-emerald-950/20 dark:bg-emerald-950/10">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Clean Ledger Health</p>
                      <p className="text-[10px] text-slate-500 mt-1">No billing anomalies or duplications flagged across parsed rows.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {aiAnalysis.anomalies.map((an, i) => (
                        <div key={i} className="rounded-xl border border-slate-100 bg-white p-4 shadow-2xs dark:border-slate-800/50 dark:bg-slate-900/40">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">{an.description}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              an.severity === 'high' 
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400' 
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
                            }`}>
                              {an.severity} risk
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-normal">
                            {an.reason}
                          </div>
                          <div className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300 mt-2">
                            Disputed Outflow: <span className="text-rose-500 font-extrabold">${an.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audit Score Pill */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Score</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Categorization confidence ratio</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border-4 border-indigo-600/30 flex items-center justify-center font-mono font-black text-slate-900 dark:text-white text-sm bg-indigo-50 dark:bg-indigo-950">
                    {aiAnalysis.confidenceScore}%
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center dark:border-slate-800 dark:bg-slate-900/30">
              <Cpu className="h-10 w-10 text-slate-400 mx-auto mb-3 animate-pulse" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Run Generative AI Analysis</p>
              <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                Select run above. FinSight will evaluate categorized ledger feeds with Gemini to deliver strategic summaries, spending insight audits, and security anomaly audits.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main interactive charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Trend Area Chart (8 Columns) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Monthly Cash Flow Ratios</h3>
              <p className="text-xs text-slate-400 mt-0.5">Income vs Operating Expenses vs Accrued Savings.</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '11px'
                  }} 
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" name="Inflow (Salary/Freelance)" dataKey="income" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" name="Outflow (Expenses)" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie (4 Columns) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
          <h3 className="font-display text-base font-bold text-slate-950 dark:text-white mb-1">Expense Concentration</h3>
          <p className="text-xs text-slate-400 mb-6">Percentage allocation of total monthly expenditures.</p>

          <div className="h-56 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="amount"
                  nameKey="category"
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center metric */}
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Out</span>
              <span className="text-lg font-black font-mono text-slate-950 dark:text-white mt-1">
                ${stats?.totalExpenses ? Math.round(stats.totalExpenses).toLocaleString() : '0'}
              </span>
            </div>
          </div>

          {/* Key list */}
          <div className="space-y-2.5 mt-4 max-h-32 overflow-y-auto pr-1">
            {spendingByCategory.map((cat, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-[130px]">{cat.category}</span>
                </div>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                  ${Math.round(cat.amount).toLocaleString()} ({cat.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent uploads & Reports Downloader section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Uploads Table (8 Columns) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Recent Statement Uploads</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tracking recent document OCR ingestion logs.</p>
            </div>
            <button
              onClick={() => onNavigate('upload')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Upload Center <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider pb-2">
                  <th className="py-2.5">Document File</th>
                  <th>Ingestion Date</th>
                  <th>File Size</th>
                  <th>Parser Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {recentUploads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No files uploaded yet. Navigate to the statement uploader to ingest your ledger.
                    </td>
                  </tr>
                ) : (
                  recentUploads.map((file) => (
                    <tr key={file.id} className="text-slate-700 dark:text-slate-300">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]" title={file.filename}>{file.filename}</span>
                      </td>
                      <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
                      <td className="font-mono text-slate-500">{file.fileSize}</td>
                      <td>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            onSelectFileIdForAnalysis(file.id);
                            onNavigate('transactions');
                          }}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                        >
                          View Entries
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Exporter Panel (4 Columns) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white mb-1">Audit Ledger Exporter</h3>
            <p className="text-xs text-slate-400 mb-6">Download fully processed ledger ledgers or summarized briefs.</p>

            <div className="space-y-3">
              {/* CSV */}
              <a
                href={`/api/reports/download/csv?token=${token}`}
                download
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800/40 dark:bg-slate-950/40 dark:hover:bg-slate-900/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 group-hover:scale-105 transition-all">
                    <Download className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-950 dark:text-white">Audited Ledger Export</h4>
                    <p className="text-[10px] text-slate-400">Raw transaction rows in clean CSV</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* TXT Audit summary */}
              <a
                href={`/api/reports/download/txt?token=${token}`}
                download
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800/40 dark:bg-slate-950/40 dark:hover:bg-slate-900/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 group-hover:scale-105 transition-all">
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-950 dark:text-white">Executive Summarized Brief</h4>
                    <p className="text-[10px] text-slate-400">AI compliance brief in formatted text</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 dark:border-slate-850 pt-5 text-[10px] text-slate-400 font-mono flex items-center gap-1 justify-center">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> GAAP Compliant Ledgering Systems
          </div>
        </div>

      </div>

    </div>
  );
}

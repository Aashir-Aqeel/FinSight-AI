import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RotateCw, 
  PieChart as PieIcon, 
  BarChart4, 
  Sparkles, 
  CheckCircle2, 
  DollarSign,
  Percent,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { FinancialStats } from '../types';

interface AnalyticsViewProps {
  token: string;
}

export default function AnalyticsView({ token }: AnalyticsViewProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [spendingByCategory, setSpendingByCategory] = useState<any[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<any[]>([]);
  const [topMerchants, setTopMerchants] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analytics/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setSpendingByCategory(data.spendingByCategory);
        setIncomeByCategory(data.incomeByCategory);
        setTopMerchants(data.topMerchants);
        setMonthlyTrends(data.monthlyTrends);
      }
    } catch (err) {
      console.error("Load analytics failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RotateCw className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-sm font-semibold text-slate-500">Compiling ledger distributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Deep Financial Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Granular analysis of revenue sources, expense distributions, and merchant concentration profiles.
          </p>
        </div>
        
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Recompute Metrics
        </button>
      </div>

      {/* Main Bar Chart: Inflow vs Outflow comparison */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
        <div>
          <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Income vs Operating Outflows</h3>
          <p className="text-xs text-slate-400 mt-0.5">Month-by-month cash allocation comparison.</p>
        </div>

        <div className="h-80 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Bar name="Total Income Stream" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={25} />
              <Bar name="Operating Expenditures" dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two column grid: Top merchants & Income Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Merchants (Concentration risk) */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
          <div>
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Merchant Concentration Risk</h3>
            <p className="text-xs text-slate-400 mt-0.5">Top 5 payment terminals with the highest outflow density.</p>
          </div>

          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMerchants} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis dataKey="merchant" type="category" tick={{ fontSize: 10 }} stroke="#94a3b8" width={90} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '8px', 
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '11px'
                  }} 
                />
                <Bar name="Expenditure amount ($)" dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Sources breakdown */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
          <div>
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Inflow Revenue Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Allocation and breakdown of parsed income categories.</p>
          </div>

          <div className="h-64 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="amount"
                  nameKey="category"
                >
                  {incomeByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
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
          </div>

          {/* Key lists */}
          <div className="grid grid-cols-2 gap-4 mt-2 border-t border-slate-50 pt-4 dark:border-slate-800">
            {incomeByCategory.map((inc, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[(i + 3) % COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate max-w-[120px]">{inc.category}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-200">${Math.round(inc.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Line Chart: Savings Rate Trends over time */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs dark:border-slate-800/60 dark:bg-slate-900">
        <div>
          <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">Accrued Savings Run-Rate</h3>
          <p className="text-xs text-slate-400 mt-0.5">Historical saving velocity and liquidity margins.</p>
        </div>

        <div className="h-72 w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              <Line type="monotone" name="Savings Margin ($)" dataKey="savings" stroke="#a855f7" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

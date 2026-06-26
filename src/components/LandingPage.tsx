import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Shield, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Zap, 
  Cpu, 
  Download, 
  HelpCircle, 
  ChevronDown, 
  Check, 
  Lock, 
  FileSpreadsheet, 
  FileText, 
  Activity,
  UserCheck
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  activeTab?: string;
}

export default function LandingPage({ onNavigate, activeTab }: LandingPageProps) {
  // Scroll to active section on mount or tab change
  useEffect(() => {
    if (activeTab) {
      if (activeTab === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(activeTab);
        if (element) {
          // Add a small offset or delay if needed, but standard scrollIntoView works wonderfully
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, [activeTab]);

  // Sandbox Interactive States
  const [income, setIncome] = useState<number>(6500);
  const [expenses, setExpenses] = useState<number>(3800);
  const [savingsRate, setSavingsRate] = useState<number>(41.5);
  const [fileType, setFileType] = useState<'PDF' | 'CSV' | 'XLSX'>('PDF');

  // FAQs Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calculateSavingsRate = (inc: number, exp: number) => {
    if (inc <= 0) return 0;
    const rate = ((inc - exp) / inc) * 100;
    return parseFloat(rate.toFixed(1));
  };

  const handleIncomeChange = (val: number) => {
    setIncome(val);
    setSavingsRate(calculateSavingsRate(val, expenses));
  };

  const handleExpensesChange = (val: number) => {
    setExpenses(val);
    setSavingsRate(calculateSavingsRate(income, val));
  };

  // Generate dynamic, realistic AI comments based on sliders in real-time
  const getSimulatedAIInsight = () => {
    const net = income - expenses;
    const rate = savingsRate;

    if (net < 0) {
      return {
        score: 42,
        status: "Critical Deficit Alert",
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        message: `Your outflows exceed inflows by $${Math.abs(net).toLocaleString()}/mo. FinSight identifies your savings rate as ${rate}%. Critical recommendation: Restructure non-essential software SaaS contracts and discretionary dining accounts immediately to establish a 3-month operational capital reserve.`
      };
    }
    if (rate < 20) {
      return {
        score: 68,
        status: "Liquidity Buffer Concern",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        message: `Current savings rate of ${rate}% is below our benchmark of 25%. While you remain net positive by $${net.toLocaleString()}/mo, recurring utilities and housing represent over 65% of expenditures. FinSight suggests reviewing sub-category bills for potential optimizations.`
      };
    }
    return {
      score: 95,
      status: "High Efficiency Outperforms",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      message: `Excellent capitalization! Savings velocity at ${rate}% is outstanding, producing a positive net buffer of $${net.toLocaleString()}/month. FinSight recommends deploying surplus reserves to fixed-income accounts or diversified portfolios to outpace standard inflation benchmarks.`
    };
  };

  const insight = getSimulatedAIInsight();

  const testimonials = [
    {
      quote: "FinSight AI saved our finance team over 15 hours a week in manual bank ledger categorization. The AI categorization accuracy is incredible, matching our chart of accounts almost perfectly.",
      author: "Sarah Jenkins",
      role: "VP of Finance, ScaleOps",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "Uploading multi-page PDF statements used to be a nightmare of copy-pasting. FinSight parses them in seconds and immediately highlights anomalies like duplicate SaaS tool subscriptions.",
      author: "Marcus Chen",
      role: "Founder & CFO, Bento Ventures",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
    },
    {
      quote: "The visual interactive dashboards and audit-ready reports have become our go-to for quarterly investor reviews. Highly recommend this for growing startups.",
      author: "Elena Rostova",
      role: "Finance Director, Etheric AI",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
    }
  ];

  const faqs = [
    {
      q: "What statement file formats does FinSight AI support?",
      a: "We natively support PDF bank statements from over 120 global banking institutions, standard transaction CSV exports, and complex multi-sheet Excel files (.xlsx). Our intelligent OCR engine handles unstructured tabular data effortlessly."
    },
    {
      q: "How does the AI Analysis engine categorize transactions?",
      a: "Our parsing pipeline first normalizes raw statement entries, stripping out noisy payment terminal metadata. We then leverage the Gemini LLM with tailored structural banking schemas to categorize transactions with over 95% audit confidence and automatically detect duplicates or high-value anomalies."
    },
    {
      q: "Is my financial data secure with FinSight?",
      a: "Enterprise-grade safety is our foundation. All file uploads are encrypted in transit and at rest using AES-256 protocols. Your financial statement data is processed securely and is never used to train public foundational AI models."
    },
    {
      q: "Can I edit categories if the AI makes a mistake?",
      a: "Absolutely. Through our intuitive Transaction Explorer, you can search, filter, and manually re-categorize any transaction. The platform learns from your edits to increase future categorization accuracy."
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow Background Elements */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
        <div className="absolute top-1/3 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/5" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/30 mb-6">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Empowering Modern Fintech Workflows with Generative AI
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white max-w-4xl mx-auto leading-tight">
            Intelligent Financial Analysis <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Engineered for Clean Auditing
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload messy PDF bank statements, transaction CSVs, and Excel logs. Get normalized ledgers, audit-ready reports, duplicate duplicate detections, and deep AI spending insights instantly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('sandbox');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              Interactive Product Demo
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-16 border-t border-slate-200/60 pt-10 dark:border-slate-800/50 max-w-4xl mx-auto">
            <dl className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-4 text-center">
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Statements Parsed</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">1.2M+</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Average Audit Confidence</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 font-mono">98.4%</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Time Saved Weekly</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">15h+</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Secured Encrypted Storage</dt>
                <dd className="mt-1 text-3xl font-bold tracking-tight text-emerald-500 font-mono">AES-256</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Complete Ledger Cleansing & Financial Intelligence
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Our advanced algorithmic parser works hand-in-hand with leading language models to convert cluttered transaction records into executive dashboard intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-950/40 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-950 dark:text-white">Smart OCR Statement Parser</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Seamless PDF statement extraction. Drag bank PDFs, CSVs, or Excel files. Our algorithms clean headers, strip transaction text noise, and categorize instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-950/40 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-950 dark:text-white">Gemini LLM Auditing Insights</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generate high-impact executive summaries. Uncover hidden spending patterns, benchmark savings performance, and explore liquidity runway observations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-950/40 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-950 dark:text-white">Proactive Anomaly Security</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Immediately identify potential double charges, uncharacteristic merchant withdrawals, subscription spikes, and security risk terminals automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-950/40 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-950 dark:text-white">Dynamic Transaction Explorer</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Advanced search and deep filter operations. Easily search by merchants, modify transaction categories, apply custom dates, and audit records in real-time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-950/40 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-950 dark:text-white">Full Financial Analytics</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Interactive charts tracking monthly cash flow ratios, category trends, merchant concentration risks, and year-over-year income vs outlays.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800/50 dark:bg-slate-950/40 transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-950 dark:text-white">Downloadable Audited Reports</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Export audited ledgers in standard formats. Generate structured CSV expense reports or beautifully compiled plain-text Executive Summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Product Preview Section */}
      <section id="sandbox" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Control Panel (Sliders) */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/30 mb-4">
                  <Zap className="h-3.5 w-3.5" />
                  Live Preview Sandbox
                </div>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Test Drive Our <br />
                  <span className="text-indigo-600 dark:text-indigo-400">AI Analysis Engine</span>
                </h2>
                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  Tweak the parameters below to simulate a real financial statement upload. Watch our AI model formulate specialized compliance summaries and alerts on the fly.
                </p>
              </div>

              {/* Sliders Container */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Simulated Monthly Income</label>
                    <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">${income.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="15000" 
                    step="500"
                    value={income} 
                    onChange={(e) => handleIncomeChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>$1,000</span>
                    <span>$7,500</span>
                    <span>$15,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Simulated Monthly Expenditures</label>
                    <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">${expenses.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="15000" 
                    step="250"
                    value={expenses} 
                    onChange={(e) => handleExpensesChange(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>$500</span>
                    <span>$7,500</span>
                    <span>$15,000</span>
                  </div>
                </div>

                {/* File Type Selection Mock */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Select Upload Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['PDF', 'CSV', 'XLSX'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFileType(type)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          fileType === type 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-800/50 dark:text-indigo-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                      >
                        {type} Statement
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Response Display Box (Simulated Iframe/Dashboard) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800/80 dark:bg-slate-950 overflow-hidden">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 ml-2">statement_analysis_preview.bin</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/40 px-2.5 py-1 border border-indigo-100 dark:border-indigo-900/40">
                    <Cpu className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-spin-slow" />
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">AI Synced</span>
                  </div>
                </div>

                {/* Dashboard Screen */}
                <div className="p-6 space-y-6">
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/30">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Inflow</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">${income.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/30">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Outflow</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">${expenses.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/30">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Savings Rate</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{savingsRate}%</span>
                    </div>
                  </div>

                  {/* AI Feedback Box */}
                  <div className={`p-5 rounded-xl border transition-all ${insight.bg} ${insight.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className={`h-4.5 w-4.5 ${insight.color} animate-pulse`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${insight.color}`}>{insight.status}</span>
                      </div>
                      <div className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                        Model Confidence: <span className="text-slate-700 dark:text-slate-300">{insight.score}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                      {insight.message}
                    </p>
                  </div>

                  {/* Dynamic Categories Visualizer */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated Cost Centers</h4>
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          <span>Housing & Utilities</span>
                          <span className="font-mono">${(expenses * 0.55).toLocaleString(undefined, {maximumFractionDigits:0})} (55%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '55%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          <span>Operations & Subscriptions</span>
                          <span className="font-mono">${(expenses * 0.25).toLocaleString(undefined, {maximumFractionDigits:0})} (25%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '25%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          <span>Uncategorized Leakage</span>
                          <span className="font-mono">${(expenses * 0.20).toLocaleString(undefined, {maximumFractionDigits:0})} (20%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-400 rounded-full" style={{ width: '20%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Footer */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50/40 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/40 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-500" /> AES-256 Secure Pipeline</span>
                  <span className="font-mono text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => onNavigate('signup')}>
                    Generate Custom Reports <ArrowRight className="h-3 w-3 inline ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-100 dark:bg-slate-900/50 transition-colors border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              SaaS Pricing Suited to Your Volume
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
              No hidden broker fees or legacy license costs. Cancel or shift tiers at any point with simple month-to-month billing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Basic</h3>
                <p className="mt-2 text-xs text-slate-500">Perfect for single statement audits and manual exploration.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">$0</span>
                  <span className="ml-1 text-sm text-slate-500">/ forever</span>
                </div>

                <ul className="mt-6 space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800 text-sm">
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Up to 2 Statement Uploads / Mo
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Manual Categories Editing
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Basic Transaction Search & Sort
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 line-through">
                    <Check className="h-4 w-4 text-slate-300 shrink-0" />
                    AI Spending Observations
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 line-through">
                    <Check className="h-4 w-4 text-slate-300 shrink-0" />
                    Excel & PDF Export Reports
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onNavigate('signup')}
                className="mt-8 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Sign Up Free
              </button>
            </div>

            {/* Pro Plan (Best Value) */}
            <div className="relative rounded-2xl border-2 border-indigo-500 bg-white p-8 dark:bg-slate-950 flex flex-col justify-between shadow-lg shadow-indigo-500/5">
              <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-indigo-600 px-3.5 py-1 text-xs font-semibold text-white tracking-wide uppercase">
                Best Value
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Professional</h3>
                <p className="mt-2 text-xs text-slate-500">For ambitious professionals and active consultants seeking full AI analysis.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">$29</span>
                  <span className="ml-1 text-sm text-slate-500">/ month</span>
                </div>

                <ul className="mt-6 space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800 text-sm">
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <strong>Unlimited</strong> Uploads & Parsers
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <strong>Gemini AI</strong> Insights & Anomalies
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Full Interactive Charts & Dashboards
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Excel & PDF Audited Reports
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Auto-Learned Categorization Rules
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onNavigate('signup')}
                className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                Get Started Pro
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
                <p className="mt-2 text-xs text-slate-500">Tailored solutions for accounting firms and venture capital portfolios.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">$149</span>
                  <span className="ml-1 text-sm text-slate-500">/ month</span>
                </div>

                <ul className="mt-6 space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800 text-sm">
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    All Professional Features Included
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Dedicated API & Webhook Endpoints
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Custom Multi-User Accounts Roles
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Dedicated Account Manager support
                  </li>
                  <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    Custom SLA Up-Time Guarantees
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onNavigate('signup')}
                className="mt-8 w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                Contact Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Endorsed by Fast-Growing Finance Teams
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
              Hear how founders, CFOs, and bookkeepers leverage FinSight to skip hours of spreadsheet mapping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-6 dark:border-slate-800 dark:bg-slate-950/40">
                <p className="text-sm italic text-slate-600 dark:text-slate-400 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={t.avatar} alt={t.author} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.author}</h4>
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-850/40 transition-colors">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-4.5 text-left font-medium text-slate-950 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850/60 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-20 bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Upgrade Your Financial Auditing Velocity Today
          </h2>
          <p className="text-base text-indigo-200 max-w-xl mx-auto">
            Join hundreds of startup founders and CFOs leveraging FinSight AI. Parse, analyze, and generate professional reports in seconds.
          </p>
          <div className="flex items-center justify-center pt-4">
            <button
              onClick={() => onNavigate('signup')}
              className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-indigo-950 shadow-md hover:bg-indigo-50 transition-all cursor-pointer"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="text-[11px] text-indigo-300 font-mono pt-4 flex justify-center gap-4">
            <span>✓ No credit card required</span>
            <span>✓ Instant sandbox access</span>
            <span>✓ AES-256 data security</span>
          </div>
        </div>
      </section>
    </div>
  );
}

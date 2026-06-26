import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  ArrowUpDown, 
  CheckCircle2, 
  Plus, 
  X, 
  Calendar, 
  Tag, 
  AlertTriangle,
  RotateCw,
  TrendingUp,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionExplorerProps {
  token: string;
  selectedFileId: string | null;
  onClearFileIdSelection: () => void;
  onRefreshFeed: () => void;
}

export default function TransactionExplorer({ 
  token, 
  selectedFileId, 
  onClearFileIdSelection, 
  onRefreshFeed 
}: TransactionExplorerProps) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFileFilter, setSelectedFileFilter] = useState(selectedFileId || 'all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Drawer / Add Mutex States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Form Fields (For Create/Edit)
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMerchant, setFormMerchant] = useState('');
  const [formCategory, setFormCategory] = useState('Groceries');
  const [formAmount, setFormAmount] = useState('');
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');

  // Alert State
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Seed Categories List
  const CATEGORIES = [
    "Salary", "Freelance", "Housing", "Groceries", "Dining Out", 
    "Utilities", "Transportation", "SaaS Subscriptions", "Shopping", "Cash & ATM", "Uncategorized"
  ];

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Fetch transactions failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  useEffect(() => {
    if (selectedFileId) {
      setSelectedFileFilter(selectedFileId);
    }
  }, [selectedFileId]);

  // Handle Create manual record
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!formDate || !formDescription || !formAmount) {
      setFeedback({ type: 'error', msg: 'Please complete all required fields.' });
      return;
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: formDate,
          description: formDescription,
          merchant: formMerchant || formDescription.split(' ')[0],
          category: formCategory,
          amount: parseFloat(formAmount),
          type: formType
        })
      });

      if (response.ok) {
        setFeedback({ type: 'success', msg: 'Transaction added to secure ledger.' });
        setShowAddForm(false);
        // Reset form
        setFormDate('');
        setFormDescription('');
        setFormMerchant('');
        setFormAmount('');
        fetchTransactions();
        onRefreshFeed();
      } else {
        setFeedback({ type: 'error', msg: 'Failed to create transaction record.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Sockets unavailable.' });
    }
  };

  // Handle Edit PUT record
  const handleEditTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    setFeedback(null);

    try {
      const response = await fetch(`/api/transactions/${editingTx.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: formDate,
          description: formDescription,
          merchant: formMerchant,
          category: formCategory,
          amount: parseFloat(formAmount),
          type: formType
        })
      });

      if (response.ok) {
        setFeedback({ type: 'success', msg: 'Transaction record successfully synchronized.' });
        setEditingTx(null);
        fetchTransactions();
        onRefreshFeed();
      } else {
        setFeedback({ type: 'error', msg: 'Unauthorized or failed sync.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Network offline.' });
    }
  };

  // Trigger DELETE mutation
  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this financial entry from the audit trace?")) return;
    setFeedback(null);

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setFeedback({ type: 'success', msg: 'Entry deleted from transaction log.' });
        fetchTransactions();
        onRefreshFeed();
      } else {
        setFeedback({ type: 'error', msg: 'Failed to delete transaction.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Sockets timeout.' });
    }
  };

  const openEditDrawer = (tx: Transaction) => {
    setEditingTx(tx);
    setFormDate(tx.date);
    setFormDescription(tx.description);
    setFormMerchant(tx.merchant);
    setFormCategory(tx.category);
    setFormAmount(tx.amount.toString());
    setFormType(tx.type);
    setShowAddForm(false);
  };

  // Filter and Sort Computing logic
  const filteredTransactions = transactions.filter(tx => {
    // Search query match
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter match
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;

    // Type filter match
    const matchesType = selectedType === 'all' || tx.type === selectedType;

    // File selection match
    const matchesFile = selectedFileFilter === 'all' || tx.fileId === selectedFileFilter;

    // Date range match
    const txTime = new Date(tx.date).getTime();
    const matchesStartDate = !startDate || txTime >= new Date(startDate).getTime();
    const matchesEndDate = !endDate || txTime <= new Date(endDate).getTime();

    return matchesSearch && matchesCategory && matchesType && matchesFile && matchesStartDate && matchesEndDate;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  // Extract unique files list from currently stored transactions for easy filter dropdown
  const uniqueFileIds = Array.from(new Set(transactions.map(t => t.fileId).filter(Boolean)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Transaction Explorer
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search, sort, audit, and re-categorize statement ledgers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingTx(null);
              // Reset manual values
              setFormDate('');
              setFormDescription('');
              setFormMerchant('');
              setFormAmount('');
            }}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* File scope indicator when selecting a specific upload */}
      {selectedFileFilter !== 'all' && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-950/20 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Filtering by upload statement ID: <strong className="font-mono">{selectedFileFilter}</strong>
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedFileFilter('all');
              onClearFileIdSelection();
            }}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] hover:bg-white cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Action alerts */}
      {feedback && (
        <div className={`rounded-xl p-4 text-xs font-medium border ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/10 dark:text-emerald-400'
            : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/10 dark:text-rose-400'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Multi-Filter Bar Card */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900 space-y-4">
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Search Box */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search description, merchant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Flow Type Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cashflow Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white cursor-pointer"
            >
              <option value="all">Inflow & Outflow</option>
              <option value="income">Inflows Only</option>
              <option value="expense">Outflows Only</option>
            </select>
          </div>

          {/* Sort Selection */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Sequence</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-white cursor-pointer"
            >
              <option value="date-desc">Newest Date first</option>
              <option value="date-asc">Oldest Date first</option>
              <option value="amount-desc">High Amount first</option>
              <option value="amount-asc">Low Amount first</option>
            </select>
          </div>

        </div>

        {/* Date Filters Expandable Accordion */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="font-bold text-slate-400">Date Range Filter:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
            <span className="text-slate-400">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {(startDate || endDate || searchQuery || selectedCategory !== 'all' || selectedType !== 'all') && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedFileFilter('all');
                onClearFileIdSelection();
              }}
              className="ml-auto text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

      </div>

      {/* Edit Drawer Modal */}
      {(showAddForm || editingTx) && (
        <div className="rounded-2xl border border-indigo-200/50 bg-indigo-50/10 p-6 dark:border-indigo-900/50 dark:bg-slate-950/40 animate-slide-in">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
              {editingTx ? `Edit Transaction: ${editingTx.description}` : 'Add New Financial Entry Record'}
            </h3>
            <button 
              onClick={() => { setShowAddForm(false); setEditingTx(null); }}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={editingTx ? handleEditTransaction : handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Transaction Date</label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Description Descriptor</label>
              <input
                type="text"
                required
                placeholder="e.g. Whole Foods Market"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Merchant Payer</label>
              <input
                type="text"
                placeholder="e.g. Whole Foods"
                value={formMerchant}
                onChange={(e) => setFormMerchant(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Category Tag</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Transaction Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="145.20"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Entry ledger Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="mt-1 block w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white cursor-pointer"
              >
                <option value="expense">Outflow (Expense)</option>
                <option value="income">Inflow (Income)</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setEditingTx(null); }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 cursor-pointer"
              >
                {editingTx ? 'Update Sync' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main ledger Table Card */}
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-xs dark:border-slate-800/60 dark:bg-slate-900 overflow-hidden">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Entry details</th>
                <th className="py-3">Date</th>
                <th className="py-3">Payer/Merchant</th>
                <th className="py-3">Audit Category</th>
                <th className="py-3 text-right">Value Amount</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <RotateCw className="h-6 w-6 animate-spin text-indigo-500 mx-auto mb-2" />
                    Syncing live transaction history...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No transactions matching filter criteria. Create or upload some records to explore.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-950/20 text-slate-700 dark:text-slate-300 transition-colors ${
                      tx.isAnomaly ? 'bg-rose-500/[0.02] border-l-2 border-l-rose-500' : ''
                    }`}
                  >
                    
                    {/* Desc */}
                    <td className="py-3.5 px-6 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      {tx.type === 'income' ? (
                        <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-lg bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 flex items-center justify-center shrink-0">
                          <TrendingDown className="h-3.5 w-3.5" />
                        </div>
                      )}
                      
                      <div className="truncate max-w-[200px]">
                        <p className="truncate" title={tx.description}>{tx.description}</p>
                        {tx.isAnomaly && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-rose-500 uppercase tracking-wide mt-0.5 animate-pulse">
                            <AlertTriangle className="h-2.5 w-2.5" /> {tx.anomalyReason || 'FLAGGED OUTLIER'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="font-mono text-slate-500 text-[11px]">
                      {tx.date}
                    </td>

                    {/* Merchant */}
                    <td className="font-semibold text-slate-800 dark:text-slate-200">
                      {tx.merchant}
                    </td>

                    {/* Category Tag */}
                    <td>
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <Tag className="h-2.5 w-2.5" />
                        {tx.category}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className={`font-mono text-right font-extrabold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    {/* Actions */}
                    <td className="text-right px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditDrawer(tx)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
                          title="Edit transaction category"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic footer summary stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50/40 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-850 text-[11px] text-slate-400 font-mono gap-3">
          <span>Showing {filteredTransactions.length} of {transactions.length} total entries</span>
          <div className="flex gap-4">
            <span>Inflows: <strong className="text-emerald-500">${Math.round(filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)).toLocaleString()}</strong></span>
            <span>Outflows: <strong className="text-slate-700 dark:text-slate-300">${Math.round(filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)).toLocaleString()}</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
}

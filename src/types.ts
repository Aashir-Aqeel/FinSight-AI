export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'analyst';
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  avatarUrl?: string;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  filename: string;
  fileType: 'pdf' | 'csv' | 'xlsx' | 'bank';
  fileSize: string;
  uploadDate: string;
  status: 'processing' | 'parsed' | 'failed';
  transactionCount?: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  fileId?: string;
  confidence: number; // confidence in categorization/parsing (0 to 1)
  isAnomaly?: boolean;
  anomalyReason?: string;
}

export interface SpendingCategorySummary {
  category: string;
  amount: number;
  percentage: number;
  type: 'income' | 'expense';
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface AIAnalysisResult {
  id: string;
  fileId?: string;
  executiveSummary: string;
  spendingInsights: string[];
  topExpenseCategories: { category: string; amount: number; percentage: number }[];
  cashFlowObservations: string[];
  anomalies: { description: string; amount: number; severity: 'low' | 'medium' | 'high'; reason: string }[];
  missingInformation: string[];
  confidenceScore: number;
  savingsRate: number;
  netCashFlow: number;
  generatedAt: string;
}

export interface FinancialStats {
  totalUploaded: number;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  savingsRate: number;
}

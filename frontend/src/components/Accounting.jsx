import React, { useState, useEffect, useMemo } from 'react';
import { LineChart as ChartIcon, Receipt, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Download, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api/endpoints';

export default function Accounting() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [mReq, oReq, eReq] = await Promise.all([
          api.dashboard.metrics(),
          api.orders.list(),
          api.expenses.list()
        ]);
        setMetrics(mReq);
        setOrders(oReq);
        setExpenses(eReq);
      } catch {
        setError('Failed to load financial records.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  const displayMetrics = metrics || { total_sales: 0, pending_expenses: 0 };
  
  // Combine orders and expenses into a unified ledger
  const ledgerEntries = useMemo(() => {
    const revenueEntries = orders.map(o => ({
      id: `rev-${o.id}`,
      date: new Date(o.created_at).toLocaleDateString(),
      desc: `Order #ORD-${o.id.toString().padStart(4, '0')} (${o.customer_name})`,
      category: 'Sales Revenue',
      amount: Number.parseFloat(o.total_amount),
      type: 'revenue'
    }));

    const expenseEntries = expenses.map(e => ({
      id: `exp-${e.id}`,
      date: new Date(e.submitted_at || Date.now()).toLocaleDateString(),
      desc: e.title,
      category: e.category,
      amount: -Number.parseFloat(e.amount),
      type: 'expense'
    }));

    return [...revenueEntries, ...expenseEntries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
  }, [orders, expenses]);

  const totalExpenses = expenses.reduce((acc, curr) => acc + Number.parseFloat(curr.amount), 0);
  const netProfit = displayMetrics.total_sales - totalExpenses;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Reconciling Ledgers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
              <ChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Financials & Accounting</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track your Profit & Loss and business expenses.</p>
            </div>
          </div>
          <button className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Net Profit</span>
                <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign className="w-4 h-4" /></span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mt-3">{formatCurrency(netProfit)}</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center mt-2"><ArrowUpRight className="w-3 h-3 mr-1"/> Live Calculation</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Revenue</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Wallet className="w-4 h-4" /></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">{formatCurrency(displayMetrics.total_sales)}</h3>
              <p className="text-xs text-blue-600 font-medium flex items-center mt-2">All-time sales</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Expenses</span>
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Receipt className="w-4 h-4" /></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">{formatCurrency(totalExpenses)}</h3>
              <p className="text-xs text-rose-600 font-medium flex items-center mt-2">Total recognized</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Pending Actions</span>
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><ChartIcon className="w-4 h-4" /></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">{displayMetrics.pending_expenses}</h3>
              <p className="text-xs text-slate-500 font-medium mt-2">Expenses to approve</p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white border text-left border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800">Unified Transaction Ledger</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                <tr>
                  <th className="px-6 py-4 font-bold text-left">Date</th>
                  <th className="px-6 py-4 font-bold text-left">Description</th>
                  <th className="px-6 py-4 font-bold text-left">Category</th>
                  <th className="px-6 py-4 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerEntries.length > 0 ? ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{entry.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{entry.desc}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        entry.type === 'revenue' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {entry.category}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${entry.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {entry.type === 'revenue' ? '+' : ''}{formatCurrency(entry.amount)}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">No transactions recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Receipt, Plus, Search, Edit, Trash2, X, CheckCircle, Clock,
  XCircle, DollarSign, TrendingUp, AlertTriangle, Filter, Download,
  Plane, Coffee, Car, Monitor, Users, ShoppingBag, Loader2, AlertCircle
} from 'lucide-react';
import { api } from '../api/endpoints';

// ─── CATEGORY CONFIG ─────────────────────────────────────────
const CATEGORIES = [
  { label: 'Travel', icon: Plane, color: 'text-blue-600 bg-blue-50', border: 'border-blue-200' },
  { label: 'Meals', icon: Coffee, color: 'text-amber-600 bg-amber-50', border: 'border-amber-200' },
  { label: 'Transport', icon: Car, color: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-200' },
  { label: 'Software', icon: Monitor, color: 'text-violet-600 bg-violet-50', border: 'border-violet-200' },
  { label: 'Team Events', icon: Users, color: 'text-pink-600 bg-pink-50', border: 'border-pink-200' },
  { label: 'Office Supplies', icon: ShoppingBag, color: 'text-slate-600 bg-slate-100', border: 'border-slate-200' },
];

const getCategoryConfig = (label) => CATEGORIES.find(c => c.label === label) || CATEGORIES[5];

const STATUS_CONFIG = {
  pending:  { color: 'bg-amber-100 text-amber-700 border-amber-200',   icon: Clock,         dot: 'bg-amber-400' },
  approved: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' },
  rejected: { color: 'bg-red-100 text-red-600 border-red-200',         icon: XCircle,       dot: 'bg-red-500' },
};

const avatarColors = ['bg-blue-100 text-blue-700','bg-purple-100 text-purple-700','bg-emerald-100 text-emerald-700','bg-rose-100 text-rose-700','bg-amber-100 text-amber-700'];
const getAvatarColor = (name) => avatarColors[(name || '').length % avatarColors.length];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', submitted_by: '', category: 'Travel', amount: '', status: 'pending', notes: '' });

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const data = await api.expenses.list();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expense reports.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

  // ─── KPI COMPUTATIONS ────────────────────────────────────────
  const totalAmount = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const approvedAmount = expenses.filter(e => e.status === 'approved').reduce((s, e) => s + Number(e.amount || 0), 0);
  const pendingAmount = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + Number(e.amount || 0), 0);
  const pendingCount = expenses.filter(e => e.status === 'pending').length;

  // ─── CRUD ────────────────────────────────────────────────────
  const openCreate = () => {
    setForm({ title: '', submitted_by: '', category: 'Travel', amount: '', status: 'pending', notes: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (exp) => {
    setForm({ 
      title: exp.title || '', 
      submitted_by: exp.submitted_by || '', 
      category: exp.category || 'Travel', 
      amount: exp.amount || '', 
      status: exp.status || 'pending', 
      notes: exp.notes || '' 
    });
    setEditingId(exp.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.expenses.delete(id);
      setExpenses(expenses.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete expense.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (editingId) {
        const updated = await api.expenses.update(editingId, payload);
        setExpenses(expenses.map(exp => exp.id === editingId ? updated : exp));
      } else {
        const created = await api.expenses.create(payload);
        setExpenses([created, ...expenses]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save expense.');
    }
  };

  const handleApprove = async (id) => {
    try {
      const updated = await api.expenses.approve(id);
      setExpenses(expenses.map(e => e.id === id ? updated : e));
    } catch (err) {
      alert('Failed to approve.');
    }
  };

  const handleReject = async (id) => {
    try {
      const updated = await api.expenses.reject(id);
      setExpenses(expenses.map(e => e.id === id ? updated : e));
    } catch (err) {
      alert('Failed to reject.');
    }
  };

  // ─── FILTERING ───────────────────────────────────────────────
  const filtered = expenses.filter(e => {
    const matchSearch = (e.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.submitted_by || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || (e.status || '').toLowerCase() === filterStatus.toLowerCase();
    const matchCat = filterCategory === 'All' || e.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  // ─── CATEGORY BREAKDOWN ──────────────────────────────────────
  const categoryTotals = CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.label).reduce((s, e) => s + Number(e.amount || 0), 0),
    count: expenses.filter(e => e.category === cat.label).length,
  })).filter(c => c.count > 0).sort((a, b) => b.total - a.total);

  const maxCatTotal = Math.max(...categoryTotals.map(c => c.total), 1);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin" />
          <p className="text-slate-500 font-medium">Processing Expense Claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 shadow-inner">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Expense Reports</h1>
              <p className="text-sm text-slate-500 mt-0.5">Submit, track, and approve employee expense claims.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={openCreate} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />Submit Expense
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchExpenses} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Submitted', value: formatCurrency(totalAmount), sub: `${expenses.length} expenses`, icon: DollarSign, border: 'border-slate-200', iconClass: 'text-slate-500 bg-slate-100' },
            { label: 'Approved', value: formatCurrency(approvedAmount), sub: `${expenses.filter(e=>e.status==='approved').length} expenses`, icon: CheckCircle, border: 'border-emerald-200', iconClass: 'text-emerald-600 bg-emerald-50' },
            { label: 'Pending Review', value: formatCurrency(pendingAmount), sub: `${pendingCount} awaiting approval`, icon: Clock, border: 'border-amber-200', iconClass: 'text-amber-600 bg-amber-50' },
            { label: 'Rejected', value: formatCurrency(expenses.filter(e=>e.status==='rejected').reduce((s,e)=>s+Number(e.amount),0)), sub: `${expenses.filter(e=>e.status==='rejected').length} expenses`, icon: XCircle, border: 'border-red-200', iconClass: 'text-red-500 bg-red-50' },
          ].map((kpi, i) => (
            <div key={i} className={`bg-white p-5 rounded-xl border ${kpi.border} shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                <div className={`p-1.5 rounded-lg ${kpi.iconClass}`}><kpi.icon className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 mt-3">{kpi.value}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Category Breakdown + Expense Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Category Bar Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-slate-400" />Spend by Category
            </h2>
            <div className="space-y-4">
              {categoryTotals.map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.color}`}>
                        <cat.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(cat.total)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${cat.color.split(' ')[1].replace('bg-', 'bg-').replace('-50', '-400')}`}
                      style={{ width: `${(cat.total / maxCatTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search expenses or employees..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 bg-white focus:ring-2 focus:ring-blue-100 outline-none">
                <option>All</option>
                {CATEGORIES.map(c => <option key={c.label}>{c.label}</option>)}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    <th className="px-5 py-3">Expense</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(exp => {
                    const cat = getCategoryConfig(exp.category);
                    const st = STATUS_CONFIG[exp.status];
                    return (
                      <tr key={exp.id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-5 py-4 max-w-[200px]">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${getAvatarColor(exp.submitted_by)}`}>
                              {(exp.submitted_by || 'U').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{exp.title}</p>
                              <p className="text-xs text-slate-400">{exp.submitted_by} · {new Date(exp.submitted_at || exp.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.color} ${cat.border}`}>
                            <cat.icon className="w-3 h-3 mr-1.5" />{exp.category}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-slate-900">{formatCurrency(exp.amount)}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${st?.color}`}>
                            {st?.icon && <st.icon className="w-3 h-3 mr-1" />}{exp.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            {exp.status === 'pending' && <>
                              <button onClick={() => handleApprove(exp.id)} title="Approve" className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleReject(exp.id)} title="Reject" className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><XCircle className="w-4 h-4" /></button>
                            </>}
                            <button onClick={() => openEdit(exp)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(exp.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">No expenses match your search or filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsModalOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close modal"
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                {editingId ? 'Edit Expense' : 'Submit New Expense'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label htmlFor="exp-title" className="block text-sm font-semibold text-slate-700 mb-1.5">Expense Description</label>
                <input id="exp-title" type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="e.g. Flight to Singapore" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp-submitted-by" className="block text-sm font-semibold text-slate-700 mb-1.5">Submitted By</label>
                  <input id="exp-submitted-by" type="text" value={form.submitted_by} onChange={e => setForm({...form, submitted_by: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required />
                </div>
                <div>
                  <label htmlFor="exp-amount" className="block text-sm font-semibold text-slate-700 mb-1.5">Amount ($)</label>
                  <input id="exp-amount" type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp-category" className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select id="exp-category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                    {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
                  </select>
                </div>
                 <div>
                  <label htmlFor="exp-status" className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select id="exp-status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm resize-none" rows={2} placeholder="Any additional context or justification..." />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98]">{editingId ? 'Save Changes' : 'Submit Expense'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

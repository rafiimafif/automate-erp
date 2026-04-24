import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Search, Edit, Trash2, X, CheckCircle, AlertTriangle, Clock, DollarSign, Users, Calendar, Loader2 } from 'lucide-react';
import { api } from '../api/endpoints';

const PLANS = ['Starter', 'Professional', 'Enterprise'];
const BILLING = ['Monthly', 'Annually'];

const avatarColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700', 'bg-rose-100 text-rose-700', 'bg-amber-100 text-amber-700'];
const getAvatarColor = (name) => avatarColors[(name || '').length % avatarColors.length];

const planConfig = {
  Starter:      { color: 'bg-slate-100 text-slate-600 border-slate-200', price: { Monthly: 29, Annually: 24 } },
  Professional: { color: 'bg-blue-100 text-blue-700 border-blue-200',   price: { Monthly: 79, Annually: 65 } },
  Enterprise:   { color: 'bg-violet-100 text-violet-700 border-violet-200', price: { Monthly: 199, Annually: 165 } },
};

const statusConfig = {
  Active:   { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  Trialing: { color: 'bg-blue-100 text-blue-700 border-blue-200',          icon: Clock },
  PastDue:  { color: 'bg-red-100 text-red-600 border-red-200',             icon: AlertTriangle },
  Canceled: { color: 'bg-slate-100 text-slate-500 border-slate-200',       icon: X },
};

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModal, setIsModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ customer: '', email: '', plan: 'Starter', billing: 'Monthly', status: 'Active', start_date: '', next_billing: '', seats: 1 });

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const data = await api.subscriptions.list();
      setSubs(data);
    } catch (err) {
      setError('Failed to fetch subscription data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  const activeSubs = subs.filter(s => s.status === 'Active' || s.status === 'Trialing');
  const totalMRR = activeSubs.reduce((s, sub) => {
    const plan = planConfig[sub.plan];
    if (!plan) return s;
    const price = plan.price[sub.billing] || 0;
    return s + (sub.billing === 'Annually' ? price * sub.seats / 12 : price * sub.seats);
  }, 0);

  const openCreate = () => {
    setForm({ customer: '', email: '', plan: 'Starter', billing: 'Monthly', status: 'Active', start_date: new Date().toISOString().split('T')[0], next_billing: '', seats: 1 });
    setEditingId(null);
    setIsModal(true);
  };

  const openEdit = (sub) => {
    setForm({ customer: sub.customer, email: sub.email, plan: sub.plan, billing: sub.billing, status: sub.status, start_date: sub.start_date, next_billing: sub.next_billing, seats: sub.seats });
    setEditingId(sub.id);
    setIsModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel and delete this subscription?')) return;
    try {
      await api.subscriptions.delete(id);
      setSubs(subs.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete subscription.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await api.subscriptions.update(editingId, form);
        setSubs(subs.map(s => s.id === editingId ? updated : s));
      } else {
        const created = await api.subscriptions.create(form);
        setSubs([created, ...subs]);
      }
      setIsModal(false);
    } catch (err) {
      alert('Failed to save subscription.');
    }
  };

  const filtered = subs.filter(s =>
    (filterStatus === 'All' || s.status === filterStatus) &&
    ((s.customer || '').toLowerCase().includes(searchTerm.toLowerCase()) || (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Syncing Subscription Engine...</p>
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
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 shadow-inner">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Subscriptions</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage recurring plans, billing cycles, and churn.</p>
            </div>
          </div>
          <button onClick={openCreate} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit">
            <Plus className="w-4 h-4 mr-2" />New Subscription
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Monthly Recurring Revenue', value: formatCurrency(totalMRR), icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Active Subscriptions', value: activeSubs.length, icon: CheckCircle, color: 'text-blue-600 bg-blue-50', border: 'border-blue-200' },
            { label: 'Total Seats Licensed', value: activeSubs.reduce((s,sub) => s + Number(sub.seats), 0), icon: Users, color: 'text-violet-600 bg-violet-50', border: 'border-violet-200' },
            { label: 'Past Due / Churn Risk', value: subs.filter(s => s.status === 'PastDue').length, icon: AlertTriangle, color: 'text-red-500 bg-red-50', border: 'border-red-200' },
          ].map((kpi, i) => (
            <div key={i} className={`bg-white p-5 rounded-xl border ${kpi.border} shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-start mb-3">
                <p className="text-sm font-medium text-slate-500 leading-snug">{kpi.label}</p>
                <div className={`p-1.5 rounded-lg flex-shrink-0 ${kpi.color}`}><kpi.icon className="w-4 h-4" /></div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search customers or emails..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
            {['All', 'Active', 'Trialing', 'PastDue', 'Canceled'].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${filterStatus === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Billing</th>
                  <th className="px-6 py-3">Seats</th>
                  <th className="px-6 py-3">MRR</th>
                  <th className="px-6 py-3">Next Billing</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(sub => {
                  const plan = planConfig[sub.plan] || planConfig.Starter;
                  const st = statusConfig[sub.status] || statusConfig.Active;
                  const mrr = (sub.billing === 'Annually' ? plan.price.Annually * sub.seats / 12 : plan.price.Monthly * sub.seats);
                  return (
                    <tr key={sub.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(sub.customer)}`}>{(sub.customer || '').charAt(0)}</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{sub.customer}</p>
                            <p className="text-xs text-slate-400">{sub.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full border ${plan.color}`}>{sub.plan}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{sub.billing}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-semibold text-slate-700">{sub.seats}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">{formatCurrency(mrr)}/mo</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-slate-600"><Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-300" />{sub.next_billing || '-'}</div>
                      </td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${st.color}`}><st.icon className="w-3 h-3 mr-1" />{sub.status}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(sub)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <RefreshCw className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No subscriptions matched your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setIsModal(false)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsModal(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close modal"
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center"><RefreshCw className="w-5 h-5 mr-2 text-violet-600" />{editingId ? 'Edit Subscription' : 'New Subscription'}</h2>
              <button onClick={() => setIsModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="sub-customer" className="block text-sm font-semibold text-slate-700 mb-1.5">Customer Name</label><input id="sub-customer" type="text" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
                <div><label htmlFor="sub-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label><input id="sub-email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label htmlFor="sub-plan" className="block text-sm font-semibold text-slate-700 mb-1.5">Plan</label><select id="sub-plan" value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none text-sm bg-white">{PLANS.map(p => <option key={p}>{p}</option>)}</select></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Billing</label><select value={form.billing} onChange={e => setForm({...form, billing: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none text-sm bg-white">{BILLING.map(b => <option key={b}>{b}</option>)}</select></div>
                <div><label htmlFor="sub-seats" className="block text-sm font-semibold text-slate-700 mb-1.5">Seats</label><input id="sub-seats" type="number" min="1" value={form.seats} onChange={e => setForm({...form, seats: Number.parseInt(e.target.value) || 1})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none text-sm bg-white" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none text-sm bg-white"><option>Active</option><option>Trialing</option><option>PastDue</option><option>Canceled</option></select></div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Next Billing (Optional)</label>
                <input type="date" value={form.next_billing || ''} onChange={e => setForm({...form, next_billing: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none text-sm bg-white" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm">
                  {editingId ? 'Save Changes' : 'Create Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

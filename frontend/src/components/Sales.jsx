import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Filter, Download, ArrowUpRight, Edit, Trash2, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api/endpoints';

export default function Sales() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ customer_name: '', customer_email: '', amount: '', status: 'pending' });

  // Format currency
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await api.orders.list();
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sales data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Dynamic Stats calculations
  const stats = useMemo(() => {
    let totalRev = 0;
    let pendingCount = 0;
    let pendingAmt = 0;
    let overdueCount = 0;
    let overdueAmt = 0;

    invoices.forEach(inv => {
      const amt = Number(inv.total_amount);
      if (inv.status === 'paid') totalRev += amt;
      if (inv.status === 'pending') { pendingCount++; pendingAmt += amt; }
      if (inv.status === 'overdue') { overdueCount++; overdueAmt += amt; }
    });
    return { totalRev, pendingCount, pendingAmt, overdueCount, overdueAmt };
  }, [invoices]);

  // Filtering
  const filteredInvoices = invoices.filter(inv => 
    String(inv.id).includes(searchTerm) || 
    inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Handlers
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await api.orders.delete(id);
      setInvoices(invoices.filter(i => i.id !== id));
    } catch (err) {
      alert('Failed to delete invoice');
    }
  };

  const openCreateModal = () => {
    setFormData({ customer_name: '', customer_email: '', amount: '', status: 'pending' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (inv) => {
    setFormData({ 
      customer_name: inv.customer_name, 
      customer_email: inv.customer_email || '', 
      amount: inv.total_amount, 
      status: inv.status 
    });
    setEditingId(inv.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.amount) return;

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email || 'client@example.com',
        total_amount: parseFloat(formData.amount),
        status: formData.status.toLowerCase()
      };

      if (editingId) {
        const updated = await api.orders.update(editingId, payload);
        setInvoices(invoices.map(i => i.id === editingId ? updated : i));
      } else {
        const created = await api.orders.create(payload);
        setInvoices([created, ...invoices]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save invoice');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Sales Data...</p>
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
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sales & Invoices</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track your sales revenue, create and manage invoices.</p>
            </div>
          </div>
          <button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchInvoices} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:border-slate-300 transition-colors">
            <span className="text-sm font-medium text-slate-500">Collected Revenue</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(stats.totalRev)}</span>
            <div className="flex items-center mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 w-fit px-2.5 py-1 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              Solid Growth
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:border-slate-300 transition-colors">
            <span className="text-sm font-medium text-slate-500">Pending Invoices</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingCount}</span>
            <div className="flex items-center mt-3 text-xs font-medium text-slate-500">
              Awaiting {formatCurrency(stats.pendingAmt)} in payments
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 group-hover:w-1.5 transition-all"></div>
            <span className="text-sm font-medium text-red-600">Overdue Payments</span>
            <span className="text-3xl font-bold text-slate-900 mt-2">{stats.overdueCount}</span>
            <div className="flex items-center mt-3 text-xs font-medium text-red-500/80">
              Totaling {formatCurrency(stats.overdueAmt)}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Invoice ID or Client Name..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter Status
          </button>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4 cursor-pointer hover:text-slate-700">Invoice ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 flex items-center">
                      <FileText className="w-4 h-4 text-slate-300 mr-2" />
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">INV-{inv.id.toString().padStart(4, '0')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{inv.customer_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(inv.total_amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900">{new Date(inv.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(inv)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" 
                          title="Edit Invoice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" 
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      No invoices found. Click "Create Invoice" to add one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pop-up Modal Overlay */}
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
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                {editingId ? 'Edit Invoice' : 'Create New Invoice'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label htmlFor="sales-client" className="block text-sm font-semibold text-slate-700 mb-1.5">Client Name</label>
                <input 
                  id="sales-client"
                  type="text" 
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm"
                  placeholder="e.g. Wayne Enterprises"
                  required
                />
              </div>

              <div>
                <label htmlFor="sales-email" className="block text-sm font-semibold text-slate-700 mb-1.5">Client Email</label>
                <input 
                  id="sales-email"
                  type="email" 
                  value={formData.customer_email}
                  onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm"
                  placeholder="client@company.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="sales-amount" className="block text-sm font-semibold text-slate-700 mb-1.5">Amount ($)</label>
                  <input 
                    id="sales-amount"
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="sales-status" className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Status</label>
                  <select 
                    id="sales-status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all"
                >
                  {editingId ? 'Save Changes' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}

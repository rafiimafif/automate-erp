import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Plus, Filter, Download, ArrowUpRight, Edit, Trash2, X, FileText } from 'lucide-react';

const initialInvoices = [
  { id: 'INV-2024-001', client: 'Acme Corp', date: '2024-10-14', due: '2024-10-28', amount: 4500.00, status: 'Paid' },
  { id: 'INV-2024-002', client: 'Globex Inc', date: '2024-10-12', due: '2024-10-26', amount: 1250.00, status: 'Pending' },
  { id: 'INV-2024-003', client: 'Stark Industries', date: '2024-10-05', due: '2024-10-19', amount: 9800.00, status: 'Overdue' },
  { id: 'INV-2024-004', client: 'Wayne Enterprises', date: '2024-10-01', due: '2024-10-15', amount: 3450.00, status: 'Paid' },
];

export default function Sales() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ client: '', date: '', amount: '', status: 'Pending' });

  // Format currency
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Dynamic Stats calculations
  const stats = useMemo(() => {
    let totalRev = 0;
    let pendingCount = 0;
    let pendingAmt = 0;
    let overdueCount = 0;
    let overdueAmt = 0;

    invoices.forEach(inv => {
      if (inv.status === 'Paid') totalRev += Number(inv.amount);
      if (inv.status === 'Pending') { pendingCount++; pendingAmt += Number(inv.amount); }
      if (inv.status === 'Overdue') { overdueCount++; overdueAmt += Number(inv.amount); }
    });
    return { totalRev, pendingCount, pendingAmt, overdueCount, overdueAmt };
  }, [invoices]);

  // Filtering
  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Handlers
  const handleDelete = (id) => {
    setInvoices(invoices.filter(i => i.id !== id));
  };

  const openCreateModal = () => {
    setFormData({ client: '', date: new Date().toISOString().split('T')[0], amount: '', status: 'Pending' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (inv) => {
    setFormData({ client: inv.client, date: inv.date, amount: inv.amount, status: inv.status });
    setEditingId(inv.id);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.client || !formData.amount || !formData.date) return;

    // Generate Due Date (+14 days)
    const issueDate = new Date(formData.date);
    const dueDateObj = new Date(issueDate);
    dueDateObj.setDate(dueDateObj.getDate() + 14);
    const dueStr = dueDateObj.toISOString().split('T')[0];

    if (editingId) {
      // Update
      setInvoices(invoices.map(i => i.id === editingId ? { ...i, ...formData, due: dueStr } : i));
    } else {
      // Create new
      const newId = `INV-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
      const newInvoice = { id: newId, ...formData, due: dueStr };
      setInvoices([newInvoice, ...invoices]);
    }
    setIsModalOpen(false);
  };

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
                  <th className="px-6 py-4">Issued / Due</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 flex items-center">
                      <FileText className="w-4 h-4 text-slate-300 mr-2" />
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">{inv.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{inv.client}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(inv.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900">{inv.date}</span>
                        <span className="text-xs font-medium text-slate-400 mt-0.5">Due: {inv.due}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(inv.status)}`}>
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Name</label>
                <input 
                  type="text" 
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm"
                  placeholder="e.g. Wayne Enterprises"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount ($)</label>
                  <input 
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Issue Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Payment Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
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

import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Edit, Trash2, X, Package, FileText, CheckCircle, Clock, AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api/endpoints';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('suppliers');

  // Supplier Modal
  const [isSupplierModal, setIsSupplierModal] = useState(false);
  const [editingSupId, setEditingSupId] = useState(null);
  const [supForm, setSupForm] = useState({ name: '', contact_email: '', phone: '', country: '', category: 'Electronics', status: 'active' });

  // PO Modal
  const [isPOModal, setIsPOModal] = useState(false);
  const [editingPOId, setEditingPOId] = useState(null);
  const [poForm, setPOForm] = useState({ supplier: '', description: '', total_amount: '', status: 'pending' });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sups, pos] = await Promise.all([
        api.suppliers.list(),
        api.purchaseOrders.list()
      ]);
      setSuppliers(sups);
      setPurchaseOrders(pos);
    } catch (err) {
      setError('Failed to sync procurement data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inactive': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
      case 'pending': return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      case 'processing': return <Clock className="w-3.5 h-3.5 mr-1" />;
      default: return null;
    }
  };

  // Supplier CRUD
  const openCreateSupplier = () => { setSupForm({ name: '', contact_email: '', phone: '', country: '', category: 'Electronics', status: 'active' }); setEditingSupId(null); setIsSupplierModal(true); };
  const openEditSupplier = (s) => { setSupForm({ name: s.name || '', contact_email: s.contact_email || '', phone: s.phone || '', country: s.country || '', category: s.category || 'Electronics', status: s.status || 'active' }); setEditingSupId(s.id); setIsSupplierModal(true); };
  const deleteSupplier = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await api.suppliers.delete(id);
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (err) {
      alert('Failed to delete supplier.');
    }
  };
  const saveSupplier = async (e) => {
    e.preventDefault();
    try {
      if (editingSupId) {
        const updated = await api.suppliers.update(editingSupId, supForm);
        setSuppliers(suppliers.map(s => s.id === editingSupId ? updated : s));
      } else {
        const created = await api.suppliers.create(supForm);
        setSuppliers([created, ...suppliers]);
      }
      setIsSupplierModal(false);
    } catch (err) {
      alert('Failed to save supplier.');
    }
  };

  // PO CRUD
  const openCreatePO = () => { setPOForm({ supplier: suppliers[0]?.id || '', description: '', total_amount: '', status: 'pending' }); setEditingPOId(null); setIsPOModal(true); };
  const openEditPO = (po) => { setPOForm({ supplier: po.supplier, description: po.description, total_amount: po.total_amount, status: po.status }); setEditingPOId(po.id); setIsPOModal(true); };
  const deletePO = async (id) => {
    if (!window.confirm('Delete this purchase order?')) return;
    try {
      await api.purchaseOrders.delete(id);
      setPurchaseOrders(purchaseOrders.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete PO.');
    }
  };
  const savePO = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...poForm, total_amount: parseFloat(poForm.total_amount) };
      if (editingPOId) {
        const updated = await api.purchaseOrders.update(editingPOId, payload);
        setPurchaseOrders(purchaseOrders.map(p => p.id === editingPOId ? updated : p));
      } else {
        const created = await api.purchaseOrders.create(payload);
        setPurchaseOrders([created, ...purchaseOrders]);
      }
      setIsPOModal(false);
    } catch (err) {
      alert('Failed to save PO.');
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.contact_email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPOs = purchaseOrders.filter(p => 
    (p.supplier_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.id || '').toString().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Procurement Center...</p>
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
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Suppliers & Purchase Orders</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage vendors and track procurement orders.</p>
            </div>
          </div>
          <button
            onClick={activeSubTab === 'suppliers' ? openCreateSupplier : openCreatePO}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit"
          >
            <Plus className="w-4 h-4 mr-2" />
            {activeSubTab === 'suppliers' ? 'Add Supplier' : 'Create Purchase Order'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchData} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

        {/* Sub-tabs */}
        <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm p-1 w-fit">
          {[{ id: 'suppliers', label: 'Suppliers', icon: Truck }, { id: 'pos', label: 'Purchase Orders', icon: FileText }].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveSubTab(tab.id); setSearchTerm(''); }}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={activeSubTab === 'suppliers' ? 'Search suppliers...' : 'Search purchase orders...'} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Suppliers Table */}
        {activeSubTab === 'suppliers' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuppliers.map(s => (
                    <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">{s.name ? s.name.charAt(0) : 'S'}</div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{s.name}</p>
                            <p className="text-xs text-slate-400">SUP-{s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">{s.contact_email}</p>
                        <p className="text-xs text-slate-400">{s.phone}</p>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{s.category || 'N/A'}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(s.status || 'active')}`}>{s.status || 'Active'}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditSupplier(s)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => deleteSupplier(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSuppliers.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No suppliers found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* POs Table */}
        {activeSubTab === 'pos' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                    <th className="px-6 py-4">PO Number</th>
                    <th className="px-6 py-4">Supplier</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPOs.map(po => (
                    <tr key={po.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-slate-300 mr-2" />
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">PO-{1000 + po.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm font-medium text-slate-700">{po.supplier_name}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{po.description}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{po.order_date ? new Date(po.order_date).toLocaleDateString() : 'N/A'}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">{formatCurrency(po.total_amount)}</span></td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(po.status)}`}>
                          {getStatusIcon(po.status)}{po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditPO(po)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => deletePO(po.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPOs.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No purchase orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Supplier Modal */}
      {isSupplierModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setIsSupplierModal(false)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsSupplierModal(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close modal"
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center"><Truck className="w-5 h-5 mr-2 text-blue-600" />{editingSupId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
              <button onClick={() => setIsSupplierModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveSupplier} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Supplier Name</label><input type="text" value={supForm.name} onChange={e => setSupForm({...supForm, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Email</label><input type="email" value={supForm.contact_email} onChange={e => setSupForm({...supForm, contact_email: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label><input type="tel" value={supForm.phone} onChange={e => setSupForm({...supForm, phone: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Country</label><input type="text" value={supForm.country} onChange={e => setSupForm({...supForm, country: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label><input type="text" value={supForm.category} onChange={e => setSupForm({...supForm, category: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="e.g. Electronics" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={supForm.status} onChange={e => setSupForm({...supForm, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsSupplierModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98]">{editingSupId ? 'Save Changes' : 'Add Supplier'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO Modal */}
      {isPOModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setIsPOModal(false)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsPOModal(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close modal"
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600" />{editingPOId ? 'Edit Purchase Order' : 'Create Purchase Order'}</h2>
              <button onClick={() => setIsPOModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={savePO} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Supplier</label><select value={poForm.supplier} onChange={e => setPOForm({...poForm, supplier: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Order Description</label><input type="text" value={poForm.description || ''} onChange={e => setPOForm({...poForm, description: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="e.g. Wireless Headphones x50" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-1.5">Total Amount ($)</label><input type="number" step="0.01" value={poForm.total_amount || ''} onChange={e => setPOForm({...poForm, total_amount: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
              </div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={poForm.status} onChange={e => setPOForm({...poForm, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"><option value="pending">Pending</option><option value="processing">Processing</option><option value="delivered">Delivered</option></select></div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsPOModal(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98]">{editingPOId ? 'Save Changes' : 'Create PO'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

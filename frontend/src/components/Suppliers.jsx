import React, { useState } from 'react';
import { Truck, Plus, Search, Edit, Trash2, X, Package, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const initialSuppliers = [
  { id: 'SUP-001', name: 'TechStream Distribution', contact: 'Mark Ruffalo', email: 'mark@techstream.com', phone: '(555) 110-2233', category: 'Electronics', status: 'Active' },
  { id: 'SUP-002', name: 'OfficeWorld Wholesale', contact: 'Sarah Kim', email: 'sarah@officeworld.co', phone: '(555) 443-9900', category: 'Furniture', status: 'Active' },
  { id: 'SUP-003', name: 'Global Home Supplies', contact: 'James Burke', email: 'jb@globalhome.net', phone: '(555) 667-1234', category: 'Home Goods', status: 'Inactive' },
];

const initialPOs = [
  { id: 'PO-2024-001', supplier: 'TechStream Distribution', items: 'Wireless Headphones x50', date: '2024-10-10', total: 4500.00, status: 'Delivered' },
  { id: 'PO-2024-002', supplier: 'OfficeWorld Wholesale', items: 'Ergonomic Chair x10', date: '2024-10-14', total: 2490.00, status: 'Pending' },
  { id: 'PO-2024-003', supplier: 'TechStream Distribution', items: 'USB-C Cables x200', date: '2024-10-16', total: 900.00, status: 'Processing' },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState(initialPOs);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('suppliers');

  // Supplier Modal
  const [isSupplierModal, setIsSupplierModal] = useState(false);
  const [editingSupId, setEditingSupId] = useState(null);
  const [supForm, setSupForm] = useState({ name: '', contact: '', email: '', phone: '', category: 'Electronics', status: 'Active' });

  // PO Modal
  const [isPOModal, setIsPOModal] = useState(false);
  const [editingPOId, setEditingPOId] = useState(null);
  const [poForm, setPOForm] = useState({ supplier: '', items: '', date: '', total: '', status: 'Pending' });

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Inactive': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
      case 'Pending': return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      case 'Processing': return <Clock className="w-3.5 h-3.5 mr-1" />;
      default: return null;
    }
  };

  // Supplier CRUD
  const openCreateSupplier = () => { setSupForm({ name: '', contact: '', email: '', phone: '', category: 'Electronics', status: 'Active' }); setEditingSupId(null); setIsSupplierModal(true); };
  const openEditSupplier = (s) => { setSupForm({ name: s.name, contact: s.contact, email: s.email, phone: s.phone, category: s.category, status: s.status }); setEditingSupId(s.id); setIsSupplierModal(true); };
  const deleteSupplier = (id) => setSuppliers(suppliers.filter(s => s.id !== id));
  const saveSupplier = (e) => {
    e.preventDefault();
    if (editingSupId) {
      setSuppliers(suppliers.map(s => s.id === editingSupId ? { ...s, ...supForm } : s));
    } else {
      setSuppliers([{ id: `SUP-${Date.now()}`, ...supForm }, ...suppliers]);
    }
    setIsSupplierModal(false);
  };

  // PO CRUD
  const openCreatePO = () => { setPOForm({ supplier: suppliers[0]?.name || '', items: '', date: new Date().toISOString().split('T')[0], total: '', status: 'Pending' }); setEditingPOId(null); setIsPOModal(true); };
  const openEditPO = (po) => { setPOForm({ supplier: po.supplier, items: po.items, date: po.date, total: po.total, status: po.status }); setEditingPOId(po.id); setIsPOModal(true); };
  const deletePO = (id) => setPurchaseOrders(purchaseOrders.filter(p => p.id !== id));
  const savePO = (e) => {
    e.preventDefault();
    if (editingPOId) {
      setPurchaseOrders(purchaseOrders.map(p => p.id === editingPOId ? { ...p, ...poForm } : p));
    } else {
      const newId = `PO-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
      setPurchaseOrders([{ id: newId, ...poForm }, ...purchaseOrders]);
    }
    setIsPOModal(false);
  };

  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.contact.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredPOs = purchaseOrders.filter(p => p.supplier.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));

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
                          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">{s.name.charAt(0)}</div>
                          <div>
                            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{s.name}</p>
                            <p className="text-xs text-slate-400">{s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-700">{s.contact}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{s.category}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(s.status)}`}>{s.status}</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditSupplier(s)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => deleteSupplier(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                    <th className="px-6 py-4">Items</th>
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
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{po.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm font-medium text-slate-700">{po.supplier}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{po.items}</span></td>
                      <td className="px-6 py-4"><span className="text-sm text-slate-600">{po.date}</span></td>
                      <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">{formatCurrency(po.total)}</span></td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(po.status)}`}>
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
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Supplier Modal */}
      {isSupplierModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSupplierModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center"><Truck className="w-5 h-5 mr-2 text-blue-600" />{editingSupId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
              <button onClick={() => setIsSupplierModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveSupplier} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Supplier Name</label><input type="text" value={supForm.name} onChange={e => setSupForm({...supForm, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Contact Person</label><input type="text" value={supForm.contact} onChange={e => setSupForm({...supForm, contact: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label><input type="email" value={supForm.email} onChange={e => setSupForm({...supForm, email: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label><input type="tel" value={supForm.phone} onChange={e => setSupForm({...supForm, phone: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label><select value={supForm.category} onChange={e => setSupForm({...supForm, category: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"><option>Electronics</option><option>Furniture</option><option>Home Goods</option><option>Software</option></select></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={supForm.status} onChange={e => setSupForm({...supForm, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"><option>Active</option><option>Inactive</option></select></div>
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsPOModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600" />{editingPOId ? 'Edit Purchase Order' : 'Create Purchase Order'}</h2>
              <button onClick={() => setIsPOModal(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={savePO} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Supplier</label><select value={poForm.supplier} onChange={e => setPOForm({...poForm, supplier: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white">{suppliers.map(s => <option key={s.id}>{s.name}</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Items Description</label><input type="text" value={poForm.items} onChange={e => setPOForm({...poForm, items: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" placeholder="e.g. Wireless Headphones x50" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Order Date</label><input type="date" value={poForm.date} onChange={e => setPOForm({...poForm, date: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Total ($)</label><input type="number" step="0.01" value={poForm.total} onChange={e => setPOForm({...poForm, total: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm" required /></div>
              </div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label><select value={poForm.status} onChange={e => setPOForm({...poForm, status: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"><option>Pending</option><option>Processing</option><option>Delivered</option></select></div>
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

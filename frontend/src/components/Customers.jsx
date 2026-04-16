import React, { useState } from 'react';
import { Users, Search, Plus, Mail, Phone, Edit, Trash2, X } from 'lucide-react';

const initialCustomers = [
  { id: '1', name: 'Olivia Martin', company: 'TechNova Inc', email: 'olivia.m@technova.com', phone: '(555) 123-4567', spent: 12450.00, lastOrder: '2024-10-14' },
  { id: '2', name: 'Jackson Lee', company: 'Evergreen Logistics', email: 'j.lee@evergreen.co', phone: '(555) 987-6543', spent: 8200.00, lastOrder: '2024-10-10' },
  { id: '3', name: 'Sophia Chen', company: 'Radiant Design Studio', email: 'sophia@radiantds.com', phone: '(555) 456-7890', spent: 4100.00, lastOrder: '2024-09-28' },
];

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', spent: '' });

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avatarColors = ['bg-blue-100 text-blue-700 border-blue-200', 'bg-indigo-100 text-indigo-700 border-indigo-200', 'bg-purple-100 text-purple-700 border-purple-200', 'bg-emerald-100 text-emerald-700 border-emerald-200', 'bg-rose-100 text-rose-700 border-rose-200'];
  const getAvatarColor = (name) => avatarColors[name.length % avatarColors.length];

  const handleDelete = (id) => setCustomers(customers.filter(c => c.id !== id));

  const openCreateModal = () => {
    setFormData({ name: '', company: '', email: '', phone: '', spent: '0.00' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cust) => {
    setFormData({ name: cust.name, company: cust.company, email: cust.email, phone: cust.phone, spent: cust.spent });
    setEditingId(cust.id);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      setCustomers(customers.map(c => c.id === editingId ? { ...c, ...formData } : c));
    } else {
      const newId = `CUST-${Date.now()}`;
      setCustomers([{ id: newId, ...formData, lastOrder: new Date().toISOString().split('T')[0] }, ...customers]);
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Customers Directory</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage client relationships and contact details.</p>
            </div>
          </div>
          <button onClick={openCreateModal} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search customers by name, company, or email..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Last Order</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-blue-50/30 transition-colors group cursor-default">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm border shadow-sm ${getAvatarColor(customer.name)}`}>
                          {customer.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{customer.name}</span>
                          <span className="text-xs font-medium text-slate-400 mt-0.5">{customer.company}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1.5 text-sm text-slate-600">
                        <div className="flex items-center hover:text-blue-600 transition-colors cursor-pointer">
                          <Mail className="w-4 h-4 mr-2 text-slate-300" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-slate-500">
                          <Phone className="w-4 h-4 mr-2 text-slate-300" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(customer.spent)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{customer.lastOrder}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(customer)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="Edit Customer">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(customer.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Delete Customer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                   <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No customers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                {editingId ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" />
                </div>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-1.5">Starting Total Spent ($)</label>
                 <input type="number" step="0.01" value={formData.spent} onChange={(e) => setFormData({...formData, spent: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" placeholder="0.00" />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all">
                  {editingId ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { Users, Search, Plus, Mail, Phone, MoreHorizontal } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'Olivia Martin', company: 'TechNova Inc', email: 'olivia.m@technova.com', phone: '(555) 123-4567', spent: '$12,450.00', lastOrder: 'Oct 14, 2024' },
  { id: '2', name: 'Jackson Lee', company: 'Evergreen Logistics', email: 'j.lee@evergreen.co', phone: '(555) 987-6543', spent: '$8,200.00', lastOrder: 'Oct 10, 2024' },
  { id: '3', name: 'Sophia Chen', company: 'Radiant Design Studio', email: 'sophia@radiantds.com', phone: '(555) 456-7890', spent: '$4,100.00', lastOrder: 'Sep 28, 2024' },
  { id: '4', name: 'Marcus Johnson', company: 'Johnson & Co', email: 'marcus@johnsonco.net', phone: '(555) 234-5678', spent: '$24,900.00', lastOrder: 'Oct 15, 2024' },
  { id: '5', name: 'Isabella Williams', company: 'Global Solutions', email: 'isabella.w@globalsol.org', phone: '(555) 876-5432', spent: '$1,850.00', lastOrder: 'Aug 12, 2024' },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  // Generate a random background color class for avatars based on name length just for varied colors
  const avatarColors = ['bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700', 'bg-purple-100 text-purple-700', 'bg-emerald-100 text-emerald-700', 'bg-rose-100 text-rose-700'];
  const getAvatarColor = (name) => avatarColors[name.length % avatarColors.length];

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Customers Directory</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage client relationships and contact details.</p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm whitespace-nowrap w-fit">
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

        {/* Customer Directory Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Last Order</th>
                  <th className="px-6 py-4 text-center">More</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(customer.name)}`}>
                          {customer.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{customer.name}</span>
                          <span className="text-xs text-slate-500 mt-0.5">{customer.company}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{customer.spent}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{customer.lastOrder}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      <button className="p-1.5 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

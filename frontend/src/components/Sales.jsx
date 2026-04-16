import React, { useState } from 'react';
import { ShoppingCart, Search, Plus, Filter, Download, ArrowUpRight } from 'lucide-react';

const mockInvoices = [
  { id: 'INV-2024-001', client: 'Acme Corp', date: 'Oct 14, 2024', due: 'Oct 28, 2024', amount: '$4,500.00', status: 'Paid' },
  { id: 'INV-2024-002', client: 'Globex Inc', date: 'Oct 12, 2024', due: 'Oct 26, 2024', amount: '$1,250.00', status: 'Pending' },
  { id: 'INV-2024-003', client: 'Stark Industries', date: 'Oct 05, 2024', due: 'Oct 19, 2024', amount: '$9,800.00', status: 'Overdue' },
  { id: 'INV-2024-004', client: 'Wayne Enterprises', date: 'Oct 01, 2024', due: 'Oct 15, 2024', amount: '$3,450.00', status: 'Paid' },
];

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sales & Invoices</h1>
              <p className="text-sm text-slate-500 mt-0.5">Track your sales revenue and outstanding payments.</p>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm whitespace-nowrap w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-sm font-medium text-slate-500">Total Revenue (YTD)</span>
            <span className="text-2xl font-bold text-slate-900 mt-2">$124,500.00</span>
            <div className="flex items-center mt-3 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              14% vs Last Year
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <span className="text-sm font-medium text-slate-500">Pending Invoices</span>
            <span className="text-2xl font-bold text-slate-900 mt-2">12</span>
            <div className="flex items-center mt-3 text-xs font-medium text-slate-500">
              Awaiting $18,400.00 in payments
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-red-200 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <span className="text-sm font-medium text-red-600">Overdue Payments</span>
            <span className="text-2xl font-bold text-slate-900 mt-2">3</span>
            <div className="flex items-center mt-3 text-xs font-medium text-slate-500">
              Totaling $12,350.00
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Invoice ID or Client..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
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
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Issued / Due</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">{inv.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-700">{inv.client}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{inv.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900">{inv.date}</span>
                        <span className="text-xs text-slate-500 mt-0.5">Due: {inv.due}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="Download PDF">
                        <Download className="w-4 h-4" />
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

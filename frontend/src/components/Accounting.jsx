import React from 'react';
import { LineChart, Receipt, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';

export default function Accounting() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <LineChart className="w-5 h-5" />
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

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Net Profit</span>
                <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign className="w-4 h-4" /></span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mt-3">$42,850</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center mt-2"><ArrowUpRight className="w-3 h-3 mr-1"/> 18.2% vs last quarter</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Revenue</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Wallet className="w-4 h-4" /></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">$124,500</h3>
              <p className="text-xs text-emerald-600 font-medium flex items-center mt-2"><ArrowUpRight className="w-3 h-3 mr-1"/> 12.5%</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Expenses</span>
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Receipt className="w-4 h-4" /></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">$81,650</h3>
              <p className="text-xs text-rose-600 font-medium flex items-center mt-2"><ArrowDownRight className="w-3 h-3 mr-1"/> 4.3%</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500">Cash Flow</span>
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><LineChart className="w-4 h-4" /></span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mt-4">Positive</h3>
              <p className="text-xs text-slate-500 font-medium mt-2">Operating efficiently</p>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white border text-left border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800">Recent Ledger Transactions</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500">Oct 16, 2024</td>
                <td className="px-6 py-4 font-medium text-slate-900">AWS Cloud Hosting</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">Software Infrastructure</span></td>
                <td className="px-6 py-4 text-right font-medium text-rose-600">-$945.00</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500">Oct 15, 2024</td>
                <td className="px-6 py-4 font-medium text-slate-900">Invoice Payment: Acme Corp</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs border border-emerald-100">Sales Revenue</span></td>
                <td className="px-6 py-4 text-right font-bold text-emerald-600">+$4,500.00</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500">Oct 12, 2024</td>
                <td className="px-6 py-4 font-medium text-slate-900">Office Supplies</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">Operations</span></td>
                <td className="px-6 py-4 text-right font-medium text-rose-600">-$210.45</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

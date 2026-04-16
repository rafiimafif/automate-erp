import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Bell, 
  Search, 
  Plus, 
  Activity, 
  DollarSign
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            automateERP
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'sales', label: 'Sales & Invoices', icon: ShoppingCart },
            { id: 'customers', label: 'Customers', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* User Profile Hook */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-500">View profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Quick Action
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Overview</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Revenue', value: '$45,231', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-600' },
                { label: 'Active Orders', value: '34', trend: '+5.2%', icon: ShoppingCart, color: 'text-blue-600' },
                { label: 'Low Stock Items', value: '12', trend: '-2.4%', icon: Package, color: 'text-amber-600' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                      <h3 className="text-2xl font-bold mt-2">{kpi.value}</h3>
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-50 ${kpi.color}`}>
                      <kpi.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-emerald-600 font-medium">{kpi.trend}</span>
                    <span className="text-slate-500 ml-2">vs last month</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions Panel */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-1">
                <h2 className="text-lg font-semibold mb-4 text-slate-800">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center group">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Create Invoice</p>
                      <p className="text-xs text-slate-500">Draft a new customer bill</p>
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors flex items-center group">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-700">Add Stock</p>
                      <p className="text-xs text-slate-500">Update inventory count</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-slate-400" />
                    Recent Activity
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
                </div>
                <div className="space-y-6">
                  {[
                    { action: 'Created new invoice #INV-402', time: '10 mins ago', user: 'Admin' },
                    { action: 'Updated stock for "Wireless Headphones"', time: '2 hours ago', user: 'John Doe' },
                    { action: 'Added 5 new products to category', time: '5 hours ago', user: 'Admin' },
                  ].map((log, i) => (
                    <div key={i} className="flex relative">
                      {i !== 2 && <div className="absolute top-6 left-3.5 w-px h-full bg-slate-200"></div>}
                      <div className="relative z-10 w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-500 mt-0.5 shadow-sm">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-800">{log.action}</p>
                        <p className="text-xs text-slate-500 mt-1">{log.user} • {log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

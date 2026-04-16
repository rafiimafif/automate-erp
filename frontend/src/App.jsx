import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Bell, Search, Plus, LogOut,
  Kanban, Truck, LineChart, Briefcase, Blocks, Grid3x3, ArrowLeft, FolderKanban, Receipt, Monitor, RefreshCw
} from 'lucide-react';

import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Pipeline from './components/Pipeline';
import Accounting from './components/Accounting';
import Suppliers from './components/Suppliers';
import HR from './components/HR';
import Integrations from './components/Integrations';
import Projects from './components/Projects';
import Expenses from './components/Expenses';
import POS from './components/POS';
import Subscriptions from './components/Subscriptions';
import Login from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState(null); // null = show Home/App Launcher

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // When activeTab is null, show the App Launcher
  const isHome = activeTab === null;

  const navGroups = [
    {
      title: 'Core Business',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'sales', label: 'Sales & Invoices', icon: ShoppingCart },
        { id: 'pipeline', label: 'Sales Pipeline', icon: Kanban },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'projects', label: 'Project Management', icon: FolderKanban },
      ]
    },
    {
      title: 'Commerce',
      items: [
        { id: 'pos', label: 'Point of Sale', icon: Monitor },
        { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'suppliers', label: 'Suppliers & POs', icon: Truck },
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'accounting', label: 'Financials', icon: LineChart },
        { id: 'expenses', label: 'Expense Reports', icon: Receipt },
        { id: 'hr', label: 'HR & Payroll', icon: Briefcase },
        { id: 'integrations', label: 'Integrations', icon: Blocks },
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'sales': return <Sales />;
      case 'customers': return <Customers />;
      case 'pipeline': return <Pipeline />;
      case 'accounting': return <Accounting />;
      case 'suppliers': return <Suppliers />;
      case 'hr': return <HR />;
      case 'integrations': return <Integrations />;
      case 'projects': return <Projects />;
      case 'expenses': return <Expenses />;
      case 'pos': return <POS />;
      case 'subscriptions': return <Subscriptions />;
      default: return <Dashboard />;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab(null);
  };

  const handleOpenApp = (appId) => {
    setActiveTab(appId);
  };

  const handleGoHome = () => {
    setActiveTab(null);
  };

  // Find current app label for the topbar breadcrumb
  const currentAppLabel = navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || '';

  // ─── HOME / APP LAUNCHER VIEW ───
  if (isHome) {
    return (
      <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Minimal Top Bar for Home */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                automateERP
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  A
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* App Launcher Grid */}
          <Home onOpenApp={handleOpenApp} />
        </div>
      </div>
    );
  }

  // ─── APP VIEW (Sidebar + Content) ───
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
        <div className="h-16 flex flex-shrink-0 items-center px-6 border-b border-slate-200">
          <button
            onClick={handleGoHome}
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <Grid3x3 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">
              automateERP
            </span>
          </button>
        </div>
        
        {/* Scrollable Nav Area */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 w-full custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="text-sm whitespace-nowrap">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 flex-shrink-0 bg-slate-50/50">
          <div className="flex items-center justify-between group">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                A
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center space-x-4">
            {/* Back to Home */}
            <button
              onClick={handleGoHome}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-700">{currentAppLabel}</span>
            <span className="text-slate-200">|</span>
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none text-sm transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 flex-shrink-0">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98]">
              <Plus className="w-4 h-4 mr-2" />
              Quick Action
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        {renderContent()}
        
      </main>
    </div>
  );
}

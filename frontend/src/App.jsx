import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Bell, Search, Plus, LogOut,
  Kanban, Truck, LineChart, Briefcase, Blocks, Grid3x3, ArrowLeft, FolderKanban, Receipt, Monitor, RefreshCw,
  FilePlus, UserPlus, FolderPlus
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Invoice Paid', desc: 'Acme Corp paid #INV-2024-001', time: '2m ago', type: 'success' },
    { id: 2, title: 'Low Stock', desc: 'Ergonomic Chair is below 10 units', time: '1h ago', type: 'warning' },
    { id: 3, title: 'New Lead', desc: 'Marcus J. added to pipeline', time: '3h ago', type: 'info' },
  ];

  const quickActions = [
    { label: 'New Invoice', icon: FilePlus, route: 'sales' },
    { label: 'Add Customer', icon: UserPlus, route: 'customers' },
    { label: 'Create Project', icon: FolderPlus, route: 'projects' },
    { label: 'Submit Expense', icon: Receipt, route: 'expenses' },
  ];

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
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
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
      default: return <Dashboard onNavigate={setActiveTab} />;
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
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm ">
              automateERP
            </span>
          </button>
        </div>
        
        {/* Scrollable Nav Area */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 w-full custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsAuthenticated(true); // Ensure persistent auth state
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-full transition-all duration-200 ${
                      activeTab === item.id 
                        ? 'bg-blue-600 shadow-glow-blue text-white font-medium hover:bg-blue-700' 
                        : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            {/* Back to Home */}
            <button
              onClick={handleGoHome}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[15px] font-bold text-slate-900 tracking-tight">{currentAppLabel}</span>
            <span className="text-slate-300">|</span>
            <div className="relative w-80 group">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
              <input 
                type="text" 
                placeholder="Search across reports, clients, deals..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 hover:bg-slate-100 border border-transparent focus:bg-white rounded-full focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none text-sm transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsQuickActionOpen(false);
                }}
                className={`relative p-2 rounded-xl transition-all ${isNotificationsOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-200 shadow-glass-xl py-2 z-[60] animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">Notifications</span>
                    <button className="text-[11px] font-bold text-blue-600 hover:underline">Mark all read</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          setActiveTab(n.route);
                          setIsNotificationsOpen(false);
                        }}
                        className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-slate-800">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center border-t border-slate-100">
                    <button className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">View all updates</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-auto relative">
          {renderContent()}

          {/* Global Floating Quick Actions FAB */}
          {!isHome && (
            <div className="fixed bottom-8 right-8 z-[100] group">
              {/* Menu Container */}
              <div className="absolute bottom-full right-0 pb-3 flex flex-col items-end gap-3 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(action.route);
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 shadow-lg rounded-full hover:bg-slate-50 transition-all text-sm font-bold text-slate-700 hover:text-blue-600 hover:-translate-x-1"
                  >
                    <span>{action.label}</span>
                    <action.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Toggle Button */}
              <button 
                onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
                className="flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-glow-blue hover:scale-105 active:scale-95 transition-all outline-none"
              >
                <Plus className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>
        
      </main>
    </div>
  );
}

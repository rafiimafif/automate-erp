import React, { useState, useEffect } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [activeTab, setActiveTab] = useState(null); // null = show Home/App Launcher
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  // Sync auth state if changed in other tabs or by refresh
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token && isAuthenticated) {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const [notifications, setNotifications] = useState([]);
  const [navGroups] = useState([
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
  ]);

  useEffect(() => {
    if (isAuthenticated && isNotificationsOpen) {
      const fetchNotifications = async () => {
        try {
          const data = await api.notifications.list();
          setNotifications(data);
        } catch (err) {
          console.error('Failed to fetch notifications');
        }
      };
      fetchNotifications();
    }
  }, [isAuthenticated, isNotificationsOpen]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setActiveTab(null);
  };

  const handleOpenApp = (appId) => {
    setActiveTab(appId);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const isHome = activeTab === null;
  const currentAppLabel = navGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || '';

  const renderContent = () => {
    const props = { onNavigate: setActiveTab };
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...props} />;
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
      default: return <Dashboard {...props} />;
    }
  };

  const handleGoHome = () => {
    setActiveTab(null);
  };


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
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
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
                    {notifications.length > 0 ? notifications.map(n => (
                      <div 
                        key={n.id} 
                        className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-slate-800">System Update</span>
                          <span className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                      </div>
                    )) : (
                      <div className="px-4 py-8 text-center text-slate-400 text-xs">
                        No new notifications.
                      </div>
                    )}
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
        </div>
        
      </main>
    </div>
  );
}

import React from 'react';
import {
  LayoutDashboard, ShoppingCart, Kanban, Users, Package, Truck,
  LineChart, Briefcase, Blocks, ArrowRight, FolderKanban, Receipt, Monitor, RefreshCw,
  DollarSign, TrendingUp, AlertTriangle, Star, Plus, ArrowUpRight, ArrowDownRight, Clock,
  FileText, UserPlus, BarChart3, Sparkles
} from 'lucide-react';

const apps = [
  {
    category: 'Core Business',
    items: [
      { id: 'dashboard', label: 'Dashboard', desc: 'KPIs, analytics & activity feed', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200', status: '12 active metrics' },
      { id: 'sales', label: 'Sales & Invoices', desc: 'Billing, payments & revenue', icon: ShoppingCart, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200', status: '3 unpaid invoices' },
      { id: 'pipeline', label: 'Sales Pipeline', desc: 'Kanban deals & lead tracking', icon: Kanban, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200', status: '6 active deals' },
      { id: 'customers', label: 'Customers', desc: 'CRM directory & contacts', icon: Users, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-200', status: '842 total contacts' },
      { id: 'projects', label: 'Project Management', desc: 'Tasks, Kanban boards & team projects', icon: FolderKanban, color: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200', status: '4 in progress' },
    ]
  },
  {
    category: 'Commerce',
    items: [
      { id: 'pos', label: 'Point of Sale', desc: 'Cashier terminal with cart & payments', icon: Monitor, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-200', status: 'Terminal ready' },
      { id: 'subscriptions', label: 'Subscriptions', desc: 'Recurring plans, MRR & churn tracking', icon: RefreshCw, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200', status: '$8.4k MRR' },
    ]
  },
  {
    category: 'Operations',
    items: [
      { id: 'inventory', label: 'Inventory', desc: 'Products, stock & warehousing', icon: Package, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200', status: '3 low stock alerts' },
      { id: 'suppliers', label: 'Suppliers & POs', desc: 'Vendors & purchase orders', icon: Truck, color: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-200', status: '2 pending POs' },
    ]
  },
  {
    category: 'Administration',
    items: [
      { id: 'accounting', label: 'Financials', desc: 'P&L, ledger & reporting', icon: LineChart, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200', status: 'Month-end ready' },
      { id: 'expenses', label: 'Expense Reports', desc: 'Submit, approve & track expenses', icon: Receipt, color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200', status: '5 pending approval' },
      { id: 'hr', label: 'HR & Payroll', desc: 'Employees, salaries & departments', icon: Briefcase, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200', status: '24 employees' },
      { id: 'integrations', label: 'Integrations', desc: '32 third-party connectors', icon: Blocks, color: 'from-slate-500 to-slate-600', bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200', status: '8 connected' },
    ]
  }
];

const quickStats = [
  { label: 'Revenue', value: '$124,500', change: '+12.5%', up: true, icon: DollarSign, color: 'text-blue-600 bg-blue-50' },
  { label: 'Orders', value: '3,245', change: '+18.2%', up: true, icon: ShoppingCart, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Customers', value: '842', change: '+9.4%', up: true, icon: Users, color: 'text-purple-600 bg-purple-50' },
  { label: 'Stock Alerts', value: '3', change: 'action needed', up: false, icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
];

const quickActions = [
  { label: 'Create Invoice', icon: FileText, route: 'sales', accent: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' },
  { label: 'Add Customer', icon: UserPlus, route: 'customers', accent: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm' },
  { label: 'Add Product', icon: Package, route: 'inventory', accent: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm' },
  { label: 'View Reports', icon: BarChart3, route: 'accounting', accent: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm' },
];

const insights = [
  { icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', msg: 'Inventory for "Ergonomic Chair" is running low — only 12 units left.', time: '1 hr ago' },
  { icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50', msg: 'Your best-selling product "Wireless Headphones" grew 12.4% in sales this month.', time: '3 hr ago' },
  { icon: DollarSign, color: 'text-red-600 bg-red-50', msg: 'Invoice #INV-2024-003 from Stark Industries is overdue by 11 days ($9,800).', time: '5 hr ago' },
];

export default function Home({ onOpenApp }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ───── HERO SECTION ───── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-10 text-white animate-app-card-in">
          {/* Decorative blurs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-indigo-500 rounded-full blur-[100px] opacity-15 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
              <p className="text-blue-300 text-sm font-semibold tracking-wide uppercase mb-2">Good Morning</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Welcome back, Rafii 👋
              </h1>
              <p className="text-blue-200/80 mt-3 text-base font-medium max-w-lg leading-relaxed">
                Your revenue is up <span className="text-emerald-400 font-bold">12.5%</span> this month. 3 invoices pending, 6 active deals in pipeline, and 3 inventory alerts need attention.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="text-right bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-lg">
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">Monthly Revenue</p>
                <p className="text-3xl font-extrabold tracking-tight">$124,500</p>
                <div className="flex items-center gap-1 mt-1.5 text-emerald-400 text-sm font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                  +12.5% vs last month
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ───── QUICK STATS ───── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-app-card-in animation-delay-150">
          {quickStats.map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-5 shadow-premium hover:shadow-glass hover:-translate-y-1 transition-all duration-300 cursor-default group">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {stat.up && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ───── QUICK ACTIONS ───── */}
        <div className="flex flex-wrap items-center gap-3 animate-app-card-in animation-delay-150">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Quick Actions</span>
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onOpenApp(action.route)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] shadow-sm hover:shadow-md ${action.accent}`}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </div>

        {/* ───── MODULE GRID ───── */}
        <div className="space-y-8 animate-app-card-in animation-delay-300">
          {apps.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
                {group.category}
              </h2>

              <div className={`grid gap-4 ${group.items.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                {group.items.map((app, appIdx) => (
                  <button
                    key={app.id}
                    onClick={() => onOpenApp(app.id)}
                    className="group relative bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6 text-left transition-all duration-300 hover:shadow-glass hover:border-slate-300/60 hover:-translate-y-1 active:scale-[0.98]"
                  >
                    {/* Gradient top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${app.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${app.bg} flex items-center justify-center mb-4 ring-1 ${app.ring} group-hover:scale-110 transition-transform duration-300`}>
                      <app.icon className={`w-6 h-6 ${app.text}`} />
                    </div>

                    {/* Text */}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-800">{app.label}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{app.desc}</p>

                    {/* Live status badge */}
                    <div className="mt-4 pt-3 border-t border-slate-100/60">
                      <span className={`inline-flex items-center text-[11px] font-bold ${app.text} tracking-wide`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60`}></span>
                        {app.status}
                      </span>
                    </div>

                    {/* Arrow */}
                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
                      <ArrowRight className={`w-4 h-4 ${app.text}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ───── AI INSIGHTS ───── */}
        <div className="animate-app-card-in animation-delay-300">
          <div className="flex items-center gap-2 mb-4 px-1">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Smart Insights</h2>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-premium divide-y divide-slate-100/60">
            {insights.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 hover:bg-slate-50/50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl cursor-pointer group">
                <div className={`p-2.5 rounded-xl ${item.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.msg}</p>
                  <span className="text-xs text-slate-400 font-medium mt-1.5 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />{item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 pb-8 text-center">
          <p className="text-xs text-slate-400 font-medium">
            automateERP v2.0 — Built with React, Django & ❤️
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  LayoutDashboard, ShoppingCart, Kanban, Users, Package, Truck,
  LineChart, Briefcase, Blocks, ArrowRight, FolderKanban, Receipt, Monitor, RefreshCw
} from 'lucide-react';

const apps = [
  {
    category: 'Core Business',
    items: [
      { id: 'dashboard', label: 'Dashboard', desc: 'KPIs, analytics & activity feed', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-200' },
      { id: 'sales', label: 'Sales & Invoices', desc: 'Billing, payments & revenue', icon: ShoppingCart, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-200' },
      { id: 'pipeline', label: 'Sales Pipeline', desc: 'Kanban deals & lead tracking', icon: Kanban, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
      { id: 'customers', label: 'Customers', desc: 'CRM directory & contacts', icon: Users, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600', ring: 'ring-pink-200' },
      { id: 'projects', label: 'Project Management', desc: 'Tasks, Kanban boards & team projects', icon: FolderKanban, color: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
    ]
  },
  {
    category: 'Commerce',
    items: [
      { id: 'pos', label: 'Point of Sale', desc: 'Cashier terminal with cart & payments', icon: Monitor, color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', text: 'text-teal-600', ring: 'ring-teal-200' },
      { id: 'subscriptions', label: 'Subscriptions', desc: 'Recurring plans, MRR & churn tracking', icon: RefreshCw, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-200' },
    ]
  },
  {
    category: 'Operations',
    items: [
      { id: 'inventory', label: 'Inventory', desc: 'Products, stock & warehousing', icon: Package, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-200' },
      { id: 'suppliers', label: 'Suppliers & POs', desc: 'Vendors & purchase orders', icon: Truck, color: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50', text: 'text-sky-600', ring: 'ring-sky-200' },
    ]
  },
  {
    category: 'Administration',
    items: [
      { id: 'accounting', label: 'Financials', desc: 'P&L, ledger & reporting', icon: LineChart, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-200' },
      { id: 'expenses', label: 'Expense Reports', desc: 'Submit, approve & track expenses', icon: Receipt, color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-200' },
      { id: 'hr', label: 'HR & Payroll', desc: 'Employees, salaries & departments', icon: Briefcase, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-200' },
      { id: 'integrations', label: 'Integrations', desc: '32 third-party connectors', icon: Blocks, color: 'from-slate-500 to-slate-600', bg: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
    ]
  }
];

export default function Home({ onOpenApp }) {
  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Hero Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              automateERP
            </span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-medium max-w-xl mx-auto">
            Choose a module to get started. Everything your business needs, in one place.
          </p>
        </div>

        {/* App Categories */}
        <div className="space-y-10">
          {apps.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">
                {group.category}
              </h2>

              <div className={`grid gap-4 ${group.items.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                {group.items.map((app, appIdx) => (
                  <button
                    key={app.id}
                    onClick={() => onOpenApp(app.id)}
                    className="group relative bg-white rounded-2xl border border-slate-200 p-6 text-left transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 active:scale-[0.98] animate-app-card-in"
                    style={{ animationDelay: `${(groupIdx * 4 + appIdx) * 60}ms` }}
                  >
                    {/* Gradient top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${app.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${app.bg} flex items-center justify-center mb-4 ring-1 ${app.ring} group-hover:scale-110 transition-transform`}>
                      <app.icon className={`w-6 h-6 ${app.text}`} />
                    </div>

                    {/* Text */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-800">{app.label}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{app.desc}</p>

                    {/* Arrow */}
                    <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                      <ArrowRight className={`w-4 h-4 ${app.text}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-xs text-slate-400 font-medium">
            automateERP v1.0 — Built with React, Django & ❤️
          </p>
        </div>
      </div>
    </div>
  );
}

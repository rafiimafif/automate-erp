import React, { useState } from 'react';
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Activity, AlertTriangle, CheckCircle,
  Clock, MoreHorizontal, Zap, Target, BarChart2
} from 'lucide-react';

// Mini sparkline SVG component
const Sparkline = ({ data, color, bgColor }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 32;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={color} />
    </svg>
  );
};

// Mini bar chart
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end space-x-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: i === data.length - 1 ? 1 : 0.4 + (i / data.length) * 0.6 }}
          className="flex-1 rounded-sm min-h-[2px] transition-all"
        />
      ))}
    </div>
  );
};

const revenueData = [28000, 32000, 27000, 38000, 35000, 42000, 39000, 45000, 41000, 48000, 43000, 52000];
const ordersData = [18, 24, 20, 30, 28, 34, 29, 37, 33, 40, 36, 45];
const customersData = [5, 8, 6, 11, 9, 14, 12, 16, 13, 18, 15, 20];
const stockData = [120, 98, 115, 87, 104, 92, 109, 85, 97, 88, 94, 80];

const recentActivity = [
  { type: 'invoice', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', message: 'Invoice #INV-2024-005 paid by Acme Corp', time: '2 min ago', amount: '+$4,500' },
  { type: 'order', icon: ShoppingCart, color: 'text-blue-600 bg-blue-50', message: 'New deal "Bulk Hardware Order" moved to Won', time: '14 min ago', amount: '+$34,000' },
  { type: 'stock', icon: Package, color: 'text-amber-600 bg-amber-50', message: 'Low stock alert: Ergonomic Chair (12 left)', time: '1 hr ago', amount: null },
  { type: 'customer', icon: Users, color: 'text-purple-600 bg-purple-50', message: 'New customer Marcus Johnson added', time: '2 hr ago', amount: null },
  { type: 'invoice', icon: AlertTriangle, color: 'text-red-600 bg-red-50', message: 'Invoice #INV-2024-003 is overdue ($9,800)', time: '3 hr ago', amount: '-$9,800' },
];

const topProducts = [
  { name: 'Wireless Headphones', category: 'Electronics', sold: 142, revenue: 18443, trend: 12.4 },
  { name: 'USB-C Cable (2M)', category: 'Electronics', sold: 310, revenue: 4648, trend: 8.1 },
  { name: 'Ceramic Mug Set', category: 'Home Goods', sold: 98, revenue: 2449, trend: -3.2 },
  { name: 'Office Chair', category: 'Furniture', sold: 24, revenue: 5976, trend: 21.7 },
];

const pipelineSummary = [
  { stage: 'Lead', count: 2, value: 16500, color: 'bg-slate-400' },
  { stage: 'Contacted', count: 1, value: 8200, color: 'bg-blue-400' },
  { stage: 'Negotiating', count: 2, value: 36400, color: 'bg-amber-400' },
  { stage: 'Won', count: 1, value: 15000, color: 'bg-emerald-500' },
];

export default function Dashboard() {
  const [period, setPeriod] = useState('month');

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm p-1 w-fit">
            {['week', 'month', 'year'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${period === p ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '$124,500', change: '+12.5%', up: true, icon: DollarSign, data: revenueData, color: '#3b82f6', desc: 'vs last month' },
            { label: 'Total Orders', value: '45', change: '+18.2%', up: true, icon: ShoppingCart, data: ordersData, color: '#10b981', desc: 'vs last month' },
            { label: 'New Customers', value: '20', change: '+9.4%', up: true, icon: Users, data: customersData, color: '#8b5cf6', desc: 'vs last month' },
            { label: 'Inventory Items', value: '302', change: '-6.3%', up: false, icon: Package, data: stockData, color: '#f59e0b', desc: 'units remaining' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{kpi.label}</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{kpi.value}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform">
                  <kpi.icon className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center space-x-1">
                  {kpi.up ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
                  <span className={`text-sm font-bold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>{kpi.change}</span>
                  <span className="text-xs text-slate-400">{kpi.desc}</span>
                </div>
                <Sparkline data={kpi.data} color={kpi.color} />
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart + Pipeline Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Revenue Overview</h2>
                <p className="text-sm text-slate-500 mt-0.5">Monthly revenue performance for the year</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-slate-900">$124,500</p>
                <p className="text-xs font-semibold text-emerald-600 flex items-center justify-end mt-0.5"><TrendingUp className="w-3.5 h-3.5 mr-1" /> YTD Revenue</p>
              </div>
            </div>

            <div className="flex items-end space-x-1.5 h-36">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month, i) => {
                const val = revenueData[i];
                const max = Math.max(...revenueData);
                const h = (val / max) * 100;
                const isLast = i === 11;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center group cursor-pointer">
                    <div className="w-full relative" style={{ height: '120px' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t-md transition-all group-hover:opacity-100 ${isLast ? 'opacity-100 bg-blue-600' : 'opacity-50 bg-blue-400 group-hover:bg-blue-500'}`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isLast ? 'text-blue-600' : 'text-slate-400'}`}>{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Pipeline</h2>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">6 deals</span>
            </div>

            <div className="space-y-4">
              {pipelineSummary.map((stage, i) => {
                const total = pipelineSummary.reduce((s, p) => s + p.value, 0);
                const pct = Math.round((stage.value / total) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`}></div>
                        <span className="text-sm font-semibold text-slate-700">{stage.stage}</span>
                        <span className="text-xs text-slate-400">{stage.count} deal{stage.count > 1 ? 's' : ''}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(stage.value)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${stage.color} transition-all`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Total Pipeline Value</span>
                <span className="text-lg font-extrabold text-slate-900">{formatCurrency(pipelineSummary.reduce((s, p) => s + p.value, 0))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-slate-300" />Top Products
              </h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Sold</th>
                  <th className="px-6 py-3">Revenue</th>
                  <th className="px-6 py-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">{i + 1}</div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-slate-700">{p.sold}</span><span className="text-xs text-slate-400 ml-1">units</span></td>
                    <td className="px-6 py-4"><span className="text-sm font-bold text-slate-900">{formatCurrency(p.revenue)}</span></td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-full ${p.trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {p.trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {Math.abs(p.trend)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-slate-300" />Activity
              </h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start space-x-3 group">
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 font-medium leading-snug line-clamp-2">{item.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-1" />{item.time}</span>
                      {item.amount && (
                        <span className={`text-xs font-bold ${item.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{item.amount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-amber-400" />Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Create Invoice', desc: 'Draft a new customer bill', color: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100', icon: DollarSign, iconColor: 'text-blue-600' },
                { label: 'Add Product', desc: 'Update inventory stock', color: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100', icon: Package, iconColor: 'text-emerald-600' },
                { label: 'Add Customer', desc: 'Register a new client', color: 'bg-purple-50 border-purple-100 hover:border-purple-300 hover:bg-purple-100', icon: Users, iconColor: 'text-purple-600' },
                { label: 'New Deal', desc: 'Track a sales opportunity', color: 'bg-amber-50 border-amber-100 hover:border-amber-300 hover:bg-amber-100', icon: Target, iconColor: 'text-amber-600' },
              ].map((action, i) => (
                <button key={i} className={`text-left p-4 rounded-xl border transition-all ${action.color}`}>
                  <div className={`mb-2 ${action.iconColor}`}><action.icon className="w-5 h-5" /></div>
                  <p className="text-sm font-bold text-slate-800">{action.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-400" />Alerts & Reminders
            </h2>
            <div className="space-y-3">
              {[
                { type: 'warning', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200', title: 'Low Stock: Ergonomic Chair', desc: '12 units remaining — reorder soon.' },
                { type: 'danger', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200', title: 'Overdue Invoice: Stark Industries', desc: '$9,800 unpaid — 11 days overdue.' },
                { type: 'success', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', title: 'New Deal Won!', desc: 'Q4 Marketing Campaign closed ($15,000).' },
                { type: 'info', icon: Activity, color: 'text-blue-600 bg-blue-50 border-blue-200', title: '3 Integrations need reconnecting', desc: 'Shopify, Slack, and Stripe tokens expired.' },
              ].map((alert, i) => (
                <div key={i} className={`flex items-start space-x-3 p-3 rounded-xl border ${alert.color} transition-all hover:shadow-sm`}>
                  <alert.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-xs opacity-75 mt-0.5">{alert.desc}</p>
                  </div>
                  <button className="opacity-40 hover:opacity-100 flex-shrink-0 transition-opacity"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

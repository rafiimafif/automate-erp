import React, { useState } from 'react';
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Clock, Zap, Target, BarChart2, Star, Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from './ui/Table';

// Dynamic mock data sets based on selected period
const mockData = {
  week: {
    revenue: { val: '$14,250.00', change: '+3.2%', up: true, chart: [1500, 2100, 1800, 2400, 1900, 3100, 1450], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    orders: { val: '124', change: '+5.1%', up: true },
    customers: { val: '18', change: '-2.4%', up: false },
    inventory: { val: '1,280', change: '-1.2%', up: false },
  },
  month: {
    revenue: { val: '$124,500.00', change: '+12.5%', up: true, chart: [28000, 32000, 27000, 38000, 35000, 42000, 39000, 45000, 41000, 48000, 43000, 52000], labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    orders: { val: '3,245', change: '+18.2%', up: true },
    customers: { val: '842', change: '+9.4%', up: true },
    inventory: { val: '1,302', change: '-6.3%', up: false },
  },
  year: {
    revenue: { val: '$1,452,000.00', change: '+24.8%', up: true, chart: [350000, 420000, 380000, 302000], labels: ['Q1', 'Q2', 'Q3', 'Q4'] },
    orders: { val: '38,912', change: '+21.4%', up: true },
    customers: { val: '9,104', change: '+34.1%', up: true },
    inventory: { val: '4,500', change: '+12.1%', up: true },
  }
};

const recentActivity = [
  { type: 'invoice', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50', message: 'Invoice #INV-2024-005 paid by Acme Corp', time: '2 min ago', amount: '+$4,500', route: 'sales' },
  { type: 'order', icon: ShoppingCart, color: 'text-blue-600 bg-blue-50', message: 'New deal "Bulk Hardware Order" moved to Won', time: '14 min ago', amount: '+$34,000', route: 'pipeline' },
  { type: 'stock', icon: Package, color: 'text-amber-600 bg-amber-50', message: 'Low stock alert: Ergonomic Chair (12 left)', time: '1 hr ago', amount: null, route: 'inventory' },
  { type: 'customer', icon: Users, color: 'text-purple-600 bg-purple-50', message: 'New customer Marcus Johnson added', time: '2 hr ago', amount: null, route: 'customers' },
];

const topProducts = [
  { name: 'Wireless Headphones', category: 'Electronics', sold: 142, revenue: 18443, trend: 12.4 },
  { name: 'USB-C Cable (2M)', category: 'Electronics', sold: 310, revenue: 4648, trend: 8.1 },
  { name: 'Office Chair', category: 'Furniture', sold: 24, revenue: 5976, trend: 21.7 },
];

const categoryReport = [
  { label: 'Electronics', value: 45, color: 'bg-blue-500' },
  { label: 'Software', value: 25, color: 'bg-indigo-500' },
  { label: 'Furniture', value: 20, color: 'bg-purple-500' },
  { label: 'Services', value: 10, color: 'bg-emerald-500' },
];

const budgetReport = [
  { label: 'Marketing', allocated: 25000, spent: 22000, color: 'bg-purple-500' },
  { label: 'R&D', allocated: 40000, spent: 18000, color: 'bg-blue-500' },
  { label: 'Operations', allocated: 35000, spent: 34500, color: 'bg-amber-500' },
];

export default function Dashboard({ onNavigate }) {
  const [period, setPeriod] = useState('month');
  const data = mockData[period];

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-8 pt-6 pb-24 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Floating Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-slate-500 mt-1 font-medium">Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="flex bg-white/80 backdrop-blur-md rounded-full border border-slate-200/60 shadow-sm p-1 w-fit">
            {['week', 'month', 'year'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-5 py-1.5 rounded-full text-sm font-bold capitalize transition-all duration-200 ${period === p ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* AI Insight Gradient Box */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-glow-blue animate-app-card-in">
          <div className="bg-white/95 backdrop-blur-3xl rounded-[15px] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 animate-pulse-once">
              <Star className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">✨ AI Insight Generated</p>
              <p className="text-sm text-slate-600 mt-0.5">Revenue has increased by {data.revenue.change} this {period}. However, inventory risk detected on 3 high-volume products.</p>
            </div>
            <Button onClick={() => onNavigate && onNavigate('inventory')} variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-full w-full sm:w-auto mt-2 sm:mt-0 shadow-sm">Review Risk</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-app-card-in animation-delay-150">
          
          {/* HERO REVENUE CARD (Span 8) */}
          <Card onClick={() => onNavigate && onNavigate('accounting')} className="lg:col-span-8 flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-blue-500/50">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-30"></div>
            
            <CardHeader className="pb-2 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="uppercase tracking-widest font-bold text-xs text-blue-600/80 mb-1">Total Revenue ({period})</CardDescription>
                  <CardTitle className="text-5xl font-extrabold text-slate-900 tracking-tight transition-all">{data.revenue.val}</CardTitle>
                </div>
                <Badge variant={data.revenue.up ? "success" : "danger"} className="px-3 py-1.5 text-sm bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20">
                  {data.revenue.up ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}{data.revenue.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6 px-0 pb-0 flex flex-col justify-end min-h-[200px] relative z-10">
              <div className="flex items-end space-x-1 sm:space-x-2 h-40 px-6">
                {data.revenue.labels.map((label, i) => {
                  const val = data.revenue.chart[i];
                  const max = Math.max(...data.revenue.chart);
                  const h = (val / max) * 100;
                  const isLast = i === data.revenue.labels.length - 1;
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center group/bar cursor-pointer h-full justify-end relative">
                      <div className="w-full relative bg-slate-100/50 rounded-t-lg transition-colors overflow-hidden" style={{ height: '120px' }}>
                        <div
                          className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ease-out group-hover/bar:bg-blue-500 ${isLast ? 'bg-blue-600 shadow-glow-blue' : 'bg-slate-300/80'}`}
                          style={{ height: `${h}%` }}
                        />
                      </div>
                      <span className={`text-[11px] sm:text-xs mt-3 font-semibold transition-colors ${isLast ? 'text-blue-600' : 'text-slate-400 group-hover/bar:text-slate-700'}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* SECONDARY METRICS (Span 4, stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            {[
              { label: 'Total Orders', value: data.orders.val, change: data.orders.change, up: data.orders.up, icon: ShoppingCart, color: 'text-emerald-600 bg-emerald-50', route: 'sales' },
              { label: 'New Customers', value: data.customers.val, change: data.customers.change, up: data.customers.up, icon: Users, color: 'text-blue-600 bg-blue-50', route: 'customers' },
              { label: 'Inventory Items', value: data.inventory.val, change: data.inventory.change, up: data.inventory.up, icon: Package, color: 'text-amber-600 bg-amber-50', route: 'inventory' },
            ].map((kpi, i) => (
              <Card key={i} onClick={() => onNavigate && onNavigate(kpi.route)} className="flex-1 flex items-center p-5 group hover:border-slate-300/80 transition-all cursor-pointer hover:ring-2 hover:ring-blue-500/30">
                <div className={`p-3.5 rounded-2xl ${kpi.color} group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <div className="ml-5 flex-1">
                  <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-0.5">{kpi.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none transition-all">{kpi.value}</h3>
                    <div className={`flex items-center text-xs font-bold ${kpi.up ? 'text-emerald-600' : 'text-red-500'}`}>
                      {kpi.up ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                      {kpi.change}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* MIDDLE SECTION: Analytics Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-app-card-in animation-delay-300">
          
          {/* Sales by Category Breakdown */}
          <Card className="flex flex-col h-full hover:shadow-md transition-all">
            <CardHeader className="pb-4 border-b border-slate-100/60 flex flex-row justify-between items-center">
              <div>
                <CardTitle>Sales Composition</CardTitle>
                <CardDescription>Revenue breakdown by category</CardDescription>
              </div>
              <Button onClick={() => onNavigate && onNavigate('sales')} variant="ghost" size="sm" className="hidden sm:flex text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full px-4">Details</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {categoryReport.map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                      <span className="text-sm font-extrabold text-slate-900">{cat.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget vs Spend Report */}
          <Card className="flex flex-col h-full hover:shadow-md transition-all">
            <CardHeader className="pb-4 border-b border-slate-100/60 flex flex-row justify-between items-center">
              <div>
                <CardTitle>Department Budgets</CardTitle>
                <CardDescription>Allocated vs actual spend</CardDescription>
              </div>
              <Button onClick={() => onNavigate && onNavigate('accounting')} variant="ghost" size="sm" className="hidden sm:flex text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full px-4">Accounting</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {budgetReport.map((dept, i) => {
                  const percent = Math.min(100, (dept.spent / dept.allocated) * 100);
                  const isWarning = percent > 90;
                  return (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${dept.color}`} />
                          <span className="text-sm font-bold text-slate-700">{dept.label}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-500">
                          <span className={isWarning ? 'text-red-500 font-bold' : 'text-slate-900 font-bold'}>{formatCurrency(dept.spent)}</span> / {formatCurrency(dept.allocated)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full rounded-full transition-all duration-500 ${isWarning ? 'bg-red-500 shadow-glow-blue' : dept.color}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* BOTTOM SECTION: Top Products & Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-app-card-in animation-delay-300">

          {/* Top Products */}
          <Card className="lg:col-span-2 flex flex-col h-full">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Based on sales volume this {period}</CardDescription>
              </div>
              <Button onClick={() => onNavigate && onNavigate('inventory')} variant="ghost" size="sm" className="hidden sm:flex text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-100/50 rounded-full px-4">View Report</Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 px-6 pb-6">
              <Table className="border-0 shadow-none bg-transparent">
                <TableHeader className="bg-transparent border-b border-slate-200/60">
                  <TableRow isHoverable={false}>
                    <TableHead className="px-0">Product</TableHead>
                    <TableHead className="px-0">Sold</TableHead>
                    <TableHead className="px-0">Revenue</TableHead>
                    <TableHead className="px-0 text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p, i) => (
                    <TableRow key={i} className="border-b border-slate-100/60 group/row hover:bg-slate-50/50">
                      <TableCell className="px-0 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">{i + 1}</div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm group-hover/row:text-blue-600 transition-colors cursor-pointer" onClick={() => onNavigate && onNavigate('inventory')}>{p.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{p.category}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-0 py-3"><span className="font-bold text-slate-700">{p.sold}</span> <span className="text-xs text-slate-400">units</span></TableCell>
                      <TableCell className="px-0 py-3"><span className="font-extrabold text-slate-900">{formatCurrency(p.revenue)}</span></TableCell>
                      <TableCell className="px-0 py-3 text-right">
                        <Badge variant={p.trend > 0 ? "success" : "danger"} className="ml-auto w-fit bg-white shadow-sm border-slate-200/60">
                          {p.trend > 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                          {Math.abs(p.trend)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="h-full bg-slate-900 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-30 pointer-events-none transition-opacity group-hover:opacity-40"></div>
            
            <CardHeader className="pb-4 relative z-10 border-slate-800">
              <CardTitle className="text-white">Activity Timeline</CardTitle>
              <CardDescription className="text-slate-400">Real-time system updates</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 pt-2">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-800 before:via-slate-800 before:to-transparent">
                {recentActivity.map((item, i) => (
                  <div key={i} className="relative flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-slate-900 relative z-10 shadow-sm transition-transform hover:scale-110 cursor-pointer ${item.type==='invoice' && item.amount?.startsWith('+') ? 'bg-emerald-500 text-white' : item.type==='order' ? 'bg-blue-500 text-white' : item.type==='invoice' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`} onClick={() => onNavigate && onNavigate(item.route)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p onClick={() => onNavigate && onNavigate(item.route)} className="text-sm text-slate-200 font-medium leading-snug line-clamp-2 hover:text-blue-400 cursor-pointer transition-colors hover:underline underline-offset-2">{item.message}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-slate-500 flex items-center font-medium"><Clock className="w-3.5 h-3.5 mr-1" />{item.time}</span>
                        {item.amount && (
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.amount.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{item.amount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}

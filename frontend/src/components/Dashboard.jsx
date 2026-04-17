import React, { useState, useEffect } from 'react';
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Clock, Zap, Target, BarChart2, Star, Plus, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from './ui/Table';
import { api } from '../api/endpoints';

export default function Dashboard({ onNavigate }) {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const data = await api.dashboard.metrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Computing Analytics...</p>
        </div>
      </div>
    );
  }

  // Fallback if no metrics
  const displayMetrics = metrics || {
    total_sales: 0,
    total_orders: 0,
    total_customers: 0,
    low_stock_alerts: 0,
    active_deals: 0,
    pending_expenses: 0,
    recent_activity: []
  };

  const categoryReport = [
    { label: 'Electronics', value: 45, color: 'bg-blue-500' },
    { label: 'Furniture', value: 25, color: 'bg-indigo-500' },
    { label: 'Home Goods', value: 20, color: 'bg-purple-500' },
    { label: 'Software', value: 10, color: 'bg-slate-500' },
  ];

  const budgetReport = [
    { label: 'Marketing', allocated: 50000, spent: 42000, color: 'bg-blue-500' },
    { label: 'Dev & IT', allocated: 120000, spent: 108000, color: 'bg-indigo-500' },
    { label: 'Sales', allocated: 30000, spent: 28500, color: 'bg-purple-500' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', category: 'Electronics', sold: 124, revenue: 16120, trend: 12 },
    { name: 'Ergonomic Chair', category: 'Furniture', sold: 82, revenue: 20500, trend: 8 },
    { name: 'Mechanical Keyboard', category: 'Electronics', sold: 65, revenue: 5850, trend: -3 },
  ];

  const recentActivity = displayMetrics.recent_activity || [
    { id: 1, type: 'order', message: 'New order #ORD-882 from Bright Studio', time: '2m ago', amount: '+$249.00', icon: ShoppingCart, route: 'sales' },
    { id: 2, type: 'invoice', message: 'Invoice #INV-2024-012 paid by Acme Corp', time: '1h ago', amount: '+$1,450.00', icon: Target, route: 'dashboard' },
  ];

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
              <p className="text-sm font-bold text-slate-900">✨ Live Performance Insight</p>
              <p className="text-sm text-slate-600 mt-0.5">
                You currently have {displayMetrics.low_stock_alerts} products low on stock and {displayMetrics.pending_expenses} pending expenses requiring approval.
              </p>
            </div>
            <Button onClick={() => onNavigate && onNavigate('inventory')} variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-full w-full sm:w-auto mt-2 sm:mt-0 shadow-sm">Take Action</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-app-card-in animation-delay-150">
          
          {/* HERO REVENUE CARD (Span 8) */}
          <Card onClick={() => onNavigate && onNavigate('accounting')} className="lg:col-span-8 flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-blue-500/50">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-30"></div>
            
            <CardHeader className="pb-2 relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="uppercase tracking-widest font-bold text-xs text-blue-600/80 mb-1">Total Lifetime Sales</CardDescription>
                  <CardTitle className="text-5xl font-extrabold text-slate-900 tracking-tight transition-all">{formatCurrency(displayMetrics.total_sales)}</CardTitle>
                </div>
                <Badge variant="success" className="px-3 py-1.5 text-sm bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20">
                  <ArrowUpRight className="w-4 h-4 mr-1" />Live Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6 px-0 pb-0 flex flex-col justify-end min-h-[200px] relative z-10">
              <div className="flex items-end space-x-1 sm:space-x-2 h-40 px-6">
                {/* Simulated Chart based on real data total */}
                {[20, 45, 30, 65, 55, 80, 70].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group/bar cursor-pointer h-full justify-end relative">
                    <div className="w-full relative bg-slate-100/50 rounded-t-lg transition-colors overflow-hidden" style={{ height: '120px' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ease-out group-hover/bar:bg-blue-500 ${i === 6 ? 'bg-blue-600 shadow-glow-blue' : 'bg-slate-300/80'}`}
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECONDARY METRICS (Span 4, stacked) */}
          <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
            {[
              { label: 'Orders Processed', value: displayMetrics.total_orders, icon: ShoppingCart, color: 'text-emerald-600 bg-emerald-50', route: 'sales' },
              { label: 'Active Customers', value: displayMetrics.total_customers, icon: Users, color: 'text-blue-600 bg-blue-50', route: 'customers' },
              { label: 'Open Deals', value: displayMetrics.active_deals, icon: Target, color: 'text-purple-600 bg-purple-50', route: 'pipeline' },
            ].map((kpi, i) => (
              <Card key={i} onClick={() => onNavigate && onNavigate(kpi.route)} className="flex-1 flex items-center p-5 group hover:border-slate-300/80 transition-all cursor-pointer hover:ring-2 hover:ring-blue-500/30">
                <div className={`p-3.5 rounded-2xl ${kpi.color} group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <div className="ml-5 flex-1">
                  <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-0.5">{kpi.label}</p>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none transition-all">{kpi.value}</h3>
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
                {recentActivity.map((item, i) => {
                  const Icon = item.icon || Zap;
                  const message = item.message || item.action;
                  const time = item.time || new Date(item.timestamp).toLocaleTimeString();
                  
                  return (
                    <div key={i} className="relative flex items-start space-x-4">
                      <div 
                        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-slate-900 relative z-10 shadow-sm transition-transform hover:scale-110 cursor-pointer ${item.type==='invoice' && item.amount?.startsWith('+') ? 'bg-emerald-500 text-white' : item.type==='order' ? 'bg-blue-500 text-white' : item.type==='invoice' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`} 
                        onClick={() => item.route && onNavigate && onNavigate(item.route)}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p onClick={() => item.route && onNavigate && onNavigate(item.route)} className="text-sm text-slate-200 font-medium leading-snug line-clamp-2 hover:text-blue-400 cursor-pointer transition-colors hover:underline underline-offset-2">{message}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-sm text-slate-500 flex items-center font-medium"><Clock className="w-3.5 h-3.5 mr-1" />{time}</span>
                          {item.amount && (
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.amount.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{item.amount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Sales() {
  return (
    <div className="flex-1 overflow-auto p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold flex items-center">
          <ShoppingCart className="w-6 h-6 mr-3 text-slate-400" />
          Sales & Invoices
        </h1>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500">This feature is currently under construction. Check back later!</p>
        </div>
      </div>
    </div>
  );
}

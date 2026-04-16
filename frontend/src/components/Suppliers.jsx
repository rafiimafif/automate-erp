import React from 'react';
import { Truck, Plus } from 'lucide-react';

export default function Suppliers() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center h-full text-center py-20">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Suppliers & Purchase Orders</h1>
        <p className="text-slate-500 max-w-md">The Procurement module is currently being designed. Soon you'll be able to track vendors and automatically draft POs when inventory is low.</p>
        <button className="mt-6 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Join Early Access
        </button>
      </div>
    </div>
  );
}

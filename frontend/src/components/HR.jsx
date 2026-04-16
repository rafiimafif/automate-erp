import React from 'react';
import { Briefcase } from 'lucide-react';

export default function HR() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center h-full text-center py-20">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">HR & Payroll</h1>
        <p className="text-slate-500 max-w-md">Manage your staff directory, processing payroll, and configuring role-based access directly from this portal (Coming Soon).</p>
      </div>
    </div>
  );
}

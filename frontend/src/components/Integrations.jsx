import React from 'react';
import { Blocks } from 'lucide-react';

export default function Integrations() {
  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center h-full text-center py-20">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <Blocks className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">App Integrations Hub</h1>
        <p className="text-slate-500 max-w-md">Connect AutomateERP to your favorite tools like Stripe, Zoom, Slack, and Shopify using 1-click webhooks and API hooks (Coming Soon).</p>
      </div>
    </div>
  );
}

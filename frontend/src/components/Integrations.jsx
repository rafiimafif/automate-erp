import React, { useState } from 'react';
import { Blocks, Search, CheckCircle, Plus, ExternalLink, Zap, ShoppingCart, CreditCard, MessageSquare, BarChart2, Mail, Database, Shield, Globe, Package } from 'lucide-react';

const integrationCategories = [
  {
    category: 'Payments & Finance',
    icon: CreditCard,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    integrations: [
      { id: 'stripe', name: 'Stripe', desc: 'Accept online payments, subscriptions, and invoicing with automatic sync.', status: 'connected', logo: '💳' },
      { id: 'paypal', name: 'PayPal', desc: 'Global payment gateway supporting 200+ currencies and instant checkout.', status: 'disconnected', logo: '🅿️' },
      { id: 'quickbooks', name: 'QuickBooks', desc: 'Sync your ERP financials bidirectionally with QuickBooks Online.', status: 'disconnected', logo: '📊' },
      { id: 'xero', name: 'Xero', desc: 'Cloud accounting integration for seamless ledger reconciliation.', status: 'disconnected', logo: '🔵' },
    ]
  },
  {
    category: 'E-Commerce & Sales',
    icon: ShoppingCart,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    integrations: [
      { id: 'shopify', name: 'Shopify', desc: 'Auto-import orders, sync inventory, and track fulfillment in real-time.', status: 'connected', logo: '🛍️' },
      { id: 'woocommerce', name: 'WooCommerce', desc: 'Connect your WordPress store orders directly into the ERP pipeline.', status: 'disconnected', logo: '🛒' },
      { id: 'amazon', name: 'Amazon Seller', desc: 'Pull Amazon marketplace orders and manage multi-channel fulfillment.', status: 'disconnected', logo: '📦' },
      { id: 'ebay', name: 'eBay', desc: 'Manage eBay listings and order data from a single dashboard.', status: 'disconnected', logo: '🔖' },
    ]
  },
  {
    category: 'Communication & Collaboration',
    icon: MessageSquare,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    integrations: [
      { id: 'slack', name: 'Slack', desc: 'Receive instant alerts for new invoices, low stock, and deal updates.', status: 'connected', logo: '💬' },
      { id: 'teams', name: 'Microsoft Teams', desc: 'Post ERP notifications and summaries directly into Teams channels.', status: 'disconnected', logo: '🟦' },
      { id: 'zoom', name: 'Zoom', desc: 'Schedule client and team meetings from customer and deal cards.', status: 'disconnected', logo: '🎥' },
      { id: 'discord', name: 'Discord', desc: 'Send automated ERP webhooks to Discord channels for your dev team.', status: 'disconnected', logo: '🎮' },
    ]
  },
  {
    category: 'Email & Marketing',
    icon: Mail,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    integrations: [
      { id: 'resend', name: 'Resend', desc: 'Send transactional invoices and customer notifications via Resend API.', status: 'connected', logo: '✉️' },
      { id: 'mailchimp', name: 'Mailchimp', desc: 'Sync customers to Mailchimp audiences for targeted email campaigns.', status: 'disconnected', logo: '🐒' },
      { id: 'sendgrid', name: 'SendGrid', desc: 'High-volume transactional email delivery for invoices and receipts.', status: 'disconnected', logo: '📨' },
      { id: 'hubspot', name: 'HubSpot CRM', desc: 'Bidirectional contact and deal sync between AutomateERP and HubSpot.', status: 'disconnected', logo: '🧡' },
    ]
  },
  {
    category: 'Analytics & Monitoring',
    icon: BarChart2,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    integrations: [
      { id: 'posthog', name: 'PostHog', desc: 'Track user behavior and feature usage analytics within your ERP.', status: 'disconnected', logo: '🦔' },
      { id: 'sentry', name: 'Sentry', desc: 'Real-time error monitoring and performance tracking for your ERP instance.', status: 'disconnected', logo: '🛡️' },
      { id: 'datadog', name: 'Datadog', desc: 'Infrastructure and application monitoring with custom ERP dashboards.', status: 'disconnected', logo: '🐕' },
      { id: 'googleanalytics', name: 'Google Analytics', desc: 'Embed GA4 event tracking for ERP page views and user journeys.', status: 'disconnected', logo: '📈' },
    ]
  },
  {
    category: 'Storage & Data',
    icon: Database,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    integrations: [
      { id: 'airtable', name: 'Airtable', desc: 'Sync ERP records to Airtable bases for advanced spreadsheet reporting.', status: 'disconnected', logo: '🗃️' },
      { id: 'googlesheets', name: 'Google Sheets', desc: 'Export inventory, sales, and payroll data to Sheets automatically.', status: 'connected', logo: '📋' },
      { id: 'notion', name: 'Notion', desc: 'Push ERP summaries and reports into Notion pages and databases.', status: 'disconnected', logo: '⬜' },
      { id: 's3', name: 'AWS S3', desc: 'Automatically archive invoice PDFs and reports to an S3 bucket.', status: 'disconnected', logo: '☁️' },
    ]
  },
  {
    category: 'Logistics & Shipping',
    icon: Package,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    integrations: [
      { id: 'fedex', name: 'FedEx', desc: 'Generate FedEx shipping labels and track packages from your PO module.', status: 'disconnected', logo: '📫' },
      { id: 'dhl', name: 'DHL Express', desc: 'International shipping integration for cross-border purchase orders.', status: 'disconnected', logo: '🟡' },
      { id: 'shipstation', name: 'ShipStation', desc: 'Multi-carrier fulfillment management connected to your inventory.', status: 'disconnected', logo: '🚢' },
      { id: 'ups', name: 'UPS', desc: 'Real-time UPS rate calculations and automated label generation.', status: 'disconnected', logo: '📮' },
    ]
  },
  {
    category: 'Security & Access',
    icon: Shield,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    integrations: [
      { id: 'clerk', name: 'Clerk', desc: 'Fully featured user authentication, SSO, and magic link sign-in.', status: 'disconnected', logo: '🔐' },
      { id: 'okta', name: 'Okta SSO', desc: 'Enterprise Single Sign-On and multi-factor authentication for teams.', status: 'disconnected', logo: '🔒' },
      { id: 'cloudflare', name: 'Cloudflare', desc: 'DDoS protection, rate limiting, and edge caching for your ERP.', status: 'disconnected', logo: '🔶' },
      { id: '1password', name: '1Password Teams', desc: 'Shared secret management and credential vault for your organization.', status: 'disconnected', logo: '🗝️' },
    ]
  },
];

export default function Integrations() {
  const [statuses, setStatuses] = useState(() => {
    const map = {};
    integrationCategories.forEach(cat => cat.integrations.forEach(i => { map[i.id] = i.status; }));
    return map;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const toggleStatus = (id) => {
    setStatuses(prev => ({ ...prev, [id]: prev[id] === 'connected' ? 'disconnected' : 'connected' }));
  };

  const connectedCount = Object.values(statuses).filter(s => s === 'connected').length;
  const totalCount = Object.values(statuses).length;

  const filteredCategories = integrationCategories.map(cat => ({
    ...cat,
    integrations: cat.integrations.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.desc.toLowerCase().includes(searchTerm.toLowerCase()) || cat.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || statuses[i.id] === filterStatus;
      return matchesSearch && matchesFilter;
    })
  })).filter(cat => cat.integrations.length > 0);

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
              <Blocks className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Integrations Hub</h1>
              <p className="text-sm text-slate-500 mt-0.5">Connect AutomateERP to your favorite tools and services.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700"><span className="text-emerald-600">{connectedCount}</span> of {totalCount} connected</span>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search integrations, categories, or features..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
            {['all', 'connected', 'disconnected'].map(f => (
              <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${filterStatus === f ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {f === 'connected' ? '✓ Connected' : f === 'disconnected' ? '+ Available' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Sections */}
        {filteredCategories.map((cat, catIdx) => (
          <div key={catIdx}>
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.bg}`}>
                <cat.icon className={`w-4 h-4 ${cat.color}`} />
              </div>
              <h2 className="text-base font-bold text-slate-800">{cat.category}</h2>
              <span className="text-xs font-semibold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                {cat.integrations.filter(i => statuses[i.id] === 'connected').length}/{cat.integrations.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
              {cat.integrations.map(integration => {
                const isConnected = statuses[integration.id] === 'connected';
                return (
                  <div key={integration.id} className={`bg-white rounded-xl border transition-all shadow-sm hover:shadow-md group relative overflow-hidden ${isConnected ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-200 hover:border-blue-200'}`}>
                    {isConnected && <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">{integration.logo}</div>
                        {isConnected && (
                          <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle className="w-3 h-3 mr-1" /> Live
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">{integration.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{integration.desc}</p>
                    </div>
                    <div className="px-4 pb-4 flex items-center justify-between">
                      <button className="text-xs text-slate-400 hover:text-blue-600 flex items-center transition-colors">
                        <ExternalLink className="w-3 h-3 mr-1" /> Docs
                      </button>
                      <button
                        onClick={() => toggleStatus(integration.id)}
                        aria-label={`${isConnected ? 'Disconnect' : 'Connect'} ${integration.name}`}
                        className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.97] ${
                          isConnected
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-300/50'
                        }`}
                      >
                        {isConnected ? (
                          <><Zap className="w-3 h-3 mr-1" /> Disconnect</>
                        ) : (
                          <><Plus className="w-3 h-3 mr-1" /> Connect</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No integrations found for <span className="font-bold text-slate-700">"{searchTerm}"</span></p>
            <button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }} className="mt-4 text-sm text-blue-600 hover:underline">Clear filters</button>
          </div>
        )}

      </div>
    </div>
  );
}

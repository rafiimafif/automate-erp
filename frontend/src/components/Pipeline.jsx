import React, { useState, useEffect } from 'react';
import { Kanban, Plus, Calendar, MessageSquare, Paperclip, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api/endpoints';

const STAGES = [
  { id: 'discovery', label: 'Discovery', color: 'bg-slate-200 text-slate-700', border: 'border-slate-300' },
  { id: 'proposal', label: 'Proposal', color: 'bg-blue-200 text-blue-700', border: 'border-blue-300' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-amber-200 text-amber-700', border: 'border-amber-300' },
  { id: 'won', label: 'Won', color: 'bg-emerald-200 text-emerald-800', border: 'border-emerald-300' },
  { id: 'lost', label: 'Lost', color: 'bg-red-200 text-red-800', border: 'border-red-300' }
];

export default function Pipeline() {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', customer_name: '', deal_value: '', stage: 'discovery' });

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const data = await api.deals.list();
      setDeals(data);
    } catch (err) {
      setError('Failed to fetch pipeline data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      await api.deals.delete(id);
      setDeals(deals.filter(d => d.id !== id));
    } catch (err) {
      alert('Failed to delete deal.');
    }
  };

  const openCreateModal = () => {
    setFormData({ title: 'New Deal', customer_name: '', deal_value: '', stage: 'discovery' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (deal, e) => {
    if (e) e.stopPropagation();
    setFormData({ 
      title: deal.customer_name + ' Deal', // Backend didn't have title, using derived
      customer_name: deal.customer_name, 
      deal_value: deal.deal_value, 
      stage: deal.stage 
    });
    setEditingId(deal.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.deal_value) return;

    try {
      const payload = {
        customer_name: formData.customer_name,
        deal_value: Number.parseFloat(formData.deal_value),
        stage: formData.stage
      };

      if (editingId) {
        const updated = await api.deals.update(editingId, payload);
        setDeals(deals.map(d => d.id === editingId ? updated : d));
      } else {
        const created = await api.deals.create(payload);
        setDeals([...deals, created]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save deal.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Syncing Pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8 relative">
      <div className="max-w-full mx-auto space-y-6 h-full flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage leads and close active deals through stages.</p>
            </div>
          </div>
          <button onClick={openCreateModal} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchDeals} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

        {/* Kanban Board Layout */}
        <div className="flex-1 min-h-0 overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex space-x-6 min-w-max h-full items-start">
            
            {STAGES.map((stagecol, idx) => {
              const colDeals = deals.filter(d => d.stage === stagecol.id);
              
              return (
              <div key={idx} className="w-80 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200 h-full max-h-full overflow-hidden shadow-sm">
                
                {/* Column Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-100 shrink-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-800">{stagecol.label}</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{colDeals.length}</span>
                  </div>
                  <button onClick={() => { openCreateModal(); setFormData({...formData, stage: stagecol.id}); }} className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Scrollable Deals */}
                <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                  {colDeals.map((card) => (
                    <div 
                      key={card.id} 
                      onClick={(e) => openEditModal(card, e)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group relative"
                    >
                      {/* Floating actions on hover */}
                      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded px-1">
                        <button aria-label="Delete Deal" onClick={(e) => handleDelete(card.id, e)} className="p-1 text-slate-400 hover:text-red-600 rounded bg-white hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-start mb-3">
                        <div className={`text-xs font-bold px-2 py-0.5 rounded border ${stagecol.color} ${stagecol.border}`}>
                          {formatCurrency(card.deal_value)}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug pr-6">{card.customer_name} Project</h4>
                      <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">{card.customer_name}</p>
                      
                      <div className="flex items-center justify-between mt-auto border-t border-slate-50 pt-3">
                        <div className="flex space-x-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center hover:text-blue-600 transition-colors"><MessageSquare className="w-3.5 h-3.5 mr-1" /> 0</span>
                        </div>
                        <div className="flex items-center text-xs font-medium text-slate-400">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {new Date(card.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colDeals.length === 0 && (
                     <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl opacity-50">
                        <AlertCircle className="w-6 h-6 text-slate-400 mb-2" />
                        <p className="text-xs text-slate-500 font-medium">No deals in {stagecol.label}</p>
                     </div>
                  )}

                </div>
              </div>
            )})}
            
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsModalOpen(false)} role="button" tabIndex={-1} aria-label="Close modal"></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-spring-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Kanban className="w-5 h-5 mr-2 text-blue-600" />
                {editingId ? 'Edit Deal' : 'Add New Deal'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label htmlFor="deal-client" className="block text-sm font-semibold text-slate-700 mb-1.5">Client Name</label>
                <input id="deal-client" type="text" value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" placeholder="Acme Corp" required />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="deal-value" className="block text-sm font-semibold text-slate-700 mb-1.5">Deal Value ($)</label>
                  <input id="deal-value" type="number" min="0" value={formData.deal_value} onChange={(e) => setFormData({...formData, deal_value: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="deal-stage" className="block text-sm font-semibold text-slate-700 mb-1.5">Stage</label>
                  <select id="deal-stage" value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm bg-white font-medium text-blue-700">
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all">
                  {editingId ? 'Save Changes' : 'Create Deal Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

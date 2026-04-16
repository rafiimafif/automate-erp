import React, { useState } from 'react';
import { Kanban, Plus, Calendar, MessageSquare, Paperclip, Edit, Trash2, X, AlertCircle } from 'lucide-react';

const initialDeals = [
  { id: '1', title: 'Enterprise Software License', client: 'Acme Corp', value: 12000, days: 2, stage: 'Lead' },
  { id: '2', title: 'Consulting Package C', client: 'Globex Inc', value: 4500, days: 1, stage: 'Lead' },
  { id: '3', title: 'Website Redesign', client: 'Studio One', value: 8200, days: 5, stage: 'Contacted' },
  { id: '4', title: 'Bulk Hardware Order', client: 'TechNova', value: 34000, days: 12, stage: 'Negotiating' },
  { id: '5', title: 'Annual Server Maintenance', client: 'Stark Ind.', value: 2400, days: 8, stage: 'Negotiating' },
  { id: '6', title: 'Q4 Marketing Campaign', client: 'Wayne Ent.', value: 15000, days: 0, stage: 'Won' }
];

const STAGES = [
  { id: 'Lead', label: 'Lead', color: 'bg-slate-200 text-slate-700', border: 'border-slate-300' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-blue-200 text-blue-700', border: 'border-blue-300' },
  { id: 'Negotiating', label: 'Negotiating', color: 'bg-amber-200 text-amber-700', border: 'border-amber-300' },
  { id: 'Won', label: 'Won', color: 'bg-emerald-200 text-emerald-800', border: 'border-emerald-300' }
];

export default function Pipeline() {
  const [deals, setDeals] = useState(initialDeals);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', client: '', value: '', days: 0, stage: 'Lead' });

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Prevent opening edit modal
    setDeals(deals.filter(d => d.id !== id));
  };

  const openCreateModal = () => {
    setFormData({ title: '', client: '', value: '', days: 0, stage: 'Lead' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (deal, e) => {
    if (e) e.stopPropagation();
    setFormData({ title: deal.title, client: deal.client, value: deal.value, days: deal.days, stage: deal.stage });
    setEditingId(deal.id);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.client) return;

    if (editingId) {
      setDeals(deals.map(d => d.id === editingId ? { ...d, ...formData } : d));
    } else {
      const newId = `DEAL-${Date.now()}`;
      setDeals([...deals, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

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
                        <button onClick={(e) => handleDelete(card.id, e)} className="p-1 text-slate-400 hover:text-red-600 rounded bg-white hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-start mb-3">
                        <div className={`text-xs font-bold px-2 py-0.5 rounded border ${stagecol.color} ${stagecol.border}`}>
                          {formatCurrency(card.value)}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug pr-6">{card.title}</h4>
                      <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">{card.client}</p>
                      
                      <div className="flex items-center justify-between mt-auto border-t border-slate-50 pt-3">
                        <div className="flex space-x-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center hover:text-blue-600 transition-colors"><MessageSquare className="w-3.5 h-3.5 mr-1" /> 2</span>
                          <span className="flex items-center hover:text-blue-600 transition-colors"><Paperclip className="w-3.5 h-3.5 mr-1" /> 1</span>
                        </div>
                        <div className="flex items-center text-xs font-medium text-slate-400">
                          <Calendar className={`w-3.5 h-3.5 mr-1 ${card.days > 10 ? 'text-amber-500' : ''}`} />
                          {card.days}d open
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
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deal Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" placeholder="e.g. Enterprise Software License" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Identity</label>
                <input type="text" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" placeholder="Acme Corp" required />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deal Value ($)</label>
                  <input type="number" min="0" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Days Open</label>
                  <input type="number" min="0" value={formData.days} onChange={(e) => setFormData({...formData, days: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pipeline Stage (Moves the card!)</label>
                <select value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none sm:text-sm bg-white font-medium text-blue-700">
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
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

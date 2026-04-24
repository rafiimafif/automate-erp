import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Filter, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api/endpoints';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', category: 'Electronics', unit_price: '', stock_quantity: '', status: 'In Stock' });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await api.products.list();
      setProducts(data);
    } catch (err) {
      setError('Failed to load inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Stock': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Low Stock': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Out of Stock': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.products.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', sku: '', category: 'Electronics', unit_price: '', stock_quantity: '', status: 'In Stock' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setFormData({ 
      name: prod.name, 
      sku: prod.sku, 
      category: prod.category, 
      unit_price: prod.unit_price, 
      stock_quantity: prod.stock_quantity, 
      status: prod.status 
    });
    setEditingId(prod.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return;

    try {
      if (editingId) {
        const updated = await api.products.update(editingId, {
          ...formData,
          unit_price: Number.parseFloat(formData.unit_price),
          stock_quantity: Number.parseInt(formData.stock_quantity)
        });
        setProducts(products.map(p => p.id === editingId ? updated : p));
      } else {
        const created = await api.products.create({
          ...formData,
          unit_price: Number.parseFloat(formData.unit_price),
          stock_quantity: Number.parseInt(formData.stock_quantity)
        });
        setProducts([created, ...products]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to save product.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading Inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-slate-50 p-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <p className="font-medium">{error}</p>
            <button onClick={fetchProducts} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage your products and stock levels.</p>
            </div>
          </div>
          <button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center transition-all shadow-md hover:shadow-lg shadow-blue-500/20 active:scale-[0.98] whitespace-nowrap w-fit"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4 cursor-pointer hover:text-slate-700">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</span>
                        <span className="text-xs font-medium text-slate-400 mt-0.5">{product.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">${product.unit_price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{product.stock_quantity} units</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(product)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                   <tr>
                     <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                       No products found. Add one above!
                     </td>
                   </tr>
                 )}
              </tbody>
            </table>
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
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label htmlFor="prod-name" className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                <input id="prod-name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm" placeholder="e.g. Mechanical Keyboard" required />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="prod-sku" className="block text-sm font-semibold text-slate-700 mb-1.5">SKU</label>
                  <input id="prod-sku" type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm" placeholder="e.g. COMP-MK-03" required />
                </div>
                <div>
                  <label htmlFor="prod-category" className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select id="prod-category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm bg-white">
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Home Goods">Home Goods</option>
                    <option value="Software">Software</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="prod-price" className="block text-sm font-semibold text-slate-700 mb-1.5">Price ($)</label>
                  <input id="prod-price" type="number" step="0.01" value={formData.unit_price} onChange={(e) => setFormData({...formData, unit_price: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm" placeholder="89.50" required />
                </div>
                <div>
                  <label htmlFor="prod-stock" className="block text-sm font-semibold text-slate-700 mb-1.5">Stock</label>
                  <input id="prod-stock" type="number" min="0" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none sm:text-sm" required />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm active:scale-[0.98] transition-all">
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
